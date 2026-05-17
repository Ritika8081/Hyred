// Removes stale Next.js cache. Runs automatically before `dev` and `build`
// to avoid mixing prod chunks into dev runtime (or vice versa) — a common
// source of `Cannot find module './XXX.js'` and `routes-manifest.json`
// missing errors when `next.config.ts` uses `output: 'export'`.
//
// Resilient on Windows: if a running dev server is holding file locks, we
// retry with exponential backoff. Never throws — better to start dev with a
// partly-cleaned cache than to block the whole script.
import { rmSync, existsSync } from 'node:fs';

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function removeWithRetry(target, maxAttempts = 4) {
  if (!existsSync(target)) return true;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      rmSync(target, { recursive: true, force: true, maxRetries: 3, retryDelay: 150 });
      if (!existsSync(target)) {
        console.log('removed', target);
        return true;
      }
    } catch (err) {
      if (attempt === maxAttempts) {
        console.warn(`could not fully remove ${target} (locked?) — ${err.code || err.message}`);
        return false;
      }
      await sleep(200 * attempt);
    }
  }
  return false;
}

const targets = ['.next', 'out', 'tsconfig.tsbuildinfo'];
for (const t of targets) {
  await removeWithRetry(t);
}
console.log('clean done');
