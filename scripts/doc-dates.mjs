// When each docs page last changed, from git: src/generated/doc-dates.json,
// { "<slug>": "<ISO date>" }. The docs pages show it as "Last updated", and
// it goes into the sitemap, the structured data and the markdown copies.
//
// Runs before dev and build (package.json). A shallow clone only knows the
// newest commit, which would give every page the same date, so the file is
// left empty then and the pages show no date. The deploy workflows check out
// the full history for this.

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const out = path.join(root, "src", "generated", "doc-dates.json");

function git(...args) {
  return execFileSync("git", args, { cwd: root, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
}

const dates = {};
let note = "";
try {
  if (git("rev-parse", "--is-shallow-repository").trim() === "true") {
    note = "shallow clone, no dates";
  } else {
    // Newest commit first; the first date seen for a file is its last change.
    // %x00 marks the start of a commit, followed by its committer date.
    let date = null;
    for (const line of git("log", "--format=%x00%cI", "--name-only", "--", "docs").split("\n")) {
      if (line.startsWith("\0")) {
        date = line.slice(1).trim();
        continue;
      }
      const file = line.trim();
      if (!date || !file.startsWith("docs/") || !file.endsWith(".md")) continue;
      const slug = file.slice("docs/".length, -".md".length);
      if (!(slug in dates)) dates[slug] = date;
    }
  }
} catch (err) {
  note = `git failed: ${err.message.split("\n")[0]}`;
}

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(dates, null, 2) + "\n");
console.log(`doc-dates: ${Object.keys(dates).length} pages${note ? ` (${note})` : ""}`);
