/** Kweekdossier: koppels, legsels en het eigen aanbod van de kweker. */
import {
  h, kaart, badge, veld, invoer, tekstvak, keuze, melding, dialoog, bevestig,
  kortDatum, datum, geleden, legeStaat,
} from '../ui.js';
import { ctx, ganaar, teken } from '../app.js';
import * as store from '../store.js';
import * as kw from '../kweek.js';
import { KWEEKSOORTEN, KWEEKGROEPEN, kweeksoort, nestOordeel } from '../kweeksoorten.js';
import { kiesFoto, deel } from '../native.js';
import { comprimeer, thumbnail } from '../strip.js';
import { mailLink, whatsappLink } from '../delen.js';

export async function toonKweek(arg) {
  return arg ? koppelScherm(arg) : overzichtScherm();
}

/* ------------------------------------------------------------------ overzicht */

async function overzichtScherm() {
  const wrap = h('div', {});
  const lijst = await kw.koppels();
  const aandacht = await kw.watVraagtAandacht();

  if (aandacht.length) {
    wrap.append(kaart(h('span', {}, 'Vraagt nu aandacht ', badge(String(aandacht.length), 'let-op')),
      ...aandacht.map(({ legsel, koppel, tekst }) => h('button', {
        class: 'klikbaar', onclick: () => ganaar(`kweek/${koppel.id}`),
      },
        h('span', {}, '⏰'),
        h('span', { class: 'groei' },
          h('strong', {}, kw.koppelNaam(koppel)), h('br'),
          h('span', { class: 'klein zacht' }, tekst)),
        h('span', { class: 'pijl' }, '›')))));
  }

  if (!lijst.length) {
    wrap.append(legeStaat('🐣', 'Nog geen kweekkoppels',
      'Leg een koppel aan en houd elk legsel bij: datums, aantallen en hoeveel er opgroeien. ' +
      'De app rekent zelf uit wanneer de eieren horen uit te komen en wanneer de jongen vrij zwemmen.',
      h('button', { class: 'knop knop--primair', onclick: () => koppelFormulier() }, 'Koppel toevoegen')));
    wrap.append(await aanbodBlok());
    return wrap;
  }

  const blok = kaart(h('span', {}, 'Mijn koppels ', badge(String(lijst.length))));
  for (const k of lijst) {
    const hunLegsels = await kw.legselsVanKoppel(k.id);
    const lopend = hunLegsels.find((l) => !['afgerond', 'mislukt'].includes(l.status));
    const c = kw.koppelCijfers(hunLegsels);
    const s = kweeksoort(k.soortId);
    blok.append(h('button', { class: 'klikbaar', onclick: () => ganaar(`kweek/${k.id}`) },
      h('span', { style: { fontSize: '22px' } }, s?.wijze === 'garnaal' ? '🦐' : '🐠'),
      h('span', { class: 'groei' },
        h('strong', {}, kw.koppelNaam(k)),
        lopend ? badge(kw.stadium(lopend.status).label, 'info') : null,
        h('br'),
        h('span', { class: 'klein zacht' },
          c.legsels
            ? `${c.legsels} ${c.legsels === 1 ? 'legsel' : 'legsels'}, ${c.jongen} jongen opgegroeid` +
              (c.overleving != null ? `, ${c.overleving}% overleving` : '')
            : 'Nog geen legsels genoteerd')),
      h('span', { class: 'pijl' }, '›')));
  }
  blok.append(h('button', {
    class: 'knop knop--stil knop--vol', style: { marginTop: '10px' },
    onclick: () => koppelFormulier(),
  }, '+ Koppel toevoegen'));
  wrap.append(blok);

  wrap.append(await aanbodBlok());
  return wrap;
}

/* -------------------------------------------------------------------- koppel */

