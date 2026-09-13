/** Spaarkaart voor de klant: tokens sparen in de winkel en zelf kiezen wat ermee gebeurt. */
import { h, kaart, dialoog, melding, invoer, veld, geleden, kortDatum, legeStaat } from '../ui.js';
import { ganaar, teken } from '../app.js';
import * as sp from '../spaarkaart.js';

export async function toonSpaar() {
  const s = await sp.spaarInstellingen();
  const wrap = h('div', {});

  if (!s.aan) {
    return legeStaat('🎟️', 'Spaarkaart staat uit',
      'De spaarkaart is op dit moment niet in gebruik. Vraag ernaar in de winkel.');
  }

  const k = await sp.haalKaart();
  const trap = s.trap;
  const volgendeTrede = sp.spaarVolgende(k.tokens, trap);
  const beschikbaar = sp.spaarKeuzes(k.tokens, trap);
  const hoogste = trap[trap.length - 1];

  /* --------------------------------------------- lopende korting, bovenaan */
  if (k.korting) {
    const dagenOver = Math.max(0, Math.ceil((k.korting.vervalt - Date.now()) / 86400e3));
    wrap.append(h('section', { class: 'kaart kaart--goed spaarbon' },
      h('p', { class: 'spaarbon__label' }, 'Uw korting'),
      h('p', { class: 'spaarbon__procent' }, `${k.korting.procent}%`),
      h('p', { class: 'spaarbon__bon' }, `Bon ${k.korting.bon}`),
      h('p', { class: 'klein' },
        dagenOver <= 1 ? 'Geldig tot vanavond.' : `Nog ${dagenOver} dagen geldig, tot ${kortDatum(k.korting.vervalt)}.`),
      k.korting.maxEuro
        ? h('p', { class: 'mini zacht' }, `Maximaal € ${k.korting.maxEuro} korting per keer.`)
        : null,
      s.waarop ? h('p', { class: 'mini zacht' }, s.waarop) : null,
      h('p', { class: 'klein zacht', style: { marginTop: '10px' } }, 'Toon dit scherm aan de kassa.'),
      h('div', { class: 'knoprij', style: { marginTop: '12px' } },
        h('button', {
          class: 'knop knop--primair', onclick: async () => {
            await sp.sluitKorting(true);
            melding('Genoteerd. Uw korting is gebruikt.', 'ok');
            teken();
          },
        }, 'Gebruikt aan de kassa'),
        h('button', {
          class: 'knop knop--stil', onclick: async () => {
            await sp.sluitKorting(false);
            melding('Uw tokens staan terug op de kaart.', 'ok');
            teken();
          },
        }, 'Toch niet, zet terug'))));
  }

  /* --------------------------------------------------------- stand van de kaart */
  const doel = volgendeTrede ? volgendeTrede.tokens : hoogste.tokens;
  const aandeel = Math.min(100, Math.round((k.tokens / doel) * 100));

  wrap.append(h('section', { class: 'kaart spaarstand' },
    h('div', { class: 'rij' },
      h('div', { class: 'spaarstand__cijfer' },
        h('strong', {}, String(k.tokens)),
        h('span', {}, k.tokens === 1 ? 'token' : 'tokens')),
      h('div', { class: 'groei' },
        h('h2', { style: { margin: '0 0 2px' } }, 'Uw spaarkaart'),
        h('p', { class: 'klein zacht', style: { margin: 0 } },
          volgendeTrede
            ? `Nog ${volgendeTrede.tokens - k.tokens} tokens tot ${volgendeTrede.procent} procent korting.`
            : `U staat op de hoogste trede: ${hoogste.procent} procent korting.`))),
    h('div', { class: 'spaarbalk', 'aria-hidden': 'true' },
      h('div', { class: 'spaarbalk__vulling', style: { width: `${aandeel}%` } })),
    h('p', { class: 'mini zacht', style: { marginTop: '8px' } },
      sp.alGescandVandaag(k)
        ? 'U hebt vandaag al een token gespaard. Morgen kan u er weer een bijzetten.'
        : 'Eén token per dag. Vraag de winkelcode aan de toonbank.'),
    h('button', {
      class: 'knop knop--primair knop--groot knop--vol',
      style: { marginTop: '12px' },
      disabled: sp.alGescandVandaag(k),
      onclick: () => vraagWinkelcode(),
    }, sp.alGescandVandaag(k) ? 'Vandaag al gespaard' : '🎟️ Ik ben in de winkel')));

  /* ------------------------------------------------------- omzetten of doorsparen */
  if (!k.korting && beschikbaar.length) {
    wrap.append(kaart('U kiest zelf',
      h('p', { class: 'klein zacht' },
        'U kan uw tokens nu omzetten in korting, of blijven sparen voor een hogere korting. Wat u doet, beslist u.'),
      ...beschikbaar.map((t) => h('button', {
        class: 'klikbaar', onclick: () => bevestigOmzetten(t, s),
      },
        h('span', { class: 'spaarkeuze__procent' }, `${t.procent}%`),
        h('span', { class: 'groei' },
          h('strong', {}, `${t.procent} procent korting nu`), h('br'),
          h('span', { class: 'klein zacht' },
            `Kost ${t.tokens} tokens, u houdt er ${k.tokens - t.tokens} over. ${s.geldigDagen} dagen geldig.`)),
        h('span', { class: 'pijl' }, '›'))),
      volgendeTrede
        ? h('p', { class: 'mini zacht', style: { marginTop: '10px' } },
          `Blijft u sparen, dan haalt u bij ${volgendeTrede.tokens} tokens ${volgendeTrede.procent} procent.`)
        : null));
  }

  /* ------------------------------------------------------------------ de trap */
  wrap.append(kaart('De trap',
    h('div', { class: 'spaartrap' },
      ...trap.map((t) => h('div', {
        class: `spaartrap__trede${k.tokens >= t.tokens ? ' is-behaald' : ''}`,
      },
        h('span', { class: 'spaartrap__tokens' }, `${t.tokens}`),
        h('span', { class: 'spaartrap__procent' }, `${t.procent}%`)))),
    h('p', { class: 'mini zacht' },
      `Eén token per bezoek, maximaal één per dag. Tokens vervallen na ${s.vervalMaanden} maanden zonder bezoek.`),
    s.waarop ? h('p', { class: 'mini zacht' }, s.waarop) : null));

  /* ----------------------------------------------------------------- historiek */
  if (k.geschiedenis?.length) {
    wrap.append(kaart('Wat er gebeurde',
      h('ul', { class: 'lijst lijst--plat' },
        ...k.geschiedenis.slice(0, 12).map((g) => h('li', {},
          h('span', { class: 'groei' }, g.tekst),
          h('span', { class: 'mini zacht' }, geleden(g.ts)))))));
  }

  /* ------------------------------------------------------- hulp en beheerscode */
  wrap.append(kaart('Hulp nodig?',
    h('p', { class: 'klein zacht' },
      'Klopt er iets niet met uw kaart, laat het ons weten in de winkel. Wij zetten ze daar voor u recht.'),
    h('div', { class: 'knoprij' },
      h('button', { class: 'knop knop--stil', onclick: () => ganaar('hulp') }, 'Stel uw vraag'),
      h('button', { class: 'knop knop--stil', onclick: () => beheerDialoog() }, 'Medewerker LUX AQUA'))));

  return wrap;
}

