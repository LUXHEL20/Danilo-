# Lux Aqua — waterwaarden, advies en opvolging

Een app waarmee klanten van Lux Aqua hun waterwaarden noteren en opvolgen, hun teststrip
laten inlezen met de camera, meteen concreet advies krijgen (mét de juiste dosering voor
hún bak), en met één knop hulp of een huisbezoek kunnen vragen. Lux Aqua zelf ziet in
dezelfde app welke klanten er zijn, wat er scheelt en welke hulpvragen open staan.

De app is een **PWA**: één map met statische bestanden, geen buildstap, geen server nodig.
Ze werkt offline en kan op de telefoon aan het beginscherm toegevoegd worden.

---

## Wat kan de app?

### Voor de klant
| Functie | Wat het doet |
|---|---|
| 🧪 **Teststrip inlezen** | Foto van de strip → de app zoekt de strip, vindt de testveldjes, corrigeert de witbalans en vergelijkt elke kleur met de kleurenkaart. Ze vult de waarden al in en zegt er eerlijk bij hoe zeker de aflezing is. |
| ✍️ **Zelf invullen** | Elke waarde kan handmatig ingevuld of gecorrigeerd worden. De invoervelden kleuren mee volgens de streefwaarden. |
| 💡 **Call to actions tijdens het ingeven** | Nog vóór het opslaan verschijnen de voorgestelde acties: wat nu doen, welk product, hoeveel, en wat nadien opvolgen. Zo kan de klant al beginnen bijsturen in aanloop naar een eventueel huisbezoek. |
| 📈 **Historiek en grafieken** | Evolutie per waarde met de streefzone in beeld, volledige metinglijst en export naar CSV. |
| 🐠 **Mijn bak** | Type bak, afmetingen met automatische literberekening, opstartdatum, filter, verlichting, CO₂, bodem, verversingsritme en leidingwater. |
| 🐟 **Vissenbestand** | Soorten, aantallen, sinds wanneer, opmerkingen en een foto per soort, met een ruwe inschatting van de bezetting. |
| 📷 **Foto's** | Foto's van de bak, van algen, van een zieke vis of van de filter — allemaal deelbaar. |
| 🆘 **Hulpknop** | Huisbezoek, ter plaatse testen en bijsturen, advies op afstand of noodgeval. Het volledige dossier (bak, vissen, metingen, advies, foto's) gaat automatisch mee. |
| 🧴 **Producten** | De volledige catalogus met omschrijving, dosering berekend voor het aantal liter van de klant, toepassing, waarschuwingen en opvolgschema. Een dosering in het logboek zetten maakt meteen de opvolgtaken aan. |
| ✅ **Opvolgtaken** | Elk advies en elk gedoseerd product genereert taken met een vervaldatum ("meet KH opnieuw na 6 uur"). |
| 📚 **Kennisbank** | Twaalf artikels in gewone taal: indraaien, verversen, voederen, algen, filteronderhoud, vissen bijzetten, ziektes, planten, osmosewater, vijver per seizoen, meten, vakantie. |

### Voor Lux Aqua
- **Klantenlijst** met stoplichtstatus, gesorteerd op openstaande hulpvragen en slechtste score.
- **Dagoverzicht**: nieuwe hulpvragen, klanten met kritieke waarden, klanten die al lang niet meer gemeten hebben.
- **Klantdossier**: contactgegevens met bel-, WhatsApp- en mailknop, installatie, vissenbestand, laatste waarden, foto's, volledig advies, interne notities.
- **Hulpvragen-inbox** met status (nieuw → opgenomen → gepland → afgerond), afspraakmoment en antwoordveld.
- **Dossier inlezen** dat een klant doorstuurde, **afdrukken of als pdf bewaren**, en de samenvatting kopiëren.
- **Productbeheer**: namen, omschrijvingen, verpakkingen, doseringen en opvolgschema's aanpassen, importeren en exporteren.
- **Kleurenkaart ijken** per stripmerk.

---

## Aan de slag

De app bestaat enkel uit statische bestanden. Elke webserver volstaat.

```bash
# lokaal uitproberen
npx http-server -p 8080 .
# open http://localhost:8080
```

Of publiceer de map met **GitHub Pages** (Settings → Pages → branch kiezen). Daarna:

- **Op de telefoon**: open de link in de browser → menu → *Toevoegen aan beginscherm*.
  De app werkt dan offline en de camera opent rechtstreeks bij het inlezen van een strip.

> De teststriplezer heeft een `https://`- of `localhost`-adres nodig, omdat de browser
> anders geen camera toelaat. Bestanden rechtstreeks openen (`file://`) werkt niet.

---

## Hoe de teststriplezer werkt

1. De foto wordt verkleind naar maximaal 1000 px.
2. De strip wordt gezocht als het lichtste, langwerpige vlak in beeld (kan met de vinger
   overschreven worden door een eigen kader te slepen).
3. Langs de lange as wordt gemeten hoe sterk elke plek afwijkt van de witte drager; de
   pieken in dat signaal zijn de testveldjes.
4. Per veldje wordt de **mediaankleur** genomen (ongevoelig voor spiegeling en ruis) en
   witgebalanceerd op basis van de witte drager.
5. De kleur wordt naar **CIE L\*a\*b\*** omgezet en met **CIEDE2000** vergeleken met de
   kleurenkaart, mét interpolatie tussen twee naburige stalen.
6. De kleurafstand wordt vertaald naar een betrouwbaarheid: *goed*, *redelijk* of *zwak*.

De aflezing is bewust een **voorstel**: de klant bevestigt of corrigeert. Bij een
alarmerende waarde raadt de app zelf aan om te bevestigen met een druppeltest.

**Nauwkeuriger maken:** in *Beheer → Kleurenkaart ijken* fotografeer je één keer de
kleurenkaart van de verpakking. De app leest die kaart uit en gebruikt daarna de kleuren
van dat merk in plaats van de standaardkleuren.

---

## Het logo

`assets/logo.svg` is een **plaatshouder**. Twee manieren om het echte logo te gebruiken:

- **Zonder programmeren**: *Beheer → Logo → Logo kiezen*. Het logo verschijnt in de
  kopbalk, op het welkomscherm en boven elk afgedrukt dossier. Het blijft op het toestel
  staan en gaat mee in de back-up.
- **Vast in de app**: vervang `assets/logo.svg` door het echte bestand (svg of png, bij
  voorkeur vierkant). Dan zien alle nieuwe gebruikers het meteen.

---

## De producten aanpassen — lees dit eerst

`js/products.js` bevat een **startcatalogus** van 19 producten met **neutrale, functionele
namen** (Waterbereider, KH-Buffer, Nitrietbinder…) — bewust géén merknamen, want dit zijn
geen echte productgegevens. Vervang elke naam door de **echte retailnaam** zoals die op het
schap staat, samen met de verpakkingen en de dosering van het etiket:

- **In de app**: *Beheer → Producten beheren*. Alles is aanpasbaar (naam, omschrijving,
  verpakkingen, dosering, toepassing, opvolging, waarschuwingen). Exporteer de catalogus
  daarna als JSON zodat ze op andere toestellen ingelezen kan worden.
- **In de code**: pas `js/products.js` aan, dan geldt ze meteen voor elke nieuwe gebruiker.

Twee doseringsmodellen:

```js
// vaste dosis per volume
dosering: { model: 'vast', hoeveelheid: 5, per: 50, eenheid: 'ml' }   // 5 ml per 50 l

// dosis om een waarde te verschuiven
dosering: { model: 'delta', param: 'kh', hoeveelheid: 5, per: 100, effect: 1, eenheid: 'g' }
// 5 g per 100 l verhoogt de KH met 1 °dH — de app rekent zelf uit hoeveel er nodig is
// om van de gemeten waarde tot in de streefzone te komen
```

Ook de streefwaarden zijn data: `js/params.js` bevat zeven waterprofielen
(gezelschapsbak, aquascape, Malawi, garnalen, rif, koivijver, siervijver) met per
parameter een ideale en een aanvaardbare zone.

---

## Hoe komt een dossier bij Lux Aqua?

De app werkt standaard **volledig lokaal** — er is geen server en er vertrekt niets zonder
dat de klant er zelf op drukt. Een dossier (bakgegevens, vissenbestand, metingen, advies,
foto's en de hulpvraag) kan verstuurd worden via:

- het **deelmenu** van het toestel (WhatsApp, mail, Signal, …), met het JSON-bestand erbij;
- een rechtstreekse **WhatsApp**- of **e-maillink** naar het nummer/adres van Lux Aqua;
- een **JSON-bestand** dat Lux Aqua inleest via *Dossier inlezen*;
- **afdrukken of als pdf bewaren**;
- optioneel **rechtstreeks naar een eigen server** (*Beheer → Automatisch doorsturen*):
  de app doet dan een `POST` met het dossier als JSON naar het opgegeven adres.

---

## Privacy

Alle gegevens staan in IndexedDB **op het toestel van de gebruiker zelf**. Er is geen
account, geen tracking en geen externe dienst. Delen gebeurt enkel op initiatief van de
gebruiker. Maak regelmatig een back-up via *Beheer → Back-up maken*, zeker vóór je van
toestel wisselt.

---

## Opbouw van het project

```
index.html              app-schil
manifest.webmanifest    installeerbaar als app
sw.js                   service worker (offline)
css/style.css           stijlblad, licht en donker
js/
  app.js                opstarten, navigatie, routering
  db.js                 IndexedDB-wrapper
  store.js              domeinlaag: klanten, bakken, vissen, metingen, foto's, taken
  params.js             parameters, streefwaarden per profiel, strip-presets
  products.js           productcatalogus + doseringsberekening
  advies.js             adviesmotor: waarden → acties, producten, opvolgtaken
  strip.js              teststrip uitlezen uit een foto
  color.js              sRGB → Lab en CIEDE2000
  charts.js             SVG-grafieken
  delen.js              dossier opbouwen, delen, afdrukken, importeren
  ui.js                 elementen, dialogen, meldingen, datums
  views/                schermen (start, meten, bak, historiek, producten,
                        hulp, kennis, luxaqua, beheer, onboarding, onderdelen)
```

Geen dependencies, geen buildstap. Alles is ES-modules en gewone DOM.

---

## Getest

Doorlopen met Playwright/Chromium op een telefoonformaat, zonder console-fouten:
onboarding → meting met live advies → opslaan → score en historiek → vis toevoegen →
productdosering → hulpvraag aanmaken en delen → kennisbank → wisselen naar Lux Aqua-modus
→ hulpvragen-inbox → klantdossier. De striplezer is getest met een gegenereerde
teststripfoto: strip gevonden, zes velden herkend, waarden ingevuld, foto bewaard,
dossier opgebouwd.

---

## Belangrijk om te weten

- De adviezen zijn een **eerste inschatting** op basis van de ingegeven waarden. Ze
  vervangen geen bezoek ter plaatse — daar is de hulpknop voor.
- Een teststrip is een opvolgingsmiddel. Bij een alarmerende waarde (nitriet, ammonium)
  bevestig je met een druppeltest.
- De doseringen in de startcatalogus zijn richtwaarden. **Het etiket van het echte
  product heeft altijd voorrang** — daarom is de catalogus aanpasbaar gemaakt.

## Mogelijke volgende stappen

- Echte productgegevens, foto's en prijzen van Lux Aqua invullen.
- Gedeelde back-end zodat Lux Aqua de dossiers automatisch binnenkrijgt in plaats van via
  een bestand of WhatsApp (de koppeling in *Beheer* is hier al op voorzien).
- Pushmeldingen als herinnering om te meten.
- Barcodescanner om een product meteen in het logboek te zetten.
