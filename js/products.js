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
 * Het Colombo-assortiment voor het aquarium, overgenomen uit de bron.
 *
 * LUX AQUA werkt met de producten van COLOMBO (Aquadistri B.V., Breda). Het merk
 * staat bewust NIET in de productnamen hieronder: de klant kent ze als Aqua Start
 * en Bacto Start, zoals ze op het schap staan. Dat wij met Colombo werken, staat
 * een keer bovenaan het productscherm.
 *
 * ELKE DOSERING HIERONDER IS LETTERLIJK OVERGENOMEN uit een van deze twee bronnen,
 * en staat als citaat in het veld `bron` bij het product:
 *   1. de Colombo Aquarium Catalogue 2025/2026 van Aquadistri
 *      (colombo.nl/wp-content/uploads/sites/6/2025/08/Colombo-Aquarium-Catalogue-INT.pdf)
 *   2. de officiele gebruiksaanwijzing van het product zelf
 *      (colombo.nl/wp-content/uploads/sites/6/...Manual-Colombo-...pdf)
 * Waar de catalogus en de gebruiksaanwijzing van elkaar afwijken, is de CATALOGUS
 * gevolgd, op uitdrukkelijke instructie van LUX AQUA. Wat er dan op het flesje
 * staat, is mee opgenomen in het veld `toepassing`, zodat niemand aan de toonbank
 * voor een verrassing staat. Die drie gevallen staan gemarkeerd met AFWIJKING.
 *
 * Niets in dit bestand mag geschat of afgerond worden. Wijzigt Colombo een etiket,
 * haal dan de nieuwe gebruiksaanwijzing op en neem ze opnieuw letterlijk over.
 *
 * VIER DOSERINGSMODELLEN:
 *   vast   een vaste dosis per volume        {model:'vast', hoeveelheid, per, eenheid}
 *   delta  een dosis per eenheid verschuiving {model:'delta', param, hoeveelheid, per, effect, eenheid}
 *   trap   een aantal stuks per volumebereik  {model:'trap', tabel:[{tot, hoeveelheid}], eenheid}
 *   bodem  een dosis per bodemoppervlak       {model:'bodem', hoeveelheid, per, eenheid}  (per in cm2)
 *
 * TWEE BASISSEN, en dit is de fout die het vaakst gemaakt wordt:
 *   bak        de dosis slaat op de volledige inhoud van de bak
 *   versWater  de dosis slaat op het VERSE water dat erbij komt
 * Bij een bak van 200 liter en een verversing van 30 procent scheelt dat een factor
 * meer dan drie. Elk product zegt zelf welke van de twee het is; de test weigert een
 * product waarbij dat ontbreekt.
 */
