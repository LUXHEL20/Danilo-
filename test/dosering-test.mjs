/**
 * Rekentest voor de doseringen.
 *
 * Dit is het stuk van de app waar een fout het duurst is: een verkeerde
 * milliliter bij nitriet kost vissen. De verwachte getallen hieronder zijn met
 * de hand uitgerekend uit de doseringstabel van LUX AQUA, niet uit de code
 * overgenomen. Wijzigt er iets aan de catalogus of aan de rekenregels, dan valt
 * dat hier meteen op.
 *
 * Gebruik: node test/dosering-test.mjs
 */
import { PRODUCTEN, alleDoseringen, berekenDosis, assortimentControle, VERS_DEEL } from '../js/products.js';

const fouten = [];
const BAK = 200;                       // liter bakinhoud
const VERS = Math.round(BAK * VERS_DEEL); // 60 liter vers water bij 30 procent

const stap = (naam, fn) => {
  try { fn(); console.log('✓', naam); }
  catch (e) { console.log('✗', naam, '→', e.message); fouten.push(`${naam}: ${e.message}`); }
};

const product = (id) => {
  const p = PRODUCTEN.find((x) => x.id === id);
  if (!p) throw new Error(`product ${id} staat niet in de catalogus`);
  return p;
};

/** Controleert één dosering van een product tegen een met de hand berekende waarde. */
function verwacht(id, index, hoeveelheid, eenheid, basis, opties = {}) {
  const p = product(id);
  const rijen = alleDoseringen(p, BAK, opties.delta, opties);
  const r = rijen[index];
  if (!r) throw new Error(`${p.naam} heeft geen dosering op plaats ${index}`);
  if (r.hoeveelheid !== hoeveelheid) {
    throw new Error(`${p.naam} (${r.label}): verwacht ${hoeveelheid} ${eenheid}, kreeg ${r.hoeveelheid} ${r.eenheid}`);
  }
  if (r.eenheid !== eenheid) throw new Error(`${p.naam}: verwacht eenheid ${eenheid}, kreeg ${r.eenheid}`);
  if (r.basis !== basis) throw new Error(`${p.naam}: verwacht basis ${basis}, kreeg ${r.basis}`);
  const verwachteLiters = basis === 'versWater' ? (opties.versLiters ?? VERS) : BAK;
  if (r.liters !== verwachteLiters) {
    throw new Error(`${p.naam}: rekent op ${r.liters} liter, verwacht ${verwachteLiters}`);
  }
}

console.log(`Bak van ${BAK} liter, verversing van ${Math.round(VERS_DEEL * 100)} procent is ${VERS} liter vers water.\n`);

/* --- waterbereiding ------------------------------------------------------- */

stap('Aqua Start: 4 ml per 10 liter VERS water', () => {
  verwacht('aqua-start', 0, 24, 'ml', 'versWater');   // 4 / 10 * 60 = 24
});

stap('Aqua Start bij een verversing van 100 liter', () => {
  verwacht('aqua-start', 0, 40, 'ml', 'versWater', { versLiters: 100 }); // 4 / 10 * 100 = 40
});

stap('Fresh Bacto: opstart 10 ml per 10 liter bakinhoud', () => {
  verwacht('fresh-bacto', 0, 200, 'ml', 'bak');       // 10 / 10 * 200 = 200
});

stap('Fresh Bacto: onderhoud 5 ml per 10 liter vers water', () => {
  verwacht('fresh-bacto', 1, 30, 'ml', 'versWater');  // 5 / 10 * 60 = 30
});

stap('Bacto Start: nieuwe bak 10 ml per 10 liter', () => {
  verwacht('bacto-start', 0, 200, 'ml', 'bak');
});

stap('Bacto Start: na filterschoonmaak 5 ml per 10 liter', () => {
  verwacht('bacto-start', 1, 100, 'ml', 'bak');       // 5 / 10 * 200 = 100
});

