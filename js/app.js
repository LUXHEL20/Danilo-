/**
 * LUX AQUA, app-schil: opstarten, navigatie en routering.
 */
import * as store from './store.js';
import { h, leeg, melding, dialoog } from './ui.js';
import { initNative, isNative } from './native.js';

import { toonOnboarding } from './views/onboarding.js';
import { toonStart } from './views/start.js';
import { toonMeten } from './views/meten.js';
import { toonBak } from './views/bak.js';
import { toonHistoriek } from './views/historiek.js';
import { toonProducten } from './views/producten.js';
import { toonHulp } from './views/hulp.js';
import { toonKlanten, toonKlant, toonHulpvragen } from './views/luxaqua.js';
import { toonBeheer } from './views/beheer.js';
import { toonKennis } from './views/kennis.js';
import { toonSpaar } from './views/spaar.js';
import { toonAanmelden } from './views/aanmelden.js';
import { isAangemeld } from './auth.js';

const scherm = document.getElementById('scherm');
const kopbalk = document.getElementById('kopbalk');
const navigatie = document.getElementById('navigatie');

/** Gedeelde toestand voor alle schermen. */
export const ctx = {
  instellingen: null,
  bak: null,      // actieve bak (klantmodus)
  klant: null,    // actieve klant (klantmodus = de gebruiker zelf)
  async herlaad() {
    /* Zet een verlopen aanmelding terug op klantmodus vóór de instellingen
       gelezen worden, anders toont het scherm nog even de beheerderskant. */
    await isAangemeld();
    this.instellingen = await store.instellingen();
    this.klant = this.instellingen.actieveKlant ? await store.klant(this.instellingen.actieveKlant) : null;
    this.bak = this.instellingen.actieveBak ? await store.bak(this.instellingen.actieveBak) : null;
    if (!this.bak) {
      const alle = await store.bakken();
      const eigen = this.klant ? alle.filter((b) => b.klantId === this.klant.id) : alle;
      this.bak = eigen[0] || alle[0] || null;
      if (this.bak) await store.zetInstelling({ actieveBak: this.bak.id });
    }
  },
};

const ROUTES = {
  '': toonStart,
  'start': toonStart,
  'meten': toonMeten,
  'bak': toonBak,
  'historiek': toonHistoriek,
  'producten': toonProducten,
  'kennis': toonKennis,
  'hulp': toonHulp,
  'spaar': toonSpaar,
  'beheer': toonBeheer,
  'klanten': toonKlanten,
  'klant': toonKlant,
  'hulpvragen': toonHulpvragen,
  'aanmelden': toonAanmelden,
};

/* Schermen die enkel voor de aangemelde beheerder zijn. */
const BEHEERDERSROUTES = ['klanten', 'klant', 'hulpvragen'];

export function ganaar(pad) {
  location.hash = pad.startsWith('#') ? pad : `#/${pad.replace(/^\//, '')}`;
}

function huidigeRoute() {
  const stukken = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  return { naam: stukken[0] || '', arg: stukken[1] || null };
}

let bezig = false;
export async function teken() {
  if (bezig) return;
  bezig = true;
  try {
    await ctx.herlaad();
    if (!ctx.instellingen.onboardingKlaar) {
      leeg(scherm);
      kopbalk.hidden = true; navigatie.hidden = true;
      scherm.append(await toonOnboarding());
      return;
    }
    const { naam, arg } = huidigeRoute();

    if (naam === 'aanmelden') {
      leeg(scherm);
      kopbalk.hidden = true; navigatie.hidden = true;
      scherm.append(await toonAanmelden());
      return;
    }
    if (BEHEERDERSROUTES.includes(naam) && ctx.instellingen.rol !== 'luxaqua') {
      ganaar('aanmelden');
      return;
    }

    kopbalk.hidden = false; navigatie.hidden = false;
    const view = ROUTES[naam] || toonStart;
    tekenKop();
    tekenNav(naam);
    leeg(scherm);
    scherm.append(await view(arg));
    scherm.scrollIntoView({ block: 'start' });
    window.scrollTo(0, 0);
  } catch (e) {
    console.error(e);
    leeg(scherm).append(h('div', { class: 'kaart kaart--kritiek' },
      h('h3', {}, 'Er ging iets mis'),
      h('p', { class: 'zacht' }, e.message || String(e)),
      h('button', { class: 'knop knop--stil', onclick: () => location.reload() }, 'App herladen')));
  } finally {
    bezig = false;
  }
}