export const PRODUCTEN = [

  /* ========================================================== waterbereiding */
  {
    id: 'aqua-start', naam: 'Aqua Start', categorie: 'waterbereiding',
    verpakkingen: ['100 ml', '250 ml', '500 ml'],
    lost_op: ['cl2', 'cu'], richting: 'neutraliseert',
    omschrijving: 'Bindt zware metalen, chloor en andere giftige stoffen en maakt leidingwater geschikt voor uw vissen. Bevat daarnaast colloiden en vitaminen die het slijmvlies van uw vissen versterken, waardoor de kans op ziekte kleiner wordt.',
    dosering: {
      model: 'vast', hoeveelheid: 4, per: 10, eenheid: 'ml', basis: 'versWater',
      label: 'Bij het vullen en bij elke waterverversing',
      omschrijving: '4 ml per 10 liter vers water',
    },
    toepassing: 'Bij het vullen van het aquarium eenmalig doseren over de volledige inhoud. Daarna bij elke waterverversing enkel op het verse water. De dop bevat 10 ml.',
    bron: 'Catalogus 2025/2026: "add 4 ml per 10 litres of water once when filling the aquarium, then at each water change add 4 ml per 10 litres to the fresh water only." Gebruiksaanwijzing: "4 ml per 10 liter kraanwater toevoegen."',
    opvolging: [
      { na: 'direct', actie: 'Chloor meten met de teststrip: die moet 0 mg per liter aangeven.' },
      { na: '24 uur', actie: 'Ademhaling, kleur en zwemgedrag van de vissen nakijken.' },
    ],
    waarschuwingen: [],
    profielen: ['zoet_gezelschap', 'zoet_planten', 'zoet_malawi', 'garnalen'],
  },
  {
    id: 'bacto-start', naam: 'Bacto Start', categorie: 'waterbereiding',
    verpakkingen: ['100 ml', '250 ml', '500 ml'],
    lost_op: ['no2', 'nh4'], richting: 'omlaag',
    omschrijving: 'Bevat levende filterbacterien en bevordert de werking van uw aquariumfilter. Werkt het best samen met Aqua Start: Aqua Start maakt het water geschikt voor de vis, Bacto Start levert de levende bacterien.',
    dosering: {
      model: 'vast', hoeveelheid: 10, per: 10, eenheid: 'ml', basis: 'bak',
      label: 'Bij een nieuw aquarium',
      omschrijving: '10 ml per 10 liter bakinhoud',
    },
    extraDoseringen: [
      {
        model: 'vast', hoeveelheid: 5, per: 10, eenheid: 'ml', basis: 'bak',
        label: 'In een bestaand aquarium en na een waterverversing, wekelijks',
        omschrijving: '5 ml per 10 liter bakinhoud',
      },
    ],
    toepassing: 'In de filterstroom doseren, zodat de bacterien meteen in het filtermateriaal terechtkomen. De dop bevat 10 ml. Overdosering is niet schadelijk en geeft zelfs een betere werking. AFWIJKING: de gebruiksaanwijzing op het flesje zegt voor een bestaand aquarium "na iedere schoonmaakbeurt 5 ml per 10 liter"; de catalogus zegt wekelijks en ook na elke waterverversing. Wij volgen de catalogus.',
    bron: 'Catalogus 2025/2026: "in new aquaria, add 10 ml of Bacto Start per 10 litres of water. In existing aquaria and after water changes, add 5 ml per 10 litres every week. Overdosage is not harmful and ensures faster results!"',
    opvolging: [
      { na: '24 uur', actie: 'Nitriet en ammonium meten.' },
      { na: '7 dagen', actie: 'Opnieuw meten. Zet pas vissen bij wanneer nitriet en ammonium twee metingen na elkaar op 0 staan.' },
    ],
    waarschuwingen: [
      'Bij een acute nitriet- of ammoniumpiek eerst water verversen en pas daarna doseren: bacterien alleen werken te traag voor een noodgeval.',
      'Spoel uw filtermateriaal met bakwater, nooit met leidingwater: chloor doodt precies deze bacterien.',
    ],
    profielen: ['zoet_gezelschap', 'zoet_planten', 'zoet_malawi', 'garnalen'],
  },
  {
    id: 'fresh-bacto', naam: 'Fresh Bacto', categorie: 'waterbereiding',
    verpakkingen: [],
    lost_op: ['no2', 'nh4'], richting: 'omlaag',
    omschrijving: 'Levende nitrificerende bacterien voor aquaria tot 1000 liter. Breken ammoniak en nitriet af en maken de bak sneller veilig voor vissen.',
    dosering: {
      model: 'vast', hoeveelheid: 10, per: 10, eenheid: 'ml', basis: 'bak',
      label: 'Bij de opstart',
      omschrijving: '10 ml per 10 liter bakinhoud',
    },
    extraDoseringen: [
      {
        model: 'vast', hoeveelheid: 5, per: 10, eenheid: 'ml', basis: 'bak',
        label: 'Onderhoud',
        omschrijving: '5 ml per 10 liter bakinhoud',
      },
    ],
    toepassing: 'Goed schudden voor gebruik. Koel bewaren bij 4 graden. In de filterstroom doseren.',
    bron: 'Gebruiksaanwijzing Fresh Bacto: "DOSAGE. Shake well before use. Startup: 10 ml/10 ltr. Maintenance: 5 ml/10 ltr."',
    opvolging: [
      { na: '24 uur', actie: 'Nitriet en ammonium meten.' },
      { na: '7 dagen', actie: 'Opnieuw meten voor u iets bijzet.' },
    ],
    waarschuwingen: ['Zet de UV-C uit tijdens de kuur.'],
    profielen: ['zoet_gezelschap', 'zoet_planten', 'zoet_malawi', 'garnalen'],
  },
  {
    id: 'fresh-psb', naam: 'Fresh PSB', categorie: 'waterbereiding',
    verpakkingen: [],
    lost_op: [], richting: 'omlaag',
    omschrijving: 'Levende fotosynthetische bacterien. Breken organisch vuil af en helpen het water helder en stabiel te houden.',
    dosering: {
      model: 'vast', hoeveelheid: 10, per: 50, eenheid: 'ml', basis: 'bak',
      label: 'Bij de opstart',
      omschrijving: '10 ml per 50 liter bakinhoud',
    },
    toepassing: 'Goed schudden voor gebruik. Koel bewaren bij 4 graden. Zet de UV-C uit zolang de kuur loopt.',
    bron: 'Gebruiksaanwijzing Fresh PSB: "DOSAGE. Shake well before use. Startup: 10 ml/50 ltr." en "Overdosering is niet schadelijk maar kan het water vertroebelen."',
    opvolging: [
      { na: '48 uur', actie: 'Kijken of het water opgeklaard is en of de vissen rustig ademen.' },
      { na: '7 dagen', actie: 'Volledige set waarden opnieuw meten.' },
    ],
    waarschuwingen: [
      'Overdosering is niet schadelijk maar kan het water vertroebelen.',
      'Zet de UV-C uit tijdens de kuur.',
    ],
    profielen: ['zoet_gezelschap', 'zoet_planten', 'zoet_malawi', 'garnalen'],
  },
  {
    id: 'bacto-care', naam: 'Bacto Care', categorie: 'waterbereiding',
    verpakkingen: ['100 ml', '250 ml', '500 ml'],
    lost_op: [], richting: 'neutraliseert',
    omschrijving: 'Levende filter- en reinigingsbacterien. Zij zijn de motor van het biologische evenwicht in het aquarium en houden het water schoon en gezond. Werkt het best samen met Aqua Care.',
    dosering: {
      model: 'vast', hoeveelheid: 2, per: 10, eenheid: 'ml', basis: 'bak',
      label: 'Om de twee weken, samen met de waterverversing',
      omschrijving: '2 ml per 10 liter bakinhoud',
    },
    extraDoseringen: [
      {
        model: 'vast', hoeveelheid: 2, per: 10, eenheid: 'ml', basis: 'bak',
        label: 'Bij een nieuw aquarium: de eerste vijf dagen elke dag',
        omschrijving: '2 ml per 10 liter bakinhoud',
      },
    ],
    routine: { elke: 14, tekst: 'Bacto Care doseren' },
    toepassing: 'Hoort bij het onderhoudssysteem van Colombo: om de twee weken 20 procent water verversen en Bacto Care toevoegen, in de week ertussen Aqua Care. Test het water maandelijks. De dop bevat 10 ml. AFWIJKING: de gebruiksaanwijzing op het flesje zegt wekelijks nadoseren; de catalogus zegt om de twee weken. Wij volgen de catalogus.',
    bron: 'Catalogus 2025/2026: "Dosage: 2 ml per 10 litres of water every 2 weeks." Gebruiksaanwijzing: "Bij nieuwe aquaria, dagelijks gedurende 5 dagen, 2 ml per 10 liter water toevoegen. Bij bestaande aquaria en na water verversen, wekelijks 2 ml per 10 liter nadoseren."',
    opvolging: [{ na: '1 maand', actie: 'Volledige set waarden meten en bijsturen waar nodig.' }],
    waarschuwingen: ['Overdosering is niet schadelijk en geeft zelfs een betere werking.'],
    profielen: ['zoet_gezelschap', 'zoet_planten', 'zoet_malawi', 'garnalen'],
  },
  {
    id: 'aqua-care', naam: 'Aqua Care', categorie: 'waterbereiding',
    verpakkingen: ['100 ml', '250 ml', '500 ml'],
    lost_op: ['no3', 'po4'], richting: 'omlaag',
    omschrijving: 'Houdt uw aquarium op een natuurlijke manier schoon en helder. De afbraak van voedingsstoffen zoals nitraat en fosfaat komt op gang, waardoor de waterkwaliteit verbetert en stabiel blijft.',
    dosering: {
      model: 'vast', hoeveelheid: 1, per: 5, eenheid: 'ml', basis: 'bak',
      label: 'Om de twee weken',
      omschrijving: '1 ml per 5 liter bakinhoud',
    },
    routine: { elke: 14, tekst: 'Aqua Care doseren' },
    toepassing: 'Gebruik Aqua Care samen met Bacto Care voor het beste resultaat, in de week tussen twee waterverversingen. Test het water maandelijks. De dop bevat 10 ml. AFWIJKING: de gebruiksaanwijzing op het flesje zegt wekelijks; de catalogus zegt om de twee weken. Wij volgen de catalogus.',
    bron: 'Catalogus 2025/2026: "Dosage: 1 ml per 5 litres of water every 2 weeks. After administration, the aquarium water will be cloudy for about 24 hours." Gebruiksaanwijzing: "1 ml per 5 ltr water per week."',
    opvolging: [{ na: '1 maand', actie: 'Nitraat en fosfaat opnieuw meten.' }],
    waarschuwingen: ['Het water wordt na het doseren ongeveer 24 uur troebel. Dat hoort erbij en gaat vanzelf over.'],
    profielen: ['zoet_gezelschap', 'zoet_planten', 'zoet_malawi', 'garnalen'],
  },
  {
    id: 'black-water', naam: 'Black Water', categorie: 'waterbereiding',
    verpakkingen: [],
    lost_op: [], richting: 'neutraliseert',
    omschrijving: 'Bevat turfextract en bootst het water na waar discussen, maanvissen, meervallen, zalmen en Zuid-Amerikaanse cichliden vandaan komen. Stabiliseert de pH op een natuurlijke manier, kleurt het water lichtbruin en remt daarmee ook de algengroei.',
    dosering: {
      model: 'vast', hoeveelheid: 2.5, per: 10, eenheid: 'ml', basis: 'bak',
      label: 'Bij de start',
      omschrijving: '2,5 ml (1 pompstoot) per 10 liter bakinhoud',
    },
    extraDoseringen: [
      {
        model: 'vast', hoeveelheid: 2.5, per: 10, eenheid: 'ml', basis: 'versWater',
        label: 'Daarna om de twee weken, bij elke waterverversing',
        omschrijving: '2,5 ml per 10 liter vers water',
      },
    ],
    toepassing: 'Bij de start doseren over de volledige inhoud van de bak, daarna om de twee weken op het verse water bij elke verversing.',
    bron: 'Catalogus 2025/2026: "At the start, pump 1 x (2.5ML) per 10 litres of aquarium water, then repeat dosing every 2 weeks, adding 2.5 ML per 10 litres of fresh water with every water change."',
    opvolging: [{ na: '24 uur', actie: 'pH nakijken: turfextract duwt de pH lichtjes omlaag.' }],
    waarschuwingen: ['Niet gebruiken bij Malawi- en Tanganyikacichliden: die willen net hard water met een hoge pH.'],
    profielen: ['zoet_gezelschap', 'zoet_planten', 'garnalen'],
  },
  {
    id: 'catappa-xl', naam: 'Catappa XL', categorie: 'waterbereiding',
    verpakkingen: [],
    lost_op: [], richting: 'neutraliseert',
    omschrijving: 'Bladeren van de zeemandelboom. Geven langzaam looistoffen af, zijn een natuurlijke waterconditioner en dienen tegelijk als bijvoer en graasplek voor garnalen en kreeftjes.',
    dosering: {
      model: 'vast', hoeveelheid: 1, per: 100, perMax: 50, eenheid: 'blad', basis: 'bak',
      label: 'Eén blad per 50 tot 100 liter',
      omschrijving: '1 blad per 50 tot 100 liter bakinhoud',
    },
    routine: { elke: 21, tekst: 'Catappa-blad vervangen' },
    toepassing: 'Leg het blad in de bak. Het drijft ongeveer twee dagen en zinkt daarna. De werkzame stoffen zijn na drie weken volledig vrijgekomen.',
    bron: 'Catalogus 2025/2026: "Use: 1 leaf/50-100l water. The active ingredients are fully released after 3 weeks."',
    opvolging: [{ na: '3 weken', actie: 'Blad vervangen: de werkzame stoffen zijn dan vrijgekomen.' }],
    waarschuwingen: [],
    profielen: ['zoet_gezelschap', 'zoet_planten', 'garnalen'],
  },
  {
    id: 'catappa-nano', naam: 'Catappa Nano', categorie: 'waterbereiding',
    verpakkingen: [],
    lost_op: [], richting: 'neutraliseert',
    omschrijving: 'De kleine maat catappabladeren, voor nanobakken en garnalenbakken.',
    dosering: {
      model: 'vast', hoeveelheid: 1, per: 30, perMax: 15, eenheid: 'blad', basis: 'bak',
      label: 'Eén blad per 15 tot 30 liter',
      omschrijving: '1 blad per 15 tot 30 liter bakinhoud',
    },
    routine: { elke: 14, tekst: 'Catappa-blad vervangen' },
    toepassing: 'Leg het blad in de bak. Het drijft ongeveer twee dagen en zinkt daarna. De werkzame stoffen komen na een tot drie weken volledig vrij.',
    bron: 'Catalogus 2025/2026: "Use: 1 leaf/15 - 30 l of water. The active ingredients are completely released after 1- 3 weeks. The leaves float for about 2 days, after which they sink."',
    opvolging: [{ na: '2 weken', actie: 'Blad vervangen.' }],
    waarschuwingen: [],
    profielen: ['zoet_planten', 'garnalen'],
  },

  /* ================================================================ hardheid */
  {
    id: 'kh-plus', naam: 'KH Plus', categorie: 'buffer',
    verpakkingen: ['100 ml', '250 ml'],
    lost_op: ['kh'], richting: 'omhoog',
    omschrijving: 'Verhoogt de carbonaathardheid. Staat de KH te laag, dan kan de pH snel schommelen en dat is bijzonder schadelijk voor uw vissen. De KH is de buffer die uw pH op zijn plaats houdt.',
    dosering: {
      model: 'delta', param: 'kh', hoeveelheid: 1, per: 5, eenheid: 'ml', effect: 2, basis: 'bak',
      label: 'Per verschuiving van de KH',
      omschrijving: '1 ml per 5 liter verhoogt de KH met 2 °DH',
    },
    toepassing: 'Verdeel de dosis en giet ze in de filterstroom. Indien nodig de volgende dag herhalen. De dop bevat 10 ml.',
    bron: 'Catalogus 2025/2026 en gebruiksaanwijzing: "1 ml KH Plus per 5 litres of aquarium water increases the KH by 2 DH. Repeat the next day if necessary." en "We recommend increasing the hardness by up to 2DH per day."',
    opvolging: [
      { na: '6 uur', actie: 'KH opnieuw meten.' },
      { na: '24 uur', actie: 'KH en pH meten en pas dan verder bijsturen.' },
    ],
    waarschuwingen: ['Colombo raadt aan de hardheid met hoogstens 2 °DH per dag te verhogen.'],
    profielen: ['zoet_gezelschap', 'zoet_planten', 'zoet_malawi', 'garnalen'],
  },
  {
    id: 'gh-plus', naam: 'GH Plus', categorie: 'buffer',
    verpakkingen: ['100 ml', '250 ml'],
    lost_op: ['gh'], richting: 'omhoog',
    omschrijving: 'Verhoogt de totale hardheid. Een te lage GH is slecht voor de gezondheid van uw vissen en voor de groei van uw planten, en garnalen hebben mineralen nodig om te kunnen vervellen.',
    dosering: {
      model: 'delta', param: 'gh', hoeveelheid: 1, per: 5, eenheid: 'ml', effect: 2, basis: 'bak',
      label: 'Per verschuiving van de GH',
      omschrijving: '1 ml per 5 liter verhoogt de GH met 2 °DH',
    },
    toepassing: 'Verdeel de dosis en giet ze in de filterstroom. Indien nodig de volgende dag herhalen. De dop bevat 10 ml.',
    bron: 'Catalogus 2025/2026 en gebruiksaanwijzing: "1ml GH Plus per 5 litres of aquarium water increases the GH by 2 DH. Repeat the next day if necessary." en "We recommend increasing the hardness by up to 2DH per day."',
    opvolging: [
      { na: '6 uur', actie: 'GH opnieuw meten.' },
      { na: '24 uur', actie: 'GH en KH meten en pas dan verder bijsturen.' },
    ],
    waarschuwingen: ['Colombo raadt aan de hardheid met hoogstens 2 °DH per dag te verhogen.'],
    profielen: ['zoet_gezelschap', 'zoet_planten', 'zoet_malawi', 'garnalen'],
  },
  {
    id: 'ph-min', naam: 'pH Min', categorie: 'buffer',
    verpakkingen: ['100 ml', '250 ml'],
    lost_op: ['ph'], richting: 'omlaag',
    omschrijving: 'Verlaagt de zuurtegraad van het aquariumwater. Hoeveel de pH zakt, hangt af van uw KH: hoe hoger de carbonaathardheid, hoe harder de pH vastzit.',
    dosering: {
      model: 'delta', param: 'ph', hoeveelheid: 1, per: 5, eenheid: 'ml', effect: 1, basis: 'bak',
      label: 'Per verschuiving van de pH',
      omschrijving: '1 ml per 5 liter verlaagt de pH met ongeveer 1 eenheid, afhankelijk van de KH',
    },
    toepassing: 'Controleer eerst de KH van uw water en corrigeer die zo nodig met KH Plus. Ververs 20 procent van het water en voeg Aqua Start toe. Indien nodig de volgende dag herhalen. De dop bevat 10 ml.',
    bron: 'Catalogus 2025/2026 en gebruiksaanwijzing: "1 ml pH-Min per 5 litres of aquarium water lowers the pH by about 1 unit depending on the KH. Repeat the next day if necessary." en "We recommend reducing pH by up to 1 unit per day."',
    opvolging: [
      { na: '6 uur', actie: 'pH opnieuw meten.' },
      { na: '24 uur', actie: 'pH en KH meten en pas dan verder bijsturen.' },
    ],
    waarschuwingen: [
      'Colombo geeft als grens hoogstens 1 pH-eenheid per dag. In een bezette bak raden wij u aan het trager te doen: liever een waarde die een paar dagen te hoog staat dan een sprong die uw vissen niet aankunnen.',
      'Werkt de pH niet mee, kijk dan eerst naar de KH: zonder buffer zakt elke correctie terug.',
    ],
    profielen: ['zoet_gezelschap', 'zoet_planten', 'garnalen'],
  },

  /* ============================================================ filter, pads */
  {
    id: 'ammo-stop', naam: 'Ammo Stop', categorie: 'filter',
    verpakkingen: [],
    lost_op: ['nh4'], richting: 'omlaag',
    omschrijving: 'Filterpads die ammoniak uit het water halen en het biofilter ondertussen op een natuurlijke manier laten rijpen. Zij werken twaalf weken.',
    dosering: {
      model: 'trap', eenheid: 'pad', basis: 'bak',
      tabel: [{ tot: 250, hoeveelheid: 1 }, { tot: 750, hoeveelheid: 2 }, { tot: 1500, hoeveelheid: 3 }],
      label: 'Aantal pads in uw filter',
      omschrijving: '1 pad tot 250 liter, 2 pads tot 750 liter, 3 pads tot 1500 liter',
    },
    toepassing: 'Spoel de pads voor gebruik. Leg ze PLAT in uw interne of externe filter, niet geplet, en altijd NA het biologische gedeelte. Anders stroomt het water er niet goed door en werken zij niet.',
    bron: 'Gebruiksaanwijzing Ammo Stop: "1x pad 0 - 250 Litres, 2x pads 250 - 750 Litres, 3x pads 750 - 1500 Litres" en "Voeg het juiste aantal pads toe aan uw interne of externe filtratie, wat het biofilter op natuurlijke wijze laat rijpen in de 12 weken dat de pads werken."',
    opvolging: [
      { na: '24 uur', actie: 'Ammonium opnieuw meten.' },
      { na: '12 weken', actie: 'Pads vervangen: zij zijn dan uitgewerkt.' },
    ],
    waarschuwingen: ['De pads moeten plat liggen en na het biologische filtermateriaal zitten om te werken.'],
    profielen: ['zoet_gezelschap', 'zoet_planten', 'zoet_malawi', 'garnalen'],
  },
  {
    id: 'nitro-stop', naam: 'Nitro Stop', categorie: 'filter',
    verpakkingen: [],
    lost_op: ['no2'], richting: 'omlaag',
    omschrijving: 'Filterpads die nitriet uit het water halen. Vooral bedoeld voor een nieuw aquarium dat nog niet ingedraaid is.',
    dosering: {
      model: 'trap', eenheid: 'pad', basis: 'bak',
      tabel: [{ tot: 150, hoeveelheid: 1 }, { tot: 250, hoeveelheid: 2 }, { tot: 350, hoeveelheid: 3 }],
      label: 'Aantal pads in uw filter',
      omschrijving: '1 pad tot 150 liter, 2 pads tot 250 liter, 3 pads tot 350 liter',
    },
    toepassing: 'Spoel de pads voor gebruik. Leg ze plat in uw filter, na het biologische gedeelte. In een ingedraaid aquarium eerst de filtratie reinigen. De pads kunnen geregenereerd worden door ze een nacht in een tienprocentsoplossing van zout te leggen en daarna goed te spoelen.',
    bron: 'Gebruiksaanwijzing Nitro Stop: "1x pad 0 - 150 Litres, 2x pads 150 - 250 Litres, 3x pads 250 - 350 Litres" en "Nitro pads kunnen geregenereerd worden door ze overnacht in een 10%-zoutoplossing te leggen."',
    opvolging: [
      { na: '24 uur', actie: 'Nitriet opnieuw meten.' },
      { na: '7 dagen', actie: 'Nitriet meten en de pads zo nodig regenereren.' },
    ],
    waarschuwingen: ['De pads moeten plat liggen en na het biologische filtermateriaal zitten om te werken.'],
    profielen: ['zoet_gezelschap', 'zoet_planten', 'zoet_malawi', 'garnalen'],
  },
  {
    id: 'phospho-stop', naam: 'Phospho Stop', categorie: 'filter',
    verpakkingen: [],
    lost_op: ['po4'], richting: 'omlaag',
    omschrijving: 'Filterpads die fosfaat uit het water halen. Fosfaat is de motor achter draadalgen en groen water.',
    dosering: {
      model: 'trap', eenheid: 'pad', basis: 'bak',
      tabel: [{ tot: 250, hoeveelheid: 1 }, { tot: 750, hoeveelheid: 2 }, { tot: 1500, hoeveelheid: 3 }],
      label: 'Aantal pads in uw filter',
      omschrijving: '1 pad tot 250 liter, 2 pads tot 750 liter, 3 pads tot 1500 liter',
    },
    toepassing: 'Spoel de pads voor gebruik. Leg ze plat in uw filter, na het biologische gedeelte. In een ingedraaid aquarium eerst de filtratie reinigen.',
    bron: 'Gebruiksaanwijzing Phospho Stop: "1x pad 0 - 250 Litres, 2x pads 250 - 750 Litres, 3x pads 750 - 1500 Litres."',
    opvolging: [
      { na: '7 dagen', actie: 'Fosfaat opnieuw meten.' },
      { na: '1 maand', actie: 'Fosfaat meten en de pads zo nodig vervangen.' },
    ],
    waarschuwingen: ['De pads moeten plat liggen en na het biologische filtermateriaal zitten om te werken.'],
    profielen: ['zoet_gezelschap', 'zoet_planten', 'zoet_malawi', 'garnalen'],
  },

  /* ======================================================= algen en helder water */
  {
    id: 'algisin', naam: 'Algisin', categorie: 'algen',
    verpakkingen: ['100 ml'],
    lost_op: [], richting: 'omlaag',
    omschrijving: 'Bestrijdt algen en zorgt voor een helder aquarium. Werkt tegen alle soorten algen en bevat geen koper.',
    dosering: {
      model: 'vast', hoeveelheid: 1, per: 20, eenheid: 'ml', basis: 'bak',
      label: 'Per behandeling',
      omschrijving: '1 afgestreken maatschep (1 ml) per 20 liter bakinhoud',
    },
    toepassing: 'Test eerst de waterkwaliteit en corrigeer waar nodig vóór u een algenmiddel gebruikt: een alg is een gevolg, niet de oorzaak. Met 100 ml kan 1000 liter tweemaal behandeld worden.',
    bron: 'Catalogus 2025/2026 en gebruiksaanwijzing: "Dosage: 1 ml per 20 litres of water, with 100 ml 1000 litres can be treated twice. Always test the aquarium water first and correct if necessary before adding algaecide!"',
    opvolging: [
      { na: '48 uur', actie: 'Extra beluchten en kijken of de vissen rustig ademen: afstervende algen verbruiken zuurstof.' },
      { na: '7 dagen', actie: 'Nitraat en fosfaat meten: zolang die hoog staan, komen de algen terug.' },
    ],
    waarschuwingen: [
      'Zet extra beluchting bij tijdens en na de behandeling: afstervende algen verbruiken zuurstof.',
      'Pak ook de oorzaak aan. Zonder minder voeren, meer planten en lagere nitraat- en fosfaatwaarden komt de alg terug.',
    ],
    profielen: ['zoet_gezelschap', 'zoet_planten', 'zoet_malawi', 'garnalen'],
  },
  {
    id: 'cerpofor-aerocol', naam: 'Cerpofor Aerocol', categorie: 'algen',
    verpakkingen: [],
    lost_op: [], richting: 'omlaag',
    omschrijving: 'Werkt tegen alle soorten blauwalg. Blauwalg is geen echte alg maar een bacterie, en gewone algenmiddelen halen er weinig uit.',
    dosering: {
      model: 'vast', hoeveelheid: 3, per: 100, eenheid: 'ml', basis: 'bak',
      label: 'Op drie opeenvolgende dagen',
      omschrijving: '3 ml per 100 liter bakinhoud, op dag 1, 2 en 3',
    },
    toepassing: 'Drie dagen na elkaar doseren. Gebruik een doseerspuit zodat u precies doseert.',
    bron: 'Catalogus 2025/2026: "Dosage: Aerocol should be used on three consecutive days. Every 3 days, add 3 ml per 100 litres of water. Use a dosing syringe for precise dosing." en "Harmful to snails and other invertebrates."',
    opvolging: [
      { na: '3 dagen', actie: 'Kuur afronden en extra beluchten.' },
      { na: '7 dagen', actie: 'Kijken of de blauwalg weg blijft en de waarden meten.' },
    ],
    waarschuwingen: [
      'Schadelijk voor slakken en andere ongewervelden. Niet gebruiken in een garnalenbak.',
      'Zet extra beluchting bij tijdens de kuur.',
    ],
    profielen: ['zoet_gezelschap', 'zoet_planten', 'zoet_malawi'],
  },

  /* ========================================================== plantenvoeding */
  {
    id: 'flora-grow', naam: 'Flora Grow', categorie: 'voeding',
    verpakkingen: ['250 ml', '500 ml', '2500 ml'],
    lost_op: [], richting: 'omhoog',
    omschrijving: 'Vloeibare plantenvoeding voor het aquarium. Met 250 ml behandelt u 1250 liter water.',
    dosering: {
      model: 'vast', hoeveelheid: 1, per: 5, eenheid: 'ml', basis: 'bak',
      label: 'Wekelijks',
      omschrijving: '1 pompstoot (1 ml) per 5 liter bakinhoud',
    },
    routine: { elke: 7, tekst: 'Flora Grow doseren' },
    toepassing: 'Schudden voor gebruik. Wekelijks doseren, bij voorkeur na de waterverversing. Buiten bereik van kinderen bewaren.',
    bron: 'Catalogus 2025/2026: "Dosage: pump once for 5 litres of aquarium water, dose weekly." Gebruiksaanwijzing: "1x pompen per 5 liter water. Flora-Grow moet wekelijks toegediend worden."',
    opvolging: [{ na: '1 maand', actie: 'Groei en bladkleur bekijken en zo nodig bijsturen.' }],
    waarschuwingen: [],
    profielen: ['zoet_gezelschap', 'zoet_planten', 'garnalen'],
  },
  {
    id: 'flora-grow-pro', naam: 'Flora Grow Pro', categorie: 'voeding',
    verpakkingen: ['250 ml', '500 ml', '2500 ml'],
    lost_op: [], richting: 'omhoog',
    omschrijving: 'De zwaardere plantenvoeding, voor sterk beplante bakken en aquascapes.',
    dosering: {
      model: 'vast', hoeveelheid: 1, per: 5, eenheid: 'ml', basis: 'bak',
      label: 'Wekelijks',
      omschrijving: '1 pompstoot (1 ml) per 5 liter bakinhoud',
    },
    routine: { elke: 7, tekst: 'Flora Grow Pro doseren' },
    toepassing: 'Schudden voor gebruik. Wekelijks doseren. Buiten bereik van kinderen bewaren.',
    bron: 'Catalogus 2025/2026: "Dosage: pump once for 5 litres of aquarium water, dose weekly." Gebruiksaanwijzing: "1x pompen per 5 liter water. Flora-Grow Pro moet wekelijks toegediend worden."',
    opvolging: [{ na: '1 maand', actie: 'Groei en bladkleur bekijken en zo nodig bijsturen.' }],
    waarschuwingen: [],
    profielen: ['zoet_planten'],
  },
  {
    id: 'flora-carbo', naam: 'Flora Carbo', categorie: 'voeding',
    verpakkingen: ['250 ml', '500 ml', '2500 ml'],
    lost_op: [], richting: 'omhoog',
    omschrijving: 'Vloeibare koolstofbron voor waterplanten, als alternatief voor een CO2-installatie. Met 250 ml behandelt u 12500 liter water.',
    dosering: {
      model: 'vast', hoeveelheid: 1, per: 50, eenheid: 'ml', basis: 'bak',
      label: 'Dagelijks',
      omschrijving: '1 pompstoot (1 ml) per 50 liter bakinhoud',
    },
    routine: { elke: 1, tekst: 'Flora Carbo doseren' },
    toepassing: 'Elke dag doseren. Zorg voor een goede waterkwaliteit en meet regelmatig: een KH van minstens 5 °DH is hier van belang.',
    bron: 'Catalogus 2025/2026: "Dosage: pump once for 50 litres of aquarium water, dose daily." Gebruiksaanwijzing: "1x pompen per 50 liter, FloraGrow Carbo moet dagelijks toegediend worden. Van belang is een juiste KH van min. 5°DH."',
    opvolging: [{ na: '7 dagen', actie: 'KH meten: die moet minstens 5 °DH zijn.' }],
    waarschuwingen: ['Werkt enkel goed bij een KH van minstens 5 °DH.'],
    profielen: ['zoet_planten', 'zoet_gezelschap'],
  },
  {
    id: 'flora-nitro', naam: 'Flora Nitro', categorie: 'voeding',
    verpakkingen: ['250 ml'],
    lost_op: ['no3'], richting: 'omhoog',
    omschrijving: 'Stikstofvoeding voor waterplanten. In een sterk beplante bak kan nitraat juist te laag staan, en dan blijven de planten achter.',
    dosering: {
      model: 'delta', param: 'no3', hoeveelheid: 1.25, per: 25, eenheid: 'ml', effect: 2.5, basis: 'bak',
      label: 'Per verschuiving van het nitraat',
      omschrijving: '1 pompstoot (1,25 ml) per 25 liter verhoogt het nitraat met 2,5 mg per liter',
    },
    toepassing: 'Doseren naar wat uw planten nodig hebben. Meet eerst: doseer dit nooit zonder meting.',
    bron: 'Catalogus 2025/2026 en gebruiksaanwijzing: "1x pompen per 25 liter water voor +2.5 mg nitraat/ltr."',
    opvolging: [{ na: '24 uur', actie: 'Nitraat opnieuw meten.' }],
    waarschuwingen: ['Doseer dit nooit zonder meting: nitraat bijvoegen in een bak die al te hoog staat, voedt uw algen.'],
    profielen: ['zoet_planten'],
  },
  {
    id: 'flora-phospho', naam: 'Flora Phospho', categorie: 'voeding',
    verpakkingen: ['250 ml'],
    lost_op: ['po4'], richting: 'omhoog',
    omschrijving: 'Fosfaatvoeding voor waterplanten, voor een bak waar het fosfaat op nul staat en de planten daardoor niet doorgroeien.',
    dosering: {
      model: 'delta', param: 'po4', hoeveelheid: 1.25, per: 25, eenheid: 'ml', effect: 0.1, basis: 'bak',
      label: 'Per verschuiving van het fosfaat',
      omschrijving: '1 pompstoot (1,25 ml) per 25 liter verhoogt het fosfaat met 0,1 mg per liter',
    },
    toepassing: 'Doseren naar wat uw planten nodig hebben. Meet eerst.',
    bron: 'Catalogus 2025/2026 en gebruiksaanwijzing: "1x pompen per 25 liter water voor +0.1 mg fosfaat/ltr."',
    opvolging: [{ na: '24 uur', actie: 'Fosfaat opnieuw meten.' }],
    waarschuwingen: ['Doseer dit nooit zonder meting: fosfaat is de motor achter draadalgen.'],
    profielen: ['zoet_planten'],
  },
  {
    id: 'flora-ferro', naam: 'Flora Ferro', categorie: 'voeding',
    verpakkingen: ['250 ml'],
    lost_op: ['fe'], richting: 'omhoog',
    omschrijving: 'IJzervoeding voor waterplanten. IJzertekort geeft groeiproblemen: vooral Echinodorus, Cryptocoryne en roodbladige planten hebben extra ijzer nodig.',
    dosering: {
      model: 'delta', param: 'fe', hoeveelheid: 1.25, per: 25, eenheid: 'ml', effect: 0.05, basis: 'bak',
      label: 'Per verschuiving van het ijzer',
      omschrijving: '1 pompstoot (1,25 ml) per 25 liter verhoogt het ijzer met 0,05 mg per liter',
    },
    toepassing: 'Doseren naar wat uw planten nodig hebben.',
    bron: 'Catalogus 2025/2026 en gebruiksaanwijzing: "1x pompen per 25 liter water voor +0.05 mg ijzer/ltr."',
    opvolging: [{ na: '7 dagen', actie: 'IJzer meten en naar de bladkleur kijken.' }],
    waarschuwingen: [],
    profielen: ['zoet_planten', 'zoet_gezelschap'],
  },
  {
    id: 'fe-tabs', naam: 'FE Tabs', categorie: 'voeding',
    verpakkingen: ['10 tabletten'],
    lost_op: ['fe'], richting: 'omhoog',
    omschrijving: 'IJzertabletten voor de bodem, die het ijzer rechtstreeks bij de wortels brengen. IJzertekort geeft groeiproblemen, vooral bij Echinodorus, Cryptocoryne en roodbladige planten.',
    /* Bewust GEEN berekening over de hele bodem. Het etiket zegt "1 tablet per
       10 cm2 bodemoppervlak", maar dat slaat op de plek rond een plant, niet op
       de vloer van de hele bak: een verpakking bevat tien tabletten en een bak
       van 120 bij 50 heeft 6000 cm2 bodem. Letterlijk doorrekenen geeft 600
       tabletten, en dat is geen dosering maar een rekenfout. De app toont dus
       de zin van het etiket en laat het tellen aan de klant. */
    dosering: {
      model: 'geen', eenheid: 'tablet', basis: 'bak',
      label: 'Elke zes maanden',
      omschrijving: '1 tablet per 10 cm² bodemoppervlak, diep in de bodem bij de wortels',
    },
    routine: { elke: 182, tekst: 'IJzertabletten vervangen' },
    toepassing: 'Elke zes maanden een tablet diep in de bodem steken, dicht bij de wortels van de planten. De 10 cm² van het etiket slaat op de plek rond een plant, niet op de hele bodem: een verpakking bevat tien tabletten.',
    bron: 'Catalogus 2025/2026 en gebruiksaanwijzing: "every 6 months, insert 1 tablet per 10 cm2 of soil surface, deep into the soil, close to the roots of plants."',
    opvolging: [{ na: '6 maanden', actie: 'Nieuwe tabletten in de bodem steken.' }],
    waarschuwingen: [],
    profielen: ['zoet_planten', 'zoet_gezelschap'],
  },
  {
    id: 'nutri-caps', naam: 'Nutri Caps', categorie: 'voeding',
    verpakkingen: ['10 capsules'],
    lost_op: [], richting: 'omhoog',
    omschrijving: 'Voedingscapsules voor de bodem. Werken met Osmocote, dat de voedingsstoffen langzaam en gelijkmatig vrijgeeft voor een stabiele plantengroei.',
    /* Zie de opmerking bij FE Tabs: niet over de hele bodem doorrekenen. */
    dosering: {
      model: 'geen', eenheid: 'capsule', basis: 'bak',
      label: 'Elke zes maanden',
      omschrijving: '1 capsule diep in de bodem bij een grote plant, of 1 per 20 cm² rond kleinere planten',
    },
    routine: { elke: 182, tekst: 'Voedingscapsules vervangen' },
    toepassing: 'Elke zes maanden een capsule diep in de bodem steken bij een grote plant. Bij kleinere planten rekent u met een capsule per 20 cm² bodem rond de plant, niet per 20 cm² van de hele bodem: een verpakking bevat tien capsules.',
    bron: 'Catalogus 2025/2026 en gebruiksaanwijzing: "Once every 6 months, insert 1 capsule deep into the soil on large plants or use 1 capsule per 20 cm2 of soil surface."',
    opvolging: [{ na: '6 maanden', actie: 'Nieuwe capsules in de bodem steken.' }],
    waarschuwingen: [],
    profielen: ['zoet_planten'],
  },

  /* ========================================================== visverzorging */
  {
    id: 'aqua-salt', naam: 'Aqua Salt', categorie: 'zorg',
    verpakkingen: [],
    lost_op: [], richting: 'omhoog',
    omschrijving: 'Mineraalrijk zout dat het water beter geschikt maakt voor de vis. Veel vissen gedijen beter in licht gezouten water; het ideale zoutgehalte voor de opname is 0,1 procent.',
    dosering: {
      model: 'vast', hoeveelheid: 1, per: 1, eenheid: 'g', basis: 'versWater',
      label: 'Bij het vullen en op vers water',
      omschrijving: '1 gram per liter vers water',
    },
    toepassing: 'Los het zout eerst op in warm water en verdeel het daarna over het aquarium. Nooit rechtstreeks in de bak strooien. Een maatschep van 15 ml bevat 20 gram.',
    bron: 'Catalogus 2025/2026 en gebruiksaanwijzing: "Bij het vullen van het aquarium eenmalig 1 gram Aqua Salt per liter aquariumwater toevoegen, daarna bij iedere waterverversing 1 gram per liter toevoegen aan uitsluitend het verse water."',
    opvolging: [{ na: '24 uur', actie: 'Gedrag van de vissen nakijken.' }],
    waarschuwingen: [
      'Zout verdampt niet mee. Doseer dus enkel op vers water bij een verversing, niet bij het bijvullen van verdampt water.',
      'Niet geschikt voor elke bak: waterplanten en sommige soorten verdragen zout slecht. Vraag het na in de winkel.',
    ],
    profielen: ['zoet_gezelschap', 'zoet_malawi'],
  },
  {
    id: 'goldfish-care', naam: 'Goldfish Care', categorie: 'zorg',
    verpakkingen: ['100 ml'],
    lost_op: [], richting: 'omhoog',
    omschrijving: 'Verzorgingsmiddel op maat van goudvissen, met vitaminen, mineralen en verzorgende bestanddelen. Eén verpakking van 100 ml is goed voor ruim 100 liter.',
    dosering: {
      model: 'vast', hoeveelheid: 1, per: 1, eenheid: 'g', basis: 'versWater',
      label: 'Bij het vullen en op vers water',
      omschrijving: '1 gram per liter vers water',
    },
    toepassing: 'Los het product eerst op in warm water en verdeel het daarna over het aquarium. De dop bevat 15 gram.',
    bron: 'Catalogus 2025/2026 en gebruiksaanwijzing: "Bij het vullen van het aquarium eenmalig 1 gr Goldfish Care per 1 liter water toevoegen, daarna bij iedere waterverversing 1 gr per 1 liter toevoegen aan uitsluitend het verse water."',
    opvolging: [{ na: '24 uur', actie: 'Gedrag van de vissen nakijken.' }],
    waarschuwingen: [],
    profielen: ['zoet_gezelschap'],
  },
  {
    id: 'betta-care', naam: 'Betta Care', categorie: 'zorg',
    verpakkingen: [],
    lost_op: [], richting: 'neutraliseert',
    omschrijving: 'Catappa-extract dat kempvissen beschermt en in conditie houdt. Bootst het water van Zuidoost-Azie na, waar de betta vandaan komt.',
    dosering: {
      model: 'vast', hoeveelheid: 1, per: 5, eenheid: 'ml', basis: 'bak',
      label: 'Wekelijks',
      omschrijving: '1 ml per 5 liter bakinhoud',
    },
    routine: { elke: 7, tekst: 'Betta Care doseren' },
    toepassing: 'Goed schudden voor gebruik. Wekelijks doseren voor het beste resultaat. Eén dop is 10 ml.',
    bron: 'Catalogus 2025/2026: "Dosage: 1 ml per 5 liters of water; use weekly for best results. One cap = 10 ml. Shake well before use. The water will become cloudy up to 24 hours after use."',
    opvolging: [],
    waarschuwingen: ['Het water wordt tot 24 uur na het doseren troebel. Dat hoort erbij.'],
    profielen: ['zoet_gezelschap', 'zoet_planten'],
  },
  {
    id: 'shrimp-care', naam: 'Shrimp Care', categorie: 'zorg',
    verpakkingen: [],
    lost_op: [], richting: 'neutraliseert',
    omschrijving: 'Maakt leidingwater geschikt voor garnalen. Bevat aloe vera die uw garnalen beschermt en extra mineralen die hen voeden en helpen bij het vervellen.',
    dosering: {
      model: 'vast', hoeveelheid: 1, per: 5, eenheid: 'ml', basis: 'bak',
      label: 'Wekelijks',
      omschrijving: '1 ml per 5 liter bakinhoud',
    },
    routine: { elke: 7, tekst: 'Shrimp Care doseren' },
    toepassing: 'Goed schudden voor gebruik. Wekelijks doseren voor het beste resultaat. Eén dop is 10 ml.',
    bron: 'Catalogus 2025/2026: "Dosage: 1 ml per 5 liters of water; use weekly for best results. One cap = 10 ml. Shake well before use. The water will become cloudy up to 24 hours after use."',
    opvolging: [],
    waarschuwingen: ['Het water wordt tot 24 uur na het doseren troebel. Dat hoort erbij.'],
    profielen: ['garnalen'],
  },

  /* ================================================ behandelingen (Cerpofor) */
  {
    id: 'cerpofor-dactycid', naam: 'Cerpofor Dactycid', categorie: 'zorg',
    verpakkingen: ['100 ml (500 liter)', '1000 ml (5000 liter)'],
    lost_op: [], richting: 'neutraliseert',
    omschrijving: 'Behandeling tegen huid- en kieuwwormen.',
    dosering: {
      model: 'vast', hoeveelheid: 2, per: 10, eenheid: 'ml', basis: 'bak',
      label: 'Per behandeling',
      omschrijving: '2 ml per 10 liter bakinhoud, 100 ml volstaat voor 500 liter',
    },
    toepassing: 'Enkel gebruiken na een vastgestelde diagnose. Kom eerst langs of stuur foto\'s door via de hulpknop: een verkeerde behandeling kost tijd die uw vissen niet hebben.',
    bron: 'Catalogus 2025/2026: "Dosage: 2 ml per 10 litres of water, 100 ml is sufficient for 500 litres."',
    opvolging: [{ na: '48 uur', actie: 'Gedrag van de vissen opvolgen en met LUX AQUA overleggen.' }],
    waarschuwingen: [
      'Dit is een behandeling, geen onderhoudsproduct. Stel eerst vast wat uw vissen hebben.',
      'Zet actieve kool en UV-C uit tijdens de kuur.',
    ],
    profielen: ['zoet_gezelschap', 'zoet_planten', 'zoet_malawi'],
  },
  {
    id: 'cerpofor-alparex', naam: 'Cerpofor Alparex', categorie: 'zorg',
    verpakkingen: ['100 ml (500 liter)', '1000 ml (5000 liter)'],
    lost_op: [], richting: 'neutraliseert',
    omschrijving: 'Behandeling tegen onzichtbare parasieten.',
    dosering: {
      model: 'vast', hoeveelheid: 2, per: 10, eenheid: 'ml', basis: 'bak',
      label: 'Per behandeling',
      omschrijving: '2 ml per 10 liter bakinhoud, 100 ml volstaat voor 500 liter',
    },
    toepassing: 'Enkel gebruiken na een vastgestelde diagnose. Kom eerst langs of stuur foto\'s door via de hulpknop.',
    bron: 'Catalogus 2025/2026: "Dosage: 2 ml per 10 litres of water, 100 ml is sufficient for 500 litres."',
    opvolging: [{ na: '48 uur', actie: 'Gedrag van de vissen opvolgen en met LUX AQUA overleggen.' }],
    waarschuwingen: [
      'Dit is een behandeling, geen onderhoudsproduct. Stel eerst vast wat uw vissen hebben.',
      'Zet actieve kool en UV-C uit tijdens de kuur.',
    ],
    profielen: ['zoet_gezelschap', 'zoet_planten', 'zoet_malawi'],
  },
  {
    id: 'cerpofor-femsee', naam: 'Cerpofor Femsee', categorie: 'zorg',
    verpakkingen: ['100 ml (500 liter)', '1000 ml (5000 liter)'],
    lost_op: [], richting: 'neutraliseert',
    omschrijving: 'Behandeling tegen witte stip en schimmel.',
    dosering: {
      model: 'vast', hoeveelheid: 2, per: 10, eenheid: 'ml', basis: 'bak',
      label: 'Per behandeling',
      omschrijving: '2 ml per 10 liter bakinhoud, 100 ml volstaat voor 500 liter',
    },
    toepassing: 'Enkel gebruiken na een vastgestelde diagnose. Kom eerst langs of stuur foto\'s door via de hulpknop.',
    bron: 'Catalogus 2025/2026: "Dosage: 2 ml per 10 litres of water, 100 ml is sufficient for 500 litres."',
    opvolging: [{ na: '48 uur', actie: 'Gedrag van de vissen opvolgen en met LUX AQUA overleggen.' }],
    waarschuwingen: [
      'Dit is een behandeling, geen onderhoudsproduct. Stel eerst vast wat uw vissen hebben.',
      'Zet actieve kool en UV-C uit tijdens de kuur.',
    ],
    profielen: ['zoet_gezelschap', 'zoet_planten', 'zoet_malawi'],
  },
  {
    id: 'cerpofor-bactyfec', naam: 'Cerpofor Bactyfec', categorie: 'zorg',
    verpakkingen: ['100 ml (500 liter)', '1000 ml (5000 liter)'],
    lost_op: [], richting: 'neutraliseert',
    omschrijving: 'Behandeling tegen bacteriele aandoeningen, onder meer gatenziekte.',
    dosering: {
      model: 'vast', hoeveelheid: 2, per: 10, eenheid: 'ml', basis: 'bak',
      label: 'Per behandeling',
      omschrijving: '2 ml per 10 liter bakinhoud, 100 ml volstaat voor 500 liter',
    },
    toepassing: 'Enkel gebruiken na een vastgestelde diagnose. Kom eerst langs of stuur foto\'s door via de hulpknop.',
    bron: 'Catalogus 2025/2026: "Dosage: 2 ml per 10 litres of water, 100 ml is sufficient for 500 litres."',
    opvolging: [{ na: '48 uur', actie: 'Gedrag van de vissen opvolgen en met LUX AQUA overleggen.' }],
    waarschuwingen: [
      'Dit is een behandeling, geen onderhoudsproduct. Stel eerst vast wat uw vissen hebben.',
      'Zet actieve kool en UV-C uit tijdens de kuur.',
    ],
    profielen: ['zoet_gezelschap', 'zoet_planten', 'zoet_malawi'],
  },
];

