/** Productcatalogus met omschrijving, dosering voor uw bak en opvolging. */
import { h, kaart, badge, invoer, veld, dialoog, melding, kopieer } from '../ui.js';
import { ctx } from '../app.js';
import * as store from '../store.js';
import { CATEGORIEEN, berekenDosis, alleDoseringen, VERS_DEEL } from '../products.js';
import { PARAMETERS, param, profile } from '../params.js';

export async function toonProducten() {
  const catalogus = await store.catalogus();
  const bak = ctx.bak;
  const liters = Number(bak?.liters) || 0;
  const isLux = ctx.instellingen?.rol === 'luxaqua';

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
    const [dosis] = alleDoseringen(p, liters);
    return h('button', { class: 'klikbaar', onclick: () => toonProduct(p, liters, bak) },
      h('span', { style: { fontSize: '22px' } }, icoonVoor(p.categorie)),
      h('span', { class: 'groei' },
        h('strong', {}, p.naam), h('br'),
        h('span', { class: 'mini zacht' },
          (p.lost_op || []).map((id) => param(id)?.short || id).join(' · ') || CATEGORIEEN.find((c) => c.id === p.categorie)?.label),
        dosis ? h('span', { class: 'badge badge--info', style: { marginLeft: '6px' } }, dosis.tekst) : null),
      h('span', { class: 'pijl' }, '›'));
  }

  wrap.append(kaart('🧴 Producten',
    h('p', { class: 'klein zacht' },
      'Wij werken met de producten van Colombo. De doseringen hieronder komen van het etiket.'),
    h('p', { class: 'klein zacht' },
      liters
        ? `Zij worden meteen berekend voor ${liters} liter, de inhoud van ${bak.naam || 'uw bak'}.`
        : 'Vul de inhoud van uw bak in om de doseringen automatisch te laten berekenen.'),
    veld('Zoeken', zoekveld), chips, filterKnop, lijstHouder,
    // enkel voor LUX AQUA zelf: de klant hoeft dit niet te lezen
    isLux ? h('p', { class: 'mini zacht', style: { marginTop: '10px' } },
      'De doseringen komen van de etiketten van uw eigen assortiment. Kijk in Beheer, Producten, ' +
      'welke adviezen nog zonder product staan.') : null));

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

  /* Doseert dit product (deels) op vers water, dan is de inhoud van de bak niet
     het juiste getal. De klant vult hier in hoeveel liter hij ververst; de app
     begint bij 30 procent, wat een gewone wekelijkse verversing is. */
  const opVersWater = [p.dosering, ...(p.extraDoseringen || [])].some((d) => d?.basis === 'versWater');
  const versVeld = opVersWater
    ? invoer({ type: 'number', inputmode: 'decimal', min: 1, value: Math.round((liters || 0) * VERS_DEEL) || '' })
    : null;

  const uitkomst = h('div', {});

  const herbereken = () => {
    const l = Number(doseerVeld.value) || 0;
    const d = deltaVeld ? Number(deltaVeld.value) : undefined;
    const versLiters = versVeld ? (Number(versVeld.value) || undefined) : undefined;
    const rijen = alleDoseringen(p, l, d, { versLiters });
    uitkomst.replaceChildren(...(rijen.length
      ? rijen.map((r) => h('div', { class: 'kaart kaart--vlak', style: { marginTop: '8px' } },
        h('div', { class: 'rij rij--tussen' },
          h('span', { class: 'zacht klein' }, r.label),
          h('strong', { style: { fontSize: '1.3rem' } }, `${r.hoeveelheid} ${r.eenheid}`)),
        h('p', { class: 'mini zacht', style: { margin: '4px 0 0' } },
          `${r.omschrijving}${r.omschrijving ? ' · ' : ''}berekend voor ${r.basis === 'versWater' ? `${r.liters} liter vers water` : `${r.liters} liter bakinhoud`}`)))
      : [h('p', { class: 'klein zacht' }, 'Voor dit product staat er nog geen dosering in de app.')]));
  };
  [doseerVeld, deltaVeld, versVeld].filter(Boolean).forEach((v) => v.addEventListener('input', herbereken));
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
      veld('Inhoud van uw bak (liter)', doseerVeld),
      versVeld ? veld('Hoeveel liter ververst u? (liter vers water)', versVeld,
        'Dit middel doseert u op het verse water, niet op de volledige bak. Standaard rekent de app met 30 procent.') : null,
      deltaVeld ? veld(`Gewenste verschuiving (${param(p.dosering.param)?.unit || ''})`, deltaVeld,
        `Standaard geeft ${p.dosering.hoeveelheid} ${p.dosering.eenheid} per ${p.dosering.per} liter een verschuiving van ${p.dosering.effect}.`) : null,
      uitkomst,
      p.dubbele_dosis ? h('p', { class: 'klein zacht' }, p.dubbele_dosis) : null,
      p.routine ? h('p', { class: 'klein zacht' },
        `Terugkerend: ${p.routine.tekst.toLowerCase()}, om de ${p.routine.elke} dagen.`) : null,

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
          const rijen = alleDoseringen(p, Number(doseerVeld.value) || 0,
            deltaVeld ? Number(deltaVeld.value) : undefined,
            { versLiters: versVeld ? (Number(versVeld.value) || undefined) : undefined });
          await kopieer(rijen.length
            ? `${p.naam}\n${rijen.map((r) => `${r.label}: ${r.hoeveelheid} ${r.eenheid}`).join('\n')}`
            : `${p.naam}: nog geen dosering ingevuld`);
          return false;
        },
      },
      {
        label: '📓 In logboek zetten', stijl: 'knop--primair', actie: async () => {
          if (!bak) { melding('Geen bak geselecteerd.', 'fout'); return false; }
          const [r] = alleDoseringen(p, Number(doseerVeld.value) || 0,
            deltaVeld ? Number(deltaVeld.value) : undefined,
            { versLiters: versVeld ? (Number(versVeld.value) || undefined) : undefined });
          await store.logboek(bak.id, `${p.naam} gedoseerd${r ? `: ${r.hoeveelheid} ${r.eenheid}` : ''}`, 'product');
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