function tekenKop() {
  const isLux = ctx.instellingen.rol === 'luxaqua';
  const bedrijf = ctx.instellingen.bedrijf?.naam || 'LUX AQUA';
  leeg(kopbalk).append(
    logoElement(ctx.instellingen.logo),
    h('div', {},
      h('h1', {}, isLux ? `${bedrijf} · beheer` : bedrijf),
      h('span', { class: 'kopbalk__sub' },
        isLux ? 'Overzicht van uw klanten' : (ctx.bak ? `${ctx.bak.naam || 'Mijn bak'} · ${ctx.bak.liters || '?'} liter` : 'Nog geen bak ingesteld'))),
    h('div', { class: 'kopbalk__acties' },
      !isLux && h('button', { class: 'icoonknop', title: 'Wissel van bak', 'aria-label': 'Wissel van bak', onclick: kiesBak }, '🐟'),
      h('button', { class: 'icoonknop', title: 'Instellingen', 'aria-label': 'Instellingen', onclick: () => ganaar('beheer') }, '⚙️')),
  );
}

/** Officiële logobestanden (zie BRAND.md). */
export const LOGO = {
  navy: 'assets/brand/LUX-AQUA-01-navy.svg',
  wit: 'assets/brand/LUX-AQUA-03-wit.svg',
  icoon: 'assets/brand/LUX-AQUA-06-app-icoon-navy.png',
};

/** Toont het geüploade logo, of anders het officiële LUX AQUA-logo in de gevraagde variant. */
export function logoElement(logo, klasse = 'kopbalk__logo', variant = 'wit') {
  if (logo) return h('img', { src: logo, class: `${klasse} ${klasse}--eigen`, alt: 'LUX AQUA' });
  return h('img', { src: LOGO[variant] || LOGO.navy, class: klasse, alt: 'LUX AQUA' });
}

function tekenNav(actief) {
  const isLux = ctx.instellingen.rol === 'luxaqua';
  const items = isLux
    ? [
      { pad: 'klanten', icoon: '👥', label: 'Klanten' },
      { pad: 'hulpvragen', icoon: '🆘', label: 'Hulpvragen' },
      { pad: 'producten', icoon: '🧴', label: 'Producten' },
      { pad: 'kennis', icoon: '📚', label: 'Kennis' },
      { pad: 'beheer', icoon: '⚙️', label: 'Beheer' },
    ]
    : [
      { pad: 'start', icoon: '🏠', label: 'Start' },
      { pad: 'meten', icoon: '🧪', label: 'Meten' },
      { pad: 'bak', icoon: '🐠', label: 'Mijn bak' },
      { pad: 'producten', icoon: '🧴', label: 'Producten' },
      { pad: 'spaar', icoon: '🎟️', label: 'Sparen' },
      { pad: 'hulp', icoon: '🆘', label: 'Hulp' },
    ];
  leeg(navigatie).append(...items.map((i) =>
    h('a', {
      href: `#/${i.pad}`,
      class: (actief === i.pad || (actief === '' && i.pad === 'start')) ? 'is-actief' : '',
    }, h('span', { class: 'icoon' }, i.icoon), h('span', {}, i.label))));
}

async function kiesBak() {
  const alle = await store.bakken();
  const eigen = ctx.klant ? alle.filter((b) => b.klantId === ctx.klant.id) : alle;
  const lijst = eigen.length ? eigen : alle;
  await dialoog({
    titel: 'Kies uw bak',
    inhoud: h('div', {},
      ...lijst.map((b) => h('button', {
        class: 'klikbaar', onclick: async () => {
          await store.zetInstelling({ actieveBak: b.id });
          document.querySelector('.overlay')?.remove();
          document.body.classList.remove('geen-scroll');
          teken();
        },
      },
        h('span', {}, '🐠'),
        h('span', {}, h('strong', {}, b.naam || 'Aquarium'), h('br'), h('span', { class: 'klein zacht' }, `${b.liters || '?'} liter`)),
        h('span', { class: 'pijl' }, b.id === ctx.bak?.id ? '✓' : '›'))),
      h('button', {
        class: 'knop knop--stil knop--vol', onclick: () => {
          document.querySelector('.overlay')?.remove();
          document.body.classList.remove('geen-scroll');
          ganaar('bak/nieuw');
        },
      }, '+ Bak toevoegen')),
  });
}

/* ------------------------------------------------------------------ opstarten */
window.addEventListener('hashchange', teken);
store.onWijziging((soort) => { if (['instellingen', 'bakken', 'klanten'].includes(soort)) tekenKop(); });

// eerst tekenen, dan pas de splash verbergen (initNative doet niets op het web)
teken().then(() => initNative());

// In de native app staan alle bestanden lokaal: geen service worker nodig.
if (!isNative() && 'serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch((e) => {
      // niet stil laten mislukken: zonder service worker werkt de app online prima,
      // maar offline niet, en dat is precies wat u na het uploaden wil kunnen zien
      console.warn('[LUX AQUA] service worker niet geregistreerd, de app werkt dan niet offline:', e);
    });
  });
}

window.addEventListener('unhandledrejection', (e) => {
  console.error(e.reason);
  melding(`Er ging iets mis: ${e.reason?.message || e.reason}`, 'fout');
});
