// Runs automatically after `npm run build` (the "postbuild" script).
//
// Next 16.3's static export writes per-segment prefetch files as nested folders, e.g.
//   out/about/__next.about/__PAGE__.txt
// while the client router requests the dot-joined name
//   out/about/__next.about.__PAGE__.txt
// On plain static hosting every link prefetch would 404 (console errors, wasted requests).
// This copies each nested file to the name the router asks for. Navigation works either way.
import { copyFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const out = join(dirname(fileURLToPath(import.meta.url)), "..", "out");
let copied = 0;

function filesIn(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? filesIn(full) : [full];
  });
}

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (!statSync(full).isDirectory()) continue;
    if (name.startsWith("__next.")) {
      for (const file of filesIn(full)) {
        const flat = join(dir, `${name}.${relative(full, file).split(sep).join(".")}`);
        if (!existsSync(flat)) {
          copyFileSync(file, flat);
          copied++;
        }
      }
    } else {
      walk(full);
    }
  }
}

if (existsSync(out)) {
  walk(out);
  console.log(`fix-segment-prefetch: ${copied} prefetch file(s) flattened`);
}
