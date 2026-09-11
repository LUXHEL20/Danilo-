/** Beheer en instellingen: rol, bedrijfsgegevens, producten, ijking en back-ups. */
import { h, kaart, badge, veld, invoer, tekstvak, keuze, melding, dialoog, bevestig, download, datum, kopieer } from '../ui.js';
import * as sp from '../spaarkaart.js';
import { meldAf, wijzigWachtwoord, beheerderEmail } from '../auth.js';
import { koppels as kweekKoppels } from '../kweek.js';
import { ganaar, teken } from '../app.js';
import * as store from '../store.js';
import * as db from '../db.js';
import { CATEGORIEEN, assortimentControle } from '../products.js';
import { PARAMETERS, STRIP_PRESETS, param } from '../params.js';
import { laadAfbeelding, naarCanvas, leesKleurenkaart, thumbnail } from '../strip.js';
import { rgbToCss } from '../color.js';
import { importeerBestand } from './luxaqua.js';
import { isNative, kiesFoto, bewaarEnDeelBestand } from '../native.js';

export async function toonBeheer() {
  const i = await store.instellingen();
  const wrap = h('div', {});
  const isLux = i.rol === 'luxaqua';

  /* --- aanmelding --- */
  wrap.append(isLux
    ? kaart('🛠️ LUX AQUA',
      h('p', { class: 'klein zacht' },
        `U bent aangemeld als ${await beheerderEmail()}. U ziet uw klanten, hun hulpvragen en de codes van de spaarkaart.`),
      h('p', { class: 'mini zacht' },
        'De aanmelding vervalt vanzelf na twaalf uur. Meldt u af wanneer u de app aan iemand anders geeft.'),
      h('div', { class: 'knoprij' },
        h('button', {
          class: 'knop knop--stil',
          onclick: async () => { await meldAf(); ganaar('start'); teken(); },
        }, '🏠 Afmelden'),
        h('button', { class: 'knop knop--stil', onclick: () => wachtwoordDialoog() }, '🔑 Wachtwoord wijzigen')))
    : kaart('🛠️ Bent u van LUX AQUA?',
      h('p', { class: 'klein zacht' },
        'Meld u aan om uw klanten, hun hulpvragen en de codes van de spaarkaart te zien. ' +
        'Als klant hebt u dit niet nodig.'),
      h('button', { class: 'knop knop--stil', onclick: () => ganaar('aanmelden') }, 'Aanmelden')));

  /* --- logo --- */
  const logoVoorbeeld = h('div', { class: 'rij', style: { marginBottom: '10px' } },
    i.logo
      ? h('img', { src: i.logo, class: 'logo-groot logo-groot--eigen', alt: 'Huidig logo' })
      : h('img', { src: 'assets/brand/LUX-AQUA-01-navy.svg', class: 'logo-groot', alt: 'LUX AQUA' }),
    h('span', { class: 'klein zacht' }, i.logo ? 'Een eigen logo is opgeladen.' : 'Het officiële LUX AQUA-logo wordt gebruikt.'));
  // het logo is een bestand, geen foto: ook natief via de gewone bestandskiezer,
  // zodat svg en een transparante png intact blijven (de camera-plugin maakt er jpeg van)
  const logoKiezen = () => kiesFoto({ bron: 'galerij', bestand: true, accept: 'image/*,.svg' }).then(async ([f]) => {
    if (!f) return;
    try {
      // svg en kleine bestanden houden we zoals ze zijn (transparantie blijft behouden),
      // grotere foto's verkleinen we naar 512 px
      const dataUrl = (f.type === 'image/svg+xml' || f.size < 400 * 1024)
        ? await new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(f); })
        : await thumbnail(f, 512, 0.92);
      await store.zetInstelling({ logo: dataUrl });
      melding('Logo bewaard.', 'ok');
      teken();
    } catch (err) { melding(`Logo laden mislukt: ${err.message}`, 'fout'); }
  });
  wrap.append(kaart('🖼️ Logo',
    h('p', { class: 'klein zacht' },
      'Laad hier het LUX AQUA-logo op (png, jpg of svg). Het verschijnt in de kopbalk, op het welkomscherm ' +
      'en boven elk afgedrukt dossier. Standaard gebruikt de app het officiële LUX AQUA-logo.'),
    logoVoorbeeld,
    h('div', { class: 'knoprij' },
      h('button', { class: 'knop knop--primair', onclick: logoKiezen }, '📷 Logo kiezen'),
      i.logo ? h('button', {
        class: 'knop knop--stil', onclick: async () => {
          await store.zetInstelling({ logo: null }); melding('Logo verwijderd.', 'ok'); teken();
        },
      }, 'Verwijderen') : null)));

  /* --- bedrijfsgegevens --- */
  const b = i.bedrijf || {};
  const bNaam = invoer({ value: b.naam || 'LUX AQUA' });
  const bTel = invoer({ type: 'tel', value: b.telefoon || '', placeholder: 'Telefoonnummer met landcode, bv. +32 4xx xx xx xx' });
  const bMail = invoer({ type: 'email', value: b.email || '' });
  const bWeb = invoer({ type: 'url', value: b.website || '', placeholder: 'https://' });
  const bGebied = invoer({ value: b.werkgebied || '', placeholder: 'bv. Helchteren en omgeving' });
  wrap.append(kaart('🏢 Gegevens van LUX AQUA',
    h('p', { class: 'klein zacht' }, 'Deze gegevens worden gebruikt voor de contactknoppen en om hulpvragen door te sturen.'),
    veld('Naam', bNaam), veld('Telefoon (WhatsApp)', bTel), veld('E-mail', bMail),
    veld('Website', bWeb), veld('Werkgebied', bGebied),
    h('button', {
      class: 'knop knop--primair knop--vol', onclick: async () => {
        await store.zetInstelling({ bedrijf: {
          naam: bNaam.value.trim(), telefoon: bTel.value.trim(), email: bMail.value.trim(),
          website: bWeb.value.trim(), werkgebied: bGebied.value.trim(),
        } });
        melding('Bewaard.', 'ok'); teken();
      },
    }, 'Bewaren')));

  /* --- kleurenkaart ijken --- */
  wrap.append(kaart('🎨 Kleurenkaart ijken',
    h('p', { class: 'klein zacht' },
      'Elke fabrikant gebruikt eigen kleuren. Fotografeer één keer de kleurenkaart van uw verpakking: ' +
      'de app leest de kleuren uit en gebruikt die daarna om uw strips af te lezen. Dat maakt het merkbaar nauwkeuriger.'),
    h('div', { class: 'chips', style: { marginBottom: '10px' } },
      ...STRIP_PRESETS.map((p) => badge(
        `${p.label}${i.kalibratie?.[p.id] ? ' ✓' : ''}`, i.kalibratie?.[p.id] ? 'goed' : ''))),
    h('div', { class: 'knoprij' },
      h('button', { class: 'knop knop--primair', onclick: () => ijkKleurenkaart(i) }, '📷 Kaart inlezen'),
      Object.keys(i.kalibratie || {}).length
        ? h('button', {
          class: 'knop knop--stil', onclick: async () => {
            if (await bevestig('IJking wissen?', 'De app gebruikt daarna weer de standaardkleuren.', 'Wissen')) {
              await store.zetInstelling({ kalibratie: {} }); melding('IJking gewist.', 'ok'); teken();
            }
          },
        }, 'IJking wissen') : null)));

  /* --- producten --- */
  const catalogus = await store.catalogus();
  wrap.append(kaart('🧴 Producten',
    h('p', { class: 'klein zacht' },
      `${catalogus.length} producten. ` +
      (i.productenOverride ? 'U gebruikt een aangepaste catalogus.' : 'Dit is uw eigen assortiment, met de doseringen van het etiket. Vul aan waar een advies nog zonder product staat.')),
    h('div', { class: 'knoprij' },
      h('button', { class: 'knop knop--primair', onclick: () => beheerProducten() }, '✎ Producten beheren'),
      h('button', {
        class: 'knop knop--stil', onclick: () => bewaarEnDeelBestand('luxaqua-producten.json', JSON.stringify(catalogus, null, 2), 'application/json'),
      }, '⬇️ Exporteren'),
      h('button', { class: 'knop knop--stil', onclick: () => importeerProducten() }, '📥 Importeren')),
    h('button', {
      class: 'knop knop--stil knop--vol', style: { marginTop: '8px' },
      onclick: () => toonAssortimentControle(catalogus),
    }, '🔍 Welke adviezen hebben nog geen product?')));

  /* --- koppeling --- */
  if (isLux) {
    const kUrl = invoer({ type: 'url', value: i.koppeling?.url || '', placeholder: 'https://…/dossier' });
    const kSleutel = invoer({ value: i.koppeling?.sleutel || '', placeholder: 'Optionele toegangssleutel' });
    wrap.append(kaart('☁️ Automatisch doorsturen (optioneel)',
      h('p', { class: 'klein zacht' },
        'Zonder koppeling werkt alles lokaal op het toestel en delen klanten hun dossier via WhatsApp, e-mail of een bestand. ' +
        'Hebt u een eigen server of webhook, vul die dan hier in: klanten krijgen dan de knop om rechtstreeks door te sturen.'),
      veld('Webadres (POST)', kUrl), veld('Sleutel', kSleutel),
      h('button', {
        class: 'knop knop--primair knop--vol', onclick: async () => {
          await store.zetInstelling({ koppeling: { url: kUrl.value.trim(), sleutel: kSleutel.value.trim() } });
          melding('Koppeling bewaard.', 'ok');
        },
      }, 'Bewaren')));
  }

  /* --- kweekdossier --- */
  const aantalKoppels = (await kweekKoppels()).length;
  wrap.append(kaart('🐣 Kweekdossier',
    h('p', { class: 'klein zacht' }, i.kweker
      ? `Het kweekdossier staat aan en vervangt Producten in de balk onderaan. ${aantalKoppels ? `U hebt ${aantalKoppels} ${aantalKoppels === 1 ? 'koppel' : 'koppels'} staan.` : 'U hebt nog geen koppels aangelegd.'}`
      : 'Kweekt u zelf vissen of garnalen? Zet dit aan en houd uw koppels, legsels en jongen bij. ' +
        'De app rekent uit wanneer de eieren horen uit te komen en wanneer de jongen vrij zwemmen, ' +
        'en u kan uw eigen kweek met foto\'s te koop aanbieden aan LUX AQUA.'),
    i.kweker
      ? h('p', { class: 'mini zacht' }, 'Zet u het weer uit, dan blijven uw koppels en legsels gewoon bewaard.')
      : null,
    h('div', { class: 'knoprij' },
      h('button', {
        class: `knop ${i.kweker ? 'knop--stil' : 'knop--primair'}`,
        onclick: async () => {
          await store.zetInstelling({ kweker: !i.kweker });
          melding(i.kweker ? 'Kweekdossier uitgezet.' : 'Kweekdossier aangezet.', 'ok');
          if (!i.kweker) ganaar('kweek');
          teken();
        },
      }, i.kweker ? 'Kweekdossier uitzetten' : 'Kweekdossier aanzetten'),
      i.kweker ? h('button', { class: 'knop knop--stil', onclick: () => ganaar('kweek') }, 'Naar het kweekdossier') : null)));

  /* --- spaarkaart --- */
  wrap.append(await spaarkaartBlok(isLux));

  /* --- gegevens --- */
  wrap.append(kaart('💾 Gegevens en back-up',
    h('p', { class: 'klein zacht' }, 'Alles staat op dit toestel. Maak regelmatig een back-up, zeker vóór u van toestel verandert.'),
    h('p', { class: 'klein zacht' }, 'In de back-up zitten al uw metingen, bakken en notities. De miniaturen van uw foto\'s gaan mee, de foto\'s op volle grootte niet.'),
    h('div', { class: 'knoprij' },
      h('button', { class: 'knop knop--primair', onclick: maakBackup }, '⬇️ Back-up maken'),
      h('button', { class: 'knop knop--stil', onclick: zetBackupTerug }, '📥 Back-up terugzetten'),
      isLux ? h('button', { class: 'knop knop--stil', onclick: () => importeerBestand() }, '📥 Dossier inlezen') : null),
    h('div', { class: 'knoprij', style: { marginTop: '8px' } },
      h('button', {
        class: 'knop knop--stil', onclick: async () => {
          if (await bevestig('Alles wissen?', 'Alle klanten, bakken, metingen en foto\'s op dit toestel worden definitief verwijderd. Maak eerst een back-up.', 'Alles wissen')) {
            for (const s of db.STORES) await db.wis(s);
            melding('Alles gewist.', 'ok');
            location.hash = '#/';
            location.reload();
          }
        },
      }, '🗑 Alles wissen'))));

  /* --- over --- */
  wrap.append(kaart('ℹ️ Over deze app',
    h('ul', { class: 'opsomming klein' },
      h('li', {}, 'Werkt offline: u kan meten en noteren zonder internet.'),
      h('li', {}, 'Uw gegevens blijven op uw toestel tot u ze zelf deelt.'),
      h('li', {}, 'Voeg de app toe aan uw beginscherm om ze als een gewone app te gebruiken.'),
      h('li', {}, 'De aflezing van een teststrip is een hulpmiddel: bij twijfel of bij een alarmerende waarde bevestigt u met een druppeltest.'),
      offlineRegel()),
    h('p', { class: 'mini zacht' }, `Gegevens laatst gewijzigd: ${datum(Date.now())}`)));

  return wrap;
}