async function koppelScherm(id) {
  const k = await kw.koppel(id);
  if (!k) { ganaar('kweek'); return h('div', {}); }

  const wrap = h('div', {});
  const s = kweeksoort(k.soortId);
  const hunLegsels = await kw.legselsVanKoppel(k.id);
  const c = kw.koppelCijfers(hunLegsels);
  const bak = k.bakId ? await store.bak(k.bakId) : null;

  wrap.append(h('button', { class: 'knop knop--stil', style: { marginBottom: '12px' }, onclick: () => ganaar('kweek') }, '‹ Alle koppels'));

  /* --- kop --- */
  wrap.append(kaart(null,
    h('div', { class: 'rij' },
      h('span', { style: { fontSize: '34px' } }, s?.wijze === 'garnaal' ? '🦐' : '🐠'),
      h('div', { class: 'groei' },
        h('h2', { style: { margin: '0 0 2px' } }, kw.koppelNaam(k)),
        h('p', { class: 'klein zacht', style: { margin: 0 } },
          [s?.latijn, bak ? `${bak.naam || 'bak'} · ${bak.liters || '?'} liter` : null,
            k.aantalMan || k.aantalVrouw ? `${k.aantalMan || 0} man, ${k.aantalVrouw || 0} vrouw` : null]
            .filter(Boolean).join(' · ')))),
    k.herkomst ? h('p', { class: 'klein zacht' }, `Herkomst: ${k.herkomst}`) : null,
    k.notitie ? h('p', { class: 'klein' }, k.notitie) : null,
    h('div', { class: 'knoprij' },
      h('button', { class: 'knop knop--stil', onclick: () => koppelFormulier(k) }, '✎ Aanpassen'),
      h('button', {
        class: 'knop knop--gevaar', onclick: async () => {
          if (!(await bevestig('Koppel verwijderen', 'De legsels en het aanbod van dit koppel verdwijnen mee. Dit kan niet ongedaan gemaakt worden.', 'Verwijderen'))) return;
          await kw.verwijderKoppel(k.id);
          melding('Koppel verwijderd.', 'ok');
          ganaar('kweek'); teken();
        },
      }, 'Verwijderen'))));

  /* --- cijfers --- */
  if (c.legsels) {
    wrap.append(kaart('Cijfers van dit koppel',
      h('div', { class: 'kweekcijfers' },
        cijfer(String(c.legsels), c.legsels === 1 ? 'legsel' : 'legsels'),
        cijfer(String(c.jongen), 'jongen groot'),
        cijfer(c.overleving != null ? `${c.overleving}%` : '–', 'overleving'),
        cijfer(c.tussentijd != null ? `${c.tussentijd}` : '–', c.tussentijd != null ? 'dagen ertussen' : 'te weinig gegevens'))));
  }

  /* --- wat de soort vraagt --- */
  if (s) {
    wrap.append(kaart(`Wat ${s.naam.toLowerCase()} vraagt`,
      h('ul', { class: 'opsomming klein' },
        h('li', {}, `Kweektemperatuur ${s.temp[0]} tot ${s.temp[1]} graden.`),
        s.wijze === 'eierleggend'
          ? h('li', {}, `Eieren komen uit na ongeveer ${s.uitkomstdagen} dagen, de jongen zwemmen ${s.uitzwemdagen} dagen later vrij.`)
          : h('li', {}, `Draagtijd ongeveer ${s.draagdagen} dagen.`),
        h('li', {}, `Gebruikelijk aantal: ${s.nest[0]} tot ${s.nest[1]}.`),
        h('li', {}, `Eerste voer: ${s.eerstevoer}`)),
      h('p', { class: 'klein' }, s.tip),
      h('p', { class: 'mini zacht' },
        'Richtwaarden uit de aquariumliteratuur. Temperatuur, hardheid en de conditie van de ouderdieren ' +
        'verschuiven ze makkelijk. Uw eigen cijfers hierboven wegen zwaarder.')));
  }

  /* --- legsels --- */
  const legselBlok = kaart(h('span', {}, s?.wijze === 'levendbarend' || s?.wijze === 'garnaal' ? 'Drachten' : 'Legsels ',
    hunLegsels.length ? badge(String(hunLegsels.length)) : null));
  if (!hunLegsels.length) {
    legselBlok.append(h('p', { class: 'klein zacht' }, 'Nog niets genoteerd. Noteer de dag waarop u de eieren of de dracht zag: de app rekent de rest voor u uit.'));
  }
  for (const l of hunLegsels) legselBlok.append(legselRegel(l, k));
  legselBlok.append(h('button', {
    class: 'knop knop--primair knop--vol', style: { marginTop: '10px' },
    onclick: () => legselFormulier(k),
  }, s?.wijze === 'levendbarend' || s?.wijze === 'garnaal' ? '+ Dracht noteren' : '+ Legsel noteren'));
  wrap.append(legselBlok);

  /* --- aanbod van dit koppel --- */
  wrap.append(await aanbodBlok(k));
  return wrap;
}

