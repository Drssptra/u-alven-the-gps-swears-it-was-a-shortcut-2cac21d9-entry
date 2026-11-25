// The GPS Swears It Was a Shortcut — make.fun bounty entry.
//
// One job: print the GPS's excuse for a terrible shortcut, and write the
// exact same line to $MAKEFUN_OUTPUT_DIR/entry.txt (default /output)
// with no trailing newline, so the sealed scorer reads it byte for byte.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const MAX_CHARS = 200;

const ENTRY =
  "I routed you through that wedding because the bouquet toss beats the highway, and honestly, it did.";

// Gate: the sealed scorer accepts 1 to 200 characters, one line, not
// only whitespace. Fail loudly here instead of shipping a bad entry.
if (ENTRY.length < 1 || ENTRY.length > MAX_CHARS) {
  throw new Error(`entry must be 1 to ${MAX_CHARS} characters, got ${ENTRY.length}`);
}
if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
  throw new Error("entry must be a single line");
}
if (ENTRY.trim().length === 0) {
  throw new Error("entry must not be only whitespace");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), ENTRY, "utf8");

console.log(ENTRY);