/* ------------------------------------------------------------------- dialogen */

async function vraagWinkelcode() {
  const invoerveld = invoer({
    placeholder: 'Bijvoorbeeld K7M2PX',
    autocapitalize: 'characters',
    autocomplete: 'off',
    spellcheck: 'false',
    maxlength: 8,
    style: { textTransform: 'uppercase', fontSize: '1.3rem', letterSpacing: '.18em', textAlign: 'center' },
  });
  const fout = h('p', { class: 'klein', style: { color: 'var(--kritiek, #c0392b)', minHeight: '1.2em' } }, '');

  const klaar = dialoog({
    titel: 'Winkelcode',
    inhoud: h('div', {},
      h('p', { class: 'klein zacht' },
        'Vraag de code van vandaag aan de toonbank en tik ze hier in. Zo weet de app dat u echt in de winkel staat.'),
      veld('Code van vandaag', invoerveld),
      fout),
    acties: [
      { label: 'Annuleren', waarde: null },
      {
        label: 'Token sparen', stijl: 'knop--primair',
        actie: async () => {
          const r = await sp.voegTokenToe(invoerveld.value);
          if (!r.ok) { fout.textContent = r.reden; return false; }
          melding(r.reden, 'ok');
          teken();
          return true;
        },
      },
    ],
  });
  requestAnimationFrame(() => invoerveld.focus());
  await klaar;
}

