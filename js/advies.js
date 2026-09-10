/**
 * Adviesmotor: zet gemeten waarden om in concrete acties ("call to actions"),
 * productvoorstellen met berekende dosering en opvolgtaken.
 */
import { PARAMETERS, profile, statusOf, fmt, param } from './params.js';
import { PRODUCTEN, berekenDosis, productenVoor } from './products.js';

const URGENTIE = { kritiek: 3, 'let-op': 2, info: 1 };

/**
 * @param {object} meting  { waarden: {paramId: number}, ... }
 * @param {object} bak     { profiel, liters, ... }
 * @param {object[]} [historiek] eerdere metingen (nieuwste eerst) voor trendadvies
 * @param {object[]} [catalogus] productcatalogus (standaard: PRODUCTEN)
 * @returns {{acties: object[], score: number, samenvatting: string, huisbezoekAangeraden: boolean}}
 */
export function maakAdvies(meting, bak, historiek = [], catalogus = PRODUCTEN) {
  const waarden = meting?.waarden || {};
  const prof = profile(bak?.profiel);
  const liters = Number(bak?.liters) || 0;
  const acties = [];

  const val = (id) => (waarden[id] == null || waarden[id] === '' ? null : Number(waarden[id]));
  const st = (id) => statusOf(id, val(id), prof.id);
  const doel = (id) => prof.targets?.[id];

  // ---- 1. Waarde-per-waarde regels -------------------------------------------------
  for (const paramId of Object.keys(waarden)) {
    const v = val(paramId);
    if (v == null) continue;
    const status = st(paramId);
    if (status === 'goed' || status === 'onbekend') continue;
    const t = doel(paramId);
    const p = param(paramId);
    if (!p || !t) continue;
    const teHoog = v > t.ideal[1];
    const richting = teHoog ? 'omlaag' : 'omhoog';

    const actie = {
      id: `param-${paramId}`,
      param: paramId,
      urgentie: status === 'kritiek' ? 'kritiek' : 'let-op',
      titel: `${p.label} ${teHoog ? 'te hoog' : 'te laag'}: ${fmt(paramId, v)}`,
      streef: `Streefwaarde voor ${prof.label.toLowerCase()}: ${fmt(paramId, t.ideal[0])} tot ${fmt(paramId, t.ideal[1])}`,
      waarom: p.info,
      oorzaken: p.causes || [],
      stappen: [],
      producten: [],
      opvolging: [],
    };

    // parameter-specifieke stappen
    Object.assign(actie, regelsPer[paramId]?.(v, { teHoog, t, prof, liters, waarden: val, status }) || {});
    if (!actie.stappen.length) {
      actie.stappen = teHoog
        ? [`Ververs 25–30% van het water met voorbereid water en meet daarna opnieuw.`]
        : [`Stuur de waarde stapsgewijs bij en meet na 6 uur opnieuw.`];
    }

    // productvoorstellen met berekende dosering
    const kandidaten = productenVoor(paramId, richting, prof.id, catalogus);
    for (const prod of kandidaten) {
      // Alleen een delta berekenen als het product ook echt op déze parameter werkt.
      const delta = prod.dosering?.model === 'delta' && prod.dosering.param === paramId
        ? Math.abs((teHoog ? t.ideal[1] : t.ideal[0]) - v)
        : undefined;
      const dosis = berekenDosis(prod, liters, delta);
      actie.producten.push({ id: prod.id, naam: prod.naam, dosis, omschrijving: prod.omschrijving, opvolging: prod.opvolging });
      if (prod.opvolging) {
        for (const o of prod.opvolging) actie.opvolging.push({ ...o, product: prod.naam });
      }
    }
    if (!actie.opvolging.length) {
      actie.opvolging.push({ na: '24 uur', actie: `${p.label} opnieuw meten met de teststrip.` });
    }
    acties.push(actie);
  }

  // ---- 2. Combinatieregels ---------------------------------------------------------
  const kh = val('kh'), ph = val('ph'), no3 = val('no3'), po4 = val('po4');
  const nh4 = val('nh4'), no2 = val('no2'), temp = val('temp'), o2 = val('o2');

  if (kh != null && kh < 4 && ph != null) {
    acties.push(combi('combi-kh-ph', 'let-op',
      'Weinig buffer: uw pH kan plots wegzakken',
      `Uw KH is ${fmt('kh', kh)}. Onder 4 °dH heeft uw water bijna geen buffer meer en kan de pH van de ene dag op de andere onderuit gaan (een pH-crash). Dat is een veelvoorkomende oorzaak van plotse vissterfte.`,
      [
        'Breng eerst de KH op peil vóór u iets aan de pH doet.',
        'Verhoog maximaal 2 °dH per dag.',
        'Meet de pH een week lang elke dag op hetzelfde moment.',
      ],
      productenMetDosis(['kh-plus'], liters, catalogus, 4 - kh),
      [{ na: '6 uur', actie: 'KH en pH meten.' }, { na: '48 uur', actie: 'KH en pH opnieuw meten om te zien of de buffer standhoudt.' }]));
  }

  if (nh4 != null && nh4 > 0 && ph != null && ph >= 7.5) {
    acties.push(combi('combi-nh3', 'kritiek',
      'Gevaar op ammoniakvergiftiging',
      `U meet ${fmt('nh4', nh4)} ammonium bij een pH van ${fmt('ph', ph)}. Vanaf pH 7,5 slaat ammonium om in ammoniak, en dat is zeer giftig. Dezelfde waarde is bij een lage pH ongevaarlijk en bij een hoge pH levensbedreigend.`,
      [
        'Ververs onmiddellijk 30–50% van het water (op temperatuur, met waterbereider).',
        'Stop 48 uur met voederen.',
        'Zet extra beluchting bij.',
        'Verhoog de pH nu zeker niet: dat maakt de ammoniak nog giftiger.',
      ],
      productenMetDosis(['nitrite-rescue', 'bacto-start'], liters, catalogus),
      [{ na: '2 uur', actie: 'NH₄ en NO₂ opnieuw meten.' }, { na: 'dagelijks', actie: 'Dagelijks meten tot beide waarden 0 zijn.' }],
      true));
  }

  if (no3 != null && po4 != null && no3 > 30 && po4 > 0.5) {
    acties.push(combi('combi-algen', 'let-op',
      'Voedingsbodem voor algen',
      `Nitraat (${fmt('no3', no3)}) én fosfaat (${fmt('po4', po4)}) zitten samen hoog. Dat is de klassieke combinatie waarbij algen binnen enkele weken de bovenhand nemen.`,
      [
        'Ververs twee weken lang wekelijks 30% van het water.',
        'Voeder kleinere porties: alles moet binnen 2 minuten op zijn.',
        'Zuig de bodem mee af bij het verversen.',
        'Beperk de verlichting tot 8 uur per dag, zonder direct zonlicht.',
      ],
      productenMetDosis(['phosphate-control', 'nitrate-control', 'plant-complete'], liters, catalogus),
      [{ na: '1 week', actie: 'NO₃ en PO₄ opnieuw meten.' }, { na: '1 maand', actie: 'Foto toevoegen om het verschil te vergelijken.' }]));
  }

  if (temp != null && temp > 27 && (o2 == null || o2 < 7)) {
    acties.push(combi('combi-warm', 'let-op',
      'Warm water houdt weinig zuurstof vast',
      `Bij ${fmt('temp', temp)} kan uw water veel minder zuurstof opnemen, terwijl uw vissen er net méér verbruiken.`,
      [
        'Zet extra beluchting of een stromingspomp aan het oppervlak.',
        'Laat de verlichting korter branden.',
        'Voeder minder: verteren kost zuurstof.',
        'Koel geleidelijk af, maximaal 1 °C per uur.',
      ],
      productenMetDosis(['pond-oxy'], liters, catalogus),
      [{ na: '6 uur', actie: 'Temperatuur en gedrag van de vissen controleren.' }]));
  }

  if (no2 != null && no2 > 0 && historiek.length < 4) {
    acties.push(combi('combi-instart', 'kritiek',
      'Uw bak is waarschijnlijk nog niet ingedraaid',
      'Nitriet in een jonge bak betekent dat de filterbacteriën nog niet volgroeid zijn. Deze fase duurt normaal 3 tot 6 weken.',
      [
        'Zet geen nieuwe vissen bij tot NO₂ twee metingen na elkaar 0 is.',
        'Voeder heel weinig.',
        'Spoel uw filter niet uit in deze periode.',
        'Meet elke dag en noteer het hier in de app.',
      ],
      productenMetDosis(['bacto-start', 'nitrite-rescue'], liters, catalogus),
      [{ na: 'dagelijks', actie: 'NO₂ en NH₄ meten tot beide 0 zijn.' }],
      true));
  }

  // ---- 3. Trendregels --------------------------------------------------------------
  for (const t of trends(meting, historiek, prof)) acties.push(t);

  // ---- 4. Alles goed ---------------------------------------------------------------
  if (!acties.length) {
    acties.push({
      id: 'alles-ok', urgentie: 'info', titel: 'Uw waarden zitten goed',
      waarom: 'Alle gemeten waarden vallen binnen de streefwaarden van uw profiel. Door te blijven meten bent u problemen vóór.',
      stappen: [
        'Hou uw ritme aan: wekelijks 20–30% water verversen.',
        'Meet minstens één keer per week en noteer het hier.',
        'Voeg af en toe een foto toe zodat de evolutie zichtbaar blijft.',
      ],
      producten: [], opvolging: [{ na: '1 week', actie: 'Volgende controlemeting.' }], oorzaken: [],
    });
  }

  acties.sort((a, b) => (URGENTIE[b.urgentie] || 0) - (URGENTIE[a.urgentie] || 0));

  const kritiek = acties.filter((a) => a.urgentie === 'kritiek').length;
  const letop = acties.filter((a) => a.urgentie === 'let-op').length;
  const score = Math.max(0, 100 - kritiek * 30 - letop * 12);
  const huisbezoekAangeraden = kritiek > 0 || letop >= 3 || acties.some((a) => a.huisbezoek);

  return {
    acties, score, huisbezoekAangeraden,
    samenvatting: kritiek
      ? `${kritiek} kritieke ${kritiek === 1 ? 'waarde' : 'waarden'}${letop ? ` en ${letop} aandachtspunt${letop === 1 ? '' : 'en'}` : ''}: vraag hulp aan LUX AQUA.`
      : letop
        ? `${letop} aandachtspunt${letop === 1 ? '' : 'en'} om bij te sturen.`
        : 'Alle waarden binnen de streefwaarden.',
  };
}

