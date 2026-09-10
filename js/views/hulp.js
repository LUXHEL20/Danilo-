/**
 * "Ik heb hulp nodig": een huisbezoek aanvragen, ter plaatse laten testen en
 * bijsturen, of eerst advies op afstand met het volledige dossier erbij.
 */
import { h, kaart, badge, veld, invoer, tekstvak, keuze, melding, dialoog, datum, geleden, kopieer } from '../ui.js';
import { ctx, ganaar, teken } from '../app.js';
import * as store from '../store.js';
import { maakDossier, dossierAlsTekst, exporteerDossier, deelDossier, whatsappLink, mailLink, printDossier, stuurNaarServer } from '../delen.js';
import { maakAdvies } from '../advies.js';
import { thumbnail, comprimeer } from '../strip.js';
import { isNative, kiesFoto } from '../native.js';

const SOORTEN = [
  { id: 'huisbezoek', icoon: '🏠', titel: 'Huisbezoek voor advies', tekst: 'Iemand van Lux Aqua komt langs, bekijkt je installatie en geeft advies ter plaatse.' },
  { id: 'testen', icoon: '🧪', titel: 'Komen testen en bijsturen', tekst: 'We meten alles zelf na met druppeltests en sturen je water ter plaatse bij.' },
  { id: 'afstand', icoon: '📱', titel: 'Advies op afstand', tekst: 'Je stuurt je dossier met foto\'s door en krijgt een eerste inschatting zonder bezoek.' },
  { id: 'noodgeval', icoon: '🚨', titel: 'Noodgeval', tekst: 'Je vissen zijn in nood: ze happen naar adem, hangen stil of er is sterfte.' },
];

const URGENTIES = [
  { id: 'laag', label: 'Geen haast' },
  { id: 'normaal', label: 'Binnen de week' },
  { id: 'dringend', label: 'Zo snel mogelijk' },
  { id: 'nood', label: 'Vandaag nog — noodgeval' },
];

