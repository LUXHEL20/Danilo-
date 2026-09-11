/**
 * Rekentest voor de doseringen van het Colombo-assortiment.
 *
 * Dit is het stuk van de app waar een fout het duurst is. De verwachte getallen
 * hieronder zijn met de hand uitgerekend uit de Colombo Aquarium Catalogue
 * 2025/2026 en de officiele gebruiksaanwijzingen, niet uit de code overgenomen.
 * Wijzigt er iets aan de catalogus of aan de rekenregels, dan valt dat hier op.
 *
 * Gebruik: node test/dosering-test.mjs
 */
import {
  PRODUCTEN, alleDoseringen, berekenDosis, assortimentControle, VERS_DEEL, ADVIESPLAATSEN,
} from '../js/products.js';

const fouten = [];
const BAK = 200;
const VERS = Math.round(BAK * VERS_DEEL); // 60 liter vers water

const stap = (naam, fn) => {
  try { fn(); console.log('✓', naam); }
  catch (e) { console.log('✗', naam, '→', e.message); fouten.push(`${naam}: ${e.message}`); }
};

const product = (id) => {
  const p = PRODUCTEN.find((x) => x.id === id);
  if (!p) throw new Error(`product ${id} staat niet in de catalogus`);
  return p;
};

function verwacht(id, index, hoeveelheid, eenheid, basis, opties = {}) {
  const p = product(id);
  const r = alleDoseringen(p, opties.liters ?? BAK, opties.delta, opties)[index];
  if (!r) throw new Error(`${p.naam} heeft geen dosering op plaats ${index}`);
  if (r.hoeveelheid !== hoeveelheid) throw new Error(`${p.naam} (${r.label}): verwacht ${hoeveelheid} ${eenheid}, kreeg ${r.hoeveelheid} ${r.eenheid}`);
  if (r.eenheid !== eenheid) throw new Error(`${p.naam}: verwacht eenheid ${eenheid}, kreeg ${r.eenheid}`);
  if (r.basis !== basis) throw new Error(`${p.naam}: verwacht basis ${basis}, kreeg ${r.basis}`);
}

console.log(`Bak van ${BAK} liter, verversing van ${Math.round(VERS_DEEL * 100)} procent is ${VERS} liter vers water.\n`);

/* --- waterbereiding, dosering op vers water ------------------------------- */
stap('Aqua Start: 4 ml per 10 liter VERS water', () => verwacht('aqua-start', 0, 24, 'ml', 'versWater'));
stap('Aqua Start bij een verversing van 100 liter', () => verwacht('aqua-start', 0, 40, 'ml', 'versWater', { versLiters: 100 }));
stap('Aqua Salt: 1 gram per liter VERS water', () => verwacht('aqua-salt', 0, 60, 'g', 'versWater'));
stap('Goldfish Care: 1 gram per liter VERS water', () => verwacht('goldfish-care', 0, 60, 'g', 'versWater'));

/* --- bacterien ------------------------------------------------------------ */
stap('Bacto Start: nieuw aquarium 10 ml per 10 liter', () => verwacht('bacto-start', 0, 200, 'ml', 'bak'));
stap('Bacto Start: bestaand aquarium 5 ml per 10 liter', () => verwacht('bacto-start', 1, 100, 'ml', 'bak'));
stap('Fresh Bacto: opstart 10 ml per 10 liter', () => verwacht('fresh-bacto', 0, 200, 'ml', 'bak'));
stap('Fresh Bacto: onderhoud 5 ml per 10 liter', () => verwacht('fresh-bacto', 1, 100, 'ml', 'bak'));
stap('Fresh PSB: 10 ml per 50 liter (etiket, niet de oude tabel)', () => verwacht('fresh-psb', 0, 40, 'ml', 'bak'));
stap('Bacto Care: 2 ml per 10 liter', () => verwacht('bacto-care', 0, 40, 'ml', 'bak'));
stap('Aqua Care: 1 ml per 5 liter', () => verwacht('aqua-care', 0, 40, 'ml', 'bak'));

