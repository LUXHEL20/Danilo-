/** Beheerdersschermen voor Lux Aqua: klanten opvolgen en hulpvragen behandelen. */
import { h, kaart, badge, veld, invoer, tekstvak, keuze, melding, dialoog, bevestig, datum, geleden, legeStaat, kopieer } from '../ui.js';
import { ganaar, teken } from '../app.js';
import * as store from '../store.js';
import { profile, param } from '../params.js';
import { maakAdvies } from '../advies.js';
import { waardeTegels, adviesKaart, bakSamenvatting } from './onderdelen.js';
import { maakDossier, printDossier, dossierAlsTekst, importeerDossier, exporteerDossier, whatsappLink, mailLink } from '../delen.js';

/* --------------------------------------------------------------- klantenlijst */
export async function toonKlanten() {
  const wrap = h('div', {});
  const klanten = await store.klanten();
  const bakken = await store.bakken();
  const hulpvragen = await store.hulpvragen();
  const catalogus = await store.catalogus();

  const overzicht = [];
  for (const k of klanten) {
    const eigenBakken = bakken.filter((b) => b.klantId === k.id);
    let ergste = null, laatsteMeting = null;
    for (const b of eigenBakken) {
      const metingen = await store.metingenVanBak(b.id);
      const m = metingen[0];
      if (m && (!laatsteMeting || m.datum > laatsteMeting)) laatsteMeting = m.datum;
      if (!m) continue;
      const advies = maakAdvies(m, b, metingen.slice(1), catalogus);
      if (!ergste || advies.score < ergste.score) ergste = { score: advies.score, advies, bak: b, meting: m };
    }
    overzicht.push({
      klant: k, bakken: eigenBakken, ergste, laatsteMeting,
      openHulp: hulpvragen.filter((v) => v.klantId === k.id && v.status !== 'afgerond').length,
    });
  }

  const nieuweVragen = hulpvragen.filter((v) => v.status === 'nieuw').length;
  const aandacht = overzicht.filter((o) => o.ergste && o.ergste.score < 50).length;
  const stil = overzicht.filter((o) => !o.laatsteMeting || Date.now() - o.laatsteMeting > 30 * 86400e3).length;

  wrap.append(kaart('Vandaag',
    h('div', { class: 'tegels' },
      tegel('Klanten', klanten.length, ''),
      tegel('Nieuwe hulpvragen', nieuweVragen, nieuweVragen ? 'kritiek' : 'goed'),
      tegel('Waarden kritiek', aandacht, aandacht ? 'kritiek' : 'goed'),
      tegel('Lang niet gemeten', stil, stil ? 'let-op' : 'goed')),
    h('div', { class: 'knoprij', style: { marginTop: '12px' } },
      h('button', { class: 'knop knop--primair', onclick: () => ganaar('hulpvragen') }, '🆘 Hulpvragen'),
      h('button', { class: 'knop knop--stil', onclick: () => klantFormulier() }, '+ Klant'),
      h('button', { class: 'knop knop--stil', onclick: () => importeerBestand() }, '📥 Dossier inlezen'))));

  if (!klanten.length) {
    wrap.append(legeStaat('👥', 'Nog geen klanten',
      'Voeg een klant toe, of lees een dossier in dat een klant vanuit de app doorstuurde.',
      h('div', { class: 'knoprij' },
        h('button', { class: 'knop knop--primair', onclick: () => klantFormulier() }, '+ Klant toevoegen'),
        h('button', { class: 'knop knop--stil', onclick: () => importeerBestand() }, '📥 Dossier inlezen'))));
    return wrap;
  }

  const zoekveld = invoer({ type: 'search', placeholder: 'Zoek op naam, gemeente of telefoon', oninput: (e) => tekenLijst(e.target.value.toLowerCase()) });
  const lijst = h('div', {});
  const blok = kaart(h('span', {}, 'Klanten ', badge(String(klanten.length))), veld('Zoeken', zoekveld), lijst);

  function tekenLijst(zoek = '') {
    const gesorteerd = [...overzicht].sort((a, b) =>
      (b.openHulp - a.openHulp) || ((a.ergste?.score ?? 101) - (b.ergste?.score ?? 101)));
    const zichtbaar = gesorteerd.filter((o) => !zoek ||
      `${o.klant.naam} ${o.klant.gemeente || ''} ${o.klant.telefoon || ''} ${o.klant.email || ''}`.toLowerCase().includes(zoek));
    lijst.replaceChildren(...(zichtbaar.length ? zichtbaar.map((o) =>
      h('button', { class: 'klikbaar', onclick: () => ganaar(`klant/${o.klant.id}`) },
        h('span', { style: { fontSize: '22px' } }, o.openHulp ? '🆘' : o.ergste ? (o.ergste.score >= 80 ? '🟢' : o.ergste.score >= 50 ? '🟠' : '🔴') : '⚪'),
        h('span', { class: 'groei' },
          h('strong', {}, o.klant.naam || 'Naamloos'),
          h('br'),
          h('span', { class: 'mini zacht' },
            [o.klant.gemeente, `${o.bakken.length} bak${o.bakken.length === 1 ? '' : 'ken'}`,
              o.laatsteMeting ? `laatste meting ${geleden(o.laatsteMeting)}` : 'nog niet gemeten'].filter(Boolean).join(' · '))),
        o.openHulp ? badge(`${o.openHulp} open`, 'kritiek') : o.ergste ? badge(`${o.ergste.score}`, o.ergste.score >= 80 ? 'goed' : o.ergste.score >= 50 ? 'let-op' : 'kritiek') : null,
        h('span', { class: 'pijl' }, '›')))
      : [h('p', { class: 'zacht klein' }, 'Geen klant gevonden.')]));
  }
  tekenLijst();
  wrap.append(blok);
  return wrap;
}

