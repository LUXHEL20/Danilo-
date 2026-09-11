/** Eerste opstart: rol kiezen, gegevens invullen en de eerste bak aanmaken. */
import { h, veld, invoer, keuze, tekstvak, melding } from '../ui.js';
import * as store from '../store.js';
import { PROFILES } from '../params.js';
import { teken, logoElement } from '../app.js';
import { isNative } from '../native.js';

/**
 * Waarschuwing enkel op een iPhone in Safari, zolang de app nog niet vanaf het beginscherm draait.
 * Op iOS krijgt de app op het beginscherm een eigen, lege opslag: wie eerst in de browser gegevens
 * ingeeft en pas daarna het icoon maakt, begint opnieuw. In de Capacitor-app klopt dit niet
 * (display-mode is daar ook standalone), vandaar de controle op isNative().
 */
function beginschermTip() {
  if (isNative()) return null;
  const ua = navigator.userAgent || '';
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (!isIOS) return null;
  const opBeginscherm = window.matchMedia?.('(display-mode: standalone)')?.matches === true || navigator.standalone === true;
  if (opBeginscherm) return null;
  return h('div', { class: 'kaart', style: { marginBottom: '12px' } },
    h('strong', {}, '📲 Zet LUX AQUA eerst op uw beginscherm, anders begint u straks opnieuw.'),
    h('p', { class: 'klein zacht', style: { margin: '6px 0 0' } },
      'Tik onderaan op de deelknop, veeg naar beneden en kies Zet op beginscherm. Open de app daarna ' +
      'via het nieuwe icoon. Wat u nu al invult, gaat anders niet mee.'));
}

