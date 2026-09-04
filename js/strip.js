/**
 * Uitlezen van teststrips uit een foto.
 *
 * Werkwijze:
 *  1. de foto wordt verkleind en in een canvas gezet;
 *  2. binnen het uitleeskader wordt de strip gezocht (de witte drager);
 *  3. per veldje wordt een robuuste mediaankleur genomen;
 *  4. de kleur wordt witgebalanceerd op basis van de witte drager;
 *  5. de kleur wordt in Lab-ruimte vergeleken met de kleurenkaart van de strip.
 *
 * Het resultaat is altijd een VOORSTEL: de klant bevestigt of corrigeert het.
 * De correcties worden bijgehouden zodat Lux Aqua ziet hoe betrouwbaar het lezen is.
 */
import { rgbToLab, deltaE2000, whiteBalance, hexToRgb } from './color.js';
import { PARAMETERS } from './params.js';

/* ------------------------------------------------------------------ afbeeldingen */

export function laadAfbeelding(bron) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('De afbeelding kon niet geladen worden.'));
    img.src = typeof bron === 'string' ? bron : URL.createObjectURL(bron);
  });
}

/** Tekent de afbeelding verkleind op een canvas (max. `maxZijde` px). */
export function naarCanvas(img, maxZijde = 1400) {
  const schaal = Math.min(1, maxZijde / Math.max(img.naturalWidth || img.width, img.naturalHeight || img.height));
  const c = document.createElement('canvas');
  c.width = Math.round((img.naturalWidth || img.width) * schaal);
  c.height = Math.round((img.naturalHeight || img.height) * schaal);
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, c.width, c.height);
  return c;
}

/** Comprimeert een foto voor opslag en delen. */
export async function comprimeer(bron, maxZijde = 1400, kwaliteit = 0.82) {
  const img = typeof bron === 'string' || bron instanceof Blob ? await laadAfbeelding(bron) : bron;
  const c = naarCanvas(img, maxZijde);
  return new Promise((resolve) => c.toBlob((b) => resolve(b), 'image/jpeg', kwaliteit));
}

/** Maakt een kleine voorbeeldafbeelding als data-URL (om te tonen en te delen). */
export async function thumbnail(bron, maxZijde = 400, kwaliteit = 0.7) {
  const img = typeof bron === 'string' || bron instanceof Blob ? await laadAfbeelding(bron) : bron;
  return naarCanvas(img, maxZijde).toDataURL('image/jpeg', kwaliteit);
}

/* ------------------------------------------------------------ pixelbewerkingen */

/** Mediaankleur van een rechthoek: veel minder gevoelig voor spiegeling en ruis dan een gemiddelde. */
export function mediaanKleur(imageData, x0, y0, w, h) {
  const { data, width, height } = imageData;
  const kanalen = [[], [], []];
  const stapX = Math.max(1, Math.floor(w / 24));
  const stapY = Math.max(1, Math.floor(h / 24));
  for (let y = Math.max(0, y0 | 0); y < Math.min(height, y0 + h); y += stapY) {
    for (let x = Math.max(0, x0 | 0); x < Math.min(width, x0 + w); x += stapX) {
      const i = (y * width + x) * 4;
      kanalen[0].push(data[i]); kanalen[1].push(data[i + 1]); kanalen[2].push(data[i + 2]);
    }
  }
  if (!kanalen[0].length) return [0, 0, 0];
  return kanalen.map((k) => {
    k.sort((a, b) => a - b);
    return k[Math.floor(k.length / 2)];
  });
}

/** Helderheid (0-255) van een kleur. */
const lum = ([r, g, b]) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
/** Chroma: hoe "gekleurd" een kleur is; de witte drager heeft een lage chroma. */
const chroma = ([r, g, b]) => Math.max(r, g, b) - Math.min(r, g, b);

/**
 * Zoekt automatisch de strip in de foto: een lang, licht en weinig gekleurd vlak.
 * Werkt op een grof raster; geeft null terug als er niets plausibels gevonden wordt.
 */
