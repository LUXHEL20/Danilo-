/** Historiek: alle metingen, grafieken per waarde en de evolutie van uw bak. */
import { h, kaart, badge, datum, geleden, bevestig, melding, dialoog, download, legeStaat } from '../ui.js';
import { ctx, ganaar, teken } from '../app.js';
import * as store from '../store.js';
import { profile, param, fmt, statusOf, PARAMETERS } from '../params.js';
import { lijnGrafiek } from '../charts.js';
import { waardeTegels, adviesKaart, parameterUitleg } from './onderdelen.js';
import { maakAdvies } from '../advies.js';

export async function toonHistoriek(arg) {
  const bak = ctx.bak;
  if (!bak) return legeStaat('📈', 'Nog geen bak', 'Voeg eerst een bak toe.', null);

  const metingen = await store.metingenVanBak(bak.id);
  if (!metingen.length) {
    return legeStaat('📈', 'Nog geen metingen', 'Zodra u meet, ziet u hier de evolutie van uw waarden.',
      h('button', { class: 'knop knop--primair', onclick: () => ganaar('meten') }, 'Eerste meting doen'));
  }

  const prof = profile(bak.profiel);
  const beschikbaar = prof.params.filter((id) => metingen.some((m) => m.waarden?.[id] != null));
  let gekozen = arg && beschikbaar.includes(arg) ? arg : beschikbaar[0];

  const wrap = h('div', {});
  const grafiekHouder = h('div', {});

  const tabs = h('div', { class: 'tabbalk' }, ...beschikbaar.map((id) =>
    h('button', {
      class: `chip ${id === gekozen ? 'is-actief' : ''}`,
      onclick: (e) => {
        gekozen = id;
        [...tabs.children].forEach((c) => c.classList.remove('is-actief'));
        e.currentTarget.classList.add('is-actief');
        tekenGrafiek();
      },
    }, param(id)?.short || id)));

  function tekenGrafiek() {
    const punten = metingen.slice().reverse()
      .filter((m) => m.waarden?.[gekozen] != null && m.waarden[gekozen] !== '')
      .map((m) => ({ datum: m.datum, waarde: Number(m.waarden[gekozen]) }));
    const p = param(gekozen);
    const doel = prof.targets?.[gekozen];
    const laatste = punten[punten.length - 1];
    grafiekHouder.replaceChildren(
      h('div', { class: 'rij rij--tussen' },
        h('h3', {}, p?.label || gekozen),
        laatste ? badge(fmt(gekozen, laatste.waarde), statusOf(gekozen, laatste.waarde, bak.profiel)) : null),
      doel ? h('p', { class: 'mini zacht' }, `Streefwaarde: ${fmt(gekozen, doel.ideal[0])} tot ${fmt(gekozen, doel.ideal[1])} · aanvaardbaar: ${fmt(gekozen, doel.ok[0])} tot ${fmt(gekozen, doel.ok[1])}`) : null,
      punten.length >= 2 ? lijnGrafiek(punten, gekozen, bak.profiel, { breedte: 340, hoogte: 150 })
        : h('p', { class: 'zacht klein' }, 'Nog te weinig metingen voor een grafiek.'),
      h('button', {
        class: 'knop knop--stil knop--vol', style: { marginTop: '8px' },
        onclick: () => dialoog({ titel: p?.label || gekozen, inhoud: parameterUitleg(gekozen), acties: [{ label: 'Sluiten', waarde: true }] }),
      }, 'ℹ️ Wat betekent deze waarde?'));
  }
  tekenGrafiek();

  wrap.append(kaart('📈 Evolutie', tabs, grafiekHouder));

  /* --- lijst van metingen --- */
  const lijst = kaart(h('span', {}, 'Alle metingen ', badge(String(metingen.length))));
  for (const m of metingen) {
    const advies = maakAdvies(m, bak, [], await store.catalogus());
    lijst.append(h('details', { class: 'uitklap' },
      h('summary', {},
        h('span', { class: 'groei' }, datum(m.datum), h('br'),
          h('span', { class: 'mini zacht' }, `${geleden(m.datum)}${m.strip ? ' · via teststrip' : ''}`)),
        badge(`${advies.score}`, advies.score >= 80 ? 'goed' : advies.score >= 50 ? 'let-op' : 'kritiek')),
      h('div', { class: 'uitklap__inhoud' },
        waardeTegels(m, bak),
        m.opmerking ? h('p', { class: 'klein', style: { marginTop: '10px' } }, h('strong', {}, 'Opmerking: '), m.opmerking) : null,
        m.strip ? h('p', { class: 'mini zacht' }, `Ingelezen van een foto. Betrouwbaarheid per veld: ${m.strip.resultaten.map((r) => `${param(r.param)?.short || r.param} ${r.betrouwbaarheid}`).join(', ')}`) : null,
        h('div', { class: 'knoprij', style: { marginTop: '10px' } },
          h('button', {
            class: 'chip', onclick: () => dialoog({
              titel: 'Advies bij deze meting', breed: true,
              inhoud: h('div', {}, h('p', {}, advies.samenvatting), ...advies.acties.map((a) => adviesKaart(a))),
              acties: [{ label: 'Sluiten', waarde: true }],
            }),
          }, '💡 Advies bekijken'),
          h('button', {
            class: 'chip', onclick: async () => {
              if (await bevestig('Meting verwijderen?', datum(m.datum), 'Verwijderen')) { await store.verwijderMeting(m.id); teken(); }
            },
          }, '🗑 Verwijderen')))));
  }
  wrap.append(lijst);

  /* --- export --- */
  wrap.append(h('div', { class: 'knoprij' },
    h('button', { class: 'knop knop--stil', onclick: () => exporteerCsv(bak, metingen) }, '⬇️ Exporteren als CSV'),
    h('button', { class: 'knop knop--primair', onclick: () => ganaar('meten') }, '🧪 Nieuwe meting')));

  return wrap;
}

function exporteerCsv(bak, metingen) {
  const ids = profile(bak.profiel).params;
  const kop = ['datum', ...ids.map((id) => `${PARAMETERS[id].short}${PARAMETERS[id].unit ? ` (${PARAMETERS[id].unit})` : ''}`), 'opmerking'];
  const rijen = metingen.map((m) => [
    new Date(m.datum).toLocaleString('nl-BE'),
    ...ids.map((id) => (m.waarden?.[id] ?? '')),
    (m.opmerking || '').replace(/[\n;]/g, ' '),
  ]);
  const csv = [kop, ...rijen].map((r) => r.join(';')).join('\n');
  download(`luxaqua-metingen-${(bak.naam || 'bak').toLowerCase().replace(/\W+/g, '-')}.csv`, '﻿' + csv, 'text/csv');
  melding('CSV gedownload.', 'ok');
}