/**
 * Eén regel die meteen laat zien of de offlinewerking effectief aan staat. Handig na het
 * uploaden naar de host: is het antwoord nee, dan is de service worker niet geregistreerd
 * (geen https, of een bestand uit de precache-lijst ontbreekt op de server).
 */
/**
 * Toont per adviesplaats welk product er antwoordt. Zo is in één scherm te zien
 * waar het advies nog zonder product en zonder dosering blijft staan.
 */
async function toonAssortimentControle(catalogus) {
  const rijen = assortimentControle(catalogus);
  const leeg = rijen.filter((r) => !r.producten.length);
  const zonderDosis = rijen.filter((r) => r.producten.length && r.producten.every((p) => !p.heeftDosis));

  await dialoog({
    titel: 'Uw assortiment tegenover het advies',
    breed: true,
    inhoud: h('div', {},
      h('p', { class: 'klein zacht' },
        'Bij elke meting stelt de app de handeling voor: hoeveel water verversen, niet voederen, beluchten. ' +
        'Voor het product en de dosering kijkt zij in uw catalogus. Hieronder staat welke plekken al ingevuld zijn.'),
      leeg.length
        ? h('p', { class: 'klein', style: { color: 'var(--letop)' } },
          `${leeg.length} ${leeg.length === 1 ? 'advies heeft' : 'adviezen hebben'} nog geen product. Daar toont de app enkel de handeling.`)
        : h('p', { class: 'klein', style: { color: 'var(--goed)' } }, 'Elk advies heeft een product.'),
      zonderDosis.length
        ? h('p', { class: 'klein', style: { color: 'var(--letop)' } },
          `${zonderDosis.length} ${zonderDosis.length === 1 ? 'plek heeft' : 'plekken hebben'} wel een product maar geen dosering. Daar noemt de app de naam zonder milliliters.`)
        : null,
      ...rijen.map((r) => h('div', { class: 'assortimentrij' },
        h('div', { class: 'rij' },
          h('strong', { class: 'groei' }, r.label),
          badge(r.producten.length ? (r.producten.some((p) => p.heeftDosis) ? 'Klaar' : 'Geen dosering')
            : 'Geen product',
          r.producten.length ? (r.producten.some((p) => p.heeftDosis) ? 'goed' : 'let-op') : 'kritiek')),
        h('p', { class: 'mini zacht' }, r.wanneer),
        r.producten.length
          ? h('ul', { class: 'opsomming mini' },
            ...r.producten.map((p) => h('li', {},
              p.naam, p.heeftDosis ? ` · ${p.dosistekst}` : ' · nog geen dosering ingevuld')))
          : h('p', { class: 'mini', style: { color: 'var(--letop)' } },
            'Vul hier het product in dat u hiervoor verkoopt, met de dosering van het etiket.'))),
      h('p', { class: 'mini zacht' },
        'De doseringen komen van de etiketten van uw eigen assortiment. Komt er een product bij, ' +
        'vul dan ook in of het op de inhoud van de bak of op het verse water doseert: dat scheelt een factor drie.')),
    acties: [
      { label: 'Sluiten', waarde: null },
      { label: 'Producten beheren', stijl: 'knop--primair', actie: async () => { beheerProducten(); return true; } },
    ],
  });
}