export async function toonHulp() {
  const bak = ctx.bak;
  const instellingen = await store.instellingen();
  const wrap = h('div', {});

  if (!bak) {
    wrap.append(kaart('🆘 Hulp nodig?',
      h('p', {}, 'Maak eerst je bak aan, dan kunnen we meteen je gegevens meesturen.'),
      h('button', { class: 'knop knop--primair knop--vol', onclick: () => ganaar('bak/nieuw') }, 'Bak toevoegen')));
    return wrap;
  }

  const metingen = await store.metingenVanBak(bak.id);
  const catalogus = await store.catalogus();
  const advies = metingen[0] ? maakAdvies(metingen[0], bak, metingen.slice(1), catalogus) : null;
  const eerdere = (await store.hulpvragenVanKlant(bak.klantId)).sort((a, b) => b.aangemaakt - a.aangemaakt);

  /* --- hoofdknop --- */
  wrap.append(h('section', { class: 'hulpblok' },
    h('h3', {}, '🆘 Ik heb hulp nodig'),
    h('p', {}, 'Kies wat je nodig hebt. Je bakgegevens, vissenbestand, laatste metingen, foto\'s en het advies gaan automatisch mee, ' +
      'zodat Lux Aqua van op afstand al een goed eerste beeld heeft.'),
    ...SOORTEN.map((s) => h('button', {
      class: 'knop knop--vol', style: { marginBottom: '8px', justifyContent: 'flex-start' },
      onclick: () => hulpFormulier(s.id, bak, advies, instellingen),
    }, `${s.icoon}  ${s.titel}`))));

  if (advies?.huisbezoekAangeraden) {
    wrap.append(h('section', { class: 'kaart kaart--kritiek' },
      h('h3', {}, 'Je laatste meting vraagt aandacht'),
      h('p', { class: 'klein' }, advies.samenvatting),
      h('p', { class: 'klein zacht' }, 'Start ondertussen alvast met de voorgestelde acties op je startscherm — dat is meestal de helft van de oplossing.')));
  }

  /* --- eerste hulp --- */
  wrap.append(kaart('🚑 Eerste hulp bij paniek',
    h('p', { class: 'klein zacht' }, 'Doe dit terwijl je op antwoord wacht. Het lost de oorzaak niet op, maar het houdt je vissen recht.'),
    h('ul', { class: 'opsomming klein' },
      h('li', {}, h('strong', {}, 'Vissen happen aan het oppervlak: '), 'zet extra beluchting bij, verlaag de temperatuur traag, stop met voederen.'),
      h('li', {}, h('strong', {}, 'Nitriet of ammoniak gemeten: '), 'ververs 30 tot 50% water op temperatuur, met waterbereider, en voeder 48 uur niet.'),
      h('li', {}, h('strong', {}, 'Troebel of stinkend water: '), 'zuig de bodem af, spoel je filter uit in aquariumwater (nooit onder de kraan).'),
      h('li', {}, h('strong', {}, 'Plotse sterfte: '), 'haal dode dieren er meteen uit, ververs water, meet NO₂, NH₄ en pH, en verander verder niets tot je advies hebt.'),
      h('li', {}, h('strong', {}, 'Na een behandeling: '), 'geen actieve kool in de filter tijdens de kuur, wel erna om restanten weg te halen.'))));

  /* --- dossier delen zonder hulpvraag --- */
  wrap.append(kaart('📤 Mijn dossier delen',
    h('p', { class: 'klein zacht' }, 'Je kan je dossier ook gewoon doorsturen, bijvoorbeeld als je in de winkel langskomt of iets wil laten nakijken.'),
    h('div', { class: 'knoprij' },
      h('button', { class: 'knop knop--primair', onclick: async () => deelDossier(await maakDossier(bak.id)) }, '📤 Delen'),
      h('button', { class: 'knop knop--stil', onclick: async () => exporteerDossier(await maakDossier(bak.id)) }, '⬇️ Bestand'),
      h('button', { class: 'knop knop--stil', onclick: async () => printDossier(await maakDossier(bak.id)) },
        isNative() ? '📄 Dossier als bestand delen' : '🖨️ Afdrukken / pdf'))));

  /* --- eerdere vragen --- */
  if (eerdere.length) {
    const blok = kaart('Mijn hulpvragen');
    for (const v of eerdere) {
      blok.append(h('details', { class: 'uitklap' },
        h('summary', {},
          h('span', { class: 'groei' }, SOORTEN.find((s) => s.id === v.type)?.titel || v.type, h('br'),
            h('span', { class: 'mini zacht' }, geleden(v.aangemaakt))),
          badge(v.status, v.status === 'afgerond' ? 'goed' : v.status === 'nieuw' ? 'let-op' : 'info')),
        h('div', { class: 'uitklap__inhoud' },
          h('p', { class: 'klein' }, v.omschrijving || 'Geen omschrijving.'),
          v.beschikbaarheid ? h('p', { class: 'mini zacht' }, `Beschikbaar: ${v.beschikbaarheid}`) : null,
          h('p', { class: 'mini zacht' }, `Aangemaakt op ${datum(v.aangemaakt)} · urgentie: ${v.urgentie}`),
          v.antwoord ? h('div', { class: 'kaart kaart--goed' }, h('strong', {}, 'Antwoord van Lux Aqua: '), v.antwoord) : null)));
    }
    wrap.append(blok);
  }

  /* --- contact --- */
  const b = instellingen.bedrijf || {};
  if (b.telefoon || b.email || b.website) {
    wrap.append(kaart('Contact',
      h('ul', { class: 'lijst' },
        b.telefoon ? h('li', {}, h('span', {}, '📞'), h('a', { href: `tel:${b.telefoon.replace(/\s/g, '')}` }, b.telefoon)) : null,
        b.email ? h('li', {}, h('span', {}, '✉️'), h('a', { href: `mailto:${b.email}` }, b.email)) : null,
        b.website ? h('li', {}, h('span', {}, '🌐'), h('a', { href: b.website, target: '_blank', rel: 'noopener' }, b.website)) : null)));
  }

  return wrap;
}

