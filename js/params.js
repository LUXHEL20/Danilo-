/**
 * Waterparameters, streefwaarden per waterprofiel en teststrip-presets.
 * Alle data staat hier centraal zodat LUX AQUA ze kan aanpassen zonder de app te herschrijven.
 */

/**
 * kind:
 *  - 'zero'   : hoort 0 te zijn (elke waarde erboven is een probleem)
 *  - 'range'  : moet binnen een venster liggen
 *  - 'lower'  : lager is beter, met een bovengrens
 */
export const PARAMETERS = {
  temp: {
    id: 'temp', label: 'Temperatuur', short: 'Temp', unit: '°C', decimals: 1, step: 0.1, min: 0, max: 40,
    kind: 'range', onStrip: false,
    info: 'Bepaalt de stofwisseling van vissen, de zuurstofopname van het water en de snelheid van uw filterbacteriën.',
    causes: ['Defecte of verkeerd ingestelde verwarming', 'Warme kamer of zon op de bak', 'Verlichting die te veel warmte afgeeft'],
  },
  ph: {
    id: 'ph', label: 'pH (zuurtegraad)', short: 'pH', unit: '', decimals: 1, step: 0.1, min: 4, max: 10,
    kind: 'range', onStrip: true,
    info: 'De pH zegt hoe zuur of basisch het water is. Hij wordt vastgehouden door de KH: is uw KH te laag, dan kan de pH plots wegzakken (pH-crash).',
    causes: ['KH te laag waardoor de pH niet gebufferd wordt', 'Te veel CO2 (verlaagt pH) of te weinig CO2 (verhoogt pH)', 'Veel afbraak van voedselresten en planten', 'Kraantjeswater dat sterk afwijkt'],
    scale: [
      { value: 6.0, hex: '#f6e05e' }, { value: 6.4, hex: '#eddb52' }, { value: 6.8, hex: '#dcd558' },
      { value: 7.2, hex: '#c3cd62' }, { value: 7.6, hex: '#a3c274' }, { value: 8.0, hex: '#7bb489' },
      { value: 8.4, hex: '#5aa79b' }, { value: 9.0, hex: '#4593a6' },
    ],
  },
  kh: {
    id: 'kh', label: 'KH (carbonaathardheid)', short: 'KH', unit: '°dH', decimals: 0, step: 1, min: 0, max: 25,
    kind: 'range', onStrip: true,
    info: 'De KH is de buffer van uw water: hij houdt de pH stabiel. Dit is de waarde om eerst in orde te brengen.',
    causes: ['Osmose- of regenwater zonder remineralisatie', 'Zuren uit hout, turf of veel bodemvoeding', 'Lang geen waterverversing gedaan'],
    scale: [
      { value: 0, hex: '#f3e9a8' }, { value: 3, hex: '#dfe08f' }, { value: 6, hex: '#c2d67f' },
      { value: 10, hex: '#95c47b' }, { value: 15, hex: '#66ad7c' }, { value: 20, hex: '#3f9682' },
    ],
  },
  gh: {
    id: 'gh', label: 'GH (totale hardheid)', short: 'GH', unit: '°dH', decimals: 0, step: 1, min: 0, max: 30,
    kind: 'range', onStrip: true,
    info: 'De GH is de hoeveelheid calcium en magnesium. Vissen, garnalen en slakken hebben die nodig voor hun schild, schubben en groei.',
    causes: ['Osmosewater zonder mineralen', 'Zeer hard leidingwater', 'Kalksteen of koraalgruis in de bak'],
    scale: [
      { value: 0, hex: '#8fd3c8' }, { value: 4, hex: '#a9d6ab' }, { value: 8, hex: '#c8d68d' },
      { value: 12, hex: '#dfcf7c' }, { value: 16, hex: '#e0b473' }, { value: 21, hex: '#d98f6e' },
    ],
  },
  no2: {
    id: 'no2', label: 'Nitriet (NO₂)', short: 'NO₂', unit: 'mg/l', decimals: 2, step: 0.05, min: 0, max: 10,
    kind: 'zero', onStrip: true, critical: true,
    info: 'Nitriet is acuut giftig: het blokkeert de zuurstofopname in het bloed van uw vissen. Boven 0,3 mg/l is dit een noodgeval.',
    causes: ['Nieuwe bak die nog niet ingedraaid is', 'Filter gespoeld met kraantjeswater of vervangen', 'Te veel vissen ineens bijgezet of te veel gevoederd', 'Medicatie die de filterbacteriën heeft gedood'],
    scale: [
      { value: 0, hex: '#fdf6e8' }, { value: 0.5, hex: '#f6cfd6' }, { value: 1, hex: '#ef9fb8' },
      { value: 3, hex: '#e0648f' }, { value: 5, hex: '#c93b74' }, { value: 10, hex: '#a51d5c' },
    ],
  },
  no3: {
    id: 'no3', label: 'Nitraat (NO₃)', short: 'NO₃', unit: 'mg/l', decimals: 0, step: 5, min: 0, max: 250,
    kind: 'lower', onStrip: true,
    info: 'Nitraat is het eindproduct van de afbraak. Niet acuut giftig, maar hoge waarden geven algen, slechte groei en stress op lange termijn.',
    causes: ['Te weinig of te kleine waterverversingen', 'Te veel voederen of te veel vissen', 'Vuil filter of mulm in de bodem', 'Leidingwater dat zelf al nitraat bevat'],
    scale: [
      { value: 0, hex: '#fdf2e0' }, { value: 10, hex: '#f9d9c0' }, { value: 25, hex: '#f2b79b' },
      { value: 50, hex: '#e88b7c' }, { value: 100, hex: '#d75f66' }, { value: 250, hex: '#b03653' },
    ],
  },
  nh4: {
    id: 'nh4', label: 'Ammonium / ammoniak (NH₄/NH₃)', short: 'NH₄', unit: 'mg/l', decimals: 2, step: 0.05, min: 0, max: 10,
    kind: 'zero', onStrip: true, critical: true,
    info: 'Bij een hoge pH slaat ammonium om in ammoniak, en dat is zeer giftig. Hoe hoger uw pH en temperatuur, hoe gevaarlijker dezelfde waarde is.',
    causes: ['Bak nog niet ingedraaid', 'Dode vis of rottend plantmateriaal', 'Filter uitgevallen of te klein', 'Te veel voer'],
    scale: [
      { value: 0, hex: '#f7f3d9' }, { value: 0.5, hex: '#e4e59c' }, { value: 1, hex: '#c9d97e' },
      { value: 3, hex: '#95c26f' }, { value: 6, hex: '#5aa568' },
    ],
  },
  cl2: {
    id: 'cl2', label: 'Chloor (Cl₂)', short: 'Cl₂', unit: 'mg/l', decimals: 1, step: 0.1, min: 0, max: 5,
    kind: 'zero', onStrip: true,
    info: 'Chloor uit het leidingnet beschadigt kieuwen en doodt uw filterbacteriën. Werk het weg vóór u water bijvult.',
    causes: ['Vers leidingwater zonder waterbereider', 'Tijdelijke chloorpiek bij werken aan de waterleiding'],
    scale: [
      { value: 0, hex: '#fdfaf0' }, { value: 0.5, hex: '#f3dbe6' }, { value: 1, hex: '#e2aecd' },
      { value: 3, hex: '#c377ae' },
    ],
  },
  po4: {
    id: 'po4', label: 'Fosfaat (PO₄)', short: 'PO₄', unit: 'mg/l', decimals: 2, step: 0.05, min: 0, max: 10,
    kind: 'range', onStrip: true,
    info: 'Fosfaat is plantenvoeding, maar te veel fosfaat samen met licht en nitraat is de klassieke motor van een algenbloei.',
    causes: ['Te veel voederen', 'Fosfaathoudend leidingwater', 'Overdosering plantenmest', 'Te weinig waterverversing'],
    scale: [
      { value: 0, hex: '#fbf7e6' }, { value: 0.5, hex: '#dfe6c4' }, { value: 1, hex: '#b5d3b0' },
      { value: 3, hex: '#77b8a2' }, { value: 5, hex: '#3f9a8f' },
    ],
  },
  fe: {
    id: 'fe', label: 'IJzer (Fe)', short: 'Fe', unit: 'mg/l', decimals: 2, step: 0.01, min: 0, max: 2,
    kind: 'range', onStrip: false,
    info: 'IJzer is een essentiële sporenstof voor planten. Te weinig geeft bleke, doorschijnende jonge bladeren.',
    causes: ['Geen of te weinig plantenmest', 'IJzer wordt snel afgebroken door sterk licht en UV'],
  },
  o2: {
    id: 'o2', label: 'Zuurstof (O₂)', short: 'O₂', unit: 'mg/l', decimals: 1, step: 0.5, min: 0, max: 20,
    kind: 'range', onStrip: false,
    info: 'Zuurstof is levensnoodzakelijk voor vissen én voor uw filterbacteriën. Warm water houdt minder zuurstof vast.',
    causes: ['Te weinig oppervlaktebeweging', 'Te warm water', 'Te veel vissen of veel rottend materiaal', 'Nachtelijk verbruik door planten en algen'],
  },
  cu: {
    id: 'cu', label: 'Koper (Cu)', short: 'Cu', unit: 'mg/l', decimals: 2, step: 0.01, min: 0, max: 2,
    kind: 'zero', onStrip: false,
    info: 'Koper is dodelijk voor garnalen, kreeftjes en ongewervelden, zelfs in kleine hoeveelheden.',
    causes: ['Koperen leidingen', 'Restanten van medicatie tegen parasieten'],
  },
  ca: {
    id: 'ca', label: 'Calcium (Ca)', short: 'Ca', unit: 'mg/l', decimals: 0, step: 5, min: 0, max: 600,
    kind: 'range', onStrip: false,
    info: 'Bouwsteen van koraalskelet in een zeewaterbak. Hoort in balans te zijn met KH en magnesium.',
    causes: ['Sterke koraalgroei die calcium verbruikt', 'Onvoldoende bijdosering of te kleine waterwissels'],
  },
  mg: {
    id: 'mg', label: 'Magnesium (Mg)', short: 'Mg', unit: 'mg/l', decimals: 0, step: 10, min: 0, max: 2000,
    kind: 'range', onStrip: false,
    info: 'Magnesium houdt calcium en KH in oplossing. Zonder juist magnesium lukt het niet om Ca en KH stabiel te krijgen.',
    causes: ['Verbruik door koralen en kalkalgen', 'Te weinig bijdoseren'],
  },
  dichtheid: {
    id: 'dichtheid', label: 'Dichtheid / zoutgehalte', short: 'Dichtheid', unit: '', decimals: 3, step: 0.001, min: 1.000, max: 1.040,
    kind: 'range', onStrip: false,
    info: 'De dichtheid bepaalt het zoutgehalte. Verdamping verhoogt hem, bijvullen met zoet water verlaagt hem.',
    causes: ['Verdamping niet aangevuld', 'Bijvullen met zout water in plaats van osmosewater'],
  },
};

