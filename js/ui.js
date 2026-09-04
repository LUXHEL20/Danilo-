/** Kleine UI-hulpjes: elementen bouwen, dialogen, meldingen, datums. */

export function h(tag, props = {}, ...kinderen) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'dataset') Object.assign(el.dataset, v);
    else if (k in el && k !== 'list' && typeof v !== 'object') el[k] = v;
    else el.setAttribute(k, v);
  }
  voegToe(el, kinderen);
  return el;
}

function voegToe(el, kinderen) {
  for (const kind of kinderen.flat(4)) {
    if (kind == null || kind === false) continue;
    el.append(kind instanceof Node ? kind : document.createTextNode(String(kind)));
  }
}

export const leeg = (el) => { while (el.firstChild) el.removeChild(el.firstChild); return el; };

/* ------------------------------------------------------------------ meldingen */
export function melding(tekst, soort = 'info', duur = 3800) {
  const houder = document.getElementById('meldingen') || document.body;
  const el = h('div', { class: `melding melding--${soort}`, role: 'status' }, tekst);
  houder.append(el);
  requestAnimationFrame(() => el.classList.add('is-zichtbaar'));
  setTimeout(() => { el.classList.remove('is-zichtbaar'); setTimeout(() => el.remove(), 300); }, duur);
}

/* --------------------------------------------------------------------- dialoog */
export function dialoog({ titel, inhoud, acties = [], breed = false }) {
  return new Promise((resolve) => {
    const sluit = (waarde) => { overlay.remove(); document.body.classList.remove('geen-scroll'); resolve(waarde); };
    const knoppen = acties.map((a) =>
      h('button', {
        class: `knop ${a.stijl || 'knop--stil'}`,
        type: 'button',
        onclick: async () => { const r = a.actie ? await a.actie() : a.waarde; if (r !== false) sluit(r ?? a.waarde); },
      }, a.label));
    const paneel = h('div', { class: `dialoog${breed ? ' dialoog--breed' : ''}`, role: 'dialog', 'aria-modal': 'true' },
      h('header', { class: 'dialoog__kop' },
        h('h2', {}, titel),
        h('button', { class: 'icoonknop', type: 'button', 'aria-label': 'Sluiten', onclick: () => sluit(null) }, '✕')),
      h('div', { class: 'dialoog__inhoud' }, inhoud),
      knoppen.length ? h('footer', { class: 'dialoog__voet' }, knoppen) : null);
    const overlay = h('div', { class: 'overlay', onclick: (e) => { if (e.target === overlay) sluit(null); } }, paneel);
    document.body.append(overlay);
    document.body.classList.add('geen-scroll');
    requestAnimationFrame(() => overlay.classList.add('is-zichtbaar'));
  });
}

export const bevestig = (titel, tekst, bevestigLabel = 'Ja, doorgaan') =>
  dialoog({
    titel, inhoud: h('p', {}, tekst),
    acties: [{ label: 'Annuleren', waarde: false }, { label: bevestigLabel, stijl: 'knop--gevaar', waarde: true }],
  });

/* ----------------------------------------------------------------------- datum */
const dagen = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];
const maanden = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];

export function datum(ts, metTijd = true) {
  if (!ts) return '–';
  const d = new Date(ts);
  const t = metTijd ? ` om ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}` : '';
  return `${d.getDate()} ${maanden[d.getMonth()]} ${d.getFullYear()}${t}`;
}

export function kortDatum(ts) {
  const d = new Date(ts);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

export function geleden(ts) {
  if (!ts) return '–';
  const s = (Date.now() - ts) / 1000;
  if (s < 60) return 'net';
  if (s < 3600) return `${Math.floor(s / 60)} min geleden`;
  if (s < 86400) return `${Math.floor(s / 3600)} u geleden`;
  const d = Math.floor(s / 86400);
  if (d === 1) return 'gisteren';
  if (d < 14) return `${d} dagen geleden`;
  if (d < 60) return `${Math.floor(d / 7)} weken geleden`;
  return `${Math.floor(d / 30)} maanden geleden`;
}

export const dagNaam = (ts) => dagen[new Date(ts).getDay()];

/* ------------------------------------------------------------------ formulieren */
export function veld(label, invoer, hint) {
  return h('label', { class: 'veld' },
    h('span', { class: 'veld__label' }, label),
    invoer,
    hint ? h('span', { class: 'veld__hint' }, hint) : null);
}

export function invoer(props = {}) { return h('input', { class: 'invoer', ...props }); }
export function tekstvak(props = {}) { return h('textarea', { class: 'invoer invoer--tekst', rows: 3, ...props }); }

export function keuze(opties, props = {}) {
  return h('select', { class: 'invoer', ...props },
    ...opties.map((o) => h('option', { value: o.value, selected: o.selected }, o.label)));
}

export const knop = (label, props = {}) => h('button', { class: `knop ${props.stijl || 'knop--primair'}`, type: 'button', ...props }, label);

/* ------------------------------------------------------------------- diversen */
export const badge = (tekst, soort = '') => h('span', { class: `badge ${soort ? 'badge--' + soort : ''}` }, tekst);

export function kaart(titel, ...inhoud) {
  return h('section', { class: 'kaart' }, titel ? h('h3', { class: 'kaart__titel' }, titel) : null, ...inhoud);
}

export function legeStaat(icoon, titel, tekst, actie) {
  return h('div', { class: 'leeg' }, h('div', { class: 'leeg__icoon' }, icoon), h('h3', {}, titel), h('p', {}, tekst), actie || null);
}

export function laadKnop(el, bezig, label = 'Bezig…') {
  el.disabled = bezig;
  if (bezig) { el.dataset.origineel = el.textContent; el.textContent = label; }
  else if (el.dataset.origineel) el.textContent = el.dataset.origineel;
}

export const blobNaarDataUrl = (blob) => new Promise((res, rej) => {
  const r = new FileReader();
  r.onload = () => res(r.result);
  r.onerror = rej;
  r.readAsDataURL(blob);
});

export async function dataUrlNaarBlob(dataUrl) {
  const r = await fetch(dataUrl);
  return r.blob();
}

export function download(bestandsnaam, inhoud, type = 'application/json') {
  const blob = inhoud instanceof Blob ? inhoud : new Blob([inhoud], { type });
  const url = URL.createObjectURL(blob);
  const a = h('a', { href: url, download: bestandsnaam });
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export async function kopieer(tekst) {
  try {
    await navigator.clipboard.writeText(tekst);
    melding('Gekopieerd naar het klembord.', 'ok');
  } catch {
    const ta = h('textarea', { value: tekst, style: { position: 'fixed', opacity: '0' } });
    document.body.append(ta); ta.select();
    document.execCommand('copy'); ta.remove();
    melding('Gekopieerd.', 'ok');
  }
}