/** Een eigen wachtwoord instellen op dit toestel. */
async function wachtwoordDialoog() {
  const huidig = invoer({ type: 'password', autocomplete: 'current-password' });
  const nieuw = invoer({ type: 'password', autocomplete: 'new-password' });
  const herhaal = invoer({ type: 'password', autocomplete: 'new-password' });
  const fout = h('p', { class: 'klein', style: { color: 'var(--kritiek)', minHeight: '1.2em' } }, '');

  await dialoog({
    titel: 'Wachtwoord wijzigen',
    inhoud: h('div', {},
      veld('Huidig wachtwoord', huidig),
      veld('Nieuw wachtwoord', nieuw, 'Minstens tien tekens. Een zin van vier woorden is sterker en makkelijker te onthouden dan een kort woord met tekens erin.'),
      veld('Nieuw wachtwoord herhalen', herhaal),
      h('p', { class: 'mini zacht' },
        'Dit geldt enkel op dit toestel. Op andere toestellen blijft het ingebouwde wachtwoord werken tot de app daar vernieuwd wordt.'),
      fout),
    acties: [
      { label: 'Annuleren', waarde: null },
      {
        label: 'Wijzigen', stijl: 'knop--primair',
        actie: async () => {
          if (nieuw.value !== herhaal.value) { fout.textContent = 'De twee nieuwe wachtwoorden zijn niet gelijk.'; return false; }
          const r = await wijzigWachtwoord(huidig.value, nieuw.value);
          if (!r.ok) { fout.textContent = r.reden; return false; }
          melding(r.reden, 'ok');
          return true;
        },
      },
    ],
  });
}