/** Waterprofielen: elk profiel bepaalt welke waarden u opvolgt en wat de streefwaarden zijn. */
export const PROFILES = {
  zoet_gezelschap: {
    id: 'zoet_gezelschap', label: 'Zoetwater gezelschapsbak', group: 'Aquarium',
    params: ['temp', 'ph', 'kh', 'gh', 'no2', 'no3', 'nh4', 'cl2', 'po4'],
    targets: {
      temp: { ideal: [23, 26], ok: [22, 28] },
      ph: { ideal: [6.5, 7.5], ok: [6.0, 8.2] },
      kh: { ideal: [4, 8], ok: [3, 14] },
      gh: { ideal: [6, 14], ok: [4, 20] },
      no2: { ideal: [0, 0], ok: [0, 0.1] },
      no3: { ideal: [0, 25], ok: [0, 50] },
      nh4: { ideal: [0, 0], ok: [0, 0.1] },
      cl2: { ideal: [0, 0], ok: [0, 0] },
      po4: { ideal: [0, 0.5], ok: [0, 1] },
      o2: { ideal: [7, 11], ok: [5, 14] },
    },
  },
  zoet_planten: {
    id: 'zoet_planten', label: 'Beplant aquarium (aquascape)', group: 'Aquarium',
    params: ['temp', 'ph', 'kh', 'gh', 'no2', 'no3', 'nh4', 'po4', 'fe'],
    targets: {
      temp: { ideal: [23, 25], ok: [21, 27] },
      ph: { ideal: [6.4, 7.0], ok: [6.0, 7.6] },
      kh: { ideal: [3, 6], ok: [2, 10] },
      gh: { ideal: [5, 10], ok: [4, 16] },
      no2: { ideal: [0, 0], ok: [0, 0.1] },
      no3: { ideal: [10, 25], ok: [5, 40] },
      nh4: { ideal: [0, 0], ok: [0, 0.1] },
      po4: { ideal: [0.1, 1], ok: [0.05, 2] },
      fe: { ideal: [0.05, 0.1], ok: [0.02, 0.25] },
    },
  },
  zoet_malawi: {
    id: 'zoet_malawi', label: 'Malawi / Tanganyika cichliden', group: 'Aquarium',
    params: ['temp', 'ph', 'kh', 'gh', 'no2', 'no3', 'nh4'],
    targets: {
      temp: { ideal: [24, 26], ok: [23, 28] },
      ph: { ideal: [7.8, 8.6], ok: [7.5, 9.0] },
      kh: { ideal: [8, 14], ok: [6, 18] },
      gh: { ideal: [8, 16], ok: [6, 22] },
      no2: { ideal: [0, 0], ok: [0, 0.1] },
      no3: { ideal: [0, 25], ok: [0, 50] },
      nh4: { ideal: [0, 0], ok: [0, 0.1] },
    },
  },
  garnalen: {
    id: 'garnalen', label: 'Garnalenbak', group: 'Aquarium',
    params: ['temp', 'ph', 'kh', 'gh', 'no2', 'no3', 'nh4', 'cu'],
    targets: {
      temp: { ideal: [21, 24], ok: [19, 26] },
      ph: { ideal: [6.4, 7.4], ok: [6.0, 7.8] },
      kh: { ideal: [2, 6], ok: [1, 10] },
      gh: { ideal: [6, 10], ok: [4, 14] },
      no2: { ideal: [0, 0], ok: [0, 0] },
      no3: { ideal: [0, 15], ok: [0, 25] },
      nh4: { ideal: [0, 0], ok: [0, 0] },
      cu: { ideal: [0, 0], ok: [0, 0] },
    },
  },
  zee_rif: {
    id: 'zee_rif', label: 'Zeewater / rifaquarium', group: 'Zeewater',
    params: ['temp', 'ph', 'kh', 'no2', 'no3', 'nh4', 'po4', 'ca', 'mg', 'dichtheid'],
    targets: {
      temp: { ideal: [25, 26.5], ok: [24, 27.5] },
      ph: { ideal: [8.0, 8.4], ok: [7.8, 8.5] },
      kh: { ideal: [7, 9], ok: [6, 11] },
      no2: { ideal: [0, 0], ok: [0, 0] },
      no3: { ideal: [1, 10], ok: [0, 25] },
      nh4: { ideal: [0, 0], ok: [0, 0] },
      po4: { ideal: [0.02, 0.1], ok: [0, 0.2] },
      ca: { ideal: [400, 450], ok: [380, 480] },
      mg: { ideal: [1250, 1350], ok: [1200, 1450] },
      dichtheid: { ideal: [1.024, 1.026], ok: [1.022, 1.027] },
    },
  },
  vijver_koi: {
    id: 'vijver_koi', label: 'Koivijver', group: 'Vijver',
    params: ['temp', 'ph', 'kh', 'gh', 'no2', 'no3', 'nh4', 'o2', 'po4'],
    targets: {
      temp: { ideal: [16, 24], ok: [4, 28] },
      ph: { ideal: [7.2, 8.5], ok: [6.8, 9.0] },
      kh: { ideal: [6, 12], ok: [4, 16] },
      gh: { ideal: [8, 16], ok: [6, 22] },
      no2: { ideal: [0, 0], ok: [0, 0.1] },
      no3: { ideal: [0, 40], ok: [0, 80] },
      nh4: { ideal: [0, 0], ok: [0, 0.1] },
      o2: { ideal: [8, 12], ok: [6, 15] },
      po4: { ideal: [0, 0.05], ok: [0, 0.3] },
    },
  },
  vijver_sier: {
    id: 'vijver_sier', label: 'Siervijver / natuurvijver', group: 'Vijver',
    params: ['temp', 'ph', 'kh', 'gh', 'no2', 'no3', 'po4', 'o2'],
    targets: {
      temp: { ideal: [12, 24], ok: [2, 28] },
      ph: { ideal: [7.0, 8.5], ok: [6.5, 9.0] },
      kh: { ideal: [5, 10], ok: [3, 16] },
      gh: { ideal: [8, 16], ok: [5, 22] },
      no2: { ideal: [0, 0], ok: [0, 0.1] },
      no3: { ideal: [0, 30], ok: [0, 60] },
      po4: { ideal: [0, 0.05], ok: [0, 0.2] },
      o2: { ideal: [8, 12], ok: [6, 15] },
    },
  },
};

