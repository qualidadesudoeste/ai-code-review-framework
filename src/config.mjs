import fs from "node:fs/promises";
import path from "node:path";
import { validateConfig } from "./validator.mjs";

export const defaults = {
  mode: "change",
  origin: "unknown",
  focus: "general",
  securityAlways: true,
  includeDiff: false,
  maxDiffBytes: 120000,
  exclude: [".aicr/**", "**/dist/**", "**/build/**", "**/vendor/**", "**/*.min.js"],
  modules: { enable: [], disable: [] }
};

export async function loadConfig(repo, explicitPath) {
  const file = explicitPath ? path.resolve(explicitPath) : path.join(repo, ".aicr.json");
  let user = {};
  try {
    user = JSON.parse(await fs.readFile(file, "utf8"));
  } catch (error) {
    if (error.code !== "ENOENT") throw new Error(`Configuração inválida em ${file}: ${error.message}`);
  }
  const validation = validateConfig(user);
  if (!validation.valid) throw new Error(`Configuração inválida em ${file}:\n${validation.errors.join("\n")}`);
  return { ...defaults, ...user, modules: { ...defaults.modules, ...(user.modules ?? {}) }, configPath: file };
}

export function applyCli(config, args) {
  const value = key => args[key] === undefined ? undefined : args[key];
  const result = {
    ...config,
    mode: value("mode") ?? config.mode,
    origin: value("origin") ?? config.origin,
    focus: value("focus") ?? config.focus,
    includeDiff: args["include-diff"] ?? config.includeDiff,
    maxDiffBytes: Number(value("max-diff-bytes") ?? config.maxDiffBytes)
  };
  const publicConfig = Object.fromEntries(Object.entries(result).filter(([key]) => key !== "configPath"));
  const validation = validateConfig(publicConfig);
  if (!validation.valid) throw new Error(`Parâmetros de configuração inválidos:\n${validation.errors.join("\n")}`);
  return result;
}