export async function toonOnboarding() {
  const houder = h('div', { class: 'onboarding' });
  let stap = 0;
  const gegevens = { rol: 'klant', klant: {}, bak: { profiel: 'zoet_gezelschap' } };

  const stappen = [welkom, rolKeuze, klantGegevens, bakGegevens, klaar];

  function volgende() { stap = Math.min(stappen.length - 1, stap + 1); render(); }
  function vorige() { stap = Math.max(0, stap - 1); render(); }

  function render() {
    houder.replaceChildren(...[
      beginschermTip(),
      h('div', { class: 'voortgang', style: { margin: '0 0 16px' } },
        h('span', { style: { width: `${((stap + 1) / stappen.length) * 100}%` } })),
      stappen[stap](),
    ].filter(Boolean));
  }

  function welkom() {
    return h('div', { class: 'kaart' },
      h('div', { class: 'midden' },
        logoElement(null, 'logo-groot', 'auto'),
        h('h1', { style: { marginTop: '10px' } }, 'Welkom bij LUX AQUA'),
        h('p', { class: 'zacht' },
          'Met deze app houdt u uw waterwaarden bij, leest u uw teststrip in met de camera ' +
          'en ziet u meteen wat u kan doen. Loopt het toch mis, dan vraagt u met één knop hulp of een huisbezoek.')),
      h('ul', { class: 'lijst' },
        ...[
          ['🧪', 'Teststrip fotograferen', 'De app leest de kleuren en stelt de waarden al voor.'],
          ['📈', 'Alles bijhouden', 'U ziet de evolutie van uw bak in één oogopslag.'],
          ['🧴', 'Concreet advies', 'Welk product, hoeveel, en wat u nadien moet opvolgen.'],
          ['🆘', 'Hulp op afstand of aan huis', 'Deel uw volledige dossier met foto\'s in één klik.'],
        ].map(([i, t, o]) => h('li', {}, h('span', { style: { fontSize: '22px' } }, i),
          h('span', {}, h('strong', {}, t), h('br'), h('span', { class: 'klein zacht' }, o))))),
      h('button', { class: 'knop knop--primair knop--vol knop--groot', onclick: volgende }, 'Beginnen'));
  }

  function rolKeuze() {
    const kies = async (rol) => { gegevens.rol = rol; if (rol === 'luxaqua') await afronden(); else volgende(); };
    return h('div', { class: 'kaart' },
      h('h2', {}, 'Wie bent u?'),
      h('button', { class: 'klikbaar', onclick: () => kies('klant') },
        h('span', { style: { fontSize: '24px' } }, '🏠'),
        h('span', {}, h('strong', {}, 'Ik ben klant'), h('br'),
          h('span', { class: 'klein zacht' }, 'Ik onderhoud mijn eigen aquarium of vijver.')),
        h('span', { class: 'pijl' }, '›')),
      h('button', { class: 'klikbaar', onclick: () => kies('luxaqua') },
        h('span', { style: { fontSize: '24px' } }, '🛠️'),
        h('span', {}, h('strong', {}, 'Ik werk bij LUX AQUA'), h('br'),
          h('span', { class: 'klein zacht' }, 'Ik volg de klanten en hun waarden op.')),
        h('span', { class: 'pijl' }, '›')),
      h('button', { class: 'knop knop--stil knop--vol', onclick: vorige }, 'Terug'));
  }

  function klantGegevens() {
    const naam = invoer({ placeholder: 'Voornaam en naam', autocomplete: 'name' });
    const tel = invoer({ type: 'tel', placeholder: '04xx xx xx xx', autocomplete: 'tel' });
    const mail = invoer({ type: 'email', placeholder: 'naam@voorbeeld.be', autocomplete: 'email' });
    const gemeente = invoer({ placeholder: 'Gemeente', autocomplete: 'address-level2' });
    const adres = invoer({ placeholder: 'Straat en nummer', autocomplete: 'street-address' });
    return h('div', { class: 'kaart' },
      h('h2', {}, 'Uw gegevens'),
      h('p', { class: 'klein zacht' }, 'Deze gegevens blijven op uw toestel staan. Ze worden pas gedeeld wanneer u zelf een dossier of hulpvraag doorstuurt naar LUX AQUA.'),
      veld('Naam', naam),
      veld('Telefoon', tel, 'Zo kunnen wij u snel bereiken bij een dringende hulpvraag.'),
      veld('E-mail', mail),
      veld('Adres', adres),
      veld('Gemeente', gemeente),
      h('div', { class: 'knoprij' },
        h('button', { class: 'knop knop--stil', onclick: vorige }, 'Terug'),
        h('button', {
          class: 'knop knop--primair', onclick: () => {
            if (!naam.value.trim()) { melding('Vul zeker uw naam in.', 'fout'); naam.focus(); return; }
            gegevens.klant = { naam: naam.value.trim(), telefoon: tel.value.trim(), email: mail.value.trim(), adres: adres.value.trim(), gemeente: gemeente.value.trim() };
            volgende();
          },
        }, 'Volgende')));
  }

  function bakGegevens() {
    const naam = invoer({ placeholder: 'bv. Woonkamer 300 l', value: 'Mijn aquarium' });
    const prof = keuze(Object.values(PROFILES).map((p) => ({ value: p.id, label: `${p.group}: ${p.label}` })));
    const lengte = invoer({ type: 'number', inputmode: 'decimal', placeholder: 'L (cm)' });
    const breedte = invoer({ type: 'number', inputmode: 'decimal', placeholder: 'B (cm)' });
    const hoogte = invoer({ type: 'number', inputmode: 'decimal', placeholder: 'H (cm)' });
    const liters = invoer({ type: 'number', inputmode: 'decimal', placeholder: 'Aantal liter' });
    const opgestart = invoer({ type: 'date' });

    const herbereken = () => {
      const l = store.berekenLiters({ lengte: lengte.value, breedte: breedte.value, hoogte: hoogte.value });
      if (l) liters.value = l;
    };
    [lengte, breedte, hoogte].forEach((i) => i.addEventListener('input', herbereken));

    return h('div', { class: 'kaart' },
      h('h2', {}, 'Uw bak of vijver'),
      veld('Naam', naam),
      veld('Type', prof, 'Hiermee weet de app welke streefwaarden voor u gelden.'),
      h('div', { class: 'raster3' },
        veld('Lengte', lengte), veld('Breedte', breedte), veld('Hoogte', hoogte)),
      veld('Netto inhoud (liter)', liters, 'Wordt automatisch berekend uit de afmetingen (min ongeveer 10% voor bodem en decoratie). U mag hem zelf aanpassen.'),
      veld('Opgestart op', opgestart, 'Een jonge bak van minder dan 6 weken vraagt extra opvolging.'),
      h('div', { class: 'knoprij' },
        h('button', { class: 'knop knop--stil', onclick: vorige }, 'Terug'),
        h('button', {
          class: 'knop knop--primair', onclick: () => {
            gegevens.bak = {
              naam: naam.value.trim() || 'Mijn aquarium',
              profiel: prof.value,
              liters: Number(liters.value) || 0,
              afmetingen: { lengte: Number(lengte.value) || 0, breedte: Number(breedte.value) || 0, hoogte: Number(hoogte.value) || 0 },
              opgestart: opgestart.value ? new Date(opgestart.value).getTime() : null,
            };
            volgende();
          },
        }, 'Volgende')));
  }

  function klaar() {
    const filter = invoer({ placeholder: 'bv. buitenfilter 1000 l/u' });
    const verlichting = invoer({ placeholder: 'bv. led 8 u per dag' });
    const opmerking = tekstvak({ placeholder: 'Wat wilt u graag verbeteren? Wat loopt er nu mis?' });
    return h('div', { class: 'kaart' },
      h('h2', {}, 'Nog even dit (mag u overslaan)'),
      h('p', { class: 'klein zacht' }, 'Hoe meer LUX AQUA weet, hoe gerichter het advies van op afstand.'),
      veld('Filter', filter),
      veld('Verlichting', verlichting),
      veld('Wat wilt u bereiken?', opmerking),
      h('div', { class: 'knoprij' },
        h('button', { class: 'knop knop--stil', onclick: vorige }, 'Terug'),
        h('button', {
          class: 'knop knop--primair', onclick: async () => {
            gegevens.bak.filter = filter.value.trim();
            gegevens.bak.verlichting = verlichting.value.trim();
            gegevens.bak.opmerking = opmerking.value.trim();
            await afronden();
          },
        }, 'Klaar, start de app')));
  }

  async function afronden() {
    if (gegevens.rol === 'luxaqua') {
      await store.zetInstelling({ rol: 'luxaqua', onboardingKlaar: true });
      melding('Beheerdersmodus actief.', 'ok');
      location.hash = '#/klanten';
      teken();
      return;
    }
    const klant = await store.bewaarKlant(gegevens.klant);
    const bak = await store.bewaarBak({ ...gegevens.bak, klantId: klant.id });
    await store.zetInstelling({ rol: 'klant', actieveKlant: klant.id, actieveBak: bak.id, onboardingKlaar: true });
    melding(`Welkom ${klant.naam.split(' ')[0]}! Uw bak is aangemaakt.`, 'ok');
    location.hash = '#/start';
    teken();
  }

  render();
  return houder;
}
