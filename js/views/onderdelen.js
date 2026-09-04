/** Herbruikbare stukjes interface die in meerdere schermen terugkomen. */
import { h, badge, geleden, datum } from '../ui.js';
import { PARAMETERS, param, statusOf, fmt, STATUS_LABEL, profile } from '../params.js';
import * as store from '../store.js';

/** Tegels met de waarden van één meting, gekleurd volgens de streefwaarden. */
export function waardeTegels(meting, bak, { klikbaar = null } = {}) {
  const waarden = meting?.waarden || {};
  const ids = profile(bak?.profiel).params.filter((id) => waarden[id] != null && waarden[id] !== '');
  if (!ids.length) return h('p', { class: 'zacht klein' }, 'Nog geen waarden ingevuld.');
  return h('div', { class: 'tegels' }, ...ids.map((id) => {
    const v = Number(waarden[id]);
    const st = statusOf(id, v, bak?.profiel);
    const p = param(id);
    const el = h(klikbaar ? 'button' : 'div', {
      class: `tegel tegel--${st}`,
      ...(klikbaar ? { onclick: () => klikbaar(id), type: 'button', style: { textAlign: 'left', font: 'inherit', color: 'inherit', cursor: 'pointer' } } : {}),
    },
      h('div', { class: 'tegel__naam' }, p?.short || id),
      h('div', { class: 'tegel__waarde' }, Number(v).toFixed(p?.decimals ?? 1),
        p?.unit ? h('span', { class: 'tegel__eenheid' }, ' ' + p.unit) : null));
    return el;
  }));
}

/** Eén adviesblok met uitleg, stappen, producten en opvolging. */
export function adviesKaart(actie, { open = false } = {}) {
  const soort = actie.urgentie === 'kritiek' ? 'kritiek' : actie.urgentie === 'let-op' ? 'let-op' : 'info';
  const icoon = soort === 'kritiek' ? '‼️' : soort === 'let-op' ? '⚠️' : '✅';
  return h('details', { class: 'uitklap', open: open || soort === 'kritiek' },
    h('summary', {},
      h('span', {}, icoon),
      h('span', { class: 'groei' }, actie.titel),
      badge(soort === 'kritiek' ? 'Dringend' : soort === 'let-op' ? 'Bijsturen' : 'In orde', soort)),
    h('div', { class: 'uitklap__inhoud' },
      actie.streef ? h('p', { class: 'klein zacht' }, actie.streef) : null,
      actie.waarom ? h('p', {}, actie.waarom) : null,
      actie.stappen?.length ? h('div', {},
        h('h4', {}, 'Wat doe je nu?'),
        ...actie.stappen.map((s, i) => h('div', { class: 'stap' }, h('span', { class: 'stap__nr' }, i + 1), h('span', {}, s)))) : null,
      actie.producten?.length ? h('div', {},
        h('h4', { style: { marginTop: '12px' } }, 'Aanbevolen producten'),
        ...actie.producten.map((p) => h('div', { class: 'kaart kaart--vlak', style: { padding: '11px', marginBottom: '8px' } },
          h('strong', {}, p.naam),
          p.dosis ? h('div', { class: 'badge badge--info', style: { marginLeft: '6px' } }, p.dosis.tekst) : null,
          h('p', { class: 'klein zacht', style: { margin: '6px 0 0' } }, p.omschrijving)))) : null,
      actie.oorzaken?.length ? h('details', { class: 'uitklap', style: { marginTop: '10px' } },
        h('summary', {}, 'Mogelijke oorzaken'),
        h('div', { class: 'uitklap__inhoud' },
          h('ul', { class: 'opsomming' }, ...actie.oorzaken.map((o) => h('li', {}, o))))) : null,
      actie.opvolging?.length ? h('div', {},
        h('h4', { style: { marginTop: '12px' } }, 'Opvolging'),
        h('ul', { class: 'opsomming klein' },
          ...actie.opvolging.map((o) => h('li', {}, h('strong', {}, o.na), ': ', o.actie)))) : null));
}

/** Lijst met openstaande opvolgtaken. */
export function takenLijst(taken, { opWijziging } = {}) {
  if (!taken.length) return h('p', { class: 'zacht klein' }, 'Geen openstaande taken. Goed bezig!');
  return h('ul', { class: 'lijst' }, ...taken.map((t) => {
    const teLaat = !t.klaar && t.vervalt < Date.now();
    return h('li', {},
      h('input', {
        type: 'checkbox', checked: t.klaar, 'aria-label': 'Taak afvinken',
        style: { width: '22px', height: '22px', marginTop: '2px', flex: 'none' },
        onchange: async (e) => { await store.zetTaakKlaar(t.id, e.target.checked); opWijziging?.(); },
      }),
      h('span', { class: 'groei', style: t.klaar ? { opacity: .5, textDecoration: 'line-through' } : {} },
        t.omschrijving,
        h('br'),
        h('span', { class: 'mini zacht' },
          t.product ? `${t.product} · ` : '',
          teLaat ? '⏰ te laat — ' : '', `${t.termijn} (${datum(t.vervalt, false)})`)));
  }));
}

/** Kleine samenvatting van een bak, voor lijsten bij Lux Aqua. */
export function bakSamenvatting(bak, meting, advies) {
  const soort = !advies ? '' : advies.score >= 80 ? 'goed' : advies.score >= 50 ? 'let-op' : 'kritiek';
  return h('div', {},
    h('div', { class: 'rij rij--tussen' },
      h('strong', {}, bak.naam || 'Aquarium'),
      advies ? badge(`${advies.score}/100`, soort) : badge('Geen meting')),
    h('div', { class: 'mini zacht' },
      `${profile(bak.profiel).label} · ${bak.liters || '?'} l`,
      meting ? ` · laatste meting ${geleden(meting.datum)}` : ' · nog niet gemeten'));
}

/** Uitleg over een parameter (wordt getoond bij het invullen en in de historiek). */
export function parameterUitleg(id) {
  const p = PARAMETERS[id];
  if (!p) return null;
  return h('div', {},
    h('p', {}, p.info),
    p.causes?.length ? h('div', {},
      h('h4', {}, 'Wat duwt deze waarde de verkeerde kant op?'),
      h('ul', { class: 'opsomming klein' }, ...p.causes.map((c) => h('li', {}, c)))) : null,
    p.scale?.length ? h('div', {},
      h('h4', { style: { marginTop: '10px' } }, 'Kleurenschaal op de teststrip'),
      h('div', { class: 'schaalbalk' }, ...p.scale.map((s) => h('span', { style: { background: s.hex } }))),
      h('div', { class: 'rij rij--tussen mini zacht' },
        h('span', {}, fmt(id, p.scale[0].value)),
        h('span', {}, fmt(id, p.scale[p.scale.length - 1].value)))) : null);
}

export function statusBadge(paramId, waarde, profielId) {
  const st = statusOf(paramId, waarde, profielId);
  return badge(STATUS_LABEL[st], st === 'onbekend' ? '' : st);
}