function combi(id, urgentie, titel, waarom, stappen, producten, opvolging, huisbezoek = false) {
  return { id, urgentie, titel, waarom, stappen, producten, opvolging, oorzaken: [], huisbezoek };
}

function productenMetDosis(ids, liters, catalogus, delta) {
  return ids
    .map((id) => catalogus.find((p) => p.id === id))
    .filter(Boolean)
    .map((prod) => ({
      id: prod.id, naam: prod.naam, omschrijving: prod.omschrijving,
      dosis: berekenDosis(prod, liters, prod.dosering?.model === 'delta' ? delta : undefined),
      opvolging: prod.opvolging,
    }));
}

/** Parameterspecifieke stappen. Elke functie geeft een gedeeltelijk actie-object terug. */
const regelsPer = {
  no2: (v) => ({
    urgentie: v > 0.3 ? 'kritiek' : 'let-op',
    huisbezoek: v > 0.5,
    stappen: [
      'Ververs vandaag nog 30–50% van het water (zelfde temperatuur, met waterbereider).',
      'Stop 48 uur met voederen.',
      'Zet extra beluchting bij: nitriet blokkeert de zuurstofopname in het bloed.',
      'Spoel uw filter niet uit en vervang geen filtermateriaal.',
      v > 0.5 ? 'Vraag via de hulpknop een huisbezoek aan: dit is een noodsituatie.' : 'Meet morgen opnieuw.',
    ],
  }),
  nh4: (v) => ({
    urgentie: v > 0.25 ? 'kritiek' : 'let-op',
    huisbezoek: v > 0.5,
    stappen: [
      'Ververs 30–50% van het water.',
      'Zoek naar een dode vis, rottende planten of voedselresten onder de decoratie.',
      'Stop tijdelijk met voederen.',
      'Verhoog de pH niet zolang er ammonium in het water zit.',
    ],
  }),
  no3: (v, { t }) => ({
    stappen: [
      `Ververs 30% water en herhaal dit wekelijks tot u onder ${fmt('no3', t.ideal[1])} zit.`,
      'Zuig bij het verversen de bodem mee af.',
      'Voeder kleiner: alles moet binnen 2 minuten op zijn.',
      'Meet ook uw leidingwater: soms zit daar al 25 mg/l of meer in.',
    ],
  }),
  ph: (v, { teHoog, t }) => ({
    stappen: teHoog
      ? ['Controleer eerst uw KH: die bepaalt hoe hard de pH vastzit.',
         'Verlaag maximaal 0,2 pH per dag.',
         'Kijk na of er kalksteen of koraalgruis in de bak zit dat de pH omhoog duwt.']
      : ['Controleer eerst uw KH: een lage pH komt bijna altijd door een te lage buffer.',
         'Verhoog maximaal 0,2 pH per dag.',
         'Kijk na of hout of turf uw water aan het verzuren is.'],
  }),
  kh: (v, { teHoog }) => ({
    stappen: teHoog
      ? ['Ververs met zachter water (osmosewater bijmengen).', 'Verlaag traag: maximaal 2 °dH per dag.']
      : ['Verhoog de KH vóór u iets aan de pH doet.', 'Maximaal 2 °dH per dag verhogen.', 'Meet ook de KH van uw leidingwater.'],
  }),
  gh: (v, { teHoog }) => ({
    stappen: teHoog
      ? ['Meng osmosewater bij uw verversingswater om de GH te verlagen.']
      : ['Vul mineralen aan in het verse verversingswater in plaats van in de bak zelf.', 'Belangrijk voor garnalen, slakken en jonge vissen.'],
  }),
  cl2: () => ({
    urgentie: 'kritiek',
    stappen: [
      'Doseer onmiddellijk een waterbereider over de volledige bakinhoud.',
      'Vul nooit meer bij met leidingwater zonder waterbereider.',
      'Meet daarna opnieuw: chloor moet op 0 staan.',
    ],
  }),
  po4: (v, { teHoog }) => ({
    stappen: teHoog
      ? ['Voeder minder en verwijder voedselresten.', 'Ververs wekelijks 30% water.', 'Meet ook uw leidingwater op fosfaat.']
      : ['In een beplante bak hebt u een klein beetje fosfaat nodig; doseer bij met plantenvoeding.'],
  }),
  temp: (v, { teHoog }) => ({
    stappen: teHoog
      ? ['Controleer de instelling van uw verwarming.', 'Koel geleidelijk af (max. 1 °C per uur) en zorg voor extra beluchting.']
      : ['Controleer of uw verwarming werkt en juist staat.', 'Verwarm geleidelijk, max. 1 °C per uur.'],
  }),
  o2: () => ({
    stappen: [
      'Zet extra beluchting of oppervlaktebeweging bij.',
      'Verwijder rottend materiaal en slib.',
      'Voeder minder tot de waarde weer goed zit.',
    ],
  }),
  dichtheid: (v, { teHoog }) => ({
    stappen: teHoog
      ? ['Vul aan met osmosewater zonder zout, verspreid over meerdere dagen.']
      : ['Verhoog traag met opgelost zeezout, maximaal 0,001 per dag.'],
  }),
};