export function zoekStrip(imageData) {
  const { width: W, height: H } = imageData;
  const cellen = 48;
  const cw = Math.max(1, Math.floor(W / cellen));
  const ch = Math.max(1, Math.floor(H / cellen));
  const kaart = [];
  let totaal = 0, n = 0;
  for (let gy = 0; gy < cellen; gy++) {
    kaart[gy] = [];
    for (let gx = 0; gx < cellen; gx++) {
      const kleur = mediaanKleur(imageData, gx * cw, gy * ch, cw, ch);
      const l = lum(kleur);
      kaart[gy][gx] = l;
      totaal += l; n++;
    }
  }
  const gem = totaal / n;
  let varTot = 0;
  for (const rij of kaart) for (const l of rij) varTot += (l - gem) ** 2;
  const sd = Math.sqrt(varTot / n);
  const drempel = gem + 0.6 * sd;

  // eenvoudige verbondencomponenten op het raster
  const bezocht = Array.from({ length: cellen }, () => new Array(cellen).fill(false));
  let beste = null;
  for (let gy = 0; gy < cellen; gy++) {
    for (let gx = 0; gx < cellen; gx++) {
      if (bezocht[gy][gx] || kaart[gy][gx] < drempel) continue;
      let minX = gx, maxX = gx, minY = gy, maxY = gy, grootte = 0;
      const stapel = [[gx, gy]];
      bezocht[gy][gx] = true;
      while (stapel.length) {
        const [x, y] = stapel.pop();
        grootte++;
        minX = Math.min(minX, x); maxX = Math.max(maxX, x);
        minY = Math.min(minY, y); maxY = Math.max(maxY, y);
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= cellen || ny >= cellen) continue;
          if (bezocht[ny][nx] || kaart[ny][nx] < drempel) continue;
          bezocht[ny][nx] = true;
          stapel.push([nx, ny]);
        }
      }
      const bw = maxX - minX + 1, bh = maxY - minY + 1;
      const verhouding = Math.max(bw, bh) / Math.max(1, Math.min(bw, bh));
      if (grootte < 8 || verhouding < 2.2) continue;             // strips zijn langwerpig
      const punten = grootte * verhouding;
      if (!beste || punten > beste.punten) {
        beste = { punten, rect: { x: minX * cw, y: minY * ch, w: bw * cw, h: bh * ch } };
      }
    }
  }
  if (!beste) return null;
  const r = beste.rect;
  // een klein beetje inkrimpen zodat de rand van de strip niet meegemeten wordt
  const marge = 0.08;
  return {
    x: Math.round(r.x + r.w * marge), y: Math.round(r.y + r.h * marge),
    w: Math.round(r.w * (1 - 2 * marge)), h: Math.round(r.h * (1 - 2 * marge)),
  };
}

/** Standaardkader wanneer automatisch zoeken niets vindt: een verticale band in het midden. */
export const standaardKader = (W, H) => ({ x: Math.round(W * 0.40), y: Math.round(H * 0.10), w: Math.round(W * 0.20), h: Math.round(H * 0.80) });

/**
 * Zoekt de middens van de testveldjes binnen het kader.
 * We kijken langs de lange as naar het kleurverschil met de witte drager.
 * @returns {{as:'x'|'y', centra:number[], breedte:number, wit:number[]}}
 */