stap('Bacto Care: 2 ml per 10 liter', () => {
  verwacht('bacto-care', 0, 40, 'ml', 'bak');         // 2 / 10 * 200 = 40
});

stap('ProbiPlus K.P.: 1 ml per 100 liter', () => {
  verwacht('probiplus-kp', 0, 2, 'ml', 'bak');        // 1 / 100 * 200 = 2
});

stap('Aqua Care: 1 ml per 5 liter', () => {
  verwacht('aqua-care', 0, 40, 'ml', 'bak');          // 1 / 5 * 200 = 40
});

stap('Aqua Salt: 1 gram per liter VERS water', () => {
  verwacht('aqua-salt', 0, 60, 'g', 'versWater');     // 1 * 60 = 60
});

stap('Black Water: 2,5 ml per 10 liter', () => {
  verwacht('black-water', 0, 50, 'ml', 'bak');        // 2,5 / 10 * 200 = 50
});

stap('Catappa XL: 1 blad per 50 liter', () => {
  verwacht('catappa-xl', 0, 4, 'blad', 'bak');        // 200 / 50 = 4
});

stap('Fresh PSB: 1 ml per liter', () => {
  verwacht('fresh-psb', 0, 200, 'ml', 'bak');
});

/* --- het deltamodel ------------------------------------------------------- */

stap('GH+: 1 ml per 5 liter geeft 2 graden, dus 40 ml voor 2 graden in 200 liter', () => {
  verwacht('gh-plus', 0, 40, 'ml', 'bak', { delta: 2 });
});

stap('GH+: de helft van de verschuiving is de helft van de dosis', () => {
  verwacht('gh-plus', 0, 20, 'ml', 'bak', { delta: 1 }); // 1 graad, dus 20 ml
});

stap('GH+: een dubbele verschuiving is een dubbele dosis', () => {
  verwacht('gh-plus', 0, 80, 'ml', 'bak', { delta: 4 });
});

/* --- vangnetten ----------------------------------------------------------- */

stap('zonder liters wordt er niets berekend', () => {
  if (berekenDosis(product('aqua-start'), 0) !== null) throw new Error('er komt toch een getal uit');
});

stap('elk product heeft een leesbare doseringszin', () => {
  for (const p of PRODUCTEN) {
    if (!p.dosering?.omschrijving) throw new Error(`${p.naam} heeft geen doseringszin`);
    if (!p.dosering?.label) throw new Error(`${p.naam} zegt niet wanneer te doseren`);
  }
});

stap('elk product zegt of het op de bak of op vers water doseert', () => {
  for (const p of PRODUCTEN) {
    for (const d of [p.dosering, ...(p.extraDoseringen || [])]) {
      if (!['bak', 'versWater'].includes(d.basis)) {
        throw new Error(`${p.naam} heeft basis "${d.basis}", en dan raadt de app het`);
      }
    }
  }
});

stap('elk product dat op een parameter werkt, heeft een richting', () => {
  for (const p of PRODUCTEN) {
    if (!(p.lost_op || []).length) continue;
    if (!['omhoog', 'omlaag', 'neutraliseert'].includes(p.richting)) {
      throw new Error(`${p.naam} werkt op ${p.lost_op.join(', ')} maar heeft richting "${p.richting}"`);
    }
  }
});

stap('geen enkel product staat twee keer in de catalogus', () => {
  const ids = PRODUCTEN.map((p) => p.id);
  const dubbel = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dubbel.length) throw new Error('dubbele id: ' + dubbel.join(', '));
});

/* --- wat er nog ontbreekt ------------------------------------------------- */

const leeg = assortimentControle().filter((r) => !r.producten.length);
console.log(`\n${PRODUCTEN.length} producten in de catalogus.`);
console.log(`${leeg.length} van de 13 adviesmomenten hebben nog geen product:`);
for (const r of leeg) console.log(`  - ${r.label}`);

console.log('\n--- fouten ---');
console.log(fouten.length ? fouten.join('\n') : 'geen');
process.exit(fouten.length ? 1 : 0);
