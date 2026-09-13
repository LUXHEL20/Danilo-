/**
 * Kweekgegevens van aquariumvissen, garnalen en slakken die hobbykwekers in
 * onze streek houden: van de gewone winkelsoorten tot soorten die enkel via
 * gespecialiseerde kwekers en beurzen circuleren.
 *
 * Alle getallen zijn richtwaarden uit de courante aquariumliteratuur, geen wetten.
 * Temperatuur, hardheid, leeftijd en conditie van de ouderdieren verschuiven ze
 * makkelijk een paar dagen of tientallen eieren. De app gebruikt ze om data te
 * voorspellen en om te waarschuwen wanneer een legsel afwijkt van wat normaal is;
 * ze vervangen de waarneming van de kweker niet.
 *
 * Velden:
 *   groep        taxonomische groep, enkel voor de gegroepeerde keuzelijst
 *   wijze        'levendbarend' | 'eierleggend' | 'garnaal'
 *   draagdagen   levendbarend/garnaal: van bevruchting tot werpen
 *   uitkomstdagen  eierleggend: van afzetten tot uitkomen
 *   uitzwemdagen   eierleggend: van uitkomen tot vrij zwemmen (dooierzak op)
 *   nest         [laag, hoog] verwacht aantal
 *   temp         [laag, hoog] in graden Celsius voor de kweek
 *   eerstevoer   wat de jongen de eerste dagen krijgen
 *   moeilijk     1 = lukt vanzelf, 2 = vraagt aandacht, 3 = voor de ervaren kweker
 *   zekerheid    ontbreekt bij bevestigde cijfers; 'onzeker' bij soorten waarvan
 *                de courante literatuur geen eenduidige cijfers geeft (dan is de
 *                waarde afgeleid van een nauw verwante soort, zie `bron`)
 *   bron         geraadpleegde bron(nen), niet getoond aan de klant
 */