export function zoekVeldjes(imageData, rect, aantal) {
  const as = rect.h >= rect.w ? 'y' : 'x';
  const lengte = as === 'y' ? rect.h : rect.w;
  const dikte = as === 'y' ? rect.w : rect.h;
  const stappen = Math.max(aantal * 8, Math.min(200, lengte));
  const stapgrootte = lengte / stappen;

  const lijn = [];
  for (let i = 0; i < stappen; i++) {
    const p = i * stapgrootte;
    const x = as === 'y' ? rect.x + dikte * 0.25 : rect.x + p;
    const y = as === 'y' ? rect.y + p : rect.y + dikte * 0.25;
    const w = as === 'y' ? dikte * 0.5 : Math.max(1, stapgrootte);
    const h = as === 'y' ? Math.max(1, stapgrootte) : dikte * 0.5;
    lijn.push(mediaanKleur(imageData, x, y, w, h));
  }

  // referentiewit = de lichtste, minst gekleurde plekken op de strip
  const gesorteerd = [...lijn].sort((a, b) => (lum(b) - chroma(b)) - (lum(a) - chroma(a)));
  const witKandidaten = gesorteerd.slice(0, Math.max(2, Math.round(gesorteerd.length * 0.15)));
  const wit = [0, 1, 2].map((k) => Math.round(witKandidaten.reduce((s, c) => s + c[k], 0) / witKandidaten.length));

  // signaal = hoe sterk wijkt deze plek af van de witte drager
  const witLab = rgbToLab(wit);
  const ruw = lijn.map((c) => deltaE2000(rgbToLab(c), witLab));
  const signaal = gladstrijken(ruw, Math.max(1, Math.round(stappen / (aantal * 6))));

  const minAfstand = Math.max(2, Math.floor(stappen / (aantal * 1.9)));
  const pieken = zoekPieken(signaal, aantal, minAfstand);

  let centra;
  if (pieken.length === aantal) {
    centra = pieken.sort((a, b) => a - b).map((i) => (i + 0.5) * stapgrootte);
  } else {
    // terugvalpositie: gelijk verdelen over het kader
    centra = Array.from({ length: aantal }, (_, i) => ((i + 0.5) * lengte) / aantal);
  }
  const breedte = Math.min(dikte * 0.6, lengte / aantal * 0.55);
  return { as, centra, breedte, wit, gevonden: pieken.length === aantal, signaal };
}

function gladstrijken(arr, straal) {
  if (straal < 1) return arr.slice();
  return arr.map((_, i) => {
    let som = 0, n = 0;
    for (let j = i - straal; j <= i + straal; j++) {
      if (j < 0 || j >= arr.length) continue;
      som += arr[j]; n++;
    }
    return som / n;
  });
}

function zoekPieken(signaal, aantal, minAfstand) {
  const kandidaten = signaal
    .map((v, i) => ({ v, i }))
    .sort((a, b) => b.v - a.v);
  const gekozen = [];
  for (const k of kandidaten) {
    if (gekozen.length >= aantal) break;
    if (gekozen.some((g) => Math.abs(g - k.i) < minAfstand)) continue;
    gekozen.push(k.i);
  }
  return gekozen;
}

/* --------------------------------------------------------------- kleurvergelijking */

/**
 * Vergelijkt een gemeten kleur met de kleurenkaart van een parameter.
 * Interpoleert tussen twee naburige stalen zodat je ook tussenwaarden krijgt.
 */
export function matchWaarde(rgb, schaal) {
  if (!schaal?.length) return null;
  const lab = rgbToLab(rgb);
  const stalen = schaal.map((s) => ({ waarde: s.value, lab: rgbToLab(s.rgb || hexToRgb(s.hex)) }));

  let dichtste = null;
  stalen.forEach((s) => {
    const d = deltaE2000(lab, s.lab);
    if (!dichtste || d < dichtste.d) dichtste = { d, waarde: s.waarde };
  });

  let beste = null;
  for (let i = 0; i < stalen.length - 1; i++) {
    const a = stalen[i], b = stalen[i + 1];
    const ab = { L: b.lab.L - a.lab.L, a: b.lab.a - a.lab.a, b: b.lab.b - a.lab.b };
    const ap = { L: lab.L - a.lab.L, a: lab.a - a.lab.a, b: lab.b - a.lab.b };
    const nn = ab.L * ab.L + ab.a * ab.a + ab.b * ab.b;
    const t = nn === 0 ? 0 : Math.max(0, Math.min(1, (ap.L * ab.L + ap.a * ab.a + ap.b * ab.b) / nn));
    const punt = { L: a.lab.L + ab.L * t, a: a.lab.a + ab.a * t, b: a.lab.b + ab.b * t };
    const d = deltaE2000(lab, punt);
    if (!beste || d < beste.d) beste = { d, waarde: a.waarde + (b.waarde - a.waarde) * t };
  }

  const afstand = beste ? beste.d : dichtste.d;
  return {
    waarde: dichtste.waarde,                       // dichtstbijzijnde staal van de kaart
    geschat: Math.round((beste?.waarde ?? dichtste.waarde) * 1000) / 1000, // vloeiende schatting
    afstand: Math.round(afstand * 10) / 10,
    betrouwbaarheid: betrouwbaarheid(afstand),
  };
}

