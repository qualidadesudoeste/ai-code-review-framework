#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadConfig, applyCli } from "../src/config.mjs";
import { collectGitContext, filterGitContext, batchGitContext } from "../src/git.mjs";
import { selectModules } from "../src/router.mjs";
import { compilePrompt } from "../src/compiler.mjs";
import { validateReview } from "../src/validator.mjs";
import { renderReport } from "../src/report.mjs";
import { selectFindings, compileRemediation } from "../src/remediation.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packageData = JSON.parse(await fs.readFile(path.join(root, "package.json"), "utf8"));

function argsOf(items) {
  const output = {};
  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    if (!item.startsWith("--")) throw new Error(`Argumento inesperado: ${item}`);
    const key = item.slice(2);
    const next = items[index + 1];
    output[key] = !next || next.startsWith("--") ? true : (index += 1, next);
  }
  return output;
}

function requireFile(args) {
  if (!args.file || args.file === true) throw new Error("Use --file <arquivo.json>");
  return path.resolve(args.file);
}

function assertAllowed(args, allowed) {
  const unknown = Object.keys(args).filter(key => !allowed.includes(key));
  if (unknown.length) throw new Error(`Opção desconhecida: ${unknown.map(key => `--${key}`).join(", ")}`);
}

function assertFlag(args, key) {
  if (args[key] !== undefined && args[key] !== true) throw new Error(`--${key} não recebe valor`);
}

function partPath(output, index, total) {
  if (total === 1) return output;
  const extension = path.extname(output) || ".md";
  return `${output.slice(0, output.length - extension.length)}.part-${String(index).padStart(3, "0")}${extension}`;
}

async function readReview(args) {
  const file = requireFile(args);
  let data;
  try { data = JSON.parse(await fs.readFile(file, "utf8")); }
  catch (error) { throw new Error(`JSON inválido em ${file}: ${error.message}`); }
  const result = validateReview(data);
  if (!result.valid) throw new Error(`Relatório inválido:\n${result.errors.join("\n")}`);
  return data;
}

async function compose(args, manifest) {
  assertAllowed(args, ["repo", "config", "base", "head", "working-tree", "mode", "origin", "focus", "include-diff", "max-diff-bytes", "output", "capability"]);
  assertFlag(args, "working-tree");
  assertFlag(args, "include-diff");
  const repo = path.resolve(args.repo || ".");
  const config = applyCli(await loadConfig(repo, args.config), args);
  config.capability = args.capability || "READ-ONLY";
  if (!["READ-ONLY", "READ-EXECUTE"].includes(config.capability)) throw new Error("--capability deve ser READ-ONLY ou READ-EXECUTE");
  const collected = collectGitContext(repo, { base: args.base, head: args.head || "HEAD", workingTree: Boolean(args["working-tree"]), initial: config.mode === "initial" });
  const gitContext = filterGitContext(collected, config.exclude);
  if (!gitContext.changes.length) throw new Error("Nenhum arquivo permaneceu no escopo após aplicar as exclusões.");
  const modules = selectModules({ manifest, files: gitContext.changes.map(change => change.file), diffText: gitContext.diff, config });
  const batches = config.includeDiff ? batchGitContext(gitContext, config.maxDiffBytes) : [gitContext];
  const requestedOutput = path.resolve(typeof args.output === "string" ? args.output : "aicr-prompt.md");
  const prompts = [];
  for (let index = 0; index < batches.length; index += 1) {
    const output = partPath(requestedOutput, index + 1, batches.length);
    const prompt = await compilePrompt({ root, config, gitContext: batches[index], modules, batch: batches.length > 1 ? { index: index + 1, total: batches.length } : undefined });
    await fs.writeFile(output, prompt, "utf8");
    const diffBytes = Buffer.byteLength(batches[index].diff, "utf8");
    prompts.push({ file: output, files: batches[index].changes.map(change => change.file), diffBytes, exceedsConfiguredLimit: config.includeDiff && diffBytes > config.maxDiffBytes });
  }
  const metadata = {
    frameworkVersion: packageData.version,
    generatedAt: new Date().toISOString(),
    range: gitContext.range,
    modules: modules.map(module => module.id),
    excludedPatterns: config.exclude,
    includeDiff: config.includeDiff,
    sensitiveDataWarning: config.includeDiff ? "O diff pode conter dados sensíveis. Revise antes de enviá-lo a serviços externos." : null,
    batches: prompts
  };
  const metadataFile = `${requestedOutput}.json`;
  await fs.writeFile(metadataFile, JSON.stringify(metadata, null, 2), "utf8");
  console.log(JSON.stringify({ ...metadata, metadata: metadataFile }, null, 2));
}

