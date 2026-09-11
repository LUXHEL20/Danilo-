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

/**
 * Het assortiment zoals het in de winkel staat, met de doseringen van het etiket.
 *
 * LUX AQUA werkt met de producten van COLOMBO. Het merk staat bewust NIET in de
 * productnamen hieronder: de klant kent ze als Aqua Start en Bacto Start, zoals
 * ze op het schap staan. Dat wij met Colombo werken, staat één keer bovenaan het
 * productscherm.
 *
 * Twee dingen die bij het doseren vaak misgaan en die hier daarom apart staan:
 *
 * 1. Sommige middelen doseert u op de INHOUD VAN DE BAK, andere op het VERSE
 *    WATER dat u erin giet. Dat scheelt een factor drie tot vijf. Het veld
 *    `basis` zegt welk van de twee het is, en de app rekent daarop.
 * 2. Sommige middelen hebben een andere dosis bij de opstart dan bij het
 *    onderhoud. Die tweede dosis staat in `extraDoseringen`, zodat de klant
 *    beide getallen voor zijn eigen bak te zien krijgt en niet moet kiezen.
 */
export const PRODUCTEN = [
  /* =========================================================== waterbereiding */
  {
    id: 'aqua-start',
    naam: 'Aqua Start',
    categorie: 'waterbereiding',
    verpakkingen: [],
    lost_op: ['cl2', 'cu'],
    richting: 'neutraliseert',
    omschrijving: 'Bindt chloor en zware metalen uit leidingwater. Gebruik dit bij het vullen van een nieuwe bak en op het verse water bij elke waterverversing.',
    dosering: {
      model: 'vast', hoeveelheid: 4, per: 10, eenheid: 'ml', basis: 'versWater',
      label: 'Bij het vullen en bij elke waterverversing',
      omschrijving: '4 ml per 10 liter vers water',
    },
    toepassing: 'Doe het middel bij het verse water vóór u het in de bak giet, of giet het mee in de stroom van de filteruitloop terwijl u bijvult.',
    opvolging: [
      { na: 'direct', actie: 'Chloor meten met de teststrip: die moet 0 mg per liter aangeven.' },
      { na: '24 uur', actie: 'Ademhaling, kleur en zwemgedrag van de vissen nakijken.' },
    ],
    waarschuwingen: [],
    profielen: ['zoet_gezelschap', 'zoet_planten', 'zoet_malawi', 'garnalen'],
  },
  {
    id: 'fresh-bacto',
    naam: 'Fresh Bacto',
    categorie: 'waterbereiding',
    verpakkingen: [],
    lost_op: ['no2', 'nh4'],
    richting: 'omlaag',
    omschrijving: 'Levende filterbacteriën die ammonium en nitriet afbreken. Bij de opstart doseert u op de volledige inhoud van de bak, daarna telkens op het verse water dat u erin giet.',
    dosering: {
      model: 'vast', hoeveelheid: 10, per: 10, eenheid: 'ml', basis: 'bak',
      label: 'Bij de opstart, op het volledige volume',
      omschrijving: '10 ml per 10 liter bakinhoud',
    },
    extraDoseringen: [
      {
        model: 'vast', hoeveelheid: 5, per: 10, eenheid: 'ml', basis: 'versWater',
        label: 'Later, telkens op het verse water',
        omschrijving: '5 ml per 10 liter vers water',
      },
    ],
    toepassing: 'Rechtstreeks in de filterstroom doseren. Laat de filter minstens 24 uur draaien zonder UV-C en zonder actieve kool.',
    opvolging: [
      { na: '24 uur', actie: 'Nitriet en ammonium meten.' },
      { na: '7 dagen', actie: 'Opnieuw meten. Zet pas vissen bij wanneer nitriet en ammonium twee metingen na elkaar op 0 staan.' },
      { na: '4 weken', actie: 'Controlemeting van de volledige set waarden.' },
    ],
    waarschuwingen: [
      'Zet UV-C en ozon uit tijdens de kuur.',
      'Geen actieve kool in de filter tijdens de opstart.',
    ],
    profielen: ['zoet_gezelschap', 'zoet_planten', 'zoet_malawi', 'garnalen'],
  },
  {
    id: 'bacto-start',
    naam: 'Bacto Start',
    categorie: 'waterbereiding',
    verpakkingen: [],
    lost_op: ['no2', 'nh4'],
    richting: 'omlaag',
    omschrijving: 'Bacteriën voor de filter. Bij een nieuwe bak op het volledige volume, en telkens opnieuw na een schoonmaakbeurt van de filter: daarbij verliest u altijd een deel van uw bacteriën.',
    dosering: {
      model: 'vast', hoeveelheid: 10, per: 10, eenheid: 'ml', basis: 'bak',
      label: 'Bij een nieuwe bak',
      omschrijving: '10 ml per 10 liter bakinhoud',
    },
    extraDoseringen: [
      {
        model: 'vast', hoeveelheid: 5, per: 10, eenheid: 'ml', basis: 'bak',
        label: 'Na elke schoonmaakbeurt van de filter',
        omschrijving: '5 ml per 10 liter bakinhoud',
      },
    ],
    toepassing: 'In de filterstroom doseren, zodat de bacteriën meteen in het filtermateriaal terechtkomen.',
    opvolging: [
      { na: '24 uur', actie: 'Nitriet en ammonium meten.' },
      { na: '7 dagen', actie: 'Opnieuw meten voor u iets bijzet.' },
    ],
    waarschuwingen: [
      'Zet UV-C uit tijdens de kuur.',
      'Spoel uw filtermateriaal met bakwater, nooit met leidingwater: chloor doodt precies deze bacteriën.',
    ],
    profielen: ['zoet_gezelschap', 'zoet_planten', 'zoet_malawi', 'garnalen'],
  },
  {
    id: 'bacto-care',
    naam: 'Bacto Care',
    categorie: 'waterbereiding',
    verpakkingen: [],
    lost_op: [],
    richting: 'neutraliseert',
    omschrijving: 'Filter- en reinigingsbacteriën voor het gewone onderhoud. Houdt de filter en de bodem schoon in plaats van een probleem achteraf op te lossen.',
    dosering: {
      model: 'vast', hoeveelheid: 2, per: 10, eenheid: 'ml', basis: 'bak',
      label: 'Eerste 5 dagen dagelijks, daarna wekelijks',
      omschrijving: '2 ml per 10 liter bakinhoud',
    },
    routine: { elke: 7, tekst: 'Bacto Care doseren' },
    toepassing: 'De eerste vijf dagen elke dag doseren, daarna één keer per week op een vast moment.',
    opvolging: [
      { na: '5 dagen', actie: 'Overschakelen naar één keer per week.' },
    ],
    waarschuwingen: [],
    profielen: ['zoet_gezelschap', 'zoet_planten', 'zoet_malawi', 'garnalen'],
  },
  {
    id: 'probiplus-kp',
    naam: 'ProbiPlus K.P.',
    categorie: 'waterbereiding',
    verpakkingen: [],
    lost_op: [],
    richting: 'neutraliseert',
    omschrijving: 'Probiotica tegen slib en biofilm. Werkt op het vuil dat u niet ziet: de laag op de bodem, in de slangen en in het filtermateriaal.',
    dosering: {
      model: 'vast', hoeveelheid: 1, per: 100, eenheid: 'ml', basis: 'bak',
      label: 'Bij de opstart en daarna wekelijks',
      omschrijving: '1 ml per 100 liter bakinhoud',
    },
    routine: { elke: 7, tekst: 'ProbiPlus K.P. doseren' },
    toepassing: 'Bij de opstart één keer doseren, daarna elke week op een vast moment.',
    opvolging: [],
    waarschuwingen: [],
    profielen: ['zoet_gezelschap', 'zoet_planten', 'zoet_malawi', 'garnalen'],
  },
  {
    id: 'aqua-care',
    naam: 'Aqua Care',
    categorie: 'waterbereiding',
    verpakkingen: [],
    lost_op: [],
    richting: 'neutraliseert',
    omschrijving: 'Onderhoudsmiddel dat de biologische afbraak op gang houdt. Dit werkt alleen bij vast gebruik: één keer doseren wanneer het al misgaat, helpt niet.',
    dosering: {
      model: 'vast', hoeveelheid: 1, per: 5, eenheid: 'ml', basis: 'bak',
      label: 'Wekelijks',
      omschrijving: '1 ml per 5 liter bakinhoud',
    },
    routine: { elke: 7, tekst: 'Aqua Care doseren' },
    toepassing: 'Elke week op een vast moment doseren, bijvoorbeeld meteen na de waterverversing.',
    opvolging: [],
    waarschuwingen: ['Werkt alleen bij vast wekelijks gebruik.'],
    profielen: ['zoet_gezelschap', 'zoet_planten', 'zoet_malawi', 'garnalen'],
  },
  {
    id: 'aqua-salt',
    naam: 'Aqua Salt',
    categorie: 'waterbereiding',
    verpakkingen: [],
    lost_op: [],
    richting: 'omhoog',
    omschrijving: 'Mineraalrijk zeezout. Bij het vullen op het volledige volume, daarna enkel nog op het verse water dat u bij een verversing toevoegt.',
    dosering: {
      model: 'vast', hoeveelheid: 1, per: 1, eenheid: 'g', basis: 'versWater',
      label: 'Bij het vullen en op vers water',
      omschrijving: '1 gram per liter vers water',
    },
    toepassing: 'Los het zout op in het verse water vóór u het in de bak giet. Nooit rechtstreeks in de bak strooien.',
    opvolging: [
      { na: '24 uur', actie: 'GH meten met de teststrip.' },
    ],
    waarschuwingen: [
      'Zout verdampt niet mee. Doseer dus enkel op vers water bij een verversing, niet bij het bijvullen van verdampt water.',
    ],
    profielen: ['zoet_gezelschap', 'zoet_malawi'],
  },
  {
    id: 'black-water',
    naam: 'Black Water',
    categorie: 'waterbereiding',
    verpakkingen: [],
    lost_op: [],
    richting: 'neutraliseert',
    omschrijving: 'Tannines voor natuurlijk zwartwater. Geeft het water de lichte theekleur van een tropische beek en is wat de meeste zachtwatervissen en garnalen gewend zijn.',
    dosering: {
      model: 'vast', hoeveelheid: 2.5, per: 10, eenheid: 'ml', basis: 'bak',
      label: 'Na elke waterverversing',
      omschrijving: '2,5 ml per 10 liter bakinhoud',
    },
    toepassing: 'Doseren na elke waterverversing, rechtstreeks in de bak.',
    opvolging: [
      { na: '24 uur', actie: 'pH nakijken: tannines duwen de pH lichtjes omlaag.' },
    ],
    waarschuwingen: ['Niet gebruiken bij Malawi- en Tanganyikacichliden: die willen net hard water met een hoge pH.'],
    profielen: ['zoet_gezelschap', 'zoet_planten', 'garnalen'],
  },
  {
    id: 'catappa-xl',
    naam: 'Catappa XL',
    categorie: 'waterbereiding',
    verpakkingen: [],
    lost_op: [],
    richting: 'neutraliseert',
    omschrijving: 'Natuurlijke waterconditioner in bladvorm. Geeft langzaam tannines af en is tegelijk een graasplek voor garnalen en jonge vis.',
    dosering: {
      model: 'vast', hoeveelheid: 1, per: 50, eenheid: 'blad', basis: 'bak',
      label: 'Eén blad per 50 liter',
      omschrijving: '1 blad per 50 liter bakinhoud',
    },
    routine: { elke: 21, tekst: 'Catappa-blad vervangen' },
    toepassing: 'Leg het blad in de bak. Het zinkt na een dag of twee vanzelf. Laat het liggen tot het afgebroken is.',
    opvolging: [
      { na: '3 weken', actie: 'Blad vervangen: na ongeveer drie weken is het uitgewerkt.' },
    ],
    waarschuwingen: [],
    profielen: ['zoet_gezelschap', 'zoet_planten', 'garnalen'],
  },

  /* ================================================================== hardheid */
  {
    id: 'gh-plus',
    naam: 'GH+',
    categorie: 'buffer',
    verpakkingen: [],
    lost_op: ['gh'],
    richting: 'omhoog',
    omschrijving: 'Verhoogt de totale hardheid. Nodig bij osmosewater, bij zeer zacht leidingwater en bij levendbarenden en garnalen die mineralen nodig hebben voor hun schild.',
    dosering: {
      model: 'delta', param: 'gh', hoeveelheid: 1, per: 5, eenheid: 'ml', effect: 2, basis: 'bak',
      label: 'Per verschuiving van de GH',
      omschrijving: '1 ml per 5 liter verhoogt de GH met 2 graden',
    },
    toepassing: 'Verdeel de dosis over de dag en giet ze in de filterstroom. Meet daarna opnieuw voor u verder gaat.',
    opvolging: [
      { na: '6 uur', actie: 'GH opnieuw meten.' },
      { na: '24 uur', actie: 'GH en KH meten en pas dan verder bijsturen.' },
    ],
    waarschuwingen: [
      'Verhoog de GH nooit met meer dan 2 graden per dag. Een snelle sprong is voor vissen en garnalen zwaarder dan een waarde die een paar dagen te laag staat.',
    ],
    profielen: ['zoet_gezelschap', 'zoet_planten', 'zoet_malawi', 'garnalen'],
  },

  /* ======================================================== algen en helder water */
  {
    id: 'fresh-psb',
    naam: 'Fresh PSB',
    categorie: 'algen',
    verpakkingen: [],
    lost_op: [],
    richting: 'omlaag',
    omschrijving: 'Breekt organisch vuil af. Voor troebel water en voor bakken met een hoge belasting: veel vissen, veel voer, of een bak die net een piek achter de rug heeft.',
    dosering: {
      model: 'vast', hoeveelheid: 1, per: 1, eenheid: 'ml', basis: 'bak',
      label: 'Bij troebel water of hoge belasting',
      omschrijving: '1 ml per liter bakinhoud',
    },
    toepassing: 'Doseren in de filterstroom. Zet de UV-C uit zolang de kuur loopt.',
    opvolging: [
      { na: '48 uur', actie: 'Kijken of het water opgeklaard is en of de vissen rustig ademen.' },
      { na: '7 dagen', actie: 'Volledige set waarden opnieuw meten.' },
    ],
    waarschuwingen: [
      'Zorg voor extra beluchting: de afbraak van organisch vuil verbruikt zuurstof.',
    ],
    profielen: ['zoet_gezelschap', 'zoet_planten', 'zoet_malawi', 'garnalen'],
  },
];

