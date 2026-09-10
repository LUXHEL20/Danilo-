/** Kennisbank: de uitleg die klanten het vaakst nodig hebben, in gewone taal. */
import { h, kaart, invoer, veld, dialoog, badge } from '../ui.js';

export const ARTIKELS = [
  {
    id: 'indraaien', icoon: '🌱', categorie: 'Basis', titel: 'Een nieuwe bak indraaien',
    kort: 'Waarom u 4 tot 6 weken geduld nodig hebt vóór er vissen in mogen.',
    inhoud: [
      { p: 'In een nieuwe bak zitten nog geen filterbacteriën. Die bacteriën zetten het gif dat vissen produceren om in een onschadelijke vorm. Zolang ze er niet zijn, vergiftigt uw bak zichzelf. Dat is de reden waarom een nieuwe bak niet meteen vol vissen mag.' },
      { h: 'De stikstofkringloop in drie stappen' },
      { ol: [
        'Vissen, voer en plantenresten geven ammonium (NH₄) af. Bij een hoge pH wordt dat ammoniak (NH₃) en dat is zeer giftig.',
        'Een eerste groep bacteriën zet ammonium om in nitriet (NO₂). Ook giftig: het blokkeert de zuurstofopname in het bloed.',
        'Een tweede groep zet nitriet om in nitraat (NO₃). Dat is veel minder giftig; u haalt het weg met waterverversingen en planten.',
      ] },
      { h: 'Hoe pakt u het aan?' },
      { ul: [
        'Vul de bak, zet filter en verwarming aan en laat alles draaien.',
        'Doseer filterbacteriën (een filterstarter) en herhaal na een week.',
        'Meet om de 2 à 3 dagen NO₂ en NH₄ en noteer alles in de app.',
        'Zet pas de eerste vissen bij als NO₂ én NH₄ twee metingen na elkaar 0 zijn.',
        'Zet daarna telkens een kleine groep bij, met minstens twee weken ertussen.',
      ] },
      { let: 'Spoel uw filter nooit uit onder de kraan: chloor doodt precies de bacteriën waar u weken op gewacht hebt. Spoel filtermateriaal uit in een emmer aquariumwater.' },
    ],
  },
  {
    id: 'verversen', icoon: '🚿', categorie: 'Basis', titel: 'Water verversen zoals het hoort',
    kort: 'Een goedkope en krachtige ingreep die veel problemen voorkomt.',
    inhoud: [
      { p: 'Een waterverversing verlaagt nitraat en fosfaat, vult mineralen aan en voert afvalstoffen af die u niet kan meten. Wekelijks 20 tot 30% is voor de meeste bakken de gouden regel.' },
      { h: 'Werkwijze' },
      { ol: [
        'Zuig met een bodemhevel het vuil uit de bodem terwijl u water aftapt.',
        'Zet het verse water op dezelfde temperatuur (max. 1 °C verschil).',
        'Voeg waterbereider toe vóór het water in de bak gaat.',
        'Vul rustig bij, zodat u de bodem niet omwoelt.',
        'Meet een dag later opnieuw en noteer het.',
      ] },
      { let: 'Grote wissels (meer dan 50%) in één keer zijn alleen voor noodgevallen. Ze geven een schok in pH, hardheid en temperatuur.' },
    ],
  },
  {
    id: 'voederen', icoon: '🍤', categorie: 'Basis', titel: 'Voederen: minder is meer',
    kort: 'Overvoederen is een heel vaak voorkomende oorzaak van slechte waarden.',
    inhoud: [
      { p: 'Alles wat uw vissen niet opeten, rot in uw bak en komt terug als ammonium, nitraat en fosfaat. Dat is meteen ook de motor achter de meeste algenproblemen.' },
      { ul: [
        'Voeder één tot twee keer per dag, en enkel wat binnen twee minuten op is.',
        'Hou één vastendag per week aan voor gezonde volwassen vissen.',
        'Wissel af: vlokken, granulaat, diepvries, groente voor plantenetende soorten.',
        'Bewaar voeder droog en koop kleine verpakkingen: vitaminen gaan snel achteruit.',
        'Gaat u op reis, gebruik dan liever een automatische voederbak dan een voedertablet.',
      ] },
    ],
  },
  {
    id: 'algen', icoon: '🟢', categorie: 'Problemen', titel: 'Algen herkennen en aanpakken',
    kort: 'Welke alg u hebt, zegt veel over wat er scheelt.',
    inhoud: [
      { p: 'Algen zijn een symptoom, geen ziekte. Ze verschijnen wanneer licht, voedingsstoffen en CO₂ uit balans zijn. Pak eerst de oorzaak aan, gebruik een algenmiddel pas daarna.' },
      { h: 'Wie is de dader?' },
      { ul: [
        'Bruine aanslag (kiezelalgen): typisch in een jonge bak of bij weinig licht. Verdwijnt meestal vanzelf.',
        'Draadalgen: te veel licht en te veel voedingsstoffen. Draai ze weg met een tandenborstel en beperk de lichtduur.',
        'Baardalg (donkere pluimpjes op bladranden): wijst op schommelende CO₂ en veel organisch afval.',
        'Groen water (zweefalgen): vaak na een grote schoonmaak of bij zon op de bak. Een UV-C lamp helpt hier goed.',
        'Blauwalg (slijmerige laag, muffe geur): eigenlijk een bacterie. Duidt op weinig stroming en veel afval: verwijderen en de stroming verbeteren.',
      ] },
      { h: 'De aanpak in vijf stappen' },
      { ol: [
        'Meet NO₃ en PO₄ en breng ze naar beneden met waterverversingen.',
        'Beperk de verlichting tot 8 uur per dag en hou direct zonlicht weg.',
        'Voeder minder en verwijder afgestorven plantendelen.',
        'Zet sterke planten bij: die nemen de voeding weg bij de algen.',
        'Pas dan een algenmiddel gebruiken, met extra beluchting.',
      ] },
    ],
  },
  {
    id: 'filter', icoon: '🧽', categorie: 'Onderhoud', titel: 'Uw filter onderhouden',
    kort: 'Een filter is een levend ding, geen zeef.',
    inhoud: [
      { p: 'Het leeuwendeel van uw biologische capaciteit zit in uw filter. Wie zijn filter te grondig kuist, gooit zijn bacteriën weg en krijgt enkele dagen later een nitrietpiek.' },
      { ul: [
        'Spoel mechanisch materiaal (watten, vlies) uit of vervang het als het echt versleten is.',
        'Spoel biologisch materiaal alleen uit in aquariumwater, en nooit alles tegelijk.',
        'Vervang maximaal de helft van uw biologische media in één beurt.',
        'Controleer maandelijks het debiet: een trage filter is een verstopte filter.',
        'Actieve kool haalt medicatie en kleur weg, maar is na 2 à 4 weken uitgewerkt.',
      ] },
    ],
  },
  {
    id: 'nieuwe-vissen', icoon: '🐟', categorie: 'Vissen', titel: 'Nieuwe vissen bijzetten',
    kort: 'Rustig acclimatiseren voorkomt de meeste problemen.',
    inhoud: [
      { ol: [
        'Laat de zak 20 minuten drijven zodat de temperatuur gelijk wordt.',
        'Voeg over 30 tot 45 minuten telkens een beetje aquariumwater bij de zak.',
        'Schep de vissen over met een netje: het transportwater gaat niet mee in uw bak.',
        'Doe het licht een paar uur uit en voeder de eerste dag niet.',
        'Meet de volgende dagen NO₂ en NH₄: elke nieuwe vis is extra belasting.',
      ] },
      { let: 'Zet nooit veel vissen tegelijk bij. Uw filter heeft telkens één tot twee weken nodig om zich aan te passen aan de extra belasting.' },
    ],
  },
  {
    id: 'ziek', icoon: '🩺', categorie: 'Vissen', titel: 'Een zieke vis herkennen',
    kort: 'Waar u op let, en wat u best fotografeert voor advies.',
    inhoud: [
      { p: 'Bijna elke ziekte begint met slechte waterwaarden of stress. Meet daarom eerst uw water vóór u naar medicatie grijpt.' },
      { ul: [
        'Witte stipjes zo groot als zoutkorrels: witte stip, vaak na een temperatuurschok.',
        'Schuren tegen decoratie, geknepen vinnen: huid- of kieuwparasieten.',
        'Snel ademen aan het oppervlak: zuurstoftekort, of nitriet en ammoniak in het water.',
        'Witte pluizige plekken: schimmel, meestal op een bestaande wonde.',
        'Opgezette buik met opstaande schubben: inwendige infectie, vaak ernstig.',
        'Vinnen die wegrotten: bacteriële infectie door slechte waterkwaliteit.',
      ] },
      { h: 'Wat maakt het advies veel sneller?' },
      { ul: [
        'Een scherpe foto van de vis van opzij, en indien mogelijk van dichtbij.',
        'Een filmpje van het gedrag (ademhaling, zwemgedrag).',
        'Uw laatste waterwaarden en wanneer de klachten begonnen zijn.',
        'Welke dieren er nog in de bak zitten en wat u recent veranderd hebt.',
      ] },
      { let: 'Gebruik nooit zomaar meerdere medicijnen na elkaar. Veel middelen doden ook uw filterbacteriën, waardoor u een tweede probleem krijgt bovenop het eerste.' },
    ],
  },
  {
    id: 'planten', icoon: '🌿', categorie: 'Planten', titel: 'Planten die het goed doen',
    kort: 'Sterke planten zijn een krachtige algenbestrijding.',
    inhoud: [
      { p: 'Planten nemen dezelfde voeding op als algen. Groeien uw planten goed, dan krijgen algen bijna geen kans.' },
      { ul: [
        'Licht: 8 uur per dag is voor de meeste bakken genoeg; liever langer aaneengesloten dan opgesplitst.',
        'Voeding: planten hebben ook nitraat en fosfaat nodig. Helemaal op nul werken is een fout.',
        'IJzer: bleke of doorschijnende jonge blaadjes wijzen op ijzergebrek.',
        'CO₂: de motor van plantengroei; zonder CO₂ houdt u het best bij gemakkelijke soorten.',
        'Snoei regelmatig en haal geel of rottend blad weg.',
      ] },
    ],
  },
  {
    id: 'osmose', icoon: '💧', categorie: 'Water', titel: 'Osmosewater en leidingwater',
    kort: 'Waarom u soms uw water moet verdunnen, en waarom u het daarna moet aanvullen.',
    inhoud: [
      { p: 'Leidingwater verschilt sterk van gemeente tot gemeente. Soms is het heel hard, soms zit er al nitraat of fosfaat in. Meet uw leidingwater één keer en noteer het bij uw bak: het verklaart vaak waarom een waarde blijft terugkomen.' },
      { ul: [
        'Osmosewater is bijna volledig ontdaan van mineralen: het verlaagt GH, KH en nitraat.',
        'Gebruik osmosewater nooit puur: zonder mineralen krijgt u een instabiele pH.',
        'Meng osmosewater met leidingwater, of remineraliseer het met GH-Mineralen en KH-Buffer.',
        'Vul verdamping aan met puur osmosewater: bij verdamping verdwijnt enkel water, geen zouten.',
      ] },
    ],
  },
  {
    id: 'vijver', icoon: '🪷', categorie: 'Vijver', titel: 'De vijver door het jaar',
    kort: 'Wat u per seizoen doet.',
    inhoud: [
      { h: 'Lente (water boven 10 °C)' },
      { ul: ['Filter en pomp weer opstarten en nakijken.', 'Slib verwijderen en slibafbrekende bacteriën doseren.', 'Voorzichtig beginnen voederen met een voer voor lage temperaturen.', 'Waarden meten: na de winter is de KH vaak weggezakt.'] },
      { h: 'Zomer' },
      { ul: ['Let op zuurstof bij warm weer, zeker \'s nachts en bij onweer.', 'Draadalgen wegdraaien en voeding beperken.', 'Verdamping aanvullen en de waarden om de twee weken meten.'] },
      { h: 'Herfst' },
      { ul: ['Bladnet spannen vóór de bladval begint.', 'Slib wegzuigen: dat is de wintervoorraad van uw problemen.', 'Voeder afbouwen onder de 10 °C.'] },
      { h: 'Winter' },
      { ul: ['Stop met voederen onder 8 °C.', 'Hou een gat open in het ijs met een ijsvrijhouder, nooit stukslaan.', 'Beluchting hoger in het water hangen zodat u het warmere diepe water niet mengt.'] },
    ],
  },
  {
    id: 'meten', icoon: '🧪', categorie: 'Basis', titel: 'Hoe en hoe vaak meten?',
    kort: 'Strips voor de opvolging, druppeltests voor de zekerheid.',
    inhoud: [
      { ul: [
        'Nieuwe bak: om de 2 à 3 dagen NO₂ en NH₄, tot beide 0 zijn.',
        'Ingedraaide bak: wekelijks tot tweewekelijks de volledige set.',
        'Meet ook na: nieuwe vissen, een filterbeurt, medicatie, of als er iets mis lijkt.',
        'Meet steeds op hetzelfde moment van de dag: pH en CO₂ schommelen doorheen de dag.',
      ] },
      { h: 'Strips of druppeltests?' },
      { p: 'Teststrips zijn snel en handig om de evolutie op te volgen. Voor een belangrijke beslissing, of wanneer een waarde alarmerend is, bevestigt u best met een druppeltest. De app leest uw strip in en zegt er eerlijk bij hoe zeker de kleuraflezing is.' },
      { let: 'Bewaar strips droog en gesloten, en gebruik ze niet na de vervaldatum: vochtige strips geven verkeerde waarden.' },
    ],
  },
  {
    id: 'vakantie', icoon: '🧳', categorie: 'Basis', titel: 'Op reis vertrekken',
    kort: 'Wat u klaarzet vóór u weggaat.',
    inhoud: [
      { ul: [
        'Ververs 30% water één of twee dagen vóór vertrek en meet alles na.',
        'Maak uw filter niet vlak vóór vertrek schoon.',
        'Zet de verlichting op een timer, iets korter dan gewoonlijk.',
        'Gebruik een automatische voederbak, of laat iemand vooraf afgemeten porties klaarleggen.',
        'Laat uw waarden en het nummer van LUX AQUA achter bij wie komt kijken.',
      ] },
    ],
  },
];