const tegel = (naam, waarde, soort) => h('div', { class: `tegel ${soort ? 'tegel--' + soort : ''}` },
  h('div', { class: 'tegel__naam' }, naam), h('div', { class: 'tegel__waarde' }, String(waarde)));

/* ------------------------------------------------------------------ klantdetail */
export async function toonKlant(id) {
  const klant = await store.klant(id);
  if (!klant) return legeStaat('👤', 'Klant niet gevonden', 'Deze klant bestaat niet meer.',
    h('button', { class: 'knop knop--stil', onclick: () => ganaar('klanten') }, 'Terug'));

  const wrap = h('div', {});
  const bakken = await store.bakkenVanKlant(id);
  const vragen = (await store.hulpvragenVanKlant(id)).sort((a, b) => b.aangemaakt - a.aangemaakt);
  const catalogus = await store.catalogus();

  wrap.append(kaart(
    h('span', { class: 'rij rij--tussen groei' },
      h('span', {}, '👤 ', klant.naam || 'Naamloos'),
      h('button', { class: 'chip', onclick: () => klantFormulier(klant) }, 'Bewerken')),
    h('ul', { class: 'lijst' },
      klant.telefoon ? h('li', {}, h('span', {}, '📞'), h('a', { href: `tel:${klant.telefoon.replace(/\s/g, '')}` }, klant.telefoon)) : null,
      klant.email ? h('li', {}, h('span', {}, '✉️'), h('a', { href: `mailto:${klant.email}` }, klant.email)) : null,
      (klant.adres || klant.gemeente) ? h('li', {}, h('span', {}, '📍'), h('span', {}, [klant.adres, klant.gemeente].filter(Boolean).join(', '))) : null,
      klant.opmerkingen ? h('li', {}, h('span', {}, '📝'), h('span', {}, klant.opmerkingen)) : null),
    h('div', { class: 'knoprij' },
      klant.telefoon ? h('a', { class: 'knop knop--stil', href: `tel:${klant.telefoon.replace(/\s/g, '')}` }, '📞 Bellen') : null,
      klant.telefoon ? h('a', { class: 'knop knop--stil', href: whatsappLink('', klant.telefoon), target: '_blank', rel: 'noopener' }, '💬 WhatsApp') : null,
      klant.email ? h('a', { class: 'knop knop--stil', href: mailLink('', klant.email, 'Lux Aqua — opvolging van je aquarium') }, '✉️ Mailen') : null)));

  for (const bak of bakken) {
    const metingen = await store.metingenVanBak(bak.id);
    const laatste = metingen[0];
    const advies = laatste ? maakAdvies(laatste, bak, metingen.slice(1), catalogus) : null;
    const vissen = await store.vissenVanBak(bak.id);
    const fotos = (await store.fotosVanBak(bak.id)).sort((a, b) => b.datum - a.datum).slice(0, 8);

    const blok = kaart(bakSamenvatting(bak, laatste, advies));
    if (laatste) {
      blok.append(h('h4', { style: { marginTop: '10px' } }, `Laatste meting — ${datum(laatste.datum)}`), waardeTegels(laatste, bak));
      if (laatste.opmerking) blok.append(h('p', { class: 'klein' }, h('strong', {}, 'Klant noteerde: '), laatste.opmerking));
      if (laatste.strip) blok.append(h('p', { class: 'mini zacht' },
        `Via teststrip · betrouwbaarheid: ${laatste.strip.resultaten.map((r) => `${param(r.param)?.short || r.param} ${r.betrouwbaarheid}`).join(', ')}`));
    }
    blok.append(h('details', { class: 'uitklap', style: { marginTop: '10px' } },
      h('summary', {}, 'Installatie en vissenbestand'),
      h('div', { class: 'uitklap__inhoud' },
        h('ul', { class: 'opsomming klein' },
          h('li', {}, `${bak.liters || '?'} liter · ${profile(bak.profiel).label}`),
          bak.opgestart ? h('li', {}, `Opgestart ${datum(bak.opgestart, false)} (${geleden(bak.opgestart)})`) : null,
          bak.filter ? h('li', {}, `Filter: ${bak.filter}`) : null,
          bak.verlichting ? h('li', {}, `Verlichting: ${bak.verlichting}`) : null,
          bak.co2 ? h('li', {}, `CO₂: ${bak.co2}`) : null,
          bak.verversing ? h('li', {}, `Verversing: ${bak.verversing}`) : null,
          bak.leidingwater ? h('li', {}, `Leidingwater: ${bak.leidingwater}`) : null,
          bak.opmerking ? h('li', {}, `Opmerking: ${bak.opmerking}`) : null),
        vissen.length
          ? h('ul', { class: 'opsomming klein' }, ...vissen.map((v) => h('li', {}, `${v.aantal}× ${v.soort}${v.opmerking ? ` — ${v.opmerking}` : ''}`)))
          : h('p', { class: 'zacht klein' }, 'Geen vissenbestand ingevuld.'))));

    if (fotos.length) {
      blok.append(h('h4', { style: { marginTop: '10px' } }, 'Foto\'s'),
        h('div', { class: 'fotoraster' }, ...fotos.map((f) => h('img', { src: f.thumb, alt: f.soort, loading: 'lazy' }))));
    }
    if (advies?.acties?.length) {
      const adviesBlok = h('details', { class: 'uitklap' }, h('summary', {}, `Advies (${advies.acties.length} punten)`));
      const inh = h('div', { class: 'uitklap__inhoud' });
      advies.acties.forEach((a) => inh.append(adviesKaart(a)));
      adviesBlok.append(inh);
      blok.append(adviesBlok);
    }
    blok.append(h('div', { class: 'knoprij', style: { marginTop: '10px' } },
      h('button', { class: 'knop knop--stil', onclick: async () => printDossier(await maakDossier(bak.id)) }, '🖨️ Dossier'),
      h('button', { class: 'knop knop--stil', onclick: async () => kopieer(dossierAlsTekst(await maakDossier(bak.id, { fotos: false }))) }, '📋 Samenvatting'),
      h('button', { class: 'knop knop--stil', onclick: async () => exporteerDossier(await maakDossier(bak.id)) }, '⬇️ Exporteren')));
    wrap.append(blok);
  }

  if (!bakken.length) wrap.append(kaart(null, h('p', { class: 'zacht klein' }, 'Deze klant heeft nog geen bak in de app.')));

  /* --- hulpvragen --- */
  const vraagBlok = kaart('Hulpvragen');
  if (!vragen.length) vraagBlok.append(h('p', { class: 'zacht klein' }, 'Geen hulpvragen.'));
  for (const v of vragen) vraagBlok.append(hulpvraagRij(v));
  wrap.append(vraagBlok);

  /* --- interne notities --- */
  const notitie = tekstvak({ value: klant.opmerkingen || '', placeholder: 'Interne notities: afspraken, wat je ter plaatse zag, welke producten meegegeven…' });
  wrap.append(kaart('📝 Interne notities', notitie,
    h('button', {
      class: 'knop knop--primair knop--vol', onclick: async () => {
        await store.bewaarKlant({ ...klant, opmerkingen: notitie.value });
        melding('Notities bewaard.', 'ok');
      },
    }, 'Bewaren')));

  wrap.append(h('div', { class: 'knoprij' },
    h('button', { class: 'knop knop--stil', onclick: () => ganaar('klanten') }, '← Terug'),
    h('button', {
      class: 'knop knop--stil', onclick: async () => {
        if (await bevestig('Klant verwijderen?', 'Alle bakken, metingen en foto\'s van deze klant worden mee verwijderd.', 'Verwijderen')) {
          await store.verwijderKlant(klant.id); ganaar('klanten'); teken();
        }
      },
    }, '🗑 Verwijderen')));

  return wrap;
}

