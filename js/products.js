/**
 * Productcatalogus.
 *
 * LET OP: dit is een STARTCATALOGUS met NEUTRALE, FUNCTIONELE namen — geen merknamen.
 * Vervang elke naam door de echte retailnaam zoals die op het schap staat, samen met
 * de verpakkingen en de dosering van het etiket. Dat kan zonder programmeren via
 * Beheer > Producten beheren, of hier rechtstreeks in dit bestand.
 * De doseringen hieronder volgen de gangbare normen voor aquarium- en vijverproducten;
 * ze zijn een vertrekpunt, geen productgegevens.
 *
 * Doseringsmodellen:
 *  - vast   : een vaste dosis per volume  -> {model:'vast', hoeveelheid, per, eenheid}
 *  - delta  : dosis om een parameter x eenheden te verschuiven
 *             -> {model:'delta', param, hoeveelheid, per, effect, eenheid}
 *             (hoeveelheid eenheid per `per` liter geeft `effect` verschuiving)
 */

export const CATEGORIEEN = [
  { id: 'waterbereiding', label: 'Waterbereiding & opstart' },
  { id: 'buffer', label: 'Hardheid & pH' },
  { id: 'noodhulp', label: 'Noodhulp & ontgifting' },
  { id: 'voeding', label: 'Plantenvoeding' },
  { id: 'algen', label: 'Algen & helder water' },
  { id: 'filter', label: 'Filter & media' },
  { id: 'zeewater', label: 'Zeewater' },
  { id: 'vijver', label: 'Vijver' },
  { id: 'zorg', label: 'Visverzorging' },
];

