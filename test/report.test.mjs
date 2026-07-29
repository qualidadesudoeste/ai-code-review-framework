import test from "node:test";
import assert from "node:assert/strict";
import { renderReport } from "../src/report.mjs";
import { validReview } from "../test-support/fixtures.mjs";

test("relatório humano preserva escopo e rastreabilidade", () => {
  const markdown = renderReport(validReview({ checks: [{ command: "npm test", evidenceType: "LOCAL_EXECUTION", status: "PASSED", result: "16 testes" }], coverage: [{ module: "01", status: "OK", evidence: "Fluxo inspecionado" }] }));
  assert.match(markdown, /# Modelo mental/);
  assert.match(markdown, /npm test/);
  assert.match(markdown, /Fluxo inspecionado/);
});