/** Trendadvies op basis van eerdere metingen. */
function trends(meting, historiek, prof) {
  const uit = [];
  if (!historiek?.length) return uit;
  const vorige = historiek[0];
  for (const id of Object.keys(meting?.waarden || {})) {
    const nu = Number(meting.waarden[id]);
    const toen = Number(vorige?.waarden?.[id]);
    if (Number.isNaN(nu) || Number.isNaN(toen) || toen === 0) continue;
    const p = PARAMETERS[id];
    const verschil = nu - toen;
    const relatief = Math.abs(verschil) / Math.abs(toen);
    if (relatief < 0.5 || Math.abs(verschil) < (p?.step || 0.1)) continue;
    const status = statusOf(id, nu, prof.id);
    if (status === 'goed') continue;
    uit.push({
      id: `trend-${id}`, param: id, urgentie: 'let-op',
      titel: `${p.label} is sterk ${verschil > 0 ? 'gestegen' : 'gedaald'}`,
      waarom: `Vorige meting ${fmt(id, toen)}, nu ${fmt(id, nu)}. Snelle schommelingen zijn voor vissen vaak belastender dan een waarde die constant net buiten het ideale zit.`,
      stappen: ['Meet binnen 24 uur opnieuw om te bevestigen dat dit geen meetfout is.', 'Noteer wat er sinds de vorige meting veranderd is (nieuwe vissen, ander voer, filterbeurt, waterwissel).'],
      producten: [], opvolging: [{ na: '24 uur', actie: `${p.label} opnieuw meten ter controle.` }], oorzaken: [],
    });
  }
  return uit;
}

