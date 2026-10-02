import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const require = createRequire(import.meta.url);
const sharp = require("sharp");
const root = fileURLToPath(new URL("..", import.meta.url));
const assets = join(root, "public", "assets");

const base = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="paper" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#f4f2ff"/></linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4f46e5"/><stop offset=".55" stop-color="#7c3aed"/><stop offset="1" stop-color="#087f8c"/></linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#paper)"/>
  <rect x="805" width="395" height="630" fill="#151936"/>
  <rect width="14" height="630" fill="url(#accent)"/>
  <circle cx="110" cy="60" r="3" fill="#4f46e5" opacity=".5"/><circle cx="135" cy="60" r="3" fill="#7c3aed" opacity=".45"/><circle cx="160" cy="60" r="3" fill="#087f8c" opacity=".45"/>
  <text x="62" y="92" font-family="Nimbus Sans,Arial,sans-serif" font-size="22" font-weight="700" letter-spacing="4" fill="#4f46e5">MUHAMMAD HARIS ASLAM</text>
  <text x="58" y="204" font-family="Nimbus Sans,Arial,sans-serif" font-size="72" font-weight="700" letter-spacing="-2.5" fill="#15182b">GCC OPERATOR</text>
  <text x="58" y="286" font-family="Nimbus Sans,Arial,sans-serif" font-size="72" font-weight="700" letter-spacing="-2.5" fill="#15182b">&amp; BUSINESS BUILDER</text>
  <rect x="60" y="322" width="650" height="6" rx="3" fill="url(#accent)"/>
  <text x="60" y="382" font-family="Nimbus Sans,Arial,sans-serif" font-size="24" font-weight="700" fill="#343a55">Commerce · Growth · Transformation · Applied AI</text>
  <text x="60" y="436" font-family="Nimbus Sans,Arial,sans-serif" font-size="20" fill="#566078">Operating perspectives grounded in economics,</text>
  <text x="60" y="468" font-family="Nimbus Sans,Arial,sans-serif" font-size="20" fill="#566078">execution and measurable business performance.</text>
  <text x="60" y="564" font-family="Nimbus Sans,Arial,sans-serif" font-size="17" font-weight="700" letter-spacing="2.2" fill="#087f8c">QATAR  ·  OMAN  ·  SAUDI ARABIA  ·  UAE</text>
</svg>`);

const overlay = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="shade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#151936" stop-opacity=".82"/><stop offset=".38" stop-color="#151936" stop-opacity=".2"/><stop offset="1" stop-color="#151936" stop-opacity=".02"/></linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4f46e5"/><stop offset=".55" stop-color="#7c3aed"/><stop offset="1" stop-color="#087f8c"/></linearGradient>
  </defs>
  <rect x="805" width="395" height="630" fill="url(#shade)"/>
  <rect x="797" width="8" height="630" fill="url(#accent)"/>
  <rect x="846" y="506" width="294" height="76" rx="18" fill="#11152f" opacity=".9"/>
  <text x="872" y="540" font-family="Nimbus Sans,Arial,sans-serif" font-size="18" font-weight="700" fill="#fff">MHARISASLAM.COM</text>
  <text x="872" y="565" font-family="Nimbus Sans,Arial,sans-serif" font-size="14" fill="#a5f3fc">Operating ideas. Practical evidence.</text>
</svg>`);

const portrait = await sharp(join(assets, "haris-aslam.webp"))
  .resize(395, 630, { fit: "cover", position: "attention" })
  .png()
  .toBuffer();

await sharp(base, { density: 144 })
  .resize(1200, 630)
  .composite([
    { input: portrait, left: 805, top: 0 },
    { input: overlay, left: 0, top: 0 }
  ])
  .png({ compressionLevel: 9, adaptiveFiltering: true, palette: true, colours: 256, quality: 92 })
  .toFile(join(assets, "og-card-v2.png"));

console.log("Generated public/assets/og-card-v2.png (1200×630)");