/* ------------------------------------------------------------------ spaarkaart */

/**
 * De winkelzijde van de spaarkaart. LUX AQUA ziet hier de code van vandaag om
 * aan de toonbank te tonen, en stelt hier de trap in. De klant ziet enkel een
 * verwijzing naar zijn eigen kaart.
 */
async function spaarkaartBlok(isLux) {
  const s = await sp.spaarInstellingen();

  if (!isLux) {
    const k = await sp.haalKaart();
    return kaart('🎟️ Spaarkaart',
      h('p', { class: 'klein zacht' }, s.aan
        ? `U staat op ${k.tokens} ${k.tokens === 1 ? 'token' : 'tokens'}. Vraag de winkelcode aan de toonbank om er een bij te sparen.`
        : 'De spaarkaart is op dit moment niet in gebruik.'),
      s.aan ? h('button', { class: 'knop knop--stil', onclick: () => ganaar('spaar') }, 'Mijn spaarkaart openen') : null);
  }

  /* De codes worden uit de datum berekend, dus ze veranderen vanzelf om
     middernacht. Er is niets te bewaren en niets te verzenden. */
  const winkel = sp.winkelcode();
  const beheer = sp.beheercode();
  const codeEl = h('p', { class: 'winkelcode' }, winkel);

  const rijen = s.trap.map((t) => ({
    tokens: invoer({ type: 'number', min: '1', max: '9999', value: String(t.tokens) }),
    procent: invoer({ type: 'number', min: '1', max: '90', value: String(t.procent) }),
  }));
  const geldig = invoer({ type: 'number', min: '1', max: '60', value: String(s.geldigDagen) });
  const verval = invoer({ type: 'number', min: '1', max: '60', value: String(s.vervalMaanden) });
  const plafond = invoer({ type: 'number', min: '0', max: '500', value: String(s.maxKortingEuro || 0) });
  const waarop = tekstvak({ rows: 2, value: s.waarop || '' });

  const trapTabel = h('div', { class: 'spaartrap-bewerk' },
    ...rijen.map((r, n) => h('div', { class: 'rij', style: { gap: '8px', marginBottom: '6px' } },
      h('span', { class: 'mini zacht', style: { width: '22px' } }, `${n + 1}.`),
      r.tokens, h('span', { class: 'mini zacht' }, 'tokens ='), r.procent, h('span', { class: 'mini zacht' }, '%'))));

  const bewaar = async (trapOverschrijving) => {
    const trap = trapOverschrijving || rijen
      .map((r) => ({ tokens: Number(r.tokens.value), procent: Number(r.procent.value) }))
      .filter((t) => t.tokens > 0 && t.procent > 0);
    if (!trap.length) { melding('Vul minstens één trede in.', 'fout'); return; }
    await sp.bewaarSpaarInstellingen({
      trap,
      geldigDagen: Math.max(1, Number(geldig.value) || 7),
      vervalMaanden: Math.max(1, Number(verval.value) || 12),
      maxKortingEuro: Math.max(0, Number(plafond.value) || 0),
      waarop: waarop.value.trim(),
    });
    melding('Spaarkaart bewaard.', 'ok');
    teken();
  };

  return kaart('🎟️ Spaarkaart',
    h('p', { class: 'klein zacht' },
      'Toon de code van vandaag aan de toonbank. De klant tikt ze in zijn app in en krijgt één token. ' +
      'De code verandert elke nacht vanzelf, dus een foto ervan is morgen waardeloos.'),
    codeEl,
    h('p', { class: 'mini zacht midden' }, `Winkelcode van ${datum(Date.now(), false)}`),
    h('div', { class: 'knoprij' },
      h('button', { class: 'knop knop--stil', onclick: () => kopieer(winkel).then(() => melding('Code gekopieerd.', 'ok')) }, '📋 Kopiëren'),
      h('button', {
        class: 'knop knop--stil',
        onclick: () => dialoog({
          titel: 'Beheerscode van vandaag',
          inhoud: h('div', {},
            h('p', { class: 'beheercode' }, beheer),
            h('p', { class: 'klein zacht' },
              'Hiermee zet u op het toestel van een klant zijn kaart terug op nul, of schrijft u een vergeten bezoek bij. ' +
              'De klant vindt de knop onder Sparen, bij Medewerker LUX AQUA.'),
            h('p', { class: 'klein zacht' }, 'Toon deze code niet aan klanten. Ook zij verandert elke nacht.')),
          acties: [{ label: 'Sluiten', waarde: null }],
        }),
      }, '🔑 Beheerscode'),
      h('button', {
        class: `knop ${s.aan ? 'knop--stil' : 'knop--primair'}`,
        onclick: async () => {
          await sp.bewaarSpaarInstellingen({ aan: !s.aan });
          melding(s.aan ? 'Spaarkaart uitgezet.' : 'Spaarkaart aangezet.', 'ok');
          teken();
        },
      }, s.aan ? 'Spaarkaart uitzetten' : 'Spaarkaart aanzetten')),

    h('hr', { class: 'scheiding' }),
    h('h4', { style: { margin: '0 0 8px' } }, 'De trap'),
    h('p', { class: 'mini zacht' },
      'Hoeveel tokens er nodig zijn voor welke korting. De klant kiest zelf of hij omzet of verder spaart.'),
    trapTabel,
    h('div', { class: 'knoprij' },
      h('button', {
        class: 'knop knop--stil',
        onclick: () => bewaar(sp.TRAP_STANDAARD),
      }, 'Standaard (10 = 5%)'),
      h('button', {
        class: 'knop knop--stil',
        onclick: () => bewaar(sp.TRAP_TRAAG),
      }, 'Rustig tempo (50 = 5%)')),
    h('p', { class: 'mini zacht' },
      'Standaard: de eerste korting na tien bezoeken, daarna elke vijftien bezoeken vijf procent extra. ' +
      'Bij het rustige tempo is 50 tokens vijftig aparte bezoeken: voor een klant die twee keer per maand langskomt, ' +
      'is dat ruim twee jaar tot de eerste korting.'),

    h('hr', { class: 'scheiding' }),
    veld('Korting blijft geldig (dagen)', geldig),
    veld('Tokens vervallen na (maanden zonder bezoek)', verval),
    veld('Hoogste korting in euro per keer', plafond, 'Zet 0 als u geen plafond wil. Beschermt de grote aankoop.'),
    veld('Waarop de korting geldt', waarop, 'Deze zin ziet de klant op zijn kaart en op zijn bon.'),
    h('button', { class: 'knop knop--primair knop--vol', onclick: () => bewaar() }, 'Spaarkaart bewaren'));
}

