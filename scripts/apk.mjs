/**
 * Bouwt de debug-APK met Gradle, op elk besturingssysteem.
 * Gebruik: node scripts/apk.mjs   (of: npm run apk, dat eerst npm run sync doet)
 * Op Windows gebruikt dit gradlew.bat, elders ./gradlew.
 */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const WORTEL = join(dirname(fileURLToPath(import.meta.url)), '..');
const ANDROID = join(WORTEL, 'android');
const wrapper = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';

if (!existsSync(join(ANDROID, process.platform === 'win32' ? 'gradlew.bat' : 'gradlew'))) {
  console.error('De map android/ is nog niet aangemaakt. Doe eerst: npx cap add android');
  process.exit(1);
}

const uitvoer = spawnSync(wrapper, ['assembleDebug'], { cwd: ANDROID, stdio: 'inherit', shell: process.platform === 'win32' });
if (uitvoer.status !== 0) process.exit(uitvoer.status ?? 1);
console.log(`Klaar: ${join(ANDROID, 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk')}`);