/** Standaarddeel van de bakinhoud dat bij een gewone waterverversing vervangen wordt. */
export const VERS_DEEL = 0.3;

/**
 * Hoeveel liter er voor deze dosering gerekend moet worden.
 *
 * Dit is de stille valkuil van het hele doseren. "4 ml per 10 liter" betekent
 * bij de ene fles de inhoud van de bak en bij de andere het verse water dat u
 * erin giet. Bij een bak van 200 liter en een verversing van 30 procent scheelt
 * dat 80 ml tegenover 24 ml. Daarom staat het in de catalogus, en raadt de app
 * het niet.
 */
export function doseerLiters(dosering, bakLiters, versLiters) {
  if (dosering?.basis !== 'versWater') return bakLiters;
  return versLiters ?? Math.round(bakLiters * VERS_DEEL);
}

/**
 * Berekent de concrete dosis voor een bak.
 * @param {object} product
 * @param {number} liters netto waterinhoud van de bak
 * @param {number} [delta] gewenste verschuiving (enkel bij model 'delta')
 * @param {object} [opties]
 * @param {number} [opties.versLiters] liter vers water, voor doseringen op basis versWater
 * @param {object} [opties.dosering] een andere dosering van hetzelfde product (uit extraDoseringen)
 * @returns {{hoeveelheid:number, eenheid:string, tekst:string, basis:string, liters:number}|null}
 */