/* --- Black Water: eerst op de bak, daarna op vers water ------------------- */
stap('Black Water: bij de start 2,5 ml per 10 liter bakinhoud', () => verwacht('black-water', 0, 50, 'ml', 'bak'));
stap('Black Water: daarna 2,5 ml per 10 liter VERS water', () => verwacht('black-water', 1, 15, 'ml', 'versWater'));

/* --- hardheid en pH, het deltamodel --------------------------------------- */
stap('KH Plus: 1 ml per 5 liter geeft 2 graden, dus 40 ml voor 2 graden', () => verwacht('kh-plus', 0, 40, 'ml', 'bak', { delta: 2 }));
stap('KH Plus: één graad is de halve dosis', () => verwacht('kh-plus', 0, 20, 'ml', 'bak', { delta: 1 }));
stap('GH Plus: 1 ml per 5 liter geeft 2 graden', () => verwacht('gh-plus', 0, 40, 'ml', 'bak', { delta: 2 }));
stap('pH Min: 1 ml per 5 liter geeft 1 eenheid', () => verwacht('ph-min', 0, 40, 'ml', 'bak', { delta: 1 }));
stap('pH Min: een verschuiving van 0,2 is een vijfde van de dosis', () => verwacht('ph-min', 0, 8, 'ml', 'bak', { delta: 0.2 }));

/* --- plantenvoeding ------------------------------------------------------- */
stap('Flora Grow: 1 pompstoot per 5 liter', () => verwacht('flora-grow', 0, 40, 'ml', 'bak'));
stap('Flora Carbo: 1 pompstoot per 50 liter', () => verwacht('flora-carbo', 0, 4, 'ml', 'bak'));
stap('Flora Ferro: 1,25 ml per 25 liter geeft +0,05 mg ijzer', () => verwacht('flora-ferro', 0, 10, 'ml', 'bak', { delta: 0.05 }));
stap('Flora Nitro: 1,25 ml per 25 liter geeft +2,5 mg nitraat', () => verwacht('flora-nitro', 0, 10, 'ml', 'bak', { delta: 2.5 }));
stap('Flora Phospho: 1,25 ml per 25 liter geeft +0,1 mg fosfaat', () => verwacht('flora-phospho', 0, 10, 'ml', 'bak', { delta: 0.1 }));

/* --- algen en behandelingen ----------------------------------------------- */
stap('Algisin: 1 ml per 20 liter', () => verwacht('algisin', 0, 10, 'ml', 'bak'));
stap('Aerocol: 3 ml per 100 liter', () => verwacht('cerpofor-aerocol', 0, 6, 'ml', 'bak'));
stap('Cerpofor: 2 ml per 10 liter', () => verwacht('cerpofor-femsee', 0, 40, 'ml', 'bak'));

/* --- de traptabel van de filterpads --------------------------------------- */
stap('Ammo Stop volgt de tabel van het etiket', () => {
  const p = product('ammo-stop');
  for (const [liters, verwachtAantal] of [[100, 1], [250, 1], [300, 2], [750, 2], [1000, 3]]) {
    const r = berekenDosis(p, liters);
    if (r.hoeveelheid !== verwachtAantal) throw new Error(`${liters} liter geeft ${r.hoeveelheid} pads, verwacht ${verwachtAantal}`);
  }
});
stap('Nitro Stop heeft een ANDERE tabel dan Ammo Stop', () => {
  const p = product('nitro-stop');
  for (const [liters, verwachtAantal] of [[100, 1], [150, 1], [200, 2], [300, 3]]) {
    const r = berekenDosis(p, liters);
    if (r.hoeveelheid !== verwachtAantal) throw new Error(`${liters} liter geeft ${r.hoeveelheid} pads, verwacht ${verwachtAantal}`);
  }
});
stap('boven de tabel stuurt de app naar de winkel in plaats van te gokken', () => {
  const r = berekenDosis(product('nitro-stop'), 2000);
  if (!r.buitenBereik) throw new Error('2000 liter wordt niet als buiten bereik gemeld');
  if (!/winkel/.test(r.tekst)) throw new Error('de tekst verwijst niet naar de winkel: ' + r.tekst);
});

