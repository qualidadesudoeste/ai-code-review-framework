const focusMap = { functional: ["01"], security: ["02"], data: ["03"], architecture: ["04"], initial: ["05"], ai: ["06"] };

function matches(text, expressions) { return expressions.some(exp => new RegExp(exp, "i").test(text)); }

export function selectModules({ manifest, files, diffText = "", config }) {
  const selected = new Set();
  if (config.focus === "all") manifest.modules.forEach(m => selected.add(m.id));
  else if (focusMap[config.focus]) focusMap[config.focus].forEach(id => selected.add(id));
  else {
    selected.add("01"); selected.add("04");
    if (config.securityAlways) selected.add("02");
    const corpus = `${files.join("\n")}\n${diffText.slice(0, 80000)}`;
    for (const module of manifest.modules) {
      if (module.autoPatterns?.length && matches(corpus, module.autoPatterns)) selected.add(module.id);
    }
  }
  if (config.mode === "initial") selected.add("05");
  if (["ai", "mixed"].includes(config.origin)) selected.add("06");
  for (const id of config.modules?.enable ?? []) selected.add(String(id).padStart(2, "0"));
  for (const id of config.modules?.disable ?? []) selected.delete(String(id).padStart(2, "0"));
  return manifest.modules.filter(m => selected.has(m.id));
}
