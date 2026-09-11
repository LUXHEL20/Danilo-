/**
 * Kweekgegevens van de soorten die hobbykwekers in onze streek het meest houden.
 *
 * Alle getallen zijn richtwaarden uit de courante aquariumliteratuur, geen wetten.
 * Temperatuur, hardheid, leeftijd en conditie van de ouderdieren verschuiven ze
 * makkelijk een paar dagen of tientallen eieren. De app gebruikt ze om data te
 * voorspellen en om te waarschuwen wanneer een legsel afwijkt van wat normaal is;
 * ze vervangen de waarneming van de kweker niet.
 *
 * Velden:
 *   wijze        'levendbarend' | 'eierleggend' | 'garnaal'
 *   draagdagen   levendbarend: van bevruchting tot werpen
 *   uitkomstdagen  eierleggend: van afzetten tot uitkomen
 *   uitzwemdagen   eierleggend: van uitkomen tot vrij zwemmen (dooierzak op)
 *   nest         [laag, hoog] verwacht aantal
 *   temp         [laag, hoog] in graden Celsius voor de kweek
 *   eerstevoer   wat de jongen de eerste dagen krijgen
 *   moeilijk     1 = lukt vanzelf, 2 = vraagt aandacht, 3 = voor de ervaren kweker
 */