/** Zet de opvolgpunten van een advies om in taken met een concrete vervaldatum. */
export function opvolgTaken(advies, vanaf = Date.now()) {
  const taken = [];
  const zien = new Set();
  for (const actie of advies.acties) {
    for (const o of actie.opvolging || []) {
      const sleutel = `${o.na}|${o.actie}`;
      if (zien.has(sleutel)) continue;
      zien.add(sleutel);
      taken.push({
        id: `taak-${taken.length}-${Date.now()}`,
        omschrijving: o.actie,
        termijn: o.na,
        product: o.product || null,
        vervalt: vanaf + parseTermijn(o.na),
        klaar: false,
      });
    }
  }
  return taken.sort((a, b) => a.vervalt - b.vervalt);
}

const UUR = 3600e3, DAG = 24 * UUR;
export function parseTermijn(t = '') {
  const s = String(t).toLowerCase();
  if (s.includes('direct')) return 0;
  if (s.includes('dagelijks')) return DAG;
  const m = s.match(/(\d+)\s*(uur|dag|dagen|week|weken|maand|maanden)/);
  if (!m) return DAG;
  const n = Number(m[1]);
  if (m[2].startsWith('uur')) return n * UUR;
  if (m[2].startsWith('dag')) return n * DAG;
  if (m[2].startsWith('week')) return n * 7 * DAG;
  return n * 30 * DAG;
}