const cijfer = (waarde, label) => h('div', { class: 'kweekcijfer' },
  h('strong', {}, waarde), h('span', {}, label));

function legselRegel(l, k) {
  const st = kw.stadium(l.status);
  const v = kw.verwachting(l, k);
  const overlevingPct = kw.overleving(l);

  const regels = [];
  if (l.aantalEieren) regels.push(`${l.aantalEieren} eieren`);
  if (l.aantalLarven) regels.push(`${l.aantalLarven} uitgekomen`);
  if (l.aantalOpgegroeid) regels.push(`${l.aantalOpgegroeid} groot`);
  if (overlevingPct != null) regels.push(`${overlevingPct}% overleving`);

  const verwacht = [];
  if (v?.uitkomen && l.status === 'eieren') {
    verwacht.push(v.uitkomen.dagen > 0
      ? `Uitkomen verwacht over ${v.uitkomen.dagen} ${v.uitkomen.dagen === 1 ? 'dag' : 'dagen'}, rond ${kortDatum(v.uitkomen.ts)}.`
      : `Uitkomen werd verwacht rond ${kortDatum(v.uitkomen.ts)}.`);
  }
  if (v?.vrijzwemmen && l.status === 'larven') {
    verwacht.push(v.vrijzwemmen.dagen > 0
      ? `Vrij zwemmen verwacht over ${v.vrijzwemmen.dagen} ${v.vrijzwemmen.dagen === 1 ? 'dag' : 'dagen'}.`
      : 'De jongen zouden nu vrij moeten zwemmen. Tijd voor het eerste voer.');
  }
  if (v?.werpen && !['opgroei', 'afgerond', 'mislukt'].includes(l.status)) {
    verwacht.push(v.werpen.dagen > 0
      ? `Werpen verwacht rond ${kortDatum(v.werpen.ts)}, over ${v.werpen.dagen} dagen.`
      : `Werpen werd verwacht rond ${kortDatum(v.werpen.ts)}.`);
  }

  return h('button', { class: 'klikbaar', onclick: () => legselFormulier(k, l) },
    h('span', { style: { fontSize: '20px' } }, st.icoon),
    h('span', { class: 'groei' },
      h('strong', {}, kortDatum(l.datum)), ' ', badge(st.label, l.status === 'mislukt' ? 'kritiek' : l.status === 'afgerond' ? 'goed' : 'info'),
      regels.length ? h('span', {}, h('br'), h('span', { class: 'klein zacht' }, regels.join(' · '))) : null,
      verwacht.length ? h('span', {}, h('br'), h('span', { class: 'mini zacht' }, verwacht.join(' '))) : null),
    h('span', { class: 'pijl' }, '›'));
}

/* ---------------------------------------------------------------- formulieren */

