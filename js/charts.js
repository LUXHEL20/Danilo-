/** Eenvoudige SVG-grafieken zonder externe libraries. */
import { h } from './ui.js';
import { PARAMETERS, profile } from './params.js';

const NS = 'http://www.w3.org/2000/svg';
const s = (tag, attrs = {}) => {
  const el = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) if (v != null) el.setAttribute(k, v);
  return el;
};

/**
 * Lijngrafiek van één parameter doorheen de tijd, met de streefzone als achtergrond.
 * @param {{datum:number, waarde:number}[]} punten oplopend in tijd
 */
export function lijnGrafiek(punten, paramId, profielId, { breedte = 320, hoogte = 130 } = {}) {
  const svg = s('svg', { viewBox: `0 0 ${breedte} ${hoogte}`, class: 'grafiek', preserveAspectRatio: 'none', role: 'img' });
  if (punten.length === 0) return svg;

  const doel = profile(profielId).targets?.[paramId];
  const waarden = punten.map((p) => p.waarde);
  let min = Math.min(...waarden), max = Math.max(...waarden);
  if (doel) { min = Math.min(min, doel.ideal[0]); max = Math.max(max, doel.ideal[1]); }
  if (max - min < 1e-6) { max = min + 1; min = Math.max(0, min - 1); }
  const marge = (max - min) * 0.15;
  min -= marge; max += marge;

  const pad = { l: 34, r: 8, t: 10, b: 18 };
  const bx = (i) => pad.l + (i / Math.max(1, punten.length - 1)) * (breedte - pad.l - pad.r);
  const by = (v) => hoogte - pad.b - ((v - min) / (max - min)) * (hoogte - pad.t - pad.b);

  if (doel) {
    const y1 = by(doel.ideal[1]), y2 = by(doel.ideal[0]);
    svg.append(s('rect', { x: pad.l, y: Math.min(y1, y2), width: breedte - pad.l - pad.r, height: Math.abs(y2 - y1), class: 'grafiek__zone' }));
  }

  svg.append(s('line', { x1: pad.l, y1: hoogte - pad.b, x2: breedte - pad.r, y2: hoogte - pad.b, class: 'grafiek__as' }));

  const d = punten.map((p, i) => `${i ? 'L' : 'M'}${bx(i).toFixed(1)},${by(p.waarde).toFixed(1)}`).join(' ');
  svg.append(s('path', { d, class: 'grafiek__lijn' }));

  punten.forEach((p, i) => {
    const c = s('circle', { cx: bx(i), cy: by(p.waarde), r: 3.2, class: 'grafiek__punt' });
    c.append(s('title')).textContent = '';
    const t = document.createElementNS(NS, 'title');
    t.textContent = `${new Date(p.datum).toLocaleDateString('nl-BE')}: ${p.waarde}`;
    c.append(t);
    svg.append(c);
  });

  const label = (v, y) => {
    const t = s('text', { x: 4, y: y + 4, class: 'grafiek__label' });
    t.textContent = PARAMETERS[paramId]?.decimals ? v.toFixed(PARAMETERS[paramId].decimals) : Math.round(v);
    svg.append(t);
  };
  label(max - marge, by(max - marge));
  label(min + marge, by(min + marge));
  return svg;
}

/** Kleine trendlijn zonder assen, voor in een lijst. */
export function sparkline(waarden, { breedte = 90, hoogte = 26 } = {}) {
  const svg = s('svg', { viewBox: `0 0 ${breedte} ${hoogte}`, class: 'spark' });
  if (waarden.length < 2) return svg;
  const min = Math.min(...waarden), max = Math.max(...waarden);
  const bereik = max - min || 1;
  const d = waarden.map((v, i) =>
    `${i ? 'L' : 'M'}${((i / (waarden.length - 1)) * breedte).toFixed(1)},${(hoogte - ((v - min) / bereik) * (hoogte - 4) - 2).toFixed(1)}`).join(' ');
  svg.append(s('path', { d, class: 'spark__lijn' }));
  return svg;
}

/** Ring met de gezondheidsscore van een bak. */
export function scoreRing(score, { grootte = 92 } = {}) {
  const straal = 38, omtrek = 2 * Math.PI * straal;
  const kleur = score >= 80 ? 'goed' : score >= 50 ? 'let-op' : 'kritiek';
  const svg = s('svg', { viewBox: '0 0 100 100', width: grootte, height: grootte, class: `ring ring--${kleur}` });
  svg.append(s('circle', { cx: 50, cy: 50, r: straal, class: 'ring__spoor' }));
  svg.append(s('circle', {
    cx: 50, cy: 50, r: straal, class: 'ring__waarde',
    'stroke-dasharray': `${(omtrek * score) / 100} ${omtrek}`, transform: 'rotate(-90 50 50)',
  }));
  const t = s('text', { x: 50, y: 56, class: 'ring__tekst', 'text-anchor': 'middle' });
  t.textContent = String(Math.round(score));
  svg.append(t);
  return h('div', { class: 'ringhouder' }, svg);
}
