// Removes stale Next.js cache. Run before switching between `dev` and `build`
// to avoid `Cannot find module './XXX.js'` errors caused by mixing prod chunks
// into dev runtime (or vice versa).
import { rmSync, existsSync } from 'node:fs';

for (const dir of ['.next', 'out', 'tsconfig.tsbuildinfo']) {
  if (existsSync(dir)) {
    rmSync(dir, { recursive: true, force: true });
    console.log('removed', dir);
  }
}
console.log('clean done');