/* -------------------------------------------------------------- hulpvragenlijst */
export async function toonHulpvragen() {
  const wrap = h('div', {});
  const alle = (await store.hulpvragen()).sort((a, b) => b.aangemaakt - a.aangemaakt);
  const klanten = Object.fromEntries((await store.klanten()).map((k) => [k.id, k]));
  let filter = 'open';

  const lijst = h('div', {});
  const chips = h('div', { class: 'tabbalk' }, ...[
    { id: 'open', label: 'Open' }, { id: 'nieuw', label: 'Nieuw' },
    { id: 'gepland', label: 'Gepland' }, { id: 'afgerond', label: 'Afgerond' }, { id: 'alles', label: 'Alles' },
  ].map((f) => h('button', {
    class: `chip ${f.id === filter ? 'is-actief' : ''}`,
    onclick: (e) => {
      filter = f.id;
      [...chips.children].forEach((c) => c.classList.remove('is-actief'));
      e.currentTarget.classList.add('is-actief');
      tekenLijst();
    },
  }, f.label)));

  function tekenLijst() {
    const zichtbaar = alle.filter((v) =>
      filter === 'alles' ? true : filter === 'open' ? v.status !== 'afgerond' : v.status === filter);
    lijst.replaceChildren(...(zichtbaar.length
      ? zichtbaar.map((v) => hulpvraagRij(v, klanten[v.klantId]))
      : [h('p', { class: 'zacht klein' }, 'Niets in deze categorie.')]));
  }
  tekenLijst();

  wrap.append(kaart(h('span', {}, '🆘 Hulpvragen ', badge(String(alle.filter((v) => v.status !== 'afgerond').length) + ' open', 'let-op')),
    chips, lijst,
    h('button', { class: 'knop knop--stil knop--vol', style: { marginTop: '10px' }, onclick: () => importeerBestand() }, '📥 Dossier van een klant inlezen')));
  return wrap;
}

