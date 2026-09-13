/** Startscherm voor de klant: hoe staat mijn bak ervoor en wat moet ik doen? */
import { h, kaart, badge, geleden, legeStaat } from '../ui.js';
import { ctx, ganaar, teken } from '../app.js';
import * as store from '../store.js';
import { maakAdvies, meetritmeDagen } from '../advies.js';
import { agendaAfspraak } from '../delen.js';
import { scoreRing, lijnGrafiek } from '../charts.js';
import { waardeTegels, adviesKaart, takenLijst } from './onderdelen.js';
import { profile } from '../params.js';
import { spaarBlokVoorStart } from './spaar.js';
import { watVraagtAandacht, koppelNaam } from '../kweek.js';

export async function toonStart() {
  const wrap = h('div', {});
  const bak = ctx.bak;

  if (!bak) {
    return legeStaat('🐠', 'Nog geen bak', 'Voeg uw aquarium of vijver toe om te beginnen met meten.',
      h('button', { class: 'knop knop--primair', onclick: () => ganaar('bak/nieuw') }, 'Bak toevoegen'));
  }

  const metingen = await store.metingenVanBak(bak.id);
  const catalogus = await store.catalogus();
  const laatste = metingen[0];
  const advies = laatste ? maakAdvies(laatste, bak, metingen.slice(1), catalogus) : null;
  const taken = (await store.takenVanBak(bak.id)).filter((t) => !t.klaar).sort((a, b) => a.vervalt - b.vervalt);

  /* --- vandaag: over alle bakken heen, met de baknaam erbij --- */
  const vandaag = await vandaagStrook();
  if (vandaag) wrap.append(vandaag);

  /* --- kop met score --- */
  if (advies) {
    wrap.append(h('section', { class: `kaart kaart--${advies.score >= 80 ? 'goed' : advies.score >= 50 ? 'aandacht' : 'kritiek'}` },
      h('div', { class: 'rij' },
        scoreRing(advies.score),
        h('div', { class: 'groei' },
          h('h2', { style: { marginBottom: '2px' } }, advies.score >= 80 ? 'Uw bak zit goed' : advies.score >= 50 ? 'Even bijsturen' : 'Actie nodig'),
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
        h('h2', {}, 'Doe uw eerste meting'),
        h('p', { class: 'zacht klein' }, 'Fotografeer uw teststrip of vul de waarden zelf in. U krijgt meteen te zien wat er goed zit en wat u kan verbeteren.'),
        h('button', { class: 'knop knop--primair knop--groot knop--vol', onclick: () => ganaar('meten') }, 'Meting starten'))));
  }

  /* --- kweek: legsels die vandaag iets vragen --- */
  if (ctx.instellingen.kweker) {
    const aandacht = await watVraagtAandacht();
    if (aandacht.length) {
      wrap.append(h('section', { class: 'kaart kaart--aandacht klikbaar-kaart', onclick: () => ganaar('kweek') },
        h('div', { class: 'rij' },
          h('span', { style: { fontSize: '30px' } }, '🐣'),
          h('div', { class: 'groei' },
            h('strong', {}, aandacht.length === 1 ? 'Eén legsel vraagt aandacht' : `${aandacht.length} legsels vragen aandacht`),
            h('br'),
            h('span', { class: 'klein zacht' }, `${koppelNaam(aandacht[0].koppel)}: ${aandacht[0].tekst}`)),
          h('span', { class: 'pijl' }, '›'))));
    }
  }

  /* --- spaarkaart, enkel als er iets te melden valt --- */
  const spaarBlok = await spaarBlokVoorStart();
  if (spaarBlok) wrap.append(spaarBlok);

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
    const blok = kaart('Wat kan u nu doen?');
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

/**
 * Eén korte strook bovenaan, over alle bakken van de klant heen: wat te laat
 * staat, en wanneer de volgende meting aan de beurt is. Staat er niets open,
 * dan geeft deze functie null terug en verschijnt er niets: geen strook is
 * ook een antwoord.
 */
async function vandaagStrook() {
  const alle = await store.bakken();
  const eigen = ctx.klant ? alle.filter((b) => b.klantId === ctx.klant.id) : (ctx.bak ? [ctx.bak] : []);
  if (!eigen.length) return null;

  const regels = [];
  let volgendeMetingActief = null;
  for (const b of eigen) {
    const naam = b.naam || 'Aquarium';
    const metingen = await store.metingenVanBak(b.id);
    const laatste = metingen[0];
    const openTaken = (await store.takenVanBak(b.id)).filter((t) => !t.klaar);
    const teLaat = openTaken.filter((t) => t.vervalt < Date.now());
    if (teLaat.length) {
      regels.push({ prioriteit: 0, tekst: `${naam}: ${teLaat.length} ${teLaat.length === 1 ? 'punt staat' : 'punten staan'} te laat.` });
    }
    const ritme = meetritmeDagen(b, profile(b.profiel));
    const dagenGeleden = laatste ? (Date.now() - laatste.datum) / 86400e3 : Infinity;
    if (!laatste) {
      // Voor de actieve bak toont het startscherm hieronder al een duidelijke
      // "doe uw eerste meting"-kaart; dat hier herhalen is dubbel op.
      if (b.id !== ctx.bak?.id) regels.push({ prioriteit: 1, tekst: `${naam}: nog geen enkele meting.` });
    } else if (dagenGeleden > ritme) {
      regels.push({ prioriteit: 1, tekst: `${naam}: laatste meting ${geleden(laatste.datum)}, meet opnieuw.` });
    }
    if (laatste && b.id === ctx.bak?.id) {
      const doel = laatste.datum + ritme * 86400e3;
      volgendeMetingActief = { naam, datumTs: doel > Date.now() ? doel : Date.now() + 86400e3 };
    }
  }
  if (!regels.length) return null;

  regels.sort((x, y) => x.prioriteit - y.prioriteit);
  return h('section', { class: 'kaart kaart--aandacht' },
    h('h3', {}, '⏰ Vandaag'),
    h('ul', { class: 'opsomming klein', style: { margin: 0 } },
      ...regels.slice(0, 3).map((r) => h('li', {}, r.tekst))),
    volgendeMetingActief ? h('button', {
      class: 'knop knop--stil', style: { marginTop: '10px' },
      onclick: () => {
        agendaAfspraak({
          titel: `LUX AQUA: meting voor ${volgendeMetingActief.naam}`,
          beschrijving: 'Uw agenda waarschuwt u, LUX AQUA stuurt u niets. Doe uw teststrip of vul uw waarden in via de app.',
          datumTs: volgendeMetingActief.datumTs,
        });
      },
    }, '📅 Zet in mijn agenda') : null,
    h('button', { class: 'knop knop--primair knop--vol', style: { marginTop: '10px' }, onclick: () => ganaar('meten') }, 'Nu meten'));
}