function offlineRegel() {
  if (isNative()) return h('li', {}, 'Offline klaar: ja. In de app staan alle bestanden op het toestel zelf.');
  const aan = !!navigator.serviceWorker?.controller;
  return h('li', {}, h('strong', {}, `Offline klaar: ${aan ? 'ja' : 'nee'}.`), ' ', aan
    ? 'De app is klaar om zonder internet te werken.'
    : 'Herlaad deze pagina één keer. Blijft het nee, dan staat de app niet op een https-adres of ontbreekt er een bestand op de server.');
}

/* ------------------------------------------------------------------- back-ups */
async function maakBackup() {
  const data = { versie: 1, gemaakt: Date.now(), stores: {} };
  for (const s of db.STORES) {
    const rijen = await db.alles(s);
    data.stores[s] = await Promise.all(rijen.map(async (r) => {
      if (r.blob instanceof Blob) return { ...r, blob: null, blobWeggelaten: true };
      return r;
    }));
  }
  const naam = `luxaqua-backup-${new Date().toISOString().slice(0, 10)}.json`;
  if (isNative()) {
    const r = await bewaarEnDeelBestand(naam, JSON.stringify(data), 'application/json');
    if (r === 'gedeeld') melding('Back-up gedeeld. (Foto\'s zitten als kleine versie in de back-up.)', 'ok');
    return;
  }
  download(naam, JSON.stringify(data));
  melding('Back-up gedownload. (Foto\'s zitten als kleine versie in de back-up.)', 'ok');
}