/* ------------------------------------------------------------------ formulier */
async function hulpFormulier(soortId, bak, advies, instellingen) {
  const soort = SOORTEN.find((s) => s.id === soortId);
  const urgentie = keuze(URGENTIES.map((u) => ({
    value: u.id, label: u.label,
    selected: soortId === 'noodgeval' ? u.id === 'nood' : u.id === 'normaal',
  })));
  const omschrijving = tekstvak({
    placeholder: 'Wat is er aan de hand? Wat heb je al geprobeerd? Sinds wanneer speelt het?',
    value: advies?.huisbezoekAangeraden ? `Uit mijn laatste meting: ${advies.samenvatting}\n\n` : '',
  });
  const beschikbaarheid = invoer({ placeholder: 'bv. weekdagen na 17 u, zaterdagvoormiddag' });
  const metFotos = h('input', { type: 'checkbox', checked: true });
  const metMetingen = h('input', { type: 'checkbox', checked: true });

  const extraFotos = [];
  const fotoVoorbeeld = h('div', { class: 'fotoraster' });
  const fotosKiezen = () => kiesFoto({ bron: 'vraag', meerdere: true }).then(async (bestanden) => {
    for (const f of bestanden) {
      const thumb = await thumbnail(f, 420);
      const blob = await comprimeer(f, 1400, 0.82);
      extraFotos.push({ thumb, blob });
      fotoVoorbeeld.append(h('img', { src: thumb, alt: '' }));
    }
  });

  const bevestigd = await dialoog({
    titel: `${soort.icoon} ${soort.titel}`, breed: true,
    inhoud: h('div', {},
      h('p', { class: 'klein zacht' }, soort.tekst),
      soortId === 'noodgeval' ? h('div', { class: 'kaart kaart--kritiek' },
        h('strong', {}, 'Doe dit nu al: '),
        'zet extra beluchting bij, ververs 30 tot 50% water op temperatuur met waterbereider, stop met voederen en verander verder niets.') : null,
      veld('Hoe dringend is het?', urgentie),
      veld('Wat is er aan de hand?', omschrijving),
      soortId !== 'afstand' ? veld('Wanneer past een bezoek?', beschikbaarheid) : null,
      veld('Extra foto\'s meesturen', h('div', {},
        h('button', { class: 'knop knop--stil', onclick: fotosKiezen }, '📷 Foto toevoegen'), fotoVoorbeeld),
        'Een foto van de volledige bak, van het probleem en van je filter helpt enorm.'),
      h('label', { class: 'rij klein', style: { gap: '8px', marginBottom: '6px' } }, metMetingen, h('span', {}, 'Mijn laatste metingen meesturen')),
      h('label', { class: 'rij klein', style: { gap: '8px' } }, metFotos, h('span', {}, 'Mijn foto\'s uit de app meesturen')),
      h('p', { class: 'mini zacht', style: { marginTop: '10px' } },
        'Je gegevens worden pas verstuurd wanneer je hieronder zelf een manier van doorsturen kiest.')),
    acties: [
      { label: 'Annuleren', waarde: false },
      { label: 'Doorgaan', stijl: 'knop--primair', waarde: true },
    ],
  });
  if (!bevestigd) return;

  for (const f of extraFotos) {
    await store.bewaarFoto({ bakId: bak.id, blob: f.blob, thumb: f.thumb, soort: 'probleem', notitie: 'Bij hulpvraag' });
  }

  const hulpvraag = await store.bewaarHulpvraag({
    klantId: bak.klantId, bakId: bak.id, type: soort.titel, typeId: soortId,
    urgentie: URGENTIES.find((u) => u.id === urgentie.value)?.label || urgentie.value,
    omschrijving: omschrijving.value.trim(),
    beschikbaarheid: beschikbaarheid.value.trim(),
    status: 'nieuw',
  });

  const dossier = await maakDossier(bak.id, {
    fotos: metFotos.checked,
    aantalMetingen: metMetingen.checked ? 12 : 0,
    hulpvraag,
  });
  await store.logboek(bak.id, `Hulpvraag aangemaakt: ${soort.titel}`, 'hulp');
  await verstuurKeuze(dossier, instellingen);
  teken();
}

/** Laat de klant kiezen hoe de hulpvraag bij Lux Aqua geraakt. */
async function verstuurKeuze(dossier, instellingen) {
  const tekst = dossierAlsTekst(dossier);
  const b = instellingen.bedrijf || {};
  await dialoog({
    titel: 'Hoe stuur je dit door?', breed: true,
    inhoud: h('div', {},
      h('p', { class: 'klein zacht' }, 'Je hulpvraag is bewaard in de app. Kies hieronder hoe je ze bij Lux Aqua krijgt.'),
      h('div', { class: 'kolom' },
        h('button', { class: 'knop knop--primair knop--vol', onclick: () => deelDossier(dossier) }, '📤 Delen via mijn toestel (WhatsApp, mail, …)'),
        h('a', { class: 'knop knop--stil knop--vol', href: whatsappLink(tekst, b.telefoon || ''), target: '_blank', rel: 'noopener' }, '💬 Via WhatsApp'),
        h('a', { class: 'knop knop--stil knop--vol', href: mailLink(tekst, b.email || ''), target: '_blank', rel: 'noopener' }, '✉️ Via e-mail'),
        h('button', { class: 'knop knop--stil knop--vol', onclick: () => exporteerDossier(dossier) }, '⬇️ Als bestand bewaren'),
        h('button', { class: 'knop knop--stil knop--vol', onclick: () => printDossier(dossier) },
          isNative() ? '📄 Dossier als bestand delen' : '🖨️ Afdrukken of als pdf bewaren'),
        h('button', { class: 'knop knop--stil knop--vol', onclick: () => kopieer(tekst) }, '📋 Samenvatting kopiëren'),
        instellingen.koppeling?.url
          ? h('button', {
            class: 'knop knop--stil knop--vol', onclick: async () => {
              const r = await stuurNaarServer(dossier);
              if (r.ok) melding('Doorgestuurd naar Lux Aqua.', 'ok');
            },
          }, '☁️ Rechtstreeks naar Lux Aqua sturen') : null),
      h('details', { class: 'uitklap', style: { marginTop: '12px' } },
        h('summary', {}, 'Wat wordt er precies verstuurd?'),
        h('div', { class: 'uitklap__inhoud' },
          h('pre', { class: 'mini', style: { whiteSpace: 'pre-wrap', margin: 0 } }, tekst),
          dossier.fotos?.length ? h('p', { class: 'mini zacht' }, `+ ${dossier.fotos.length} foto('s)`) : null))),
    acties: [{ label: 'Klaar', stijl: 'knop--primair', waarde: true }],
  });
  melding('Je hulpvraag staat genoteerd.', 'ok');
}
