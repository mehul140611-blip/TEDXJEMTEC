// Packs the contents of out/ (not the folder itself) into tedxjemtec-site.zip for uploading to
// Hostinger's public_html. Uses the system tar (bsdtar: Windows 10+ and macOS), which writes zip
// entries with forward slashes so Hostinger's "Extract" recreates the folders correctly.
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, rmSync, statSync } from "node:fs";
import { join } from "node:path";

const out = "out";
const zip = "tedxjemtec-site.zip";
const required = ["index.html", "404.html", ".htaccess", "_next"];

const missing = required.filter((f) => !existsSync(join(out, f)));
if (missing.length) {
  console.error(`zip-out: out/ is missing ${missing.join(", ")}. Run "npm run build" first.`);
  process.exit(1);
}

rmSync(zip, { force: true });
const tar = process.platform === "win32" ? join(process.env.SystemRoot || "C:\\Windows", "System32", "tar.exe") : "tar";
const entries = readdirSync(out); // includes .htaccess
const result = spawnSync(tar, ["-a", "-c", "-f", join("..", zip), ...entries], { cwd: out, stdio: "inherit" });
if (result.status !== 0) {
  console.error("zip-out: tar failed", result.error ?? "");
  process.exit(1);
}
console.log(`zip-out: ${zip} (${(statSync(zip).size / 1024 / 1024).toFixed(1)} MB), ${entries.length} top-level entries`);