export const KWEEKSOORTEN = [
  /* ------------------------------------------------------------ levendbarend */
  {
    id: 'guppy', naam: 'Guppy', latijn: 'Poecilia reticulata', wijze: 'levendbarend',
    draagdagen: 28, nest: [20, 60], temp: [23, 26], moeilijk: 1,
    eerstevoer: 'Fijn poedervoer, na enkele dagen pas ontloken artemia.',
    tip: 'Zet de moeder apart in een ruime baarbak met veel fijnbladige planten en haal haar er na het werpen uit: guppy\'s eten hun eigen jongen.',
  },
  {
    id: 'endler', naam: 'Endlers guppy', latijn: 'Poecilia wingei', wijze: 'levendbarend',
    draagdagen: 24, nest: [5, 25], temp: [24, 28], moeilijk: 1,
    eerstevoer: 'Fijn poedervoer en pas ontloken artemia.',
    tip: 'Houd endlers gescheiden van gewone guppy\'s: zij kruisen moeiteloos en dan is de zuivere stam weg.',
  },
  {
    id: 'platy', naam: 'Platy', latijn: 'Xiphophorus maculatus', wijze: 'levendbarend',
    draagdagen: 28, nest: [20, 50], temp: [22, 26], moeilijk: 1,
    eerstevoer: 'Fijn poedervoer, artemia na een dag of drie.',
    tip: 'Platy\'s jagen minder op hun jongen dan guppy\'s. Met genoeg beplanting overleeft een deel gewoon in de gezelschapsbak.',
  },
  {
    id: 'zwaarddrager', naam: 'Zwaarddrager', latijn: 'Xiphophorus hellerii', wijze: 'levendbarend',
    draagdagen: 28, nest: [20, 80], temp: [22, 26], moeilijk: 1,
    eerstevoer: 'Fijn poedervoer en artemia.',
    tip: 'Een groot nest vraagt ruimte. Zonder opgroeibak krijgt u kleine, bleke dieren die moeilijk te slijten zijn.',
  },
  {
    id: 'molly', naam: 'Molly', latijn: 'Poecilia sphenops', wijze: 'levendbarend',
    draagdagen: 35, nest: [20, 60], temp: [25, 28], moeilijk: 2,
    eerstevoer: 'Fijn poedervoer met een plantaardig aandeel, daarna artemia.',
    tip: 'Molly\'s willen hard water met een hoge KH. In te zacht water gaan ze schuren en kwakkelen, ook zonder dat er iets anders mis is.',
  },

  /* ------------------------------------------------------------ eierleggend */
  {
    id: 'ancistrus', naam: 'Blauwe antennemeerval', latijn: 'Ancistrus sp.', wijze: 'eierleggend',
    uitkomstdagen: 5, uitzwemdagen: 6, nest: [40, 100], temp: [24, 27], moeilijk: 1,
    eerstevoer: 'Groenvoer en zinkende tabletten. De jongen raspen mee vanaf de eerste dag.',
    tip: 'Geef een kweekbuis waar enkel het mannetje in past. Hij bewaakt het legsel en waaiert het schoon; haal hem er niet uit.',
  },
  {
    id: 'corydoras', naam: 'Corydoras', latijn: 'Corydoras aeneus', wijze: 'eierleggend',
    uitkomstdagen: 4, uitzwemdagen: 3, nest: [20, 60], temp: [22, 26], moeilijk: 2,
    eerstevoer: 'Pas ontloken artemia en fijn poedervoer op de bodem.',
    tip: 'Een waterverversing met een paar graden koeler water zet de paai vaak in gang. Haal de eieren van de ruit en leg ze apart, anders eten de ouders ze op.',
  },
  {
    id: 'betta', naam: 'Siamese kempvis', latijn: 'Betta splendens', wijze: 'eierleggend',
    uitkomstdagen: 2, uitzwemdagen: 3, nest: [100, 300], temp: [26, 28], moeilijk: 3,
    eerstevoer: 'Infusoriën of azijnaaltjes de eerste dagen, daarna pas ontloken artemia.',
    tip: 'Het mannetje bouwt een bellennest en bewaakt het. Haal het vrouwtje er meteen na de paring uit, en het mannetje zodra de jongen vrij zwemmen.',
  },
  {
    id: 'scalare', naam: 'Maanvis', latijn: 'Pterophyllum scalare', wijze: 'eierleggend',
    uitkomstdagen: 3, uitzwemdagen: 5, nest: [200, 400], temp: [26, 29], moeilijk: 2,
    eerstevoer: 'Pas ontloken artemia.',
    tip: 'Een jong koppel eet de eerste legsels vaak op. Dat is normaal en gaat over. Wilt u niet wachten, leg het blad met eieren dan in een aparte bak met een luchtsteen.',
  },
  {
    id: 'kribensis', naam: 'Kersenbuikcichlide', latijn: 'Pelvicachromis pulcher', wijze: 'eierleggend',
    uitkomstdagen: 3, uitzwemdagen: 7, nest: [50, 200], temp: [25, 27], moeilijk: 1,
    eerstevoer: 'Pas ontloken artemia en fijn poedervoer.',
    tip: 'Zet een halve bloempot op de kop als kweekhol. De ouders voeden de jongen zelf rond; laat ze samen, dat gaat beter dan apart.',
  },
  {
    id: 'apistogramma', naam: 'Apistogramma', latijn: 'Apistogramma sp.', wijze: 'eierleggend',
    uitkomstdagen: 3, uitzwemdagen: 6, nest: [40, 120], temp: [26, 28], moeilijk: 2,
    eerstevoer: 'Pas ontloken artemia.',
    tip: 'Zacht, zuur water is hier geen luxe maar een voorwaarde. Bij een KH boven 4 komt er vaak niets uit, hoe goed het koppel ook zit.',
  },
  {
    id: 'discus', naam: 'Discus', latijn: 'Symphysodon sp.', wijze: 'eierleggend',
    uitkomstdagen: 3, uitzwemdagen: 4, nest: [100, 300], temp: [28, 30], moeilijk: 3,
    eerstevoer: 'De eerste twee weken eten de jongen het huidslijm van de ouders. Daarna pas ontloken artemia.',
    tip: 'Haal de jongen niet weg bij de ouders: zonder het huidslijm halen ze de eerste weken niet. Dagelijkse waterverversing is hier de regel, niet de uitzondering.',
  },
  {
    id: 'danio', naam: 'Zebravis', latijn: 'Danio rerio', wijze: 'eierleggend',
    uitkomstdagen: 3, uitzwemdagen: 4, nest: [100, 300], temp: [24, 26], moeilijk: 1,
    eerstevoer: 'Infusoriën of vloeibaar jongvoer, na drie dagen artemia.',
    tip: 'Zebravissen zetten af tussen knikkers of een rooster op de bodem en eten daarna alles op wat ze zien. Zonder die scheiding houdt u niets over.',
  },
  {
    id: 'paradijsvis', naam: 'Paradijsvis', latijn: 'Macropodus opercularis', wijze: 'eierleggend',
    uitkomstdagen: 2, uitzwemdagen: 3, nest: [100, 500], temp: [24, 27], moeilijk: 2,
    eerstevoer: 'Infusoriën, daarna pas ontloken artemia.',
    tip: 'Ook een bellennestbouwer. Houd de bak warm en windstil: de jongen vormen hun labyrintorgaan aan de oppervlakte en koude lucht daar is dodelijk.',
  },
  {
    id: 'killi', naam: 'Killivis', latijn: 'Nothobranchius, Aphyosemion', wijze: 'eierleggend',
    uitkomstdagen: 21, uitzwemdagen: 1, nest: [20, 100], temp: [22, 26], moeilijk: 3,
    eerstevoer: 'Pas ontloken artemia, meteen vanaf dag één.',
    tip: 'Bij de bodemleggers rijpen de eieren in vochtige turf, weken tot maanden. Noteer de datum waarop u de turf wegzet, anders raakt u de tel kwijt.',
  },

  /* ------------------------------------------------------------ vijver */
  {
    id: 'koi', naam: 'Koi', latijn: 'Cyprinus carpio', wijze: 'eierleggend',
    uitkomstdagen: 5, uitzwemdagen: 3, nest: [1000, 100000], temp: [18, 22], moeilijk: 3,
    eerstevoer: 'Infusoriën en fijn poedervoer, na een week artemia.',
    tip: 'Koi paaien in het voorjaar zodra het water rond 18 graden komt. Leg paaiborstels klaar en haal ze er met eieren en al uit, anders blijft er niets over.',
  },
  {
    id: 'goudvis', naam: 'Goudvis', latijn: 'Carassius auratus', wijze: 'eierleggend',
    uitkomstdagen: 5, uitzwemdagen: 3, nest: [500, 3000], temp: [18, 24], moeilijk: 2,
    eerstevoer: 'Infusoriën, na een week fijn poedervoer.',
    tip: 'De eerste weken zijn de jongen donkerbruin. De kleur komt pas na enkele maanden; ruim dus niets op omdat het er saai uitziet.',
  },

  /* ------------------------------------------------------------ garnalen */
  {
    id: 'neocaridina', naam: 'Red cherry garnaal', latijn: 'Neocaridina davidi', wijze: 'garnaal',
    draagdagen: 28, nest: [20, 30], temp: [20, 26], moeilijk: 1,
    eerstevoer: 'Niets apart nodig: de jongen grazen aanslag van planten en hardscape.',
    tip: 'Laat de moeder gewoon in de bak. Zonder vis die jaagt, groeit een kolonie vanzelf. Koper is dodelijk: kijk elk medicijn na voor u het gebruikt.',
  },
  {
    id: 'caridina', naam: 'Bijengarnaal', latijn: 'Caridina logemanni', wijze: 'garnaal',
    draagdagen: 32, nest: [15, 25], temp: [20, 24], moeilijk: 3,
    eerstevoer: 'Aanslag en fijn poeder voor garnalen.',
    tip: 'Vraagt zacht water met een KH rond nul en een stabiele GH van 4 tot 6. Hier is de osmosemaat belangrijker dan het voer.',
  },
];

