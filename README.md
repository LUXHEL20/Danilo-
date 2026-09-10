# LUX AQUA: waterwaarden, advies en opvolging

Een app waarmee klanten van LUX AQUA hun waterwaarden noteren en opvolgen, hun teststrip
laten inlezen met de camera, meteen concreet advies krijgen (mét de juiste dosering voor
hún bak), en met één knop hulp of een huisbezoek kunnen vragen. LUX AQUA zelf ziet in
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
| 📷 **Foto's** | Foto's van de bak, van algen, van een zieke vis of van de filter, allemaal deelbaar. |
| 🆘 **Hulpknop** | Huisbezoek, ter plaatse testen en bijsturen, advies op afstand of noodgeval. Het volledige dossier (bak, vissen, metingen, advies, foto's) gaat automatisch mee. |
| 🧴 **Producten** | De volledige catalogus met omschrijving, dosering berekend voor het aantal liter van de klant, toepassing, waarschuwingen en opvolgschema. Een dosering in het logboek zetten maakt meteen de opvolgtaken aan. |
| ✅ **Opvolgtaken** | Elk advies en elk gedoseerd product genereert taken met een vervaldatum ("meet KH opnieuw na 6 uur"). |
| 📚 **Kennisbank** | Twaalf artikels in gewone taal: indraaien, verversen, voederen, algen, filteronderhoud, vissen bijzetten, ziektes, planten, osmosewater, vijver per seizoen, meten, vakantie. |

### Voor LUX AQUA
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

## Als echte app op Android en iOS

De webversie blijft de basis. Met **Capacitor** verpakken wij diezelfde bestanden in een
echte app voor de Google Play Store en de Apple App Store. Capacitor zet de map `www/` in
een native schil met een webview en geeft de app toegang tot de camera, het deelmenu en de
bestandsopslag van het toestel. Er komt geen bundler of framework bij: de code in `js/` en
`css/` is dezelfde als op het web.

### Wat u nodig hebt

- Node 22 en npm. Eenmalig `npm install` in de projectmap.
- Voor Android: Android Studio (met SDK en build-tools) en Java 21.
- Voor iOS: een Mac met Xcode 15 of nieuwer. Er is geen CocoaPods nodig; Xcode haalt de
  Swift-packages zelf op. Op Windows of Linux kunt u de iOS-map wel aanmaken en
  instellen, maar niet bouwen.

### De npm-scripts

| Script | Wat het doet |
|---|---|
| `npm run build` | Maakt `www/` leeg en kopieert er `index.html`, `manifest.webmanifest`, `sw.js`, `css/`, `js/` en `assets/` in. |
| `npm run sync` | Bouwt `www/` en kopieert ze naar de Android- en iOS-projecten (`npx cap sync`), inclusief de plugins. |
| `npm run android` | Sync en opent het Android-project in Android Studio. |
| `npm run ios` | Sync en opent het iOS-project in Xcode (enkel op een Mac). |
| `npm run apk` | Sync en bouwt een debug-APK met Gradle (via `scripts/apk.mjs`, werkt op Windows, macOS en Linux). |
| `npm run assets` | Maakt alle app-iconen en splashschermen uit de bestanden in `resources/`. |
| `npm run test` | Draait de Playwright-rooktest van de webversie (zet eerst `APP_URL`, zie hieronder). |
| `npm run test:strip` | Test de teststriplezer met een gegenereerde stripfoto via de bestandskiezer. |
| `npm run test:native` | Test de native tak (camera, deelmenu, terugknop) met een gemockte Capacitor-runtime. |
| `npm run test:offline` | Bouwt `www/` en controleert dat de app na één bezoek volledig offline werkt. |

De eerste keer voegt u de platformen toe met `npx cap add android` en `npx cap add ios`.
De mappen `android/` en `ios/` horen daarna in git; de bouwresultaten erin niet
(zie `.gitignore`).

### Een APK bouwen voor Android

```bash
npm run apk
```

Het resultaat staat in `android/app/build/outputs/apk/debug/app-debug.apk`. Dat bestand
kunt u rechtstreeks op een Android-toestel installeren om te testen. Voor de Play Store
bouwt u een ondertekende release (`./gradlew bundleRelease` in `android/`) met een eigen
keystore; Android Studio begeleidt u daarbij via *Build, Generate Signed Bundle*.

### iOS openen op een Mac

```bash
npm run ios
```

Xcode opent het project `ios/App/App.xcodeproj`. Kies onder *Signing & Capabilities* uw
team, laat Xcode het provisioning profile aanmaken en start de app op een toestel of in de
simulator. Voor testers en voor de App Store maakt u een archive (*Product, Archive*) en
laadt u die op naar App Store Connect. Via **TestFlight** kunt u de app dan aan testers
bezorgen voordat ze in de winkel komt. De privacyverklaring die Apple daarvoor vraagt
(`ios/App/App/PrivacyInfo.xcprivacy`, voor de bestandsplugin) zit al in het project.

### Welke accounts u nodig hebt

- **Google Play Console**: eenmalige registratiekost van 25 USD (te bevestigen).
- **Apple Developer Program**: 99 USD per jaar (te bevestigen). Zonder dit account kunt u de app enkel
  op uw eigen toestellen zetten via Xcode, niet via TestFlight of de App Store.

### Naam, bundle-id, versie en icoon

- De **bundle-id** is `be.luxhelchteren.aqua` en staat in `capacitor.config.json` (`appId`).
  Ze staat ook in `android/app/build.gradle` (`applicationId`) en in het Xcode-project
  zodra de platformen toegevoegd zijn. Kies ze goed voor de eerste publicatie; nadien kan
  ze in de winkels niet meer veranderen.
- De **naam** van de app staat in `capacitor.config.json` (`appName`, "LUX AQUA") en wordt
  bij `npx cap add` overgenomen. Nadien past u ze aan in `android/app/src/main/res/values/strings.xml`
  en in Xcode onder *Display Name*.
- De **versie** staat in `package.json` (`version`) en in de platformen zelf:
  `versionName` en `versionCode` in `android/app/build.gradle`, *Version* en *Build* in Xcode.
  Verhoog ze bij elke nieuwe oplading naar de winkels.
- Het **icoon** en de **splash** komen uit `resources/`: `icon-only.png` (1024 x 1024),
  `icon-foreground.png` en `icon-background.png` (adaptive icon voor Android),
  `splash.png` en `splash-dark.png` (2732 x 2732). Die bestanden en de iconen voor de
  webversie in `assets/icons/` worden gemaakt met `node scripts/maak-iconen.mjs` uit de
  officiële logobestanden in `assets/brand/` (zie `BRAND.md`; het logo wordt nooit
  hertekend). Daarna zet `npm run assets` alle maten in het Android- en iOS-project.

### Wat de native app extra kan

De plugins `@capacitor/camera`, `@capacitor/share`, `@capacitor/filesystem`,
`@capacitor/app`, `@capacitor/status-bar` en `@capacitor/splash-screen` zijn geïnstalleerd.
Daarmee opent de camera rechtstreeks, gaat een dossier via het deelmenu van het toestel,
worden bestanden op het toestel bewaard en kleuren statusbalk en splashscherm mee in het
marineblauw van LUX AQUA (`#0D1730`).

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

**Nauwkeuriger maken:** in *Beheer → Kleurenkaart ijken* fotografeert u één keer de
kleurenkaart van de verpakking. De app leest die kaart uit en gebruikt daarna de kleuren
van dat merk in plaats van de standaardkleuren.

---

## Het logo

De app gebruikt standaard het officiële LUX AQUA-logo uit `assets/brand/` (zie `BRAND.md`;
het logo wordt nooit hertekend). Het verschijnt in de kopbalk, op het welkomscherm en boven
elk afgedrukt dossier. Wie tijdelijk een ander beeld wil tonen, kan via *Beheer, Logo, Logo
kiezen* een eigen bestand opladen (svg of png met transparante achtergrond). Dat blijft op
het toestel staan en gaat mee in de back-up.

---

## De producten aanpassen: lees dit eerst

`js/products.js` bevat een **startcatalogus** van 19 producten met **neutrale, functionele
namen** (Waterbereider, KH-Buffer, Nitrietbinder…), bewust zonder merknamen, want dit zijn
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
// 5 g per 100 l verhoogt de KH met 1 °dH; de app rekent zelf uit hoeveel er nodig is
// om van de gemeten waarde tot in de streefzone te komen
```

Ook de streefwaarden zijn data: `js/params.js` bevat zeven waterprofielen
(gezelschapsbak, aquascape, Malawi, garnalen, rif, koivijver, siervijver) met per
parameter een ideale en een aanvaardbare zone.

---

## Hoe komt een dossier bij LUX AQUA?

De app werkt standaard **volledig lokaal**: er is geen server en er vertrekt niets zonder
dat de klant er zelf op drukt. Een dossier (bakgegevens, vissenbestand, metingen, advies,
foto's en de hulpvraag) kan verstuurd worden via:

- het **deelmenu** van het toestel (WhatsApp, mail, Signal, …), met het JSON-bestand erbij;
- een rechtstreekse **WhatsApp**- of **e-maillink** naar het nummer/adres van LUX AQUA;
- een **JSON-bestand** dat LUX AQUA inleest via *Dossier inlezen*;
- **afdrukken of als pdf bewaren**;
- optioneel **rechtstreeks naar een eigen server** (*Beheer → Automatisch doorsturen*):
  de app doet dan een `POST` met het dossier als JSON naar het opgegeven adres.

---

## Privacy

Alle gegevens staan in IndexedDB **op het toestel van de gebruiker zelf**. Er is geen
account, geen tracking en geen externe dienst. Delen gebeurt enkel op initiatief van de
gebruiker. Maak regelmatig een back-up via *Beheer → Back-up maken*, zeker vóór u van
toestel wisselt.

---

## Opbouw van het project

```
index.html              app-schil
manifest.webmanifest    installeerbaar als app
sw.js                   service worker (offline; verhoog de cachenaam bij elke wijziging aan de bestandenlijst)
css/style.css           stijlblad, licht en donker
package.json            npm-scripts en Capacitor-pakketten
capacitor.config.json   instellingen van de native app (bundle-id, naam, splash, statusbalk)
scripts/
  build-www.mjs         kopieert de webversie naar www/ en controleert de precache-lijst van sw.js
  apk.mjs               start Gradle voor de debug-APK (npm run apk)
  maak-iconen.mjs       maakt iconen en splash uit assets/brand/
resources/              bronbeelden voor npm run assets (icoon en splash)
assets/brand/           officiële logobestanden (zie BRAND.md)
assets/icons/           png-iconen voor manifest, favicon en apple-touch-icon
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

De webversie heeft geen dependencies en geen buildstap: alles is ES-modules en gewone DOM.
De npm-pakketten dienen enkel voor de native app (zie hierboven).

---

## Getest

Doorlopen met Playwright/Chromium op een telefoonformaat, zonder console-fouten:
onboarding → meting met live advies → opslaan → score en historiek → vis toevoegen →
productdosering → hulpvraag aanmaken en delen → kennisbank → wisselen naar LUX AQUA-modus
→ hulpvragen-inbox → klantdossier. De striplezer is getest met een gegenereerde
teststripfoto: strip gevonden, zes velden herkend, waarden ingevuld, foto bewaard,
dossier opgebouwd.

Zo draait u de tests zelf (Playwright met Chromium moet geïnstalleerd zijn; de tests zoeken
het pakket in de globale npm-map of via de omgevingsvariabele `PLAYWRIGHT_PAD`):

```bash
npx http-server -p 8123 -c-1 .          # in een tweede venster laten draaien
APP_URL=http://127.0.0.1:8123/index.html npm test              # rooktest
APP_URL=http://127.0.0.1:8123/index.html npm run test:strip    # striplezer via de bestandskiezer
APP_URL=http://127.0.0.1:8123/index.html npm run test:native   # native tak met gemockte Capacitor
npm run test:offline                                            # service worker, start een eigen server
```

---

## Belangrijk om te weten

- De adviezen zijn een **eerste inschatting** op basis van de ingegeven waarden. Ze
  vervangen geen bezoek ter plaatse; daar is de hulpknop voor.
- Een teststrip is een opvolgingsmiddel. Bij een alarmerende waarde (nitriet, ammonium)
  bevestigt u met een druppeltest.
- De doseringen in de startcatalogus zijn richtwaarden. **Het etiket van het echte
  product heeft voorrang**; daarom is de catalogus aanpasbaar gemaakt.

## Mogelijke volgende stappen

- Echte productgegevens, foto's en prijzen van LUX AQUA invullen.
- Gedeelde back-end zodat LUX AQUA de dossiers automatisch binnenkrijgt in plaats van via
  een bestand of WhatsApp (de koppeling in *Beheer* is hier al op voorzien).
- Pushmeldingen als herinnering om te meten.
- Barcodescanner om een product meteen in het logboek te zetten.
