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

  /* ============================================================================
   * VIJVER: het Colombo-vijverassortiment
   *
   * Zelfde regels als hierboven: elke dosering is LETTERLIJK overgenomen uit de
   * officiele Colombo-gebruiksaanwijzing (PDF op colombo.nl) of, bij ontbreken
   * daarvan, de Colombo Vijvercatalogus van Aquadistri. Het citaat staat in het
   * veld `bron`. Een aantal producten liet zich niet in het liter-water-model
   * persen (per m² bodem, per plant, per gram visvoer, per losse emmer om een
   * vis in te verdoven): die krijgen `model: 'geen'` en enkel de tekst van het
   * etiket, net als FE Tabs en Nutri Caps hierboven.
   *
   * KH Plus, GH Plus, pH Min en Algisin bestaan ook in de aquariumlijn hierboven
   * met een andere dosering (vijverwater vraagt veel meer product per liter dan
   * aquariumwater). Vandaar de toevoeging "(vijver)" in de naam en een eigen id.
   */

  /* -------------------------------------------------------------- filter, bacterien */
  {
    id: 'bactuur-filterstart', naam: 'Bactuur Filter Start', categorie: 'filter',
    verpakkingen: ['500 ml, voor 2.500 liter vijverwater', '1000 ml, voor 5.000 liter vijverwater', '2500 ml, voor 12.500 liter vijverwater'],
    lost_op: ['nh4', 'no2'], richting: 'omlaag',
    omschrijving: 'Levende nitrificerende bacterien voor het vijverfilter, die ammonium/ammoniak en nitriet afbreken. Voor een nieuw filter, na het schoonmaken van het filter, bij de opstart in het voorjaar en bij verhoogde ammonia- of nitrietwaarden.',
    dosering: {
      model: 'vast', hoeveelheid: 40, per: 1000, eenheid: 'ml', basis: 'bak',
      label: 'Opstarten, 5 dagen na elkaar',
      omschrijving: '40 ml per 1.000 liter vijverwater per dag, 5 dagen na elkaar',
    },
    extraDoseringen: [
      {
        model: 'vast', hoeveelheid: 20, per: 1000, eenheid: 'ml', basis: 'bak',
        label: 'Onderhoud, wekelijks',
        omschrijving: '20 ml per 1.000 liter vijverwater per week',
      },
    ],
    toepassing: 'Opstarten van een nieuw of net gereinigd vijverfilter, heropstart na de winter, en bij verhoogde ammonia- of nitrietwaarden. Onder 10 graden watertemperatuur de dosering verdubbelen.',
    bron: 'Gebruiksaanwijzing Colombo Pond Filter Start: "Voor het opstarten of bij verhoogde ammonia en/of nitrietwaarden: 40 ml per 1.000 liter water per dag gedurende 5 dagen. Bij watertemperaturen onder de 10°C de dosering verdubbelen. Onderhoudsdosering: 20 ml per 1.000 liter water per week."',
    opvolging: [
      { na: '5 dagen', actie: 'Overgaan op de onderhoudsdosering van 20 ml per 1.000 liter per week.' },
      { na: 'elke week', actie: '20 ml per 1.000 liter vijverwater doseren als onderhoud.' },
    ],
    waarschuwingen: [
      'UV-C en ozon uitschakelen tijdens het doseren.',
      'Onder 10 °C watertemperatuur de dosering verdubbelen.',
    ],
    profielen: ['vijver_koi', 'vijver_sier'],
  },
  {
    id: 'bactuur-clean', naam: 'Bactuur Clean', categorie: 'filter',
    verpakkingen: ['500 ml, voor 2.500 liter vijverwater', '1000 ml, voor 5.000 liter vijverwater', '2500 ml, voor 12.500 liter vijverwater'],
    lost_op: [], richting: 'neutraliseert',
    omschrijving: 'Meer dan 100 miljoen levende, slibafbrekende bacterien per ml die het slib op de vijverbodem en in het filter opruimen en daarna nieuwe slibvorming voorkomen. Ook bekend als Bactuur Clean Sludge; Bactuur Residex is de oude naam.',
    dosering: {
      model: 'vast', hoeveelheid: 40, per: 1000, eenheid: 'ml', basis: 'bak',
      label: 'Slib opruimen, 5 dagen na elkaar',
      omschrijving: '40 ml per 1.000 liter vijverwater per dag, 5 dagen na elkaar',
    },
    extraDoseringen: [
      {
        model: 'vast', hoeveelheid: 20, per: 1000, eenheid: 'ml', basis: 'bak',
        label: 'Onderhoud, wekelijks',
        omschrijving: '20 ml per 1.000 liter vijverwater per week',
      },
    ],
    toepassing: 'Slib op de vijverbodem en in het filter afbreken, en het filter en de biofilm onderhouden. Onder 10 graden watertemperatuur de dosering verdubbelen.',
    bron: 'Gebruiksaanwijzing Colombo Pond Clean Sludge: "Voor het opstarten (slib opruimen): 40 ml per 1.000 liter water per dag gedurende 5 dagen. Bij watertemperaturen onder de 10°C de dosering verdubbelen. Onderhoudsdosering (slibvorming voorkomen): 20 ml per 1.000 liter water per week."',
    opvolging: [
      { na: '5 dagen', actie: 'Overgaan op de onderhoudsdosering van 20 ml per 1.000 liter per week.' },
    ],
    waarschuwingen: [
      'UV-C en ozon uitschakelen tijdens het doseren.',
      'Onder 10 °C watertemperatuur de dosering verdubbelen.',
    ],
    profielen: ['vijver_koi', 'vijver_sier'],
  },
  {
    id: 'bactuur-activator', naam: 'Bactuur Activator', categorie: 'filter',
    verpakkingen: ['500 ml, voor 2.500 liter vijverwater', '1000 ml, voor 5.000 liter vijverwater', '2500 ml, voor 12.500 liter vijverwater'],
    lost_op: [], richting: 'neutraliseert',
    omschrijving: 'Plantaardige biokatalysator die de reinigingsbacterien uit Bactuur Filter Start en Bactuur Clean voedt en hun werking versterkt. Altijd samen met een van die twee gebruiken, niet als losse bacteriestarter.',
    dosering: {
      model: 'vast', hoeveelheid: 40, per: 1000, eenheid: 'ml', basis: 'bak',
      label: 'Eerste gebruik, 5 dagen na elkaar',
      omschrijving: '40 ml per 1.000 liter vijverwater per dag, 5 dagen na elkaar',
    },
    extraDoseringen: [
      {
        model: 'vast', hoeveelheid: 20, per: 1000, eenheid: 'ml', basis: 'bak',
        label: 'Onderhoud, wekelijks',
        omschrijving: '20 ml per 1.000 liter vijverwater per week',
      },
    ],
    toepassing: 'Altijd in combinatie met Bactuur Filter Start of Bactuur Clean gebruiken, voor een optimale bacteriewerking.',
    bron: 'Gebruiksaanwijzing Colombo Pond Activator: "Bij eerste gebruik (opstarten): 40 ml per 1.000 liter water per dag gedurende 5 dagen. Bij watertemperaturen onder de 10°C de dosering verdubbelen. Onderhoudsdosering: 20 ml per 1.000 liter water per week."',
    opvolging: [
      { na: '5 dagen', actie: 'Overgaan op de onderhoudsdosering van 20 ml per 1.000 liter per week, samen met Filter Start of Clean.' },
    ],
    waarschuwingen: [
      'UV-C en ozon uitschakelen tijdens het doseren.',
      'Op het icoon van de gebruiksaanwijzing staat abusievelijk "x 7 days"; de geschreven tekst in alle vier de talen zegt 5 dagen. Houd de geschreven tekst aan.',
    ],
    profielen: ['vijver_koi', 'vijver_sier'],
  },
  {
    id: 'bactuur-bio-start', naam: 'Bactuur Bio Start', categorie: 'filter',
    verpakkingen: ['100 ml, voor 5.000 liter vijverwater'],
    lost_op: [], richting: 'neutraliseert',
    omschrijving: 'Gevriesdroogde bacterien, 200 miljard per 100 ml, waaruit binnen 24 uur miljarden nuttige bacterien ontstaan. Voor een nieuwe vijver, in het voorjaar en na een grote schoonmaak. Op sommige webshops nog verkocht als "Bactuur P": zelfde product, zelfde dosering.',
    dosering: {
      model: 'vast', hoeveelheid: 10, per: 1000, eenheid: 'ml', basis: 'bak',
      label: 'Nieuwe vijver',
      omschrijving: '10 ml per 1.000 liter vijverwater, na 14 dagen herhalen',
    },
    extraDoseringen: [
      {
        model: 'vast', hoeveelheid: 10, per: 1000, eenheid: 'ml', basis: 'bak',
        label: 'Bestaande vijver, maandelijks',
        omschrijving: '10 ml per 1.000 liter vijverwater per maand',
      },
    ],
    toepassing: 'Nieuwe vijver, opstart in het voorjaar en na een grote schoonmaak van vijver of filter.',
    bron: 'Gebruiksaanwijzing Colombo Pond Bactuur Bio Start: "Dosering in nieuwe vijvers: 10 ml per 1.000 liter water, na 14 dagen dosering herhalen. Bestaande vijvers: Maandelijks 10 ml per 1.000 liter water toevoegen. Overdoseren is niet mogelijk, een hogere dosering versterkt het effect."',
    opvolging: [
      { na: '14 dagen', actie: 'In een nieuwe vijver de dosering van 10 ml per 1.000 liter nog eens geven.' },
      { na: 'elke maand', actie: 'In een bestaande vijver 10 ml per 1.000 liter toevoegen als onderhoud.' },
    ],
    waarschuwingen: ['Overdoseren is niet mogelijk; een hogere dosering versterkt juist het effect.'],
    profielen: ['vijver_koi', 'vijver_sier'],
  },
  {
    id: 'bacto-balls-vijver', naam: 'Bacto Balls', categorie: 'filter',
    verpakkingen: ['500 ml, voor 5.000 liter vijverwater', '1000 ml, voor 10.000 liter vijverwater', '2500 ml, voor 25.000 liter vijverwater'],
    lost_op: [], richting: 'neutraliseert',
    omschrijving: 'Ballen geimpregneerd met Colombo-bacterien voor schoon, helder water en een gezonde biologie. Breken organisch afval af en beperken zo algengroei.',
    dosering: {
      model: 'vast', hoeveelheid: 100, per: 1000, eenheid: 'stuks', basis: 'bak',
      label: 'In het filter of de vijver',
      omschrijving: '100 ballen per 1.000 liter vijverwater',
    },
    toepassing: 'In het vijverfilter of rechtstreeks in de vijver, eventueel in een mediazak die u ophangt. In tegenstelling tot de vloeibare Bactuur-producten hoeft de UV-apparatuur niet uit.',
    bron: 'Gebruiksaanwijzing Colombo Pond Bacto Balls: "Gebruik: 100 ballen per 1000 liter vijverwater. Maandelijks vervangen. Doseer de Bacto Balls in uw filter of direct in de vijver. [...] Overdosering is niet mogelijk; een hogere dosering zal zelfs de efficiëntie verhogen. UV-apparatuur hoeft niet uitgezet te worden."',
    opvolging: [{ na: '1 maand', actie: 'De ballen vervangen door een nieuwe portie van 100 per 1.000 liter.' }],
    waarschuwingen: ['Kan bijtend zijn voor metalen; gemorste stof opnemen.'],
    profielen: ['vijver_koi', 'vijver_sier'],
  },

  /* ------------------------------------------------------------------ algen, helder water */
  {
    id: 'bactoclear', naam: 'BactoClear', categorie: 'algen',
    verpakkingen: ['1000 ml (6x 20.000 l)', '2500 ml (6x 50.000 l)', '5000 ml (6x 100.000 l)'],
    lost_op: [], richting: 'neutraliseert',
    omschrijving: 'Zwevend filtermateriaal van natuurlijke klei en mineralen dat organische verontreiniging en giftige stoffen opneemt, aangevuld met reinigingsbacterien. Maakt niet meteen helder zoals Algadrex, maar houdt het water gezond en remt zo draadalgroei.',
    dosering: {
      model: 'vast', hoeveelheid: 15, per: 2000, eenheid: 'ml', basis: 'bak',
      label: 'Nieuwe of sterk vervuilde vijver, 5 dagen na elkaar',
      omschrijving: '1 maatschep (15 ml) per 2.000 liter vijverwater per dag, 5 dagen na elkaar',
    },
    extraDoseringen: [
      {
        model: 'vast', hoeveelheid: 15, per: 2000, eenheid: 'ml', basis: 'bak',
        label: 'Onderhoud, wekelijks',
        omschrijving: '1 maatschep (15 ml) per 2.000 liter vijverwater per week',
      },
    ],
    toepassing: 'Alleen gebruiken bij een watertemperatuur boven 10 graden. Nooit rechtstreeks op de planten gieten. BactoClear is geen algenmiddel: voor meteen helder water gebruikt u Algadrex.',
    bron: 'Gebruiksaanwijzing Colombo Pond BactoClear: "Eerste gebruik bij een nieuwe of sterk vervuilde vijvers, 1 maatschep (=15 ml) per 2.000 liter vijverwater gedurende 5 dagen. Daarna als onderhoudsdosering, 1 maatschep per 2.000 liter per week. [...] Gebruik BactoClear als het water warmer is als 10°C."',
    opvolging: [{ na: '5 dagen', actie: 'Overschakelen op de wekelijkse onderhoudsdosering van 15 ml per 2.000 liter.' }],
    waarschuwingen: [
      'Alleen gebruiken boven 10 graden watertemperatuur.',
      'Water kan tijdelijk (24 tot 48 uur) troebel blijven; dat is onschadelijk.',
    ],
    profielen: ['vijver_koi', 'vijver_sier'],
  },
  {
    id: 'bi-clear', naam: 'Bi-Clear', categorie: 'algen',
    verpakkingen: ['1000 ml', '2500 ml', '5000 ml'],
    lost_op: [], richting: 'neutraliseert',
    omschrijving: 'Combineert een zwevend filtermateriaal, dat organische verontreiniging en giftige stoffen rechtstreeks opneemt, met natuurlijke mineralen voor kristalhelder en gezond vijverwater.',
    dosering: {
      model: 'vast', hoeveelheid: 15, per: 1000, eenheid: 'ml', basis: 'bak',
      label: 'Nieuwe of sterk vervuilde vijver, 5 dagen na elkaar',
      omschrijving: '1 maatschep (15 ml) per 1.000 liter vijverwater per dag, 5 dagen na elkaar',
    },
    extraDoseringen: [
      {
        model: 'vast', hoeveelheid: 15, per: 1000, eenheid: 'ml', basis: 'bak',
        label: 'Onderhoud, wekelijks',
        omschrijving: '1 maatschep (15 ml) per 1.000 liter vijverwater per week',
      },
    ],
    toepassing: 'Nooit rechtstreeks op de planten gieten. Test minstens een keer per maand de waterkwaliteit.',
    bron: 'Gebruiksaanwijzing Colombo Pond Bi-Clear: "Dosering: Bij nieuwe of sterk vervuilde vijvers, 1 maatschep (=15 ml) per 1.000 liter vijverwater gedurende 5 dagen. [...] Daarna als onderhoudsdosering, 1 maatschep per 1.000 liter per week."',
    opvolging: [{ na: '5 dagen', actie: 'Overschakelen op de wekelijkse onderhoudsdosering van 15 ml per 1.000 liter.' }],
    waarschuwingen: ['Water kan tijdelijk (24 tot 48 uur) troebel blijven; dat is onschadelijk.'],
    profielen: ['vijver_koi', 'vijver_sier'],
  },
  {
    id: 'biox', naam: 'BiOx', categorie: 'algen',
    verpakkingen: ['1000 ml, voor eenmalig 32.000 liter', '2500 ml, voor eenmalig 80.000 liter', '5000 ml, voor eenmalig 160.000 liter'],
    lost_op: ['o2'], richting: 'omhoog',
    omschrijving: 'Reinigt de vijver met actieve zuurstof: breekt organische verontreiniging en slib af zodra het in het water komt, en de extra zuurstof verbetert tegelijk het biologisch filter. Geen bacterieproduct maar een natuurlijke oxidator.',
    /* De officiele gebruiksaanwijzing toont enkel de BOOST-dosering (2x15 ml per
       500 l). De gewone wekelijkse dosis (1x15 ml per 500 l) staat nergens
       letterlijk voluit, maar volgt rekenkundig uit die boostzin: de bijsluiter
       noemt de boost expliciet "dubbel", en de catalogus zegt "wekelijks
       gebruiken". Vandaar het advies om ook het etiket op de fles na te lezen. */
    dosering: {
      model: 'vast', hoeveelheid: 15, per: 500, eenheid: 'ml', basis: 'bak',
      label: 'Wekelijks',
      omschrijving: '1 maatschep (15 ml) per 500 liter vijverwater per week',
    },
    extraDoseringen: [
      {
        model: 'vast', hoeveelheid: 30, per: 500, eenheid: 'ml', basis: 'bak',
        label: 'Boost of grote schoonmaak, max. 1x per 2 maanden',
        omschrijving: '2x 15 ml (dubbele dosis) per 500 liter vijverwater',
      },
    ],
    toepassing: 'Slib en organische vervuiling op de bodem afbreken en de vijver schoon en helder houden. Twee keer per jaar een grote schoonmaak met de dubbele dosering geven.',
    bron: 'Gebruiksaanwijzing Colombo Pond BiOx: "BiOx boost dosering. Voor de grote schoonmaak van uw vijver, kunt u een dubbele dosering gebruiken! Dosering: 1L & 2,5L BOOST 2 x 15 ML 500 L - 5L BOOST 2 x 150 ML 5000 L. Dit mag maximaal 1 keer per 2 maanden gedaan worden." De gewone wekelijkse dosis (de helft) staat niet letterlijk in deze bijsluiter maar volgt uit deze boostzin en uit de catalogus ("gebruik BiOx wekelijks"); lees ook het etiket op de fles na.',
    opvolging: [
      { na: 'elke week', actie: 'De gewone dosering herhalen om de vijver schoon te houden.' },
      { na: 'maximaal 1x per 2 maanden', actie: 'Een boost met dubbele dosering geven, niet vaker.' },
    ],
    waarschuwingen: [
      'De officiele gebruiksaanwijzing bevat enkel de boost-dosering, niet de gewone wekelijkse dosis in ml; controleer het etiket op de fles.',
      'De boost-dosering mag maximaal 1x per 2 maanden.',
    ],
    profielen: ['vijver_koi', 'vijver_sier'],
  },
  {
    id: 'algisin-vijver', naam: 'Algisin (vijver)', categorie: 'algen',
    verpakkingen: ['1000 ml, voor 10.000 l', '2500 ml, voor 25.000 l', '5000 ml, voor 50.000 l'],
    lost_op: [], richting: 'neutraliseert',
    omschrijving: 'Bestrijdt draadalgen (en baardalgen) op enzymatische wijze; de algen verdwijnen binnen enkele dagen tot twee weken. Bevat een Quicktest om eerst de waterkwaliteit te controleren, want algenproblemen komen vaak door slechte waterwaarden.',
    dosering: {
      model: 'vast', hoeveelheid: 15, per: 300, eenheid: 'ml', basis: 'bak',
      label: 'Kuur van twee behandelingen',
      omschrijving: '1 maatschep (15 ml) per 300 liter vijverwater, twee behandelingen met 14 dagen ertussen',
    },
    toepassing: 'Werkt het beste boven 10 graden watertemperatuur. Niet over kool of zeoliet filteren; ozon uit tijdens de behandeling, UV-C mag aan blijven. Niet gebruiken in zwemvijvers.',
    bron: 'Gebruiksaanwijzing Colombo Pond Algisin: "Dosering: bij 1.000 en 2.500 ml verpakkingen: 1 maatschep (15 ml) per 300 liter vijverwater; bij 5.000 ml verpakking: 1 volle maatbeker (150 ml) per 3.000 liter. Twee behandelingen zijn noodzakelijk voor het verkrijgen van het gewenste resultaat, na 14 dagen behandeling herhalen."',
    opvolging: [
      { na: '14 dagen', actie: 'De behandeling herhalen: twee behandelingen zijn nodig voor het resultaat.' },
      { na: 'na de kuur', actie: 'Afgestorven draadalg met een schepnet verwijderen; wekelijks BiOx toevoegen om terugkeer te voorkomen.' },
    ],
    waarschuwingen: [
      'Afgestorven draadalg moet verwijderd worden, anders kan het zuurstofgehalte te laag worden door rottende resten.',
      'Mag niet gebruikt worden in zwemvijvers waarin mensen zwemmen.',
      'Vermijd contact met huid en ogen; niet inademen.',
      'Sommige vijverplanten (waterpest, fonteinkruid, waterlelie, gele plomp) kunnen tijdelijk lijden onder het middel, maar herstellen zich.',
    ],
    profielen: ['vijver_koi', 'vijver_sier'],
  },
  {
    id: 'algadrex', naam: 'Algadrex', categorie: 'algen',
    verpakkingen: ['500 ml, voor 5.000 l', '1000 ml, voor 10.000 l', '2500 ml, voor 25.000 l'],
    lost_op: [], richting: 'neutraliseert',
    omschrijving: 'Maakt troebel of groen vijverwater (zweefalgen) snel weer helder: werkt als vlokmiddel, de vervuiling klontert samen en is dan met een schepnet te verwijderen. Werkt binnen ongeveer een uur. Behandelt geen draadalgen, daarvoor is Algisin er.',
    dosering: {
      model: 'vast', hoeveelheid: 100, per: 1000, eenheid: 'ml', basis: 'bak',
      label: 'Eenmalig',
      omschrijving: '100 ml per 1.000 liter vijverwater',
    },
    toepassing: 'Voorgemengd in een gieter of emmer gelijkmatig over de vijver verdelen. Na ongeveer een uur de samengeklonterde deeltjes met een schepnet verwijderen.',
    bron: 'Gebruiksaanwijzing Colombo Algadrex: "Dosering: 100 ml per 1.000 liter vijverwater. De benodigde hoeveelheid in een gieter of een emmer met water voormengen. Dan gelijkmatig over de vijver verdelen. De zwevende delen die zijn samengeklonterd moeten verwijderd worden met een schepnet."',
    opvolging: [{ na: 'circa 1 uur', actie: 'Samengeklonterde deeltjes met een fijnmazig schepnet verwijderen.' }],
    waarschuwingen: [
      'Bij een KH onder 6 °DH kan dit een pH-schok geven; herstel de KH eerst met KH Plus.',
      'Behandelt geen draadalgen: daarvoor is Algisin bedoeld.',
      'Veroorzaakt ernstige oogirritatie.',
    ],
    profielen: ['vijver_koi', 'vijver_sier'],
  },
  {
    id: 'phosphate-x', naam: 'Phosphate X', categorie: 'algen',
    verpakkingen: ['1000 ml, voor 10.000 l'],
    lost_op: ['po4'], richting: 'omlaag',
    omschrijving: 'Bindt fosfaat (PO4) in het vijverwater rechtstreeks af. Fosfaat is, samen met nitraat, de belangrijkste voedingsbron voor algen.',
    dosering: {
      model: 'delta', param: 'po4', hoeveelheid: 100, per: 1000, eenheid: 'ml', effect: 1, basis: 'bak',
      label: 'Per verschuiving van het fosfaat, max. 1x per dag',
      omschrijving: '100 ml per 1.000 liter vijverwater verlaagt het fosfaat met 1 mg per liter',
    },
    toepassing: 'Maximaal een keer per dag doseren, herhalen tot het fosfaat onder 1 mg per liter ligt. Alleen gebruiken bij een KH van minstens 6 °DH.',
    bron: 'Gebruiksaanwijzing Colombo Pond Phosphate X: "Gebruik: Doseer 100 ml per 1.000 liter water voor een verlaging van het fosfaatgehalte met 1 mg/l. Doseer maximaal 1x per dag en herhaal de behandeling totdat het gehalte onder 1 mg/l ligt. Colombo Phosphate X kan leiden tot een sterke pH-daling; voeg Phosphate X alleen toe bij een KH van minimaal 6°DH."',
    opvolging: [{ na: 'elke dag (max. 1x)', actie: 'Fosfaat opnieuw meten en zo nodig herhalen tot onder 1 mg per liter.' }],
    waarschuwingen: [
      'Kan een sterke pH-daling geven; alleen gebruiken bij een KH van minstens 6 °DH.',
      'Veroorzaakt ernstige oogirritatie.',
      'Maximaal een dosis per dag.',
    ],
    profielen: ['vijver_koi', 'vijver_sier'],
  },

  /* -------------------------------------------------------------------- bodem, vijver */
  {
    id: 'natura-clean', naam: 'Natura Clean', categorie: 'filter',
    verpakkingen: ['1000 ml, voor 15.000 liter vijverwater', '2500 ml, voor 37.500 liter vijverwater'],
    lost_op: [], richting: 'neutraliseert',
    omschrijving: 'Reinigt de vijverbodem op natuurlijke wijze: mineralen neutraliseren de verzuring van de sliblaag en miljarden bacterien ruimen het vuil van visuitwerpselen, plantenresten en ingewaaide bladeren op. Werkt het best op een bodem van Natura Substraat.',
    /* Het etiket geeft voor de voorjaarsdosis een marge: 2 tot 3 scheppen van
       15 ml, dus 30 tot 45 ml per 1.000 liter. De app rekent met de onderkant
       (30 ml) en zegt er in de toepassing bij dat 45 ml ook mag. */
    dosering: {
      model: 'vast', hoeveelheid: 30, per: 1000, eenheid: 'ml', basis: 'bak',
      label: 'Voorjaar (maart/april)',
      omschrijving: '2 tot 3 maatscheppen (30 tot 45 ml) per 1.000 liter, de app rekent met 30 ml als ondergrens',
    },
    extraDoseringen: [
      {
        model: 'vast', hoeveelheid: 15, per: 1000, eenheid: 'ml', basis: 'bak',
        label: 'Na 3 en na 6 maanden',
        omschrijving: '1 maatschep (15 ml) per 1.000 liter, telkens na 3 maanden (juni/juli) en na 6 maanden (sept./okt.)',
      },
    ],
    toepassing: 'Gelijkmatig over de bodem verdelen. De voorjaarsdosis mag tussen 30 en 45 ml per 1.000 liter liggen; 30 ml is de ondergrens die de app voorrekent.',
    bron: 'Gebruiksaanwijzing Colombo Natura Clean: "Doseer in het voorjaar (maart/april) 2-3 schepjes van 15 ml Colombo Natura Clean per 1.000 liter vijverwater gelijkmatig over de bodem. Doseer 1 schep per 1.000 liter vijverwater na 3 (juni/juli) en na 6 maanden (sept./okt.)"',
    opvolging: [
      { na: '3 maanden (juni/juli)', actie: '1 maatschep (15 ml) per 1.000 liter doseren.' },
      { na: '6 maanden (sept./okt.)', actie: 'Opnieuw 1 maatschep (15 ml) per 1.000 liter doseren.' },
    ],
    waarschuwingen: [],
    profielen: ['vijver_sier'],
  },
  {
    id: 'natura-maerl', naam: 'Natura Maerl', categorie: 'buffer',
    verpakkingen: ['1000 ml', '2500 ml', '5000 ml'],
    lost_op: [], richting: 'omhoog',
    omschrijving: 'Natuurlijke zeewierkalk-korrels die de KH en daarmee de pH van vijverwater stabiliseren en mineralen en sporenelementen toevoegen; bindt bovendien fosfaat, wat algengroei remt.',
    dosering: {
      model: 'vast', hoeveelheid: 45, per: 1000, eenheid: 'ml', basis: 'bak',
      label: 'Voorjaar (maart/april), na 2 weken herhalen',
      omschrijving: '3 maatscheppen (45 ml) per 1.000 liter water',
    },
    extraDoseringen: [
      {
        model: 'vast', hoeveelheid: 30, per: 1000, eenheid: 'ml', basis: 'bak',
        label: 'Maandelijks t/m oktober',
        omschrijving: '2 maatscheppen (30 ml) per 1.000 liter water',
      },
    ],
    toepassing: 'Water kan tijdelijk troebel worden na dosering; dat verdwijnt na een paar dagen vanzelf.',
    bron: 'Gebruiksaanwijzing Colombo Natura Maerl: "Doseer in het voorjaar (maart/april) 3 maatscheppen van 15 ml per 1.000 liter water. Herhaal dit na 2 weken. Doseer hierna maandelijks 2 maatscheppen per 1.000 ltr t/m oktober."',
    opvolging: [{ na: '2 weken', actie: 'De voorjaarsdosis nog eens geven.' }],
    waarschuwingen: ['Water kan na dosering tijdelijk troebel worden; dat verdwijnt vanzelf.'],
    profielen: ['vijver_koi', 'vijver_sier'],
  },
  {
    id: 'natura-straw', naam: 'Natura Straw', categorie: 'filter',
    verpakkingen: ['2500 ml, voor een vijver van 5.000 liter'],
    lost_op: [], richting: 'neutraliseert',
    omschrijving: 'Geperste pellets van 100 procent gerstestro die het vijverwater op natuurlijke wijze helder en algenvrij houden.',
    dosering: {
      model: 'vast', hoeveelheid: 2500, per: 5000, eenheid: 'ml', basis: 'bak',
      label: 'In een filternet',
      omschrijving: 'Een verpakking van 2.500 ml volstaat voor 5.000 liter vijverwater',
    },
    toepassing: 'De straw in een fijn filternet doen, uitspoelen en het net in de vijver of het filter hangen, eventueel verzwaard met een steen.',
    bron: 'Gebruiksaanwijzing Colombo Natura Straw: "Doe de straw in een fijne filternet, sluit het net en spoel de stro uit. De verpakking van 2500 ml is voldoende voor een vijver van 5.000 liter. Hang het filternet in de vijver of filter."',
    opvolging: [{ na: '2 tot 3 maanden', actie: 'De straw vervangen: die is dan opgelost of uitgeput.' }],
    waarschuwingen: [],
    profielen: ['vijver_koi', 'vijver_sier'],
  },
  {
    id: 'natura-substrate', naam: 'Natura Substraat', categorie: 'filter',
    verpakkingen: ['10 liter', '25 liter'],
    lost_op: [], richting: 'neutraliseert',
    omschrijving: 'Poreus, natuurlijk bodemsubstraat dat als een groot biologisch filter werkt: het open oppervlak laat miljarden bacterien groeien die het vijverwater zuiveren.',
    /* Dosering per m² bodemoppervlak, niet per liter water: past niet in het
       liter-watermodel van de app. Zie ook de opmerking bij FE Tabs. */
    dosering: {
      model: 'geen', eenheid: 'liter substraat', basis: 'bak',
      label: 'Bij het inrichten',
      omschrijving: 'Een zak van 10 liter bedekt circa 2 m² vijverbodem',
    },
    toepassing: 'De bodem gelijkmatig bedekken met een laag substraat. Voeg Bactuur Bio Start toe voor een snelle opstart van de bacterien.',
    bron: 'Gebruiksaanwijzing Colombo Natura Substrate: "Bedek de bodem gelijkmatig met een laag substraat. U kunt 2 m2 bodem bedekken met één zak Colombo Natura Substrate 10 liter."',
    opvolging: [{ na: 'na het aanbrengen', actie: 'Bactuur Bio Start toevoegen voor een snelle bacteriestart.' }],
    waarschuwingen: ['Door de poreuze structuur kunnen delen tijdelijk blijven drijven; dat is normaal.'],
    profielen: ['vijver_sier'],
  },
  {
    id: 'natura-gravel', naam: 'Natura Grind', categorie: 'vijver',
    verpakkingen: ['10 liter/15 kg, 4-6 mm', '10 liter/15 kg, 8-12 mm'],
    lost_op: [], richting: 'neutraliseert',
    omschrijving: 'Gewassen, schoon vijvergrind om de bodem, plantmanden of de vijverrand mee af te dekken. Voorkomt dat vissen in de bodem wroeten. Geen chemische werking.',
    dosering: { model: 'geen', eenheid: 'liter grind', basis: 'bak', label: 'Naar smaak', omschrijving: 'Geen dosering van toepassing, decoratief/functioneel bodemgrind' },
    toepassing: 'Verkrijgbaar in korrelgrootte 4-6 mm en 8-12 mm.',
    bron: 'Gebruiksaanwijzing Colombo Natura Gravel: "Colombo Natura Grind is speciaal voor de vijver geselecteerd grind wat gewassen is en vrij van vervuiling. Het kan gebruikt worden voor het afdekken van vijveraarde zodat vissen niet in de aarde kunnen wroeten."',
    opvolging: [],
    waarschuwingen: [],
    profielen: ['vijver_koi', 'vijver_sier'],
  },

  /* --------------------------------------------------------------- plantenvoeding, vijver */
  {
    id: 'natura-plant-soil', naam: 'Natura Plantaarde', categorie: 'voeding',
    verpakkingen: ['10 liter', '20 liter'],
    lost_op: [], richting: 'omhoog',
    omschrijving: 'Natuurlijke vijveraarde van klei en veen met alle voedingsstoffen die vijverplanten nodig hebben om te wortelen, groeien en bloeien.',
    dosering: {
      model: 'geen', eenheid: 'liter aarde', basis: 'bak',
      label: 'Per plantmand',
      omschrijving: 'Een zak van 20 liter bedekt circa 3 m² bodem',
    },
    toepassing: 'Een plantmand vullen tot 5 cm onder de rand, de plant erin zetten en nat maken zodat alle lucht eruit gaat, en afdekken met 2 tot 3 cm Natura Grind of Substraat zodat de aarde niet wegspoelt.',
    bron: 'Gebruiksaanwijzing Colombo Natura Plant Soil: "Vul een vijvermand met Colombo Natura Plant Soil tot circa 5 cm onder de rand en druk de aarde goed aan. [...] U kunt circa 3 m2 bodem bedekken met één 20 L zak."',
    opvolging: [],
    waarschuwingen: [],
    profielen: ['vijver_sier'],
  },
  {
    id: 'natura-lily-soil', naam: 'Natura Waterlelie-aarde', categorie: 'voeding',
    verpakkingen: ['10 liter', '20 liter'],
    lost_op: [], richting: 'omhoog',
    omschrijving: 'Speciale waterlelie-aarde met extra klei, voor een goede beworteling en rijke bloei.',
    /* De juiste zakmaat (10 of 20 liter) per plantmand staat niet met een
       getal op het etiket, enkel "vullen tot 5 cm onder de rand": geen cijfer
       om voor te rekenen, dus model 'geen'. */
    dosering: {
      model: 'geen', eenheid: 'zak', basis: 'bak',
      label: 'Per plantmand',
      omschrijving: 'Een ruime plantmand (groter dan 20 cm) vullen tot circa 5 cm onder de rand',
    },
    toepassing: 'De lelie planten en afdekken met 2 tot 3 cm Natura Grind of Substraat. Plaatsen op 40 tot 80 cm diepte, afhankelijk van de soort en de grootte.',
    bron: 'Gebruiksaanwijzing Colombo Natura Lily Soil: "Vul een ruime vijvermand (>20 cm) met Colombo Natura Waterlelie Aarde tot circa 5 cm onder de rand en druk de aarde goed aan. [...] Plaats de lelie op een zonnige plaats in de vijver op een diepte tussen de 40 en 80 cm."',
    opvolging: [{ na: '2 tot 3 jaar', actie: 'Jaarlijks 3 tot 4 Natura Plant Tabs toevoegen: de voedingsstoffen in de bodem nemen dan af.' }],
    waarschuwingen: [],
    profielen: ['vijver_sier'],
  },
  {
    id: 'natura-plant-tabs', naam: 'Natura Plant Tabs', categorie: 'voeding',
    verpakkingen: ['10 stuks'],
    lost_op: [], richting: 'omhoog',
    omschrijving: 'Meststoftabletten met gereguleerde afgifte die vijverplanten het hele seizoen voeden, zonder voedingsstoffen naar het water te lekken (wat algengroei zou voeden).',
    /* Dosering per plant, niet per liter water. */
    dosering: {
      model: 'geen', eenheid: 'tablet', basis: 'bak',
      label: 'Voorjaar',
      omschrijving: '1 a 2 tabletten per plant, afhankelijk van de plantgrootte',
    },
    toepassing: 'De tabletten in de vijveraarde of het substraat drukken, binnen bereik van de wortels.',
    bron: 'Gebruiksaanwijzing Colombo Plant Tabs: "Druk 1 à 2 tabletten per plant (afhankelijk van de plantgrootte) in de vijveraarde of het substraat, zorg dat de tabletten binnen het bereik van de wortels liggen."',
    opvolging: [],
    waarschuwingen: [],
    profielen: ['vijver_sier'],
  },

  /* ------------------------------------------------------------------- vijver, waterbereiding */
  {
    id: 'kh-plus-vijver', naam: 'KH Plus (vijver)', categorie: 'buffer',
    verpakkingen: ['1000 ml (7.000 liter, +4 °DH)', '2500 ml (17.500 liter, +4 °DH)', '5000 ml (35.000 liter, +4 °DH)', '15000 ml (105.000 liter, +4 °DH)'],
    lost_op: ['kh', 'ph'], richting: 'omhoog',
    omschrijving: 'Verhoogt de carbonaathardheid van vijverwater. Een KH tussen 6 en 10 °DH houdt de pH stabiel, zodat schommelingen die schadelijk zijn voor uw vissen uitblijven.',
    dosering: {
      model: 'delta', param: 'kh', hoeveelheid: 15, per: 200, eenheid: 'ml', effect: 2, basis: 'bak',
      label: 'Per verschuiving van de KH',
      omschrijving: '1 maatschep (15 ml) per 200 liter vijverwater verhoogt de KH met 2 °DH',
    },
    toepassing: 'Eerst verdunnen in een emmer of gieter met lauwwarm water, dan gelijkmatig over de vijver verdelen. Nooit rechtstreeks op de planten gieten. Streefwaarde: 6 tot 10 °DH.',
    bron: 'Gebruiksaanwijzing Colombo Pond KH Plus: "Dosering: 1 maatschep (=15 ml) per 200 liter vijverwater verhoogt de KH met 2°DH. De benodigde hoeveelheid eerst verdunnen in een emmer of gieter met lauwwarm water. Nooit rechtstreeks op de planten gieten. Test minimaal 1x per maand de waterkwaliteit en corrigeer waar nodig."',
    opvolging: [{ na: '1 maand', actie: 'KH opnieuw testen en zo nodig bijdoseren.' }],
    waarschuwingen: ['Eerst verdunnen in lauwwarm water, nooit onverdund in de vijver of op de planten.'],
    profielen: ['vijver_koi', 'vijver_sier'],
  },
  {
    id: 'gh-plus-vijver', naam: 'GH Plus (vijver)', categorie: 'buffer',
    verpakkingen: ['1000 ml (7.000 liter, +4 °DH)', '2500 ml (17.500 liter, +4 °DH)', '5000 ml (35.000 liter, +4 °DH)', '15000 ml (105.000 liter, +4 °DH)'],
    lost_op: ['gh'], richting: 'omhoog',
    omschrijving: 'Verhoogt de totale hardheid van vijverwater met opgeloste mineralen, hoofdzakelijk calcium. Uw planten en vissen hebben die mineralen nodig om te groeien en gezond te blijven.',
    dosering: {
      model: 'delta', param: 'gh', hoeveelheid: 15, per: 200, eenheid: 'ml', effect: 2, basis: 'bak',
      label: 'Per verschuiving van de GH',
      omschrijving: '1 maatschep (15 ml) per 200 liter vijverwater verhoogt de GH met 2 °DH',
    },
    toepassing: 'Eerst verdunnen in een emmer of gieter met lauwwarm water, dan gelijkmatig over de vijver verdelen. Nooit rechtstreeks op de planten gieten. Streefwaarde: 10 tot 15 °DH.',
    bron: 'Gebruiksaanwijzing Colombo Pond GH Plus: "Dosering: 1 maatschep (=15 ml) per 200 liter vijverwater verhoogt de GH met 2°DH. De benodigde hoeveelheid eerst verdunnen in een emmer of gieter met lauwwarm water. Nooit rechtstreeks op de planten gieten. Test 1x per maand de waterkwaliteit en corrigeer waar nodig."',
    opvolging: [{ na: '1 maand', actie: 'GH opnieuw testen en zo nodig bijdoseren.' }],
    waarschuwingen: ['Eerst verdunnen in lauwwarm water, nooit onverdund in de vijver of op de planten.'],
    profielen: ['vijver_koi', 'vijver_sier'],
  },
  {
    id: 'ph-min-vijver', naam: 'pH Min (vijver)', categorie: 'buffer',
    verpakkingen: ['1000 ml (verlaagt de pH met circa 2 eenheden in 5.000 liter)', '2500 ml (verlaagt de pH met circa 2 eenheden in 12.500 liter)'],
    lost_op: ['ph'], richting: 'omlaag',
    omschrijving: 'Verlaagt een te hoge pH in vijverwater zonder schadelijke reststoffen achter te laten. De ideale pH voor een vijver ligt tussen 7 en 8.',
    dosering: {
      model: 'delta', param: 'ph', hoeveelheid: 1000, per: 5000, eenheid: 'ml', effect: 2, basis: 'bak',
      label: 'Per verschuiving van de pH, max. 1 eenheid per dag',
      omschrijving: '1 liter per 5.000 liter vijverwater verlaagt de pH met ongeveer 2 eenheden',
    },
    toepassing: 'Meet eerst de KH: die mag niet lager zijn dan 6 °DH. Verdeel de dosering gelijkmatig over het wateroppervlak, of meng ze eerst met vijverwater in een emmer. Verlaag de pH met hoogstens 1 eenheid per dag.',
    bron: 'Colombo Vijvercatalogus: "Inhoud 1 liter, verlaagt de pH met circa 2 eenheden in 5.000 liter vijverwater. [...] Verlaag de pH geleidelijk, met maximaal 1 eenheid per dag. Voor een veilig gebruik mag de KH niet lager zijn dan 6°DH."',
    opvolging: [{ na: '1 dag', actie: 'pH en KH opnieuw meten voor u een volgende dosis geeft.' }],
    waarschuwingen: [
      'Verlaag de pH met hoogstens 1 eenheid per dag: grote schommelingen zijn schadelijk voor vissen.',
      'De KH mag niet lager zijn dan 6 °DH: meet die eerst.',
    ],
    profielen: ['vijver_koi', 'vijver_sier'],
  },
  {
    id: 'fish-protect-vijver', naam: 'Fish Protect (vijver)', categorie: 'waterbereiding',
    verpakkingen: ['1000 ml, voor 20.000 liter vijverwater', '2500 ml, voor 50.000 liter vijverwater'],
    lost_op: [], richting: 'neutraliseert',
    omschrijving: 'Beschermt en stimuleert de slijmhuid van de vis, en bindt medicijnresten en schadelijke stoffen in het water. Vooral van belang bij een nieuwe vijver, een grote waterverversing, nieuwe vis, en na een medicijnkuur.',
    dosering: {
      model: 'vast', hoeveelheid: 50, per: 1000, eenheid: 'ml', basis: 'bak',
      label: 'Normale dosering',
      omschrijving: '50 ml per 1.000 liter vijverwater',
    },
    extraDoseringen: [
      {
        model: 'vast', hoeveelheid: 100, per: 1000, eenheid: 'ml', basis: 'bak',
        label: 'Bij zwaardere belasting',
        omschrijving: '100 ml per 1.000 liter vijverwater (dubbele dosis)',
      },
    ],
    toepassing: 'In een nieuwe vijver voor u vissen plaatst, na een grote waterverversing, bij nieuwe vis, en 48 uur na de laatste toediening van Lernex Pro of FMC-50, of 1 week na Cytofex (dan eerst het filter reinigen). Zorg voor voldoende beluchting of circulatie tijdens de behandeling.',
    bron: 'Gebruiksaanwijzing Colombo Pond Fish Protect: "Gebruik: 50 ml per 1.000 liter water. Indien nodig dosering verdubbelen. Zorg voldoende beluchting of circulatie tijdens de behandeling."',
    opvolging: [],
    waarschuwingen: ['Zorg voor voldoende beluchting of circulatie tijdens de behandeling.'],
    profielen: ['vijver_koi', 'vijver_sier'],
  },

  /* ---------------------------------------------------------------------- zorg (Morenicol) */
  {
    id: 'morenicol-vita-spray', naam: 'Vita-Spray (vijver)', categorie: 'zorg',
    verpakkingen: [],
    lost_op: [], richting: 'neutraliseert',
    omschrijving: 'Vitaminecomplex met sporenelementen dat u over het visvoer sprayt, om vissen te laten aansterken na ziekte, een medicijnkuur of de winter.',
    /* Dosering op gewicht visvoer, niet op literwater: past niet in het
       liter-watermodel. */
    dosering: {
      model: 'geen', eenheid: 'ml', basis: 'bak',
      label: 'Bij het voeren',
      omschrijving: '7x spuiten (7 ml) per 100 gram visvoer',
    },
    toepassing: 'De dagelijkse voerhoeveelheid afwegen, uitspreiden, besproeien, enkele uren laten indrogen en dezelfde dag voeren. Ook aan te raden na een behandeling met Lernex Pro of FMC-50, om het herstel te ondersteunen.',
    bron: 'Gebruiksaanwijzing Colombo Pond Vita-Spray: "Dosering: 7x spuiten (7 ml) per 100 gram visvoer."',
    opvolging: [],
    waarschuwingen: ['Gekoeld bewaren bevordert de houdbaarheid.'],
    profielen: ['vijver_koi', 'vijver_sier'],
  },
  {
    id: 'morenicol-medic-box', naam: 'Morenicol Medic Box', categorie: 'zorg',
    verpakkingen: [],
    lost_op: [], richting: 'neutraliseert',
    omschrijving: 'Complete wondbehandelset voor uitwendige verwondingen en zweren bij vijvervis: Morenicol Sedation om te verdoven, Morenicol Wound Clean om te reinigen en Morenicol Propolis om af te dekken, in drie stappen.',
    dosering: { model: 'geen', eenheid: '', basis: 'bak', label: 'Drie stappen', omschrijving: 'Zie de aparte producten Sedation, Wound Clean en Propolis voor de dosering per stap' },
    toepassing: 'Stap 1: verdoven met Sedation. Stap 2: wond reinigen met Wound Clean. Stap 3: wond afdekken met Propolis. Geef nadien voer met Vita-Spray om het herstel te ondersteunen.',
    bron: 'Gebruiksaanwijzing Colombo Pond Morenicol Wound Treatment: "Een succesvolle behandeling van wonden bij vissen bestaat uit 3 stappen [...]: stap 1 is verdoving met Morenicol Sedation, stap 2 is het schoonmaken van de wond met Morenicol Wound Clean en stap 3 is het afdekken van de wond met Morenicol Propolis."',
    opvolging: [{ na: 'wondbehandeling', actie: 'Voer met Vita-Spray geven om het herstel te ondersteunen.' }],
    waarschuwingen: [
      'Dit is een behandeling die een diagnose vraagt: bij twijfel of als de vis ondanks de behandeling achteruitgaat, eerst advies vragen.',
      'Juiste waterwaarden tijdens de genezing: pH 7-8,5, GH 10-15 °DH, KH 6-10 °DH, ammoniak en nitriet 0 mg/l, nitraat onder 50 mg/l, fosfaat onder 1 mg/l.',
    ],
    profielen: ['vijver_koi', 'vijver_sier'],
  },
  {
    id: 'morenicol-sedation', naam: 'Morenicol Sedation', categorie: 'zorg',
    verpakkingen: [],
    lost_op: [], richting: 'neutraliseert',
    omschrijving: 'Verdovingsvloeistof op basis van 100 procent natuurlijke kruidnagelolie, om de vis rustig te maken voor een wondbehandeling (stap 1 van de Medic Box).',
    /* Dosering geldt voor een APARTE emmer met water waarin de vis tijdelijk
       gaat, niet voor de vijver of vers water bij een verversing: het gewone
       bak/versWater-model van de app is hier niet van toepassing. */
    dosering: {
      model: 'geen', eenheid: 'druppel per liter', basis: 'bak',
      label: 'In een aparte emmer',
      omschrijving: '2 druppels per liter water in een schone emmer, niet in de vijver',
    },
    toepassing: 'Een schone bak of emmer vullen met vijverwater en 2 druppels per liter toevoegen. De vis er tijdelijk in plaatsen tot die voldoende verdoofd is. Bij plotselinge ademstilstand meteen terug in de vijver zetten.',
    bron: 'Gebruiksaanwijzing Colombo Pond Morenicol Wound Treatment: "Voeg 2 druppels per liter verdovingsvloeistof toe."',
    opvolging: [],
    waarschuwingen: [
      'Dit is een behandeling die een diagnose vraagt: bij twijfel eerst advies vragen.',
      'Nooit in de volledige vijver doseren: dit is een aparte emmer met een door uzelf gemeten hoeveelheid water.',
      'Laat de vis niet te lang in de verdovingsvloeistof liggen.',
      'Water met verdovingsvloeistof na gebruik afvoeren volgens de lokale regels.',
    ],
    profielen: ['vijver_koi', 'vijver_sier'],
  },
  {
    id: 'morenicol-wound-clean', naam: 'Morenicol Wound Clean', categorie: 'zorg',
    verpakkingen: [],
    lost_op: [], richting: 'neutraliseert',
    omschrijving: 'Wondreiniger op basis van een verdunde waterstofperoxide-oplossing, om een verwonding grondig schoon te maken voor die wordt afgedekt met Propolis (stap 2 van de Medic Box).',
    dosering: { model: 'geen', eenheid: '', basis: 'bak', label: 'Uitwendig', omschrijving: 'Met een wattenstaafje op de wond aanbrengen tot die grondig gereinigd is' },
    toepassing: 'Met een wattenstaafje gedrenkt in Wound Clean de wond aanstippen en herhalen tot de hele wond gereinigd is. Bij een vervolgbehandeling van dezelfde wond niet opnieuw gebruiken: dat vertraagt de genezing.',
    bron: 'Gebruiksaanwijzing Colombo Pond Morenicol Wound Treatment: "Reinig de wond grondig door met een wattenstaafje gedrenkt in wondreiniger de wond aan te stippen; herhaal dit totdat de gehele wond op deze manier grondig is gereinigd."',
    opvolging: [],
    waarschuwingen: [
      'Dit is een behandeling die een diagnose vraagt: bij twijfel eerst advies vragen.',
      'Bij een tweede behandeling van dezelfde wond niet opnieuw reinigen met Wound Clean.',
    ],
    profielen: ['vijver_koi', 'vijver_sier'],
  },
  {
    id: 'morenicol-propolis', naam: 'Morenicol Propolis', categorie: 'zorg',
    verpakkingen: [],
    lost_op: [], richting: 'neutraliseert',
    omschrijving: 'Kleverige wondspray op basis van 100 procent natuurlijke bijenpropolis; sluit een gereinigde wond af en houdt die schoon (stap 3 van de Medic Box).',
    dosering: { model: 'geen', eenheid: '', basis: 'bak', label: 'Uitwendig', omschrijving: 'Aanbrengen op de gereinigde wond, om de dag herhalen' },
    toepassing: 'Aanbrengen op de gereinigde wond. Om de dag opnieuw aanbrengen; reinig de wond dan niet opnieuw met Wound Clean, dat vertraagt de genezing.',
    bron: 'Gebruiksaanwijzing Colombo Pond Morenicol Wound Treatment: "U kunt om de dag opnieuw wondspray aanbrengen, in dit geval dient u de wond niet opnieuw met wondreiniger te behandelen. Daarmee vernietigt u de door het genezingsproces aangemaakte nieuwe cellen."',
    opvolging: [],
    waarschuwingen: ['Dit is een behandeling die een diagnose vraagt: bij twijfel eerst advies vragen.'],
    profielen: ['vijver_koi', 'vijver_sier'],
  },
  {
    id: 'morenicol-lernex', naam: 'Morenicol Lernex', categorie: 'zorg',
    verpakkingen: ['250 ml, voor 5.000 l', '500 ml, voor 10.000 l', '1000 ml, voor 20.000 l', '2500 ml, voor 50.000 l'],
    lost_op: [], richting: 'neutraliseert',
    omschrijving: 'Bestrijdt huidwormen, kieuwwormen en inwendige wormen, en werkt ook tegen bloedzuigers, visluizen en ankerwormen.',
    dosering: {
      model: 'vast', hoeveelheid: 20, per: 500, eenheid: 'gram', basis: 'bak',
      label: 'Eerste behandeling',
      omschrijving: '20 gram (1 maatschep) per 500 liter vijverwater',
    },
    extraDoseringen: [
      {
        model: 'vast', hoeveelheid: 20, per: 500, eenheid: 'gram', basis: 'bak',
        label: 'Zo nodig na 14 dagen',
        omschrijving: 'Dezelfde dosis herhalen: 20 gram per 500 liter',
      },
    ],
    toepassing: 'Voormengen in een emmer of gieter en gelijkmatig over de vijver verdelen. Onder 10 graden watertemperatuur neemt de parasiet Lernex onvoldoende op; verhoog zo nodig de temperatuur.',
    bron: 'Gebruiksaanwijzing Colombo Pond Lernex: "Dosering: 20 gr (=1 maatschep) per 500 liter vijverwater. Een maatschep is in de verpakking bijgesloten. Indien nodig kan de behandeling na 14 dagen herhaald worden."',
    opvolging: [],
    waarschuwingen: [
      'Dit is een behandeling die een diagnose vraagt (microscopisch onderzoek): vraag eerst advies.',
      'Schadelijk voor zoetwaterkreeftjes, kevers, libellenlarven en slakken.',
      'Kool en zeoliet verwijderen tijdens de kuur; UV-lampen en ozon tot 1 week na de laatste toediening uit.',
      'Minstens 2 weken wachten tussen Lernex en Alparex.',
      'De parasieten kunnen eerst actiever worden, waardoor vissen kunnen schieten of springen: houd ze in de gaten.',
    ],
    profielen: ['vijver_koi', 'vijver_sier'],
  },
  {
    id: 'morenicol-lernex-pro', naam: 'Morenicol Lernex Pro', categorie: 'zorg',
    verpakkingen: ['250 ml, voor 5.000 l', '500 ml, voor 10.000 l', '1000 ml, voor 20.000 l', '2500 ml, voor 50.000 l'],
    lost_op: [], richting: 'neutraliseert',
    omschrijving: 'Voor resistente huid- en kieuwwormen bij siervissen. Niet werkzaam tegen ankerwormen, karperluizen of bloedzuigers.',
    dosering: {
      model: 'vast', hoeveelheid: 1, per: 20, eenheid: 'ml', basis: 'bak',
      label: 'Eerste behandeling',
      omschrijving: '1 ml per 20 liter vijverwater',
    },
    extraDoseringen: [
      {
        model: 'vast', hoeveelheid: 1, per: 20, eenheid: 'ml', basis: 'bak',
        label: 'Zo nodig na 14 dagen',
        omschrijving: 'Dezelfde dosis herhalen: 1 ml per 20 liter',
      },
    ],
    toepassing: 'Afmeten met de bijgeleverde maatbeker en langzaam ingieten op een plek met veel stroming, bijvoorbeeld de uitstroom van pomp of filter. 48 uur na de laatste toediening Fish Protect gebruiken en Vita-Spray aan het voer toevoegen.',
    bron: 'Gebruiksaanwijzing Colombo Pond Lernex Pro: "Dosering: 1 ml per 20 liter vijverwater. Indien nodig kan de behandeling na 14 dagen herhaald worden."',
    opvolging: [
      { na: '48 uur na de laatste toediening', actie: 'Fish Protect gebruiken om de slijmhuid te beschermen en productresten te binden.' },
      { na: 'tijdens herstel', actie: 'Vita-Spray aan het voer toevoegen om de genezing te ondersteunen.' },
    ],
    waarschuwingen: [
      'Dit is een behandeling die een diagnose vraagt (microscopisch onderzoek): vraag eerst advies.',
      'Kool en zeoliet verwijderen tijdens de kuur; UV-lampen en ozon tot 1 week na de laatste toediening uit.',
      'Minstens 2 weken wachten tussen Lernex en Alparex.',
    ],
    profielen: ['vijver_koi', 'vijver_sier'],
  },
  {
    id: 'morenicol-lernex-pro-food', naam: 'Morenicol Lernex Pro Food', categorie: 'zorg',
    verpakkingen: [],
    lost_op: [], richting: 'neutraliseert',
    omschrijving: 'Medicinaal visvoer tegen huid- en kieuwwormen, voor grote vijvers waar een waterbehandeling niet mogelijk of te duur is. Bevat ook beta-glucanen, pre- en probiotica voor het afweersysteem.',
    dosering: { model: 'geen', eenheid: '', basis: 'bak', label: '2x per dag, 2 weken', omschrijving: '2 keer per dag voeren gedurende 2 weken' },
    toepassing: 'Niet meer voeren dan de vissen binnen 5 minuten opeten; overgebleven voer verwijderen. Niet combineren met een waterbehandeling met Morenicol Lernex Pro: risico op overdosering.',
    bron: 'Gebruiksaanwijzing Colombo Lernex Pro Food: "Dosering: Lernex-Pro voer moet 2x per dag gedurende 2 weken gevoerd worden. Voer niet meer dan de vissen in 5 min opeten. Verwijder overgebleven voer."',
    opvolging: [],
    waarschuwingen: [
      'Dit is een behandeling die een diagnose vraagt: vraag eerst advies.',
      'Niet combineren met een waterbehandeling met Morenicol Lernex Pro.',
    ],
    profielen: ['vijver_koi', 'vijver_sier'],
  },
  {
    id: 'morenicol-alparex', naam: 'Morenicol Alparex', categorie: 'zorg',
    verpakkingen: ['250 ml, voor 5.000 l', '500 ml, voor 10.000 l', '1000 ml, voor 20.000 l', '2500 ml, voor 50.000 l'],
    lost_op: [], richting: 'neutraliseert',
    omschrijving: 'Bestrijdt microscopische parasieten die een grauwe waas over de huid geven, zoals Trichodina, Ichthyobodo en Chilodonella, en werkt ook ontsmettend tegen bijkomende bacteriele infecties.',
    dosering: {
      model: 'vast', hoeveelheid: 1, per: 40, eenheid: 'ml', basis: 'bak',
      label: 'Dag 1',
      omschrijving: '1 ml per 40 liter vijverwater (25 ml per 1.000 liter)',
    },
    extraDoseringen: [
      {
        model: 'vast', hoeveelheid: 1, per: 40, eenheid: 'ml', basis: 'bak',
        label: 'Dag 2',
        omschrijving: 'Dezelfde dosis nog eens: 1 ml per 40 liter',
      },
    ],
    toepassing: 'Voormengen in een gieter of emmer en gelijkmatig over de vijver verdelen. De KH moet tussen 6 en 8 °DH liggen voor u begint. Bij steuren apart behandelen op de halve dosering (1 ml per 80 liter), eventueel een derde keer op dag 3.',
    bron: 'Gebruiksaanwijzing Colombo Pond Alparex: "Dosering: Het product Alparex moet in twee stappen worden toegediend: 1e dag: 1 ml per 40 liter vijverwater oftewel 25 ml per 1000 liter vijverwater. 2e dag: nogmaals 1 ml per 40 liter vijverwater."',
    opvolging: [
      { na: 'jeuk blijft na de behandeling', actie: 'Na 2 weken behandelen met Morenicol Lernex of Lernex Pro.' },
      { na: 'bijkomende bacteriele infectie', actie: 'Gerichter behandelen met Morenicol Cytofex.' },
    ],
    waarschuwingen: [
      'Dit is een behandeling die een diagnose vraagt: vraag eerst advies.',
      'De KH moet tussen 6 en 8 °DH liggen voor u start.',
      'Niet combineren met Flubendazole of verwante stoffen; daarna minstens 4 weken wachten en 25 procent water verversen.',
      'Minstens 2 weken wachten tussen Alparex en Algadrex, Lernex, Cytofex of FMC-50.',
      'Veroorzaakt blijvende vlekken op onder meer kleding en bestrating.',
    ],
    profielen: ['vijver_koi', 'vijver_sier'],
  },
  {
    id: 'morenicol-cytofex', naam: 'Morenicol Cytofex', categorie: 'zorg',
    verpakkingen: ['250 ml, voor 2.500 l', '500 ml, voor 5.000 l', '1000 ml, voor 10.000 l', '2500 ml, voor 25.000 l'],
    lost_op: [], richting: 'neutraliseert',
    omschrijving: 'Werkt tegen uitwendige bacteriele infecties zoals huidzweren, vinrot en gatenziekte, op basis van 100 procent natuurlijke grondstoffen (tea tree-olie, IJslands mos en Pau d\'Arco).',
    dosering: {
      model: 'vast', hoeveelheid: 1, per: 30, eenheid: 'ml', basis: 'bak',
      label: 'Dag 1 van 3',
      omschrijving: '1 ml per 30 liter vijverwater',
    },
    extraDoseringen: [
      {
        model: 'vast', hoeveelheid: 1, per: 30, eenheid: 'ml', basis: 'bak',
        label: 'Dag 2 en dag 3',
        omschrijving: 'Dezelfde dosis herhalen: 1 ml per 30 liter, op 3 opeenvolgende dagen',
      },
    ],
    toepassing: 'Voormengen in een gieter of emmer en gelijkmatig over de vijver verdelen, 3 dagen na elkaar. Tussen de toedieningen door geen water verversen. Zorg voor optimale beluchting.',
    bron: 'Gebruiksaanwijzing Colombo Marine Cytofex: "Dosering: Cytofex dient op 3 opeenvolgende dagen gebruikt te worden. Dag 1: 1 ml per 30 liter vijverwater; Dag 2: 1 ml per 30 liter vijverwater; Dag 3: 1 ml per 30 liter vijverwater." De inhoud van deze bron spreekt overigens uitsluitend over vijverwater en vijvervis, ondanks de bestandsnaam.',
    opvolging: [
      { na: '1 week na de laatste toediening', actie: 'Het filter grondig reinigen en Fish Protect aan het water toevoegen.' },
      { na: 'een dag na Fish Protect', actie: 'De biologische filtratie stimuleren met Bactuur Filter Start.' },
    ],
    waarschuwingen: [
      'Dit is een behandeling die een diagnose vraagt: vraag eerst advies.',
      'De afbraak van de actieve stoffen kan het zuurstofgehalte doen dalen; extra gevoelig bij bijvoorbeeld steuren.',
      'Kool en zeoliet verwijderen tijdens de kuur; UV-lampen en ozon tot 1 week na de laatste toediening uit.',
    ],
    profielen: ['vijver_koi', 'vijver_sier'],
  },
  {
    id: 'morenicol-fmc-50', naam: 'Morenicol FMC-50', categorie: 'zorg',
    verpakkingen: ['250 ml, voor 6.250 l', '500 ml, voor 12.500 l', '1000 ml, voor 25.000 l', '2500 ml, voor 62.500 l'],
    lost_op: [], richting: 'neutraliseert',
    omschrijving: 'Bestrijdt witte stip en schimmel (onder meer Saprolegnia) bij vijvervis.',
    dosering: {
      model: 'vast', hoeveelheid: 1, per: 25, eenheid: 'ml', basis: 'bak',
      label: 'Reguliere behandeling',
      omschrijving: '1 ml per 25 liter vijverwater',
    },
    extraDoseringen: [
      {
        model: 'vast', hoeveelheid: 1, per: 100, eenheid: 'ml', basis: 'bak',
        label: 'Preventief, 3 dagen na elkaar',
        omschrijving: '1 ml per 100 liter vijverwater per dag',
      },
    ],
    toepassing: 'Voormengen in een gieter of emmer en gelijkmatig over de vijver verdelen. De dosering halveren bij een pH onder 7 samen met een watertemperatuur boven 15 graden, of bij gevoelige soorten zoals winde, zeelt of steur. Zo nodig na een week herhalen.',
    bron: 'Gebruiksaanwijzing Colombo Pond FMC-50: "Dosering: 1 ml per 25 liter vijverwater. [...] De dosering moet gehalveerd worden als de pH lager dan 7 is èn tegelijkertijd de watertemperatuur boven de 15°C is, of als er gevoelige vissen zoals windes, zeelt of steuren, in de vijver zitten. Indien nodig kan de behandeling na 1 week worden herhaald. Als preventieve behandeling: Gedurende 3 dagen 1 ml per 100 liter vijverwater per dag."',
    opvolging: [
      { na: '48 uur na de laatste toediening', actie: 'Fish Protect toevoegen om de slijmhuid te beschermen en productresten te binden.' },
      { na: 'tijdens herstel', actie: 'Vita-Spray aan het voer toevoegen.' },
    ],
    waarschuwingen: [
      'Dit is een behandeling die een diagnose vraagt: vraag eerst advies.',
      'Halveer de dosering bij pH onder 7 samen met temperatuur boven 15 graden, of bij winde, zeelt of steur.',
      'Kool en zeoliet verwijderen tijdens de kuur; UV-lampen en ozon tot 1 week na de laatste toediening uit.',
      'Minstens 2 weken wachten tussen FMC-50 en Alparex.',
      'Veroorzaakt blijvende vlekken op onder meer kleding en bestrating.',
    ],
    profielen: ['vijver_koi', 'vijver_sier'],
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