export const PRODUCTEN = [
  {
    id: 'water-safe',
    naam: 'Waterbereider',
    categorie: 'waterbereiding',
    verpakkingen: ['250 ml', '500 ml', '1 l'],
    lost_op: ['cl2', 'cu'],
    richting: 'neutraliseert',
    omschrijving: 'Waterbereider die chloor, chlooramine en zware metalen uit leidingwater onschadelijk maakt en het slijmvlies van je vissen beschermt. Gebruik dit bij élke waterverversing en bij elk bijvullen.',
    dosering: { model: 'vast', hoeveelheid: 5, per: 50, eenheid: 'ml', omschrijving: '5 ml per 50 liter vers water' },
    dubbele_dosis: 'Bij een chloorpiek of na werken aan de waterleiding mag je dubbel doseren.',
    toepassing: 'Voeg het middel toe aan het verse water vóór je het in de bak giet, of giet het meteen bij het bijvullen in de stroom van de filteruitloop.',
    opvolging: [
      { na: 'direct', actie: 'Chloor opnieuw meten met de teststrip: die moet 0 mg/l aangeven.' },
      { na: '24 uur', actie: 'Gedrag van de vissen controleren (ademhaling, kleur, zwemgedrag).' },
    ],
    waarschuwingen: ['Niet overdoseren in een bak met weinig zuurstof: waterbereiders verbruiken zelf wat zuurstof.'],
    profielen: ['zoet_gezelschap', 'zoet_planten', 'zoet_malawi', 'garnalen', 'vijver_koi', 'vijver_sier'],
  },
  {
    id: 'bacto-start',
    naam: 'Filterstarter',
    categorie: 'waterbereiding',
    verpakkingen: ['250 ml', '500 ml'],
    lost_op: ['no2', 'nh4'],
    richting: 'omlaag',
    omschrijving: 'Levende filterbacteriën die ammonium en nitriet afbreken. Onmisbaar bij het opstarten van een nieuwe bak, na een filterreiniging of na een antibioticakuur.',
    dosering: { model: 'vast', hoeveelheid: 10, per: 50, eenheid: 'ml', omschrijving: '10 ml per 50 liter' },
    toepassing: 'Rechtstreeks in de filterstroom doseren. Filter minstens 24 uur laten draaien zonder UV-C en zonder actieve kool.',
    opvolging: [
      { na: '24 uur', actie: 'NO₂ en NH₄ meten.' },
      { na: '7 dagen', actie: 'Dosis herhalen en opnieuw meten; pas vissen bijzetten als NO₂ en NH₄ twee metingen na elkaar 0 zijn.' },
      { na: '4 weken', actie: 'Controlemeting van de volledige set waarden.' },
    ],
    waarschuwingen: ['UV-C en ozon uitschakelen tijdens de kuur.', 'Geen actieve kool in de filter tijdens de opstart.'],
    profielen: ['zoet_gezelschap', 'zoet_planten', 'zoet_malawi', 'garnalen', 'zee_rif', 'vijver_koi', 'vijver_sier'],
  },
  {
    id: 'kh-plus',
    naam: 'KH-Buffer',
    categorie: 'buffer',
    verpakkingen: ['250 g', '1 kg'],
    lost_op: ['kh', 'ph'],
    richting: 'omhoog',
    omschrijving: 'Carbonaatbuffer die de KH verhoogt en zo de pH stabiel houdt. Dit is bijna altijd de éérste correctie: zonder buffer blijft elke pH-correctie tijdelijk.',
    dosering: { model: 'delta', param: 'kh', hoeveelheid: 5, per: 100, effect: 1, eenheid: 'g', omschrijving: '5 g per 100 liter verhoogt de KH met ongeveer 1 °dH' },
    toepassing: 'Oplossen in een emmer aquariumwater en verdeeld over de dag toevoegen. Verhoog nooit meer dan 2 °dH per dag.',
    opvolging: [
      { na: '6 uur', actie: 'KH en pH opnieuw meten.' },
      { na: '48 uur', actie: 'Controleren of de KH stabiel blijft; zo niet, in kleine stappen bijsturen.' },
      { na: '1 week', actie: 'KH meten om te weten hoe snel je bak de buffer verbruikt.' },
    ],
    waarschuwingen: ['Nooit in één keer meer dan 2 °dH verhogen: dat geeft een pH-sprong en stress bij de vissen.'],
    profielen: ['zoet_gezelschap', 'zoet_planten', 'zoet_malawi', 'garnalen', 'vijver_koi', 'vijver_sier'],
  },
  {
    id: 'gh-mineral',
    naam: 'GH-Mineralen',
    categorie: 'buffer',
    verpakkingen: ['250 g', '1 kg'],
    lost_op: ['gh'],
    richting: 'omhoog',
    omschrijving: 'Mineralenmengsel met calcium en magnesium om osmose- of regenwater terug op te bouwen, of om een te zachte bak aan te vullen. Belangrijk voor garnalen, slakken en vissen in de groei.',
    dosering: { model: 'delta', param: 'gh', hoeveelheid: 6, per: 100, effect: 1, eenheid: 'g', omschrijving: '6 g per 100 liter verhoogt de GH met ongeveer 1 °dH' },
    toepassing: 'Bij voorkeur vooraf oplossen in het verse verversingswater, zo krijg je geen schommelingen in de bak.',
    opvolging: [
      { na: '6 uur', actie: 'GH meten.' },
      { na: '1 week', actie: 'GH en KH samen meten; ze horen in verhouding te blijven (GH doorgaans hoger dan KH).' },
    ],
    waarschuwingen: ['Bij garnalen maximaal 1 °dH per dag verhogen.'],
    profielen: ['zoet_gezelschap', 'zoet_planten', 'garnalen', 'zoet_malawi', 'vijver_koi'],
  },
  {
    id: 'ph-minus',
    naam: 'pH-Min',
    categorie: 'buffer',
    verpakkingen: ['250 ml', '500 ml'],
    lost_op: ['ph'],
    richting: 'omlaag',
    omschrijving: 'Verlaagt de pH op een gecontroleerde manier. Alleen gebruiken als de KH al goed zit — bij een lage KH kan je met dit product een pH-crash veroorzaken.',
    dosering: { model: 'delta', param: 'ph', hoeveelheid: 10, per: 100, effect: 0.2, eenheid: 'ml', omschrijving: '10 ml per 100 liter verlaagt de pH met ongeveer 0,2 (afhankelijk van de KH)' },
    toepassing: 'Verdund toevoegen bij de filteruitloop, in stappen van maximaal 0,2 pH per dag.',
    opvolging: [
      { na: '1 uur', actie: 'pH meten.' },
      { na: '24 uur', actie: 'pH én KH meten: zakt de KH mee weg, dan eerst bufferen met de KH-Buffer.' },
    ],
    waarschuwingen: ['Nooit gebruiken bij KH lager dan 3 °dH.', 'Maximaal 0,2 pH per dag corrigeren.'],
    profielen: ['zoet_gezelschap', 'zoet_planten', 'garnalen'],
  },
  {
    id: 'ph-plus',
    naam: 'pH-Plus',
    categorie: 'buffer',
    verpakkingen: ['250 ml', '500 ml'],
    lost_op: ['ph'],
    richting: 'omhoog',
    omschrijving: 'Verhoogt de pH geleidelijk, bijvoorbeeld voor cichlidenbakken of vijvers die verzuren.',
    dosering: { model: 'delta', param: 'ph', hoeveelheid: 10, per: 100, effect: 0.2, eenheid: 'ml', omschrijving: '10 ml per 100 liter verhoogt de pH met ongeveer 0,2' },
    toepassing: 'Verdeeld over de dag toevoegen bij de filteruitloop.',
    opvolging: [
      { na: '1 uur', actie: 'pH meten.' },
      { na: '24 uur', actie: 'pH en KH meten; is de KH te laag, gebruik dan de KH-Buffer als basis.' },
    ],
    waarschuwingen: ['Maximaal 0,2 pH per dag corrigeren.'],
    profielen: ['zoet_gezelschap', 'zoet_malawi', 'vijver_koi', 'vijver_sier'],
  },
  {
    id: 'nitrite-rescue',
    naam: 'Nitrietbinder',
    categorie: 'noodhulp',
    verpakkingen: ['250 ml', '500 ml'],
    lost_op: ['no2', 'nh4'],
    richting: 'neutraliseert',
    omschrijving: 'Noodmiddel dat nitriet en ammoniak tijdelijk bindt zodat je vissen weer zuurstof kunnen opnemen. Dit is een noodrem, geen oplossing: de oorzaak moet altijd aangepakt worden.',
    dosering: { model: 'vast', hoeveelheid: 10, per: 50, eenheid: 'ml', omschrijving: '10 ml per 50 liter, bij acute nood dubbel' },
    toepassing: 'Direct doseren, samen met een waterverversing van 30–50% en extra beluchting. Voeder 48 uur niet.',
    opvolging: [
      { na: '2 uur', actie: 'NO₂ opnieuw meten.' },
      { na: '12 uur', actie: 'NO₂ en NH₄ meten, waterverversing herhalen als de waarde nog niet daalt.' },
      { na: 'dagelijks tot 0', actie: 'Dagelijks meten tot NO₂ twee dagen na elkaar op 0 staat.' },
    ],
    waarschuwingen: ['Bij zichtbaar naar adem happende vissen: onmiddellijk beluchten en hulp vragen via de knop in de app.'],
    profielen: ['zoet_gezelschap', 'zoet_planten', 'zoet_malawi', 'garnalen', 'vijver_koi', 'vijver_sier'],
  },
  {
    id: 'nitrate-control',
    naam: 'Nitraatverlager',
    categorie: 'filter',
    verpakkingen: ['500 ml', '1 l'],
    lost_op: ['no3'],
    richting: 'omlaag',
    omschrijving: 'Filtermedium met bacteriën die nitraat afbreken. Werkt traag maar structureel, in combinatie met waterverversingen.',
    dosering: { model: 'vast', hoeveelheid: 100, per: 100, eenheid: 'ml', omschrijving: '100 ml medium per 100 liter bakinhoud' },
    toepassing: 'In de laatste filterkamer plaatsen, met trage doorstroming.',
    opvolging: [
      { na: '1 week', actie: 'NO₃ meten.' },
      { na: '1 maand', actie: 'NO₃ meten en het medium controleren; vervangen volgens het etiket.' },
    ],
    waarschuwingen: ['Combineer altijd met regelmatige waterverversing; media alleen zijn niet genoeg.'],
    profielen: ['zoet_gezelschap', 'zoet_planten', 'zoet_malawi', 'zee_rif', 'vijver_koi'],
  },
  {
    id: 'phosphate-control',
    naam: 'Fosfaatbinder',
    categorie: 'algen',
    verpakkingen: ['250 ml', '500 ml'],
    lost_op: ['po4'],
    richting: 'omlaag',
    omschrijving: 'Bindt fosfaat en neemt zo de belangrijkste brandstof voor algen weg.',
    dosering: { model: 'vast', hoeveelheid: 50, per: 100, eenheid: 'ml', omschrijving: '50 ml per 100 liter' },
    toepassing: 'In een filterzakje in de filterstroom hangen.',
    opvolging: [
      { na: '48 uur', actie: 'PO₄ meten.' },
      { na: '2 weken', actie: 'PO₄ meten en het zakje vervangen als de waarde weer stijgt.' },
    ],
    waarschuwingen: ['In een beplante bak niet tot 0 werken: planten hebben een klein beetje fosfaat nodig.'],
    profielen: ['zoet_gezelschap', 'zoet_planten', 'zee_rif', 'vijver_koi', 'vijver_sier'],
  },
  {
    id: 'plant-complete',
    naam: 'Plantenvoeding compleet',
    categorie: 'voeding',
    verpakkingen: ['250 ml', '500 ml'],
    lost_op: ['no3', 'po4', 'fe'],
    richting: 'omhoog',
    omschrijving: 'Complete plantenvoeding met stikstof, fosfor, kalium en sporenelementen. Sterke planten zijn de beste algenbestrijding die er bestaat.',
    dosering: { model: 'vast', hoeveelheid: 5, per: 50, eenheid: 'ml', omschrijving: '5 ml per 50 liter, wekelijks (of 1 ml per 50 liter per dag)' },
    toepassing: 'Doseren na de waterverversing, bij het aangaan van de verlichting.',
    opvolging: [
      { na: '1 week', actie: 'NO₃, PO₄ en Fe meten en de dosis bijsturen.' },
      { na: '1 maand', actie: 'Groei en bladkleur beoordelen; foto toevoegen in de app.' },
    ],
    waarschuwingen: ['Niet doseren bij een algenbloei zonder eerst NO₃ en PO₄ te meten.'],
    profielen: ['zoet_planten', 'zoet_gezelschap'],
  },
  {
    id: 'iron-plus',
    naam: 'IJzervoeding',
    categorie: 'voeding',
    verpakkingen: ['250 ml'],
    lost_op: ['fe'],
    richting: 'omhoog',
    omschrijving: 'Vloeibaar ijzer voor bleke of doorschijnende jonge bladeren. Geeft rode planten opnieuw kleur.',
    dosering: { model: 'vast', hoeveelheid: 5, per: 100, eenheid: 'ml', omschrijving: '5 ml per 100 liter, 2 tot 3 keer per week' },
    toepassing: 'Bij voorkeur \'s avonds doseren; ijzer wordt door fel licht snel afgebroken.',
    opvolging: [
      { na: '24 uur', actie: 'Fe meten (streefwaarde 0,05–0,10 mg/l).' },
      { na: '2 weken', actie: 'Nieuwe bladeren beoordelen op kleur.' },
    ],
    waarschuwingen: ['Te veel ijzer voedt draadalgen.'],
    profielen: ['zoet_planten', 'zoet_gezelschap'],
  },
  {
    id: 'algae-stop',
    naam: 'Algenmiddel',
    categorie: 'algen',
    verpakkingen: ['250 ml', '500 ml'],
    lost_op: [],
    richting: 'neutraliseert',
    omschrijving: 'Bestrijdt draad- en zweefalgen. Alleen inzetten nadat de oorzaak (licht, nitraat, fosfaat, voederen) is aangepakt, anders komen de algen terug.',
    dosering: { model: 'vast', hoeveelheid: 10, per: 100, eenheid: 'ml', omschrijving: '10 ml per 100 liter' },
    toepassing: 'Doseren met extra beluchting: afstervende algen verbruiken veel zuurstof. Afgestorven algen zo snel mogelijk wegnemen.',
    opvolging: [
      { na: '24 uur', actie: 'Zuurstof en het gedrag van de vissen controleren, afgestorven algen verwijderen.' },
      { na: '3 dagen', actie: 'NO₃ en PO₄ meten en 30% water verversen.' },
      { na: '1 week', actie: 'Foto toevoegen in de app om het resultaat te vergelijken.' },
    ],
    waarschuwingen: ['Niet gebruiken bij garnalen en kreeftjes zonder advies.', 'Altijd extra beluchten tijdens de kuur.'],
    profielen: ['zoet_gezelschap', 'zoet_planten', 'vijver_koi', 'vijver_sier'],
  },
  {
    id: 'water-clear',
    naam: 'Waterhelder (vlokmiddel)',
    categorie: 'algen',
    verpakkingen: ['250 ml', '500 ml'],
    lost_op: [],
    richting: 'neutraliseert',
    omschrijving: 'Vlokmiddel dat zwevende deeltjes samenklit zodat je filter ze kan opvangen. Voor troebel of melkachtig water.',
    dosering: { model: 'vast', hoeveelheid: 10, per: 100, eenheid: 'ml', omschrijving: '10 ml per 100 liter' },
    toepassing: 'Doseren met de filter op volle kracht; filtervlies of watten na 24 uur uitspoelen of vervangen.',
    opvolging: [
      { na: '24 uur', actie: 'Filtermateriaal controleren en uitspoelen in aquariumwater.' },
      { na: '3 dagen', actie: 'Nog troebel? Dan is de oorzaak biologisch: NO₂/NH₄ meten en de hulpknop gebruiken.' },
    ],
    waarschuwingen: ['Niet gebruiken bij een verstopte filter.'],
    profielen: ['zoet_gezelschap', 'zoet_planten', 'vijver_koi', 'vijver_sier'],
  },
  {
    id: 'filter-boost',
    naam: 'Biologisch filtermedium',
    categorie: 'filter',
    verpakkingen: ['1 l', '5 l'],
    lost_op: ['no2', 'nh4', 'no3'],
    richting: 'omlaag',
    omschrijving: 'Poreus biologisch filtermateriaal met een zeer groot oppervlak voor filterbacteriën. Vergroot de biologische capaciteit van je filter.',
    dosering: { model: 'vast', hoeveelheid: 500, per: 100, eenheid: 'ml', omschrijving: '500 ml media per 100 liter bakinhoud' },
    toepassing: 'In de biologische kamer plaatsen. Enkel uitspoelen in aquariumwater, nooit onder de kraan.',
    opvolging: [
      { na: '2 weken', actie: 'NO₂ en NH₄ meten.' },
      { na: '6 maanden', actie: 'Media beoordelen, maximaal de helft tegelijk vervangen.' },
    ],
    waarschuwingen: ['Nooit alle media tegelijk vervangen: je verliest dan je volledige filterbacteriën.'],
    profielen: ['zoet_gezelschap', 'zoet_planten', 'zoet_malawi', 'garnalen', 'zee_rif', 'vijver_koi'],
  },
  {
    id: 'sea-salt',
    naam: 'Zeezout',
    categorie: 'zeewater',
    verpakkingen: ['4 kg', '20 kg'],
    lost_op: ['dichtheid', 'ca', 'mg', 'kh'],
    richting: 'omhoog',
    omschrijving: 'Zeezout met een uitgebalanceerde verhouding calcium, magnesium en carbonaat voor rifaquaria.',
    dosering: { model: 'vast', hoeveelheid: 35, per: 1, eenheid: 'g', omschrijving: 'ongeveer 35 g per liter osmosewater voor een dichtheid van 1,025' },
    toepassing: 'Oplossen in osmosewater met een pomp, minstens 12 uur laten mengen en op temperatuur brengen vóór gebruik.',
    opvolging: [
      { na: '12 uur', actie: 'Dichtheid en temperatuur van het mengwater controleren.' },
      { na: 'na de wissel', actie: 'KH, Ca en Mg meten.' },
    ],
    waarschuwingen: ['Nooit zout rechtstreeks in de bak oplossen.'],
    profielen: ['zee_rif'],
  },
  {
    id: 'reef-balance',
    naam: 'Balansset Ca / KH / Mg',
    categorie: 'zeewater',
    verpakkingen: ['2 x 1 l', '2 x 5 l'],
    lost_op: ['ca', 'kh', 'mg'],
    richting: 'omhoog',
    omschrijving: 'Tweecomponentensysteem dat calcium en carbonaat in balans bijvult, met magnesium als derde component.',
    dosering: { model: 'delta', param: 'kh', hoeveelheid: 10, per: 100, effect: 0.4, eenheid: 'ml', omschrijving: '10 ml per 100 liter verhoogt de KH met ongeveer 0,4 °dH' },
    toepassing: 'Component A en B altijd apart doseren, met minstens 30 minuten tussentijd, bij voorkeur met een doseerpomp.',
    opvolging: [
      { na: '4 uur', actie: 'KH meten.' },
      { na: 'dagelijks (eerste week)', actie: 'KH meten om het dagelijkse verbruik van je bak te leren kennen.' },
      { na: 'wekelijks', actie: 'Ca, KH en Mg samen meten.' },
    ],
    waarschuwingen: ['A en B nooit tegelijk of onverdund doseren: dan slaat het neer als kalk.'],
    profielen: ['zee_rif'],
  },
  {
    id: 'pond-oxy',
    naam: 'Zuurstofpoeder vijver',
    categorie: 'vijver',
    verpakkingen: ['1 kg', '5 kg'],
    lost_op: ['o2'],
    richting: 'omhoog',
    omschrijving: 'Zuurstofafgevend poeder voor acute zuurstofnood in de vijver: bij warm weer, na een algenkuur of bij vissen die aan het oppervlak happen.',
    dosering: { model: 'vast', hoeveelheid: 20, per: 1000, eenheid: 'g', omschrijving: '20 g per 1000 liter' },
    toepassing: 'Verspreid over het wateroppervlak strooien, bij voorkeur bij de uitloop van de pomp.',
    opvolging: [
      { na: '1 uur', actie: 'Gedrag van de vissen controleren, O₂ meten indien mogelijk.' },
      { na: '24 uur', actie: 'Oorzaak aanpakken: beluchting, slib, temperatuur, bezetting.' },
    ],
    waarschuwingen: ['Bij vissen die happen aan het oppervlak: dit is een noodgeval — gebruik meteen de hulpknop.'],
    profielen: ['vijver_koi', 'vijver_sier'],
  },
  {
    id: 'pond-sludge',
    naam: 'Slibafbraak vijver',
    categorie: 'vijver',
    verpakkingen: ['1 l', '2,5 l'],
    lost_op: ['no3', 'po4'],
    richting: 'omlaag',
    omschrijving: 'Bacteriën en enzymen die bladslib en organisch afval op de bodem afbreken. Minder slib betekent minder nitraat, minder fosfaat en minder algen.',
    dosering: { model: 'vast', hoeveelheid: 100, per: 1000, eenheid: 'ml', omschrijving: '100 ml per 1000 liter, maandelijks van maart tot oktober' },
    toepassing: 'Doseren bij een watertemperatuur boven 12 °C, verspreid over de vijver.',
    opvolging: [
      { na: '2 weken', actie: 'Sliblaag en NO₃/PO₄ controleren.' },
      { na: 'maandelijks', actie: 'Herhalen tijdens het seizoen.' },
    ],
    waarschuwingen: ['Werkt niet bij koud water (< 12 °C).'],
    profielen: ['vijver_koi', 'vijver_sier'],
  },
  {
    id: 'vital-care',
    naam: 'Vitaminen & slijmvliesbescherming',
    categorie: 'zorg',
    verpakkingen: ['100 ml', '250 ml'],
    lost_op: [],
    richting: 'neutraliseert',
    omschrijving: 'Vitaminen en slijmvliesbescherming voor vissen die onder stress staan: na transport, na een behandeling of na een grote waterwissel.',
    dosering: { model: 'vast', hoeveelheid: 5, per: 50, eenheid: 'ml', omschrijving: '5 ml per 50 liter' },
    toepassing: 'Doseren bij het bijzetten van nieuwe vissen en na elke behandeling.',
    opvolging: [
      { na: '3 dagen', actie: 'Vissen observeren: vinnen, huid, ademhaling, eetlust.' },
      { na: '1 week', actie: 'Foto toevoegen in de app als er iets zichtbaar is.' },
    ],
    waarschuwingen: [],
    profielen: ['zoet_gezelschap', 'zoet_planten', 'zoet_malawi', 'garnalen', 'zee_rif', 'vijver_koi'],
  },
];

