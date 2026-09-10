/**
 * Maakt een synthetische teststripfoto (png) zonder extra pakketten: donkere ondergrond,
 * witte strip en zes gekleurde velden. Wordt gebruikt door strip-test.mjs.
 * Gebruik: node test/maak-strip.mjs uit.png '#kleur1' ... '#kleur6'  (van boven naar onder)
 */
import { deflateSync } from 'node:zlib';
import { writeFileSync } from 'node:fs';

const crcTabel = new Uint32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc32 = (buf) => {
  let c = 0xffffffff;
  for (const b of buf) c = crcTabel[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (soort, data) => {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(soort, 'ascii'), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
};
const hex2rgb = (h) => [1, 3, 5].map((i) => parseInt(h.replace('#', '').slice(i - 1, i + 1), 16));

/** Bouwt de png en geeft de Buffer terug. kleuren: zes hex-kleuren van boven naar onder. */
export function maakStrip(kleuren) {
  if (kleuren.length !== 6) throw new Error('zes kleuren nodig');
  const rgb = kleuren.map(hex2rgb);
  const W = 600, H = 900;
  const ACHTER = [38, 40, 46], WIT = [250, 250, 248];
  const SX0 = 240, SX1 = 360, SY0 = 80, SY1 = 820, PAD_H = 60;
  const gebied0 = SY0 + 90, gebied1 = SY1 - 90, slot = (gebied1 - gebied0) / 6;
  const velden = rgb.map((kl, i) => { const c = gebied0 + slot * (i + 0.5); return [Math.floor(c - PAD_H / 2), Math.floor(c + PAD_H / 2), kl]; });
  const raw = Buffer.alloc((W * 3 + 1) * H);
  let p = 0;
  for (let y = 0; y < H; y++) {
    raw[p++] = 0;
    for (let x = 0; x < W; x++) {
      let k = ACHTER;
      if (x >= SX0 && x < SX1 && y >= SY0 && y < SY1) {
        k = WIT;
        for (const [y0, y1, kl] of velden) if (y >= y0 && y < y1 && x >= SX0 + 6 && x < SX1 - 6) { k = kl; break; }
      }
      const ruis = ((x * 7 + y * 13) % 5) - 2; // lichte ruis zodat het op een foto lijkt
      for (const v of k) raw[p++] = Math.max(0, Math.min(255, v + ruis));
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4); ihdr[8] = 8; ihdr[9] = 2;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0)),
  ]);
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split(/[\\/]/).pop())) {
  const [uit, ...kleuren] = process.argv.slice(2);
  if (!uit || kleuren.length !== 6) { console.error('Gebruik: node test/maak-strip.mjs uit.png k1 k2 k3 k4 k5 k6'); process.exit(1); }
  writeFileSync(uit, maakStrip(kleuren));
  console.log('geschreven', uit);
}
