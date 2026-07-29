import test from "node:test";
import assert from "node:assert/strict";
import { matchesAny } from "../src/glob.mjs";

test("glob recursivo encontra diretórios na raiz e aninhados", () => {
  assert.equal(matchesAny("dist/app.js", ["dist/**"]), true);
  assert.equal(matchesAny("packages/ui/dist/app.js", ["**/dist/**"]), true);
});

test("glob de extensão não ignora arquivos diferentes", () => {
  assert.equal(matchesAny("src/app.min.js", ["**/*.min.js"]), true);
  assert.equal(matchesAny("src/app.js", ["**/*.min.js"]), false);
});
