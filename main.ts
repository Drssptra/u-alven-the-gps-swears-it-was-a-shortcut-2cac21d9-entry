// The GPS Swears It Was a Shortcut — make.fun bounty entry (v2 resubmit).
//
// The GPS defends its lake-crossing shortcut. The sealed scorer reads
// $MAKEFUN_OUTPUT_DIR/entry.txt (default /output) byte for byte, so the
// program below assembles the line from fragments, proves it fits the
// 1–200 character gate, and only then writes it with no trailing newline.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The excuse, split into clauses. Joining with single spaces must
// reproduce the sealed entry character for character.
const CLAUSES: readonly string[] = [
  "I routed you across that lake",
  "because the map drew a bridge there,",
  "and if anyone is lying here,",
  "it is the lake for moving without telling anyone.",
];

const GATE_MIN = 1;
const GATE_MAX = 200;

function buildEntry(clauses: readonly string[]): string {
  return clauses.join(" ");
}

function findProblems(text: string): string[] {
  const problems: string[] = [];
  if (text.length < GATE_MIN || text.length > GATE_MAX) {
    problems.push(
      `length ${text.length} outside gate ${GATE_MIN}–${GATE_MAX}`,
    );
  }
  if (/[\r\n]/.test(text)) {
    problems.push("must be a single line");
  }
  if (text.trim().length === 0) {
    problems.push("must not be only whitespace");
  }
  if (text.includes("  ")) {
    problems.push("must not contain double spaces");
  }
  if (!text.endsWith(".")) {
    problems.push("must end with a period");
  }
  return problems;
}

function publish(text: string, outDir: string): string {
  mkdirSync(outDir, { recursive: true });
  const target = join(outDir, "entry.txt");
  writeFileSync(target, text, "utf8");
  // Read back and refuse to continue if the disk copy drifted by even
  // one byte from what the gate just approved.
  const onDisk = readFileSync(target, "utf8");
  if (onDisk !== text) {
    throw new Error("entry.txt on disk does not match the approved entry");
  }
  return target;
}

function main(): void {
  const entry = buildEntry(CLAUSES);
  const problems = findProblems(entry);
  if (problems.length > 0) {
    throw new Error(`entry rejected: ${problems.join("; ")}`);
  }
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  const target = publish(entry, outDir);
  console.log(entry);
  console.error(`wrote ${entry.length} chars to ${target}`);
}

main();
