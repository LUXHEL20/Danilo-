/** Eerste opstart: rol kiezen, gegevens invullen en de eerste bak aanmaken. */
import { h, veld, invoer, keuze, tekstvak, melding } from '../ui.js';
import * as store from '../store.js';
import { PROFILES } from '../params.js';
import { teken } from '../app.js';

export async function toonOnboarding() {
  const houder = h('div', { class: 'onboarding' });
  let stap = 0;
  const gegevens = { rol: 'klant', klant: {}, bak: { profiel: 'zoet_gezelschap' } };

  const stappen = [welkom, rolKeuze, klantGegevens, bakGegevens, klaar];

  function volgende() { stap = Math.min(stappen.length - 1, stap + 1); render(); }
  function vorige() { stap = Math.max(0, stap - 1); render(); }

  function render() {
    houder.replaceChildren(
      h('div', { class: 'voortgang', style: { margin: '0 0 16px' } },
        h('span', { style: { width: `${((stap + 1) / stappen.length) * 100}%` } })),
      stappen[stap](),
    );
  }

  function welkom() {
    return h('div', { class: 'kaart' },
      h('div', { class: 'midden' },
        h('div', { style: { fontSize: '52px' } }, '💧'),
        h('h1', {}, 'Welkom bij Lux Aqua'),
        h('p', { class: 'zacht' },
          'Met deze app hou je je waterwaarden bij, lees je je teststrip in met de camera ' +
          'en krijg je meteen te zien wat je kan doen. Loopt het toch mis, dan vraag je met één knop hulp of een huisbezoek.')),
      h('ul', { class: 'lijst' },
        ...[
          ['🧪', 'Teststrip fotograferen', 'De app leest de kleuren en stelt de waarden al voor.'],
          ['📈', 'Alles bijhouden', 'Je ziet de evolutie van je bak in één oogopslag.'],
          ['🧴', 'Concreet advies', 'Welk product, hoeveel, en wat je nadien moet opvolgen.'],
          ['🆘', 'Hulp op afstand of aan huis', 'Deel je volledig dossier met foto\'s in één klik.'],
        ].map(([i, t, o]) => h('li', {}, h('span', { style: { fontSize: '22px' } }, i),
          h('span', {}, h('strong', {}, t), h('br'), h('span', { class: 'klein zacht' }, o))))),
      h('button', { class: 'knop knop--primair knop--vol knop--groot', onclick: volgende }, 'Beginnen'));
  }

  function rolKeuze() {
    const kies = async (rol) => { gegevens.rol = rol; if (rol === 'luxaqua') await afronden(); else volgende(); };
    return h('div', { class: 'kaart' },
      h('h2', {}, 'Wie ben je?'),
      h('button', { class: 'klikbaar', onclick: () => kies('klant') },
        h('span', { style: { fontSize: '24px' } }, '🏠'),
        h('span', {}, h('strong', {}, 'Ik ben klant'), h('br'),
          h('span', { class: 'klein zacht' }, 'Ik hou mijn eigen aquarium of vijver op.')),
        h('span', { class: 'pijl' }, '›')),
      h('button', { class: 'klikbaar', onclick: () => kies('luxaqua') },
        h('span', { style: { fontSize: '24px' } }, '🛠️'),
        h('span', {}, h('strong', {}, 'Ik werk bij Lux Aqua'), h('br'),
          h('span', { class: 'klein zacht' }, 'Ik volg de klanten en hun waarden op.')),
        h('span', { class: 'pijl' }, '›')),
      h('button', { class: 'knop knop--stil knop--vol', onclick: vorige }, 'Terug'));
  }

  function klantGegevens() {
    const naam = invoer({ placeholder: 'Voornaam en naam', autocomplete: 'name' });
    const tel = invoer({ type: 'tel', placeholder: '04xx xx xx xx', autocomplete: 'tel' });
    const mail = invoer({ type: 'email', placeholder: 'jij@voorbeeld.be', autocomplete: 'email' });
    const gemeente = invoer({ placeholder: 'Gemeente', autocomplete: 'address-level2' });
    const adres = invoer({ placeholder: 'Straat en nummer', autocomplete: 'street-address' });
    return h('div', { class: 'kaart' },
      h('h2', {}, 'Jouw gegevens'),
      h('p', { class: 'klein zacht' }, 'Deze gegevens blijven op je toestel staan. Ze worden pas gedeeld wanneer jij zelf een dossier of hulpvraag doorstuurt naar Lux Aqua.'),
      veld('Naam', naam),
      veld('Telefoon', tel, 'Zo kunnen we je snel bereiken bij een dringende hulpvraag.'),
      veld('E-mail', mail),
      veld('Adres', adres),
      veld('Gemeente', gemeente),
      h('div', { class: 'knoprij' },
        h('button', { class: 'knop knop--stil', onclick: vorige }, 'Terug'),
        h('button', {
          class: 'knop knop--primair', onclick: () => {
            if (!naam.value.trim()) { melding('Vul zeker je naam in.', 'fout'); naam.focus(); return; }
            gegevens.klant = { naam: naam.value.trim(), telefoon: tel.value.trim(), email: mail.value.trim(), adres: adres.value.trim(), gemeente: gemeente.value.trim() };
            volgende();
          },
        }, 'Volgende')));
  }

  function bakGegevens() {
    const naam = invoer({ placeholder: 'bv. Woonkamer 300 l', value: 'Mijn aquarium' });
    const prof = keuze(Object.values(PROFILES).map((p) => ({ value: p.id, label: `${p.group} — ${p.label}` })));
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
      h('h2', {}, 'Je bak of vijver'),
      veld('Naam', naam),
      veld('Type', prof, 'Hiermee weet de app welke streefwaarden voor jou gelden.'),
      h('div', { class: 'raster3' },
        veld('Lengte', lengte), veld('Breedte', breedte), veld('Hoogte', hoogte)),
      veld('Netto inhoud (liter)', liters, 'Wordt automatisch berekend uit de afmetingen (min ongeveer 10% voor bodem en decoratie). Je mag hem zelf aanpassen.'),
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
    const opmerking = tekstvak({ placeholder: 'Wat wil je graag verbeteren? Wat loopt er nu mis?' });
    return h('div', { class: 'kaart' },
      h('h2', {}, 'Nog even dit (mag je overslaan)'),
      h('p', { class: 'klein zacht' }, 'Hoe meer Lux Aqua weet, hoe beter het advies van op afstand.'),
      veld('Filter', filter),
      veld('Verlichting', verlichting),
      veld('Wat wil je bereiken?', opmerking),
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
    melding(`Welkom ${klant.naam.split(' ')[0]}! Je bak is aangemaakt.`, 'ok');
    location.hash = '#/start';
    teken();
  }

  render();
  return houder;
}