export function berekenDosis(product, liters, delta, opties = {}) {
  const d = opties.dosering || product?.dosering;
  if (!d || !liters) return null;
  const volume = doseerLiters(d, liters, opties.versLiters);
  if (!volume) return null;
  const waarop = d.basis === 'versWater' ? `${volume} liter vers water` : `${volume} liter`;

  if (d.model === 'vast') {
    const hoeveelheid = (d.hoeveelheid * volume) / d.per;
    return {
      hoeveelheid: rond(hoeveelheid), eenheid: d.eenheid, basis: d.basis || 'bak', liters: volume,
      tekst: `${rond(hoeveelheid)} ${d.eenheid} voor ${waarop}`,
    };
  }
  if (d.model === 'delta') {
    const stappen = (delta ?? d.effect) / d.effect;
    const hoeveelheid = (d.hoeveelheid * volume * stappen) / d.per;
    return {
      hoeveelheid: rond(hoeveelheid), eenheid: d.eenheid, basis: d.basis || 'bak', liters: volume,
      tekst: `${rond(hoeveelheid)} ${d.eenheid} voor ${waarop} (verschuiving van ${round1(delta ?? d.effect)})`,
    };
  }
  return null;
}

/**
 * Alle doseringen van een product met hun label, zodat de klant de opstartdosis
 * en de onderhoudsdosis naast elkaar ziet in plaats van te moeten kiezen.
 */
