import test from "node:test";
import assert from "node:assert/strict";
import { validateReview, validateConfig } from "../src/validator.mjs";
import { validReview } from "../test-support/fixtures.mjs";

test("aceita um relatório completo válido", () => assert.equal(validateReview(validReview()).valid, true));
test("rejeita parecer fora do contrato", () => assert.equal(validateReview(validReview({ verdict: "MAYBE" })).valid, false));
test("rejeita objetos extras no relatório", () => assert.equal(validateReview(validReview({ hidden: true })).valid, false));
test("aceita configuração parcial", () => assert.equal(validateConfig({ focus: "security" }).valid, true));
test("rejeita configuração desconhecida", () => assert.equal(validateConfig({ magic: true }).valid, false));
test("rejeita relatório com achado bloqueante e parecer aprovado", () => {
  const finding = { id: "F-001", severity: "P1", title: "Falha", category: "Segurança", blocking: true, confidence: "HIGH", evidenceTypes: ["STATIC"], rootCause: "Validação ausente", occurrences: [{ file: "app.js", line: 1, description: "Entrada direta" }], scenarioImpact: "Acesso indevido", evidence: "Fluxo sem guarda", recommendation: "Adicionar autorização", validation: "Testar usuário sem acesso" };
  assert.equal(validateReview(validReview({ findings: [finding] })).valid, false);
});