async function koppelFormulier(bestaand = null) {
  const bakken = await store.bakken();
  const naam = invoer({ value: bestaand?.naam || '', placeholder: 'Bijvoorbeeld: koppel rood, bak 3' });
  const soort = keuze([
    { value: '', label: 'Kies een soort' },
    ...KWEEKGROEPEN.flatMap((g) => KWEEKSOORTEN.filter((s) => s.wijze === g.id)
      .map((s) => ({ value: s.id, label: `${g.label}: ${s.naam}`, selected: bestaand?.soortId === s.id }))),
    { value: 'anders', label: 'Andere soort', selected: bestaand && !bestaand.soortId },
  ]);
  const eigenSoort = invoer({ value: bestaand?.eigenSoort || '', placeholder: 'Naam van de soort' });
  const eigenVeld = veld('Welke soort?', eigenSoort, 'De app rekent dan geen datums voor u uit, u vult ze zelf in.');
  eigenVeld.hidden = !(bestaand && !bestaand.soortId);
  soort.onchange = () => { eigenVeld.hidden = soort.value !== 'anders'; };

  const bak = keuze([
    { value: '', label: 'Geen bak gekozen' },
    ...bakken.map((b) => ({ value: b.id, label: `${b.naam || 'Bak'} · ${b.liters || '?'} liter`, selected: bestaand?.bakId === b.id })),
  ]);
  const man = invoer({ type: 'number', min: '0', max: '99', value: String(bestaand?.aantalMan ?? 1) });
  const vrouw = invoer({ type: 'number', min: '0', max: '99', value: String(bestaand?.aantalVrouw ?? 1) });
  const herkomst = invoer({ value: bestaand?.herkomst || '', placeholder: 'Bijvoorbeeld: eigen kweek, of gekocht bij LUX AQUA' });
  const notitie = tekstvak({ value: bestaand?.notitie || '', placeholder: 'Kleurslag, stamboom, bijzonderheden' });

  await dialoog({
    titel: bestaand ? 'Koppel aanpassen' : 'Koppel toevoegen',
    breed: true,
    inhoud: h('div', {},
      veld('Naam van het koppel', naam, 'Vrij te kiezen. Handig als u meerdere koppels van dezelfde soort hebt.'),
      veld('Soort', soort),
      eigenVeld,
      veld('In welke bak?', bak),
      h('div', { class: 'rij', style: { gap: '10px' } },
        h('div', { class: 'groei' }, veld('Mannetjes', man)),
        h('div', { class: 'groei' }, veld('Vrouwtjes', vrouw))),
      veld('Herkomst', herkomst),
      veld('Notitie', notitie)),
    acties: [
      { label: 'Annuleren', waarde: null },
      {
        label: 'Bewaren', stijl: 'knop--primair',
        actie: async () => {
          await kw.bewaarKoppel({
            id: bestaand?.id,
            naam: naam.value.trim(),
            soortId: soort.value === 'anders' || !soort.value ? '' : soort.value,
            eigenSoort: soort.value === 'anders' ? eigenSoort.value.trim() : '',
            bakId: bak.value || null,
            aantalMan: Number(man.value) || 0,
            aantalVrouw: Number(vrouw.value) || 0,
            herkomst: herkomst.value.trim(),
            notitie: notitie.value.trim(),
          });
          melding(bestaand ? 'Koppel aangepast.' : 'Koppel toegevoegd.', 'ok');
          teken();
          return true;
        },
      },
    ],
  });
}

const alsDatumWaarde = (ts) => new Date(ts || Date.now()).toISOString().slice(0, 10);