function zetBackupTerug() {
  const inv = h('input', {
    type: 'file', accept: 'application/json,.json', hidden: true,
    onchange: async (e) => {
      const f = e.target.files?.[0]; if (!f) return;
      try {
        const data = JSON.parse(await f.text());
        if (!data?.stores) throw new Error('Dit is geen back-upbestand.');
        if (!await bevestig('Terugzetten?', 'De huidige gegevens op dit toestel worden aangevuld met de back-up.', 'Terugzetten')) return;
        for (const [naam, rijen] of Object.entries(data.stores)) {
          if (!db.STORES.includes(naam)) continue;
          await db.putVeel(naam, rijen);
        }
        melding('Back-up teruggezet.', 'ok');
        location.reload();
      } catch (err) {
        melding(`Terugzetten mislukt: ${err.message}`, 'fout');
      } finally { inv.remove(); }
    },
  });
  document.body.append(inv); inv.click();
}

/* ------------------------------------------------------------------- producten */
async function beheerProducten() {
  const catalogus = [...(await store.catalogus())];
  const lijst = h('div', {});

  const herteken = () => lijst.replaceChildren(...catalogus.map((p, index) =>
    h('div', { class: 'klikbaar' },
      h('span', { class: 'groei' }, h('strong', {}, p.naam), h('br'),
        h('span', { class: 'mini zacht' }, p.dosering?.omschrijving || '')),
      h('button', { class: 'chip', onclick: async () => { if (await productFormulier(p, catalogus, index)) herteken(); } }, '✎'),
      h('button', {
        class: 'chip', onclick: async () => {
          if (await bevestig('Product verwijderen?', p.naam, 'Verwijderen')) { catalogus.splice(index, 1); herteken(); }
        },
      }, '🗑'))));
  herteken();

  const bewaard = await dialoog({
    titel: 'Producten beheren', breed: true,
    inhoud: h('div', {},
      h('p', { class: 'klein zacht' },
        'Pas de productnamen, omschrijvingen en doseringen aan naar het echte assortiment van LUX AQUA. ' +
        'De app gebruikt deze gegevens om automatisch de juiste dosering voor de bak van de klant te berekenen.'),
      lijst,
      h('button', {
        class: 'knop knop--stil knop--vol', onclick: async () => {
          const nieuw = { id: `product-${Date.now()}`, naam: 'Nieuw product', categorie: 'waterbereiding', lost_op: [], richting: 'neutraliseert', omschrijving: '', dosering: { model: 'vast', hoeveelheid: 5, per: 50, eenheid: 'ml', omschrijving: '5 ml per 50 liter' }, toepassing: '', opvolging: [], waarschuwingen: [], verpakkingen: [] };
          if (await productFormulier(nieuw, catalogus, catalogus.length)) herteken();
        },
      }, '+ Product toevoegen')),
    acties: [
      { label: 'Annuleren', waarde: false },
      {
        label: 'Standaard herstellen', actie: async () => {
          if (!await bevestig('Herstellen?', 'De standaardcatalogus wordt teruggezet en uw aanpassingen gaan verloren.', 'Herstellen')) return false;
          await store.zetInstelling({ productenOverride: null });
          return true;
        },
      },
      { label: 'Bewaren', stijl: 'knop--primair', actie: async () => { await store.zetInstelling({ productenOverride: catalogus }); return true; } },
    ],
  });
  if (bewaard) { melding('Catalogus bewaard.', 'ok'); teken(); }
}

