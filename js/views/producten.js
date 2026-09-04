/** Productcatalogus met omschrijving, dosering voor jouw bak en opvolging. */
import { h, kaart, badge, invoer, veld, dialoog, melding, kopieer } from '../ui.js';
import { ctx } from '../app.js';
import * as store from '../store.js';
import { CATEGORIEEN, berekenDosis } from '../products.js';
import { PARAMETERS, param, profile } from '../params.js';

export async function toonProducten() {
  const catalogus = await store.catalogus();
  const bak = ctx.bak;
  const liters = Number(bak?.liters) || 0;

  const wrap = h('div', {});
  const lijstHouder = h('div', {});
  let zoek = '';
  let categorie = 'alles';
  let enkelVoorMijnBak = !!bak;

  const zoekveld = invoer({ type: 'search', placeholder: 'Zoek een product of een waarde (bv. nitriet)', oninput: (e) => { zoek = e.target.value.toLowerCase(); tekenLijst(); } });

  const chips = h('div', { class: 'tabbalk' },
    ...[{ id: 'alles', label: 'Alles' }, ...CATEGORIEEN].map((c) =>
      h('button', {
        class: `chip ${c.id === categorie ? 'is-actief' : ''}`,
        onclick: (e) => {
          categorie = c.id;
          [...chips.children].forEach((k) => k.classList.remove('is-actief'));
          e.currentTarget.classList.add('is-actief');
          tekenLijst();
        },
      }, c.label)));

  const filterKnop = bak ? h('label', { class: 'rij klein', style: { gap: '8px', margin: '4px 0 10px' } },
    h('input', {
      type: 'checkbox', checked: enkelVoorMijnBak,
      onchange: (e) => { enkelVoorMijnBak = e.target.checked; tekenLijst(); },
    }),
    h('span', {}, `Alleen tonen wat past bij ${profile(bak.profiel).label.toLowerCase()}`)) : null;

  function tekenLijst() {
    const lijst = catalogus.filter((p) => {
      if (categorie !== 'alles' && p.categorie !== categorie) return false;
      if (enkelVoorMijnBak && bak && p.profielen && !p.profielen.includes(bak.profiel)) return false;
      if (!zoek) return true;
      const params = (p.lost_op || []).map((id) => `${PARAMETERS[id]?.label} ${PARAMETERS[id]?.short}`).join(' ');
      return `${p.naam} ${p.omschrijving} ${params}`.toLowerCase().includes(zoek);
    });
    lijstHouder.replaceChildren(
      ...(lijst.length ? lijst.map((p) => productRij(p, liters)) : [h('p', { class: 'zacht klein' }, 'Geen product gevonden. Probeer een andere zoekterm of zet de filter af.')]));
  }

  function productRij(p, liters) {
    const dosis = berekenDosis(p, liters);
    return h('button', { class: 'klikbaar', onclick: () => toonProduct(p, liters, bak) },
      h('span', { style: { fontSize: '22px' } }, icoonVoor(p.categorie)),
      h('span', { class: 'groei' },
        h('strong', {}, p.naam), h('br'),
        h('span', { class: 'mini zacht' },
          (p.lost_op || []).map((id) => param(id)?.short || id).join(' · ') || CATEGORIEEN.find((c) => c.id === p.categorie)?.label),
        dosis ? h('span', { class: 'badge badge--info', style: { marginLeft: '6px' } }, dosis.tekst) : null),
      h('span', { class: 'pijl' }, '›'));
  }

  wrap.append(kaart('🧴 Producten van Lux Aqua',
    h('p', { class: 'klein zacht' },
      liters
        ? `De doseringen worden meteen berekend voor ${liters} liter — de inhoud van ${bak.naam || 'je bak'}.`
        : 'Vul de inhoud van je bak in om de doseringen automatisch te laten berekenen.'),
    veld('Zoeken', zoekveld), chips, filterKnop, lijstHouder));

  tekenLijst();
  return wrap;
}

const icoonVoor = (cat) => ({
  waterbereiding: '💧', buffer: '⚖️', noodhulp: '🚑', voeding: '🌿',
  algen: '🟢', filter: '🧽', zeewater: '🌊', vijver: '🪷', zorg: '❤️',
}[cat] || '🧴');

