/**
 * Maakt de drie waarden voor het ingebouwde beheerdersaccount in js/auth.js.
 *
 * Gebruik:
 *   node scripts/maak-wachtwoord.mjs "uw nieuwe wachtwoord"
 *
 * Plak de uitvoer in js/auth.js, in het blok INGEBOUWD. Het wachtwoord zelf
 * komt nergens in de code terecht, enkel het zout, het aantal rondes en de
 * afgeleide sleutel.
 *
 * Let op: die afgeleide sleutel staat straks in de app die op de website komt.
 * PBKDF2 met 250.000 rondes maakt raden traag, maar een kort of voor de hand
 * liggend wachtwoord blijft te kraken. Kies een zin van vier of vijf woorden,
 * en gebruik ze nergens anders.
 */
import { pbkdf2Sync, randomBytes } from 'node:crypto';

const wachtwoord = process.argv[2];
if (!wachtwoord) {
  console.error('Geef het wachtwoord mee: node scripts/maak-wachtwoord.mjs "uw wachtwoord"');
  process.exit(1);
}
if (wachtwoord.length < 10) {
  console.error(`Dat wachtwoord is ${wachtwoord.length} tekens. Neem er minstens tien, een zin werkt het best.`);
  process.exit(1);
}

const ITERATIES = 250000;
const zout = randomBytes(16).toString('hex');
const hash = pbkdf2Sync(wachtwoord, Buffer.from(zout, 'hex'), ITERATIES, 32, 'sha256').toString('hex');

console.log('Plak dit in js/auth.js, in het blok INGEBOUWD:\n');
console.log(`  zout: '${zout}',`);
console.log(`  iteraties: ${ITERATIES},`);
console.log(`  hash: '${hash}',`);
console.log('\nHet e-mailadres past u daar zelf aan als dat wijzigt.');