async function productFormulier(p, catalogus, index) {
  const naam = invoer({ value: p.naam || '' });
  const categorie = keuze(CATEGORIEEN.map((c) => ({ value: c.id, label: c.label, selected: c.id === p.categorie })));
  const omschrijving = tekstvak({ value: p.omschrijving || '' });
  const verpakkingen = invoer({ value: (p.verpakkingen || []).join(', '), placeholder: '250 ml, 1 l' });
  const lostOp = invoer({ value: (p.lost_op || []).join(', '), placeholder: 'no2, no3, kh' });
  const richting = keuze([
    { value: 'omhoog', label: 'Verhoogt de waarde', selected: p.richting === 'omhoog' },
    { value: 'omlaag', label: 'Verlaagt de waarde', selected: p.richting === 'omlaag' },
    { value: 'neutraliseert', label: 'Neutraliseert / algemeen', selected: p.richting === 'neutraliseert' },
  ]);
  const model = keuze([
    { value: 'vast', label: 'Vaste dosis per volume', selected: p.dosering?.model !== 'delta' },
    { value: 'delta', label: 'Dosis om een waarde te verschuiven', selected: p.dosering?.model === 'delta' },
  ]);
  const hoeveelheid = invoer({ type: 'number', step: 0.1, value: p.dosering?.hoeveelheid ?? 5 });
  const eenheid = keuze([
    { value: 'ml', label: 'ml', selected: p.dosering?.eenheid === 'ml' },
    { value: 'g', label: 'g', selected: p.dosering?.eenheid === 'g' },
    { value: 'druppel', label: 'druppels', selected: p.dosering?.eenheid === 'druppel' },
  ]);
  const per = invoer({ type: 'number', value: p.dosering?.per ?? 50 });
  const doelParam = keuze([{ value: '', label: '(geen)' }, ...Object.values(PARAMETERS).map((x) => ({ value: x.id, label: x.label, selected: x.id === p.dosering?.param }))]);
  const effect = invoer({ type: 'number', step: 0.1, value: p.dosering?.effect ?? 1 });
  const doseringTekst = invoer({ value: p.dosering?.omschrijving || '' });
  const toepassing = tekstvak({ value: p.toepassing || '' });
  const opvolging = tekstvak({
    value: (p.opvolging || []).map((o) => `${o.na} | ${o.actie}`).join('\n'),
    placeholder: '24 uur | KH opnieuw meten\n1 week | Controlemeting',
  });
  const waarschuwingen = tekstvak({ value: (p.waarschuwingen || []).join('\n'), placeholder: 'Eén waarschuwing per regel' });

  return dialoog({
    titel: 'Product', breed: true,
    inhoud: h('div', {},
      veld('Naam', naam), veld('Categorie', categorie), veld('Omschrijving', omschrijving),
      veld('Verpakkingen', verpakkingen),
      veld('Werkt op welke waarden?', lostOp, `Gebruik de codes: ${Object.keys(PARAMETERS).join(', ')}`),
      veld('Richting', richting),
      veld('Doseringsmodel', model),
      h('div', { class: 'raster3' }, veld('Hoeveelheid', hoeveelheid), veld('Eenheid', eenheid), veld('Per (liter)', per)),
      veld('Verschuift welke waarde? (enkel bij model "verschuiven")', doelParam),
      veld('Effect per dosis', effect, 'bv. 1 = één eenheid verschuiving (°dH, pH-punt…)'),
      veld('Doseringstekst voor de klant', doseringTekst),
      veld('Hoe toepassen?', toepassing),
      veld('Opvolging (één per regel: termijn | actie)', opvolging),
      veld('Waarschuwingen', waarschuwingen)),
    acties: [
      { label: 'Annuleren', waarde: false },
      {
        label: 'Bewaren', stijl: 'knop--primair', actie: () => {
          const nieuw = {
            ...p,
            naam: naam.value.trim(), categorie: categorie.value, omschrijving: omschrijving.value.trim(),
            verpakkingen: verpakkingen.value.split(',').map((s) => s.trim()).filter(Boolean),
            lost_op: lostOp.value.split(',').map((s) => s.trim()).filter((s) => PARAMETERS[s]),
            richting: richting.value,
            dosering: {
              model: model.value, hoeveelheid: Number(hoeveelheid.value) || 0, per: Number(per.value) || 1,
              eenheid: eenheid.value, param: doelParam.value || undefined, effect: Number(effect.value) || 1,
              omschrijving: doseringTekst.value.trim(),
            },
            toepassing: toepassing.value.trim(),
            opvolging: opvolging.value.split('\n').map((r) => {
              const [na, ...rest] = r.split('|');
              return na && rest.length ? { na: na.trim(), actie: rest.join('|').trim() } : null;
            }).filter(Boolean),
            waarschuwingen: waarschuwingen.value.split('\n').map((s) => s.trim()).filter(Boolean),
          };
          catalogus[index] = nieuw;
          return true;
        },
      },
    ],
  });
}

function importeerProducten() {
  const inv = h('input', {
    type: 'file', accept: 'application/json,.json', hidden: true,
    onchange: async (e) => {
      const f = e.target.files?.[0]; if (!f) return;
      try {
        const lijst = JSON.parse(await f.text());
        if (!Array.isArray(lijst)) throw new Error('Het bestand moet een lijst met producten bevatten.');
        await store.zetInstelling({ productenOverride: lijst });
        melding(`${lijst.length} producten ingelezen.`, 'ok');
        teken();
      } catch (err) { melding(`Inlezen mislukt: ${err.message}`, 'fout'); }
      finally { inv.remove(); }
    },
  });
  document.body.append(inv); inv.click();
}