/**
 * Teststrip-presets. `pads` staat in de volgorde waarin de velden op de strip staan,
 * van het uiteinde van de strip (verst van de handgreep) naar de handgreep toe.
 * Klopt de volgorde niet met uw merk? In de app kan u de strip omdraaien of
 * de velden handmatig toewijzen.
 */
export const STRIP_PRESETS = [
  { id: 'strip6', label: '6-in-1 teststrip (standaard)', pads: ['no3', 'no2', 'gh', 'kh', 'ph', 'cl2'] },
  { id: 'strip5', label: '5-in-1 teststrip', pads: ['no3', 'no2', 'gh', 'kh', 'ph'] },
  { id: 'strip7', label: '7-in-1 teststrip (met NH₄)', pads: ['no3', 'no2', 'gh', 'kh', 'ph', 'cl2', 'nh4'] },
  { id: 'strip9', label: '9-in-1 teststrip', pads: ['no3', 'no2', 'gh', 'kh', 'ph', 'cl2', 'nh4', 'po4', 'fe'] },
  { id: 'strip_nh4', label: 'Losse ammonium-strip', pads: ['nh4'] },
  { id: 'strip_zee', label: 'Zeewater teststrip', pads: ['no3', 'no2', 'kh', 'ph', 'ca'] },
];

export const param = (id) => PARAMETERS[id];
export const profile = (id) => PROFILES[id] || PROFILES.zoet_gezelschap;

/** Bepaalt de status van een meetwaarde t.o.v. het profiel: 'goed' | 'let-op' | 'kritiek' | 'onbekend'. */
export function statusOf(paramId, value, profileId) {
  const t = profile(profileId).targets?.[paramId];
  if (t == null || value == null || Number.isNaN(value)) return 'onbekend';
  const [i0, i1] = t.ideal;
  const [o0, o1] = t.ok;
  if (value >= i0 && value <= i1) return 'goed';
  if (value >= o0 && value <= o1) return 'let-op';
  return 'kritiek';
}

export const STATUS_LABEL = { goed: 'Goed', 'let-op': 'Let op', kritiek: 'Kritiek', onbekend: 'Geen streefwaarde' };

/** Formatteert een waarde met de juiste precisie en eenheid. */
export function fmt(paramId, value) {
  if (value == null || Number.isNaN(value)) return '–';
  const p = param(paramId);
  if (!p) return String(value);
  return `${Number(value).toFixed(p.decimals)}${p.unit ? ' ' + p.unit : ''}`;
}
