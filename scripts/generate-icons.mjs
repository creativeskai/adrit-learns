// Generates the app icon (a lion mascot matching the home screen badge) as
// static PNGs, with a hand-rolled encoder — next/og's bundled @vercel/og
// build crashes on Windows checkouts (fileURLToPath gets a path.join'd
// file:// URL, which is invalid), so we can't use ImageResponse here.
import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url)) + "/..";

const COLORS = {
  bg: "#FFD166",
  mane: "#E07B39",
  face: "#FFF3D6",
  dark: "#332114",
  nose: "#B5651D",
};

function hexToRgb(hex) {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function crc32(buf) {
  const table = crc32.table || (crc32.table = (() => {
    const t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? (0xedb88320 ^ (c >>> 1)) : c >>> 1;
      t[n] = c >>> 0;
    }
    return t;
  })());
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function encodePNG(width, height, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA

  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0; // filter: none
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }
  const idatData = deflateSync(raw);

  return Buffer.concat([sig, chunk("IHDR", ihdr), chunk("IDAT", idatData), chunk("IEND", Buffer.alloc(0))]);
}

function drawCircle(buf, S, cx, cy, r, color) {
  const minX = Math.max(0, Math.floor(cx - r)), maxX = Math.min(S - 1, Math.ceil(cx + r));
  const minY = Math.max(0, Math.floor(cy - r)), maxY = Math.min(S - 1, Math.ceil(cy + r));
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const dx = x - cx, dy = y - cy;
      if (dx * dx + dy * dy <= r * r) {
        const idx = (y * S + x) * 4;
        buf[idx] = color[0]; buf[idx + 1] = color[1]; buf[idx + 2] = color[2]; buf[idx + 3] = 255;
      }
    }
  }
}

function drawLionIcon(size, { padding = 0 } = {}) {
  const SS = 4; // supersample factor for anti-aliasing
  const S = size * SS;
  const buf = Buffer.alloc(S * S * 4);

  const bg = hexToRgb(COLORS.bg);
  const mane = hexToRgb(COLORS.mane);
  const face = hexToRgb(COLORS.face);
  const dark = hexToRgb(COLORS.dark);
  const nose = hexToRgb(COLORS.nose);

  const cx = S / 2, cy = S / 2;
  const scale = 1 - padding;
  const maneR = S * 0.46 * scale;
  const faceR = S * 0.30 * scale;
  const lobes = 14;
  const waveAmp = maneR * 0.16;

  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const dx = x - cx, dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);
      const maneEdge = maneR + waveAmp * Math.sin(lobes * angle);

      let color = bg;
      if (dist <= maneEdge) color = mane;
      if (dist <= faceR) color = face;

      const idx = (y * S + x) * 4;
      buf[idx] = color[0]; buf[idx + 1] = color[1]; buf[idx + 2] = color[2]; buf[idx + 3] = 255;
    }
  }

  const eyeR = S * 0.028;
  const eyeOffsetX = faceR * 0.42;
  const eyeOffsetY = -faceR * 0.1;
  drawCircle(buf, S, cx - eyeOffsetX, cy + eyeOffsetY, eyeR, dark);
  drawCircle(buf, S, cx + eyeOffsetX, cy + eyeOffsetY, eyeR, dark);
  drawCircle(buf, S, cx, cy + faceR * 0.32, S * 0.034, nose);

  // downsample back to target size (box filter)
  const out = Buffer.alloc(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let r = 0, g = 0, b = 0, a = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const idx = ((y * SS + sy) * S + (x * SS + sx)) * 4;
          r += buf[idx]; g += buf[idx + 1]; b += buf[idx + 2]; a += buf[idx + 3];
        }
      }
      const n = SS * SS;
      const oidx = (y * size + x) * 4;
      out[oidx] = Math.round(r / n); out[oidx + 1] = Math.round(g / n);
      out[oidx + 2] = Math.round(b / n); out[oidx + 3] = Math.round(a / n);
    }
  }
  return out;
}

function writeIcon(path, size, opts) {
  const rgba = drawLionIcon(size, opts);
  const png = encodePNG(size, size, rgba);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, png);
  console.log("wrote", path, `${size}x${size}`);
}

writeIcon(join(root, "app/icon.png"), 32);
writeIcon(join(root, "app/apple-icon.png"), 180);
writeIcon(join(root, "public/icons/icon-192.png"), 192);
writeIcon(join(root, "public/icons/icon-512.png"), 512);
writeIcon(join(root, "public/icons/icon-512-maskable.png"), 512, { padding: 0.14 });