/* ---------------------------------------------------------- kleurenkaart ijken */
async function ijkKleurenkaart(instellingen) {
  const presetKeuze = keuze(STRIP_PRESETS.map((p) => ({ value: p.id, label: p.label })));
  let kaartFoto = null;             // gekozen foto van de kleurenkaart
  const kaartNaam = h('span', { class: 'klein zacht' }, 'Nog geen foto gekozen.');
  const kaartKnop = h('button', { class: 'knop knop--stil', type: 'button' }, '📷 Foto nemen of kiezen');
  const bestand = h('div', { class: 'rij' }, kaartKnop, kaartNaam);
  const houder = h('div', {});
  let raster = null, preset = STRIP_PRESETS[0], rect = null, canvas = null, imageData = null;
  let kolommen = 6;

  const kolomVeld = invoer({ type: 'number', min: 2, max: 12, value: kolommen });

  const analyseer = async () => {
    const f = kaartFoto; if (!f) return;
    preset = STRIP_PRESETS.find((p) => p.id === presetKeuze.value) || STRIP_PRESETS[0];
    kolommen = Number(kolomVeld.value) || 6;
    const img = await laadAfbeelding(f);
    canvas = naarCanvas(img, 1000);
    imageData = canvas.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, canvas.width, canvas.height);
    rect = rect || { x: 0, y: 0, w: canvas.width, h: canvas.height };
    raster = leesKleurenkaart(imageData, rect, preset.pads.length, kolommen);
    tekenVoorbeeld();
  };

  const waardeVelden = {};
  function tekenVoorbeeld() {
    houder.replaceChildren(
      h('p', { class: 'klein zacht' },
        `De kaart wordt gelezen als ${preset.pads.length} rijen (in de volgorde van de strip) × ${kolommen} kolommen. ` +
        'Zorg dat enkel de kleurenkaart in beeld staat, recht van boven gefotografeerd.'),
      ...preset.pads.map((paramId, r) => {
        const standaard = (PARAMETERS[paramId]?.scale || []).map((s) => s.value);
        const veldje = invoer({
          value: (waardeVelden[paramId] ?? standaard.slice(0, kolommen).join(', ')),
          placeholder: 'waarden per kolom, gescheiden door komma\'s',
          oninput: (e) => { waardeVelden[paramId] = e.target.value; },
        });
        return h('div', { style: { marginBottom: '10px' } },
          h('div', { class: 'rij rij--tussen' },
            h('strong', { class: 'klein' }, param(paramId)?.label || paramId),
            h('div', { class: 'rij', style: { gap: '3px' } },
              ...(raster?.[r] || []).map((c) => h('span', { style: { width: '20px', height: '20px', borderRadius: '5px', background: rgbToCss(c) } })))),
          veldje);
      }));
  }

  kaartKnop.addEventListener('click', () => kiesFoto({ bron: 'vraag' }).then(([f]) => {
    if (!f) return;
    kaartFoto = f;
    kaartNaam.textContent = f.name || 'Foto gekozen';
    analyseer();
  }));
  kolomVeld.addEventListener('change', analyseer);
  presetKeuze.addEventListener('change', analyseer);

  const bewaard = await dialoog({
    titel: 'Kleurenkaart ijken', breed: true,
    inhoud: h('div', {},
      h('p', { class: 'klein zacht' },
        'Fotografeer de kleurenkaart van uw verpakking. De app leest per testveld de kleuren uit en gebruikt die ' +
        'voortaan in plaats van de standaardkleuren.'),
      veld('Welke strip?', presetKeuze),
      veld('Aantal kleurniveaus per veld', kolomVeld),
      veld('Foto van de kaart', bestand),
      houder),
    acties: [
      { label: 'Annuleren', waarde: false },
      {
        label: 'IJking bewaren', stijl: 'knop--primair', actie: async () => {
          if (!raster) { melding('Kies eerst een foto van de kaart.', 'fout'); return false; }
          const kalibratie = { ...(instellingen.kalibratie || {}) };
          const perParam = {};
          preset.pads.forEach((paramId, r) => {
            const waarden = (waardeVelden[paramId] ?? (PARAMETERS[paramId]?.scale || []).map((s) => s.value).slice(0, kolommen).join(','))
              .split(',').map((s) => Number(s.trim())).filter((n) => !Number.isNaN(n));
            const kleuren = raster[r] || [];
            const schaal = waarden.map((value, k) => (kleuren[k] ? { value, rgb: kleuren[k] } : null)).filter(Boolean);
            if (schaal.length >= 2) perParam[paramId] = schaal;
          });
          if (!Object.keys(perParam).length) { melding('Er kon geen bruikbare schaal gemaakt worden.', 'fout'); return false; }
          kalibratie[preset.id] = perParam;
          await store.zetInstelling({ kalibratie });
          return true;
        },
      },
    ],
  });
  if (bewaard) { melding('IJking bewaard. Uw strips worden nu met uw kaart gelezen.', 'ok'); teken(); }
}