export const KWEEKSOORTEN = [
  /* ------------------------------------------------------------ Levendbarende tandkarpers (Poeciliidae) */
  {
    id: 'poecilia-reticulata', naam: 'Guppy', latijn: 'Poecilia reticulata', groep: 'Levendbarende tandkarpers (Poeciliidae)', wijze: 'levendbarend', draagdagen: 28, nest: [20, 60], temp: [24, 28], moeilijk: 1,
    eerstevoer: 'Fijn poedervoer en pas ontloken artemia, vanaf de tweede week ook fijngewreven vlokvoer',
    tip: 'Zet de drachtige vrouw niet dagen op voorhand in een baarnetje, want van die stress werpt zij te vroeg; laat haar werpen in een bak vol javamos en vang de jongen daar weg.',
    bron: 'Seriously Fish, AquaInfo',
  },
  {
    id: 'poecilia-wingei', naam: 'Endler guppy', latijn: 'Poecilia wingei', groep: 'Levendbarende tandkarpers (Poeciliidae)', wijze: 'levendbarend', draagdagen: 23, nest: [5, 25], temp: [24, 28], moeilijk: 1,
    eerstevoer: 'Fijn poedervoer en pas ontloken artemia',
    tip: 'Houd endlers volledig gescheiden van guppy\'s: zij kruisen zonder moeite en na één generatie hebt u geen zuivere endlers meer in huis.',
    bron: 'Seriously Fish, aqua-fish.net',
  },
  {
    id: 'micropoecilia-picta', naam: 'Zwampguppy', latijn: 'Micropoecilia picta', groep: 'Levendbarende tandkarpers (Poeciliidae)', wijze: 'levendbarend', draagdagen: 28, nest: [5, 20], temp: [26, 29], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Pas ontloken artemia en fijn poedervoer',
    tip: 'Geef ongeveer een eetlepel zeezout per tien liter: in zacht zoet water gaan deze dieren binnen enkele weken achteruit en dragen de vrouwen hun nest niet uit.',
    bron: 'Aquarium Glaser, aquadiction (getallen bij benadering, weinig eenduidige literatuur)',
  },
  {
    id: 'xiphophorus-maculatus', naam: 'Platy', latijn: 'Xiphophorus maculatus', groep: 'Levendbarende tandkarpers (Poeciliidae)', wijze: 'levendbarend', draagdagen: 28, nest: [20, 50], temp: [22, 26], moeilijk: 1,
    eerstevoer: 'Fijn poedervoer, pas ontloken artemia en van bij de start wat groenvoer zoals fijngewreven erwt',
    tip: 'Geef de jongen naast eiwitvoer ook groenvoer en laat algen op de achterruit staan; op louter vlokvoer krijgen platy\'s darmklachten en groeien zij scheef op.',
    bron: 'Seriously Fish, AquaInfo',
  },
  {
    id: 'xiphophorus-variatus', naam: 'Papegaaiplaty', latijn: 'Xiphophorus variatus', groep: 'Levendbarende tandkarpers (Poeciliidae)', wijze: 'levendbarend', draagdagen: 30, nest: [20, 60], temp: [20, 24], moeilijk: 1,
    eerstevoer: 'Fijn poedervoer, pas ontloken artemia en groenvoer',
    tip: 'Kweek deze soort bij 20 tot 24 graden en niet warmer; in een bak boven 26 graden zijn de vrouwen binnen een jaar op en blijven de nesten klein.',
    bron: 'AquaInfo, Seriously Fish',
  },
  {
    id: 'xiphophorus-hellerii', naam: 'Zwaarddrager', latijn: 'Xiphophorus hellerii', groep: 'Levendbarende tandkarpers (Poeciliidae)', wijze: 'levendbarend', draagdagen: 28, nest: [30, 80], temp: [23, 27], moeilijk: 1,
    eerstevoer: 'Fijn poedervoer en pas ontloken artemia, na een week fijn gemalen vlokvoer',
    tip: 'Zet minstens drie vrouwen per man, anders jaagt de man de vrouwen dood; dat een oudere vrouw alsnog een zwaard krijgt en zich als man gedraagt is normaal en geen ziekte.',
    bron: 'Seriously Fish, AquaInfo',
  },
  {
    id: 'xiphophorus-montezumae', naam: 'Montezuma zwaarddrager', latijn: 'Xiphophorus montezumae', groep: 'Levendbarende tandkarpers (Poeciliidae)', wijze: 'levendbarend', draagdagen: 35, nest: [10, 40], temp: [22, 26], moeilijk: 2,
    eerstevoer: 'Pas ontloken artemia en fijn poedervoer',
    tip: 'Geef een bak van minstens een meter lang: in een korte bak groeit het lange zwaard van de man nooit uit en blijft de balts achterwege.',
    bron: 'Wikipedia, ForAquarist',
  },
  {
    id: 'xiphophorus-pygmaeus', naam: 'Dwergzwaarddrager', latijn: 'Xiphophorus pygmaeus', groep: 'Levendbarende tandkarpers (Poeciliidae)', wijze: 'levendbarend', draagdagen: 25, nest: [10, 25], temp: [23, 27], moeilijk: 2,
    eerstevoer: 'Fijn poedervoer en pas ontloken artemia',
    tip: 'Koop een groep van tien of meer, want de mannen zijn klein en onopvallend; in een groepje van vier weet u niet of u wel een man hebt en blijft de kweek uit.',
    bron: 'aquariumbreeder.com, Wikipedia',
  },
  {
    id: 'xiphophorus-xiphidium', naam: 'Zwaardplaty', latijn: 'Xiphophorus xiphidium', groep: 'Levendbarende tandkarpers (Poeciliidae)', wijze: 'levendbarend', draagdagen: 30, nest: [10, 30], temp: [22, 26], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'Fijn poedervoer, pas ontloken artemia en groenvoer',
    tip: 'Houd deze soort in een aparte bak zonder platy\'s of zwaarddragers, want zij kruist er vlot mee en de zuivere stam is dan meteen verloren.',
    bron: 'Draagtijd en nestgrootte afgeleid van verwante Xiphophorus, weinig soortspecifieke cijfers',
  },
  {
    id: 'xiphophorus-couchianus', naam: 'Monterrey platy', latijn: 'Xiphophorus couchianus', groep: 'Levendbarende tandkarpers (Poeciliidae)', wijze: 'levendbarend', draagdagen: 30, nest: [5, 25], temp: [20, 25], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'Fijn poedervoer, pas ontloken artemia en groenvoer',
    tip: 'Deze soort is in het wild zo goed als verdwenen en leeft enkel nog voort in de hobby; houd de stam zuiver en zet er nooit gewone platy\'s bij.',
    bron: 'Poecilia-liefhebbersnetwerk; getallen afgeleid van verwante Xiphophorus',
  },
  {
    id: 'poecilia-sphenops', naam: 'Black molly', latijn: 'Poecilia sphenops', groep: 'Levendbarende tandkarpers (Poeciliidae)', wijze: 'levendbarend', draagdagen: 32, nest: [20, 60], temp: [25, 28], moeilijk: 1,
    eerstevoer: 'Fijn poedervoer, pas ontloken artemia en groenvoer of algen',
    tip: 'Voeg ongeveer een eetlepel zeezout per tien liter toe en houd 26 graden aan; in koel en zacht water krijgen molly\'s schimmel en de schuurziekte en dragen de vrouwen hun nest niet uit.',
    bron: 'Fishlore, AquaInfo',
  },
  {
    id: 'poecilia-latipinna', naam: 'Zeilvinmolly', latijn: 'Poecilia latipinna', groep: 'Levendbarende tandkarpers (Poeciliidae)', wijze: 'levendbarend', draagdagen: 32, nest: [20, 80], temp: [25, 28], moeilijk: 2,
    eerstevoer: 'Fijn poedervoer, pas ontloken artemia en veel groenvoer',
    tip: 'De man zet zijn zeil pas op in een ruime bak met harde stenen vol algen om af te grazen; in een kleine, kale bak blijft het zeil dicht en komt het niet tot paren.',
    bron: 'aqua-fish.net, CABI',
  },
  {
    id: 'poecilia-velifera', naam: 'Reuzenzeilvinmolly', latijn: 'Poecilia velifera', groep: 'Levendbarende tandkarpers (Poeciliidae)', wijze: 'levendbarend', draagdagen: 40, nest: [20, 100], temp: [26, 29], moeilijk: 3,
    eerstevoer: 'Fijn poedervoer, pas ontloken artemia en veel groenvoer',
    tip: 'Reken op minstens 200 liter met hard, licht brak water; in een doorsnee huiskamerbak sterven de vrouwen vaak halverwege de dracht en dat is de meest gemaakte fout bij deze soort.',
    bron: 'Seriously Fish, selectaquatics.com',
  },
  {
    id: 'limia-nigrofasciata', naam: 'Bultrug limia', latijn: 'Limia nigrofasciata', groep: 'Levendbarende tandkarpers (Poeciliidae)', wijze: 'levendbarend', draagdagen: 49, nest: [10, 40], temp: [24, 28], moeilijk: 2,
    eerstevoer: 'Fijn poedervoer, pas ontloken artemia en groenvoer',
    tip: 'De bult op de rug komt er pas bij oudere mannen; kweek met dieren van minstens een jaar, want jonge mannen bevruchten slecht en u wacht dan maanden op niets.',
    bron: 'Seriously Fish, AquaInfo',
  },
  {
    id: 'limia-melanogaster', naam: 'Blauwe limia', latijn: 'Limia melanogaster', groep: 'Levendbarende tandkarpers (Poeciliidae)', wijze: 'levendbarend', draagdagen: 28, nest: [20, 50], temp: [23, 27], moeilijk: 1,
    eerstevoer: 'Fijn poedervoer en pas ontloken artemia',
    tip: 'Deze soort laat de eigen jongen zo goed als met rust; laat de vrouw gewoon in de kweekbak werpen en zet haar niet apart, dat scheelt stress en verlies.',
    bron: 'Seriously Fish, British Livebearer Association',
  },
  {
    id: 'limia-vittata', naam: 'Cubaanse limia', latijn: 'Limia vittata', groep: 'Levendbarende tandkarpers (Poeciliidae)', wijze: 'levendbarend', draagdagen: 35, nest: [20, 60], temp: [22, 26], moeilijk: 2,
    eerstevoer: 'Fijn poedervoer, pas ontloken artemia en groenvoer',
    tip: 'Een grote vrouw werpt er soms meer dan honderd tegelijk; zorg dat de opkweekbak klaarstaat voor zij werpt, anders zit u met jongen die u niet kwijt raakt.',
    bron: 'diszhal.info, Wikipedia',
  },
  {
    id: 'limia-perugiae', naam: 'Limia perugiae', latijn: 'Limia perugiae', groep: 'Levendbarende tandkarpers (Poeciliidae)', wijze: 'levendbarend', draagdagen: 35, nest: [10, 40], temp: [24, 28], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'Fijn poedervoer, pas ontloken artemia en groenvoer',
    tip: 'De mannen kleuren pas volledig uit in hard water met een hoge pH; in zacht Limburgs leidingwater blijven zij grauw en balsten zij nauwelijks.',
    bron: 'Cijfers afgeleid van het geslacht Limia, weinig soortspecifieke bronnen',
  },
  {
    id: 'girardinus-metallicus', naam: 'Metaalkarpertje', latijn: 'Girardinus metallicus', groep: 'Levendbarende tandkarpers (Poeciliidae)', wijze: 'levendbarend', draagdagen: 30, nest: [10, 30], temp: [22, 26], moeilijk: 1,
    eerstevoer: 'Fijn poedervoer en pas ontloken artemia',
    tip: 'De mannen jagen de hele dag door; houd twee tot drie vrouwen per man en veel dichte beplanting, anders raken de vrouwen uitgeput en werpen zij dode jongen.',
    bron: 'AquaInfo, chicagolivebearer.com',
  },
  {
    id: 'girardinus-falcatus', naam: 'Goudkarpertje', latijn: 'Girardinus falcatus', groep: 'Levendbarende tandkarpers (Poeciliidae)', wijze: 'levendbarend', draagdagen: 30, nest: [10, 30], temp: [22, 26], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'Fijn poedervoer en pas ontloken artemia',
    tip: 'Deze vis eet hydra en planaria weg en is daarom nuttig in een opkweekbak, maar hij eet net zo goed de eigen jongen: werk met een dikke mat javamos.',
    bron: 'Draagtijd afgeleid van G. metallicus; hydra-eten breed gedocumenteerd in de hobby',
  },
  {
    id: 'heterandria-formosa', naam: 'Dwerglevendbarende', latijn: 'Heterandria formosa', groep: 'Levendbarende tandkarpers (Poeciliidae)', wijze: 'levendbarend', draagdagen: 14, nest: [1, 5], temp: [20, 24], moeilijk: 2,
    eerstevoer: 'Pas ontloken artemia en fijn poedervoer, dat de jongen meteen aankunnen',
    tip: 'Deze soort werpt geen nest ineens maar één tot drie jongen per dag, weken aan een stuk, omdat de vrouw meerdere nesten tegelijk draagt; noteer dus het eerste jong en niet één werpdatum.',
    bron: 'Seriously Fish, PubMed (superfetatie), aquariumbreeder.com',
  },
  {
    id: 'phalloceros-caudimaculatus', naam: 'Caudo', latijn: 'Phalloceros caudimaculatus', groep: 'Levendbarende tandkarpers (Poeciliidae)', wijze: 'levendbarend', draagdagen: 30, nest: [10, 40], temp: [18, 24], moeilijk: 1,
    eerstevoer: 'Fijn poedervoer en pas ontloken artemia',
    tip: 'Deze soort houdt van koel water en kweekt gewoon op kamertemperatuur zonder verwarming; boven 26 graden leven de dieren kort en blijven de nesten uit.',
    bron: 'Seriously Fish, Practical Fishkeeping',
  },
  {
    id: 'alfaro-cultratus', naam: 'Mesvis', latijn: 'Alfaro cultratus', groep: 'Levendbarende tandkarpers (Poeciliidae)', wijze: 'levendbarend', draagdagen: 26, nest: [10, 30], temp: [24, 27], moeilijk: 3,
    eerstevoer: 'Pas ontloken artemia en fijngezeefde watervlooien',
    tip: 'Deze vis vraagt duidelijke stroming en zuurstofrijk water; in een stilstaande bak weigeren de dieren te paren en gaan de jongen binnen enkele dagen dood.',
    bron: 'Wikipedia, Seriously Fish, selectaquatics.com',
  },
  {
    id: 'priapella-intermedia', naam: 'Blauwoogkarpertje', latijn: 'Priapella intermedia', groep: 'Levendbarende tandkarpers (Poeciliidae)', wijze: 'levendbarend', draagdagen: 32, nest: [10, 30], temp: [24, 28], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Pas ontloken artemia en fijn poedervoer aan het oppervlak',
    tip: 'Deze soort springt bij de minste schrik de bak uit; een volledig sluitend deksel is hier geen luxe maar de voorwaarde om een kweekgroep in leven te houden.',
    bron: 'Draagtijd bij benadering uit hobbyverslagen, geen eenduidige literatuurwaarde',
  },
  {
    id: 'brachyrhaphis-roseni', naam: 'Brachyrhaphis roseni', latijn: 'Brachyrhaphis roseni', groep: 'Levendbarende tandkarpers (Poeciliidae)', wijze: 'levendbarend', draagdagen: 28, nest: [10, 40], temp: [24, 28], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'Pas ontloken artemia en fijn poedervoer',
    tip: 'Deze soort is uitgesproken bijterig; zet er geen andere vissen bij en geef veel schuilplanten, anders bijten de mannen de vinnen van de vrouwen kapot voor het tot een nest komt.',
    bron: 'Nestgrootte en draagtijd uit hobbyverslagen; agressie breed beschreven',
  },
  {
    id: 'belonesox-belizanus', naam: 'Snoekkarper', latijn: 'Belonesox belizanus', groep: 'Levendbarende tandkarpers (Poeciliidae)', wijze: 'levendbarend', draagdagen: 40, nest: [20, 100], temp: [26, 30], moeilijk: 3,
    eerstevoer: 'Pas ontloken artemia en watervlooien, na enkele weken al kleine levende visjes',
    tip: 'Deze roofvis neemt zo goed als geen dood voer aan; zonder een vaste eigen kweek van voedervisjes krijgt u de dieren niet in conditie en werpen zij niet.',
    bron: 'Practical Fishkeeping, MonsterFishKeepers',
  },
  {
    id: 'quintana-atrizona', naam: 'Cubaans dwergkarpertje', latijn: 'Quintana atrizona', groep: 'Levendbarende tandkarpers (Poeciliidae)', wijze: 'levendbarend', draagdagen: 35, nest: [5, 25], temp: [24, 28], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Fijn poedervoer en pas ontloken artemia',
    tip: 'Dit visje is klein en traag met eten; houd het apart in een eigen bak, want in een gezelschapsbak wordt het voer voor zijn neus weggekaapt en vermageren de dieren tot zij niet meer kweken.',
    bron: 'FishBase (28 tot 45 dagen); hobbygegevens schaars',
  },
  {
    id: 'neoheterandria-elegans', naam: 'Tijgerdwergkarpertje', latijn: 'Neoheterandria elegans', groep: 'Levendbarende tandkarpers (Poeciliidae)', wijze: 'levendbarend', draagdagen: 21, nest: [1, 5], temp: [24, 28], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'Fijn poedervoer en pas ontloken artemia',
    tip: 'Deze soort blijft onder de drie centimeter en werpt slechts enkele jongen tegelijk maar bijna doorlopend; zet een eigen bak van dertig liter op, in een gezelschapsbak verdwijnt elk jong meteen.',
    bron: 'Hobbyverslagen; werpt met superfetatie, exacte draagtijd niet in literatuur vastgelegd',
  },
  {
    id: 'phallichthys-amates', naam: 'Rouwsluierkarper', latijn: 'Phallichthys amates', groep: 'Levendbarende tandkarpers (Poeciliidae)', wijze: 'levendbarend', draagdagen: 30, nest: [10, 40], temp: [24, 28], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'Fijn poedervoer en pas ontloken artemia',
    tip: 'De jongen blijven de eerste dagen vlak onder het wateroppervlak hangen; leg een mat drijfplanten neer, anders worden zij daar meteen weggevangen.',
    bron: 'Draagtijd afgeleid uit hobbyliteratuur, geen eenduidige bronwaarde',
  },
  {
    id: 'poeciliopsis-gracilis', naam: 'Poeciliopsis gracilis', latijn: 'Poeciliopsis gracilis', groep: 'Levendbarende tandkarpers (Poeciliidae)', wijze: 'levendbarend', draagdagen: 28, nest: [10, 40], temp: [22, 26], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'Fijn poedervoer en pas ontloken artemia',
    tip: 'Houd deze soort koeler dan een guppy, rond 24 graden; bij hogere temperatuur groeien de dieren snel maar leven zij kort en leveren zij maar twee of drie nesten.',
    bron: 'Cijfers afgeleid van het geslacht Poeciliopsis',
  },
  /* ------------------------------------------------------------ Hooglandkarpers (Goodeidae) */
  {
    id: 'ameca-splendens', naam: 'Hooglandkarper', latijn: 'Ameca splendens', groep: 'Hooglandkarpers (Goodeidae)', wijze: 'levendbarend', draagdagen: 56, nest: [5, 30], temp: [22, 26], moeilijk: 2,
    eerstevoer: 'Meteen pas ontloken artemia, fijngemalen vlokvoer en groenvoer, want de jongen worden groot geboren',
    tip: 'De jongen komen ter wereld met een draadvormige navelstreng (trofotaenia) die de eerste dagen vanzelf afvalt; laat dat met rust, en zet na elk nest de man opnieuw bij want hooglandkarpers slaan geen sperma op.',
    bron: 'Seriously Fish, Goodeid Working Group, AquaInfo',
  },
  {
    id: 'xenotoca-doadrioi', naam: 'Roodstaart hooglandkarper', latijn: 'Xenotoca doadrioi', groep: 'Hooglandkarpers (Goodeidae)', wijze: 'levendbarend', draagdagen: 53, nest: [5, 50], temp: [22, 26], moeilijk: 2,
    eerstevoer: 'Pas ontloken artemia, fijngemalen vlokvoer en groenvoer',
    tip: 'Deze vis knipt vinnen van tragere medebewoners en wordt nog altijd als Xenotoca eiseni verkocht; houd hem apart en zet na elk nest opnieuw een man bij de vrouw, want zij bewaart geen sperma.',
    bron: 'Seriously Fish, Goodeid Working Group',
  },
  {
    id: 'xenotoca-variata', naam: 'Gevlekte hooglandkarper', latijn: 'Xenotoca variata', groep: 'Hooglandkarpers (Goodeidae)', wijze: 'levendbarend', draagdagen: 55, nest: [10, 40], temp: [20, 25], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'Pas ontloken artemia, fijngemalen vlokvoer en groenvoer',
    tip: 'Geef deze soort een koele periode in de winter rond 16 tot 18 graden; zonder die rust stoppen de vrouwen na een of twee nesten met werpen.',
    bron: 'Goodeid Working Group; draagtijd afgeleid van het geslacht Xenotoca',
  },
  {
    id: 'xenotoca-lyonsi', naam: 'Zwartstaart hooglandkarper', latijn: 'Xenotoca lyonsi', groep: 'Hooglandkarpers (Goodeidae)', wijze: 'levendbarend', draagdagen: 55, nest: [10, 40], temp: [22, 26], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'Pas ontloken artemia, fijngemalen vlokvoer en groenvoer',
    tip: 'Deze soort is pas recent van Xenotoca eiseni afgesplitst; koop bij één kweker en meng geen herkomsten, want gekruiste stammen zijn voor de hobby waardeloos.',
    bron: 'Goodeid Working Group; cijfers afgeleid van verwante Xenotoca',
  },
  {
    id: 'characodon-lateralis', naam: 'Regenboog hooglandkarper', latijn: 'Characodon lateralis', groep: 'Hooglandkarpers (Goodeidae)', wijze: 'levendbarend', draagdagen: 55, nest: [5, 20], temp: [18, 22], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Pas ontloken artemia en fijngemalen vlokvoer',
    tip: 'Houd deze soort koel, 18 tot 22 graden, met een echte winterrust; bij constante 26 graden verouderen de dieren snel, blijven de nesten uit en is de stam binnen twee jaar weg.',
    bron: 'Goodeid Working Group; draagtijd afgeleid van andere goodeiden',
  },
  {
    id: 'skiffia-multipunctata', naam: 'Gevlekte skiffia', latijn: 'Skiffia multipunctata', groep: 'Hooglandkarpers (Goodeidae)', wijze: 'levendbarend', draagdagen: 55, nest: [10, 30], temp: [20, 25], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'Pas ontloken artemia, fijngemalen vlokvoer en groenvoer',
    tip: 'Deze soort kweekt het best bij kamertemperatuur met een verschil tussen dag en nacht; zet de verwarming laag of laat ze weg, dat werkt hier beter dan een constante temperatuur.',
    bron: 'allnaturalpetcare.com, Goodeid Working Group; draagtijd afgeleid van het geslacht',
  },
  {
    id: 'skiffia-bilineata', naam: 'Tweestreepskiffia', latijn: 'Skiffia bilineata', groep: 'Hooglandkarpers (Goodeidae)', wijze: 'levendbarend', draagdagen: 55, nest: [5, 25], temp: [20, 25], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'Pas ontloken artemia en fijngemalen vlokvoer',
    tip: 'De jongen worden groot geboren maar groeien traag; houd ze minstens drie maanden apart van de ouders, want in een gemengde bak blijven zij achter op de oudere dieren.',
    bron: 'Goodeid Working Group; cijfers afgeleid van het geslacht Skiffia',
  },
  {
    id: 'skiffia-francesae', naam: 'Gouden skiffia', latijn: 'Skiffia francesae', groep: 'Hooglandkarpers (Goodeidae)', wijze: 'levendbarend', draagdagen: 55, nest: [5, 25], temp: [20, 25], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Pas ontloken artemia en fijngemalen vlokvoer',
    tip: 'Deze soort is in het wild uitgestorven en bestaat alleen nog in kweeknetwerken; werk met minstens twintig stamouders, want in een kleine groep loopt de inteelt binnen enkele jaren vast op onvruchtbare mannen.',
    bron: 'Goodeid Working Group; getallen afgeleid van het geslacht Skiffia',
  },
  {
    id: 'zoogoneticus-tequila', naam: 'Tequilakarper', latijn: 'Zoogoneticus tequila', groep: 'Hooglandkarpers (Goodeidae)', wijze: 'levendbarend', draagdagen: 55, nest: [10, 29], temp: [20, 25], moeilijk: 2,
    eerstevoer: 'Pas ontloken artemia, fijngemalen vlokvoer en groenvoer',
    tip: 'Deze soort was in het wild verdwenen en is enkel dankzij hobbykweek bewaard; houd de bak koel en goed doorlucht, en noteer de herkomst van uw stam voor u jongen doorverkoopt.',
    bron: 'Seriously Fish, Goodeid Working Group, Aquatic Arts',
  },
  {
    id: 'zoogoneticus-quitzeoensis', naam: 'Zoogoneticus quitzeoensis', latijn: 'Zoogoneticus quitzeoensis', groep: 'Hooglandkarpers (Goodeidae)', wijze: 'levendbarend', draagdagen: 55, nest: [10, 30], temp: [20, 25], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'Pas ontloken artemia en fijngemalen vlokvoer',
    tip: 'Verwar deze soort niet met de tequilakarper en houd ze gescheiden; beide kruisen en een gekruiste lijn is voor de kweeknetwerken meteen verloren.',
    bron: 'Goodeid Working Group; cijfers afgeleid van het geslacht Zoogoneticus',
  },
  {
    id: 'ilyodon-furcidens', naam: 'Forelkarper', latijn: 'Ilyodon furcidens', groep: 'Hooglandkarpers (Goodeidae)', wijze: 'levendbarend', draagdagen: 55, nest: [5, 30], temp: [20, 26], moeilijk: 2,
    eerstevoer: 'Pas ontloken artemia, fijngemalen vlokvoer en groenvoer',
    tip: 'Dit is een van de taaiste hooglandkarpers en een goed beginpunt voor wie deze groep wil leren kweken; geef stroming, want in stilstaand water worden de dieren log en traag van kweek.',
    bron: 'Goodeid Working Group, Tropical Treasures',
  },
  {
    id: 'goodea-atripinnis', naam: 'Zwartvin hooglandkarper', latijn: 'Goodea atripinnis', groep: 'Hooglandkarpers (Goodeidae)', wijze: 'levendbarend', draagdagen: 57, nest: [20, 60], temp: [18, 24], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'Pas ontloken artemia, fijngemalen vlokvoer en veel groenvoer',
    tip: 'Deze vis wordt vijftien centimeter en is een echte vraat; onder honderd liter verdwijnen alle planten en alle jongen, dus werp de vrouw af in een aparte opkweekbak.',
    bron: 'Goodeid Working Group; draagtijd afgeleid van andere goodeiden',
  },
  {
    id: 'ataeniobius-toweri', naam: 'Blauwstaart hooglandkarper', latijn: 'Ataeniobius toweri', groep: 'Hooglandkarpers (Goodeidae)', wijze: 'levendbarend', draagdagen: 55, nest: [5, 20], temp: [22, 26], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Pas ontloken artemia en fijngemalen vlokvoer',
    tip: 'Dit is de enige hooglandkarper waarvan de jongen geen trofotaenia hebben; zij worden kleiner geboren dan bij de andere goodeiden en hebben de eerste week echt fijn levend voer nodig.',
    bron: 'AquaInfo, Goodeid Working Group; getallen bij benadering',
  },
  {
    id: 'girardinichthys-multiradiatus', naam: 'Dwerg hooglandkarper', latijn: 'Girardinichthys multiradiatus', groep: 'Hooglandkarpers (Goodeidae)', wijze: 'levendbarend', draagdagen: 55, nest: [5, 25], temp: [16, 22], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Pas ontloken artemia en fijngemalen vlokvoer',
    tip: 'Deze soort komt uit koud berglandwater en houdt geen verwarmde huiskamerbak vol; zonder een onverwarmde bak of een koele kelderopstelling lukt de kweek hier zelden.',
    bron: 'Goodeid Working Group; temperatuur uit habitatgegevens, draagtijd afgeleid',
  },
  {
    id: 'chapalichthys-encaustus', naam: 'Chapalichthys encaustus', latijn: 'Chapalichthys encaustus', groep: 'Hooglandkarpers (Goodeidae)', wijze: 'levendbarend', draagdagen: 55, nest: [10, 40], temp: [20, 26], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'Pas ontloken artemia, fijngemalen vlokvoer en groenvoer',
    tip: 'Deze soort knabbelt aan vinnen van andere vissen en aan zachte planten; zet ze in een soortbak met harde planten zoals anubias, dan blijft de groep rustig genoeg om te kweken.',
    bron: 'Goodeid Working Group; cijfers afgeleid van verwante goodeiden',
  },
  {
    id: 'xenoophorus-captivus', naam: 'Xenoophorus captivus', latijn: 'Xenoophorus captivus', groep: 'Hooglandkarpers (Goodeidae)', wijze: 'levendbarend', draagdagen: 55, nest: [5, 25], temp: [18, 24], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Pas ontloken artemia en fijngemalen vlokvoer',
    tip: 'Deze soort is gevoelig voor te warm en te vuil water; houd de bak koel en ververs wekelijks een derde, want bij vervuiling stoppen de vrouwen meteen met werpen.',
    bron: 'Goodeid Working Group; getallen bij benadering',
  },
  {
    id: 'alloophorus-robustus', naam: 'Alloophorus robustus', latijn: 'Alloophorus robustus', groep: 'Hooglandkarpers (Goodeidae)', wijze: 'levendbarend', draagdagen: 55, nest: [10, 40], temp: [18, 24], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Pas ontloken artemia en muggenlarven, de jongen worden groot geboren',
    tip: 'Dit is een roofzuchtige soort die kleinere bakgenoten opeet, ook de eigen jongen; zet de drachtige vrouw altijd apart, anders houdt u van een nest van dertig er geen enkele over.',
    bron: 'Goodeid Working Group; cijfers afgeleid van verwante goodeiden',
  },
  {
    id: 'allotoca-diazi', naam: 'Allotoca diazi', latijn: 'Allotoca diazi', groep: 'Hooglandkarpers (Goodeidae)', wijze: 'levendbarend', draagdagen: 55, nest: [5, 25], temp: [18, 23], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Pas ontloken artemia en fijngemalen vlokvoer',
    tip: 'Deze soort vraagt koel, zuurstofrijk water en lukt in een gewone warme huiskamerbak zelden; houd ze in een onverwarmde bak met een stromingspomp, dat is hier de doorslaggevende factor.',
    bron: 'Goodeid Working Group; getallen bij benadering',
  },
  /* ------------------------------------------------------------ Halfsnavelbekken (Zenarchopteridae) */
  {
    id: 'dermogenys-pusilla', naam: 'Halfsnavelbek', latijn: 'Dermogenys pusilla', groep: 'Halfsnavelbekken (Zenarchopteridae)', wijze: 'levendbarend', draagdagen: 35, nest: [10, 30], temp: [24, 28], moeilijk: 3,
    eerstevoer: 'Pas ontloken artemia en jonge fruitvliegjes aan het wateroppervlak, want de jongen eten enkel bovenaan',
    tip: 'Na het eerste of tweede nest mislukken de volgende vaak door vitaminegebrek; geef geregeld levende fruitvliegjes en muggenlarven aan het oppervlak in plaats van enkel droogvoer.',
    bron: 'Seriously Fish, fishkeeper.co.uk',
  },
  {
    id: 'nomorhamphus-liemi', naam: 'Celebes halfsnavelbek', latijn: 'Nomorhamphus liemi', groep: 'Halfsnavelbekken (Zenarchopteridae)', wijze: 'levendbarend', draagdagen: 42, nest: [5, 20], temp: [22, 26], moeilijk: 3,
    eerstevoer: 'Pas ontloken artemia en fruitvliegjes aan het oppervlak; de jongen zijn bij geboorte al ruim twee centimeter',
    tip: 'Houd deze soort koeler dan 26 graden, want zij komt uit bergbeken; in een warme tropische bak werpen de vrouwen dode of te vroeg geboren jongen.',
    bron: 'Seriously Fish, fishkeeper.co.uk, Aquarium Glaser',
  },
  {
    id: 'hemirhamphodon-pogonognathus', naam: 'Langsnavel halfsnavelbek', latijn: 'Hemirhamphodon pogonognathus', groep: 'Halfsnavelbekken (Zenarchopteridae)', wijze: 'levendbarend', draagdagen: 35, nest: [1, 10], temp: [22, 26], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Zeer fijn levend voer aan het oppervlak: pas ontloken artemia, azijnaaltjes en jonge fruitvliegjes',
    tip: 'Deze soort vraagt zuur, zacht turfwater en werpt slechts enkele jongen per keer, druppelsgewijs; in gewoon leidingwater lukt de kweek in een huiskamerbak zelden.',
    bron: 'Seriously Fish; getallen bij benadering, weinig kweekverslagen',
  },
  /* ------------------------------------------------------------ Vieroogvissen (Anablepidae) */
  {
    id: 'anableps-anableps', naam: 'Vieroogvis', latijn: 'Anableps anableps', groep: 'Vieroogvissen (Anablepidae)', wijze: 'levendbarend', draagdagen: 60, nest: [5, 15], temp: [25, 28], moeilijk: 3,
    eerstevoer: 'Pas ontloken artemia, fijngehakte mossel en muggenlarven, alles aan het oppervlak aangeboden',
    tip: 'Zelden verkrijgbaar via de gewone winkelhandel: vraagt brak water en een zeer lang bassin, en wordt vrijwel enkel via gespecialiseerde brakwaterhandelaars verhandeld. De paringsorganen staan links of rechts, zodat een linkse man enkel met een rechtse vrouw kan paren; koop daarom een groep van minstens zes dieren, anders paart uw koppel nooit.',
    bron: 'Seriously Fish, AquaInfo, brackishfaq',
  },
  /* ------------------------------------------------------------ Karperzalmen (Characidae) */
  {
    id: 'paracheirodon-innesi', naam: 'Neonzalm', latijn: 'Paracheirodon innesi', groep: 'Karperzalmen (Characidae)', wijze: 'eierleggend', uitkomstdagen: 1, uitzwemdagen: 4, nest: [60, 130], temp: [23, 25], moeilijk: 3,
    eerstevoer: 'infusorien of groen water de eerste drie dagen, daarna pas ontloken artemia',
    tip: 'De eieren en de pas uitgekomen larven zijn lichtschuw: dek de kweekbak volledig af met zwarte folie tot de jongen vrij zwemmen, anders gaat het hele legsel verloren.',
    bron: 'Seriously Fish, AquaInfo, ICAR-onderzoek broedduur bij 18 tot 26 graden',
  },
  {
    id: 'paracheirodon-axelrodi', naam: 'Rode neon (kardinaaltetra)', latijn: 'Paracheirodon axelrodi', groep: 'Karperzalmen (Characidae)', wijze: 'eierleggend', uitkomstdagen: 1, uitzwemdagen: 4, nest: [100, 300], temp: [24, 27], moeilijk: 3,
    eerstevoer: 'infusorien of groen water, na vier dagen pas ontloken artemia',
    tip: 'Kweken lukt enkel in osmosewater onder 1 graad dH met een pH rond 5,5; in het harde leidingwater van Limburg bevrucht het legsel niet en verschimmelt het binnen een dag.',
    bron: 'Seriously Fish, AquaInfo kweekverslag Paracheirodon axelrodi',
  },
  {
    id: 'paracheirodon-simulans', naam: 'Groene neon', latijn: 'Paracheirodon simulans', groep: 'Karperzalmen (Characidae)', wijze: 'eierleggend', uitkomstdagen: 1, uitzwemdagen: 4, nest: [60, 130], temp: [26, 28], moeilijk: 3,
    eerstevoer: 'groen water of infusorien, pas na een week artemia',
    tip: 'Deze soort wil warmer en zuurder dan de gewone neon en zet onder 26 graden zelden af; kweek met een groep van tien in plaats van met een koppel.',
    bron: 'Seriously Fish, Aquarium Co-Op kweekverslag Paracheirodon simulans',
  },
  {
    id: 'hyphessobrycon-herbertaxelrodi', naam: 'Zwarte neon', latijn: 'Hyphessobrycon herbertaxelrodi', groep: 'Karperzalmen (Characidae)', wijze: 'eierleggend', uitkomstdagen: 1, uitzwemdagen: 4, nest: [100, 150], temp: [25, 27], moeilijk: 2,
    eerstevoer: 'infusorien de eerste dagen, daarna pas ontloken artemia',
    tip: 'Zet het kweekkoppel \'s avonds over; ze zetten af bij het eerste ochtendlicht en eten hun eigen eieren, dus haal de ouders dezelfde voormiddag weg.',
    bron: 'Aqua-fish.net, Aquadiction, Diszhal soortbeschrijving',
  },
  {
    id: 'aphyocharax-anisitsi', naam: 'Bloedzalm (bloedvinzalm)', latijn: 'Aphyocharax anisitsi', groep: 'Karperzalmen (Characidae)', wijze: 'eierleggend', uitkomstdagen: 1, uitzwemdagen: 3, nest: [300, 500], temp: [24, 26], moeilijk: 1,
    eerstevoer: 'infusorien of vloeibaar opfokvoer, na drie dagen pas ontloken artemia',
    tip: 'Bij het afzetten springen deze vissen boven water; leg een sluitend deksel op de kweekbak en houd het waterpeil op vijftien centimeter, dan vallen de eieren snel buiten bereik.',
    bron: 'Aqua-fish.net, Seriously Fish',
  },
  {
    id: 'hyphessobrycon-eques', naam: 'Serpaezalm', latijn: 'Hyphessobrycon eques', groep: 'Karperzalmen (Characidae)', wijze: 'eierleggend', uitkomstdagen: 1, uitzwemdagen: 4, nest: [200, 300], temp: [26, 28], moeilijk: 2,
    eerstevoer: 'infusorien de eerste twee dagen, daarna pas ontloken artemia',
    tip: 'Voer de kweekgroep een week lang levende of diepgevroren muggenlarven; op droogvoer alleen blijven de vrouwtjes leeg en komt het niet tot afzetten.',
    bron: 'Seriously Fish, Aqua-fish.net',
  },
  {
    id: 'gymnocorymbus-ternetzi', naam: 'Zwartrokzalm', latijn: 'Gymnocorymbus ternetzi', groep: 'Karperzalmen (Characidae)', wijze: 'eierleggend', uitkomstdagen: 1, uitzwemdagen: 4, nest: [500, 1000], temp: [25, 27], moeilijk: 1,
    eerstevoer: 'infusorien of poedervoer, na twee dagen pas ontloken artemia',
    tip: 'Dit is de geschikste zalm om mee te beginnen: leg een laag knikkers of een rooster op de bodem zodat de eieren buiten bereik van de ouders vallen.',
    bron: 'Practical Fishkeeping, Seriously Fish, Aquainfo.dk',
  },
  {
    id: 'nematobrycon-palmeri', naam: 'Keizerzalm', latijn: 'Nematobrycon palmeri', groep: 'Karperzalmen (Characidae)', wijze: 'eierleggend', uitkomstdagen: 1, uitzwemdagen: 4, nest: [50, 100], temp: [24, 27], moeilijk: 2,
    eerstevoer: 'infusorien, na enkele dagen microwormen en pas ontloken artemia',
    tip: 'Het dominante mannetje verdedigt een vast plekje; zet een mannetje met twee vrouwtjes af, met meerdere mannetjes in de kweekbak komt het niet tot paring.',
    bron: 'Aquariadise, Seriously Fish, AquaInfo',
  },
  {
    id: 'inpaichthys-kerri', naam: 'Blauwe keizerzalm', latijn: 'Inpaichthys kerri', groep: 'Karperzalmen (Characidae)', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 4, nest: [50, 100], temp: [25, 27], moeilijk: 2,
    eerstevoer: 'infusorien, daarna microwormen en pas ontloken artemia',
    tip: 'De ouders eten de eieren zodra ze die zien; haal ze weg op het ogenblik dat u de eerste eieren opmerkt, niet pas de volgende dag.',
    bron: 'Seriously Fish, Aqua-fish.net',
  },
  /* ------------------------------------------------------------ Afrikaanse zalmen (Alestidae) */
  {
    id: 'phenacogrammus-interruptus', naam: 'Congozalm', latijn: 'Phenacogrammus interruptus', groep: 'Afrikaanse zalmen (Alestidae)', wijze: 'eierleggend', uitkomstdagen: 6, uitzwemdagen: 1, nest: [100, 300], temp: [25, 27], moeilijk: 2,
    eerstevoer: 'infusorien de eerste dag, daarna al snel pas ontloken artemia',
    tip: 'De eieren blijven zes dagen op de bodem liggen: kweek boven een rooster en zuig elke dag de witte, beschimmelde eieren weg, anders slaat de schimmel over op het hele legsel.',
    bron: 'Seriously Fish, Aquariadise, ForAquarist',
  },
  {
    id: 'arnoldichthys-spilopterus', naam: 'Afrikaanse roodoogzalm', latijn: 'Arnoldichthys spilopterus', groep: 'Afrikaanse zalmen (Alestidae)', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 4, nest: [500, 1000], temp: [25, 27], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'infusorien, na enkele dagen pas ontloken artemia',
    tip: 'Zonder levend insectenvoer, zoals fruitvliegjes en muggenlarven, maken de vrouwtjes nauwelijks eieren aan; dat is de reden dat deze soort zo weinig nagekweekt wordt.',
    bron: 'Seriously Fish en Aquarium Glaser bevestigen het gedrag en tot 1000 eieren; de exacte uitkomst- en uitzwemdagen zijn afgeleid van verwante Alestidae',
  },
  {
    id: 'brycinus-longipinnis', naam: 'Langvinzalm', latijn: 'Brycinus longipinnis', groep: 'Afrikaanse zalmen (Alestidae)', wijze: 'eierleggend', uitkomstdagen: 6, uitzwemdagen: 1, nest: [200, 500], temp: [24, 27], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'infusorien de eerste dag, daarna pas ontloken artemia',
    tip: 'Net als bij de congozalm blijven de eieren bijna een week op de bodem liggen; zonder dagelijks wegzuigen van de witte eieren verschimmelt het legsel.',
    bron: 'Afgeleid van de kweekgegevens van andere Alestidae; geen eigen kweekverslag met dag- en aantalgegevens teruggevonden',
  },
  /* ------------------------------------------------------------ Karperzalmen (Characidae) */
  {
    id: 'prionobrama-filigera', naam: 'Glaszalm (glazen bloedzalm)', latijn: 'Prionobrama filigera', groep: 'Karperzalmen (Characidae)', wijze: 'eierleggend', uitkomstdagen: 1, uitzwemdagen: 3, nest: [200, 300], temp: [24, 27], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'infusorien of vloeibaar opfokvoer, daarna pas ontloken artemia',
    tip: 'Het doorzichtige lijf maakt rijpe vrouwtjes goed leesbaar: pas als u de eieren door de buikwand ziet liggen, heeft overzetten naar de kweekbak zin.',
    bron: 'Getallen bij benadering, afgeleid van de nauw verwante Aphyocharax anisitsi; geen apart kweekverslag gevonden',
  },
  {
    id: 'pristella-maxillaris', naam: 'Roentgenzalm (pristella)', latijn: 'Pristella maxillaris', groep: 'Karperzalmen (Characidae)', wijze: 'eierleggend', uitkomstdagen: 1, uitzwemdagen: 3, nest: [200, 400], temp: [26, 28], moeilijk: 1,
    eerstevoer: 'infusorien de eerste dagen, daarna pas ontloken artemia',
    tip: 'Ze zetten in de vroege ochtend af boven fijnbladige planten of een wollen kweekmop; haal de ouders nog dezelfde ochtend weg, want ze zoeken de eieren daarna systematisch op.',
    bron: 'Seriously Fish, AquaInfo, Aqua-fish.net',
  },
  {
    id: 'hyphessobrycon-pulchripinnis', naam: 'Citroenzalm', latijn: 'Hyphessobrycon pulchripinnis', groep: 'Karperzalmen (Characidae)', wijze: 'eierleggend', uitkomstdagen: 1, uitzwemdagen: 3, nest: [100, 300], temp: [25, 27], moeilijk: 2,
    eerstevoer: 'infusorien of vloeibaar opfokvoer, na drie dagen pas ontloken artemia',
    tip: 'De vrouwtjes worden hard van het afzetten en de mannetjes blijven doorjagen; haal de ouders meteen na het afzetten weg en gun het vrouwtje twee weken rust voor u opnieuw kweekt.',
    bron: 'AquaInfo, Aqua-fish.net, Aquatic Community',
  },
  {
    id: 'hemigrammus-bleheri', naam: 'Roodkopzalm', latijn: 'Hemigrammus bleheri', groep: 'Karperzalmen (Characidae)', wijze: 'eierleggend', uitkomstdagen: 1, uitzwemdagen: 4, nest: [100, 200], temp: [27, 29], moeilijk: 3,
    eerstevoer: 'infusorien of groen water, pas na vier dagen artemia',
    tip: 'De eieren verschimmelen bijzonder snel: kook het kweekgerief uit, gebruik osmosewater met een aftreksel van elzenproppen en houd de bak volledig donker tot de jongen zwemmen.',
    bron: 'Seriously Fish, Nippyfish kweekverslag, Aqua-fish.net',
  },
  {
    id: 'petitella-georgiae', naam: 'Valse roodkopzalm', latijn: 'Petitella georgiae', groep: 'Karperzalmen (Characidae)', wijze: 'eierleggend', uitkomstdagen: 1, uitzwemdagen: 4, nest: [100, 200], temp: [27, 29], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'infusorien of groen water, daarna pas ontloken artemia',
    tip: 'Wordt vaak door elkaar verkocht met Hemigrammus bleheri; de kweekaanpak is dezelfde, maar verwacht van beide soorten in een gewone huiskamerbak zelden een geslaagd legsel.',
    bron: 'Aqua-fish.net soortbeschrijving; getallen overgenomen van Hemigrammus bleheri',
  },
  {
    id: 'hemigrammus-rhodostomus', naam: 'Echte roodkopzalm', latijn: 'Hemigrammus rhodostomus', groep: 'Karperzalmen (Characidae)', wijze: 'eierleggend', uitkomstdagen: 1, uitzwemdagen: 4, nest: [100, 200], temp: [27, 29], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'infusorien of groen water, daarna pas ontloken artemia',
    tip: 'Deze soort is in de handel zeldzamer dan de twee andere roodkopzalmen en even veeleisend; koop een groep van minstens twaalf, want in een kleine groep verkleurt de rode kop en zetten ze niet af.',
    bron: 'Getallen overgenomen van de nauw verwante Hemigrammus bleheri; geen apart kweekverslag met dagen teruggevonden',
  },
  {
    id: 'hemigrammus-erythrozonus', naam: 'Gloeilichtzalm', latijn: 'Hemigrammus erythrozonus', groep: 'Karperzalmen (Characidae)', wijze: 'eierleggend', uitkomstdagen: 1, uitzwemdagen: 4, nest: [100, 200], temp: [26, 28], moeilijk: 2,
    eerstevoer: 'infusorien de eerste dagen, daarna pas ontloken artemia',
    tip: 'Houd de carbonaathardheid onder 2 graden dKH; in gewoon Limburgs leidingwater worden de eieren wel gelegd maar niet bevrucht.',
    bron: 'The Aquarium Wiki kweekpagina, AquaInfo',
  },
  {
    id: 'hemigrammus-ocellifer', naam: 'Koplichtzalm', latijn: 'Hemigrammus ocellifer', groep: 'Karperzalmen (Characidae)', wijze: 'eierleggend', uitkomstdagen: 1, uitzwemdagen: 4, nest: [200, 300], temp: [25, 27], moeilijk: 2,
    eerstevoer: 'infusorien de eerste dagen, daarna pas ontloken artemia',
    tip: 'De larven hangen na het uitkomen enkele dagen stil aan het glas en lijken dood; raak ze niet aan en zuig ze niet weg, ze komen rond de vijfde dag vanzelf los.',
    bron: 'AquaInfo kweekverslag Hemigrammus ocellifer',
  },
  {
    id: 'hemigrammus-pulcher', naam: 'Prachtzalm', latijn: 'Hemigrammus pulcher', groep: 'Karperzalmen (Characidae)', wijze: 'eierleggend', uitkomstdagen: 1, uitzwemdagen: 4, nest: [100, 200], temp: [26, 28], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'infusorien de eerste dagen, daarna pas ontloken artemia',
    tip: 'Deze soort zet enkel af in donker, met turf gefilterd water; met volle verlichting blijven de koppels elkaar wel achtervolgen maar komen er geen eieren.',
    bron: 'Getallen bij benadering, gebaseerd op de kweekgegevens van andere Hemigrammus-soorten',
  },
  {
    id: 'hemigrammus-rodwayi', naam: 'Goudzalm', latijn: 'Hemigrammus rodwayi', groep: 'Karperzalmen (Characidae)', wijze: 'eierleggend', uitkomstdagen: 1, uitzwemdagen: 4, nest: [100, 300], temp: [26, 28], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'infusorien de eerste dagen, daarna pas ontloken artemia',
    tip: 'De gouden glans komt bij wildvang van een parasiet in de huid; nakweek uit uw eigen bak blijft zilverkleurig, en dat is geen kweekfout die u moet uitleggen als ziekte.',
    bron: 'Het gouden pigment door parasitaire cysten is algemeen beschreven; de dag- en aantalgegevens zijn afgeleid van andere Hemigrammus-soorten',
  },
  {
    id: 'moenkhausia-sanctaefilomenae', naam: 'Roodoogzalm', latijn: 'Moenkhausia sanctaefilomenae', groep: 'Karperzalmen (Characidae)', wijze: 'eierleggend', uitkomstdagen: 1, uitzwemdagen: 4, nest: [300, 500], temp: [24, 27], moeilijk: 1,
    eerstevoer: 'infusorien de eerste dagen, daarna microwormen en pas ontloken artemia',
    tip: 'Deze soort knipt fijnbladige planten stuk; gebruik een wollen kweekmop in plaats van javamos, anders drijft uw afzetplaats na een nacht in stukken rond.',
    bron: 'Seriously Fish, Aqua-fish.net',
  },
  {
    id: 'moenkhausia-pittieri', naam: 'Diamantzalm', latijn: 'Moenkhausia pittieri', groep: 'Karperzalmen (Characidae)', wijze: 'eierleggend', uitkomstdagen: 1, uitzwemdagen: 4, nest: [300, 500], temp: [26, 28], moeilijk: 2,
    eerstevoer: 'infusorien de eerste dagen, daarna pas ontloken artemia',
    tip: 'De diamantglans komt er pas na acht tot twaalf maanden; jonge nakweek ziet er grauw uit en is daarom moeilijk te verkopen, kweek dus enkel als u de jongen lang kunt opgroeien.',
    bron: 'Seriously Fish, PVAS kweekverslag Moenkhausia pittieri',
  },
  {
    id: 'thayeria-boehlkei', naam: 'Pinguinzalm', latijn: 'Thayeria boehlkei', groep: 'Karperzalmen (Characidae)', wijze: 'eierleggend', uitkomstdagen: 1, uitzwemdagen: 4, nest: [300, 1000], temp: [26, 28], moeilijk: 2,
    eerstevoer: 'infusorien de eerste dagen, daarna pas ontloken artemia',
    tip: 'De eieren komen al na twaalf tot vierentwintig uur uit, sneller dan bij de meeste zalmen; controleer de kweekbak dus de ochtend na het afzetten en niet pas de dag erna.',
    bron: 'Seriously Fish, Aquadiction, Aqua-fish.net',
  },
  {
    id: 'hasemania-nana', naam: 'Zilverpuntzalm', latijn: 'Hasemania nana', groep: 'Karperzalmen (Characidae)', wijze: 'eierleggend', uitkomstdagen: 1, uitzwemdagen: 4, nest: [100, 150], temp: [24, 27], moeilijk: 1,
    eerstevoer: 'infusorien de eerste dagen, daarna pas ontloken artemia',
    tip: 'Zilverpuntzalmen jagen fanatiek op hun eigen eieren; kweek boven een rooster met mazen van ongeveer drie millimeter, dan valt het legsel meteen buiten bereik.',
    bron: 'Seriously Fish, Aquarium Co-Op, Aqua-fish.net',
  },
  {
    id: 'hyphessobrycon-megalopterus', naam: 'Zwarte fantoomzalm', latijn: 'Hyphessobrycon megalopterus', groep: 'Karperzalmen (Characidae)', wijze: 'eierleggend', uitkomstdagen: 1, uitzwemdagen: 4, nest: [200, 300], temp: [24, 26], moeilijk: 2,
    eerstevoer: 'infusorien de eerste dagen, daarna pas ontloken artemia',
    tip: 'De mannetjes maken een uitgebreid vinnenspel met elkaar voor het afzetten; zet daarom twee mannetjes bij een vrouwtje, met een enkel mannetje komt het vaak niet tot afzetten.',
    bron: 'Aqua-fish.net, Fishlore, Aquadiction',
  },
  {
    id: 'hyphessobrycon-sweglesi', naam: 'Rode fantoomzalm', latijn: 'Hyphessobrycon sweglesi', groep: 'Karperzalmen (Characidae)', wijze: 'eierleggend', uitkomstdagen: 1, uitzwemdagen: 4, nest: [100, 200], temp: [25, 27], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'infusorien de eerste dagen, daarna pas ontloken artemia',
    tip: 'Deze soort zet in kleine porties af, verspreid over enkele ochtenden; laat het koppel drie dagen in de kweekbak en oogst elke ochtend de mop in plaats van een keer.',
    bron: 'Getallen bij benadering, afgeleid van de nauw verwante Hyphessobrycon megalopterus',
  },
  {
    id: 'hyphessobrycon-erythrostigma', naam: 'Bloedvlekzalm', latijn: 'Hyphessobrycon erythrostigma', groep: 'Karperzalmen (Characidae)', wijze: 'eierleggend', uitkomstdagen: 1, uitzwemdagen: 4, nest: [50, 100], temp: [25, 27], moeilijk: 3,
    eerstevoer: 'infusorien de eerste dagen, daarna pas ontloken artemia',
    tip: 'De vrouwtjes weigeren de mannetjes vaak; kweek met een groep van zes tot acht in een ruime, schemerige bak in plaats van met een afgezonderd koppel, dan komt het wel tot afzetten.',
    bron: 'Seriously Fish, AquaInfo, Aqua-fish.net',
  },
  {
    id: 'hyphessobrycon-flammeus', naam: 'Vuurzalm (Rio-zalm)', latijn: 'Hyphessobrycon flammeus', groep: 'Karperzalmen (Characidae)', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [200, 300], temp: [24, 26], moeilijk: 1,
    eerstevoer: 'infusorien en raderdiertjes, daarna pas ontloken artemia',
    tip: 'Deze soort kweekt ook in matig hard water en bij kamertemperatuur; het is daarom de zalm om aan te raden aan wie nog geen osmose-installatie heeft.',
    bron: 'AquaInfo kweekverslag Hyphessobrycon flammeus, Fishkeeper',
  },
  {
    id: 'hyphessobrycon-columbianus', naam: 'Colombiaanse roodvinzalm', latijn: 'Hyphessobrycon columbianus', groep: 'Karperzalmen (Characidae)', wijze: 'eierleggend', uitkomstdagen: 1, uitzwemdagen: 4, nest: [200, 300], temp: [24, 27], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'infusorien de eerste dagen, daarna pas ontloken artemia',
    tip: 'Deze soort is stevig gebouwd en bijterig naar vinnen; zet enkel goed doorvoede vissen af, want een uitgehongerd vrouwtje wordt door het mannetje kaalgebeten.',
    bron: 'Getallen bij benadering, afgeleid van verwante Hyphessobrycon-soorten van vergelijkbaar formaat',
  },
  {
    id: 'hyphessobrycon-bentosi', naam: 'Witpuntzalm (sierzalm)', latijn: 'Hyphessobrycon bentosi', groep: 'Karperzalmen (Characidae)', wijze: 'eierleggend', uitkomstdagen: 1, uitzwemdagen: 4, nest: [100, 200], temp: [26, 28], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'infusorien de eerste dagen, daarna pas ontloken artemia',
    tip: 'Wordt in de handel door elkaar gebruikt met de rozenzalm en Hyphessobrycon ornatus; kweek enkel met dieren uit dezelfde partij, anders krijgt u kruisingen die niemand op naam kan zetten.',
    bron: 'Getallen overgenomen van de nauw verwante Hyphessobrycon rosaceus',
  },
  {
    id: 'hyphessobrycon-rosaceus', naam: 'Rozenzalm', latijn: 'Hyphessobrycon rosaceus', groep: 'Karperzalmen (Characidae)', wijze: 'eierleggend', uitkomstdagen: 1, uitzwemdagen: 4, nest: [100, 200], temp: [26, 28], moeilijk: 2,
    eerstevoer: 'infusorien de eerste dagen, daarna pas ontloken artemia',
    tip: 'De eieren en larven zijn lichtgevoelig; zet de kweekbak in een donkere hoek of hang er een doek over tot de jongen vrij zwemmen.',
    bron: 'Seriously Fish, Aquadiction, Aqua-fish.net',
  },
  {
    id: 'hyphessobrycon-amandae', naam: 'Vuurzalmpje (ember tetra)', latijn: 'Hyphessobrycon amandae', groep: 'Karperzalmen (Characidae)', wijze: 'eierleggend', uitkomstdagen: 1, uitzwemdagen: 3, nest: [30, 60], temp: [26, 28], moeilijk: 2,
    eerstevoer: 'pantoffeldiertjes of groen water; artemia is de eerste week te groot',
    tip: 'De larven zijn zo klein dat ze pas ontloken artemia niet in de bek krijgen; begin met pantoffeldiertjes of groen water en stap pas na acht tot tien dagen over op artemia.',
    bron: 'AquaInfo, Fishkeeper, Aqua-fish.net',
  },
  {
    id: 'hyphessobrycon-anisitsi', naam: 'Buenos Aires zalm', latijn: 'Hyphessobrycon anisitsi', groep: 'Karperzalmen (Characidae)', wijze: 'eierleggend', uitkomstdagen: 1, uitzwemdagen: 4, nest: [500, 1000], temp: [22, 26], moeilijk: 1, zekerheid: 'onzeker',
    eerstevoer: 'infusorien of poedervoer, na twee dagen pas ontloken artemia',
    tip: 'Deze soort vreet alle zachte planten op; gebruik een wollen kweekmop in een verder lege bak en reken op enkele honderden jongen per legsel, dus voorzie opfokruimte vooraf.',
    bron: 'Het plantenvretende gedrag en de grote legsels zijn algemeen beschreven; de dagen zijn afgeleid van verwante soorten',
  },
  {
    id: 'boehlkea-fredcochui', naam: 'Blauwe zalm (Cochu)', latijn: 'Boehlkea fredcochui', groep: 'Karperzalmen (Characidae)', wijze: 'eierleggend', uitkomstdagen: 1, uitzwemdagen: 4, nest: [100, 200], temp: [25, 27], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'infusorien, daarna pas ontloken artemia of fijngewreven vlokvoer',
    tip: 'Deze soort plakt de eieren aan de onderkant van brede bladen; zet een paar breedbladige planten of een stuk plastic blad in de kweekbak en verhuis dat blad met eieren en al naar een aparte opfokbak.',
    bron: 'AquaInfo en Diszhal bevestigen het afzetgedrag; de dag- en aantalgegevens zijn bij benadering',
  },
  {
    id: 'astyanax-mexicanus', naam: 'Blinde holenzalm', latijn: 'Astyanax mexicanus', groep: 'Karperzalmen (Characidae)', wijze: 'eierleggend', uitkomstdagen: 1, uitzwemdagen: 6, nest: [500, 1000], temp: [22, 25], moeilijk: 1,
    eerstevoer: 'infusorien de eerste week, daarna pas ontloken artemia of fijn poedervoer',
    tip: 'De jongen worden mét ogen geboren die in de eerste weken dichtgroeien; dat is normaal en geen misvorming waarvoor u de klant moet waarschuwen.',
    bron: 'Seriously Fish, Fishkeeper, Aquarium Tidings',
  },
  {
    id: 'exodon-paradoxus', naam: 'Exodon (tandzalm)', latijn: 'Exodon paradoxus', groep: 'Karperzalmen (Characidae)', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 3, nest: [300, 1000], temp: [25, 28], moeilijk: 3,
    eerstevoer: 'pas ontloken artemia vanaf de eerste dag dat ze zwemmen',
    tip: 'Deze soort eet schubben van andere vissen en van elkaar; in een kleine kweekbak takelen twee dieren elkaar toe en daarom lukt kweek in een huiskamerbak zelden, houd ze in een groep van minstens twaalf in een ruime bak.',
    bron: 'Seriously Fish, AquaInfo, TFH Magazine',
  },
  /* ------------------------------------------------------------ Snoekzalmen (Lebiasinidae) */
  {
    id: 'nannostomus-beckfordi', naam: 'Gouden dwergsnoekzalm', latijn: 'Nannostomus beckfordi', groep: 'Snoekzalmen (Lebiasinidae)', wijze: 'eierleggend', uitkomstdagen: 1, uitzwemdagen: 6, nest: [50, 200], temp: [25, 27], moeilijk: 2,
    eerstevoer: 'infusorien of pantoffeldiertjes de eerste dagen, daarna pas ontloken artemia',
    tip: 'Deze soort eet zijn eigen eieren binnen enkele minuten op; laat ze afzetten boven een dik pak javamos of een rooster en haal de ouders al na twee uur weg.',
    bron: 'Seriously Fish, Fishkeeper, Fishi-pedia',
  },
  {
    id: 'nannostomus-marginatus', naam: 'Dwergsnoekzalm', latijn: 'Nannostomus marginatus', groep: 'Snoekzalmen (Lebiasinidae)', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 4, nest: [10, 30], temp: [25, 27], moeilijk: 2,
    eerstevoer: 'infusorien of pantoffeldiertjes, pas na een week artemia',
    tip: 'Deze soort zet per keer maar een handvol eieren af; laat het koppel een week in de kweekbak staan en oogst elke ochtend, in plaats van een groot legsel af te wachten.',
    bron: 'AquaInfo, Aquadiction, Diszhal',
  },
  {
    id: 'nannostomus-eques', naam: 'Schuinzwemmende snoekzalm', latijn: 'Nannostomus eques', groep: 'Snoekzalmen (Lebiasinidae)', wijze: 'eierleggend', uitkomstdagen: 1, uitzwemdagen: 5, nest: [30, 50], temp: [25, 27], moeilijk: 2,
    eerstevoer: 'infusorien of pantoffeldiertjes, daarna pas ontloken artemia',
    tip: 'Deze soort zet af vlak onder het wateroppervlak tussen drijfplanten; een kweekmop op de bodem blijft onbenut, hang het afzetmateriaal dus bovenaan.',
    bron: 'Seriously Fish, Aqua-fish.net, Diszhal',
  },
  {
    id: 'nannostomus-trifasciatus', naam: 'Driestreepsnoekzalm', latijn: 'Nannostomus trifasciatus', groep: 'Snoekzalmen (Lebiasinidae)', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 4, nest: [20, 50], temp: [26, 28], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'pantoffeldiertjes of groen water, pas na een week artemia',
    tip: 'Deze soort is de lastigste van de snoekzalmen: ze zet enkel af in zeer zacht, met turf gefilterd water en de meeste handelsdieren zijn wildvang die eerst maanden moeten aansterken.',
    bron: 'Getallen bij benadering, afgeleid van Nannostomus marginatus en mortenthaleri',
  },
  {
    id: 'nannostomus-mortenthaleri', naam: 'Koraalrode dwergsnoekzalm', latijn: 'Nannostomus mortenthaleri', groep: 'Snoekzalmen (Lebiasinidae)', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 4, nest: [10, 30], temp: [26, 28], moeilijk: 3,
    eerstevoer: 'pantoffeldiertjes of groen water, na een week pas ontloken artemia',
    tip: 'Zet een mannetje bij twee vrouwtjes in water onder 1 graad dH; twee mannetjes in een kleine kweekbak vechten tot een van beide het niet haalt.',
    bron: 'Seriously Fish, UKAPS kweekverslagen',
  },
  {
    id: 'copella-arnoldi', naam: 'Spatzalm', latijn: 'Copella arnoldi', groep: 'Snoekzalmen (Lebiasinidae)', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 1, nest: [100, 200], temp: [26, 28], moeilijk: 2,
    eerstevoer: 'infusorien en fijn stofvoer, daarna pas ontloken artemia',
    tip: 'Deze soort zet haar eieren bóven water af op een overhangend blad of op het glas; laat vijf tot acht centimeter lucht tussen water en deksel en laat het mannetje rustig zijn werk doen, hij houdt het legsel zelf nat door water omhoog te spatten.',
    bron: 'Seriously Fish, Aquarium Glaser, Fishkeeping News',
  },
  /* ------------------------------------------------------------ Bijlzalmen (Gasteropelecidae) */
  {
    id: 'carnegiella-strigata', naam: 'Marmerbijlzalm', latijn: 'Carnegiella strigata', groep: 'Bijlzalmen (Gasteropelecidae)', wijze: 'eierleggend', uitkomstdagen: 1, uitzwemdagen: 4, nest: [50, 100], temp: [26, 28], moeilijk: 3,
    eerstevoer: 'infusorien en pantoffeldiertjes, daarna pas ontloken artemia',
    tip: 'In een huiskamerbak lukt dit zelden: de vrouwtjes maken enkel eieren aan op een dieet van levende fruitvliegjes en zwarte muggenlarven, en de eieren hangen aan drijfplanten waar de ouders ze zelf weghalen.',
    bron: 'Seriously Fish, Fishkeeper, Aquadiction',
  },
  {
    id: 'carnegiella-marthae', naam: 'Zwarte bijlzalm', latijn: 'Carnegiella marthae', groep: 'Bijlzalmen (Gasteropelecidae)', wijze: 'eierleggend', uitkomstdagen: 1, uitzwemdagen: 4, nest: [50, 100], temp: [26, 28], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'infusorien en pantoffeldiertjes, daarna pas ontloken artemia',
    tip: 'Wat in de handel is, is vrijwel altijd wildvang; reken niet op nakweek en dek de bak sluitend af, want deze vissen vliegen bij schrik een halve meter uit het water.',
    bron: 'Getallen overgenomen van Carnegiella strigata; eigen kweekverslagen zijn niet teruggevonden',
  },
  {
    id: 'gasteropelecus-sternicla', naam: 'Zilveren bijlzalm', latijn: 'Gasteropelecus sternicla', groep: 'Bijlzalmen (Gasteropelecidae)', wijze: 'eierleggend', uitkomstdagen: 1, uitzwemdagen: 4, nest: [100, 200], temp: [25, 28], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'infusorien en pantoffeldiertjes, daarna pas ontloken artemia',
    tip: 'Deze soort is in de hobby zo goed als nooit nagekweekt en wordt ook niet commercieel gekweekt; alles in de handel is wildvang, dus verkoop ze als een soort om te houden en niet om mee te kweken.',
    bron: 'Fishkeeper en Aqua-fish.net melden dat er geen betrouwbare kweekverslagen bestaan; de getallen zijn afgeleid van Carnegiella strigata',
  },
  /* ------------------------------------------------------------ Zaagbuikzalmen (Serrasalmidae) */
  {
    id: 'metynnis-argenteus', naam: 'Zilverdollar', latijn: 'Metynnis argenteus', groep: 'Zaagbuikzalmen (Serrasalmidae)', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 5, nest: [1000, 2000], temp: [26, 28], moeilijk: 2,
    eerstevoer: 'infusorien, daarna pas ontloken artemia en fijngewreven spirulinavlokken',
    tip: 'Zilverdollars eten elke zachte plant op; hang javavaren of een kunstplant als afzetplaats en kweek in een bak van minstens 250 liter, want een koppel zet meer dan duizend eieren af.',
    bron: 'Seriously Fish, Aquariadise, RateMyFishTank',
  },
  {
    id: 'myloplus-rubripinnis', naam: 'Roodhaakzalm', latijn: 'Myloplus rubripinnis', groep: 'Zaagbuikzalmen (Serrasalmidae)', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 5, nest: [1000, 2000], temp: [26, 28], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'infusorien, daarna pas ontloken artemia',
    tip: 'Deze soort is in het aquarium zo goed als nooit nagekweekt: het vrouwtje ploegt met haar rode haakvin de bodem open om af te zetten en dat gedrag komt in een huiskamerbak niet op gang.',
    bron: 'Seriously Fish meldt dat er geen gevallen van aquariumkweek bekend zijn; de getallen zijn afgeleid van Metynnis argenteus',
  },
  {
    id: 'pygocentrus-nattereri', naam: 'Roodbuikpiranha', latijn: 'Pygocentrus nattereri', groep: 'Zaagbuikzalmen (Serrasalmidae)', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 4, nest: [1000, 3000], temp: [26, 28], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'pas ontloken artemia vanaf de eerste zwemdag, later fijn gehakte muggenlarven',
    tip: 'Een koppel maakt een kuil in de zandbodem en bewaakt het legsel fel; voer in die periode met een pincet en steek uw hand niet in de bak, ook niet voor een waterwissel.',
    bron: 'AquaInfo en NBAT beschrijven het kuilbroedgedrag; de dag- en aantalgegevens zijn bij benadering',
  },
  {
    id: 'colossoma-macropomum', naam: 'Pacu', latijn: 'Colossoma macropomum', groep: 'Zaagbuikzalmen (Serrasalmidae)', wijze: 'eierleggend', uitkomstdagen: 1, uitzwemdagen: 4, nest: [10000, 100000], temp: [25, 28], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'in kwekerijen raderdiertjes en artemia; in een aquarium komt het niet zover',
    tip: 'Wordt als handpalmgroot visje verkocht maar haalt meer dan zeventig centimeter en dertig kilo; kweek gebeurt alleen in beroepskwekerijen met hormooninjectie en lukt in een aquarium niet, waarschuw de klant vooraf over de eindmaat.',
    bron: 'Kweek gebeurt in de aquacultuur met hormooninductie; de getallen zijn ordegrootte-richtwaarden uit de viskweek, niet uit de hobby',
  },
  /* ------------------------------------------------------------ Kopstaanders (Anostomidae) */
  {
    id: 'anostomus-anostomus', naam: 'Gestreepte kopstaander', latijn: 'Anostomus anostomus', groep: 'Kopstaanders (Anostomidae)', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 4, nest: [500, 1000], temp: [25, 28], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'infusorien, daarna pas ontloken artemia en groenvoer',
    tip: 'Deze soort is in het aquarium nog niet met zekerheid nagekweekt; houd ze alleen of in een groep van zes, want bij twee of drie exemplaren jaagt de sterkste de andere dood.',
    bron: 'Seriously Fish en AquaInfo melden dat aquariumkweek niet gedocumenteerd is; de getallen zijn schattingen',
  },
  {
    id: 'leporinus-fasciatus', naam: 'Gebandeerde leporinus', latijn: 'Leporinus fasciatus', groep: 'Kopstaanders (Anostomidae)', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 4, nest: [500, 1000], temp: [25, 28], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'infusorien en groenvoer, daarna pas ontloken artemia',
    tip: 'Kweken lukt in de hobby niet omdat de soort een paaitrek nodig heeft; let vooral op de bak zelf, want deze vis wringt zich door elke kier van een centimeter en wordt dertig centimeter groot.',
    bron: 'Diszhal en Practical Fishkeeping; er zijn geen betrouwbare aquariumkweekverslagen, de getallen zijn schattingen',
  },
  /* ------------------------------------------------------------ Gevlekte kopstaanders (Chilodontidae) */
  {
    id: 'chilodus-punctatus', naam: 'Gevlekte kopstaander', latijn: 'Chilodus punctatus', groep: 'Gevlekte kopstaanders (Chilodontidae)', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 4, nest: [100, 300], temp: [26, 28], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'infusorien en pantoffeldiertjes, daarna pas ontloken artemia',
    tip: 'Een koppel zet af tussen plantenwortels in zeer zacht, zuur water, maar de eieren zijn uiterst schimmelgevoelig; haal de ouders weg en voeg een elzenproppenaftreksel toe, anders is het legsel na twee dagen wit.',
    bron: 'Seriously Fish beschrijft het afzetten tussen wortels; de dag- en aantalgegevens zijn bij benadering',
  },
  /* ------------------------------------------------------------ Distichodussen (Distichodontidae) */
  {
    id: 'distichodus-sexfasciatus', naam: 'Zesbandige distichodus', latijn: 'Distichodus sexfasciatus', groep: 'Distichodussen (Distichodontidae)', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 4, nest: [500, 2000], temp: [25, 28], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'infusorien en groenvoer; in een aquarium komt het niet zover',
    tip: 'Deze soort is nooit in gevangenschap nagekweekt omdat ze een paaitrek nodig heeft, en ze wordt meer dan zestig centimeter groot; verkoop het jonge, rood-zwarte visje alleen aan wie een bak van duizend liter klaar heeft staan.',
    bron: 'Seriously Fish meldt dat de soort niet in gevangenschap is nagekweekt; de getallen zijn schattingen',
  },
  /* ------------------------------------------------------------ Vlagstaartzalmen (Prochilodontidae) */
  {
    id: 'semaprochilodus-insignis', naam: 'Vlagstaartzalm', latijn: 'Semaprochilodus insignis', groep: 'Vlagstaartzalmen (Prochilodontidae)', wijze: 'eierleggend', uitkomstdagen: 1, uitzwemdagen: 4, nest: [10000, 50000], temp: [25, 28], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'in kwekerijen raderdiertjes en artemia; in een aquarium komt het niet zover',
    tip: 'Deze soort trekt in de natuur honderden kilometers voor het afzetten en kweekt in een aquarium niet; ze graast wel alle algen van de ruiten en wordt vijfendertig centimeter, dus reken op een bak van vijfhonderd liter.',
    bron: 'Paaitrek is algemeen beschreven; de getallen zijn ordegrootte-richtwaarden uit de beroepsvisserij, niet uit de hobby',
  },
  /* ------------------------------------------------------------ Barbelen */
  {
    id: 'puntigrus-tetrazona', naam: 'Sumatraan', latijn: 'Puntigrus tetrazona', groep: 'Barbelen', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [150, 300], temp: [25, 28], moeilijk: 2,
    eerstevoer: 'Infusorien of vloeibaar poedervoer de eerste drie dagen, daarna azijnaaltjes en pas ontloken artemia.',
    tip: 'Leg een laag knikkers of een kweekrooster op de bodem en haal het koppel binnen het uur na het afzetten weg, want sumatranen zoeken hun eigen eieren systematisch op.',
    bron: 'seriouslyfish.com, aquariadise.com',
  },
  {
    id: 'puntius-titteya', naam: 'Kersenbarbeel', latijn: 'Puntius titteya', groep: 'Barbelen', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 4, nest: [100, 250], temp: [25, 28], moeilijk: 2,
    eerstevoer: 'Infusorien en vloeibaar poedervoer, na vier of vijf dagen pas ontloken artemia.',
    tip: 'Kweek in koppels en niet in groep, want het dominante mannetje jaagt de andere mannetjes weg en kleurt zelf pas diep rood als hij een vrouwtje voor zich alleen heeft.',
    bron: 'aquainfo.nl, aquariumbreeder.com',
  },
  {
    id: 'pethia-padamya', naam: 'Odessabarbeel', latijn: 'Pethia padamya', groep: 'Barbelen', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 2, nest: [80, 150], temp: [24, 26], moeilijk: 2,
    eerstevoer: 'Infusorien, na twee dagen fijn poedervoer en pas ontloken artemia.',
    tip: 'Zet de kweekbak waar de ochtendzon binnenvalt, want het eerste licht brengt het afzetten op gang; het vrouwtje legt in porties van ongeveer twintig eieren verspreid over enkele uren.',
    bron: 'fishkeeper.co.uk, aquadiction.world',
  },
  {
    id: 'desmopuntius-pentazona', naam: 'Vijfstrepenbarbeel', latijn: 'Desmopuntius pentazona', groep: 'Barbelen', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 4, nest: [50, 100], temp: [28, 30], moeilijk: 3,
    eerstevoer: 'Infusorien de eerste vier dagen, daarna pas ontloken artemia.',
    tip: 'De jongen verdragen geen enkele verslechtering van het water: ververs met water van exact dezelfde temperatuur en hardheid en laat het traag inlopen, anders gaat het hele broed in een dag verloren.',
    bron: 'fishkeeper.co.uk, seriouslyfish.com',
  },
  {
    id: 'haludaria-fasciata', naam: 'Melonbarbeel', latijn: 'Haludaria fasciata', groep: 'Barbelen', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 1, nest: [100, 200], temp: [26, 27], moeilijk: 2,
    eerstevoer: 'Infusorien de eerste dagen, daarna microwormen en pas ontloken artemia.',
    tip: 'Gebruik een bodem van knikkers zodat de eieren buiten bereik vallen en haal de ouders weg zodra het afzetten stopt, want zij beginnen meteen daarna de eieren op te zoeken.',
    bron: 'fishkeeper.co.uk',
  },
  {
    id: 'pethia-conchonius', naam: 'Rozenbarbeel', latijn: 'Pethia conchonius', groep: 'Barbelen', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [200, 400], temp: [22, 26], moeilijk: 1, zekerheid: 'onzeker',
    eerstevoer: 'Infusorien of vloeibaar poedervoer, na drie dagen pas ontloken artemia.',
    tip: 'Deze barbeel wil koeler water dan de meeste tropische soorten: houd de kweekbak op 22 graden en verhoog dan twee tot drie graden, dat verhogen is de trigger om af te zetten.',
    bron: 'courante aquariumliteratuur, getallen niet per bron nagetrokken',
  },
  {
    id: 'pethia-nigrofasciata', naam: 'Purperkopbarbeel', latijn: 'Pethia nigrofasciata', groep: 'Barbelen', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [50, 120], temp: [26, 28], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'Infusorien de eerste dagen, daarna pas ontloken artemia.',
    tip: 'In hard leidingwater blijft het mannetje bleek en zet het vrouwtje niet af; filter over turf of gebruik osmosewater tot rond pH 6,5, dan kleurt de kop pas purper en komt de balts op gang.',
    bron: 'courante aquariumliteratuur, getallen niet per bron nagetrokken',
  },
  {
    id: 'pethia-gelius', naam: 'Gouden dwergbarbeel', latijn: 'Pethia gelius', groep: 'Barbelen', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [30, 100], temp: [20, 24], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'Infusorien of vloeibaar poedervoer, na drie dagen azijnaaltjes.',
    tip: 'Dit is een van de weinige barbelen die ook bij kamertemperatuur afzet; een onverwarmde bak in een lichte kamer geeft vaak meer resultaat dan een warme kweekbak.',
    bron: 'courante aquariumliteratuur, getallen niet per bron nagetrokken',
  },
  {
    id: 'pethia-ticto', naam: 'Tictobarbeel', latijn: 'Pethia ticto', groep: 'Barbelen', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [100, 200], temp: [24, 27], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'Infusorien, na drie dagen pas ontloken artemia.',
    tip: 'Let op de naamgeving in de handel: veel vis die als tictobarbeel verkocht wordt is in werkelijkheid Pethia stoliczkana, en die twee kruisen onderling, dus houd ze gescheiden als u zuiver wilt kweken.',
    bron: 'courante aquariumliteratuur, getallen niet per bron nagetrokken',
  },
  {
    id: 'pethia-stoliczkana', naam: 'Stoliczka\'s barbeel', latijn: 'Pethia stoliczkana', groep: 'Barbelen', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [100, 200], temp: [24, 27], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'Infusorien, na drie dagen pas ontloken artemia.',
    tip: 'Het vrouwtje zet af in dichte plukken javamos vlak onder het wateroppervlak; zonder zo\'n pluk verspreidt zij de eieren over de bodem en eten de ouders vrijwel alles op.',
    bron: 'courante aquariumliteratuur, getallen niet per bron nagetrokken',
  },
  {
    id: 'pethia-phutunio', naam: 'Dwergbarbeel Phutunio', latijn: 'Pethia phutunio', groep: 'Barbelen', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [30, 80], temp: [24, 27], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'Infusorien of vloeibaar poedervoer, daarna azijnaaltjes.',
    tip: 'Deze soort blijft onder vier centimeter en wordt in een gezelschapsbak weggedrukt; zet de kweekgroep apart in een kleine bak, anders komt zij nooit in conditie.',
    bron: 'courante aquariumliteratuur, getallen niet per bron nagetrokken',
  },
  {
    id: 'barbodes-semifasciolatus', naam: 'Goudbarbeel', latijn: 'Barbodes semifasciolatus', groep: 'Barbelen', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [150, 300], temp: [22, 26], moeilijk: 1, zekerheid: 'onzeker',
    eerstevoer: 'Infusorien of vloeibaar poedervoer, na drie dagen pas ontloken artemia.',
    tip: 'De goudkleurige Schuberti is een kweekvorm van de groene wildvorm; kruist u beide, dan komen in de tweede generatie weer groene jongen tevoorschijn, dus houd de vormen apart.',
    bron: 'courante aquariumliteratuur, getallen niet per bron nagetrokken',
  },
  {
    id: 'sahyadria-denisonii', naam: 'Denisonbarbeel', latijn: 'Sahyadria denisonii', groep: 'Barbelen', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [300, 600], temp: [24, 27], moeilijk: 3,
    eerstevoer: 'Fijn poedervoer en infusorien, na enkele dagen pas ontloken artemia.',
    tip: 'In een huiskamerbak zet deze soort vrijwel nooit spontaan af: alle handelsvis komt van kwekerijen die met hormoon werken, dus verkoop hem als sierviss en niet als kweekproject.',
    bron: 'Indian Journal of Fisheries, onderzoek naar kweek met ovaprim, uitkomst 36 uur bij 27,5 graden',
  },
  {
    id: 'sahyadria-chalakkudiensis', naam: 'Rode Denisonbarbeel', latijn: 'Sahyadria chalakkudiensis', groep: 'Barbelen', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [300, 600], temp: [24, 27], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Fijn poedervoer en infusorien, daarna pas ontloken artemia.',
    tip: 'Deze wordt groter en forser dan de gewone Denisonbarbeel en heeft minstens 150 centimeter baklengte met stroming nodig; kweek in de huiskamer is niet bekend.',
    bron: 'afgeleid van de nauw verwante Sahyadria denisonii',
  },
  {
    id: 'dawkinsia-filamentosa', naam: 'Vlagbarbeel', latijn: 'Dawkinsia filamentosa', groep: 'Barbelen', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [100, 250], temp: [24, 27], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'Infusorien de eerste dagen, daarna pas ontloken artemia.',
    tip: 'Enkel volwassen mannetjes krijgen de verlengde vinstralen, en dat duurt ruim een jaar; koop dus geen jonge vis in de veronderstelling dat u al koppels heeft.',
    bron: 'courante aquariumliteratuur, getallen niet per bron nagetrokken',
  },
  {
    id: 'dawkinsia-arulius', naam: 'Aruliusbarbeel', latijn: 'Dawkinsia arulius', groep: 'Barbelen', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [100, 250], temp: [24, 27], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Infusorien en fijn poedervoer, daarna pas ontloken artemia.',
    tip: 'Deze soort wil koel en zuurstofrijk stromend water; in een warme, rustige gezelschapsbak blijft zij bleek en zet zij niet af.',
    bron: 'courante aquariumliteratuur, getallen niet per bron nagetrokken',
  },
  {
    id: 'barbodes-everetti', naam: 'Clownbarbeel', latijn: 'Barbodes everetti', groep: 'Barbelen', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [100, 300], temp: [26, 28], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Infusorien, daarna pas ontloken artemia.',
    tip: 'Kweek lukt in een huiskamerbak zelden omdat de vis vijftien centimeter wordt en pas in een bak vanaf 150 centimeter in conditie komt; reken op aangekochte vis en niet op eigen nakweek.',
    bron: 'courante aquariumliteratuur, getallen niet per bron nagetrokken',
  },
  {
    id: 'barbodes-lateristriga', naam: 'T-barbeel', latijn: 'Barbodes lateristriga', groep: 'Barbelen', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [200, 500], temp: [24, 27], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Infusorien en fijn poedervoer, daarna pas ontloken artemia.',
    tip: 'Wordt tot achttien centimeter en verliest de zwarte T-tekening als hij ouder wordt; kweek in de huiskamer is zeldzaam omdat er een zeer ruime bak met stroming voor nodig is.',
    bron: 'courante aquariumliteratuur, getallen niet per bron nagetrokken',
  },
  {
    id: 'barbonymus-schwanenfeldii', naam: 'Vuurstaartbarbeel', latijn: 'Barbonymus schwanenfeldii', groep: 'Barbelen', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [1000, 5000], temp: [25, 28], moeilijk: 3,
    eerstevoer: 'Fijn poedervoer en pas ontloken artemia.',
    tip: 'Deze vis wordt dertig centimeter en zet enkel in vijvers af, meestal na een hormooninjectie; in een huiskamerbak lukt kweek niet en zelfs het houden vraagt al een bak vanaf 250 centimeter.',
    bron: 'onderzoek naar geinduceerde kweek met ovaprim en HCG, fishlore.com',
  },
  {
    id: 'barbonymus-altus', naam: 'Rodevinbarbeel', latijn: 'Barbonymus altus', groep: 'Barbelen', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [1000, 4000], temp: [25, 28], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Fijn poedervoer en pas ontloken artemia.',
    tip: 'Wordt vaak verkocht als kleinere versie van de vuurstaartbarbeel maar haalt nog altijd twintig centimeter; kweek gebeurt uitsluitend op Aziatische kwekerijen met hormoon.',
    bron: 'afgeleid van de nauw verwante Barbonymus schwanenfeldii',
  },
  {
    id: 'balantiocheilos-melanopterus', naam: 'Haaibarbeel', latijn: 'Balantiocheilos melanopterus', groep: 'Barbelen', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [1000, 5000], temp: [25, 28], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Fijn poedervoer en pas ontloken artemia.',
    tip: 'Deze soort is nooit in een huiskamerbak gekweekt: alle handelsvis komt van hormoonkweek in Aziatische vijvers, en de vis wordt dertig centimeter en zwemt in scholen, dus vertel de klant dat hij een bak van minstens 250 centimeter nodig heeft.',
    bron: 'kweekmoeilijkheid bevestigd via wikipedia en aquadiction.world, getallen bij benadering',
  },
  {
    id: 'oreichthys-crenuchoides', naam: 'Drakenvinbarbeel', latijn: 'Oreichthys crenuchoides', groep: 'Barbelen', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [30, 80], temp: [22, 26], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'Infusorien of vloeibaar poedervoer, na drie dagen azijnaaltjes.',
    tip: 'Het mannetje klapt zijn hoge rugvin enkel open tijdens de balts en alleen bij voldoende vrouwtjes; houd twee vrouwtjes per mannetje, anders ziet u het kweekgedrag nooit.',
    bron: 'courante aquariumliteratuur, getallen niet per bron nagetrokken',
  },
  {
    id: 'desmopuntius-rhomboocellatus', naam: 'Ruitvlekbarbeel', latijn: 'Desmopuntius rhomboocellatus', groep: 'Barbelen', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 4, nest: [40, 100], temp: [26, 29], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Infusorien de eerste dagen, daarna pas ontloken artemia.',
    tip: 'Dit is een uitgesproken zwartwatervis: zonder eikenblad of elzenproppen en een pH onder 6 komt het afzetten niet op gang en beschimmelen de eieren binnen een dag.',
    bron: 'courante aquariumliteratuur, getallen niet per bron nagetrokken',
  },
  {
    id: 'desmopuntius-johorensis', naam: 'Johorebarbeel', latijn: 'Desmopuntius johorensis', groep: 'Barbelen', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 4, nest: [50, 120], temp: [26, 29], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Infusorien, daarna pas ontloken artemia.',
    tip: 'Wordt in de handel geregeld verward met de vijfstrepenbarbeel; deze soort heeft een langwerpiger lijf en meer smalle strepen, en heeft eveneens zacht zuur water nodig om af te zetten.',
    bron: 'courante aquariumliteratuur, getallen niet per bron nagetrokken',
  },
  /* ------------------------------------------------------------ Danio's */
  {
    id: 'danio-rerio', naam: 'Zebravis', latijn: 'Danio rerio', groep: 'Danio\'s', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 2, nest: [100, 400], temp: [24, 27], moeilijk: 1,
    eerstevoer: 'Vloeibaar poedervoer of infusorien, na drie dagen azijnaaltjes en pas ontloken artemia.',
    tip: 'Zebravissen eten hun eigen eieren op: leg knikkers of een kweekrooster op de bodem zodat de eieren erdoorheen vallen en schep de ouders er na een uur uit.',
    bron: 'breed gedocumenteerd, onder meer als laboratoriummodel',
  },
  {
    id: 'danio-rerio-var-frankei', naam: 'Luipaarddanio', latijn: 'Danio rerio var. frankei', groep: 'Danio\'s', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 2, nest: [100, 400], temp: [24, 27], moeilijk: 1,
    eerstevoer: 'Vloeibaar poedervoer of infusorien, daarna azijnaaltjes en pas ontloken artemia.',
    tip: 'Dit is geen aparte soort maar een kleurvorm van de zebravis; kruist u hem met gestreepte zebravissen, dan krijgt u jongen met een mengeling van stippen en strepen.',
    bron: 'identiek aan Danio rerio, kleurvorm',
  },
  {
    id: 'danio-albolineatus', naam: 'Parelmoerdanio', latijn: 'Danio albolineatus', groep: 'Danio\'s', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [80, 200], temp: [24, 26], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'Infusorien of vloeibaar poedervoer, na drie dagen pas ontloken artemia.',
    tip: 'De parelmoerglans komt pas uit bij zijlicht; zonder een lichtinval van opzij ziet de klant een grijze vis en koopt hij hem niet, terwijl de kweek zelf net zo eenvoudig is als bij de zebravis.',
    bron: 'courante aquariumliteratuur, getallen niet per bron nagetrokken',
  },
  {
    id: 'danio-nigrofasciatus', naam: 'Dwergdanio', latijn: 'Danio nigrofasciatus', groep: 'Danio\'s', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [40, 100], temp: [24, 27], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'Infusorien of vloeibaar poedervoer, daarna azijnaaltjes.',
    tip: 'Deze danio zet minder eieren af dan de zebravis maar herhaalt dat om de paar dagen; laat een dikke pluk javamos in de bak en oogst die wekelijks in plaats van op een groot legsel te wachten.',
    bron: 'courante aquariumliteratuur, getallen niet per bron nagetrokken',
  },
  {
    id: 'danio-choprae', naam: 'Vuurringdanio', latijn: 'Danio choprae', groep: 'Danio\'s', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 4, nest: [100, 300], temp: [24, 26], moeilijk: 2,
    eerstevoer: 'Infusorien de eerste drie dagen, daarna pas ontloken artemia.',
    tip: 'Sluit het deksel volledig, want tijdens de baltsjacht springen deze danio\'s uit de bak; zij herhalen het afzetten om de twee of drie dagen.',
    bron: 'fishkeeper.co.uk, Tropical Fish Hobbyist',
  },
  {
    id: 'danio-tinwini', naam: 'Gouden ringdanio', latijn: 'Danio tinwini', groep: 'Danio\'s', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 3, nest: [50, 150], temp: [24, 26], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'Infusorien of vloeibaar poedervoer, daarna pas ontloken artemia.',
    tip: 'Deze soort is iets kleiner en rustiger dan de vuurringdanio en gedijt bij lagere temperatuur; boven 27 graden verkort u de levensduur zonder dat er meer jongen komen.',
    bron: 'afgeleid van de nauw verwante Danio choprae',
  },
  {
    id: 'danio-kerri', naam: 'Blauwe danio', latijn: 'Danio kerri', groep: 'Danio\'s', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [80, 200], temp: [24, 27], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'Infusorien of vloeibaar poedervoer, daarna pas ontloken artemia.',
    tip: 'Deze danio zet het liefst af in het vroege ochtendlicht boven een knikkerbodem; houd de groep op minstens acht stuks, want in kleinere groepen komt de balts niet op gang.',
    bron: 'courante aquariumliteratuur, getallen niet per bron nagetrokken',
  },
  {
    id: 'danio-roseus', naam: 'Rozendanio', latijn: 'Danio roseus', groep: 'Danio\'s', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [80, 200], temp: [22, 26], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'Infusorien of vloeibaar poedervoer, daarna pas ontloken artemia.',
    tip: 'Deze soort wordt in de handel vaak door elkaar gehaald met de parelmoerdanio; koop uit een partij en niet een enkele vis, anders houdt u kruisingen over die de roze gloed verliezen.',
    bron: 'courante aquariumliteratuur, getallen niet per bron nagetrokken',
  },
  {
    id: 'danio-aesculapii', naam: 'Panterdanio', latijn: 'Danio aesculapii', groep: 'Danio\'s', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [50, 150], temp: [23, 26], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'Infusorien of vloeibaar poedervoer, daarna azijnaaltjes en pas ontloken artemia.',
    tip: 'Verwar deze soort niet met de luipaarddanio: de panterdanio is een echte soort met een grijsblauw net van vlekken, en hij kruist wel degelijk met de zebravis, dus houd de bakken gescheiden.',
    bron: 'courante aquariumliteratuur, getallen niet per bron nagetrokken',
  },
  {
    id: 'danio-margaritatus', naam: 'Sterrendanio', latijn: 'Danio margaritatus', groep: 'Danio\'s', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 3, nest: [20, 30], temp: [23, 26], moeilijk: 2,
    eerstevoer: 'Infusorien, microwormen of vloeibaar poedervoer, daarna pas ontloken artemia.',
    tip: 'Het koppel zet om de twee dagen een handvol eieren af in javamos; haal de mospluk wekelijks uit de bak en laat hem apart uitkomen, anders eten de ouders alles op.',
    bron: 'seriouslyfish.com, fishkeeper.co.uk',
  },
  {
    id: 'danio-erythromicron', naam: 'Smaragddanio', latijn: 'Danio erythromicron', groep: 'Danio\'s', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 3, nest: [5, 20], temp: [22, 25], moeilijk: 2,
    eerstevoer: 'Infusorien of fijn poedervoer, na een week pas ontloken artemia.',
    tip: 'Dit is een doorlopende afzetter die elke dag enkele eieren legt: wissel dagelijks een paaimop of mospluk in plaats van op een groot legsel te wachten.',
    bron: 'fishkeeper.co.uk, aqua-fish.net',
  },
  {
    id: 'devario-aequipinnatus', naam: 'Reuzendanio', latijn: 'Devario aequipinnatus', groep: 'Danio\'s', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 2, nest: [150, 300], temp: [24, 28], moeilijk: 1,
    eerstevoer: 'Vloeibaar poedervoer en infusorien, na twee dagen pas ontloken artemia.',
    tip: 'Zet de kweekbak bij een raam met ochtendzon, want dat natuurlijke licht is bij deze soort de betrouwbaarste trigger om af te zetten.',
    bron: 'aquadiction.world, tropical-fish-keeping.com',
  },
  {
    id: 'devario-malabaricus', naam: 'Malabardanio', latijn: 'Devario malabaricus', groep: 'Danio\'s', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 2, nest: [150, 300], temp: [24, 27], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'Vloeibaar poedervoer en infusorien, daarna pas ontloken artemia.',
    tip: 'Deze soort wordt vaak als reuzendanio verkocht maar blijft iets kleiner en heeft een fellere blauwe streep; ook hier geldt dat u de ouders meteen na het afzetten weg moet halen.',
    bron: 'afgeleid van de nauw verwante Devario aequipinnatus',
  },
  {
    id: 'devario-pathirana', naam: 'Pathiranadanio', latijn: 'Devario pathirana', groep: 'Danio\'s', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [50, 150], temp: [24, 27], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'Infusorien of vloeibaar poedervoer, daarna pas ontloken artemia.',
    tip: 'De mannetjes bijten elkaar de vinnen kapot in een te kleine bak; houd de groep op tien of meer stuks in minstens honderd centimeter lengte, dan verdeelt de agressie zich.',
    bron: 'courante aquariumliteratuur, getallen niet per bron nagetrokken',
  },
  {
    id: 'devario-devario', naam: 'Bengaalse danio', latijn: 'Devario devario', groep: 'Danio\'s', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [100, 250], temp: [22, 26], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'Vloeibaar poedervoer en infusorien, daarna pas ontloken artemia.',
    tip: 'Deze danio verdraagt koeler water tot rond 18 graden en is daarmee geschikt voor een onverwarmde binnenbak, maar voor de kweek gaat u best naar 24 graden.',
    bron: 'courante aquariumliteratuur, getallen niet per bron nagetrokken',
  },
  {
    id: 'microdevario-kubotai', naam: 'Groene dwergdanio', latijn: 'Microdevario kubotai', groep: 'Danio\'s', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [20, 40], temp: [24, 26], moeilijk: 3,
    eerstevoer: 'Infusorien of vloeibaar poedervoer de eerste week, pas daarna pas ontloken artemia.',
    tip: 'De jongen zijn zo klein dat pas ontloken artemia de eerste week nog te groot is; zonder een lopende infusorienkweek of vloeibaar poedervoer verhongeren ze binnen enkele dagen.',
    bron: 'aquadiction.world, gensou.sg',
  },
  {
    id: 'sundadanio-axelrodi', naam: 'Blauwe dwergdanio', latijn: 'Sundadanio axelrodi', groep: 'Danio\'s', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [10, 30], temp: [24, 27], moeilijk: 3,
    eerstevoer: 'Infusorien uit de bak zelf, aangevuld met vloeibaar poedervoer.',
    tip: 'Deze soort kweekt alleen in een ingelopen, dicht beplante zwartwaterbak met pH onder 6 waar zij als enige vis zit; laat de jongen tussen het blad opgroeien in plaats van ze over te zetten.',
    bron: 'seriouslyfish.com',
  },
  {
    id: 'tanichthys-albonubes', naam: 'Witte wolk bergvis', latijn: 'Tanichthys albonubes', groep: 'Danio\'s', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 3, nest: [30, 100], temp: [18, 22], moeilijk: 1,
    eerstevoer: 'Infusorien of vloeibaar poedervoer, na drie dagen pas ontloken artemia.',
    tip: 'De ouders eten hun jongen nauwelijks op, dus u hoeft niets over te zetten: laat een dikke pluk mos in een onverwarmde bak en verlaag het water tijdelijk naar 16 tot 18 graden om het afzetten te starten.',
    bron: 'aquainfo.nl, aquahoy.com',
  },
  {
    id: 'tanichthys-micagemmae', naam: 'Vietnamese witte wolk', latijn: 'Tanichthys micagemmae', groep: 'Danio\'s', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 3, nest: [20, 60], temp: [20, 24], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'Infusorien of vloeibaar poedervoer, daarna pas ontloken artemia.',
    tip: 'Deze soort wil iets warmer water dan de gewone witte wolk en blijft kleiner; houd de twee niet samen, want zij kruisen en de jongen zijn dan niet meer als soort verkoopbaar.',
    bron: 'afgeleid van de nauw verwante Tanichthys albonubes',
  },
  {
    id: 'sawbwa-resplendens', naam: 'Sawbwabarbeel', latijn: 'Sawbwa resplendens', groep: 'Danio\'s', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 3, nest: [5, 20], temp: [21, 24], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Infusorien of vloeibaar poedervoer, na een week pas ontloken artemia.',
    tip: 'Deze soort strooit haar eieren niet maar plakt ze aan de onderkant van breed blad of een paaimop; hang zo\'n mop op en haal die dagelijks weg, anders vindt u geen enkel ei terug.',
    bron: 'kweekgedrag beschreven op aquaristatlas.com en het forum van Aquarium Co-Op, getallen bij benadering',
  },
  {
    id: 'laubuka-dadiburjori', naam: 'Dadio', latijn: 'Laubuka dadiburjori', groep: 'Danio\'s', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [20, 60], temp: [24, 27], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'Infusorien of vloeibaar poedervoer, daarna azijnaaltjes.',
    tip: 'Dit is een oppervlaktevis die uit de bak springt bij elke verstoring; werk met een gesloten deksel en voer drijvend, anders ziet de vis het voer niet eens.',
    bron: 'courante aquariumliteratuur, getallen niet per bron nagetrokken',
  },
  {
    id: 'esomus-danrica', naam: 'Vliegende barbeel', latijn: 'Esomus danrica', groep: 'Danio\'s', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [50, 150], temp: [24, 28], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'Infusorien of vloeibaar poedervoer, daarna pas ontloken artemia.',
    tip: 'Deze vis heeft lange baarddraden en zwemt vlak onder het oppervlak; dek de bak volledig af, want hij springt over afstanden van meer dan een halve meter.',
    bron: 'courante aquariumliteratuur, getallen niet per bron nagetrokken',
  },
  {
    id: 'danionella-cerebrum', naam: 'Danionella', latijn: 'Danionella cerebrum', groep: 'Danio\'s', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 3, nest: [5, 20], temp: [22, 26], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Infusorien en pantoffeldiertjes, later heel fijn poedervoer.',
    tip: 'Deze vis blijft onder de anderhalve centimeter en is doorschijnend; houd hem alleen in een eigen bak zonder andere vissen, want in een gezelschapsbak wordt hij niet gezien en niet gevoerd.',
    bron: 'beperkt beschikbare literatuur, soort pas recent in de handel',
  },
  /* ------------------------------------------------------------ Rasbora's */
  {
    id: 'trigonostigma-heteromorpha', naam: 'Kegelvlekbarbeel', latijn: 'Trigonostigma heteromorpha', groep: 'Rasbora\'s', wijze: 'eierleggend', uitkomstdagen: 1, uitzwemdagen: 3, nest: [30, 80], temp: [26, 28], moeilijk: 3,
    eerstevoer: 'Infusorien de eerste dagen, daarna pas ontloken artemia.',
    tip: 'Deze soort plakt haar eieren aan de onderkant van breed blad en niet op de bodem: zonder cryptocorynes of echinodorussen met stevig blad, en zonder zacht zuur water rond pH 6, zet het koppel eenvoudigweg niet af.',
    bron: 'fishkeeper.co.uk, aqua-fish.net',
  },
  {
    id: 'trigonostigma-hengeli', naam: 'Hengels rasbora', latijn: 'Trigonostigma hengeli', groep: 'Rasbora\'s', wijze: 'eierleggend', uitkomstdagen: 1, uitzwemdagen: 3, nest: [20, 50], temp: [26, 29], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Infusorien de eerste dagen, daarna pas ontloken artemia.',
    tip: 'De oranje gloed boven de zwarte wig komt er pas bij zacht, donker zwartwater met eikenblad; in helder hard water blijft de vis grauw en komt er geen kweek van.',
    bron: 'afgeleid van de nauw verwante Trigonostigma heteromorpha',
  },
  {
    id: 'trigonostigma-espei', naam: 'Espes rasbora', latijn: 'Trigonostigma espei', groep: 'Rasbora\'s', wijze: 'eierleggend', uitkomstdagen: 1, uitzwemdagen: 3, nest: [20, 60], temp: [26, 29], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Infusorien de eerste dagen, daarna pas ontloken artemia.',
    tip: 'Ook deze soort keert zich op de rug om de eieren aan de onderkant van een blad te plakken; leg dus geen paaimop maar plaats breedbladige cryptocorynes in de kweekbak.',
    bron: 'afgeleid van de nauw verwante Trigonostigma heteromorpha',
  },
  {
    id: 'trigonostigma-somphongsi', naam: 'Somphongs rasbora', latijn: 'Trigonostigma somphongsi', groep: 'Rasbora\'s', wijze: 'eierleggend', uitkomstdagen: 1, uitzwemdagen: 3, nest: [15, 40], temp: [26, 29], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Infusorien, daarna pas ontloken artemia.',
    tip: 'Deze soort was in het wild bijna verdwenen en de vis in de handel komt uit nakweekprogramma\'s; koop enkel nakweek en geef bij verkoop mee dat wildvang hier niet aan de orde is.',
    bron: 'courante aquariumliteratuur, getallen niet per bron nagetrokken',
  },
  {
    id: 'rasbora-trilineata', naam: 'Schaarrasbora', latijn: 'Rasbora trilineata', groep: 'Rasbora\'s', wijze: 'eierleggend', uitkomstdagen: 1, uitzwemdagen: 3, nest: [100, 200], temp: [24, 27], moeilijk: 2,
    eerstevoer: 'Pas ontloken artemia en microwormen, eventueel vooraf infusorien.',
    tip: 'De eieren zijn niet kleverig en rollen over de bodem weg; gebruik een laag knikkers of grof grind zodat ze buiten bereik van de ouders vallen.',
    bron: 'seriouslyfish.com, Animals (2025) over kweek en ontogenie',
  },
  {
    id: 'rasbora-borapetensis', naam: 'Roodstaartrasbora', latijn: 'Rasbora borapetensis', groep: 'Rasbora\'s', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [50, 150], temp: [24, 27], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'Infusorien de eerste dagen, daarna pas ontloken artemia.',
    tip: 'Dit is een van de gemakkelijkst kweekbare rasbora\'s: zet een groep in een bak met veel javamos en zacht water en haal de volwassen vis er na twee dagen uit.',
    bron: 'courante aquariumliteratuur, getallen niet per bron nagetrokken',
  },
  {
    id: 'trigonopoma-pauciperforatum', naam: 'Roodlijnrasbora', latijn: 'Trigonopoma pauciperforatum', groep: 'Rasbora\'s', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [30, 100], temp: [25, 28], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Infusorien, daarna pas ontloken artemia.',
    tip: 'De rode lijn verdwijnt in helder hard water en de vis zet dan niet af; filter over turf of eikenblad tot de pH rond 6 zit en houd de verlichting gedempt.',
    bron: 'courante aquariumliteratuur, getallen niet per bron nagetrokken',
  },
  {
    id: 'trigonopoma-gracile', naam: 'Groene rasbora', latijn: 'Trigonopoma gracile', groep: 'Rasbora\'s', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [30, 80], temp: [25, 28], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Infusorien, daarna pas ontloken artemia.',
    tip: 'Deze soort wordt vaak samen met de roodlijnrasbora ingevoerd en verward; zij heeft eveneens zwartwater nodig en kweekt in een gewone gezelschapsbak zelden of nooit.',
    bron: 'courante aquariumliteratuur, getallen niet per bron nagetrokken',
  },
  {
    id: 'rasbora-einthovenii', naam: 'Bruinband rasbora', latijn: 'Rasbora einthovenii', groep: 'Rasbora\'s', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [30, 100], temp: [24, 28], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Infusorien, daarna pas ontloken artemia.',
    tip: 'Deze rasbora springt uit de bak zodra er iets beweegt en heeft zacht zuur water nodig; kweek in de huiskamer wordt maar zelden gemeld, reken er dus niet op.',
    bron: 'courante aquariumliteratuur, getallen niet per bron nagetrokken',
  },
  {
    id: 'rasbora-kalochroma', naam: 'Clownrasbora', latijn: 'Rasbora kalochroma', groep: 'Rasbora\'s', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [30, 100], temp: [25, 28], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Infusorien, daarna pas ontloken artemia.',
    tip: 'Deze soort is in de huiskamer vrijwel nooit gekweekt en komt meestal als wildvang binnen; zij heeft echt zwartwater nodig en blijft in gewoon leidingwater kwetsbaar voor huidproblemen.',
    bron: 'courante aquariumliteratuur, getallen niet per bron nagetrokken',
  },
  {
    id: 'brevibora-dorsiocellata', naam: 'Smaragdoograsbora', latijn: 'Brevibora dorsiocellata', groep: 'Rasbora\'s', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [30, 80], temp: [25, 28], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'Infusorien de eerste dagen, daarna pas ontloken artemia.',
    tip: 'Het blauwgroene oog licht enkel op bij gedempte verlichting boven een donkere bodem; in een fel verlichte bak met lichte grind ziet de klant niets van het kenmerk waar hij voor betaalt.',
    bron: 'courante aquariumliteratuur, getallen niet per bron nagetrokken',
  },
  {
    id: 'rasbora-caudimaculata', naam: 'Reuzenschaarrasbora', latijn: 'Rasbora caudimaculata', groep: 'Rasbora\'s', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [100, 300], temp: [24, 27], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Pas ontloken artemia en microwormen.',
    tip: 'Deze rasbora wordt vijftien centimeter en heeft een bak vanaf 150 centimeter met stroming nodig; kweek lukt in de huiskamer zelden omdat de groep te weinig zwemruimte krijgt.',
    bron: 'courante aquariumliteratuur, getallen niet per bron nagetrokken',
  },
  {
    id: 'rasbora-vaterifloris', naam: 'Parelrasbora', latijn: 'Rasbora vaterifloris', groep: 'Rasbora\'s', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [30, 80], temp: [25, 28], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Infusorien, daarna pas ontloken artemia.',
    tip: 'Deze soort uit Sri Lanka verdraagt geen hoge nitraatwaarden; ververs wekelijks een derde en houd de groep klein, dan blijft de roze glans behouden.',
    bron: 'courante aquariumliteratuur, getallen niet per bron nagetrokken',
  },
  {
    id: 'boraras-brigittae', naam: 'Chilirasbora', latijn: 'Boraras brigittae', groep: 'Rasbora\'s', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [5, 15], temp: [25, 28], moeilijk: 2,
    eerstevoer: 'Infusorien uit de bak zelf en vloeibaar poedervoer, na een week pas ontloken artemia.',
    tip: 'Deze soort legt elke dag een paar eieren in javamos: laat de kweekbak gewoon staan met veel mos en amandelblad, want overzetten kost meestal meer jongen dan de ouders opeten.',
    bron: 'aquainfo.nl, tankarium.com',
  },
  {
    id: 'boraras-maculatus', naam: 'Gevlekte dwergrasbora', latijn: 'Boraras maculatus', groep: 'Rasbora\'s', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [5, 15], temp: [25, 28], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'Infusorien en vloeibaar poedervoer, later pas ontloken artemia.',
    tip: 'Deze dwergrasbora wordt in een gezelschapsbak met grotere vissen niet oud; zet hem apart met garnalen, dan zet hij vanzelf af en groeien er jongen op tussen het mos.',
    bron: 'afgeleid van de nauw verwante Boraras brigittae',
  },
  {
    id: 'boraras-merah', naam: 'Merah dwergrasbora', latijn: 'Boraras merah', groep: 'Rasbora\'s', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [5, 15], temp: [25, 28], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'Infusorien en vloeibaar poedervoer, later pas ontloken artemia.',
    tip: 'Deze soort wordt regelmatig als chilirasbora verkocht maar heeft een duidelijke zwarte vlek in plaats van een doorlopende streep; houd de soorten gescheiden om kruising te vermijden.',
    bron: 'afgeleid van de nauw verwante Boraras brigittae',
  },
  {
    id: 'boraras-urophthalmoides', naam: 'Oogvlekdwergrasbora', latijn: 'Boraras urophthalmoides', groep: 'Rasbora\'s', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [5, 15], temp: [24, 28], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'Infusorien en vloeibaar poedervoer, later pas ontloken artemia.',
    tip: 'Deze soort is van alle Boraras het minst kieskeurig op water en lukt ook bij matig zacht water; voer levend of diepvriesvoer van klein formaat, want droogvoer neemt zij vaak niet aan.',
    bron: 'afgeleid van de nauw verwante Boraras brigittae',
  },
  {
    id: 'boraras-naevus', naam: 'Aardbeirasbora', latijn: 'Boraras naevus', groep: 'Rasbora\'s', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [5, 15], temp: [25, 28], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'Infusorien en vloeibaar poedervoer, later pas ontloken artemia.',
    tip: 'De vis kleurt pas rood na enkele weken rust in een donker ingerichte bak met eikenblad; verkoop hem daarom niet meteen na aankomst, want dan is hij nog bleek en blijft hij staan.',
    bron: 'afgeleid van de nauw verwante Boraras brigittae',
  },
  /* ------------------------------------------------------------ Algeneters en labeo's */
  {
    id: 'crossocheilus-oblongus', naam: 'Siamese algeneter', latijn: 'Crossocheilus oblongus', groep: 'Algeneters en labeo\'s', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [100, 500], temp: [24, 26], moeilijk: 3,
    eerstevoer: 'Fijn poedervoer en aangroei van algen op stenen.',
    tip: 'Deze soort is nooit in een huiskamerbak gekweekt en komt uitsluitend van kwekerijen met hormooninjecties; let bij aankoop op dat de zwarte streep helemaal tot in de staartvin doorloopt, anders koopt u een goudgestreepte algeneter die als volwassen vis geen draadalg meer eet.',
    bron: 'seriouslyfish.com, theshrimpfarm.com',
  },
  {
    id: 'crossocheilus-atrilimes', naam: 'Zwartlijn algeneter', latijn: 'Crossocheilus atrilimes', groep: 'Algeneters en labeo\'s', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [100, 500], temp: [24, 26], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Fijn poedervoer en aangroei van algen op stenen.',
    tip: 'Deze soort wordt vaak als Siamese algeneter verkocht maar eet vooral javamos in plaats van draadalg; kweek in de huiskamer is niet bekend.',
    bron: 'seriouslyfish.com voor determinatie, kweekgetallen bij benadering',
  },
  {
    id: 'crossocheilus-reticulatus', naam: 'Gevlekte algeneter', latijn: 'Crossocheilus reticulatus', groep: 'Algeneters en labeo\'s', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [100, 500], temp: [24, 26], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Fijn poedervoer en aangroei van algen op stenen.',
    tip: 'Deze soort eet minder algen dan de gewone Siamese algeneter en wordt groter; zij is in de huiskamer niet te kweken en alle handelsvis komt van kwekerij of wildvang.',
    bron: 'courante aquariumliteratuur, getallen bij benadering',
  },
  {
    id: 'epalzeorhynchos-bicolor', naam: 'Vuurstaartlabeo', latijn: 'Epalzeorhynchos bicolor', groep: 'Algeneters en labeo\'s', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [20, 100], temp: [25, 27], moeilijk: 3,
    eerstevoer: 'Fijn poedervoer en pas ontloken artemia.',
    tip: 'In een huiskamerbak is deze soort nog nooit gekweekt, want kwekerijen werken sinds de jaren tachtig met hormooninjecties; houd bovendien maar een exemplaar per bak, omdat twee elkaar tot de dood opjagen.',
    bron: 'seriouslyfish.com, tfhmagazine.com',
  },
  {
    id: 'epalzeorhynchos-frenatum', naam: 'Roodvinlabeo', latijn: 'Epalzeorhynchos frenatum', groep: 'Algeneters en labeo\'s', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [20, 100], temp: [25, 27], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Fijn poedervoer en pas ontloken artemia.',
    tip: 'Ook deze soort komt volledig van hormoonkweek en zet in de huiskamer niet af; hij verdedigt een vaste schuilplaats, dus geef hem een eigen holte of hij jaagt de hele bak rond.',
    bron: 'kweekwijze afgeleid van de nauw verwante Epalzeorhynchos bicolor',
  },
  {
    id: 'epalzeorhynchos-munense', naam: 'Epalzeorhynchos munense', latijn: 'Epalzeorhynchos munense', groep: 'Algeneters en labeo\'s', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [20, 100], temp: [24, 27], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Fijn poedervoer en pas ontloken artemia.',
    tip: 'Deze soort is minder agressief dan de vuurstaartlabeo en komt maar af en toe binnen; kweek in de huiskamer is niet beschreven.',
    bron: 'beperkte literatuur, getallen afgeleid van het geslacht',
  },
  {
    id: 'garra-flavatra', naam: 'Pantergarra', latijn: 'Garra flavatra', groep: 'Algeneters en labeo\'s', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [20, 60], temp: [22, 26], moeilijk: 3,
    eerstevoer: 'Fijn poedervoer en aangroei, na enkele dagen pas ontloken artemia.',
    tip: 'Het afzetten komt bij deze soort meestal op gang na een grotere waterwissel met iets koeler water in de vroege ochtend; dat is de enige trigger die betrouwbaar gemeld wordt.',
    bron: 'seriouslyfish.com, aquariumbreeder.com',
  },
  {
    id: 'garra-rufa', naam: 'Doktersvis', latijn: 'Garra rufa', groep: 'Algeneters en labeo\'s', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [50, 200], temp: [22, 26], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Fijn poedervoer en aangroei op stenen.',
    tip: 'Deze vis knabbelt aan huid en slijm van andere vissen en hoort niet in een gewone gezelschapsbak; kweek gebeurt in kweekvijvers en lukt in een huiskamerbak zelden.',
    bron: 'courante aquariumliteratuur, getallen niet per bron nagetrokken',
  },
  {
    id: 'gyrinocheilus-aymonieri', naam: 'Chinese algeneter', latijn: 'Gyrinocheilus aymonieri', groep: 'Algeneters en labeo\'s', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [100, 500], temp: [24, 27], moeilijk: 3,
    eerstevoer: 'Fijn poedervoer en aangroei op stenen.',
    tip: 'Deze soort is in de huiskamer niet te kweken en komt van hormoonkweek, maar belangrijker voor de klant: als volwassen vis eet hij nauwelijks nog algen en gaat hij zich vastzuigen op het slijm van bredere vissen zoals goudvis of schubkarper.',
    bron: 'seriouslyfish.com, wikipedia',
  },
  /* ------------------------------------------------------------ Pantsermeervallen (Corydoras) */
  {
    id: 'corydoras-aeneus', naam: 'Metaalpantsermeerval', latijn: 'Corydoras aeneus', groep: 'Pantsermeervallen (Corydoras)', wijze: 'eierleggend', uitkomstdagen: 4, uitzwemdagen: 3, nest: [50, 150], temp: [22, 26], moeilijk: 1,
    eerstevoer: 'Fijn poedervoer en pas ontloken artemia, na een week ook microwormen',
    tip: 'Schraap het legsel met een oud bankkaartje van de ruit en breng het naar een apart bakje: de ouders zoeken hun eigen eieren af en eten ze binnen een dag op.',
    bron: 'aquainfo.nl/8-stappen-kweken-van-corydoras/',
  },
  {
    id: 'corydoras-aeneus-var-albino', naam: 'Albino pantsermeerval', latijn: 'Corydoras aeneus var. albino', groep: 'Pantsermeervallen (Corydoras)', wijze: 'eierleggend', uitkomstdagen: 4, uitzwemdagen: 3, nest: [50, 150], temp: [22, 26], moeilijk: 1,
    eerstevoer: 'Fijn poedervoer en pas ontloken artemia',
    tip: 'Albino\'s zien slecht: geef het poedervoer elke dag op dezelfde plek en houd de verlichting laag, anders vinden de jongen hun voer niet terug.',
    bron: 'aquainfo.nl/kweek-corydoras-aeneus-albino/',
  },
  {
    id: 'corydoras-paleatus', naam: 'Peper-en-zoutpantsermeerval', latijn: 'Corydoras paleatus', groep: 'Pantsermeervallen (Corydoras)', wijze: 'eierleggend', uitkomstdagen: 5, uitzwemdagen: 3, nest: [50, 200], temp: [18, 24], moeilijk: 1,
    eerstevoer: 'Fijn poedervoer en pas ontloken artemia',
    tip: 'Deze soort wil koeler water dan de andere Corydoras: boven 25 graden zet zij nauwelijks nog af, terwijl een waterwissel met water van 18 tot 20 graden de kweek meteen op gang brengt.',
    bron: 'aquaforum.nl kweekverslag corydoras paleatus',
  },
  {
    id: 'corydoras-panda', naam: 'Pandapantsermeerval', latijn: 'Corydoras panda', groep: 'Pantsermeervallen (Corydoras)', wijze: 'eierleggend', uitkomstdagen: 5, uitzwemdagen: 3, nest: [10, 50], temp: [22, 25], moeilijk: 2,
    eerstevoer: 'Pas ontloken artemia en fijn poedervoer',
    tip: 'De eieren van panda schimmelen sneller dan die van andere Corydoras: leg ze apart met een luchtsteen en een druppel methyleenblauw en haal elke dag de witte eitjes eruit.',
    bron: 'aquainfo.nl/en/article/corydoras-panda-panda-corydoras/',
  },
  {
    id: 'corydoras-sterbai', naam: 'Sterbai pantsermeerval', latijn: 'Corydoras sterbai', groep: 'Pantsermeervallen (Corydoras)', wijze: 'eierleggend', uitkomstdagen: 4, uitzwemdagen: 3, nest: [30, 120], temp: [24, 28], moeilijk: 2,
    eerstevoer: 'Pas ontloken artemia en fijn poedervoer',
    tip: 'Sterbai is een warmwatersoort: houd hem op 26 tot 28 graden en zet de kweek in gang met een wissel van 50 procent water dat 3 tot 5 graden kouder is.',
    bron: 'gensou.sg/corydoras-sterbai-breeding-guide/',
  },
  {
    id: 'corydoras-julii', naam: 'Julii pantsermeerval', latijn: 'Corydoras julii', groep: 'Pantsermeervallen (Corydoras)', wijze: 'eierleggend', uitkomstdagen: 4, uitzwemdagen: 3, nest: [20, 80], temp: [23, 26], moeilijk: 2,
    eerstevoer: 'Pas ontloken artemia en fijn poedervoer',
    tip: 'Wat als julii verkocht wordt is bijna altijd C. trilineatus: controleer of de kop fijne losse stippen heeft in plaats van een lijnenpatroon voor u er een kweekgroep van samenstelt.',
    bron: 'seriouslyfish.com/species/corydoras-julii/',
  },
  {
    id: 'corydoras-trilineatus', naam: 'Valse julii pantsermeerval', latijn: 'Corydoras trilineatus', groep: 'Pantsermeervallen (Corydoras)', wijze: 'eierleggend', uitkomstdagen: 4, uitzwemdagen: 3, nest: [20, 100], temp: [22, 26], moeilijk: 2,
    eerstevoer: 'Pas ontloken artemia en fijn poedervoer',
    tip: 'Zij zet haar eieren in kleine porties over meerdere dagen af, dus kijk een week lang elke ochtend de ruiten en de planten na in plaats van eenmalig.',
    bron: 'seriouslyfish.com/species/corydoras-trilineatus/',
  },
  {
    id: 'corydoras-habrosus', naam: 'Dwergpantsermeerval habrosus', latijn: 'Corydoras habrosus', groep: 'Pantsermeervallen (Corydoras)', wijze: 'eierleggend', uitkomstdagen: 4, uitzwemdagen: 3, nest: [5, 25], temp: [22, 26], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'Infusorien of azijnaaltjes de eerste vier dagen, daarna pas ontloken artemia',
    tip: 'De jongen zijn te klein voor pas ontloken artemia: geef de eerste dagen azijnaaltjes of infusorien, anders verhongeren ze in een bak vol voer.',
    bron: 'algemene Corydoras-kweekliteratuur; aantallen naar analogie met C. pygmaeus',
  },
  {
    id: 'corydoras-pygmaeus', naam: 'Dwergpantsermeerval pygmaeus', latijn: 'Corydoras pygmaeus', groep: 'Pantsermeervallen (Corydoras)', wijze: 'eierleggend', uitkomstdagen: 4, uitzwemdagen: 3, nest: [10, 30], temp: [22, 26], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'Infusorien of azijnaaltjes, na vier dagen pas ontloken artemia',
    tip: 'Zij zet de eieren los tussen javamos af in plaats van in een tros: leg een flinke pol mos in de bak en haal die er na het afzetten in zijn geheel uit.',
    bron: 'aquainfo.nl Corydoras-kweekartikelen; legselgrootte bij benadering',
  },
  {
    id: 'corydoras-hastatus', naam: 'Dwergpantsermeerval hastatus', latijn: 'Corydoras hastatus', groep: 'Pantsermeervallen (Corydoras)', wijze: 'eierleggend', uitkomstdagen: 4, uitzwemdagen: 3, nest: [10, 30], temp: [22, 26], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'Infusorien of azijnaaltjes, na vier dagen pas ontloken artemia',
    tip: 'Hij zwemt in het midden van de bak en komt enkel in kweekconditie in een groep van minstens tien dieren; met vier of vijf exemplaren gebeurt er niets.',
    bron: 'aquariumliteratuur over dwergcorydoras; getallen bij benadering',
  },
  {
    id: 'corydoras-adolfoi', naam: 'Corydoras adolfoi', latijn: 'Corydoras adolfoi', groep: 'Pantsermeervallen (Corydoras)', wijze: 'eierleggend', uitkomstdagen: 5, uitzwemdagen: 3, nest: [15, 50], temp: [22, 26], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Pas ontloken artemia en fijn poedervoer',
    tip: 'Hij zet enkel af in zacht zuur water met een geleidbaarheid onder 150 microsiemens; in gewoon Vlaams leidingwater blijven de eieren onbevrucht en worden ze binnen twee dagen wit.',
    bron: 'kweekverslagen op aquainfo.nl en planetcatfish.com; getallen bij benadering',
  },
  {
    id: 'corydoras-duplicareus', naam: 'Corydoras duplicareus', latijn: 'Corydoras duplicareus', groep: 'Pantsermeervallen (Corydoras)', wijze: 'eierleggend', uitkomstdagen: 5, uitzwemdagen: 3, nest: [15, 50], temp: [22, 26], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Pas ontloken artemia en fijn poedervoer',
    tip: 'Hij lijkt sterk op adolfoi maar heeft een bredere zwarte rugstreep; houd de twee gescheiden, want kruislingen zijn in de handel waardeloos.',
    bron: 'kweekverslagen hobbyisten; getallen bij benadering',
  },
  {
    id: 'corydoras-schwartzi', naam: 'Corydoras schwartzi', latijn: 'Corydoras schwartzi', groep: 'Pantsermeervallen (Corydoras)', wijze: 'eierleggend', uitkomstdagen: 5, uitzwemdagen: 3, nest: [20, 60], temp: [23, 27], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Pas ontloken artemia en fijn poedervoer',
    tip: 'Wildvangdieren blijven vaak jaren onvruchtbaar: koop gekweekte exemplaren en geef ze een half jaar op zacht water voor u een kweekpoging doet.',
    bron: 'hobbykweekverslagen; getallen bij benadering',
  },
  {
    id: 'corydoras-arcuatus', naam: 'Boogstreeppantsermeerval', latijn: 'Corydoras arcuatus', groep: 'Pantsermeervallen (Corydoras)', wijze: 'eierleggend', uitkomstdagen: 4, uitzwemdagen: 3, nest: [20, 60], temp: [23, 27], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Pas ontloken artemia en fijn poedervoer',
    tip: 'Hij zet af op de ruit vlak onder het wateroppervlak in plaats van tussen planten; laat de bovenste tien centimeter van de achterruit vrij van decor.',
    bron: 'hobbykweekverslagen; getallen bij benadering',
  },
  {
    id: 'corydoras-metae', naam: 'Corydoras metae', latijn: 'Corydoras metae', groep: 'Pantsermeervallen (Corydoras)', wijze: 'eierleggend', uitkomstdagen: 4, uitzwemdagen: 3, nest: [20, 60], temp: [23, 26], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Pas ontloken artemia en fijn poedervoer',
    tip: 'Hij zet zelden spontaan af in een gezelschapsbak: zet drie mannen op een wijfje in een apart bakje van 40 liter met een zandbodem en één eikenblad.',
    bron: 'hobbykweekverslagen; getallen bij benadering',
  },
  {
    id: 'corydoras-rabauti', naam: 'Rode pantsermeerval', latijn: 'Corydoras rabauti', groep: 'Pantsermeervallen (Corydoras)', wijze: 'eierleggend', uitkomstdagen: 4, uitzwemdagen: 3, nest: [20, 60], temp: [22, 26], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Pas ontloken artemia en fijn poedervoer',
    tip: 'De jongen hebben een zwart-oranje jeugdkleed dat helemaal niet op de ouders lijkt; verkoop ze pas na drie maanden, anders herkent niemand de soort.',
    bron: 'hobbykweekverslagen; getallen bij benadering',
  },
  {
    id: 'corydoras-venezuelanus', naam: 'Venezuela oranje pantsermeerval', latijn: 'Corydoras venezuelanus', groep: 'Pantsermeervallen (Corydoras)', wijze: 'eierleggend', uitkomstdagen: 4, uitzwemdagen: 3, nest: [40, 120], temp: [22, 26], moeilijk: 1, zekerheid: 'onzeker',
    eerstevoer: 'Fijn poedervoer en pas ontloken artemia',
    tip: 'Hij kweekt even vlot als de metaalpantsermeerval, maar kruist er ook mee: houd de twee soorten in aparte bakken als u zuivere jongen wilt verkopen.',
    bron: 'analogie met C. aeneus; handelservaring',
  },
  {
    id: 'scleromystax-barbatus', naam: 'Baardpantsermeerval', latijn: 'Scleromystax barbatus', groep: 'Pantsermeervallen (Corydoras)', wijze: 'eierleggend', uitkomstdagen: 6, uitzwemdagen: 4, nest: [20, 80], temp: [18, 23], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Pas ontloken artemia en fijn poedervoer',
    tip: 'Dit is een koudwatersoort uit het kustgebergte van Brazilie: boven 24 graden zet hij niet af en gaat hij op termijn dood, houd hem in een onverwarmde bak.',
    bron: 'seriouslyfish.com en hobbykweekverslagen; getallen bij benadering',
  },
  /* ------------------------------------------------------------ Pantsermeervallen (Brochis) */
  {
    id: 'corydoras-splendens-brochis-splendens', naam: 'Smaragdpantsermeerval', latijn: 'Corydoras splendens (Brochis splendens)', groep: 'Pantsermeervallen (Brochis)', wijze: 'eierleggend', uitkomstdagen: 4, uitzwemdagen: 3, nest: [100, 300], temp: [22, 26], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Pas ontloken artemia en fijn poedervoer',
    tip: 'Een legsel loopt op tot enkele honderden eieren: gebruik een opkweekbak van minstens 60 liter, want in een klein bakje slaat het water om zodra de jongen gaan eten.',
    bron: 'seriouslyfish.com/species/corydoras-splendens/; legselgrootte bij benadering',
  },
  {
    id: 'corydoras-britskii-brochis-britskii', naam: 'Grote smaragdpantsermeerval', latijn: 'Corydoras britskii (Brochis britskii)', groep: 'Pantsermeervallen (Brochis)', wijze: 'eierleggend', uitkomstdagen: 4, uitzwemdagen: 3, nest: [100, 300], temp: [22, 26], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Pas ontloken artemia en fijn poedervoer',
    tip: 'Hij wordt 9 cm en heeft een zandbodem nodig van minstens 80 cm lang; op grind slijt hij zijn bekdraden af en zet hij niet meer af.',
    bron: 'aquariumliteratuur over Brochis; getallen bij benadering',
  },
  /* ------------------------------------------------------------ Pantsermeervallen (Aspidoras) */
  {
    id: 'aspidoras-pauciradiatus', naam: 'Aspidoras pauciradiatus', latijn: 'Aspidoras pauciradiatus', groep: 'Pantsermeervallen (Aspidoras)', wijze: 'eierleggend', uitkomstdagen: 4, uitzwemdagen: 3, nest: [10, 30], temp: [23, 26], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Infusorien of azijnaaltjes, daarna pas ontloken artemia',
    tip: 'Hij zet \'s nachts af onder een blad of in een donkere hoek: laat de bak een nacht volledig donker en kijk \'s ochtends onder de bladeren in plaats van op de ruit.',
    bron: 'aquainfo.nl/aspidoras-pauciradiatus-kweekverslag/; getallen bij benadering',
  },
  /* ------------------------------------------------------------ Schuimnestmeervallen (Callichthyidae) */
  {
    id: 'megalechis-thoracata-hoplosternum-thoracatum', naam: 'Hoplo of schuimnestmeerval', latijn: 'Megalechis thoracata (Hoplosternum thoracatum)', groep: 'Schuimnestmeervallen (Callichthyidae)', wijze: 'eierleggend', uitkomstdagen: 4, uitzwemdagen: 4, nest: [200, 1000], temp: [24, 28], moeilijk: 2,
    eerstevoer: 'Pas ontloken artemia, microwormen en fijn poedervoer',
    tip: 'Leg een stuk piepschuim of een omgekeerd plantenbakje op het water: daaronder bouwt de man zijn schuimnest, en laat hem daarna met rust want hij verdedigt het nest fel tegen alles wat in de buurt komt.',
    bron: 'seriouslyfish.com/species/megalechis-thoracata/',
  },
  {
    id: 'callichthys-callichthys', naam: 'Gewone panzerwels', latijn: 'Callichthys callichthys', groep: 'Schuimnestmeervallen (Callichthyidae)', wijze: 'eierleggend', uitkomstdagen: 4, uitzwemdagen: 4, nest: [100, 500], temp: [22, 26], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'Pas ontloken artemia en fijn poedervoer',
    tip: 'Hij bouwt zijn schuimnest bij voorkeur onder een breed drijvend blad; zonder drijfplanten of piepschuim komt het nest er niet en blijven de eieren op de bodem liggen.',
    bron: 'aquariumliteratuur over Callichthyidae; getallen bij benadering',
  },
  {
    id: 'dianema-urostriatum', naam: 'Vlagstaartmeerval', latijn: 'Dianema urostriatum', groep: 'Schuimnestmeervallen (Callichthyidae)', wijze: 'eierleggend', uitkomstdagen: 4, uitzwemdagen: 4, nest: [100, 500], temp: [24, 28], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Pas ontloken artemia en fijn poedervoer',
    tip: 'Hij bouwt een schuimnest maar doet dat in een huiskamerbak zelden; hij heeft een rustige bak zonder snelle medebewoners nodig en schrikt van elke beweging voor de ruit.',
    bron: 'beperkte kweekverslagen; getallen naar analogie met Megalechis',
  },
  /* ------------------------------------------------------------ Harnasmeervallen (Ancistrus) */
  {
    id: 'ancistrus-cf-cirrhosus', naam: 'Gewone antennemeerval (borstelneus)', latijn: 'Ancistrus cf. cirrhosus', groep: 'Harnasmeervallen (Ancistrus)', wijze: 'eierleggend', uitkomstdagen: 6, uitzwemdagen: 6, nest: [30, 80], temp: [24, 28], moeilijk: 1,
    eerstevoer: 'Geblancheerde courgette, groenvoertabletten en fijn poedervoer',
    tip: 'Geef een kweekbuis van ongeveer 5 cm doorsnee die aan een kant dicht is: de man bewaakt daar het legsel in, en als u de buis oppakt om te kijken gooit hij de eieren eruit.',
    bron: 'aquainfo.nl/het-kweken-van-ancistrussen/',
  },
  {
    id: 'ancistrus-cf-cirrhosus-var-albino', naam: 'Albino antennemeerval', latijn: 'Ancistrus cf. cirrhosus var. albino', groep: 'Harnasmeervallen (Ancistrus)', wijze: 'eierleggend', uitkomstdagen: 6, uitzwemdagen: 6, nest: [30, 80], temp: [24, 28], moeilijk: 1,
    eerstevoer: 'Geblancheerde courgette, groenvoertabletten en fijn poedervoer',
    tip: 'Albino\'s krijgen snel een te dikke buik van alleen komkommer: geef er hout bij om te raspen en een keer per week een eiwitrijke tablet, anders blijven de wijfjes zonder eieren.',
    bron: 'aquainfo.nl/het-kweken-van-ancistrussen/',
  },
  {
    id: 'ancistrus-cf-cirrhosus-var-longfin', naam: 'Sluierstaart antennemeerval', latijn: 'Ancistrus cf. cirrhosus var. longfin', groep: 'Harnasmeervallen (Ancistrus)', wijze: 'eierleggend', uitkomstdagen: 6, uitzwemdagen: 6, nest: [30, 70], temp: [24, 28], moeilijk: 1,
    eerstevoer: 'Geblancheerde courgette, groenvoertabletten en fijn poedervoer',
    tip: 'De lange vinnen scheuren aan scherp hout en aan de rand van een te nauwe kweekbuis: gebruik gladgesleten hout en een buis van minstens 5 cm doorsnee.',
    bron: 'handelservaring; kweekgegevens gelijk aan gewone Ancistrus',
  },
  {
    id: 'ancistrus-sp-l144', naam: 'L144 gele antennemeerval', latijn: 'Ancistrus sp. L144', groep: 'Harnasmeervallen (Ancistrus)', wijze: 'eierleggend', uitkomstdagen: 6, uitzwemdagen: 6, nest: [30, 60], temp: [24, 28], moeilijk: 1, zekerheid: 'onzeker',
    eerstevoer: 'Geblancheerde courgette, groenvoertabletten en fijn poedervoer',
    tip: 'L144 is een kweekvorm en geen wilde soort: kruist u hem met een gewone bruine ancistrus, dan zijn de jongen bruin en is de gele kleur uit de lijn verdwenen.',
    bron: 'handelservaring; kweekgegevens naar analogie met Ancistrus cf. cirrhosus',
  },
  {
    id: 'ancistrus-dolichopterus', naam: 'L183 sterrenhemel antennemeerval', latijn: 'Ancistrus dolichopterus', groep: 'Harnasmeervallen (Ancistrus)', wijze: 'eierleggend', uitkomstdagen: 6, uitzwemdagen: 7, nest: [25, 60], temp: [26, 29], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Fijn poedervoer, geblancheerde courgette en diepvriesartemia',
    tip: 'Dit is de enige ancistrus die echt zacht zuur water nodig heeft met een pH onder 6: in gewoon leidingwater blijven de eieren onbevrucht, wat de soort in de handel duur en schaars houdt.',
    bron: 'seriouslyfish.com/species/ancistrus-dolichopterus/; dagen bij benadering',
  },
  /* ------------------------------------------------------------ Harnasmeervallen (Hypancistrus) */
  {
    id: 'hypancistrus-zebra', naam: 'L046 zebrapleco', latijn: 'Hypancistrus zebra', groep: 'Harnasmeervallen (Hypancistrus)', wijze: 'eierleggend', uitkomstdagen: 6, uitzwemdagen: 12, nest: [7, 15], temp: [28, 30], moeilijk: 3,
    eerstevoer: 'Diepvriesartemia, cyclops en eiwitrijk poedervoer, geen algentabletten',
    tip: 'De zebra is een vleeseter en geen algeneter of houtrasper: geef diepvriesartemia en eiwitrijke tabletten, houd 28 tot 30 graden met veel stroming, en koop uitsluitend gekweekte dieren met papieren want wildvang mag Brazilie niet uitvoeren.',
    bron: 'aquainfo.nl/en/article/hypancistrus-zebra-zebra-pleco-l046/ en zebrapleco.com',
  },
  {
    id: 'hypancistrus-sp-l201', naam: 'L201 sneeuwbalpleco', latijn: 'Hypancistrus sp. L201', groep: 'Harnasmeervallen (Hypancistrus)', wijze: 'eierleggend', uitkomstdagen: 6, uitzwemdagen: 9, nest: [8, 20], temp: [27, 30], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Diepvriesartemia, cyclops en eiwitrijk poedervoer',
    tip: 'L201 blijft klein en wordt in een gezelschapsbak weggeconcurreerd bij het voer: zet een kweekgroep apart en voer \'s avonds na het doven van de lampen.',
    bron: 'kweekverslagen op planetcatfish.com; dagen naar analogie met andere Hypancistrus',
  },
  {
    id: 'hypancistrus-sp-l066', naam: 'L066 koningstijgerpleco', latijn: 'Hypancistrus sp. L066', groep: 'Harnasmeervallen (Hypancistrus)', wijze: 'eierleggend', uitkomstdagen: 7, uitzwemdagen: 9, nest: [10, 25], temp: [27, 30], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Diepvriesartemia, cyclops en eiwitrijk poedervoer',
    tip: 'De man laat de jongen pas uit de holte als ze hun dooierzak op hebben: haal de holte niet leeg, maar leg er een paar reservegrotten bij zodat andere mannen hem niet verjagen.',
    bron: 'kweekverslagen hobbyisten; getallen bij benadering',
  },
  {
    id: 'hypancistrus-sp-l129', naam: 'L129 Colombiaanse zebrapleco', latijn: 'Hypancistrus sp. L129', groep: 'Harnasmeervallen (Hypancistrus)', wijze: 'eierleggend', uitkomstdagen: 6, uitzwemdagen: 9, nest: [8, 18], temp: [26, 29], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Diepvriesartemia, cyclops en eiwitrijk poedervoer',
    tip: 'Hij blijft onder de 9 cm en kweekt in een groep van zes tot acht dieren beter dan per koppel; geef minstens evenveel holtes als er mannen zijn.',
    bron: 'kweekverslagen hobbyisten; getallen bij benadering',
  },
  {
    id: 'hypancistrus-sp-l260', naam: 'L260 queen arabesque', latijn: 'Hypancistrus sp. L260', groep: 'Harnasmeervallen (Hypancistrus)', wijze: 'eierleggend', uitkomstdagen: 7, uitzwemdagen: 10, nest: [8, 15], temp: [28, 30], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Diepvriesartemia, cyclops en eiwitrijk poedervoer',
    tip: 'Hij komt uit warm snelstromend water van de Rio Tapajos: zonder een stromingspomp en 28 graden blijft de kweek uit, ook als de dieren er verder gezond uitzien.',
    bron: 'kweekverslagen hobbyisten; getallen bij benadering',
  },
  /* ------------------------------------------------------------ Harnasmeervallen (Peckoltia) */
  {
    id: 'peckoltia-compta', naam: 'L134 Peckoltia', latijn: 'Peckoltia compta', groep: 'Harnasmeervallen (Peckoltia)', wijze: 'eierleggend', uitkomstdagen: 7, uitzwemdagen: 10, nest: [20, 40], temp: [27, 29], moeilijk: 3,
    eerstevoer: 'Fijn poedervoer, diepvriesartemia en een stuk zacht hout',
    tip: 'De man bewaakt het legsel zeven dagen en de jongen teren daarna nog tien dagen op een grote dooierzak: laat de holte in die periode volledig met rust, ook als u niets ziet bewegen.',
    bron: 'planetcatfish.com Shane\'s World, Breeding Peckoltia compta',
  },
  /* ------------------------------------------------------------ Harnasmeervallen (Panaqolus) */
  {
    id: 'panaqolus-maccus', naam: 'Clownpleco L104', latijn: 'Panaqolus maccus', groep: 'Harnasmeervallen (Panaqolus)', wijze: 'eierleggend', uitkomstdagen: 7, uitzwemdagen: 8, nest: [20, 40], temp: [26, 29], moeilijk: 2,
    eerstevoer: 'Fijn poedervoer en geraspte houtresten, na een week geblancheerde courgette',
    tip: 'Zonder hout gaat hij dood: hij raspt moerbei- of eikenhout en verteert dat, voertabletten alleen volstaan niet en zonder hout zetten de wijfjes ook geen eieren af.',
    bron: 'aquainfo.nl/artikel/panaqolus-maccus-clown-pleco/',
  },
  {
    id: 'panaqolus-albivermis', naam: 'L204 flitspleco', latijn: 'Panaqolus albivermis', groep: 'Harnasmeervallen (Panaqolus)', wijze: 'eierleggend', uitkomstdagen: 7, uitzwemdagen: 9, nest: [20, 40], temp: [26, 29], moeilijk: 3,
    eerstevoer: 'Fijn poedervoer, geraspt hout en geblancheerde courgette',
    tip: 'De man is nerveus en gooit het legsel uit de holte zodra u te vaak komt kijken of het water vervuilt; controleer hooguit een keer per week en wissel klein maar regelmatig.',
    bron: 'planetcatfish.com Shane\'s World, Spawning Panaque sp. L204',
  },
  {
    id: 'panaqolus-sp-l397', naam: 'L397 Alenquer tijgerpleco', latijn: 'Panaqolus sp. L397', groep: 'Harnasmeervallen (Panaqolus)', wijze: 'eierleggend', uitkomstdagen: 7, uitzwemdagen: 9, nest: [25, 40], temp: [26, 29], moeilijk: 3,
    eerstevoer: 'Fijn poedervoer, geraspt hout en geblancheerde courgette',
    tip: 'Hij zet af in een nauwe holte van ongeveer 3 cm doorsnee waar het wijfje net in kan: in een te ruime grot verspreidt het legsel zich en waaiert de man het niet meer schoon.',
    bron: 'aquainfo.nl/en/article/panaqolus-sp-l397/',
  },
  /* ------------------------------------------------------------ Harnasmeervallen (Panaque) */
  {
    id: 'panaque-nigrolineatus', naam: 'L190 koningspleco', latijn: 'Panaque nigrolineatus', groep: 'Harnasmeervallen (Panaque)', wijze: 'eierleggend', uitkomstdagen: 8, uitzwemdagen: 12, nest: [20, 50], temp: [26, 29], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Fijn poedervoer en geraspt hout',
    tip: 'Hij wordt 40 cm en kweekt in een huiskamerbak vrijwel nooit omdat hij daar zijn volwassen maat niet haalt; reken op minstens 500 liter en een zware filter, want hij produceert veel houtafval.',
    bron: 'beperkte kweekverslagen uit kweekstations; getallen bij benadering',
  },
  /* ------------------------------------------------------------ Harnasmeervallen (Baryancistrus) */
  {
    id: 'baryancistrus-xanthellus', naam: 'L018 goudstippleco', latijn: 'Baryancistrus xanthellus', groep: 'Harnasmeervallen (Baryancistrus)', wijze: 'eierleggend', uitkomstdagen: 7, uitzwemdagen: 10, nest: [20, 50], temp: [27, 30], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Fijn poedervoer en diepvriesartemia',
    tip: 'In een huiskamerbak kweekt hij zo goed als nooit: hij komt uit snelstromend zuurstofrijk water van de Rio Xingu en vrijwel alle handelsdieren zijn wildvang, dus reken niet op nakweek.',
    bron: 'planetcatfish.com soortbeschrijving; kweekgegevens grotendeels onbekend',
  },
  /* ------------------------------------------------------------ Harnasmeervallen (Hemiancistrus) */
  {
    id: 'hemiancistrus-subviridis', naam: 'L200 groene fantoompleco', latijn: 'Hemiancistrus subviridis', groep: 'Harnasmeervallen (Hemiancistrus)', wijze: 'eierleggend', uitkomstdagen: 7, uitzwemdagen: 9, nest: [20, 40], temp: [27, 30], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Fijn poedervoer, diepvriesartemia en geblancheerde courgette',
    tip: 'Hij heeft veel zuurstof en stroming nodig en is gevoelig voor nitraat boven 25 milligram per liter; zonder wekelijkse grote wissel blijft de kweek uit en verliest hij zijn groene kleur.',
    bron: 'beperkte kweekverslagen; getallen bij benadering',
  },
  /* ------------------------------------------------------------ Harnasmeervallen (Chaetostoma) */
  {
    id: 'chaetostoma-sp-l444', naam: 'Bulldogpleco L444', latijn: 'Chaetostoma sp. (L444)', groep: 'Harnasmeervallen (Chaetostoma)', wijze: 'eierleggend', uitkomstdagen: 7, uitzwemdagen: 8, nest: [20, 60], temp: [22, 25], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Aanslag, spirulinapoeder en geblancheerde courgette',
    tip: 'Hij komt uit koele bergbeken: houd 22 tot 25 graden met sterke stroming, in een warme rustige bak kweekt hij niet en gaat hij meestal binnen het jaar dood.',
    bron: 'beperkte kweekverslagen; getallen bij benadering',
  },
  /* ------------------------------------------------------------ Harnasmeervallen (Hypostomus) */
  {
    id: 'hypostomus-plecostomus', naam: 'Gewone zuigmeerval', latijn: 'Hypostomus plecostomus', groep: 'Harnasmeervallen (Hypostomus)', wijze: 'eierleggend', uitkomstdagen: 7, uitzwemdagen: 7, nest: [200, 500], temp: [23, 28], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Geblancheerde courgette, spirulinapoeder en groenvoertabletten',
    tip: 'Hij graaft in de natuur een gang van een halve meter in de oever om af te zetten en kan dat in een aquarium niet, dus kweek lukt er niet; vertel klanten ook dat hij 40 cm wordt.',
    bron: 'aquariumliteratuur en vijverkwekerijen; getallen uit natuurwaarnemingen',
  },
  /* ------------------------------------------------------------ Harnasmeervallen (Pterygoplichthys) */
  {
    id: 'pterygoplichthys-gibbiceps', naam: 'Zeilvinmeerval', latijn: 'Pterygoplichthys gibbiceps', groep: 'Harnasmeervallen (Pterygoplichthys)', wijze: 'eierleggend', uitkomstdagen: 7, uitzwemdagen: 7, nest: [300, 1000], temp: [23, 28], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Geblancheerde courgette, spirulinapoeder en groenvoertabletten',
    tip: 'Hij kweekt alleen in vijvers waar hij een gang in de oever kan graven, nooit in een bak; hij wordt 45 cm en de handelsdieren komen uit Aziatische vijverkweek.',
    bron: 'vijverkweekliteratuur Zuidoost-Azie; getallen bij benadering',
  },
  /* ------------------------------------------------------------ Harnasmeervallen (Otocinclus) */
  {
    id: 'otocinclus-macrospilus', naam: 'Oorgatmeerval of otocinclus', latijn: 'Otocinclus macrospilus', groep: 'Harnasmeervallen (Otocinclus)', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 3, nest: [10, 30], temp: [22, 26], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Aanslag op ruit en blad, aangevuld met spirulinapoeder',
    tip: 'Vrijwel alle otocinclus in de handel is wildvang en komt uitgehongerd aan: zet ze alleen in een ingedraaide bak met zichtbare aanslag en geef geblancheerde courgette op een vaste plek, want kweek lukt maar zelden.',
    bron: 'aquariumbreeder.com en planetcatfish-kweekverslagen; getallen bij benadering',
  },
  {
    id: 'otocinclus-cocama', naam: 'Zebra otocinclus', latijn: 'Otocinclus cocama', groep: 'Harnasmeervallen (Otocinclus)', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 3, nest: [10, 30], temp: [22, 26], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Aanslag op ruit en blad, aangevuld met spirulinapoeder',
    tip: 'Hij is nog gevoeliger dan de gewone otocinclus voor transport: laat nieuwe dieren twee weken in quarantaine met veel aanslag voor u ze verkoopt, want de meeste sterfte valt in die eerste weken.',
    bron: 'handelservaring en hobbyverslagen; getallen naar analogie met andere Otocinclus',
  },
  /* ------------------------------------------------------------ Harnasmeervallen (Sturisoma) */
  {
    id: 'sturisomatichthys-aureum-sturisoma-aureum', naam: 'Koningsfarlowella', latijn: 'Sturisomatichthys aureum (Sturisoma aureum)', groep: 'Harnasmeervallen (Sturisoma)', wijze: 'eierleggend', uitkomstdagen: 6, uitzwemdagen: 3, nest: [40, 100], temp: [24, 28], moeilijk: 2,
    eerstevoer: 'Geblancheerde courgette en spirulinapoeder vanaf dag een',
    tip: 'De jongen zijn van de eerste dag af plantenetend: geef geblancheerde courgette en spirulinapoeder, op alleen artemia verhongeren ze binnen een week ook al zien ze er dik uit.',
    bron: 'planetcatfish.com Shane\'s World, Spawning en Fry Development in Sturisoma aureum',
  },
  {
    id: 'sturisoma-panamense', naam: 'Panama harnasmeerval', latijn: 'Sturisoma panamense', groep: 'Harnasmeervallen (Sturisoma)', wijze: 'eierleggend', uitkomstdagen: 6, uitzwemdagen: 3, nest: [40, 100], temp: [24, 28], moeilijk: 2,
    eerstevoer: 'Geblancheerde courgette en spirulinapoeder vanaf dag een',
    tip: 'De man waaiert het legsel op de ruit schoon; vangt u hem weg of zet u het legsel zonder luchtstroom apart, dan schimmelt het binnen twee dagen volledig.',
    bron: 'planetcatfish.com forum en soortbeschrijvingen',
  },
  /* ------------------------------------------------------------ Harnasmeervallen (Farlowella) */
  {
    id: 'farlowella-acus', naam: 'Stokmeerval of twijgmeerval', latijn: 'Farlowella acus', groep: 'Harnasmeervallen (Farlowella)', wijze: 'eierleggend', uitkomstdagen: 8, uitzwemdagen: 3, nest: [20, 60], temp: [24, 27], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Aanslag op ruit en blad, spirulinapoeder en geblancheerde courgette',
    tip: 'Poets de achterruit niet: de jongen leven de eerste week van de aanslag daarop en verhongeren in een kraaknette bak, ook al ligt er voer op de bodem.',
    bron: 'tropicalfishkeeping en planetcatfish-verslagen; dagen bij benadering',
  },
  /* ------------------------------------------------------------ Harnasmeervallen (Rineloricaria) */
  {
    id: 'rineloricaria-sp-lanceolata-parva-l010a', naam: 'Zweepstaartmeerval', latijn: 'Rineloricaria sp. (lanceolata, parva, L010a)', groep: 'Harnasmeervallen (Rineloricaria)', wijze: 'eierleggend', uitkomstdagen: 8, uitzwemdagen: 4, nest: [30, 80], temp: [24, 27], moeilijk: 2,
    eerstevoer: 'Fijn poedervoer, spirulina en geblancheerde courgette',
    tip: 'Geef smalle buisjes van 2 tot 3 cm doorsnee: de man bewaakt en waaiert het legsel daarin, en in een te wijde buis raakt hij de eieren kwijt tussen het zand.',
    bron: 'aquainfo.nl/artikel/rineloricaria-sp-l010a-rode-zweepstaartmeerval/',
  },
  /* ------------------------------------------------------------ Vederbaardmeervallen (Synodontis) */
  {
    id: 'synodontis-multipunctatus', naam: 'Koekoeksmeerval', latijn: 'Synodontis multipunctatus', groep: 'Vederbaardmeervallen (Synodontis)', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 6, nest: [20, 50], temp: [24, 27], moeilijk: 3,
    eerstevoer: 'Pas ontloken artemia en fijn poedervoer',
    tip: 'Hij is een broedparasiet: zonder muilbroedende Tanganyika-cichliden die op hetzelfde moment afzetten krijgt u geen jongen, en de jonge meervallen eten in de bek van de gastheer haar eigen eieren op.',
    bron: 'aquainfo.nl/en/spawning-synodontis-multipunctatus/ en seriouslyfish.com',
  },
  {
    id: 'synodontis-petricola', naam: 'Synodontis petricola', latijn: 'Synodontis petricola', groep: 'Vederbaardmeervallen (Synodontis)', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 6, nest: [30, 60], temp: [24, 27], moeilijk: 2,
    eerstevoer: 'Pas ontloken artemia en fijn poedervoer',
    tip: 'Afzetten lukt vlot, opkweken niet: haal de eieren dezelfde avond nog naar een apart bakje met methyleenblauw, want in de bak zijn ze de volgende ochtend opgegeten.',
    bron: 'seriouslyfish.com/species/synodontis-petricola/ en foraquarist.com',
  },
  {
    id: 'synodontis-lucipinnis', naam: 'Dwerg petricola', latijn: 'Synodontis lucipinnis', groep: 'Vederbaardmeervallen (Synodontis)', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 6, nest: [20, 50], temp: [24, 27], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'Pas ontloken artemia en fijn poedervoer',
    tip: 'Wat als petricola verkocht wordt is vaak deze kleinere soort: hij blijft rond 6 cm in plaats van 11 cm, kweekt op dezelfde manier en past ook in een bak van 100 liter.',
    bron: 'seriouslyfish.com en handelservaring; getallen naar analogie met S. petricola',
  },
  {
    id: 'synodontis-nigriventris', naam: 'Omgekeerd zwemmende meerval', latijn: 'Synodontis nigriventris', groep: 'Vederbaardmeervallen (Synodontis)', wijze: 'eierleggend', uitkomstdagen: 7, uitzwemdagen: 4, nest: [50, 200], temp: [24, 27], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Pas ontloken artemia en fijn poedervoer',
    tip: 'Hij zet af in een donkere holte en de jongen zwemmen de eerste weken nog gewoon rechtop; zet een koppel apart met een kokosschaal, want in een gezelschapsbak ziet u nooit jongen.',
    bron: 'aquariumliteratuur over Synodontis; getallen bij benadering',
  },
  {
    id: 'synodontis-eupterus', naam: 'Vederbaardmeerval', latijn: 'Synodontis eupterus', groep: 'Vederbaardmeervallen (Synodontis)', wijze: 'eierleggend', uitkomstdagen: 4, uitzwemdagen: 5, nest: [100, 400], temp: [24, 27], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Pas ontloken artemia en fijn poedervoer',
    tip: 'De dieren in de handel komen bijna allemaal uit hormoonkweek in Oost-Europa of Azie: in een huiskamerbak zet hij vrijwel nooit spontaan af, ook niet als hij jarenlang goed gehouden wordt.',
    bron: 'kwekerijgegevens en hobbyverslagen; getallen bij benadering',
  },
  {
    id: 'synodontis-angelicus', naam: 'Parelmeerval', latijn: 'Synodontis angelicus', groep: 'Vederbaardmeervallen (Synodontis)', wijze: 'eierleggend', uitkomstdagen: 4, uitzwemdagen: 5, nest: [100, 400], temp: [24, 28], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Pas ontloken artemia en fijn poedervoer',
    tip: 'Kweek in een huiskamerbak is niet bekend; hij wordt 20 cm, leeft solitair en de nakweek die u koopt komt uit kwekerijen die met hormooninjecties werken.',
    bron: 'kwekerijgegevens; kweek in aquarium niet gedocumenteerd',
  },
  /* ------------------------------------------------------------ Glasmeervallen */
  {
    id: 'kryptopterus-vitreolus', naam: 'Glasmeerval', latijn: 'Kryptopterus vitreolus', groep: 'Glasmeervallen', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 4, nest: [100, 300], temp: [24, 28], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Pas ontloken artemia en fijn poedervoer',
    tip: 'Kweek in het aquarium is nauwelijks gelukt en alle handelsdieren komen uit Azie; houd er minstens zes samen, want met twee of drie kwijnen ze weg en gaan ze binnen enkele maanden dood.',
    bron: 'nbat.nl en aquariumvissen.net; kweekgegevens grotendeels onbekend',
  },
  /* ------------------------------------------------------------ Antennemeervallen (Pimelodidae) */
  {
    id: 'pimelodus-pictus', naam: 'Engelmeerval of pictusmeerval', latijn: 'Pimelodus pictus', groep: 'Antennemeervallen (Pimelodidae)', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 4, nest: [100, 500], temp: [24, 28], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Pas ontloken artemia en fijn poedervoer',
    tip: 'Hij is in een aquarium nog nooit gekweekt en alle dieren komen uit wildvang of hormoonkweek; vang hem nooit met een schepnet, want zijn borstvinstekels haken vast en breken af.',
    bron: 'aquariumdatabase.nl/aquarium-vissen/pimelodidae/pimelodus-pictus/; kweek niet gedocumenteerd',
  },
  /* ------------------------------------------------------------ Doornmeervallen (Doradidae) */
  {
    id: 'platydoras-armatulus', naam: 'Gestreepte doornmeerval', latijn: 'Platydoras armatulus', groep: 'Doornmeervallen (Doradidae)', wijze: 'eierleggend', uitkomstdagen: 4, uitzwemdagen: 4, nest: [100, 500], temp: [24, 28], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Pas ontloken artemia en fijn poedervoer',
    tip: 'Kweek in een huiskamerbak is niet gelukt; hij verstopt zich overdag volledig, dus geef een holle wortel en voer pas na het doven van de lampen, anders ziet u hem maandenlang niet.',
    bron: 'aquariumliteratuur over Doradidae; kweek niet gedocumenteerd',
  },
  {
    id: 'agamyxis-pectinifrons', naam: 'Stermeerval', latijn: 'Agamyxis pectinifrons', groep: 'Doornmeervallen (Doradidae)', wijze: 'eierleggend', uitkomstdagen: 4, uitzwemdagen: 4, nest: [100, 400], temp: [24, 28], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Pas ontloken artemia en fijn poedervoer',
    tip: 'Hij kweekt in een aquarium niet en maakt bij het vangen een knarsend geluid met zijn borstvinnen; gebruik een bakje in plaats van een net, want de stekels blijven onherroepelijk haken.',
    bron: 'aquariumliteratuur over Doradidae; kweek niet gedocumenteerd',
  },
  /* ------------------------------------------------------------ Overige meervallen */
  {
    id: 'tatia-perugiae-centromochlus-perugiae', naam: 'Honingmeerval', latijn: 'Tatia perugiae (Centromochlus perugiae)', groep: 'Overige meervallen', wijze: 'eierleggend', uitkomstdagen: 4, uitzwemdagen: 4, nest: [20, 60], temp: [24, 28], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Pas ontloken artemia en fijn poedervoer',
    tip: 'Bij deze soort bevrucht de man inwendig met een aangepaste vinstraal en zet het wijfje de eieren later alleen af in een smalle spleet; geef bamboebuisjes en kijk na een paar dagen daarin in plaats van op de ruit.',
    bron: 'planetcatfish.com soortbeschrijving; getallen bij benadering',
  },
  {
    id: 'microglanis-iheringi', naam: 'Dwerg zebrameerval', latijn: 'Microglanis iheringi', groep: 'Overige meervallen', wijze: 'eierleggend', uitkomstdagen: 4, uitzwemdagen: 4, nest: [50, 200], temp: [23, 27], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Pas ontloken artemia en microwormen',
    tip: 'Hij blijft onder de 6 cm maar eet alles wat in zijn bek past, dus hou hem niet bij neons of jonge garnalen; kweek in een aquarium is zelden beschreven.',
    bron: 'beperkte hobbyverslagen; getallen bij benadering',
  },
  {
    id: 'hara-jerdoni', naam: 'Aziatisch dwergmeervalletje', latijn: 'Hara jerdoni', groep: 'Overige meervallen', wijze: 'eierleggend', uitkomstdagen: 4, uitzwemdagen: 4, nest: [20, 60], temp: [20, 24], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Pas ontloken artemia en microwormen',
    tip: 'Hij is traag en wordt bij snelle medebewoners weggeconcurreerd bij het voer; geef \'s avonds diepvriesvoer op de bodem en houd hem koel, boven 25 graden houdt hij het niet lang vol.',
    bron: 'seriouslyfish.com soortbeschrijving; kweekgegevens grotendeels onbekend',
  },
  {
    id: 'pangasianodon-hypophthalmus', naam: 'Haaimeerval', latijn: 'Pangasianodon hypophthalmus', groep: 'Overige meervallen', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [1000, 10000], temp: [24, 28], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'Pas ontloken artemia en fijn poedervoer',
    tip: 'Kweek gebeurt uitsluitend op viskwekerijen met hormooninjecties en lukt in een aquarium niet; hij wordt meer dan een meter lang en beschadigt zich tegen de ruiten, dus raad hem af voor een huiskamerbak.',
    bron: 'viskwekerijgegevens Zuidoost-Azie; aquariumkweek niet mogelijk',
  },
  /* ------------------------------------------------------------ Dwergcichliden (Zuid-Amerika) */
  {
    id: 'apistogramma-cacatuoides', naam: 'Cacatuoides dwergcichlide', latijn: 'Apistogramma cacatuoides', groep: 'Dwergcichliden (Zuid-Amerika)', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 7, nest: [60, 150], temp: [26, 28], moeilijk: 1,
    eerstevoer: 'pas ontloken artemia (naupliën)',
    tip: 'Bij deze soort bepaalt vooral de pH van het broedwater het geslacht van de jongen: rond pH 5 tot 6 krijgt u overwegend vrouwtjes, boven pH 7 overwegend mannetjes, dus stuur hierop als u een bepaalde verhouding wilt fokken.',
    bron: 'Standaard aquariumliteratuur (Linke & Staeck; Römer, Cichlid Atlas)',
  },
  {
    id: 'apistogramma-agassizii', naam: 'Agassizi\'s dwergcichlide', latijn: 'Apistogramma agassizii', groep: 'Dwergcichliden (Zuid-Amerika)', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 6, nest: [80, 150], temp: [26, 29], moeilijk: 2,
    eerstevoer: 'pas ontloken artemia (naupliën)',
    tip: 'Fok in zacht, zuur water rond pH 5,5: dat verhoogt niet alleen het uitkomstpercentage maar ook het aandeel vrouwtjes, terwijl een hogere pH en een temperatuur boven 28°C meer mannetjes geeft.',
    bron: 'Standaard aquariumliteratuur (Linke & Staeck; Römer, Cichlid Atlas)',
  },
  {
    id: 'apistogramma-borellii', naam: 'Borelli\'s dwergcichlide', latijn: 'Apistogramma borellii', groep: 'Dwergcichliden (Zuid-Amerika)', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 6, nest: [40, 80], temp: [25, 28], moeilijk: 1,
    eerstevoer: 'pas ontloken artemia (naupliën)',
    tip: 'Deze soort verdraagt een hogere pH dan de meeste Apistogramma\'s en kan zelfs rond pH 7 nog broeden, maar ook hier geeft een lagere pH tijdens de eerste levensweken meer vrouwtjes in het legsel.',
    bron: 'Standaard aquariumliteratuur; cichlidenkwekers.nl',
  },
  {
    id: 'apistogramma-macmasteri', naam: 'Macmaster\'s dwergcichlide', latijn: 'Apistogramma macmasteri', groep: 'Dwergcichliden (Zuid-Amerika)', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 7, nest: [100, 150], temp: [26, 28], moeilijk: 2,
    eerstevoer: 'pas ontloken artemia (naupliën)',
    tip: 'Zoals bij alle Apistogramma\'s bepaalt de pH tijdens de eerste dagen na het uitkomen het geslacht: hou de pH laag (rond 5,5 à 6) voor overwegend vrouwtjes, hoger voor meer dekmannetjes.',
    bron: 'Standaard aquariumliteratuur (Linke & Staeck; Römer, Cichlid Atlas)',
  },
  {
    id: 'apistogramma-panduro', naam: 'Panduro dwergcichlide', latijn: 'Apistogramma panduro', groep: 'Dwergcichliden (Zuid-Amerika)', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 7, nest: [50, 100], temp: [26, 28], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'pas ontloken artemia (naupliën)',
    tip: 'Werk met een aparte kweekbak met zeer zacht, licht zuur water: een lage pH tijdens de larvefase duwt de geslachtsverhouding van deze soort naar vrouwtjes, net als bij de rest van het geslacht.',
    bron: 'Beperkte specifieke literatuur; cijfers bij benadering op basis van vergelijkbare Apistogramma-soorten uit dezelfde groep (cacatuoides-verwanten)',
  },
  {
    id: 'apistogramma-trifasciata', naam: 'Driestreep dwergcichlide', latijn: 'Apistogramma trifasciata', groep: 'Dwergcichliden (Zuid-Amerika)', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 6, nest: [40, 80], temp: [25, 28], moeilijk: 2,
    eerstevoer: 'pas ontloken artemia (naupliën)',
    tip: 'Deze kleinere soort is gevoeliger voor waterkwaliteit dan cacatuoides; houd de pH laag voor een geslaagde broed, wat als bijkomend effect meer vrouwtjes in het legsel geeft.',
    bron: 'Standaard aquariumliteratuur (Linke & Staeck; Römer, Cichlid Atlas)',
  },
  {
    id: 'apistogramma-hongsloi', naam: 'Hongslo\'s dwergcichlide', latijn: 'Apistogramma hongsloi', groep: 'Dwergcichliden (Zuid-Amerika)', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 6, nest: [60, 100], temp: [25, 29], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'pas ontloken artemia (naupliën)',
    tip: 'Broedt het beste in zacht, licht zuur water; een lagere pH in de eerste weken na het uitzwemmen geeft bij deze soort, net als bij andere Apistogramma\'s, doorgaans meer vrouwtjes.',
    bron: 'aquainfo.nl; cijfers bij benadering op basis van vergelijkbare Apistogramma-soorten',
  },
  {
    id: 'apistogramma-nijsseni', naam: 'Panda dwergcichlide', latijn: 'Apistogramma nijsseni', groep: 'Dwergcichliden (Zuid-Amerika)', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 7, nest: [40, 80], temp: [26, 29], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'pas ontloken artemia (naupliën)',
    tip: 'Vraagt echt zacht, zuur water (pH onder 6) om succesvol te broeden en de jongen groot te brengen; bij een hogere pH mislukken legsels vaker en verschuift de geslachtsverhouding bovendien naar mannetjes.',
    bron: 'Standaard aquariumliteratuur; specifieke kweekcijfers minder gedocumenteerd dan bij courante Apistogramma\'s',
  },
  {
    id: 'mikrogeophagus-ramirezi', naam: 'Ram', latijn: 'Mikrogeophagus ramirezi', groep: 'Dwergcichliden (Zuid-Amerika)', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 5, nest: [150, 300], temp: [27, 29], moeilijk: 2,
    eerstevoer: 'infusorien de eerste dagen, daarna pas ontloken artemia',
    tip: 'De vrouwtjes eten bij stress vaak hun eigen eieren op; werk met een vast, stabiel koppel in een aparte, niet-verstoorde bak met zeer zacht, warm water (27-29°C) voor een goed uitkomstpercentage.',
    bron: 'practicalfishkeeping.co.uk; seriouslyfish.com',
  },
  {
    id: 'mikrogeophagus-altispinosus', naam: 'Bolivia ram', latijn: 'Mikrogeophagus altispinosus', groep: 'Dwergcichliden (Zuid-Amerika)', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 5, nest: [100, 200], temp: [24, 27], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'microwormen, daarna pas ontloken artemia',
    tip: 'Verdraagt harder en koeler water dan de gewone ram en is daardoor stabieler te fokken; het is een open substraatbroeder op een platte steen die beide ouders samen bewaken.',
    bron: 'Algemene aquariumliteratuur over Mikrogeophagus; minder gedocumenteerd dan M. ramirezi',
  },
  {
    id: 'nannacara-anomala', naam: 'Goudoog dwergcichlide', latijn: 'Nannacara anomala', groep: 'Dwergcichliden (Zuid-Amerika)', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 6, nest: [50, 150], temp: [24, 27], moeilijk: 2,
    eerstevoer: 'pas ontloken artemia (naupliën)',
    tip: 'Na het afzetten wordt het vrouwtje vaak agressief tegenover het mannetje; haal hem uit de kweekbak zodra zij de eieren alleen begint te verzorgen, anders wordt hij verwond of zelfs gedood.',
    bron: 'aquaticcommunity.com; forumervaring kwekers',
  },
  {
    id: 'laetacara-curviceps', naam: 'Vlagcichlide', latijn: 'Laetacara curviceps', groep: 'Dwergcichliden (Zuid-Amerika)', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [150, 300], temp: [26, 28], moeilijk: 1,
    eerstevoer: 'pas ontloken artemia (naupliën)',
    tip: 'In tegenstelling tot de meeste dwergcichliden in deze groep is dit een open broeder op een vlakke steen die door beide ouders samen bewaakt wordt, wat de soort tot een van de makkelijkste dwergcichliden voor beginnende kwekers maakt.',
    bron: 'practicalfishkeeping.co.uk',
  },
  {
    id: 'dicrossus-filamentosus', naam: 'Schaakbordcichlide', latijn: 'Dicrossus filamentosus', groep: 'Dwergcichliden (Zuid-Amerika)', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 8, nest: [60, 120], temp: [25, 27], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'infusorien de eerste week, daarna pas ontloken artemia',
    tip: 'De eieren komen enkel uit bij een pH onder 5,8 in extreem zacht water; in gewoon leidingwater met wat karbonaathardheid wordt vaak nog wel afgezet, maar sterven de eieren dan bijna altijd af voor ze uitkomen.',
    bron: 'seriouslyfish.com en diverse hobbybronnen; exacte uitzwemtijd niet eenduidig gedocumenteerd',
  },
  {
    id: 'taeniacara-candidi', naam: 'Taeniacara', latijn: 'Taeniacara candidi', groep: 'Dwergcichliden (Zuid-Amerika)', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 8, nest: [20, 50], temp: [26, 28], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'infusorien, daarna pas ontloken artemia',
    tip: 'Deze zeer kleine, schuwe soort zet de eieren tegen het plafond van een grot af en heeft maandenlang stabiel, zeer zacht en zuur water (pH onder 5,5) nodig; in een gewone huiskamerbak met kraantjeswater lukt broeden zelden.',
    bron: 'seriouslyfish.com; aquainfo.nl - exacte splitsing uitkomst/uitzwemdagen bij benadering',
  },
  /* ------------------------------------------------------------ Dwergcichliden (West-Afrika) */
  {
    id: 'pelvicachromis-pulcher', naam: 'Kribensis', latijn: 'Pelvicachromis pulcher', groep: 'Dwergcichliden (West-Afrika)', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 7, nest: [80, 200], temp: [24, 27], moeilijk: 1,
    eerstevoer: 'pas ontloken artemia (naupliën)',
    tip: 'De pH tijdens de eerste levensweken bepaalt het geslacht: rond pH 7 krijgt u een gemengd legsel, onder pH 6,8 overwegend vrouwtjes en boven pH 7,2 overwegend mannetjes, dus stuur hierop als een klant een bepaalde verhouding wil.',
    bron: 'seriouslyfish.com; wetenschappelijke studie (Sciencedirect/PubMed) naar pH en geslachtsbepaling bij P. pulcher',
  },
  {
    id: 'pelvicachromis-taeniatus', naam: 'Gestreepte kribensis', latijn: 'Pelvicachromis taeniatus', groep: 'Dwergcichliden (West-Afrika)', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 7, nest: [60, 100], temp: [25, 27], moeilijk: 2,
    eerstevoer: 'pas ontloken artemia (naupliën)',
    tip: 'Gevoeliger voor waterkwaliteit dan de gewone kribensis: gebruik zacht, licht zuur water en verse turf- of amandelbladextracten tegen schimmel op de eieren, wat hier vaker de reden van mislukking is dan bij P. pulcher. Net als bij pulcher speelt de pH tijdens de eerste levensweken mee in de geslachtsverhouding: lager pH geeft meer vrouwtjes, hoger pH meer mannetjes.',
    bron: 'seriouslyfish.com; apistogramma.com forum',
  },
  {
    id: 'pelvicachromis-sacrimontis', naam: 'Sacrimontis kribensis', latijn: 'Pelvicachromis sacrimontis', groep: 'Dwergcichliden (West-Afrika)', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 7, nest: [60, 100], temp: [24, 26], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'pas ontloken artemia (naupliën)',
    tip: 'Fokt zoals de andere taeniatus-achtige vormen het best in zacht, licht zuur water; ook hier speelt de pH in de eerste levensweken mee in de geslachtsverhouding van het legsel, net als bij de rest van het geslacht Pelvicachromis.',
    bron: 'Recent beschreven soort (2015), minder gedocumenteerd; cijfers bij benadering op basis van de nauw verwante P. taeniatus',
  },
  {
    id: 'anomalochromis-thomasi', naam: 'Afrikaanse vlindercichlide', latijn: 'Anomalochromis thomasi', groep: 'Dwergcichliden (West-Afrika)', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [100, 300], temp: [25, 27], moeilijk: 1,
    eerstevoer: 'pas ontloken artemia (naupliën)',
    tip: 'Een van de makkelijkste West-Afrikaanse dwergcichliden: beide ouders bewaken de eieren en jongen samen op open substraat, en de soort verdraagt water dat iets harder en neutraler is dan de meeste andere soorten in deze groep.',
    bron: 'seriouslyfish.com; aquaticcommunity.com',
  },
  {
    id: 'nanochromis-parilus', naam: 'Congo dwergcichlide', latijn: 'Nanochromis parilus', groep: 'Dwergcichliden (West-Afrika)', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 6, nest: [50, 100], temp: [25, 27], moeilijk: 2,
    eerstevoer: 'infusorien de eerste dagen, daarna pas ontloken artemia',
    tip: 'Broedt vrijwel enkel bij een pH onder 6,5; het vrouwtje wordt na het afzetten sterk territoriaal en kan een mannetje zonder vluchtmogelijkheid doodbijten, dus voorzie voldoende dekking en uitwijkplekken in de kweekbak.',
    bron: 'dwarfcichlid.com; aquaticcommunity.com',
  },
  {
    id: 'chromidotilapia-guentheri', naam: 'Guenther\'s mondbroeder', latijn: 'Chromidotilapia guentheri', groep: 'Dwergcichliden (West-Afrika)', wijze: 'eierleggend', uitkomstdagen: 7, uitzwemdagen: 5, nest: [50, 150], temp: [24, 28], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'pas ontloken artemia (naupliën), rechtstreeks bij vrijlating',
    tip: 'Ongewoon voor een mondbroedende cichlide: hier is het het mannetje dat de eieren en jongen in de bek draagt, terwijl het vrouwtje het territorium verdedigt; splits het koppel daarom niet, maar laat ze samen zitten.',
    bron: 'seriouslyfish.com; broedduur (10-14 dagen) is één gecombineerd cijfer in de bron, hier bij benadering opgesplitst in bek-incubatie en dooierzak-periode',
  },
  /* ------------------------------------------------------------ Maanvissen (Pterophyllum) */
  {
    id: 'pterophyllum-scalare', naam: 'Maanvis', latijn: 'Pterophyllum scalare', groep: 'Maanvissen (Pterophyllum)', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 5, nest: [100, 800], temp: [26, 29], moeilijk: 1,
    eerstevoer: 'pas ontloken artemia',
    tip: 'De ouders dragen en verplaatsen de eieren en later de jongen naar een schuilplaats, maar eten een eerste legsel vaak nog op, dus geef een jong koppel enkele kansen voor het echt lukt.',
    bron: 'AquaInfo, algemene aquariumliteratuur',
  },
  {
    id: 'pterophyllum-altum', naam: 'Altum (Orinoco-maanvis)', latijn: 'Pterophyllum altum', groep: 'Maanvissen (Pterophyllum)', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 6, nest: [150, 400], temp: [28, 30], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'pas ontloken artemia',
    tip: 'Wilde altums stellen hoge eisen aan zeer zacht en zuur water en eten hun eerste legsels vaak zelf op, waardoor kweek met succes zelden lukt buiten gespecialiseerde kwekers.',
    bron: 'DiscusZolder, AquaInfo; slechts een handvol gedocumenteerde succesvolle kwekers, cijfers bij benadering',
  },
  /* ------------------------------------------------------------ Discusvissen (Symphysodon) */
  {
    id: 'symphysodon-aequifasciatus-haraldi', naam: 'Discus (kweekvormen)', latijn: 'Symphysodon aequifasciatus / haraldi', groep: 'Discusvissen (Symphysodon)', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 3, nest: [150, 400], temp: [29, 31], moeilijk: 2,
    eerstevoer: 'eerste dagen huidslijm van de ouders, daarna pas ontloken artemia',
    tip: 'De jongen voeden zich de eerste dagen uitsluitend met de voedzame huidslijm van beide ouders, dus haal de ouders niet weg tot de jongen zelfstandig artemia eten.',
    bron: 'AquaInfo, DiscusZolder, AquastoreXL',
  },
  {
    id: 'symphysodon-discus', naam: 'Heckel discus (wilde discus)', latijn: 'Symphysodon discus', groep: 'Discusvissen (Symphysodon)', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 4, nest: [100, 300], temp: [28, 30], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'eerste dagen huidslijm van de ouders, daarna pas ontloken artemia',
    tip: 'Als wilde soort is deze discus veel kieskeuriger in partnerkeuze dan gekweekte discusvormen en vraagt extreem zacht, zuur water, waardoor kweek in een gewone huiskamerbak zelden lukt.',
    bron: 'Algemene discusliteratuur, cijfers bij benadering op basis van kweekvorm-discus',
  },
  /* ------------------------------------------------------------ Severums (Heros) */
  {
    id: 'heros-severus', naam: 'Severum', latijn: 'Heros severus', groep: 'Severums (Heros)', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 5, nest: [200, 500], temp: [26, 28], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'pas ontloken artemia, fijn poedervoer',
    tip: 'Het koppel vormt zich zeer kieskeurig, dus laat een groepje jonge severums samen opgroeien zodat ze zelf een partner kiezen, in plaats van zelf twee dieren samen te zetten.',
    bron: 'Cichlidenkwekers.nl, AquariumDatabase.nl; bronnen lopen uiteen over exacte uitkomsttijd, hier een tussenwaarde',
  },
  {
    id: 'heros-efasciatus', naam: 'Rotkeil-severum', latijn: 'Heros efasciatus', groep: 'Severums (Heros)', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 5, nest: [200, 500], temp: [26, 28], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'pas ontloken artemia, fijn poedervoer',
    tip: 'Het kweekgedrag lijkt sterk op dat van de gewone severum: laat ook hier een groep jongdieren samen opgroeien tot er zelf een koppel ontstaat.',
    bron: 'Vergelijkbaar met Heros severus, geen aparte specifieke kweekcijfers gevonden',
  },
  /* ------------------------------------------------------------ Uaru */
  {
    id: 'uaru-amphiacanthoides', naam: 'Uaru', latijn: 'Uaru amphiacanthoides', groep: 'Uaru', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [300, 800], temp: [28, 30], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'eerste dagen huidslijm van de ouders, daarna pas ontloken artemia',
    tip: 'Net als bij discus voeden de jongen zich de eerste dagen met de huidslijm van de ouders, dus houd het gezin samen in de kweekbak tot de jongen zelfstandig eten.',
    bron: 'AquaInfo, Cichlidenkwekers.nl; bronnen geven sterk uiteenlopende legselgroottes (150 tot 1000)',
  },
  /* ------------------------------------------------------------ Oscars (Astronotus) */
  {
    id: 'astronotus-ocellatus', naam: 'Oscar', latijn: 'Astronotus ocellatus', groep: 'Oscars (Astronotus)', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 5, nest: [1000, 2000], temp: [26, 28], moeilijk: 2,
    eerstevoer: 'pas ontloken artemia, later fijngemalen pellets',
    tip: 'Een koppel vormt zich moeilijk uit twee willekeurig gekozen dieren, laat daarom zes tot acht jonge oscars samen opgroeien in een ruim aquarium tot er spontaan een paar ontstaat.',
    bron: 'Algemene, ruim gedocumenteerde aquariumliteratuur',
  },
  /* ------------------------------------------------------------ Midden-Amerikaanse cichliden (Amatitlania) */
  {
    id: 'amatitlania-nigrofasciata', naam: 'Convict cichlide (zebracichlide)', latijn: 'Amatitlania nigrofasciata', groep: 'Midden-Amerikaanse cichliden (Amatitlania)', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 4, nest: [100, 300], temp: [24, 26], moeilijk: 1,
    eerstevoer: 'pas ontloken artemia, fijn poedervoer',
    tip: 'Deze soort kweekt vaak spontaan zonder enige aanmoediging, zelfs in een gewoon gezelschapsaquarium, waardoor u sneller dan verwacht met een legsel zit.',
    bron: 'Algemene, zeer courante aquariumliteratuur',
  },
  /* ------------------------------------------------------------ Midden-Amerikaanse cichliden (Thorichthys) */
  {
    id: 'thorichthys-meeki', naam: 'Firemouth', latijn: 'Thorichthys meeki', groep: 'Midden-Amerikaanse cichliden (Thorichthys)', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 5, nest: [100, 500], temp: [25, 27], moeilijk: 1,
    eerstevoer: 'pas ontloken artemia, infusorien',
    tip: 'Het opzwellen van de rode keel bij dreiging is een teken van een broedend koppel; voorzie platte stenen of ruimte om een kuil te graven, want het zijn typische kuilbroeders.',
    bron: 'NVCweb, algemene aquariumliteratuur',
  },
  {
    id: 'thorichthys-maculipinnis', naam: 'Thorichthys maculipinnis', latijn: 'Thorichthys maculipinnis', groep: 'Midden-Amerikaanse cichliden (Thorichthys)', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 5, nest: [100, 300], temp: [25, 27], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'pas ontloken artemia',
    tip: 'Het kweekgedrag lijkt op dat van de Firemouth, maar de soort wordt zelden aangeboden en nakweek blijft daardoor beperkt beschikbaar in de handel.',
    bron: 'AquaInfo; weinig gedetailleerde kweekverslagen beschikbaar, cijfers bij benadering op basis van verwante Thorichthys',
  },
  /* ------------------------------------------------------------ Midden-Amerikaanse cichliden (Rocio) */
  {
    id: 'rocio-octofasciata', naam: 'Jack Dempsey', latijn: 'Rocio octofasciata', groep: 'Midden-Amerikaanse cichliden (Rocio)', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 6, nest: [300, 500], temp: [25, 27], moeilijk: 1,
    eerstevoer: 'pas ontloken artemia',
    tip: 'Beide ouders bewaken het legsel bijzonder fel, dus voorzie voldoende schuilplaatsen voor andere vissen in de bak of verwijder die tijdelijk.',
    bron: 'Algemene, courante aquariumliteratuur',
  },
  /* ------------------------------------------------------------ Midden-Amerikaanse cichliden (Herichthys) */
  {
    id: 'herichthys-cyanoguttatus', naam: 'Texas cichlide', latijn: 'Herichthys cyanoguttatus', groep: 'Midden-Amerikaanse cichliden (Herichthys)', wijze: 'eierleggend', uitkomstdagen: 4, uitzwemdagen: 6, nest: [500, 1000], temp: [23, 26], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'pas ontloken artemia',
    tip: 'Als enige cichlide die van nature ook in koeler rivierwater in de Verenigde Staten voorkomt, kan een lichte temperatuurdaling in de herfst de paarvorming net bevorderen.',
    bron: 'Algemene literatuur; exacte legselgrootte varieert sterk per bron',
  },
  /* ------------------------------------------------------------ Aardeters (Geophagus) */
  {
    id: 'geophagus-surinamensis', naam: 'Pareloogaardeter', latijn: 'Geophagus surinamensis', groep: 'Aardeters (Geophagus)', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 12, nest: [200, 400], temp: [27, 29], moeilijk: 2,
    eerstevoer: 'pas ontloken artemia',
    tip: 'Is een vertraagde muilbroeder: de eieren worden eerst op een steen afgezet en pas na een tot twee dagen door de vrouw in de bek opgenomen, waar de jongen verder opgroeien tot ze vrij zwemmen.',
    bron: 'Cichlidenkwekers.nl, MonsterFishKeepers; let op dat vissen onder deze naam vaak eigenlijk G. abalios of G. altifrons zijn',
  },
  {
    id: 'geophagus-brasiliensis', naam: 'Pareicichlide', latijn: 'Geophagus brasiliensis', groep: 'Aardeters (Geophagus)', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 6, nest: [500, 1000], temp: [22, 26], moeilijk: 2,
    eerstevoer: 'pas ontloken artemia',
    tip: 'In tegenstelling tot de meeste andere Geophagus-soorten is dit geen muilbroeder: de ouders bewaken het legsel gewoon op een steen, zoals bij de meeste Zuid-Amerikaanse cichliden.',
    bron: 'AquaInfo (Geophagus brasiliensis)',
  },
  /* ------------------------------------------------------------ Aardeters (Satanoperca) */
  {
    id: 'satanoperca-jurupari', naam: 'Jurupari-aardeter', latijn: 'Satanoperca jurupari', groep: 'Aardeters (Satanoperca)', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 14, nest: [100, 200], temp: [27, 29], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'pas ontloken artemia',
    tip: 'Wordt in de handel vaak nog verkeerd als Geophagus jurupari aangeboden, maar is eigenlijk een muilbroedende Satanoperca die zelden succesvol wordt nagekweekt in een huiskamerbak.',
    bron: 'MonsterFishKeepers (taxonomische verwarring Geophagus/Satanoperca jurupari); weinig concrete kweekcijfers gevonden',
  },
  {
    id: 'satanoperca-leucosticta', naam: 'Witte-stip-aardeter', latijn: 'Satanoperca leucosticta', groep: 'Aardeters (Satanoperca)', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 14, nest: [100, 200], temp: [26, 28], moeilijk: 2,
    eerstevoer: 'pas ontloken artemia',
    tip: 'Is een muilbroeder: de vrouw neemt de eieren snel na de afzet in de bek en laat de jongen pas na ruim een week voor het eerst vrij zwemmen, aanvankelijk nog met de mogelijkheid om terug te vluchten in de bek.',
    bron: 'Seriously Fish, AquaInfo (Satanoperca leucosticta)',
  },
  {
    id: 'satanoperca-daemon', naam: 'Gevlekte duivelsbaars', latijn: 'Satanoperca daemon', groep: 'Aardeters (Satanoperca)', wijze: 'eierleggend', uitkomstdagen: 5, uitzwemdagen: 7, nest: [100, 200], temp: [27, 29], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'pas ontloken artemia',
    tip: 'In tegenstelling tot de meeste andere Satanoperca-soorten is dit geen muilbroeder maar een kuilbroeder die de larven bedekt met bodemmateriaal, en succesvolle kweek in gevangenschap is zeer zeldzaam gedocumenteerd.',
    bron: 'Cichlid Room Companion (enige gepubliceerde kweekbeschrijving); cijfers bij benadering',
  },
  /* ------------------------------------------------------------ Midden-Amerikaanse cichliden (Vieja) */
  {
    id: 'vieja-melanura', naam: 'Vieja melanura', latijn: 'Vieja melanura', groep: 'Midden-Amerikaanse cichliden (Vieja)', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 3, nest: [300, 600], temp: [26, 28], moeilijk: 2,
    eerstevoer: 'pas ontloken artemia',
    tip: 'Kweekt op zich vrij eenvoudig zodra het koppel geslachtsrijp is, maar dat kan tot drie jaar duren, dus reken op geduld en een aquarium van minstens 200 cm.',
    bron: 'NVCweb (Vieja melanura)',
  },
  {
    id: 'vieja-synspilum', naam: 'Vieja synspilum', latijn: 'Vieja synspilum', groep: 'Midden-Amerikaanse cichliden (Vieja)', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 4, nest: [300, 600], temp: [26, 28], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'pas ontloken artemia',
    tip: 'Is bijzonder territoriaal en fel tijdens het broeden, dus combineer het koppel enkel met even grote of grotere soorten in een navenant ruim aquarium.',
    bron: 'Geen specifiek kweekverslag gevonden; cijfers geschat op basis van verwante Vieja-soorten',
  },
  {
    id: 'vieja-maculicauda', naam: 'Vieja maculicauda', latijn: 'Vieja maculicauda', groep: 'Midden-Amerikaanse cichliden (Vieja)', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 4, nest: [400, 800], temp: [26, 28], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'pas ontloken artemia',
    tip: 'Groeit uit tot zo\'n 40 cm, waardoor enkel een aquarium van 200 cm of meer geschikt is voor een broedend koppel.',
    bron: 'AquaInfo (Vieja maculicauda); exacte kweekcijfers niet teruggevonden, geschat op basis van vergelijkbare Vieja-soorten',
  },
  /* ------------------------------------------------------------ Midden-Amerikaanse cichliden (Parachromis) */
  {
    id: 'parachromis-managuense', naam: 'Jaguarcichlide', latijn: 'Parachromis managuense', groep: 'Midden-Amerikaanse cichliden (Parachromis)', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 5, nest: [500, 1000], temp: [25, 28], moeilijk: 2,
    eerstevoer: 'pas ontloken artemia',
    tip: 'Het koppel kan elkaar tijdens de partnerkeuze verwonden, dus stel jonge dieren eerst gescheiden door glas aan elkaar voor tot de agressie wegvalt.',
    bron: 'AquaInfo (Parachromis managuensis)',
  },
  {
    id: 'parachromis-dovii', naam: 'Wolfscichlide', latijn: 'Parachromis dovii', groep: 'Midden-Amerikaanse cichliden (Parachromis)', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 6, nest: [600, 1000], temp: [25, 28], moeilijk: 3,
    eerstevoer: 'pas ontloken artemia',
    tip: 'Wordt tot 60 cm groot en is bijzonder fel tijdens het broeden, waardoor kweek enkel is weggelegd voor een aquarium van 300 cm of meer bij de ervaren kweker.',
    bron: 'NVCweb (Parachromis dovii)',
  },
  {
    id: 'parachromis-friedrichsthalii', naam: 'Parachromis friedrichsthalii', latijn: 'Parachromis friedrichsthalii', groep: 'Midden-Amerikaanse cichliden (Parachromis)', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 4, nest: [1000, 2000], temp: [25, 27], moeilijk: 2,
    eerstevoer: 'pas ontloken artemia',
    tip: 'Broedt relatief gemakkelijk op een platte steen en verplaatst de larven na het uitkomen naar een gegraven kuil of een schuilplaats tussen stenen.',
    bron: 'Cichlidenkwekers.nl (Parachromis friedrichsthalii)',
  },
  {
    id: 'parachromis-motaguensis', naam: 'Parachromis motaguensis', latijn: 'Parachromis motaguensis', groep: 'Midden-Amerikaanse cichliden (Parachromis)', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 5, nest: [300, 500], temp: [24, 27], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'pas ontloken artemia',
    tip: 'Is kleiner en iets rustiger dan de andere Parachromis-soorten, waardoor koppelvorming iets minder risicovol verloopt, maar blijft niettemin een felle broedzorger.',
    bron: 'AquaInfo (Parachromis motaguensis); beperkte specifieke kweekcijfers, geschat op basis van verwante Parachromis',
  },
  /* ------------------------------------------------------------ Aardeters (Geophagus) */
  {
    id: 'geophagus-altifrons', naam: 'Geophagus altifrons (o.a. Tapajos redhead)', latijn: 'Geophagus altifrons', groep: 'Aardeters (Geophagus)', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 12, nest: [150, 300], temp: [27, 29], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'pas ontloken artemia',
    tip: 'Wordt vaak onder handelsnamen zoals \'Tapajos redhead\' verkocht en is, net als de meeste Geophagus-soorten, een vertraagde muilbroeder waarbij de vrouw de eieren na een dag oppikt.',
    bron: 'MonsterFishKeepers, algemene Geophagus-literatuur; exacte cijfers voor deze soort niet specifiek teruggevonden',
  },
  /* ------------------------------------------------------------ Zuid-Amerikaanse cichliden (Cichlasoma) */
  {
    id: 'cichlasoma-bimaculatum', naam: 'Zwartvlekcichlide', latijn: 'Cichlasoma bimaculatum', groep: 'Zuid-Amerikaanse cichliden (Cichlasoma)', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 5, nest: [300, 500], temp: [24, 27], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'pas ontloken artemia',
    tip: 'Is een van de weinige nog als \'Cichlasoma\' verkochte soorten, aangezien de meeste vroegere Cichlasoma-soorten intussen naar andere geslachten zijn verhuisd, en kweekt als een klassieke broedzorgcichlide op een platte steen.',
    bron: 'Fishbase, Wikipedia (Cichlasoma bimaculatum); geen specifiek Nederlandstalig kweekverslag gevonden, cijfers bij benadering',
  },
  /* ------------------------------------------------------------ Midden-Amerikaanse cichliden (Herichthys) */
  {
    id: 'herichthys-carpintis', naam: 'Pearlscale cichlide (parelvliescichlide)', latijn: 'Herichthys carpintis', groep: 'Midden-Amerikaanse cichliden (Herichthys)', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 5, nest: [500, 800], temp: [23, 26], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'pas ontloken artemia',
    tip: 'Lijkt sterk op en kruist gemakkelijk met de Texas cichlide, dus houd beide soorten niet samen als u zuivere nakweek wil.',
    bron: 'Algemene Herichthys-literatuur, cijfers geschat op basis van de nauw verwante Texas cichlide',
  },
  /* ------------------------------------------------------------ Malawimeer - mbuna */
  {
    id: 'maylandia-zebra-pseudotropheus-zebra', naam: 'Zebra mbuna', latijn: 'Maylandia zebra (Pseudotropheus zebra)', groep: 'Malawimeer - mbuna', wijze: 'eierleggend', uitkomstdagen: 4, uitzwemdagen: 17, nest: [20, 40], temp: [25, 27], moeilijk: 1,
    eerstevoer: 'pas ontloken artemia-nauplia en fijn poedervoer, de jongen zijn bij het loslaten al vrij groot',
    tip: 'Houd één mannetje op minstens drie tot vier vrouwtjes, want een mannetje jaagt één enkele vrouwtjes doodmoe achterna tot ze bezwijkt van de stress',
    bron: 'algemene mbuna-literatuur (Konings, Malawi Cichlids)',
  },
  {
    id: 'metriaclima-estherae', naam: 'Rode zebra', latijn: 'Metriaclima estherae', groep: 'Malawimeer - mbuna', wijze: 'eierleggend', uitkomstdagen: 4, uitzwemdagen: 17, nest: [20, 40], temp: [25, 27], moeilijk: 1,
    eerstevoer: 'pas ontloken artemia-nauplia en fijn poedervoer',
    tip: 'Kruist gemakkelijk met andere Metriaclima-zebravormen, houd daarom geen andere zebra-kleurvarianten in dezelfde bak als u zuivere jongen wilt',
    bron: 'algemene mbuna-literatuur',
  },
  {
    id: 'metriaclima-callainos', naam: 'Cobalt blue zebra', latijn: 'Metriaclima callainos', groep: 'Malawimeer - mbuna', wijze: 'eierleggend', uitkomstdagen: 4, uitzwemdagen: 17, nest: [20, 40], temp: [25, 27], moeilijk: 1,
    eerstevoer: 'pas ontloken artemia-nauplia en fijn poedervoer',
    tip: 'Kweekt zeer gemakkelijk mee in een gewone gemengde mbunabak zonder aparte kweekbak',
    bron: 'algemene mbuna-literatuur',
  },
  {
    id: 'maylandia-lombardoi-pseudotropheus-lombardoi', naam: 'Kenyi', latijn: 'Maylandia lombardoi (Pseudotropheus lombardoi)', groep: 'Malawimeer - mbuna', wijze: 'eierleggend', uitkomstdagen: 4, uitzwemdagen: 18, nest: [15, 30], temp: [25, 28], moeilijk: 2,
    eerstevoer: 'pas ontloken artemia-nauplia en fijn poedervoer',
    tip: 'Een van de meest agressieve mbuna, zet ze enkel samen met even robuuste soorten en ruim voldoende schuilplaatsen, anders overleeft de vrouw het kweken niet',
    bron: 'algemene mbuna-literatuur',
  },
  {
    id: 'pseudotropheus-saulosi', naam: 'Saulosi', latijn: 'Pseudotropheus saulosi', groep: 'Malawimeer - mbuna', wijze: 'eierleggend', uitkomstdagen: 4, uitzwemdagen: 17, nest: [15, 25], temp: [25, 27], moeilijk: 1,
    eerstevoer: 'pas ontloken artemia-nauplia en fijn poedervoer',
    tip: 'Mannetjes en vrouwtjes hebben blijvend een verschillende kleur (blauw tegenover geel), zo stelt u zonder gokken een goed kweekkoppel samen',
    bron: 'algemene mbuna-literatuur',
  },
  {
    id: 'pseudotropheus-demasoni', naam: 'Demasoni', latijn: 'Pseudotropheus demasoni', groep: 'Malawimeer - mbuna', wijze: 'eierleggend', uitkomstdagen: 4, uitzwemdagen: 18, nest: [8, 15], temp: [25, 27], moeilijk: 2,
    eerstevoer: 'pas ontloken artemia-nauplia en fijn poedervoer',
    tip: 'Is binnen de eigen soort extreem agressief, houd ze enkel in een grote groep van minstens twaalf tot vijftien dieren zodat de agressie zich verspreidt en niet op één dier gericht blijft',
    bron: 'algemene mbuna-literatuur',
  },
  {
    id: 'labidochromis-caeruleus', naam: 'Gele Labido (Electric Yellow)', latijn: 'Labidochromis caeruleus', groep: 'Malawimeer - mbuna', wijze: 'eierleggend', uitkomstdagen: 4, uitzwemdagen: 17, nest: [10, 20], temp: [25, 27], moeilijk: 1,
    eerstevoer: 'pas ontloken artemia-nauplia en fijn poedervoer',
    tip: 'Een van de vredelievendste mbuna, kweekt vaak spontaan mee in een gewone gemengde Malawibak zonder dat u er iets voor hoeft te doen',
    bron: 'algemene mbuna-literatuur',
  },
  {
    id: 'melanochromis-auratus', naam: 'Auratus', latijn: 'Melanochromis auratus', groep: 'Malawimeer - mbuna', wijze: 'eierleggend', uitkomstdagen: 4, uitzwemdagen: 17, nest: [15, 30], temp: [24, 26], moeilijk: 1,
    eerstevoer: 'pas ontloken artemia-nauplia en fijn poedervoer',
    tip: 'Volwassen mannetjes zijn berucht agressief tegen alles met een gelijkaardige zwart-gele tekening, ook tegen andere soorten, hou één man op meerdere vrouwen in een ruime bak',
    bron: 'algemene mbuna-literatuur',
  },
  {
    id: 'melanochromis-johannii', naam: 'Johannii', latijn: 'Melanochromis johannii', groep: 'Malawimeer - mbuna', wijze: 'eierleggend', uitkomstdagen: 4, uitzwemdagen: 17, nest: [15, 25], temp: [25, 27], moeilijk: 1,
    eerstevoer: 'pas ontloken artemia-nauplia en fijn poedervoer',
    tip: 'Jonge dieren en vrouwtjes zijn oranjegeel, enkel volwassen mannetjes kleuren blauwzwart, verwar dit niet met een ander geslacht bij het samenstellen van een koppel',
    bron: 'algemene mbuna-literatuur',
  },
  {
    id: 'iodotropheus-sprengerae', naam: 'Rusty cichlide', latijn: 'Iodotropheus sprengerae', groep: 'Malawimeer - mbuna', wijze: 'eierleggend', uitkomstdagen: 4, uitzwemdagen: 17, nest: [15, 25], temp: [25, 27], moeilijk: 1,
    eerstevoer: 'pas ontloken artemia-nauplia en fijn poedervoer',
    tip: 'Een van de rustigste mbuna qua gedrag, uitermate geschikt voor wie voor het eerst mbuna wil kweken',
    bron: 'algemene mbuna-literatuur',
  },
  {
    id: 'pseudotropheus-acei', naam: 'Acei (Msobo)', latijn: 'Pseudotropheus acei', groep: 'Malawimeer - mbuna', wijze: 'eierleggend', uitkomstdagen: 4, uitzwemdagen: 17, nest: [20, 40], temp: [24, 26], moeilijk: 1,
    eerstevoer: 'pas ontloken artemia-nauplia en fijn poedervoer',
    tip: 'Eet in de natuur vrijwel uitsluitend algen, geef ook als kweekkoppel overwegend plantaardig voer en niet te veel dierlijke eiwitten',
    bron: 'algemene mbuna-literatuur',
  },
  {
    id: 'cynotilapia-afra', naam: 'Cynotilapia afra', latijn: 'Cynotilapia afra', groep: 'Malawimeer - mbuna', wijze: 'eierleggend', uitkomstdagen: 4, uitzwemdagen: 17, nest: [15, 25], temp: [25, 27], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'pas ontloken artemia-nauplia en fijn poedervoer',
    tip: 'Bestaat in veel geografische kleurvormen die niet met elkaar mogen kruisen, koop een koppel van dezelfde herkomstlocatie',
    bron: 'schatting op basis van vergelijkbare mbuna, geen exacte broedcijfers teruggevonden',
  },
  {
    id: 'labeotropheus-fuelleborni', naam: 'Fuelleborni', latijn: 'Labeotropheus fuelleborni', groep: 'Malawimeer - mbuna', wijze: 'eierleggend', uitkomstdagen: 4, uitzwemdagen: 18, nest: [20, 40], temp: [25, 27], moeilijk: 1,
    eerstevoer: 'pas ontloken artemia-nauplia en fijn poedervoer',
    tip: 'Heeft door de overhangende bek een echte algenschraper-mond, geef ruim voldoende beweiibare stenen zodat er buiten het broedseizoen geen voedselstress ontstaat',
    bron: 'algemene mbuna-literatuur',
  },
  {
    id: 'labeotropheus-trewavasae', naam: 'Trewavasae', latijn: 'Labeotropheus trewavasae', groep: 'Malawimeer - mbuna', wijze: 'eierleggend', uitkomstdagen: 4, uitzwemdagen: 17, nest: [15, 30], temp: [25, 27], moeilijk: 1,
    eerstevoer: 'pas ontloken artemia-nauplia en fijn poedervoer',
    tip: 'Lijkt sterk op fuelleborni, koop bij voorkeur bij een gespecialiseerde kweker om kruising met andere Labeotropheus te vermijden',
    bron: 'algemene mbuna-literatuur',
  },
  {
    id: 'pseudotropheus-socolofi', naam: 'Poederblauw (Socolofi)', latijn: 'Pseudotropheus socolofi', groep: 'Malawimeer - mbuna', wijze: 'eierleggend', uitkomstdagen: 4, uitzwemdagen: 17, nest: [20, 40], temp: [25, 27], moeilijk: 1,
    eerstevoer: 'pas ontloken artemia-nauplia en fijn poedervoer',
    tip: 'Een van de rustigste en makkelijkst te kweken mbuna, ook geschikt voor een gemengde bak met wat minder robuuste soorten',
    bron: 'algemene mbuna-literatuur',
  },
  {
    id: 'metriaclima-greshakei', naam: 'IJsblauw orchidee', latijn: 'Metriaclima greshakei', groep: 'Malawimeer - mbuna', wijze: 'eierleggend', uitkomstdagen: 4, uitzwemdagen: 17, nest: [15, 30], temp: [25, 27], moeilijk: 1,
    eerstevoer: 'pas ontloken artemia-nauplia en fijn poedervoer',
    tip: 'Mannetjes en vrouwtjes verschillen sterk van kleur, verwar het geel-oranje vrouwtje niet met een andere soort',
    bron: 'algemene mbuna-literatuur',
  },
  /* ------------------------------------------------------------ Malawimeer - open water (Aulonocara) */
  {
    id: 'aulonocara-jacobfreibergi', naam: 'Malawi pauwoogcichlide (Eureka)', latijn: 'Aulonocara jacobfreibergi', groep: 'Malawimeer - open water (Aulonocara)', wijze: 'eierleggend', uitkomstdagen: 7, uitzwemdagen: 16, nest: [15, 40], temp: [25, 27], moeilijk: 2,
    eerstevoer: 'pas ontloken artemia-nauplia en fijn poedervoer',
    tip: 'Is veel minder weerbaar dan mbuna, combineer ze niet met te drukke of bijterige mbunasoorten, anders komt het niet tot afzetten',
    bron: 'WebSearch, meerdere kwekersbronnen: bekbroedperiode circa 21-30 dagen',
  },
  {
    id: 'aulonocara-baenschi', naam: 'Gele pauwcichlide', latijn: 'Aulonocara baenschi', groep: 'Malawimeer - open water (Aulonocara)', wijze: 'eierleggend', uitkomstdagen: 7, uitzwemdagen: 16, nest: [15, 30], temp: [25, 27], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'pas ontloken artemia-nauplia en fijn poedervoer',
    tip: 'Jaagt met de gevoelige zijlijnorganen op bodemdiertjes in zacht zand, voorzie een zachte zandbodem zodat het natuurlijke jachtgedrag en dus de conditie op peil blijft',
    bron: 'geschat naar analogie met Aulonocara jacobfreibergi, geen soortspecifiek broedcijfer teruggevonden',
  },
  /* ------------------------------------------------------------ Malawimeer - open water (haplochromis) */
  {
    id: 'sciaenochromis-fryeri', naam: 'Elektrisch blauwe haplochromis', latijn: 'Sciaenochromis fryeri', groep: 'Malawimeer - open water (haplochromis)', wijze: 'eierleggend', uitkomstdagen: 7, uitzwemdagen: 17, nest: [20, 60], temp: [25, 27], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'pas ontloken artemia-nauplia en fijn poedervoer',
    tip: 'Is een echte viseter, combineer nooit met kleine mbuna-jongen of garnalen, die worden gewoon opgegeten',
    bron: 'geschat op basis van vergelijkbare grote Malawi-muilbroeders, geen exact soortspecifiek cijfer teruggevonden',
  },
  {
    id: 'nimbochromis-livingstonii', naam: 'Livingstonii', latijn: 'Nimbochromis livingstonii', groep: 'Malawimeer - open water (haplochromis)', wijze: 'eierleggend', uitkomstdagen: 7, uitzwemdagen: 18, nest: [30, 70], temp: [24, 26], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'pas ontloken artemia-nauplia en fijn poedervoer',
    tip: 'Legt zich op de bodem alsof hij dood is om kleinere visjes te lokken en op te eten, houd hem nooit samen met soorten die klein genoeg zijn om als prooi te dienen',
    bron: 'geschat op basis van vergelijkbare grote Malawi-muilbroeders',
  },
  {
    id: 'dimidiochromis-compressiceps', naam: 'Malawi snoekcichlide', latijn: 'Dimidiochromis compressiceps', groep: 'Malawimeer - open water (haplochromis)', wijze: 'eierleggend', uitkomstdagen: 7, uitzwemdagen: 18, nest: [20, 50], temp: [25, 27], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'pas ontloken artemia-nauplia en fijn poedervoer',
    tip: 'Heeft een lange, smalle lichaamsbouw en jaagt actief op kleine vis, voorzie een lange bak met vrije zwemruimte en combineer niet met kleine visjes',
    bron: 'geschat op basis van vergelijkbare grote Malawi-muilbroeders',
  },
  {
    id: 'copadichromis-borleyi', naam: 'Rood vin haplochromis', latijn: 'Copadichromis borleyi', groep: 'Malawimeer - open water (haplochromis)', wijze: 'eierleggend', uitkomstdagen: 7, uitzwemdagen: 17, nest: [20, 60], temp: [25, 27], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'pas ontloken artemia-nauplia en fijn poedervoer',
    tip: 'Het mannetje bouwt in het open water een zandkegel als baltsplaats, geef voldoende open zandbodem in het midden van de bak',
    bron: 'geschat op basis van vergelijkbare grote Malawi-muilbroeders',
  },
  /* ------------------------------------------------------------ Tanganyikameer */
  {
    id: 'julidochromis-ornatus', naam: 'Gele Julie', latijn: 'Julidochromis ornatus', groep: 'Tanganyikameer', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 5, nest: [30, 50], temp: [25, 27], moeilijk: 1,
    eerstevoer: 'de jongen zijn bij het vrij zwemmen al groot genoeg voor pas ontloken artemia-nauplia',
    tip: 'Vormt een levenslang monogaam koppel dat het territorium fel verdedigt, houd daarom maar één koppel Julidochromis per bak',
    bron: 'WebSearch: eieren komen na 2-3 dagen uit, jongen zwemmen na circa 7 dagen vrij',
  },
  {
    id: 'julidochromis-regani', naam: 'Regani Julie', latijn: 'Julidochromis regani', groep: 'Tanganyikameer', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 6, nest: [30, 60], temp: [24, 26], moeilijk: 1,
    eerstevoer: 'de jongen kunnen bij het vrij zwemmen meteen pas ontloken artemia-nauplia eten',
    tip: 'Grootste Julidochromis-soort, geef een echte grot of platte steen als broedplaats en genoeg dekking voor de jongen tussen de rotsen',
    bron: 'algemene Julidochromis-literatuur, analoog aan J. ornatus',
  },
  {
    id: 'julidochromis-marlieri', naam: 'Gevlekte Julie', latijn: 'Julidochromis marlieri', groep: 'Tanganyikameer', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 6, nest: [40, 80], temp: [24, 26], moeilijk: 1,
    eerstevoer: 'de jongen kunnen bij het vrij zwemmen meteen pas ontloken artemia-nauplia eten',
    tip: 'Jongen van eerdere legsels mogen bij de ouders blijven en helpen mee met de bewaking van het volgende legsel',
    bron: 'algemene Julidochromis-literatuur',
  },
  {
    id: 'julidochromis-transcriptus', naam: 'Masked Julie', latijn: 'Julidochromis transcriptus', groep: 'Tanganyikameer', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 6, nest: [20, 40], temp: [25, 27], moeilijk: 1, zekerheid: 'onzeker',
    eerstevoer: 'de jongen kunnen bij het vrij zwemmen meteen pas ontloken artemia-nauplia eten',
    tip: 'Kleinste Julidochromis-soort, geef nauwe spleten of een omgekeerde bloempot als grot, in een te open bak komt het broeden moeizaam op gang',
    bron: 'geschat naar analogie met andere Julidochromis-soorten',
  },
  {
    id: 'neolamprologus-brichardi', naam: 'Prinses van Burundi', latijn: 'Neolamprologus brichardi', groep: 'Tanganyikameer', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 6, nest: [50, 150], temp: [24, 26], moeilijk: 1,
    eerstevoer: 'de jongen kunnen bij het vrij zwemmen meteen pas ontloken artemia-nauplia eten',
    tip: 'Oudere jongen uit eerdere legsels helpen mee met het bewaken van nieuwe jongen, laat de familie dus samen in de bak zitten in plaats van elk legsel apart te vangen',
    bron: 'WebSearch: eieren komen na 2-4 dagen uit, jongen zwemmen na 7-10 dagen vrij',
  },
  {
    id: 'neolamprologus-leleupi', naam: 'Citroencichlide', latijn: 'Neolamprologus leleupi', groep: 'Tanganyikameer', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 6, nest: [50, 100], temp: [25, 27], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'de jongen kunnen bij het vrij zwemmen meteen pas ontloken artemia-nauplia eten',
    tip: 'Is erg territoriaal tegenover soortgenoten, geef elk koppel voldoende eigen rotsspleten op afstand van andere Neolamprologus',
    bron: 'geschat naar analogie met andere holenbroedende Neolamprologus',
  },
  /* ------------------------------------------------------------ Tanganyikameer - schelpbewoners */
  {
    id: 'neolamprologus-multifasciatus', naam: 'Schelpcichlide dwerg', latijn: 'Neolamprologus multifasciatus', groep: 'Tanganyikameer - schelpbewoners', wijze: 'eierleggend', uitkomstdagen: 1, uitzwemdagen: 6, nest: [5, 20], temp: [25, 27], moeilijk: 1,
    eerstevoer: 'infusorien de eerste dagen, vanaf ongeveer een week pas ontloken artemia-nauplia',
    tip: 'Elk vrouwtje heeft een eigen leeg slakkenhuisje nodig op een bedje van fijn zand om in te broeden, voorzie ruim meer schelpen dan er dieren in de bak zitten',
    bron: 'WebSearch: eieren komen na circa 24 uur uit, jongen zwemmen na 6-7 dagen vrij',
  },
  {
    id: 'neolamprologus-ocellatus', naam: 'Schelpcichlide', latijn: 'Neolamprologus ocellatus', groep: 'Tanganyikameer - schelpbewoners', wijze: 'eierleggend', uitkomstdagen: 1, uitzwemdagen: 6, nest: [5, 15], temp: [25, 27], moeilijk: 1, zekerheid: 'onzeker',
    eerstevoer: 'infusorien de eerste dagen, vanaf ongeveer een week pas ontloken artemia-nauplia',
    tip: 'Net als multifasciatus onmisbaar: lege slakkenhuizen op fijn zand, zonder schelp wordt er niet gebroed',
    bron: 'geschat naar analogie met Neolamprologus multifasciatus',
  },
  {
    id: 'neolamprologus-similis', naam: 'Kleine schelpcichlide', latijn: 'Neolamprologus similis', groep: 'Tanganyikameer - schelpbewoners', wijze: 'eierleggend', uitkomstdagen: 1, uitzwemdagen: 6, nest: [5, 15], temp: [25, 27], moeilijk: 1, zekerheid: 'onzeker',
    eerstevoer: 'infusorien de eerste dagen, vanaf ongeveer een week pas ontloken artemia-nauplia',
    tip: 'Vormt grote kolonies met tientallen schelpen dicht bij elkaar, in een te kleine bak ontstaat voortdurende onderlinge stress die het broeden verstoort',
    bron: 'geschat naar analogie met Neolamprologus multifasciatus, weinig specifieke broedcijfers teruggevonden',
  },
  /* ------------------------------------------------------------ Tanganyikameer */
  {
    id: 'altolamprologus-calvus', naam: 'Calvus', latijn: 'Altolamprologus calvus', groep: 'Tanganyikameer', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 8, nest: [30, 100], temp: [25, 27], moeilijk: 2,
    eerstevoer: 'de jongen kunnen bij het vrij zwemmen meteen pas ontloken artemia-nauplia eten',
    tip: 'Het mannetje eet vaak zijn eigen jongen op, verwijder hem uit de broedgrot zodra het vrouwtje de eieren bewaakt en zet hem pas terug als de jongen goed vrij zwemmen',
    bron: 'WebSearch: eieren komen na circa 48 uur uit, jongen zwemmen na 7-10 dagen vrij',
  },
  {
    id: 'altolamprologus-compressiceps', naam: 'Compressiceps', latijn: 'Altolamprologus compressiceps', groep: 'Tanganyikameer', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 8, nest: [30, 100], temp: [25, 27], moeilijk: 2,
    eerstevoer: 'de jongen kunnen bij het vrij zwemmen meteen pas ontloken artemia-nauplia eten',
    tip: 'Legt de eieren in een spleet of schelp te klein voor het mannetje, geef een nauwe spleet zodat de vrouw ongestoord kan broeden en het mannetje niet bij de jongen kan',
    bron: 'analoog aan Altolamprologus calvus, dezelfde geslachtsgroep en broedwijze',
  },
  {
    id: 'neolamprologus-tretocephalus', naam: 'Vijfstreep Tanganyikacichlide', latijn: 'Neolamprologus tretocephalus', groep: 'Tanganyikameer', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 7, nest: [50, 150], temp: [24, 26], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'de jongen kunnen bij het vrij zwemmen meteen pas ontloken artemia-nauplia eten',
    tip: 'Wordt tijdens het broeden erg territoriaal en agressief tegenover elke andere vis in de bak, kweek dit koppel bij voorkeur apart',
    bron: 'geschat naar analogie met verwante Neolamprologus, geen exact soortspecifiek cijfer teruggevonden',
  },
  {
    id: 'tropheus-duboisi', naam: 'Tropheus duboisi', latijn: 'Tropheus duboisi', groep: 'Tanganyikameer', wijze: 'eierleggend', uitkomstdagen: 10, uitzwemdagen: 18, nest: [5, 15], temp: [25, 27], moeilijk: 2,
    eerstevoer: 'de jongen zijn bij het loslaten al groot en kunnen meteen pas ontloken artemia-nauplia en fijn poedervoer eten',
    tip: 'Is zeer gevoelig voor de beruchte Tropheus-bloat (opgezette buik), geef hoofdzakelijk plantaardig voer en vermijd stress en drukte in de kweekgroep',
    bron: 'WebSearch: vrouwtje draagt de eieren circa 3-4 weken in de bek',
  },
  {
    id: 'tropheus-moorii', naam: 'Tropheus moorii', latijn: 'Tropheus moorii', groep: 'Tanganyikameer', wijze: 'eierleggend', uitkomstdagen: 10, uitzwemdagen: 18, nest: [5, 15], temp: [25, 27], moeilijk: 2,
    eerstevoer: 'de jongen zijn bij het loslaten al groot en kunnen meteen pas ontloken artemia-nauplia en fijn poedervoer eten',
    tip: 'Net als duboisi zeer gevoelig voor bloat door te eiwitrijk voer, houd de groep bovendien groot genoeg (minstens tien tot twaalf dieren) om onderlinge agressie te spreiden',
    bron: 'WebSearch: vrouwtje draagt de eieren meer dan 4 weken in de bek',
  },
  {
    id: 'cyprichromis-leptosoma', naam: 'Cyprichromis leptosoma', latijn: 'Cyprichromis leptosoma', groep: 'Tanganyikameer', wijze: 'eierleggend', uitkomstdagen: 7, uitzwemdagen: 14, nest: [3, 10], temp: [25, 27], moeilijk: 2,
    eerstevoer: 'fijn poedervoer en pas ontloken artemia-nauplia, de jongen zijn klein bij het vrij zwemmen',
    tip: 'Zwemt vrij in de waterkolom in plaats van tussen de rotsen, geef een diepe bak en overweeg de vrouwtjes na circa drie weken voorzichtig manueel te strippen als u het legsel zeker wilt veiligstellen',
    bron: 'WebSearch: kwekers strippen doorgaans na 17-23 dagen, beste resultaat rond 21 dagen',
  },
  {
    id: 'cyphotilapia-frontosa', naam: 'Frontosa', latijn: 'Cyphotilapia frontosa', groep: 'Tanganyikameer', wijze: 'eierleggend', uitkomstdagen: 14, uitzwemdagen: 25, nest: [20, 60], temp: [24, 26], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'de jongen zijn bij het loslaten al groot en kunnen meteen pas ontloken artemia-nauplia en fijn korrelvoer eten',
    tip: 'Houdt de jongen wekenlang in de bek en groeit traag, geef de kweekgroep alle rust: bij verstoring spuwt de vrouw het legsel voortijdig uit of slikt ze het door',
    bron: 'WebSearch: vrouwtjes zijn ongeveer om de 60 dagen opnieuw legrijp, exacte broedduur niet eenduidig teruggevonden, geschat op 5-6 weken zoals courant in de literatuur',
  },
  /* ------------------------------------------------------------ Victoriameer */
  {
    id: 'astatotilapia-latifasciata', naam: 'Zebra Victoriacichlide (Obliquidens)', latijn: 'Astatotilapia latifasciata', groep: 'Victoriameer', wijze: 'eierleggend', uitkomstdagen: 7, uitzwemdagen: 13, nest: [10, 40], temp: [24, 26], moeilijk: 1,
    eerstevoer: 'pas ontloken artemia-nauplia en fijn poedervoer',
    tip: 'Vrouwtjes blijven de jongen na het loslaten nog een tijd beschermen, ze mogen bij de ouders in de bak blijven zonder gevaar te lopen',
    bron: 'WebSearch: bekbroedperiode circa twee tot drie weken (14-20 dagen)',
  },
  {
    id: 'paralabidochromis-sp-rock-kribensis', naam: 'Flameback haplochromis', latijn: 'Paralabidochromis sp. "rock kribensis"', groep: 'Victoriameer', wijze: 'eierleggend', uitkomstdagen: 7, uitzwemdagen: 14, nest: [15, 30], temp: [24, 26], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'pas ontloken artemia-nauplia en fijn poedervoer',
    tip: 'Is een rotsbewonende Victoriacichlide, geef voldoende stapelstenen als territorium per mannetje, net als bij mbuna',
    bron: 'geschat naar analogie met andere Victoriameer-haplochromines, geen soortspecifiek broedcijfer teruggevonden',
  },
  /* ------------------------------------------------------------ Betta (bellennestbouwer) */
  {
    id: 'betta-splendens', naam: 'Siamese kempvis', latijn: 'Betta splendens', groep: 'Betta (bellennestbouwer)', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [40, 400], temp: [26, 28], moeilijk: 1,
    eerstevoer: 'infusorien de eerste dagen, daarna azijnaaltjes en net uitgekomen artemia',
    tip: 'Het mannetje bouwt het bellennest en verzorgt de eieren helemaal alleen; haal het vrouwtje meteen na het afzetten weg, want het mannetje verjaagt en verwondt haar anders.',
    bron: 'courante Betta-hobbyliteratuur',
  },
  {
    id: 'betta-imbellis', naam: 'Vreedzame kempvis', latijn: 'Betta imbellis', groep: 'Betta (bellennestbouwer)', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [30, 150], temp: [25, 27], moeilijk: 2,
    eerstevoer: 'infusorien, dan azijnaaltjes en artemia-nauplieën',
    tip: 'Een erg schrikachtig legpaar: dek de bak af en voorzie voldoende dekking met planten, anders komt het niet tot afzetten.',
    bron: 'Betta-hobbyliteratuur',
  },
  {
    id: 'betta-mahachaiensis', naam: 'Mahachai-kempvis', latijn: 'Betta mahachaiensis', groep: 'Betta (bellennestbouwer)', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [20, 100], temp: [26, 28], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'infusorien, azijnaaltjes, artemia-nauplieën',
    tip: 'Komt van nature voor in brakkig mangrovewater; een snuifje aquariumzout in het kweekwater verbetert de broedresultaten duidelijk.',
    bron: 'specialistische Betta-forums, cijfers spreiden sterk',
  },
  {
    id: 'betta-smaragdina', naam: 'Smaragdkempvis', latijn: 'Betta smaragdina', groep: 'Betta (bellennestbouwer)', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [30, 150], temp: [25, 28], moeilijk: 2,
    eerstevoer: 'infusorien, azijnaaltjes, artemia-nauplieën',
    tip: 'Net als andere splendens-verwanten erg gevoelig voor onrust rond het nest; houd de kweekbak op een rustige plaats zonder trillingen.',
    bron: 'Betta-hobbyliteratuur',
  },
  {
    id: 'betta-coccina', naam: 'Coccina-kempvis', latijn: 'Betta coccina', groep: 'Betta (bellennestbouwer)', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 4, nest: [20, 50], temp: [24, 26], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'infusorien, later azijnaaltjes',
    tip: 'Heeft zeer zacht, zuur blackwaterwater nodig (pH rond 4 tot 5); in gewoon leidingwater mislukt de kweek vrijwel altijd.',
    bron: 'blackwater-aquaristiek forums, weinig gepubliceerde kweekcijfers',
  },
  /* ------------------------------------------------------------ Betta (muilbroeder) */
  {
    id: 'betta-channoides', naam: 'Channoides muilbroedkempvis', latijn: 'Betta channoides', groep: 'Betta (muilbroeder)', wijze: 'eierleggend', uitkomstdagen: 4, uitzwemdagen: 8, nest: [10, 30], temp: [25, 27], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'pas ontloken artemia meteen, de jongen zijn bij vrijlating al groot genoeg',
    tip: 'Het mannetje draagt de eitjes en larven ongeveer twaalf dagen in de bek en eet in die tijd niet; verstoor het paar of het mannetje absoluut niet.',
    bron: 'specialistische wilde-Betta-literatuur',
  },
  {
    id: 'betta-albimarginata', naam: 'Albimarginata muilbroedkempvis', latijn: 'Betta albimarginata', groep: 'Betta (muilbroeder)', wijze: 'eierleggend', uitkomstdagen: 4, uitzwemdagen: 7, nest: [10, 25], temp: [25, 27], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'pas ontloken artemia',
    tip: 'Kleine, zachte territoriumvissen: te veel stroming of harde beweging in de bak doet het mannetje het legsel uitspugen.',
    bron: 'specialistische wilde-Betta-literatuur',
  },
  {
    id: 'betta-unimaculata', naam: 'Unimaculata muilbroedkempvis', latijn: 'Betta unimaculata', groep: 'Betta (muilbroeder)', wijze: 'eierleggend', uitkomstdagen: 4, uitzwemdagen: 10, nest: [20, 80], temp: [24, 26], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'pas ontloken artemia, microworm',
    tip: 'Het mannetje draagt tot ongeveer twee weken; het vrouwtje bewaakt vaak de schuilplaats van het mannetje mee, verstoor dat duo niet.',
    bron: 'Seriously Fish, Fishipedia',
  },
  {
    id: 'betta-macrostoma', naam: 'Brunei-schoonheid', latijn: 'Betta macrostoma', groep: 'Betta (muilbroeder)', wijze: 'eierleggend', uitkomstdagen: 5, uitzwemdagen: 16, nest: [10, 20], temp: [23, 25], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'microworm en artemia-nauplieën, de jongen zijn groot genoeg vanaf 5 mm',
    tip: 'Het mannetje kan de eitjes twee tot drie weken zonder te eten in de bek dragen; zorg voor een goed sluitend deksel, warme vochtige lucht boven het water is nodig voor het labyrintorgaan.',
    bron: 'Amazonas Magazine, Seriously Fish; broedduur varieert in bronnen tussen 14 en 35 dagen',
  },
  {
    id: 'betta-picta', naam: 'Picta muilbroedkempvis', latijn: 'Betta picta', groep: 'Betta (muilbroeder)', wijze: 'eierleggend', uitkomstdagen: 4, uitzwemdagen: 7, nest: [15, 40], temp: [24, 26], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'pas ontloken artemia',
    tip: 'Zeer schuw in de bak; enkel bij voldoende schuilplaatsen en rust komt het paar tot afzetten.',
    bron: 'beperkte hobbyliteratuur',
  },
  /* ------------------------------------------------------------ Paradijsvis en verwanten */
  {
    id: 'macropodus-opercularis', naam: 'Paradijsvis', latijn: 'Macropodus opercularis', groep: 'Paradijsvis en verwanten', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [300, 700], temp: [22, 25], moeilijk: 1,
    eerstevoer: 'infusorien, dan azijnaaltjes en artemia-nauplieën',
    tip: 'Kweekt zelfs bij kamertemperatuur, maar het mannetje is berucht agressief tegen het vrouwtje; zorg voor een vluchtplaats of haal haar na het afzetten weg.',
    bron: 'courante aquariumliteratuur',
  },
  {
    id: 'macropodus-ocellatus', naam: 'Rondstaart-paradijsvis', latijn: 'Macropodus ocellatus', groep: 'Paradijsvis en verwanten', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [200, 500], temp: [20, 24], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'infusorien, azijnaaltjes, artemia-nauplieën',
    tip: 'Kweekt bij lagere temperatuur dan de gewone paradijsvis; forceer geen hoge kweektemperatuur, dat werkt averechts bij deze koudwatersoort.',
    bron: 'beperkte hobbyliteratuur',
  },
  {
    id: 'pseudosphromenus-dayi', naam: 'Dayi\'s kroonstaartje', latijn: 'Pseudosphromenus dayi', groep: 'Paradijsvis en verwanten', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [20, 80], temp: [26, 28], moeilijk: 2,
    eerstevoer: 'infusorien, azijnaaltjes',
    tip: 'Bouwt een klein, kwetsbaar nest vlak onder drijfplanten; te veel stroming of beweging aan het oppervlak doet het nest uiteenvallen.',
    bron: 'aquariumliteratuur',
  },
  {
    id: 'pseudosphromenus-cupanus', naam: 'Spitsstaart-paradijsvisje', latijn: 'Pseudosphromenus cupanus', groep: 'Paradijsvis en verwanten', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [20, 60], temp: [26, 28], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'infusorien, azijnaaltjes',
    tip: 'Net als Dayi\'s kroonstaartje een klein, kwetsbaar nest onder drijfplanten; zacht, zuur water geeft de beste resultaten.',
    bron: 'beperkte hobbyliteratuur',
  },
  /* ------------------------------------------------------------ Licorice gourami (Parosphromenus) */
  {
    id: 'parosphromenus-deissneri', naam: 'Licorice gourami', latijn: 'Parosphromenus deissneri', groep: 'Licorice gourami (Parosphromenus)', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 4, nest: [10, 30], temp: [24, 26], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'infusorien, micro-azijnaaltjes',
    tip: 'Legt de eitjes in een schuilplaats zoals een kokosschelp, in zeer zacht en zuur blackwater; bij normale leidingwaterwaarden komt er zelden iets uit.',
    bron: 'blackwater-aquaristiek en Parosphromenus-specialistenforums',
  },
  {
    id: 'parosphromenus-nagyi', naam: 'Nagyi licorice gourami', latijn: 'Parosphromenus nagyi', groep: 'Licorice gourami (Parosphromenus)', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 4, nest: [10, 30], temp: [24, 26], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'infusorien, micro-azijnaaltjes',
    tip: 'Zeer kleine legsels en extreem gevoelig voor waterkwaliteit; enkel met turfextract of aangezuurd blackwater lukt de kweek geregeld.',
    bron: 'Parosphromenus-specialistenforums',
  },
  /* ------------------------------------------------------------ Gourami (Trichopodus) */
  {
    id: 'trichopodus-trichopterus', naam: 'Blauwe gourami', latijn: 'Trichopodus trichopterus', groep: 'Gourami (Trichopodus)', wijze: 'eierleggend', uitkomstdagen: 1, uitzwemdagen: 3, nest: [500, 1000], temp: [26, 28], moeilijk: 1,
    eerstevoer: 'infusorien, dan azijnaaltjes en artemia-nauplieën',
    tip: 'Bouwt een groot bellennest met plantenresten; haal het vrouwtje meteen na het afzetten weg, want het mannetje verjaagt haar dan fel.',
    bron: 'courante aquariumliteratuur',
  },
  {
    id: 'trichopodus-leerii', naam: 'Parelgourami', latijn: 'Trichopodus leerii', groep: 'Gourami (Trichopodus)', wijze: 'eierleggend', uitkomstdagen: 1, uitzwemdagen: 3, nest: [300, 800], temp: [27, 29], moeilijk: 2,
    eerstevoer: 'infusorien, azijnaaltjes, artemia-nauplieën',
    tip: 'Een schuw legpaar: enkel in een rustige, dicht beplante bak met voldoende dekking komt het tot afzetten.',
    bron: 'courante aquariumliteratuur',
  },
  {
    id: 'trichopodus-pectoralis', naam: 'Slangenhuidgourami', latijn: 'Trichopodus pectoralis', groep: 'Gourami (Trichopodus)', wijze: 'eierleggend', uitkomstdagen: 1, uitzwemdagen: 3, nest: [700, 2000], temp: [26, 28], moeilijk: 2,
    eerstevoer: 'infusorien, azijnaaltjes, artemia-nauplieën',
    tip: 'Wordt vrij groot (tot 25 cm) en heeft daarom een ruime kweekbak nodig; het legsel is zeer talrijk.',
    bron: 'courante aquariumliteratuur',
  },
  {
    id: 'trichopodus-microlepis', naam: 'Maangourami', latijn: 'Trichopodus microlepis', groep: 'Gourami (Trichopodus)', wijze: 'eierleggend', uitkomstdagen: 1, uitzwemdagen: 3, nest: [300, 700], temp: [27, 29], moeilijk: 2,
    eerstevoer: 'infusorien, azijnaaltjes, artemia-nauplieën',
    tip: 'Het mannetje is uitermate fel bij het bewaken van het nest; voorzie een ruime bak zodat het vrouwtje kan vluchten.',
    bron: 'courante aquariumliteratuur',
  },
  {
    id: 'osphronemus-goramy', naam: 'Reuzengourami', latijn: 'Osphronemus goramy', groep: 'Gourami (Trichopodus)', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 4, nest: [1000, 5000], temp: [26, 28], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'infusorien, artemia-nauplieën, later fijn poedervoer',
    tip: 'Wordt te groot voor een woonkamerbak (tot 70 cm) en wordt hier hoogstens in een grote vijver voortgeplant; dit is geen kweekproject voor thuis.',
    bron: 'viskweekliteratuur, cijfers gelden vooral voor vijver- en kweekvijverkweek',
  },
  /* ------------------------------------------------------------ Dwerggourami (Trichogaster) */
  {
    id: 'trichogaster-lalius', naam: 'Dwerggourami', latijn: 'Trichogaster lalius', groep: 'Dwerggourami (Trichogaster)', wijze: 'eierleggend', uitkomstdagen: 1, uitzwemdagen: 3, nest: [300, 800], temp: [26, 28], moeilijk: 2,
    eerstevoer: 'infusorien, azijnaaltjes, artemia-nauplieën',
    tip: 'Koop gezonde, ziektevrije kweekdieren: handelsvoorraad draagt vaak het dwerggourami-iridovirus, wat de kweek en de jongen fnuikt.',
    bron: 'courante aquariumliteratuur',
  },
  {
    id: 'trichogaster-chuna', naam: 'Honinggourami', latijn: 'Trichogaster chuna', groep: 'Dwerggourami (Trichogaster)', wijze: 'eierleggend', uitkomstdagen: 1, uitzwemdagen: 3, nest: [100, 300], temp: [26, 28], moeilijk: 2,
    eerstevoer: 'infusorien, azijnaaltjes',
    tip: 'Kleine, gevoelige gourami: zacht en licht zuur water met veel drijfplanten geeft de beste broedresultaten.',
    bron: 'aquariumliteratuur',
  },
  {
    id: 'trichogaster-labiosa', naam: 'Diklipgourami', latijn: 'Trichogaster labiosa', groep: 'Dwerggourami (Trichogaster)', wijze: 'eierleggend', uitkomstdagen: 1, uitzwemdagen: 3, nest: [150, 400], temp: [26, 28], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'infusorien, azijnaaltjes',
    tip: 'Minder gevoelig dan de honinggourami, maar heeft net als de andere dwerggourami\'s absolute rust rond het nest nodig.',
    bron: 'beperkte hobbyliteratuur',
  },
  /* ------------------------------------------------------------ Chocoladegourami (muilbroeder) */
  {
    id: 'sphaerichthys-osphromenoides', naam: 'Chocoladegourami', latijn: 'Sphaerichthys osphromenoides', groep: 'Chocoladegourami (muilbroeder)', wijze: 'eierleggend', uitkomstdagen: 4, uitzwemdagen: 8, nest: [5, 20], temp: [26, 28], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'pas ontloken artemia-nauplieën, zeer klein aantal jongen per worp',
    tip: 'Het vrouwtje neemt de eitjes in de bek en broedt ze ongeveer twee weken uit; extreem gevoelig voor waterkwaliteit en lukt zelden buiten zacht blackwater.',
    bron: 'UK Aquatic Plant Society, Seriously Fish; sommige bronnen noemen het broeden inmiddels mogelijk paternaal',
  },
  {
    id: 'sphaerichthys-vaillanti', naam: 'Grote chocoladegourami', latijn: 'Sphaerichthys vaillanti', groep: 'Chocoladegourami (muilbroeder)', wijze: 'eierleggend', uitkomstdagen: 5, uitzwemdagen: 10, nest: [5, 15], temp: [26, 28], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'pas ontloken artemia-nauplieën',
    tip: 'Nog gevoeliger dan de gewone chocoladegourami en zelden succesvol buiten gespecialiseerde blackwaterbakken; niet aan te raden als eerste kweekproject.',
    bron: 'beperkte gespecialiseerde literatuur',
  },
  /* ------------------------------------------------------------ Kussengourami */
  {
    id: 'helostoma-temminckii', naam: 'Kussengourami', latijn: 'Helostoma temminckii', groep: 'Kussengourami', wijze: 'eierleggend', uitkomstdagen: 1, uitzwemdagen: 3, nest: [1000, 3000], temp: [28, 30], moeilijk: 2,
    eerstevoer: 'infusorien, dan azijnaaltjes en artemia-nauplieën',
    tip: 'Bouwt geen bellennest en verzorgt de eieren niet: de eitjes drijven vrij naar het oppervlak en blijven aan drijfplanten hangen; schep de eitjes af of haal de ouders weg, anders worden ze opgegeten.',
    bron: 'courante aquariumliteratuur',
  },
  /* ------------------------------------------------------------ Badis en Dario */
  {
    id: 'badis-badis', naam: 'Badis', latijn: 'Badis badis', groep: 'Badis en Dario', wijze: 'eierleggend', uitkomstdagen: 3, uitzwemdagen: 4, nest: [30, 100], temp: [24, 26], moeilijk: 2,
    eerstevoer: 'infusorien, azijnaaltjes, artemia-nauplieën',
    tip: 'Het mannetje broedt in een grot of buisje en verjaagt het vrouwtje na het afzetten; voorzie voldoende afzonderlijke schuilplaatsen.',
    bron: 'aquariumliteratuur',
  },
  {
    id: 'dario-dario', naam: 'Scarlet badis', latijn: 'Dario dario', groep: 'Badis en Dario', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 3, nest: [10, 30], temp: [24, 26], moeilijk: 2,
    eerstevoer: 'infusorien, micro-azijnaaltjes, later fijn poedervoer',
    tip: 'Legt de eitjes verspreid tussen fijne planten zoals javamos zonder broedzorg; haal de ouders na het afzetten weg, want ze eten hun eigen eitjes.',
    bron: 'aquariumliteratuur',
  },
  /* ------------------------------------------------------------ Killivissen (jaarvissen) */
  {
    id: 'nothobranchius-rachovii', naam: 'Nothobranchius rachovii', latijn: 'Nothobranchius rachovii', groep: 'Killivissen (jaarvissen)', wijze: 'eierleggend', uitkomstdagen: 210, uitzwemdagen: 1, nest: [30, 100], temp: [22, 25], moeilijk: 2,
    eerstevoer: 'pas ontloken artemia (de jongen zijn bij het uitkomen al groot genoeg)',
    tip: 'De eitjes moeten na het afzetten maanden vochtig in turf rijpen en pas na toevoeging van vers, iets kouder water komen de jongen er in enkele uren allemaal tegelijk uit; bewaar de turf niet te nat en niet te droog, ongeveer als een uitgeknepen spons.',
    bron: 'Killifish-literatuur (o.a. aquainfo.nl, Belgische Killivissenvereniging)',
  },
  {
    id: 'nothobranchius-guentheri', naam: 'Nothobranchius guentheri', latijn: 'Nothobranchius guentheri', groep: 'Killivissen (jaarvissen)', wijze: 'eierleggend', uitkomstdagen: 75, uitzwemdagen: 1, nest: [30, 100], temp: [22, 25], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'pas ontloken artemia',
    tip: 'Voor wie voor het eerst met jaarvissen begint, is deze soort vaak de aanrader: de eitjes hebben minder strikt een volledige droogteperiode nodig dan bij de meeste andere Nothobranchius, wat de kans op mislukking verkleint.',
    bron: 'Killifish-hobbyliteratuur, cijfers wisselen per bron',
  },
  {
    id: 'nothobranchius-furzeri', naam: 'Nothobranchius furzeri', latijn: 'Nothobranchius furzeri', groep: 'Killivissen (jaarvissen)', wijze: 'eierleggend', uitkomstdagen: 120, uitzwemdagen: 1, nest: [30, 100], temp: [23, 26], moeilijk: 2,
    eerstevoer: 'pas ontloken artemia',
    tip: 'Deze soort is berucht om zijn extreem korte levenscyclus: de jongen zijn al na drie tot vier weken geslachtsrijp, zodat u met dezelfde turf al na enkele maanden een nieuwe generatie kunt kweken.',
    bron: 'aquainfo.nl; wetenschappelijke publicatie over N. furzeri (PMC)',
  },
  {
    id: 'nothobranchius-korthausae', naam: 'Nothobranchius korthausae', latijn: 'Nothobranchius korthausae', groep: 'Killivissen (jaarvissen)', wijze: 'eierleggend', uitkomstdagen: 60, uitzwemdagen: 1, nest: [20, 60], temp: [23, 25], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'pas ontloken artemia',
    tip: 'Deze soort geldt als iets makkelijker dan andere Nothobranchius omdat de eitjes ook zonder volledige droogperiode kunnen uitkomen, al blijft de klassieke turfmethode de betrouwbaarste manier.',
    bron: 'Killifish-hobbyliteratuur, weinig gestandaardiseerde bronnen',
  },
  {
    id: 'nothobranchius-eggersi', naam: 'Nothobranchius eggersi', latijn: 'Nothobranchius eggersi', groep: 'Killivissen (jaarvissen)', wijze: 'eierleggend', uitkomstdagen: 150, uitzwemdagen: 1, nest: [30, 80], temp: [23, 26], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'pas ontloken artemia',
    tip: 'Net als bij andere Nothobranchius raapt u de eitjes best wekelijks uit de turf en bewaart u ze daarna enkele maanden vochtig in een afgesloten zakje voor u ze laat uitkomen.',
    bron: 'Killifish-hobbyliteratuur, minder gedocumenteerd dan rachovii/furzeri',
  },
  /* ------------------------------------------------------------ Killivissen (niet-jaarvissen) */
  {
    id: 'aphyosemion-australe', naam: 'Lierstaartkilli', latijn: 'Aphyosemion australe', groep: 'Killivissen (niet-jaarvissen)', wijze: 'eierleggend', uitkomstdagen: 13, uitzwemdagen: 2, nest: [10, 40], temp: [20, 24], moeilijk: 1,
    eerstevoer: 'infusoriën de eerste dagen, daarna pas ontloken artemia',
    tip: 'Deze soort verdraagt lagere temperaturen dan de meeste killivissen en legt de eitjes duidelijk zichtbaar in een wolmop, zodat u ze makkelijk kunt oprapen en apart laten uitkomen.',
    bron: 'Baensch Aquarium Atlas; killifish-literatuur',
  },
  {
    id: 'aphyosemion-striatum', naam: 'Aphyosemion striatum', latijn: 'Aphyosemion striatum', groep: 'Killivissen (niet-jaarvissen)', wijze: 'eierleggend', uitkomstdagen: 14, uitzwemdagen: 2, nest: [10, 30], temp: [20, 23], moeilijk: 2,
    eerstevoer: 'infusoriën, daarna pas ontloken artemia',
    tip: 'Houd de kweektemperatuur stabiel rond 22 à 23 graden: bij deze soort geeft dat betere bevruchting dan warmer water, en de eitjes zijn met het blote oog goed zichtbaar in de mop om ze te rapen.',
    bron: 'Baensch Aquarium Atlas; killifish-literatuur',
  },
  {
    id: 'aphyosemion-bivittatum', naam: 'Aphyosemion bivittatum', latijn: 'Aphyosemion bivittatum', groep: 'Killivissen (niet-jaarvissen)', wijze: 'eierleggend', uitkomstdagen: 14, uitzwemdagen: 2, nest: [10, 30], temp: [22, 25], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'infusoriën, daarna pas ontloken artemia',
    tip: 'Kweek in een dicht beplante bak met javamos: de eitjes blijven aan de mos kleven en u kunt ze om de paar dagen apart broeden zodat de ouders ze niet opeten.',
    bron: 'Killifish-hobbyliteratuur',
  },
  {
    id: 'fundulopanchax-gardneri', naam: 'Gardneri killie', latijn: 'Fundulopanchax gardneri', groep: 'Killivissen (niet-jaarvissen)', wijze: 'eierleggend', uitkomstdagen: 14, uitzwemdagen: 2, nest: [10, 40], temp: [23, 25], moeilijk: 1,
    eerstevoer: 'pas ontloken artemia, evt. eerst infusoriën',
    tip: 'Voor veel kwekers is dit de eerste killivis: de kleurenpracht van het mannetje en de simpele kweek op een wolmop maken hem ideaal om te starten voor u aan jaarvissen begint.',
    bron: 'Baensch Aquarium Atlas; killifish-literatuur',
  },
  {
    id: 'fundulopanchax-sjoestedti', naam: 'Blauwe gularis', latijn: 'Fundulopanchax sjoestedti', groep: 'Killivissen (niet-jaarvissen)', wijze: 'eierleggend', uitkomstdagen: 45, uitzwemdagen: 1, nest: [20, 80], temp: [23, 26], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'pas ontloken artemia',
    tip: 'De mannetjes zijn erg territoriaal en kunnen vrouwtjes doodbijten, dus kweek in een ruime bak met veel beschutting; de eitjes rijpen net als bij jaarvissen enkele weken vochtig in turf voor u ze laat uitkomen.',
    bron: 'Killifish-hobbyliteratuur, semi-jaarvis met wisselende incubatietijden',
  },
  {
    id: 'epiplatys-dageti', naam: 'Roodkeelkilli', latijn: 'Epiplatys dageti', groep: 'Killivissen (niet-jaarvissen)', wijze: 'eierleggend', uitkomstdagen: 12, uitzwemdagen: 2, nest: [20, 60], temp: [24, 26], moeilijk: 1,
    eerstevoer: 'pas ontloken artemia',
    tip: 'Deze soort is een echte springkampioen aan het wateroppervlak, dus ook in de kweekbak is een goed sluitend deksel broodnodig.',
    bron: 'Baensch Aquarium Atlas',
  },
  {
    id: 'epiplatys-annulatus', naam: 'Epiplatys annulatus', latijn: 'Epiplatys annulatus', groep: 'Killivissen (niet-jaarvissen)', wijze: 'eierleggend', uitkomstdagen: 12, uitzwemdagen: 3, nest: [5, 20], temp: [22, 25], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'infusoriën of azijnaaltjes, pas daarna artemia',
    tip: 'De jongen zijn bij het uitkomen piepklein en hebben de eerste dagen absoluut infusoriën of azijnaaltjes nodig; schakel u te vroeg over op artemia, dan sterft het legsel massaal.',
    bron: 'Killifish-hobbyliteratuur',
  },
  {
    id: 'aplocheilus-panchax', naam: 'Blauwe panchax', latijn: 'Aplocheilus panchax', groep: 'Killivissen (niet-jaarvissen)', wijze: 'eierleggend', uitkomstdagen: 12, uitzwemdagen: 2, nest: [20, 100], temp: [24, 27], moeilijk: 1,
    eerstevoer: 'pas ontloken artemia',
    tip: 'Deze soort zet de eitjes af tussen drijvende planten aan het oppervlak en is een echte springer, dus dek de kweekbak goed af; de relatief grote jongen kunnen al snel na het uitkomen artemia eten.',
    bron: 'Baensch Aquarium Atlas',
  },
  {
    id: 'aplocheilus-lineatus', naam: 'Gestreepte panchax', latijn: 'Aplocheilus lineatus', groep: 'Killivissen (niet-jaarvissen)', wijze: 'eierleggend', uitkomstdagen: 12, uitzwemdagen: 2, nest: [30, 150], temp: [24, 27], moeilijk: 1,
    eerstevoer: 'pas ontloken artemia',
    tip: 'Grote, felle vrouwtjes kunnen kleinere mannetjes opjagen, dus zorg voor voldoende schuilplaatsen en een goede man-vrouw verhouding in de kweekbak.',
    bron: 'Baensch Aquarium Atlas',
  },
  {
    id: 'laimosemion-xiphidius', naam: 'Rivulus (Laimosemion)', latijn: 'Laimosemion xiphidius', groep: 'Killivissen (niet-jaarvissen)', wijze: 'eierleggend', uitkomstdagen: 17, uitzwemdagen: 2, nest: [5, 20], temp: [22, 25], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'infusoriën, daarna pas ontloken artemia',
    tip: 'Deze soort zet gedurende lange tijd steeds losse eitjes af tussen fijne planten of een wolmop; verzamel regelmatig, want de ouders eten hun eigen eitjes snel op.',
    bron: 'Killifish-hobbyliteratuur (Rivulus/Laimosemion-groep), specialistisch aanbod via killivissenverenigingen',
  },
  /* ------------------------------------------------------------ Regenboogvissen */
  {
    id: 'melanotaenia-boesemani', naam: 'Boeseman regenboogvis', latijn: 'Melanotaenia boesemani', groep: 'Regenboogvissen', wijze: 'eierleggend', uitkomstdagen: 8, uitzwemdagen: 3, nest: [50, 200], temp: [26, 28], moeilijk: 2,
    eerstevoer: 'infusoriën of groen water de eerste week, daarna artemia',
    tip: 'De eitjes blijven dagenlang aan wolmatjes of draadwortel hangen; laat het legsel gewoon zitten en vis alleen de ouders terug, de piepkleine jongen hebben minstens een week fijn voer nodig voor ze op artemia overschakelen.',
    bron: 'Baensch Aquarium Atlas; Seriously Fish',
  },
  {
    id: 'melanotaenia-praecox', naam: 'Dwergregenboogvis', latijn: 'Melanotaenia praecox', groep: 'Regenboogvissen', wijze: 'eierleggend', uitkomstdagen: 7, uitzwemdagen: 2, nest: [20, 100], temp: [25, 27], moeilijk: 2,
    eerstevoer: 'infusoriën, daarna artemia',
    tip: 'Een koele waterverversing \'s ochtends zet deze soort vaak aan tot paaien, wat het net iets voorspelbaarder maakt dan bij de meeste andere regenboogvissen.',
    bron: 'Baensch Aquarium Atlas; Seriously Fish',
  },
  {
    id: 'melanotaenia-trifasciata', naam: 'Gebande regenboogvis', latijn: 'Melanotaenia trifasciata', groep: 'Regenboogvissen', wijze: 'eierleggend', uitkomstdagen: 9, uitzwemdagen: 3, nest: [50, 150], temp: [26, 28], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'infusoriën, daarna artemia',
    tip: 'Deze soort is gevoelig voor plotse waterveranderingen, dus bouw de waterwaarden in de kweekbak geleidelijk op, anders blijven de eitjes vaak onbevrucht.',
    bron: 'Baensch Aquarium Atlas',
  },
  {
    id: 'melanotaenia-lacustris', naam: 'Kutubu regenboogvis', latijn: 'Melanotaenia lacustris', groep: 'Regenboogvissen', wijze: 'eierleggend', uitkomstdagen: 8, uitzwemdagen: 3, nest: [50, 150], temp: [26, 28], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'infusoriën, daarna artemia',
    tip: 'Hang een bosje javamos of een wolmop in de bak: de vissen paaien er ochtend na ochtend eitjes in af en die kunt u het best om de paar dagen overhevelen naar een aparte opkweekbak.',
    bron: 'Seriously Fish',
  },
  {
    id: 'melanotaenia-herbertaxelrodi', naam: 'Axelrodi regenboogvis', latijn: 'Melanotaenia herbertaxelrodi', groep: 'Regenboogvissen', wijze: 'eierleggend', uitkomstdagen: 8, uitzwemdagen: 3, nest: [50, 150], temp: [25, 27], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'infusoriën, daarna artemia',
    tip: 'Voer de ouders in de aanloop naar de paai rijkelijk met levend voer, want een goede conditie bepaalt bij deze soort sterk hoeveel eitjes er komen.',
    bron: 'Seriously Fish',
  },
  {
    id: 'glossolepis-incisus', naam: 'Rode regenboogvis', latijn: 'Glossolepis incisus', groep: 'Regenboogvissen', wijze: 'eierleggend', uitkomstdagen: 9, uitzwemdagen: 3, nest: [100, 300], temp: [25, 28], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'infusoriën, daarna artemia',
    tip: 'De felrode kleur van het mannetje ontwikkelt zich pas na maanden en is een teken van paairijpheid; jonge, nog zilverkleurige mannetjes bevruchten nauwelijks.',
    bron: 'Baensch Aquarium Atlas',
  },
  {
    id: 'iriatherina-werneri', naam: 'Draadvinregenboogvis', latijn: 'Iriatherina werneri', groep: 'Regenboogvissen', wijze: 'eierleggend', uitkomstdagen: 8, uitzwemdagen: 3, nest: [10, 40], temp: [25, 28], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'infusoriën of walstroom, minstens een week voor artemia',
    tip: 'De jongen zijn extreem klein bij het uitkomen en hebben minstens een week infusoriën of walstroom nodig voor ze grof genoeg zijn voor artemia; sla die stap over en het legsel sterft massaal.',
    bron: 'Seriously Fish',
  },
  {
    id: 'pseudomugil-gertrudae', naam: 'Gertrude\'s blauwoogje', latijn: 'Pseudomugil gertrudae', groep: 'Regenboogvissen', wijze: 'eierleggend', uitkomstdagen: 11, uitzwemdagen: 3, nest: [10, 40], temp: [24, 27], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'infusoriën, daarna artemia',
    tip: 'Deze soort paait het liefst in een dichte bos javamos in een rustig hoekje; laat de mos met eitjes gewoon zitten en oogst de piepkleine jongen voorzichtig met een pipet.',
    bron: 'Seriously Fish',
  },
  {
    id: 'pseudomugil-furcatus', naam: 'Vorkstaartblauwoogje', latijn: 'Pseudomugil furcatus', groep: 'Regenboogvissen', wijze: 'eierleggend', uitkomstdagen: 10, uitzwemdagen: 3, nest: [20, 60], temp: [24, 27], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'infusoriën, daarna artemia',
    tip: 'Mannetjes tonen hun volle vinontplooiing vooral wanneer er rivalen bij zijn, dus houd minstens twee mannetjes samen om paairijp gedrag en dus paaien uit te lokken.',
    bron: 'Seriously Fish',
  },
  {
    id: 'bedotia-geayi', naam: 'Madagaskar regenboogvis', latijn: 'Bedotia geayi', groep: 'Regenboogvissen', wijze: 'eierleggend', uitkomstdagen: 9, uitzwemdagen: 3, nest: [50, 150], temp: [23, 26], moeilijk: 2,
    eerstevoer: 'infusoriën, daarna artemia',
    tip: 'Vergeleken met de meeste regenboogvissen is dit een van de makkelijker kweekbare soorten, met iets steviger jongen die sneller op artemia overschakelen.',
    bron: 'Baensch Aquarium Atlas',
  },
  /* ------------------------------------------------------------ Modderkruipers en botia's */
  {
    id: 'pangio-kuhlii', naam: 'Kuhli modderkruiper', latijn: 'Pangio kuhlii', groep: 'Modderkruipers en botia\'s', wijze: 'eierleggend', uitkomstdagen: 1, uitzwemdagen: 3, nest: [100, 300], temp: [25, 28], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'infusoriën, daarna pas ontloken artemia',
    tip: 'Paaien wordt vooral getriggerd door een plotse val in luchtdruk of een koele, zachte waterverversing die een regenbui nabootst; eitjes en jongen worden snel opgegeten, dus is een aparte kweekbak met fijnmazige bodem nodig.',
    bron: 'Verspreide fokverslagen in de hobby, weinig gestandaardiseerde data',
  },
  {
    id: 'chromobotia-macracanthus', naam: 'Clownbotia', latijn: 'Chromobotia macracanthus', groep: 'Modderkruipers en botia\'s', wijze: 'eierleggend', uitkomstdagen: 1, uitzwemdagen: 3, nest: [2000, 6000], temp: [26, 28], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'pas ontloken artemia',
    tip: 'In een gewone huiskamerbak plant deze soort zich vrijwel nooit voort: in de natuur trekt hij honderden kilometers stroomopwaarts naar overstroomde bosgebieden om te paaien, en kwekerijen gebruiken daarom hormooninjecties (Ovaprim/hCG) om dat na te bootsen.',
    bron: 'Wetenschappelijke publicatie over hormonale kweek (Aquatic Living Resources, 2012); Seriously Fish',
  },
  {
    id: 'yasuhikotakia-modesta', naam: 'Blauwe botia', latijn: 'Yasuhikotakia modesta', groep: 'Modderkruipers en botia\'s', wijze: 'eierleggend', uitkomstdagen: 1, uitzwemdagen: 3, nest: [150, 250], temp: [26, 28], moeilijk: 3,
    eerstevoer: 'pas ontloken artemia',
    tip: 'Vrijwel al het handelsaanbod komt van kwekerijen die met hormooninjecties werken; spontane paai in een thuisaquarium is niet gedocumenteerd, dus verwacht geen kweeksucces zonder gespecialiseerde aanpak.',
    bron: 'Seriously Fish',
  },
  {
    id: 'ambastaia-sidthimunki', naam: 'Dwergbotia', latijn: 'Ambastaia sidthimunki', groep: 'Modderkruipers en botia\'s', wijze: 'eierleggend', uitkomstdagen: 1, uitzwemdagen: 3, nest: [50, 150], temp: [26, 28], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'pas ontloken artemia',
    tip: 'Thuiskweek is zo goed als onmogelijk en gebeurt commercieel met hormooninjecties; enkele hobbyisten meldden spontane paai na het toevoegen van amandelbladeren (ketapang), maar reken daar niet op.',
    bron: 'Seriously Fish (fokverslag); aquariumglaser.de',
  },
  {
    id: 'botia-almorhae', naam: 'Yoyo-botia', latijn: 'Botia almorhae', groep: 'Modderkruipers en botia\'s', wijze: 'eierleggend', uitkomstdagen: 1, uitzwemdagen: 3, nest: [900, 3600], temp: [22, 25], moeilijk: 3,
    eerstevoer: 'pas ontloken artemia',
    tip: 'In de natuur paait deze bergbeeksoort in het voorjaar in koel, stromend water; dat is thuis moeilijk na te bootsen, dus komt vrijwel al het handelsaanbod van kwekerijen met hormooninductie.',
    bron: 'Wetenschappelijke publicatie over spawning biology (AIP Conference Proceedings)',
  },
  /* ------------------------------------------------------------ Stekelalen */
  {
    id: 'mastacembelus-erythrotaenia', naam: 'Vuuraal', latijn: 'Mastacembelus erythrotaenia', groep: 'Stekelalen', wijze: 'eierleggend', uitkomstdagen: 5, uitzwemdagen: 4, nest: [800, 1200], temp: [26, 28], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'pas ontloken artemia',
    tip: 'Alleen zeer grote, volwassen dieren (ruim 50 cm) zijn bij toeval gaan paaien in oversized bakken met veel drijfplanten; de jongen zijn extreem kwetsbaar en worden zelden succesvol grootgebracht.',
    bron: 'Seriously Fish; aquainfo.nl',
  },
  {
    id: 'macrognathus-aculeatus', naam: 'Pauwoogstekelaal', latijn: 'Macrognathus aculeatus', groep: 'Stekelalen', wijze: 'eierleggend', uitkomstdagen: 5, uitzwemdagen: 4, nest: [100, 400], temp: [26, 28], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'pas ontloken artemia',
    tip: 'Vrijwel alle exemplaren in de winkel zijn wildgevangen: gerichte thuiskweek is nauwelijks gedocumenteerd en de seksen zijn erg moeilijk te onderscheiden, waardoor doelbewust kweken al bij de start lastig is.',
    bron: 'Verspreide hobbyliteratuur, weinig soortspecifieke data',
  },
  /* ------------------------------------------------------------ Beekgrondels */
  {
    id: 'rhinogobius-duospilus', naam: 'Dwergdraakgrondel', latijn: 'Rhinogobius duospilus', groep: 'Beekgrondels', wijze: 'eierleggend', uitkomstdagen: 8, uitzwemdagen: 3, nest: [15, 30], temp: [20, 24], moeilijk: 2,
    eerstevoer: 'pas ontloken artemia',
    tip: 'Dit is een van de weinige beekgrondels die u zonder zout water kunt kweken: het mannetje bewaakt de eitjes onder een steen of in een grotje, en de relatief grote larven eten na het uitkomen meteen pas ontloken artemia.',
    bron: 'Practical Fishkeeping; aquarium.mn (fokverslag)',
  },
  {
    id: 'stiphodon-ornatus', naam: 'Regenbooggrondel', latijn: 'Stiphodon ornatus', groep: 'Beekgrondels', wijze: 'eierleggend', uitkomstdagen: 6, uitzwemdagen: 4, nest: [100, 300], temp: [24, 27], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'in de praktijk niet haalbaar: larven hebben zeewater nodig',
    tip: 'De larven moeten na het uitkomen maandenlang in zout zeewater doorbrengen voor ze als jonge grondel terug naar zoet water kunnen migreren; in een huiskamerbak overleeft dit stadium vrijwel nooit, dus alle handelsdieren zijn wildgevangen.',
    bron: 'Seriously Fish; Practical Fishkeeping',
  },
  {
    id: 'tateurndina-ocellicauda', naam: 'Pauwoogje', latijn: 'Tateurndina ocellicauda', groep: 'Beekgrondels', wijze: 'eierleggend', uitkomstdagen: 7, uitzwemdagen: 3, nest: [100, 300], temp: [24, 27], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'infusoriën, daarna pas ontloken artemia',
    tip: 'Het mannetje bewaakt en waaiert de eitjes in een grotje gedurende de hele incubatie; verwijder het legsel niet, want juist die zorg van het mannetje bepaalt het uitkomstpercentage.',
    bron: 'Seriously Fish; AquaInfo; fokverslagen met sterk wisselende uitkomsttijden',
  },
  /* ------------------------------------------------------------ Vlinderbaarzen */
  {
    id: 'pantodon-buchholzi', naam: 'Vlinderbaars', latijn: 'Pantodon buchholzi', groep: 'Vlinderbaarzen', wijze: 'eierleggend', uitkomstdagen: 2, uitzwemdagen: 2, nest: [100, 400], temp: [25, 28], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'pas ontloken artemia (piepklein, aan het wateroppervlak)',
    tip: 'Eieren en jongen worden door de ouders niet verzorgd en vaak zelfs opgegeten, dus schep de drijvende eitjes dagelijks van het wateroppervlak; de jongen zijn nadien nog moeilijk grootgebracht omdat ze enkel piepklein levend voer aan het oppervlak accepteren.',
    bron: 'Seriously Fish; TFH Magazine',
  },
  /* ------------------------------------------------------------ Overige */
  {
    id: 'polypterus-senegalus', naam: 'Senegal bichir', latijn: 'Polypterus senegalus', groep: 'Overige', wijze: 'eierleggend', uitkomstdagen: 4, uitzwemdagen: 10, nest: [100, 300], temp: [26, 28], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'pas ontloken artemia, later fijngehakte watervlooien of tubifex',
    tip: 'Bijna alle bichirs in de winkel zijn wildgevangen of hormonaal gekweekt op kwekerijen; spontane kweek in een thuisaquarium lukt vooral bij dieren die zelf al in gevangenschap geboren zijn, vaak getriggerd door een grote waterverversing die een regenbui nabootst.',
    bron: 'wetwebmedia.com; foraquarist.com; Biotope Aquarium Project',
  },
  {
    id: 'carinotetraodon-travancoricus', naam: 'Dwergkogelvis', latijn: 'Carinotetraodon travancoricus', groep: 'Overige', wijze: 'eierleggend', uitkomstdagen: 5, uitzwemdagen: 3, nest: [5, 20], temp: [24, 26], moeilijk: 2,
    eerstevoer: 'microwormen, daarna pas ontloken artemia',
    tip: 'De vrouwtjes zetten telkens maar een paar eitjes af, verspreid tussen javamos; controleer de mos dagelijks en licht de eitjes voorzichtig over naar een apart kweekbakje, anders worden ze snel opgegeten.',
    bron: 'Wetenschappelijke publicatie embryonale ontwikkeling (Zygote, 2024); Seriously Fish',
  },
  {
    id: 'dichotomyctere-nigroviridis', naam: 'Groene kogelvis', latijn: 'Dichotomyctere nigroviridis', groep: 'Overige', wijze: 'eierleggend', uitkomstdagen: 6, uitzwemdagen: 3, nest: [100, 300], temp: [25, 28], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'pas ontloken artemia',
    tip: 'Dit is een brakwatervis waarvan de kweek nauwelijks gedocumenteerd is: in 2009 lukte het één keer in een universiteitslab, maar bij hobbyisten is spontane voortplanting zo goed als onbekend, mede omdat mannetjes en vrouwtjes visueel niet te onderscheiden zijn.',
    bron: 'Fishlore; Wikipedia; geen soortspecifieke kweekdata bekend, cijfers bij benadering op basis van verwante kogelvissen',
  },
  /* ------------------------------------------------------------ Garnaal */
  {
    id: 'neocaridina-davidi', naam: 'Neocaridina (kleurgarnalen: Red Cherry, Blue Dream, Yellow Fire e.a.)', latijn: 'Neocaridina davidi', groep: 'Garnaal', wijze: 'garnaal', draagdagen: 25, nest: [20, 50], temp: [20, 26], moeilijk: 1,
    eerstevoer: 'geen apart voer nodig: de jongen zijn vanaf de geboorte miniatuurgarnaaltjes en grazen meteen op biofilm en algen',
    tip: 'Er is geen larvestadium en dus geen brak water nodig, plaats wel voldoende mos of andere fijne begroeiing zodat de piepkleine jongen zich kunnen verstoppen tot ze groot genoeg zijn.',
    bron: 'AquaInfo, Sakura-shrimp, Onlineaquariumspullen',
  },
  {
    id: 'caridina-cf-cantonensis-bee', naam: 'Bijengarnaal (Crystal Red / Crystal Black)', latijn: 'Caridina cf. cantonensis (Bee)', groep: 'Garnaal', wijze: 'garnaal', draagdagen: 28, nest: [15, 35], temp: [18, 25], moeilijk: 2,
    eerstevoer: 'geen apart voer nodig, de jongen eten meteen biofilm en algen op het decor',
    tip: 'Is gevoelig voor schommelende waterwaarden, houd de KH laag en stabiel, want bij pieken in het KH of de geleidbaarheid stopt de aanmaak van eieren of sterven de jongen kort na de geboorte.',
    bron: 'AquaInfo, Heevis, Tropischevissengids',
  },
  {
    id: 'caridina-mariae-cf-cantonensis-tiger', naam: 'Tijgergarnaal', latijn: 'Caridina mariae (cf. cantonensis Tiger)', groep: 'Garnaal', wijze: 'garnaal', draagdagen: 28, nest: [15, 30], temp: [20, 25], moeilijk: 2,
    eerstevoer: 'geen apart voer nodig, de jongen eten meteen biofilm en algen',
    tip: 'Kruist gemakkelijk met de bijengarnaal-vormen, houd beide dus niet in dezelfde bak wanneer u een zuivere tekening wilt behouden.',
    bron: 'AquaInfo, Tropischevissengids',
  },
  {
    id: 'caridina-multidentata', naam: 'Amanogarnaal', latijn: 'Caridina multidentata', groep: 'Garnaal', wijze: 'garnaal', draagdagen: 30, nest: [500, 2000], temp: [22, 26], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'de larven in brak water leven van fijn algenpoeder of groenwaterconcentraat, jonge garnaaltjes na de gedaanteverwisseling eten weer gewoon biofilm',
    tip: 'De vrouwtjes zetten hun eieren wel af in zoet water, maar de larven moeten binnen een paar dagen naar brak water (rond 25 g zeezout per liter) om te overleven, zonder die stap in de kweek komt er in een gewoon zoetwateraquarium geen nakweek.',
    bron: 'AquaForum, Wereld van Machines, Centrum Aquamarijn; nestgrootte varieert sterk per bron',
  },
  {
    id: 'macrobrachium-lanchesteri', naam: 'Macrobrachium (dwerggarnaal, glasgarnaal)', latijn: 'Macrobrachium lanchesteri', groep: 'Garnaal', wijze: 'garnaal', draagdagen: 21, nest: [20, 100], temp: [24, 28], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'infusorien of zeer fijn algenpoeder de eerste dagen, daarna pas ontloken artemia',
    tip: 'In tegenstelling tot de meeste Macrobrachium-soorten voltooit deze zijn hele levenscyclus in zoet water, maar de vrijzwemmende larfjes zijn erg klein en kwetsbaar, dus vang ze op in een apart bakje met een sponsfilter, weg van de ouders die ze zelf opeten.',
    bron: 'NBAT, ScienceDirect (Life history M. lanchesteri), aquariumfora; cijfers zijn benaderingen',
  },
  /* ------------------------------------------------------------ Kreeft */
  {
    id: 'cambarellus-patzcuarensis', naam: 'Dwergkreeft (CPO)', latijn: 'Cambarellus patzcuarensis', groep: 'Kreeft', wijze: 'garnaal', draagdagen: 25, nest: [15, 30], temp: [20, 26], moeilijk: 1,
    eerstevoer: 'fijn poedervoer of algentabletten, de jongen zijn miniatuurkreeftjes en eten meteen mee met de ouders',
    tip: 'Houd het vrouwtje met eieren apart van vissen en grotere tankgenoten, want zodra de piepkleine kreeftjes loslaten worden ze gretig opgegeten.',
    bron: 'AquaInfo, LICG, Heevis',
  },
  {
    id: 'procambarus-alleni', naam: 'Blauwe Floridakreeft', latijn: 'Procambarus alleni', groep: 'Kreeft', wijze: 'garnaal', draagdagen: 28, nest: [50, 200], temp: [20, 26], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'fijn poedervoer, gekookte groente en voerresten van de ouders',
    tip: 'Graaft holen in de bodem en gedraagt zich territoriaal, voorzie dus voldoende buizen en potjes als schuilplaats, anders vallen kreeften onderling en trage vissen elkaar aan.',
    bron: 'AquaInfo, Heevis, G&D Aquaria; niet op de EU-Unielijst, wel gebonden aan lokale houdregels',
  },
  {
    id: 'cherax-quadricarinatus', naam: 'Australische roodklauwkreeft', latijn: 'Cherax quadricarinatus', groep: 'Kreeft', wijze: 'garnaal', draagdagen: 35, nest: [200, 800], temp: [24, 28], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'fijn poedervoer en spirulinatabletten',
    tip: 'Haalt een flink formaat en heeft daarom een ruime bak (vanaf zo\'n 150 liter voor een koppel) nodig om te kweken, scheid de jongen vroeg van de ouders en van elkaar om kannibalisme te beperken.',
    bron: 'algemene kweekliteratuur warmwaterkreeften; niet op de EU-Unielijst',
  },
  /* ------------------------------------------------------------ Slak */
  {
    id: 'neritina-natalensis-turrita-e-a', naam: 'Neritina (zebraslak, tijgerslak e.a. vormen)', latijn: 'Neritina natalensis / turrita e.a.', groep: 'Slak', wijze: 'eierleggend', uitkomstdagen: 15, uitzwemdagen: 30, nest: [1, 3], temp: [24, 28], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'de vrijzwemmende larven leven in brak water van fijn algen- en phytoplankton, jonge slakjes na de gedaanteverwisseling eten algen',
    tip: 'Legt in een gewoon zoetwateraquarium wel witte eikapsels, maar die komen nooit uit, enkel in brak tot zout water ontwikkelen de larven zich verder, dat is precies waarom deze slak nooit voor een plaag zorgt en waarom thuiskweek vrijwel nooit lukt.',
    bron: 'AquaInfo, azaqua.nl, algemene neritide-biologie; exacte larvale duur slecht gedocumenteerd in hobbybronnen',
  },
  {
    id: 'clithon-corona-e-a', naam: 'Clithon (geweislak, hoornslak)', latijn: 'Clithon corona e.a.', groep: 'Slak', wijze: 'eierleggend', uitkomstdagen: 15, uitzwemdagen: 30, nest: [1, 3], temp: [24, 28], moeilijk: 3, zekerheid: 'onzeker',
    eerstevoer: 'larven leven in brak water van fijn algen- en phytoplankton',
    tip: 'Net als de Neritina komen de eitjes in een zoetwaterbak wel tot ontwikkeling maar nooit tot uitkomen zonder brak water, de dieren in de winkel zijn dan ook vrijwel altijd wildvang.',
    bron: 'aquaforum.nl, azaqua.nl, Wikipedia Clithon corona',
  },
  {
    id: 'pomacea-bridgesii-diffusa', naam: 'Appelslak', latijn: 'Pomacea bridgesii / diffusa', groep: 'Slak', wijze: 'eierleggend', uitkomstdagen: 21, uitzwemdagen: 2, nest: [50, 200], temp: [24, 28], moeilijk: 1,
    eerstevoer: 'jonge slakjes eten meteen algen, zacht blad en slakkenvoer',
    tip: 'De vrouwtjes zetten het legsel boven de waterlijn af, laat daarom een vochtige luchtruimte van zo\'n 10 cm onder het deksel vrij zonder condens die terugdruipt, anders verdrinken of verdrogen de eitjes.',
    bron: 'applesnail.net, AquaClaire, Tropischevissengids',
  },
  {
    id: 'planorbella-planorbarius-corneus', naam: 'Posthoornslak', latijn: 'Planorbella / Planorbarius corneus', groep: 'Slak', wijze: 'eierleggend', uitkomstdagen: 21, uitzwemdagen: 1, nest: [10, 40], temp: [18, 25], moeilijk: 1,
    eerstevoer: 'algen, biofilm en groenvoerresten',
    tip: 'Is een hermafrodiet die zich al met één dier kan voortplanten, beperk het voedselaanbod als u geen snelle populatie-explosie wilt.',
    bron: 'Shrimporium, AquariumBegin, Tropischevissengids',
  },
  {
    id: 'physa-physella-acuta', naam: 'Blaasslak', latijn: 'Physa / Physella acuta', groep: 'Slak', wijze: 'eierleggend', uitkomstdagen: 12, uitzwemdagen: 1, nest: [10, 40], temp: [18, 26], moeilijk: 1,
    eerstevoer: 'algen en voerresten',
    tip: 'Plant zich via zelfbevruchting razendsnel voort en geldt daarom bij veel kwekers als lastige lifter, wie ze bewust als visvoer kweekt heeft aan een emmer met wat voerresten al genoeg.',
    bron: 'algemene aquariumliteratuur (bekende plaagslak)',
  },
  {
    id: 'tylomelania-spp', naam: 'Tylomelania (Sulawesi-slak, rocket snail)', latijn: 'Tylomelania spp.', groep: 'Slak', wijze: 'levendbarend', draagdagen: 45, nest: [1, 2], temp: [26, 29], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'de jongen worden volledig ontwikkeld geboren en eten meteen dood blad, biofilm en slakkenvoer',
    tip: 'Een vrouwtje zet slechts één tot twee kant-en-klare jongen per maand af, reken dus niet op een snelle populatiegroei en zorg voor een zachte, dikke bodemlaag om in te graven en warm water, want bij te lage temperatuur stopt de kweek helemaal.',
    bron: 'NBAT (Tylomelania, zoetwaterslakken uit Sulawesi); draagduur per jong is een schatting, harde kweekbronnen ontbreken',
  },
  /* ------------------------------------------------------------ Koudwatervis */
  {
    id: 'carassius-auratus', naam: 'Goudvis', latijn: 'Carassius auratus', groep: 'Koudwatervis', wijze: 'eierleggend', uitkomstdagen: 5, uitzwemdagen: 4, nest: [500, 2000], temp: [20, 23], moeilijk: 2,
    eerstevoer: 'infusorien de eerste dagen, daarna fijn poedervoer of pas ontloken artemia',
    tip: 'Eet de eigen kuit en jongen gretig op, verwijder de ouders direct na het afzetten of gebruik een dichte plantenmat of een rooster boven de bodem om een deel van het legsel te beschermen.',
    bron: 'LICG, allesovergoudvissen.nl, EZNC',
  },
  {
    id: 'carassius-auratus-shubunkin', naam: 'Shubunkin', latijn: 'Carassius auratus (shubunkin)', groep: 'Koudwatervis', wijze: 'eierleggend', uitkomstdagen: 5, uitzwemdagen: 4, nest: [500, 2000], temp: [20, 23], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'infusorien, daarna fijn poedervoer of pas ontloken artemia',
    tip: 'De kweekbiologie is identiek aan de gewone goudvis, selecteer de ouderdieren wel bewust op een mooie, gelijkmatige kaliko-tekening, want de jongen variëren onderling sterk in kleurpatroon.',
    bron: 'cijfers overgenomen van Carassius auratus (dezelfde soort), geen shubunkin-specifieke bron gevonden',
  },
  {
    id: 'carassius-auratus-sluierstaart', naam: 'Sluierstaart', latijn: 'Carassius auratus (sluierstaart)', groep: 'Koudwatervis', wijze: 'eierleggend', uitkomstdagen: 6, uitzwemdagen: 4, nest: [300, 1000], temp: [20, 23], moeilijk: 2, zekerheid: 'onzeker',
    eerstevoer: 'infusorien, daarna fijn poedervoer of pas ontloken artemia',
    tip: 'Jongen komen zonder de kenmerkende gevorkte staart en lange vinnen ter wereld, dat vormt pas na enkele weken, dus selecteer op vorm pas na twee tot drie maanden en houd rekening met meer zwemblaasproblemen bij de jongen dan bij gewone goudvisjongen.',
    bron: 'algemene goudviskweekliteratuur, nestgrootte lager geschat door de compactere lichaamsbouw',
  },
  {
    id: 'cyprinus-carpio', naam: 'Koi', latijn: 'Cyprinus carpio', groep: 'Koudwatervis', wijze: 'eierleggend', uitkomstdagen: 5, uitzwemdagen: 3, nest: [50000, 300000], temp: [18, 23], moeilijk: 2,
    eerstevoer: 'infusorien, daarna pas ontloken artemia en fijn poedervoer',
    tip: 'Paait heftig in ondiep water tegen paaimatten of planten, meestal in de vroege ochtend, verwijder de ouders meteen na het afzetten want ook koi eet de eigen kuit op.',
    bron: 'koidream.nl, algemene koikweekliteratuur; nestgrootte is een ruime orde-van-grootte',
  },
  {
    id: 'rhodeus-amarus', naam: 'Bittervoorn', latijn: 'Rhodeus amarus', groep: 'Koudwatervis', wijze: 'eierleggend', uitkomstdagen: 6, uitzwemdagen: 18, nest: [3, 40], temp: [15, 20], moeilijk: 3,
    eerstevoer: 'fijn poedervoer of infusorien zodra de jongen de mossel verlaten',
    tip: 'Het vrouwtje zet de eieren met een legbuis in een levende zoetwatermossel, zonder een gezonde mossel in de bak lukt de kweek gewoon niet en die mosselen zijn zelf al lastig gezond te houden in een aquarium.',
    bron: 'Natura2000 soortprofiel, edepot.wur.nl kennisdocument bittervoorn, koidream.nl',
  },
  {
    id: 'phoxinus-phoxinus', naam: 'Elrits', latijn: 'Phoxinus phoxinus', groep: 'Koudwatervis', wijze: 'eierleggend', uitkomstdagen: 7, uitzwemdagen: 4, nest: [200, 1000], temp: [15, 22], moeilijk: 2,
    eerstevoer: 'infusorien, daarna pas ontloken artemia',
    tip: 'Is een schoolvis die pas paait in een groep van minstens acht tot tien dieren in koel, zuurstofrijk water met stroming, zonder soortgenoten en zonder die koelte komt het paaigedrag zelden op gang.',
    bron: 'Wikipedia Elrits, minlnv.nederlandsesoorten.nl, pondlibrary.com',
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