function hulpvraagRij(v, klant) {
  const kleur = v.status === 'afgerond' ? 'goed' : v.urgentie?.toLowerCase().includes('nood') || v.urgentie?.toLowerCase().includes('snel') ? 'kritiek' : 'let-op';
  return h('button', { class: 'klikbaar', onclick: () => hulpvraagDetail(v, klant) },
    h('span', { style: { fontSize: '20px' } }, v.status === 'afgerond' ? '✅' : '🆘'),
    h('span', { class: 'groei' },
      h('strong', {}, v.type), h('br'),
      h('span', { class: 'mini zacht' },
        [klant?.naam, v.urgentie, geleden(v.aangemaakt)].filter(Boolean).join(' · '))),
    badge(v.status, kleur), h('span', { class: 'pijl' }, '›'));
}

async function hulpvraagDetail(v, klant) {
  const status = keuze([
    { value: 'nieuw', label: 'Nieuw', selected: v.status === 'nieuw' },
    { value: 'opgenomen', label: 'Opgenomen — contact gehad', selected: v.status === 'opgenomen' },
    { value: 'gepland', label: 'Bezoek gepland', selected: v.status === 'gepland' },
    { value: 'afgerond', label: 'Afgerond', selected: v.status === 'afgerond' },
  ]);
  const afspraak = invoer({ type: 'datetime-local', value: v.afspraak ? new Date(v.afspraak).toISOString().slice(0, 16) : '' });
  const antwoord = tekstvak({ value: v.antwoord || '', placeholder: 'Wat is er afgesproken? Welk advies is gegeven?' });

  const bewaard = await dialoog({
    titel: v.type, breed: true,
    inhoud: h('div', {},
      h('p', { class: 'klein zacht' }, `${klant?.naam ? klant.naam + ' · ' : ''}aangemaakt op ${datum(v.aangemaakt)} · urgentie: ${v.urgentie}`),
      v.omschrijving ? h('p', {}, v.omschrijving) : null,
      v.beschikbaarheid ? h('p', { class: 'klein zacht' }, `Beschikbaar: ${v.beschikbaarheid}`) : null,
      klant?.telefoon ? h('div', { class: 'knoprij' },
        h('a', { class: 'knop knop--stil', href: `tel:${klant.telefoon.replace(/\s/g, '')}` }, '📞 Bellen'),
        h('a', { class: 'knop knop--stil', href: whatsappLink('Dag, met Lux Aqua. Ik bel over je hulpvraag.', klant.telefoon), target: '_blank', rel: 'noopener' }, '💬 WhatsApp')) : null,
      veld('Status', status),
      veld('Afspraak', afspraak),
      veld('Notitie / antwoord', antwoord),
      v.bakId ? h('button', {
        class: 'knop knop--stil knop--vol',
        onclick: async () => printDossier(await maakDossier(v.bakId, { hulpvraag: v })),
      }, '🖨️ Dossier afdrukken') : null),
    acties: [
      { label: 'Sluiten', waarde: false },
      {
        label: 'Bewaren', stijl: 'knop--primair', actie: async () => {
          await store.bewaarHulpvraag({
            ...v, status: status.value, antwoord: antwoord.value,
            afspraak: afspraak.value ? new Date(afspraak.value).getTime() : null,
          });
          return true;
        },
      },
    ],
  });
  if (bewaard) { melding('Hulpvraag bijgewerkt.', 'ok'); teken(); }
}