export async function toonProduct(p, liters, bak) {
  const doseerVeld = invoer({ type: 'number', inputmode: 'decimal', value: liters || '', min: 1 });
  const deltaVeld = p.dosering?.model === 'delta'
    ? invoer({ type: 'number', inputmode: 'decimal', step: 0.1, value: p.dosering.effect })
    : null;
  const uitkomst = h('div', { class: 'kaart kaart--vlak', style: { marginTop: '8px' } });

  const herbereken = () => {
    const l = Number(doseerVeld.value) || 0;
    const d = deltaVeld ? Number(deltaVeld.value) : undefined;
    const r = berekenDosis(p, l, d);
    uitkomst.replaceChildren(
      h('div', { class: 'rij rij--tussen' },
        h('span', { class: 'zacht klein' }, 'Jouw dosering'),
        h('strong', { style: { fontSize: '1.3rem' } }, r ? `${r.hoeveelheid} ${r.eenheid}` : '–')),
      h('p', { class: 'mini zacht', style: { margin: '4px 0 0' } }, p.dosering?.omschrijving || ''));
  };
  [doseerVeld, deltaVeld].filter(Boolean).forEach((v) => v.addEventListener('input', herbereken));
  herbereken();

  await dialoog({
    titel: p.naam, breed: true,
    inhoud: h('div', {},
      h('div', { class: 'chips', style: { marginBottom: '10px' } },
        badge(CATEGORIEEN.find((c) => c.id === p.categorie)?.label || p.categorie, 'info'),
        ...(p.lost_op || []).map((id) => badge(param(id)?.short || id))),
      h('p', {}, p.omschrijving),
      p.verpakkingen?.length ? h('p', { class: 'mini zacht' }, `Verkrijgbaar in: ${p.verpakkingen.join(', ')}`) : null,

      h('h4', {}, 'Dosering berekenen'),
      veld('Inhoud van je bak (liter)', doseerVeld),
      deltaVeld ? veld(`Gewenste verschuiving (${param(p.dosering.param)?.unit || ''})`, deltaVeld,
        `Standaard geeft ${p.dosering.hoeveelheid} ${p.dosering.eenheid} per ${p.dosering.per} l een verschuiving van ${p.dosering.effect}.`) : null,
      uitkomst,
      p.dubbele_dosis ? h('p', { class: 'klein zacht' }, p.dubbele_dosis) : null,

      h('h4', { style: { marginTop: '14px' } }, 'Hoe toepassen?'),
      h('p', {}, p.toepassing),

      p.opvolging?.length ? h('div', {},
        h('h4', {}, 'Opvolging'),
        h('ul', { class: 'opsomming klein' }, ...p.opvolging.map((o) => h('li', {}, h('strong', {}, o.na), ': ', o.actie)))) : null,

      p.waarschuwingen?.length ? h('div', { class: 'kaart kaart--kritiek', style: { marginTop: '10px' } },
        h('h4', {}, '⚠️ Let op'),
        h('ul', { class: 'opsomming klein' }, ...p.waarschuwingen.map((w) => h('li', {}, w)))) : null),
    acties: [
      {
        label: '📋 Dosering kopiëren', actie: async () => {
          const r = berekenDosis(p, Number(doseerVeld.value) || 0, deltaVeld ? Number(deltaVeld.value) : undefined);
          await kopieer(`${p.naam}: ${r ? r.tekst : p.dosering?.omschrijving}`);
          return false;
        },
      },
      {
        label: '📓 In logboek zetten', stijl: 'knop--primair', actie: async () => {
          if (!bak) { melding('Geen bak geselecteerd.', 'fout'); return false; }
          const r = berekenDosis(p, Number(doseerVeld.value) || 0, deltaVeld ? Number(deltaVeld.value) : undefined);
          await store.logboek(bak.id, `${p.naam} gedoseerd${r ? ` — ${r.hoeveelheid} ${r.eenheid}` : ''}`, 'product');
          const taken = (p.opvolging || []).map((o, i) => ({
            id: `taak-${p.id}-${i}-${Date.now()}`, omschrijving: o.actie, termijn: o.na, product: p.naam,
            vervalt: Date.now() + termijnMs(o.na), klaar: false,
          }));
          if (taken.length) await store.bewaarTaken(bak.id, taken);
          melding('Genoteerd, met de opvolging erbij.', 'ok');
          return true;
        },
      },
    ],
  });
}

const termijnMs = (t) => {
  const s = String(t).toLowerCase();
  const m = s.match(/(\d+)\s*(uur|dag|dagen|week|weken|maand|maanden)/);
  if (!m) return 86400e3;
  const n = Number(m[1]);
  if (m[2].startsWith('uur')) return n * 3600e3;
  if (m[2].startsWith('dag')) return n * 86400e3;
  if (m[2].startsWith('week')) return n * 7 * 86400e3;
  return n * 30 * 86400e3;
};