export function alleDoseringen(product, liters, delta, opties = {}) {
  const uit = [];
  const eerste = berekenDosis(product, liters, delta, opties);
  if (eerste) uit.push({ label: product.dosering?.label || 'Dosering', omschrijving: product.dosering?.omschrijving || '', ...eerste });
  for (const d of product?.extraDoseringen || []) {
    const r = berekenDosis(product, liters, delta, { ...opties, dosering: d });
    if (r) uit.push({ label: d.label || 'Ook', omschrijving: d.omschrijving || '', ...r });
  }
  return uit;
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

/**
 * De plaatsen in het advies waar een product gevraagd wordt.
 *
 * Het advies zoekt telkens op parameter plus richting. Staat er voor zo'n plek
 * geen product in de catalogus, dan geeft de app wel de handeling (verversen,
 * niet voederen, beluchten) maar geen product en geen dosering. Deze lijst
 * maakt zichtbaar welke plekken nog leeg zijn.
 */
export const ADVIESPLAATSEN = [
  { param: 'cl2', richting: 'neutraliseert', label: 'Chloor in leidingwater', wanneer: 'Bij elke waterverversing en bij bijvullen.' },
  { param: 'no2', richting: 'omlaag', label: 'Nitriet te hoog', wanneer: 'Noodsituatie: verversen, niet voederen, beluchten.' },
  { param: 'nh4', richting: 'omlaag', label: 'Ammonium of ammoniak te hoog', wanneer: 'Noodsituatie, vaak samen met nitriet.' },
  { param: 'no3', richting: 'omlaag', label: 'Nitraat te hoog', wanneer: 'Structureel: verversen en minder voederen.' },
  { param: 'po4', richting: 'omlaag', label: 'Fosfaat te hoog', wanneer: 'Vaak de motor achter draadalgen.' },
  { param: 'kh', richting: 'omhoog', label: 'KH te laag', wanneer: 'Bij een instabiele pH of een pH-val.' },
  { param: 'kh', richting: 'omlaag', label: 'KH te hoog', wanneer: 'Bij zachtwatervissen en garnalen.' },
  { param: 'gh', richting: 'omhoog', label: 'GH te laag', wanneer: 'Bij osmosewater en bij levendbarenden.' },
  { param: 'gh', richting: 'omlaag', label: 'GH te hoog', wanneer: 'Bij zachtwatervissen en kweek.' },
  { param: 'ph', richting: 'omlaag', label: 'pH te hoog', wanneer: 'Stapsgewijs, hoogstens 0,2 per dag.' },
  { param: 'ph', richting: 'omhoog', label: 'pH te laag', wanneer: 'Eerst de KH nakijken, anders zakt ze terug.' },
  { param: 'o2', richting: 'omhoog', label: 'Zuurstof te laag', wanneer: 'Vooral in de vijver bij warm weer.' },
  { param: 'fe', richting: 'omhoog', label: 'IJzer te laag', wanneer: 'Bij bleke of doorschijnende plantenbladeren.' },
];

/**
 * Kijkt per adviesplaats na welk product er antwoordt en of dat product een
 * dosering heeft. Zonder dosering toont de app de naam wel, maar geen milliliters.
 */
export function assortimentControle(catalogus = PRODUCTEN) {
  return ADVIESPLAATSEN.map((plek) => {
    const gevonden = productenVoor(plek.param, plek.richting, null, catalogus);
    return {
      ...plek,
      producten: gevonden.map((p) => ({
        id: p.id, naam: p.naam,
        heeftDosis: !!(p.dosering && p.dosering.hoeveelheid && p.dosering.per),
        dosistekst: p.dosering?.omschrijving || '',
      })),
    };
  });
}
