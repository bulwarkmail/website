// Pre-builds the screenshots in public/screenshots as AVIF and WebP at the
// widths the pages ask for, so no image is encoded while a visitor waits.
//
//   public/_img/<name>.<hash>.<width>.<avif|webp>   the files (not in git)
//   src/generated/screenshots.json                  name -> hash and size
//
// The hash comes from the source file and the encoder settings, so a changed
// screenshot gets new file names and the files can be cached forever (see headers() in next.config.ts).
// Files that already exist are kept, so only new or changed screenshots cost
// time; files no screenshot needs any more are removed.
import { createHash } from "node:crypto";
import { mkdir, readdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
// sharp comes with Next (an optional dependency it installs on every platform
// the site builds on), the same library its image optimizer uses.
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const srcDir = path.join(root, "public", "screenshots");
const outDir = path.join(root, "public", "_img");
const manifestPath = path.join(root, "src", "generated", "screenshots.json");

// The screenshots are 5120 px wide. 2560 covers a large screen at 2x for the
// widest place one is shown (60% of the page); the rest follow common screens.
const WIDTHS = [640, 960, 1280, 1920, 2560];
const SETTINGS = { avif: { quality: 60, effort: 4 }, webp: { quality: 75, effort: 6 } };
const FORMATS = {
  avif: (img) => img.avif(SETTINGS.avif),
  webp: (img) => img.webp(SETTINGS.webp),
};

async function exists(file) {
  try {
    await stat(file);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const started = Date.now();
  await mkdir(outDir, { recursive: true });
  await mkdir(path.dirname(manifestPath), { recursive: true });

  const sources = (await readdir(srcDir)).filter((f) => f.endsWith(".webp")).sort();
  const images = {};
  const wanted = new Set();
  const jobs = [];

  for (const file of sources) {
    const name = file.replace(/\.webp$/, "");
    const input = await readFile(path.join(srcDir, file));
    // New settings give new names too, so no cache hands out old encodes.
    const hash = createHash("sha256").update(JSON.stringify(SETTINGS)).update(input).digest("hex").slice(0, 10);
    const { width, height } = await sharp(input).metadata();
    const widths = WIDTHS.filter((w) => w <= width);
    images[name] = { hash, width, height, widths };
    for (const w of widths) {
      for (const ext of Object.keys(FORMATS)) {
        const out = `${name}.${hash}.${w}.${ext}`;
        wanted.add(out);
        jobs.push({ input, w, ext, out });
      }
    }
  }

  const todo = [];
  for (const job of jobs) {
    if (!(await exists(path.join(outDir, job.out)))) todo.push(job);
  }

  // A few encodes at a time: each one already uses several threads.
  const parallel = Math.max(2, Math.min(8, Math.floor(os.availableParallelism() / 2)));
  let next = 0;
  async function worker() {
    while (next < todo.length) {
      const job = todo[next++];
      const img = sharp(job.input).resize({ width: job.w });
      const buf = await FORMATS[job.ext](img).toBuffer();
      // Write under a temporary name first so a cancelled run leaves no
      // half-written file that a later run would take as done.
      const tmp = path.join(outDir, `${job.out}.tmp`);
      await writeFile(tmp, buf);
      await rename(tmp, path.join(outDir, job.out));
    }
  }
  await Promise.all(Array.from({ length: parallel }, worker));

  let removed = 0;
  for (const file of await readdir(outDir)) {
    if (!wanted.has(file)) {
      await rm(path.join(outDir, file), { force: true });
      removed++;
    }
  }

  const manifest = JSON.stringify({ images }, null, 2) + "\n";
  const old = (await exists(manifestPath)) ? await readFile(manifestPath, "utf8") : "";
  if (old !== manifest) await writeFile(manifestPath, manifest);

  const secs = ((Date.now() - started) / 1000).toFixed(1);
  console.log(
    `images: ${sources.length} screenshots, ${todo.length} files encoded, ${removed} removed, ${secs}s`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