async function main() {
  const argv = process.argv.slice(2);
  const command = argv.shift() ?? "help";
  const args = argsOf(argv);
  const manifest = JSON.parse(await fs.readFile(path.join(root, "policies", "manifest.json"), "utf8"));

  if (command === "help" || args.help) {
    console.log(`aicr ${packageData.version}\n\nUso:\n  aicr init --repo .\n  aicr modules\n  aicr compose --repo . [--base main] [--working-tree] [--mode change|initial] [--origin ai|human|mixed|unknown] [--focus general|security|data|architecture|functional|all] [--capability READ-ONLY|READ-EXECUTE] [--include-diff] [--max-diff-bytes 120000] [--output prompt.md]\n  aicr validate --file review.json\n  aicr report --file review.json [--output review-report.md]\n  aicr remediate --file review.json [--findings F-001,F-003|--all] [--output fix-prompt.md]`);
    return;
  }
  if (command === "version") { console.log(packageData.version); return; }
  if (command === "modules") { assertAllowed(args, []); manifest.modules.forEach(module => console.log(`${module.id}\t${module.name}\t${module.file}`)); return; }
  if (command === "init") {
    assertAllowed(args, ["repo"]);
    const repo = path.resolve(args.repo || ".");
    const target = path.join(repo, ".aicr.json");
    try { await fs.access(target); throw new Error(`${target} já existe`); }
    catch (error) { if (error.code !== "ENOENT") throw error; }
    const schemaDirectory = path.join(repo, ".aicr");
    const schemaTarget = path.join(schemaDirectory, "config.schema.json");
    await fs.mkdir(schemaDirectory, { recursive: true });
    await fs.copyFile(path.join(root, ".aicr.example.json"), target);
    await fs.copyFile(path.join(root, "schemas", "config.schema.json"), schemaTarget);
    console.log(`Criados: ${target} e ${schemaTarget}`);
    return;
  }
  if (command === "compose") { await compose(args, manifest); return; }
  if (command === "validate") {
    assertAllowed(args, ["file"]);
    const file = requireFile(args);
    let data;
    try { data = JSON.parse(await fs.readFile(file, "utf8")); }
    catch (error) { throw new Error(`JSON inválido em ${file}: ${error.message}`); }
    const result = validateReview(data);
    console.log(JSON.stringify(result, null, 2));
    if (!result.valid) process.exitCode = 1;
    return;
  }
  if (command === "report") {
    assertAllowed(args, ["file", "output"]);
    const data = await readReview(args);
    const output = path.resolve(typeof args.output === "string" ? args.output : "review-report.md");
    await fs.writeFile(output, renderReport(data), "utf8");
    console.log(`Criado: ${output}`);
    return;
  }
  if (command === "remediate") {
    assertAllowed(args, ["file", "findings", "all", "output"]);
    assertFlag(args, "all");
    const data = await readReview(args);
    const ids = typeof args.findings === "string" ? args.findings.split(",").map(value => value.trim()).filter(Boolean) : [];
    const findings = selectFindings(data, { ids, all: Boolean(args.all) });
    if (!findings.length) throw new Error("Nenhum achado selecionado para correção");
    const output = path.resolve(typeof args.output === "string" ? args.output : "fix-prompt.md");
    await fs.writeFile(output, compileRemediation(data, findings), "utf8");
    console.log(`Criado: ${output} (${findings.map(finding => finding.id).join(", ")})`);
    return;
  }
  throw new Error(`Comando desconhecido: ${command}. Use 'aicr help'.`);
}

main().catch(error => {
  console.error(`aicr: ${error.message}`);
  if (process.env.AICR_DEBUG === "1") console.error(error.stack);
  process.exitCode = 1;
});
