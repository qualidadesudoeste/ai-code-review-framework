# Contrato de saída

Retorne somente JSON válido, sem Markdown, compatível com `schemas/review-result.schema.json`. Não omita campos obrigatórios. Use arrays vazios quando não houver itens. Cada achado deve representar uma causa raiz e agrupar suas ocorrências.

```json
{
  "schemaVersion": "1.0",
  "verdict": "APPROVED|APPROVED_WITH_NOTES|CHANGES_REQUESTED|INCONCLUSIVE",
  "productionRisk": { "canDeploy": "YES|NO|DEPENDS", "justification": "", "conditions": [] },
  "mentalModel": { "purpose": "", "businessRule": "", "affectedComponents": [], "mainRisks": [] },
  "scope": { "reviewed": [], "partial": [], "pending": [], "inaccessible": [] },
  "findings": [{
    "id": "F-001", "severity": "P0|P1|P2|P3|SUGGESTION", "title": "", "category": "", "blocking": true,
    "confidence": "HIGH|MEDIUM|LOW", "evidenceTypes": ["STATIC"], "rootCause": "",
    "occurrences": [{ "file": "", "line": 1, "description": "" }],
    "scenarioImpact": "", "evidence": "", "recommendation": "", "validation": ""
  }],
  "checks": [{ "command": "", "evidenceType": "STATIC|LOCAL_EXECUTION|CI|LOGS|MANUAL_TEST|AUTOMATED_TEST", "status": "PASSED|FAILED|NOT_RUN|BLOCKED", "result": "" }],
  "coverage": [{ "module": "01", "status": "OK|FAIL|NA|NOT_VERIFIED", "evidence": "" }],
  "knownFalsePositives": [{ "candidate": "", "file": "", "line": 1, "reason": "", "evidenceType": "STATIC" }],
  "limitations": [],
  "actions": { "blocking": [], "validation": [], "optional": [] }
}
```
