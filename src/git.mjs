import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { matchesAny, normalizePath } from "./glob.mjs";

const MAX_UNTRACKED_FILE_BYTES = 10 * 1024 * 1024;

export function runGit(repo, args) {
  const result = spawnSync("git", ["-C", repo, ...args], { encoding: "utf8", maxBuffer: 50 * 1024 * 1024 });
  if (result.error) throw new Error(`Não foi possível executar Git: ${result.error.message}`);
  if (result.status !== 0) throw new Error(`git ${args.join(" ")} falhou: ${(result.stderr || result.stdout).trim()}`);
  return result.stdout;
}

export function collectGitContext(repo, { base, head = "HEAD", workingTree = false, initial = false } = {}) {
  runGit(repo, ["rev-parse", "--is-inside-work-tree"]);
  let range = workingTree ? null : `${base ?? `${head}~1`}...${head}`;
  let diffArgs;
  let nameArgs;
  if (initial) {
    const emptyTree = emptyTreeId(repo);
    const target = workingTree ? null : head;
    range = workingTree ? `EMPTY_TREE..WORKTREE` : `EMPTY_TREE..${head}`;
    diffArgs = ["diff", "--find-renames", "--find-copies", emptyTree, ...(target ? [target] : [])];
    nameArgs = ["diff", "--name-status", "--find-renames", emptyTree, ...(target ? [target] : [])];
  } else if (workingTree) {
    const hasHead = spawnSync("git", ["-C", repo, "rev-parse", "--verify", head], { encoding: "utf8" }).status === 0;
    diffArgs = hasHead ? ["diff", "--find-renames", "--find-copies", head] : ["diff", "--find-renames", "--find-copies", "--cached"];
    nameArgs = hasHead ? ["diff", "--name-status", "--find-renames", head] : ["diff", "--name-status", "--find-renames", "--cached"];
    if (!hasHead) range = "ROOT..WORKTREE";
  } else if (!base && spawnSync("git", ["-C", repo, "rev-parse", "--verify", `${head}^`], { encoding: "utf8" }).status !== 0) {
    range = `ROOT...${head}`;
    diffArgs = ["diff-tree", "--root", "--no-commit-id", "-p", "--find-renames", "--find-copies", head];
    nameArgs = ["diff-tree", "--root", "--no-commit-id", "--name-status", "-r", "--find-renames", head];
  } else {
    diffArgs = ["diff", "--find-renames", "--find-copies", range];
    nameArgs = ["diff", "--name-status", "--find-renames", range];
  }
  let diff = runGit(repo, diffArgs);
  const changes = runGit(repo, nameArgs).trim().split(/\r?\n/).filter(Boolean).map(line => {
    const parts = line.split("\t");
    return { status: parts[0], file: normalizePath(parts.at(-1)), previousFile: parts.length > 2 ? normalizePath(parts[1]) : null };
  });
  if (workingTree) {
    const known = new Set(changes.map(change => change.file));
    const untracked = runGit(repo, ["ls-files", "--others", "--exclude-standard", "-z"]).split("\0").filter(Boolean).map(normalizePath);
    for (const file of untracked) {
      if (known.has(file)) continue;
      changes.push({ status: "??", file, previousFile: null });
      diff += untrackedDiff(repo, file);
    }
  }
  return { range: range ?? `${head}..WORKTREE`, diff, changes };
}

function emptyTreeId(repo) {
  const result = spawnSync("git", ["-C", repo, "hash-object", "-t", "tree", "-w", "--stdin"], { input: "", encoding: "utf8" });
  if (result.status !== 0) throw new Error(`Não foi possível criar a referência de árvore vazia: ${(result.stderr || result.stdout).trim()}`);
  return result.stdout.trim();
}

function untrackedDiff(repo, file) {
  const absolute = path.resolve(repo, file);
  const root = `${path.resolve(repo)}${path.sep}`;
  if (!absolute.startsWith(root)) return "";
  const stat = fs.lstatSync(absolute);
  const header = `diff --git a/${file} b/${file}\nnew file mode 100644\n`;
  if (!stat.isFile() || stat.isSymbolicLink() || stat.size > MAX_UNTRACKED_FILE_BYTES) return `${header}Binary files /dev/null and b/${file} differ\n`;
  const buffer = fs.readFileSync(absolute);
  if (buffer.includes(0)) return `${header}Binary files /dev/null and b/${file} differ\n`;
  const text = buffer.toString("utf8").replaceAll("\r\n", "\n");
  const lines = text.length ? text.replace(/\n$/, "").split("\n") : [];
  const body = lines.map(line => `+${line}`).join("\n");
  return `${header}--- /dev/null\n+++ b/${file}\n@@ -0,0 +1,${lines.length} @@\n${body}${body ? "\n" : ""}`;
}

export function splitDiffBlocks(diff) {
  if (!diff.trim()) return [];
  return diff.split(/(?=^diff --git )/m).filter(Boolean).map(text => {
    const header = text.match(/^diff --git a\/(.*?) b\/(.*?)$/m);
    return { file: normalizePath(header?.[2] ?? header?.[1] ?? "unknown"), text };
  });
}

export function filterGitContext(context, exclude = []) {
  const changes = context.changes.filter(change => !matchesAny(change.file, exclude));
  const allowed = new Set(changes.map(change => change.file));
  const diff = splitDiffBlocks(context.diff).filter(block => allowed.has(block.file)).map(block => block.text).join("");
  return { ...context, changes, diff };
}

export function batchGitContext(context, maxBytes) {
  const blocks = splitDiffBlocks(context.diff);
  if (!blocks.length || Buffer.byteLength(context.diff, "utf8") <= maxBytes) return [context];
  const batches = [];
  let current = [];
  let size = 0;
  for (const block of blocks) {
    const blockSize = Buffer.byteLength(block.text, "utf8");
    if (current.length && size + blockSize > maxBytes) {
      batches.push(current);
      current = [];
      size = 0;
    }
    current.push(block);
    size += blockSize;
  }
  if (current.length) batches.push(current);
  return batches.map(group => {
    const files = new Set(group.map(block => block.file));
    return { ...context, diff: group.map(block => block.text).join(""), changes: context.changes.filter(change => files.has(change.file)) };
  });
}