export const kweeksoort = (id) => KWEEKSOORTEN.find((s) => s.id === id) || null;

/** De soorten gegroepeerd per wijze van voortplanten, voor een keuzelijst. */
export const KWEEKGROEPEN = [
  { id: 'levendbarend', label: 'Levendbarend' },
  { id: 'eierleggend', label: 'Eierleggend' },
  { id: 'garnaal', label: 'Garnalen' },
];

export const WIJZE_LABEL = {
  levendbarend: 'levendbarend',
  eierleggend: 'eierleggend',
  garnaal: 'garnaal',
};

/**
 * Verwachte data voor een legsel of dracht, op basis van de soort.
 * Geeft null terug voor een soort die de app niet kent: dan rekent de app niets
 * voor en vult de kweker de datums zelf in.
 */
export function verwachteData(soortId, startDatum) {
  const s = kweeksoort(soortId);
  if (!s || !startDatum) return null;
  const dag = 86400e3;
  if (s.wijze === 'levendbarend' || s.wijze === 'garnaal') {
    return { werpen: startDatum + s.draagdagen * dag };
  }
  const uit = startDatum + (s.uitkomstdagen || 0) * dag;
  return { uitkomen: uit, vrijzwemmen: uit + (s.uitzwemdagen || 0) * dag };
}

/** Ligt het aantal binnen wat voor deze soort gewoon is? */
export function nestOordeel(soortId, aantal) {
  const s = kweeksoort(soortId);
  if (!s || !aantal) return null;
  if (aantal < s.nest[0]) return { soort: 'laag', tekst: `Kleiner dan gebruikelijk voor ${s.naam.toLowerCase()} (${s.nest[0]} tot ${s.nest[1]}).` };
  if (aantal > s.nest[1]) return { soort: 'hoog', tekst: `Groter dan gebruikelijk voor ${s.naam.toLowerCase()} (${s.nest[0]} tot ${s.nest[1]}).` };
  return { soort: 'gewoon', tekst: `Gebruikelijk voor ${s.naam.toLowerCase()} (${s.nest[0]} tot ${s.nest[1]}).` };
}