/**
 * Berekent de concrete dosis voor een bak.
 * @param {object} product
 * @param {number} liters netto waterinhoud
 * @param {number} [delta] gewenste verschuiving (enkel bij model 'delta')
 * @returns {{hoeveelheid:number, eenheid:string, tekst:string}|null}
 */
export function berekenDosis(product, liters, delta) {
  const d = product?.dosering;
  if (!d || !liters) return null;
  if (d.model === 'vast') {
    const hoeveelheid = (d.hoeveelheid * liters) / d.per;
    return { hoeveelheid: rond(hoeveelheid), eenheid: d.eenheid, tekst: `${rond(hoeveelheid)} ${d.eenheid} voor ${liters} l` };
  }
  if (d.model === 'delta') {
    const stappen = (delta ?? d.effect) / d.effect;
    const hoeveelheid = (d.hoeveelheid * liters * stappen) / d.per;
    return {
      hoeveelheid: rond(hoeveelheid),
      eenheid: d.eenheid,
      tekst: `${rond(hoeveelheid)} ${d.eenheid} voor ${liters} l (verschuiving van ${round1(delta ?? d.effect)})`,
    };
  }
  return null;
}

const rond = (n) => (n >= 100 ? Math.round(n) : n >= 10 ? Math.round(n * 10) / 10 : Math.round(n * 100) / 100);
const round1 = (n) => Math.round(n * 100) / 100;

export const productById = (id, lijst = PRODUCTEN) => lijst.find((p) => p.id === id) || null;

/** Producten die een bepaalde parameter in de gevraagde richting bijsturen. */
export function productenVoor(paramId, richting, profielId, lijst = PRODUCTEN) {
  return lijst.filter((p) =>
    (p.lost_op || []).includes(paramId) &&
    (!richting || p.richting === richting || p.richting === 'neutraliseert') &&
    (!profielId || !p.profielen || p.profielen.includes(profielId))
  );
}
