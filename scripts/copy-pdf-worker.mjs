// Copies the pdf.js worker from node_modules into /public so the PDF resume parser
// can load it same-origin. Runs automatically on `npm install`, `npm run dev`, and `npm run build`.

import { existsSync, copyFileSync, mkdirSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const src = resolve(root, "node_modules/pdfjs-dist/build/pdf.worker.min.mjs");
const destDir = resolve(root, "public");
const dest = resolve(destDir, "pdf.worker.min.mjs");

if (!existsSync(src)) {
  // pdfjs-dist not installed yet — skip silently. The next install will copy it.
  process.exit(0);
}

if (!existsSync(destDir)) {
  mkdirSync(destDir, { recursive: true });
}

// Skip if dest is already up-to-date
if (existsSync(dest)) {
  const sSrc = statSync(src);
  const sDest = statSync(dest);
  if (sSrc.size === sDest.size) {
    process.exit(0);
  }
}

copyFileSync(src, dest);
console.log(`[copy-pdf-worker] copied ${src} → ${dest}`);
