/** Aanmeldscherm voor de beheerderskant van LUX AQUA. */
import { h, kaart, veld, invoer, melding } from '../ui.js';
import { ganaar, teken, logoElement } from '../app.js';
import { meldAan, kanAanmelden, beheerderEmail } from '../auth.js';

export async function toonAanmelden() {
  const emailveld = invoer({
    type: 'email', autocomplete: 'username', inputmode: 'email',
    placeholder: 'uw e-mailadres', value: await beheerderEmail(),
  });
  const wwveld = invoer({ type: 'password', autocomplete: 'current-password', placeholder: 'uw wachtwoord' });
  const fout = h('p', { class: 'klein', style: { color: 'var(--kritiek)', minHeight: '1.2em' } }, '');

  const proberen = async (knop) => {
    knop.disabled = true;
    const r = await meldAan(emailveld.value, wwveld.value);
    knop.disabled = false;
    if (!r.ok) { fout.textContent = r.reden; wwveld.value = ''; wwveld.focus(); return; }
    melding(r.reden, 'ok');
    ganaar('klanten');
    teken();
  };

  const knop = h('button', { class: 'knop knop--primair knop--groot knop--vol', type: 'submit' }, 'Aanmelden');

  const formulier = h('form', {
    onsubmit: (e) => { e.preventDefault(); proberen(knop); },
  },
    veld('E-mailadres', emailveld),
    veld('Wachtwoord', wwveld),
    fout,
    knop);

  const wrap = h('div', { class: 'aanmelden' },
    h('div', { class: 'midden', style: { marginBottom: '18px' } },
      logoElement(null, 'logo-groot', 'navy')),
    kaart('Aanmelden als LUX AQUA',
      h('p', { class: 'klein zacht' },
        'Dit scherm is voor de verantwoordelijke van LUX AQUA. Klanten hebben het niet nodig: ' +
        'de app werkt zonder aanmelding.'),
      formulier,
      !kanAanmelden()
        ? h('p', { class: 'klein', style: { color: 'var(--kritiek)' } },
          'Aanmelden lukt enkel op een beveiligde verbinding. Open de app via het https-adres.')
        : null),
    h('button', { class: 'knop knop--stil knop--vol', onclick: () => { ganaar('start'); } }, 'Terug naar de app'));

  requestAnimationFrame(() => wwveld.focus());
  return wrap;
}