/** Vertaalt de kleurafstand naar een leesbare betrouwbaarheid. */
export function betrouwbaarheid(dE) {
  if (dE <= 5) return { niveau: 'hoog', percent: Math.round(100 - dE * 4), tekst: 'Goede kleuroverkomst' };
  if (dE <= 12) return { niveau: 'matig', percent: Math.round(90 - dE * 3), tekst: 'Redelijke overeenkomst — even nakijken' };
  return { niveau: 'laag', percent: Math.max(10, Math.round(70 - dE * 2)), tekst: 'Zwakke overeenkomst — controleer de foto of vul zelf in' };
}

/**
 * Leest een volledige strip.
 * @param {ImageData} imageData
 * @param {{x,y,w,h}} rect uitleeskader
 * @param {string[]} padIds parameters in de volgorde van de veldjes
 * @param {{omgekeerd?:boolean, kalibratie?:object}} opties
 */
export function leesStrip(imageData, rect, padIds, opties = {}) {
  const ids = opties.omgekeerd ? [...padIds].reverse() : padIds;
  const { as, centra, breedte, wit, gevonden } = zoekVeldjes(imageData, rect, ids.length);

  const resultaten = ids.map((paramId, i) => {
    const c = centra[i];
    const x = as === 'y' ? rect.x + rect.w / 2 - breedte / 2 : rect.x + c - breedte / 2;
    const y = as === 'y' ? rect.y + c - breedte / 2 : rect.y + rect.h / 2 - breedte / 2;
    const ruw = mediaanKleur(imageData, x, y, breedte, breedte);
    const gecorrigeerd = whiteBalance(ruw, wit);
    const schaal = opties.kalibratie?.[paramId] || PARAMETERS[paramId]?.scale;
    const match = schaal ? matchWaarde(gecorrigeerd, schaal) : null;
    return {
      param: paramId,
      vak: { x: Math.round(x), y: Math.round(y), w: Math.round(breedte), h: Math.round(breedte) },
      kleur: gecorrigeerd,
      ruweKleur: ruw,
      ...(match || { waarde: null, geschat: null, afstand: null, betrouwbaarheid: betrouwbaarheid(99) }),
      gekalibreerd: !!opties.kalibratie?.[paramId],
    };
  });

  return { resultaten, wit, as, veldjesGevonden: gevonden, rect };
}

/**
 * Leest de kleurenkaart van een verpakking in als eigen ijking.
 * De gebruiker geeft aan hoeveel rijen (parameters) en kolommen (niveaus) er zijn.
 */
export function leesKleurenkaart(imageData, rect, rijen, kolommen) {
  const cellH = rect.h / rijen;
  const cellW = rect.w / kolommen;
  const raster = [];
  for (let r = 0; r < rijen; r++) {
    const rij = [];
    for (let k = 0; k < kolommen; k++) {
      const x = rect.x + k * cellW + cellW * 0.25;
      const y = rect.y + r * cellH + cellH * 0.25;
      rij.push(mediaanKleur(imageData, x, y, cellW * 0.5, cellH * 0.5));
    }
    raster.push(rij);
  }
  return raster;
}