export async function toonKennis() {
  const wrap = h('div', {});
  const lijst = h('div', {});
  let zoek = '';

  const zoekveld = invoer({ type: 'search', placeholder: 'Zoek: algen, nitriet, vakantie…', oninput: (e) => { zoek = e.target.value.toLowerCase(); teken(); } });

  function teken() {
    const gefilterd = ARTIKELS.filter((a) =>
      !zoek || `${a.titel} ${a.kort} ${a.categorie} ${JSON.stringify(a.inhoud)}`.toLowerCase().includes(zoek));
    lijst.replaceChildren(...(gefilterd.length ? gefilterd.map((a) =>
      h('button', { class: 'klikbaar', onclick: () => toonArtikel(a) },
        h('span', { style: { fontSize: '22px' } }, a.icoon),
        h('span', { class: 'groei' }, h('strong', {}, a.titel), h('br'), h('span', { class: 'mini zacht' }, a.kort)),
        h('span', { class: 'pijl' }, '›')))
      : [h('p', { class: 'zacht klein' }, 'Niets gevonden voor die zoekterm.')]));
  }
  teken();

  wrap.append(kaart('📚 Goed om weten',
    h('p', { class: 'klein zacht' }, 'De uitleg waar klanten het vaakst naar vragen, in gewone taal en zonder vakjargon.'),
    veld('Zoeken', zoekveld), lijst));
  return wrap;
}

export function toonArtikel(a) {
  const inhoud = h('div', {}, ...a.inhoud.map((blok) => {
    if (blok.h) return h('h4', { style: { marginTop: '14px' } }, blok.h);
    if (blok.p) return h('p', {}, blok.p);
    if (blok.ul) return h('ul', { class: 'opsomming' }, ...blok.ul.map((t) => h('li', {}, t)));
    if (blok.ol) return h('ol', { class: 'opsomming' }, ...blok.ol.map((t) => h('li', {}, t)));
    if (blok.let) return h('div', { class: 'kaart kaart--aandacht', style: { marginTop: '10px' } }, h('strong', {}, '⚠️ '), blok.let);
    return null;
  }));
  return dialoog({
    titel: `${a.icoon} ${a.titel}`, breed: true,
    inhoud: h('div', {}, badge(a.categorie, 'info'), inhoud),
    acties: [{ label: 'Sluiten', stijl: 'knop--primair', waarde: true }],
  });
}
