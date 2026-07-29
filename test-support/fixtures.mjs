export function validReview(overrides = {}) {
  return {
    schemaVersion: "1.0",
    verdict: "APPROVED",
    productionRisk: { canDeploy: "YES", justification: "Nenhum bloqueante identificado.", conditions: [] },
    mentalModel: { purpose: "Validar o framework.", businessRule: "Produzir uma revisão estruturada.", affectedComponents: ["CLI"], mainRisks: ["Cobertura incompleta"] },
    scope: { reviewed: ["src"], partial: [], pending: [], inaccessible: [] },
    findings: [], checks: [], coverage: [], knownFalsePositives: [], limitations: [],
    actions: { blocking: [], validation: [], optional: [] },
    ...overrides
  };
}
