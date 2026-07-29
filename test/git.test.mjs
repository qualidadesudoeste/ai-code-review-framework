import test from "node:test";
import assert from "node:assert/strict";
import { splitDiffBlocks, filterGitContext, batchGitContext } from "../src/git.mjs";

const block = (file, content = "+value\n") => `diff --git a/${file} b/${file}\n--- a/${file}\n+++ b/${file}\n@@ -0,0 +1 @@\n${content}`;

test("separa, filtra e preserva os blocos de diff", () => {
  const context = { range: "a...b", changes: [{ status: "M", file: "src/a.js", previousFile: null }, { status: "M", file: "dist/a.js", previousFile: null }], diff: block("src/a.js") + block("dist/a.js") };
  assert.equal(splitDiffBlocks(context.diff).length, 2);
  const filtered = filterGitContext(context, ["dist/**"]);
  assert.deepEqual(filtered.changes.map(change => change.file), ["src/a.js"]);
  assert.equal(filtered.diff.includes("dist/a.js"), false);
});

test("divide diff grande sem perder arquivos", () => {
  const context = { range: "a...b", changes: ["a.js", "b.js", "c.js"].map(file => ({ status: "M", file, previousFile: null })), diff: block("a.js", `+${"a".repeat(100)}\n`) + block("b.js", `+${"b".repeat(100)}\n`) + block("c.js", `+${"c".repeat(100)}\n`) };
  const batches = batchGitContext(context, 180);
  assert.ok(batches.length > 1);
  assert.deepEqual(batches.flatMap(batch => batch.changes.map(change => change.file)), ["a.js", "b.js", "c.js"]);
});