async function legselFormulier(k, bestaand = null) {
  const s = kweeksoort(k.soortId);
  const levend = s?.wijze === 'levendbarend' || s?.wijze === 'garnaal';

  const datumveld = invoer({ type: 'date', value: alsDatumWaarde(bestaand?.datum) });
  const status = keuze(kw.STADIA.map((st) => ({
    value: st.id, label: `${st.icoon} ${st.label}`,
    selected: (bestaand?.status || (levend ? 'verwacht' : 'eieren')) === st.id,
  })));
  const eieren = invoer({ type: 'number', min: '0', max: '200000', value: bestaand?.aantalEieren ? String(bestaand.aantalEieren) : '' });
  const larven = invoer({ type: 'number', min: '0', max: '200000', value: bestaand?.aantalLarven ? String(bestaand.aantalLarven) : '' });
  const groot = invoer({ type: 'number', min: '0', max: '200000', value: bestaand?.aantalOpgegroeid ? String(bestaand.aantalOpgegroeid) : '' });
  const notitie = tekstvak({ value: bestaand?.notitie || '', placeholder: 'Wat viel op? Temperatuur, voer, wat er misging' });
  const oordeel = h('p', { class: 'mini zacht', style: { minHeight: '1.2em' } }, '');

  const toonOordeel = () => {
    const n = Number(eieren.value) || Number(larven.value);
    const o = nestOordeel(k.soortId, n);
    oordeel.textContent = o ? o.tekst : '';
    oordeel.style.color = o?.soort === 'gewoon' ? '' : 'var(--letop)';
  };
  eieren.oninput = toonOordeel; larven.oninput = toonOordeel;
  toonOordeel();

  const acties = [
    { label: 'Annuleren', waarde: null },
    {
      label: 'Bewaren', stijl: 'knop--primair',
      actie: async () => {
        const gekozen = new Date(`${datumveld.value}T12:00:00`).getTime();
        if (!Number.isFinite(gekozen)) { melding('Vul een geldige datum in.', 'fout'); return false; }
        await kw.bewaarLegsel({
          id: bestaand?.id,
          koppelId: k.id,
          datum: gekozen,
          status: status.value,
          aantalEieren: Number(eieren.value) || null,
          aantalLarven: Number(larven.value) || null,
          aantalOpgegroeid: Number(groot.value) || null,
          notitie: notitie.value.trim(),
        });
        melding('Bewaard.', 'ok');
        teken();
        return true;
      },
    },
  ];
  if (bestaand) {
    acties.splice(1, 0, {
      label: 'Verwijderen', stijl: 'knop--gevaar',
      actie: async () => {
        if (!(await bevestig('Legsel verwijderen', 'Dit legsel verdwijnt uit uw dossier.', 'Verwijderen'))) return false;
        await kw.verwijderLegsel(bestaand.id);
        melding('Verwijderd.', 'ok');
        teken();
        return true;
      },
    });
  }

  await dialoog({
    titel: bestaand ? 'Legsel aanpassen' : (levend ? 'Dracht noteren' : 'Legsel noteren'),
    breed: true,
    inhoud: h('div', {},
      veld(levend ? 'Datum waarop u de dracht zag' : 'Datum van afzetten', datumveld,
        s ? 'De app rekent hieruit de verwachte datums uit.' : 'Voor deze soort rekent de app niets voor u uit.'),
      veld('Stadium', status),
      levend ? null : veld('Aantal eieren', eieren, 'Een schatting volstaat.'),
      veld(levend ? 'Aantal jongen geboren' : 'Aantal uitgekomen', larven),
      oordeel,
      veld('Aantal opgegroeid', groot, 'Vul dit pas in wanneer de jongen door zijn.'),
      veld('Notitie', notitie)),
    acties,
  });
}

/* -------------------------------------------------------------------- aanbod */

async function aanbodBlok(k = null) {
  const alle = k ? await kw.aanbodVanKoppel(k.id) : await kw.alleAanbod();
  const blok = kaart('Te koop uit eigen kweek');

  blok.append(h('p', { class: 'klein zacht' },
    'Hebt u jongvis over, maak er een aanbod van met foto\'s en stuur het naar LUX AQUA. ' +
    'Wij zien meteen wat u hebt, in welk aantal en hoe groot.'));

  if (!alle.length) {
    blok.append(h('p', { class: 'mini zacht' }, 'Nog geen aanbod klaargezet.'));
  }
  for (const a of alle.sort((x, y) => y.aangemaakt - x.aangemaakt)) {
    const s = kweeksoort(a.soortId);
    blok.append(h('button', { class: 'klikbaar', onclick: () => aanbodFormulier(a.koppelId ? { id: a.koppelId } : null, a) },
      h('span', { style: { fontSize: '20px' } }, '📸'),
      h('span', { class: 'groei' },
        h('strong', {}, `${a.aantal || '?'} × ${a.eigenSoort || s?.naam || 'onbekende soort'}`),
        a.verstuurd ? badge('Verstuurd', 'goed') : badge('Klaar', 'info'),
        h('br'),
        h('span', { class: 'klein zacht' },
          [a.grootte, a.prijs, `${(a.fotos || []).length} foto's`].filter(Boolean).join(' · '))),
      h('span', { class: 'pijl' }, '›')));
  }

  blok.append(h('button', {
    class: 'knop knop--stil knop--vol', style: { marginTop: '10px' },
    onclick: () => aanbodFormulier(k),
  }, '+ Aanbod klaarzetten'));
  return blok;
}

