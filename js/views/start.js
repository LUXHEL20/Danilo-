/** Startscherm voor de klant: hoe staat mijn bak ervoor en wat moet ik doen? */
import { h, kaart, badge, geleden, legeStaat } from '../ui.js';
import { ctx, ganaar, teken } from '../app.js';
import * as store from '../store.js';
import { maakAdvies } from '../advies.js';
import { scoreRing, lijnGrafiek } from '../charts.js';
import { waardeTegels, adviesKaart, takenLijst } from './onderdelen.js';
import { profile } from '../params.js';

export async function toonStart() {
  const wrap = h('div', {});
  const bak = ctx.bak;

  if (!bak) {
    return legeStaat('🐠', 'Nog geen bak', 'Voeg je aquarium of vijver toe om te beginnen met meten.',
      h('button', { class: 'knop knop--primair', onclick: () => ganaar('bak/nieuw') }, 'Bak toevoegen'));
  }

  const metingen = await store.metingenVanBak(bak.id);
  const catalogus = await store.catalogus();
  const laatste = metingen[0];
  const advies = laatste ? maakAdvies(laatste, bak, metingen.slice(1), catalogus) : null;
  const taken = (await store.takenVanBak(bak.id)).filter((t) => !t.klaar).sort((a, b) => a.vervalt - b.vervalt);

  /* --- kop met score --- */
  if (advies) {
    wrap.append(h('section', { class: `kaart kaart--${advies.score >= 80 ? 'goed' : advies.score >= 50 ? 'aandacht' : 'kritiek'}` },
      h('div', { class: 'rij' },
        scoreRing(advies.score),
        h('div', { class: 'groei' },
          h('h2', { style: { marginBottom: '2px' } }, advies.score >= 80 ? 'Je bak zit goed' : advies.score >= 50 ? 'Even bijsturen' : 'Actie nodig'),
          h('p', { class: 'klein zacht', style: { margin: 0 } }, advies.samenvatting),
          h('p', { class: 'mini zacht', style: { margin: '6px 0 0' } }, `Laatste meting ${geleden(laatste.datum)}`))),
      advies.huisbezoekAangeraden
        ? h('button', { class: 'knop knop--hulp knop--vol', style: { marginTop: '12px' }, onclick: () => ganaar('hulp') },
          '🆘 Vraag hulp of een huisbezoek')
        : null));
  } else {
    wrap.append(kaart(null,
      h('div', { class: 'midden' },
        h('div', { style: { fontSize: '40px' } }, '🧪'),
        h('h2', {}, 'Doe je eerste meting'),
        h('p', { class: 'zacht klein' }, 'Fotografeer je teststrip of vul de waarden zelf in. Je krijgt meteen te zien wat er goed zit en wat je kan verbeteren.'),
        h('button', { class: 'knop knop--primair knop--groot knop--vol', onclick: () => ganaar('meten') }, 'Meting starten'))));
  }

  /* --- herinnering --- */
  const dagenGeleden = laatste ? (Date.now() - laatste.datum) / 86400e3 : 99;
  if (laatste && dagenGeleden > 10) {
    wrap.append(h('section', { class: 'kaart kaart--aandacht' },
      h('h3', {}, '⏰ Tijd voor een nieuwe meting'),
      h('p', { class: 'klein zacht' }, `Je laatste meting is van ${Math.round(dagenGeleden)} dagen geleden. Wekelijks meten is de beste manier om problemen vóór te zijn.`),
      h('button', { class: 'knop knop--primair knop--vol', onclick: () => ganaar('meten') }, 'Nu meten')));
  }

  /* --- snelknoppen --- */
  wrap.append(h('div', { class: 'knoprij', style: { marginBottom: '14px' } },
    h('button', { class: 'knop knop--primair', onclick: () => ganaar('meten') }, '🧪 Meting'),
    h('button', { class: 'knop knop--stil', onclick: () => ganaar('bak') }, '🐠 Mijn bak'),
    h('button', { class: 'knop knop--hulp', onclick: () => ganaar('hulp') }, '🆘 Hulp')));

  /* --- laatste waarden --- */
  if (laatste) {
    wrap.append(kaart(h('span', {}, 'Laatste waarden ', badge(geleden(laatste.datum))),
      waardeTegels(laatste, bak, { klikbaar: (id) => ganaar(`historiek/${id}`) }),
      h('button', { class: 'knop knop--stil knop--vol', style: { marginTop: '12px' }, onclick: () => ganaar('historiek') }, 'Volledige historiek bekijken')));
  }

  /* --- adviezen --- */
  if (advies?.acties?.length) {
    const blok = kaart('Wat kan je nu doen?');
    advies.acties.slice(0, 4).forEach((a) => blok.append(adviesKaart(a)));
    if (advies.acties.length > 4) blok.append(h('p', { class: 'mini zacht' }, `+ ${advies.acties.length - 4} extra punten in de historiek.`));
    wrap.append(blok);
  }

  /* --- taken --- */
  wrap.append(kaart(h('span', {}, 'Opvolging ', taken.length ? badge(String(taken.length), taken.some((t) => t.vervalt < Date.now()) ? 'let-op' : '') : null),
    takenLijst(taken.slice(0, 8), { opWijziging: teken })));

  /* --- trend --- */
  if (metingen.length >= 2) {
    const params = profile(bak.profiel).params.filter((id) => metingen.some((m) => m.waarden?.[id] != null));
    const toon = ['no3', 'ph', 'kh'].filter((id) => params.includes(id)).slice(0, 2);
    if (toon.length) {
      const blok = kaart('Evolutie');
      for (const id of toon) {
        const punten = metingen.slice(0, 12).reverse()
          .filter((m) => m.waarden?.[id] != null && m.waarden[id] !== '')
          .map((m) => ({ datum: m.datum, waarde: Number(m.waarden[id]) }));
        if (punten.length < 2) continue;
        blok.append(h('h4', { style: { margin: '10px 0 2px' } }, profile(bak.profiel).targets[id] ? `${id.toUpperCase()}` : id));
        blok.append(lijnGrafiek(punten, id, bak.profiel));
      }
      wrap.append(blok);
    }
  }

  return wrap;
}