/* --------------------------------------------------------------- klantformulier */
export async function klantFormulier(bestaande) {
  const k = bestaande || {};
  const naam = invoer({ value: k.naam || '', placeholder: 'Voornaam en naam' });
  const telefoon = invoer({ type: 'tel', value: k.telefoon || '' });
  const email = invoer({ type: 'email', value: k.email || '' });
  const adres = invoer({ value: k.adres || '' });
  const gemeente = invoer({ value: k.gemeente || '' });
  const opmerkingen = tekstvak({ value: k.opmerkingen || '' });

  const bewaard = await dialoog({
    titel: bestaande ? 'Klant bewerken' : 'Nieuwe klant',
    inhoud: h('div', {},
      veld('Naam', naam), veld('Telefoon', telefoon), veld('E-mail', email),
      veld('Adres', adres), veld('Gemeente', gemeente), veld('Interne notities', opmerkingen)),
    acties: [
      { label: 'Annuleren', waarde: false },
      {
        label: 'Bewaren', stijl: 'knop--primair', actie: async () => {
          if (!naam.value.trim()) { melding('Vul een naam in.', 'fout'); return false; }
          await store.bewaarKlant({
            ...k, naam: naam.value.trim(), telefoon: telefoon.value.trim(), email: email.value.trim(),
            adres: adres.value.trim(), gemeente: gemeente.value.trim(), opmerkingen: opmerkingen.value,
          });
          return true;
        },
      },
    ],
  });
  if (bewaard) { melding('Klant bewaard.', 'ok'); teken(); }
}

/* ------------------------------------------------------------ dossier inlezen */
export function importeerBestand() {
  const invoerEl = h('input', {
    type: 'file', accept: 'application/json,.json', hidden: true,
    onchange: async (e) => {
      const bestand = e.target.files?.[0];
      if (!bestand) return;
      try {
        const { klantId } = await importeerDossier(await bestand.text());
        melding('Dossier ingelezen.', 'ok');
        ganaar(`klant/${klantId}`);
        teken();
      } catch (err) {
        melding(`Inlezen mislukt: ${err.message}`, 'fout');
      } finally {
        invoerEl.remove();
      }
    },
  });
  document.body.append(invoerEl);
  invoerEl.click();
}