/** Eenheden die niet te halveren zijn: naar boven afronden, nooit met komma tonen. */
const TELBAAR = ['blad', 'bladeren', 'pad', 'pads', 'tablet', 'tabletten', 'capsule', 'capsules'];

/** Meervoud van de telbare eenheden. "2 blad" leest als een fout, "2 bladeren" niet. */
const MEERVOUD = { blad: 'bladeren', pad: 'pads', tablet: 'tabletten', capsule: 'capsules' };
const meervoud = (eenheid, aantal) => (aantal === 1 ? eenheid : (MEERVOUD[eenheid] || eenheid));

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

/** Bodemoppervlak in vierkante centimeter uit de afmetingen van de bak. */
export const bodemOppervlak = (afm) =>
  afm?.lengte && afm?.breedte ? Math.round(Number(afm.lengte) * Number(afm.breedte)) : 0;

/**
 * Berekent de concrete dosis voor een bak.
 * @param {object} product
 * @param {number} liters netto waterinhoud van de bak
 * @param {number} [delta] gewenste verschuiving (enkel bij model 'delta')
 * @param {object} [opties]
 * @param {number} [opties.versLiters] liter vers water, voor doseringen op basis versWater
 * @param {number} [opties.bodemCm2] bodemoppervlak, voor doseringen op basis bodem
 * @param {object} [opties.dosering] een andere dosering van hetzelfde product (uit extraDoseringen)
 * @returns {{hoeveelheid:number, eenheid:string, tekst:string, basis:string, liters:number}|null}
 */
