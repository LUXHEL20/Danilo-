/**
 * Bouwt de Android-app met Gradle, op elk besturingssysteem.
 * Gebruik: node scripts/apk.mjs [release]   (of: npm run apk / npm run apk:release,
 * die eerst npm run sync doen)
 * Op Windows gebruikt dit gradlew.bat, elders ./gradlew.
 *
 * Zonder argument: debug-APK, ongetekend, rechtstreeks te installeren voor eigen test.
 * Met "release": bouwt een ondertekende .aab (voor Play Console) én een ondertekende
 * .apk (voor rechtstreekse installatie). Vereist android/keystore.properties (zie
 * android/keystore.properties.example en het hoofdstuk "Release-ondertekening" in de
 * README) — ontbreekt dat bestand, dan bouwt Gradle een ongetekende release door.
 */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const WORTEL = join(dirname(fileURLToPath(import.meta.url)), '..');
const ANDROID = join(WORTEL, 'android');
const wrapper = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';
const release = process.argv.includes('release');

if (!existsSync(join(ANDROID, process.platform === 'win32' ? 'gradlew.bat' : 'gradlew'))) {
  console.error('De map android/ is nog niet aangemaakt. Doe eerst: npx cap add android');
  process.exit(1);
}

if (release && !existsSync(join(ANDROID, 'keystore.properties'))) {
  console.warn(
    'Waarschuwing: android/keystore.properties ontbreekt. De release-build wordt ' +
    'ONGETEKEND gemaakt en kan niet naar Play Console geüpload worden. ' +
    'Zie het hoofdstuk "Release-ondertekening" in de README.'
  );
}

const taken = release ? ['bundleRelease', 'assembleRelease'] : ['assembleDebug'];
const uitvoer = spawnSync(wrapper, taken, { cwd: ANDROID, stdio: 'inherit', shell: process.platform === 'win32' });
if (uitvoer.status !== 0) process.exit(uitvoer.status ?? 1);

if (release) {
  console.log(`Klaar:\n  ${join(ANDROID, 'app', 'build', 'outputs', 'bundle', 'release', 'app-release.aab')} (voor Play Console)`);
  console.log(`  ${join(ANDROID, 'app', 'build', 'outputs', 'apk', 'release', 'app-release.apk')} (voor rechtstreekse installatie)`);
} else {
  console.log(`Klaar: ${join(ANDROID, 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk')}`);
}
