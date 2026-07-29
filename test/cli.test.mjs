import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cli = path.join(project, "bin", "aicr.mjs");

function command(executable, args, cwd) {
  const result = spawnSync(executable, args, { cwd, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return result.stdout;
}

test("fluxo compose funciona desde o primeiro commit", () => {
  const repo = fs.mkdtempSync(path.join(os.tmpdir(), "aicr-e2e-"));
  try {
    command("git", ["init", "--quiet"], repo);
    command("git", ["config", "user.name", "AICR Test"], repo);
    command("git", ["config", "user.email", "aicr@example.invalid"], repo);
    fs.writeFileSync(path.join(repo, "app.js"), "export const answer = 42;\n");
    command("git", ["add", "app.js"], repo);
    command("git", ["commit", "--quiet", "-m", "initial"], repo);
    command(process.execPath, [cli, "init", "--repo", repo], repo);
    assert.equal(fs.existsSync(path.join(repo, ".aicr", "config.schema.json")), true);
    const output = path.join(repo, "prompt.md");
    command(process.execPath, [cli, "compose", "--repo", repo, "--include-diff", "--output", output], repo);
    assert.equal(fs.existsSync(output), true);
    assert.match(fs.readFileSync(output, "utf8"), /<UNTRUSTED_DIFF>/);
    const metadata = JSON.parse(fs.readFileSync(`${output}.json`, "utf8"));
    assert.equal(metadata.batches.length, 1);
    assert.deepEqual(metadata.batches[0].files, ["app.js"]);
    fs.writeFileSync(path.join(repo, "new-file.js"), "export const created = true;\n");
    const workingOutput = path.join(repo, "working.md");
    command(process.execPath, [cli, "compose", "--repo", repo, "--working-tree", "--include-diff", "--output", workingOutput], repo);
    const workingMetadata = JSON.parse(fs.readFileSync(`${workingOutput}.json`, "utf8"));
    assert.equal(workingMetadata.batches.flatMap(batch => batch.files).includes("new-file.js"), true);
    command("git", ["add", "new-file.js"], repo);
    command("git", ["commit", "--quiet", "-m", "second"], repo);
    const initialOutput = path.join(repo, "initial.md");
    command(process.execPath, [cli, "compose", "--repo", repo, "--mode", "initial", "--output", initialOutput], repo);
    const initialMetadata = JSON.parse(fs.readFileSync(`${initialOutput}.json`, "utf8"));
    assert.deepEqual(initialMetadata.batches[0].files, ["app.js", "new-file.js"]);
  } finally {
    fs.rmSync(repo, { recursive: true, force: true });
  }
});