export function berekenDosis(product, liters, delta, opties = {}) {
  const d = opties.dosering || product?.dosering;
  if (!d) return null;

  /* Bodemtabletten en capsules gaan per vierkante centimeter bodem, niet per
     liter water. Zonder de afmetingen van de bak valt er niets te rekenen, en
     dan toont de app enkel de zin van het etiket. */
  if (d.model === 'bodem') {
    const cm2 = opties.bodemCm2;
    if (!cm2) return null;
    const hoeveelheid = Math.max(1, Math.round((d.hoeveelheid * cm2) / d.per));
    return {
      hoeveelheid, eenheid: d.eenheid, basis: 'bodem', liters: cm2,
      tekst: `${hoeveelheid} ${d.eenheid} voor ${cm2} cm² bodemoppervlak`,
    };
  }

  if (!liters) return null;
  const volume = doseerLiters(d, liters, opties.versLiters);
  if (!volume) return null;
  const waarop = d.basis === 'versWater' ? `${volume} liter vers water` : `${volume} liter`;

  /* Filterpads gaan met sprongen: één pad tot 250 liter, twee tot 750. Daar valt
     niets te interpoleren, dus de app leest de tabel van het etiket af. */
  if (d.model === 'trap') {
    const rij = (d.tabel || []).find((t) => volume <= t.tot);
    const hoeveelheid = rij ? rij.hoeveelheid : (d.tabel?.[d.tabel.length - 1]?.hoeveelheid ?? null);
    if (hoeveelheid == null) return null;
    const buitenBereik = !rij;
    return {
      hoeveelheid, eenheid: d.eenheid, basis: d.basis || 'bak', liters: volume, buitenBereik,
      tekst: buitenBereik
        ? `${hoeveelheid} ${meervoud(d.eenheid, hoeveelheid)} of meer voor ${waarop}, vraag het na in de winkel`
        : `${hoeveelheid} ${meervoud(d.eenheid, hoeveelheid)} voor ${waarop}`,
    };
  }

  if (d.model === 'vast') {
    const hoeveelheid = (d.hoeveelheid * volume) / d.per;

    /* Bladeren, pads en tabletten zijn niet te halveren. Naar boven afronden,
       want een half blad is geen dosering. */
    if (TELBAAR.includes(d.eenheid)) {
      const stuks = Math.max(1, Math.ceil(hoeveelheid));
      /* Geeft het etiket een bereik (1 blad per 50 tot 100 liter), toon dat dan
         ook als bereik in plaats van een schijnnauwkeurig getal te verzinnen. */
      if (d.perMax) {
        const ander = Math.max(1, Math.ceil((d.hoeveelheid * volume) / d.perMax));
        const laag = Math.min(stuks, ander);
        const hoog = Math.max(stuks, ander);
        if (laag !== hoog) {
          return {
            hoeveelheid: hoog, minimum: laag, eenheid: d.eenheid, basis: d.basis || 'bak', liters: volume,
            tekst: `${laag} tot ${hoog} ${meervoud(d.eenheid, hoog)} voor ${waarop}`,
          };
        }
      }
      return {
        hoeveelheid: stuks, eenheid: d.eenheid, basis: d.basis || 'bak', liters: volume,
        tekst: `${stuks} ${meervoud(d.eenheid, stuks)} voor ${waarop}`,
      };
    }

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