async function bevestigOmzetten(trede, s) {
  await dialoog({
    titel: `${trede.procent} procent korting`,
    inhoud: h('div', {},
      h('p', {}, `U zet ${trede.tokens} tokens om in ${trede.procent} procent korting.`),
      h('p', { class: 'klein zacht' },
        `De korting blijft ${s.geldigDagen} dagen geldig. De tokens die u niet gebruikt, blijven gewoon op uw kaart staan.`),
      h('p', { class: 'klein zacht' },
        'Wilt u liever sparen voor een hogere korting, sluit dit venster dan gewoon.')),
    acties: [
      { label: 'Nog even sparen', waarde: null },
      {
        label: 'Omzetten in korting', stijl: 'knop--primair',
        actie: async () => {
          const r = await sp.verzilver(trede.procent);
          melding(r.reden, r.ok ? 'ok' : 'fout');
          if (r.ok) teken();
          return true;
        },
      },
    ],
  });
}

/** Voor een medewerker van LUX AQUA, op het toestel van de klant. */
async function beheerDialoog() {
  const wwveld = invoer({ type: 'password', placeholder: 'Wachtwoord van LUX AQUA', autocomplete: 'off' });
  const aantalveld = invoer({ type: 'number', min: '1', max: '50', value: '1' });
  const fout = h('p', { class: 'klein', style: { color: 'var(--kritiek, #c0392b)', minHeight: '1.2em' } }, '');

  await dialoog({
    titel: 'Medewerker LUX AQUA',
    inhoud: h('div', {},
      h('p', { class: 'klein zacht' },
        'Enkel voor een medewerker van LUX AQUA. Met het wachtwoord van LUX AQUA zet u de kaart terug op nul of schrijft u een vergeten bezoek bij. ' +
        'Er blijft niets van deze aanmelding achter op dit toestel.'),
      veld('Wachtwoord', wwveld),
      veld('Aantal bij te schrijven', aantalveld, 'Enkel van toepassing bij bijschrijven.'),
      fout),
    acties: [
      { label: 'Sluiten', waarde: null },
      {
        label: 'Bijschrijven',
        actie: async () => {
          const r = await sp.bijschrijven(aantalveld.value, wwveld.value);
          if (!r.ok) { fout.textContent = r.reden; return false; }
          melding(r.reden, 'ok'); teken(); return true;
        },
      },
      {
        label: 'Kaart op nul', stijl: 'knop--gevaar',
        actie: async () => {
          const r = await sp.resetKaart(wwveld.value);
          if (!r.ok) { fout.textContent = r.reden; return false; }
          melding(r.reden, 'ok'); teken(); return true;
        },
      },
    ],
  });
}

/** Klein blok voor het startscherm. Geeft null terug als er niets te melden valt. */
export async function spaarBlokVoorStart() {
  const s = await sp.spaarInstellingen();
  if (!s.aan) return null;
  const k = await sp.haalKaart();

  if (k.korting) {
    const dagenOver = Math.max(0, Math.ceil((k.korting.vervalt - Date.now()) / 86400e3));
    return h('section', { class: 'kaart kaart--goed klikbaar-kaart', onclick: () => ganaar('spaar') },
      h('div', { class: 'rij' },
        h('span', { style: { fontSize: '30px' } }, '🎟️'),
        h('div', { class: 'groei' },
          h('strong', {}, `${k.korting.procent} procent korting klaar`), h('br'),
          h('span', { class: 'klein zacht' },
            dagenOver <= 1 ? 'Geldig tot vanavond. Toon bon ' + k.korting.bon + ' aan de kassa.'
              : `Nog ${dagenOver} dagen geldig. Bon ${k.korting.bon}.`)),
        h('span', { class: 'pijl' }, '›')));
  }

  const volgendeTrede = sp.spaarVolgende(k.tokens, s.trap);
  const klaar = sp.spaarKeuzes(k.tokens, s.trap);
  if (!k.tokens && !klaar.length) return null;

  return h('section', { class: 'kaart klikbaar-kaart', onclick: () => ganaar('spaar') },
    h('div', { class: 'rij' },
      h('span', { style: { fontSize: '30px' } }, '🎟️'),
      h('div', { class: 'groei' },
        h('strong', {}, `${k.tokens} ${k.tokens === 1 ? 'token' : 'tokens'} gespaard`), h('br'),
        h('span', { class: 'klein zacht' },
          klaar.length
            ? `U kan nu ${klaar[0].procent} procent korting nemen, of verder sparen.`
            : volgendeTrede ? `Nog ${volgendeTrede.tokens - k.tokens} tot ${volgendeTrede.procent} procent korting.` : '')),
      h('span', { class: 'pijl' }, '›')));
}