async function aanbodFormulier(k = null, bestaand = null) {
  const koppelRec = bestaand?.koppelId ? await kw.koppel(bestaand.koppelId) : k;
  const fotos = [...(bestaand?.fotos || [])];

  const soort = keuze([
    { value: '', label: 'Kies een soort' },
    ...KWEEKSOORTEN.map((s) => ({
      value: s.id, label: s.naam,
      selected: (bestaand?.soortId || koppelRec?.soortId) === s.id,
    })),
    { value: 'anders', label: 'Andere soort', selected: !!bestaand && !bestaand.soortId },
  ]);
  const eigenSoort = invoer({ value: bestaand?.eigenSoort || koppelRec?.eigenSoort || '', placeholder: 'Naam van de soort' });
  const eigenVeld = veld('Welke soort?', eigenSoort);
  eigenVeld.hidden = soort.value !== 'anders';
  soort.onchange = () => { eigenVeld.hidden = soort.value !== 'anders'; };

  const aantal = invoer({ type: 'number', min: '1', max: '100000', value: bestaand?.aantal ? String(bestaand.aantal) : '' });
  const grootte = invoer({ value: bestaand?.grootte || '', placeholder: 'Bijvoorbeeld: 2 tot 3 cm' });
  const leeftijd = invoer({ value: bestaand?.leeftijd || '', placeholder: 'Bijvoorbeeld: 10 weken' });
  const prijs = invoer({ value: bestaand?.prijs || '', placeholder: 'Bijvoorbeeld: € 2 per stuk, of in overleg' });
  const notitie = tekstvak({ value: bestaand?.notitie || '', placeholder: 'Kleurslag, ouderdieren, bijzonderheden' });

  const raster = h('div', { class: 'fotoraster' });
  const tekenFotos = async () => {
    raster.replaceChildren();
    for (const id of fotos) {
      const f = await store.foto(id);
      if (!f) continue;
      raster.append(h('div', { class: 'fotokaart' },
        h('img', { src: f.thumb, alt: 'Foto van uw kweek', loading: 'lazy' }),
        h('button', {
          class: 'fotokaart__weg', type: 'button', 'aria-label': 'Foto verwijderen',
          onclick: async () => {
            fotos.splice(fotos.indexOf(id), 1);
            await store.verwijderFoto(id);
            tekenFotos();
          },
        }, '✕')));
    }
    if (!fotos.length) raster.append(h('p', { class: 'mini zacht' }, 'Nog geen foto\'s. Eén scherpe foto van de zijkant zegt meer dan vijf onscherpe.'));
  };
  await tekenFotos();

  const fotoKnop = h('button', {
    class: 'knop knop--stil knop--vol', type: 'button',
    onclick: async () => {
      const bestanden = await kiesFoto({ bron: 'vraag', meerdere: true });
      if (!bestanden?.length) return;
      for (const b of bestanden) {
        const blob = await comprimeer(b, 1400, 0.82);
        const thumb = await thumbnail(b, 420);
        const rec = await store.bewaarFoto({
          bakId: koppelRec?.bakId || null, blob, thumb, soort: 'kweek',
          notitie: 'Aanbod eigen kweek',
        });
        fotos.push(rec.id);
      }
      await tekenFotos();
    },
  }, '📷 Foto\'s toevoegen');

  const bewaren = async () => kw.bewaarAanbod({
    id: bestaand?.id,
    koppelId: koppelRec?.id || null,
    soortId: soort.value === 'anders' || !soort.value ? '' : soort.value,
    eigenSoort: soort.value === 'anders' ? eigenSoort.value.trim() : '',
    aantal: Number(aantal.value) || null,
    grootte: grootte.value.trim(),
    leeftijd: leeftijd.value.trim(),
    prijs: prijs.value.trim(),
    notitie: notitie.value.trim(),
    fotos,
    verstuurd: bestaand?.verstuurd || null,
  });

  const acties = [
    { label: 'Sluiten', waarde: null },
    {
      label: 'Bewaren',
      actie: async () => { await bewaren(); melding('Aanbod bewaard.', 'ok'); teken(); return true; },
    },
    {
      label: '📤 Naar LUX AQUA', stijl: 'knop--primair',
      actie: async () => {
        const rec = await bewaren();
        await verstuurAanbod(rec);
        teken();
        return true;
      },
    },
  ];
  if (bestaand) {
    acties.splice(1, 0, {
      label: 'Verwijderen', stijl: 'knop--gevaar',
      actie: async () => {
        if (!(await bevestig('Aanbod verwijderen', 'Het aanbod en de foto\'s erbij verdwijnen.', 'Verwijderen'))) return false;
        for (const id of bestaand.fotos || []) await store.verwijderFoto(id);
        await kw.verwijderAanbod(bestaand.id);
        melding('Verwijderd.', 'ok'); teken(); return true;
      },
    });
  }

  await dialoog({
    titel: bestaand ? 'Aanbod aanpassen' : 'Aanbod klaarzetten',
    breed: true,
    inhoud: h('div', {},
      veld('Soort', soort),
      eigenVeld,
      veld('Aantal', aantal),
      veld('Grootte', grootte),
      veld('Leeftijd', leeftijd),
      veld('Gevraagde prijs', prijs, 'Laat leeg als u dit liever bespreekt.'),
      veld('Notitie', notitie),
      h('h4', { style: { margin: '14px 0 6px' } }, 'Foto\'s'),
      raster,
      fotoKnop),
    acties,
  });
}