/* --- telbare eenheden ----------------------------------------------------- */
stap('Catappa XL geeft een bereik in hele bladeren', () => {
  const r = berekenDosis(product('catappa-xl'), 200);
  if (r.tekst !== '2 tot 4 bladeren voor 200 liter') throw new Error(r.tekst);
});
stap('één blad blijft enkelvoud', () => {
  const r = berekenDosis(product('catappa-xl'), 40);
  if (!/^1 blad /.test(r.tekst)) throw new Error(r.tekst);
});
stap('bodemtabletten worden NIET over de hele bodem doorgerekend', () => {
  for (const id of ['fe-tabs', 'nutri-caps']) {
    const p = product(id);
    if (p.dosering.model !== 'geen') throw new Error(`${p.naam} rekent toch een getal uit`);
    if (alleDoseringen(p, BAK).length) throw new Error(`${p.naam} geeft een berekende dosis terug`);
    if (!p.dosering.omschrijving) throw new Error(`${p.naam} heeft geen doseringszin voor op het scherm`);
  }
});

/* --- vangnetten over de hele catalogus ------------------------------------ */
stap('elk product heeft een doseringszin en een moment', () => {
  for (const p of PRODUCTEN) {
    if (!p.dosering?.omschrijving) throw new Error(`${p.naam} heeft geen doseringszin`);
    if (!p.dosering?.label) throw new Error(`${p.naam} zegt niet wanneer te doseren`);
  }
});
stap('elk product zegt of het op de bak of op vers water doseert', () => {
  for (const p of PRODUCTEN) {
    for (const d of [p.dosering, ...(p.extraDoseringen || [])]) {
      if (!['bak', 'versWater', 'bodem'].includes(d.basis)) throw new Error(`${p.naam} heeft basis "${d.basis}"`);
    }
  }
});
stap('elk product verwijst naar de Colombo-bron waar de dosering vandaan komt', () => {
  for (const p of PRODUCTEN) {
    if (!p.bron || p.bron.length < 30) throw new Error(`${p.naam} heeft geen bronvermelding`);
    if (!/Catalogus|Gebruiksaanwijzing/i.test(p.bron)) throw new Error(`${p.naam} verwijst niet naar catalogus of gebruiksaanwijzing`);
  }
});
stap('elk product dat op een parameter werkt, heeft een richting', () => {
  for (const p of PRODUCTEN) {
    if (!(p.lost_op || []).length) continue;
    if (!['omhoog', 'omlaag', 'neutraliseert'].includes(p.richting)) throw new Error(`${p.naam} heeft richting "${p.richting}"`);
  }
});
stap('geen enkel product staat twee keer in de catalogus', () => {
  const ids = PRODUCTEN.map((p) => p.id);
  const dubbel = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dubbel.length) throw new Error('dubbele id: ' + dubbel.join(', '));
});
stap('behandelingen waarschuwen dat er eerst een diagnose nodig is', () => {
  for (const p of PRODUCTEN.filter((x) => x.id.startsWith('cerpofor-') && x.categorie === 'zorg')) {
    if (!(p.waarschuwingen || []).some((w) => /diagnose|vast/i.test(w))) {
      throw new Error(`${p.naam} waarschuwt niet dat een diagnose nodig is`);
    }
  }
});

const leeg = assortimentControle().filter((r) => !r.producten.length);
console.log(`\n${PRODUCTEN.length} producten in de catalogus.`);
console.log(`${leeg.length} van de ${ADVIESPLAATSEN.length} adviesmomenten hebben geen product:`);
for (const r of leeg) console.log(`  - ${r.label}`);

console.log('\n--- fouten ---');
console.log(fouten.length ? fouten.join('\n') : 'geen');
process.exit(fouten.length ? 1 : 0);