/**
 * Stuurt het aanbod door.
 *
 * Eerst het deelvenster van het toestel: dat is de enige weg waarlangs de foto's
 * mee kunnen. De kweker kiest daar WhatsApp, Messenger of e-mail, wat hij wil.
 * Lukt dat niet, dan blijven WhatsApp en e-mail over met enkel de tekst, en dan
 * zegt het scherm er uitdrukkelijk bij dat de foto's niet mee zijn. Anders denkt
 * de kweker dat wij ze gekregen hebben.
 */
async function verstuurAanbod(a) {
  const tekst = await kw.aanbodAlsTekst(a, ctx.klant);
  const bestanden = (await kw.aanbodFotos(a))
    .map((f) => new File([f.blob], f.naam, { type: f.blob.type || 'image/jpeg' }));

  const uitkomst = await deel({ titel: 'Aanbod eigen kweek', tekst, bestanden });
  if (uitkomst === 'gedeeld') {
    await kw.markeerVerstuurd(a.id);
    melding('Aanbod doorgestuurd. Wij nemen contact met u op.', 'ok');
    return;
  }
  if (uitkomst === 'geannuleerd') return;

  const bedrijf = ctx.instellingen?.bedrijf || {};
  const adres = bedrijf.email || 'info@luxhelchteren.be';
  const gsm = bedrijf.whatsapp || '';
  const afsluiten = () => {
    kw.markeerVerstuurd(a.id);
    document.querySelector('.overlay')?.remove();
    document.body.classList.remove('geen-scroll');
    teken();
  };

  await dialoog({
    titel: 'Doorsturen',
    inhoud: h('div', {},
      h('p', { class: 'klein zacht' },
        'Dit toestel opent geen deelvenster. U kan het aanbod versturen via WhatsApp of e-mail.'),
      h('p', { class: 'klein', style: { color: 'var(--letop)' } },
        bestanden.length
          ? `Let op: uw ${bestanden.length} ${bestanden.length === 1 ? 'foto gaat' : 'foto\'s gaan'} zo niet mee. ` +
            'Stuur ze er achteraf zelf bij in hetzelfde gesprek, dan hebben wij alles samen.'
          : 'U hebt nog geen foto\'s toegevoegd.'),
      h('a', {
        class: 'knop knop--primair knop--vol', style: { marginBottom: '8px' },
        href: whatsappLink(tekst, gsm), target: '_blank', rel: 'noopener',
        onclick: afsluiten,
      }, gsm ? '💬 Via WhatsApp' : '💬 Via WhatsApp (kies ons nummer)'),
      h('a', {
        class: 'knop knop--stil knop--vol', href: mailLink(tekst, adres, 'Aanbod eigen kweek'),
        onclick: afsluiten,
      }, `✉️ E-mail naar ${adres}`)),
    acties: [{ label: 'Sluiten', waarde: null }],
  });
}
