import test from "node:test"; import assert from "node:assert/strict";
import { selectFindings, compileRemediation } from "../src/remediation.mjs";
const review={verdict:"CHANGES_REQUESTED",findings:[{id:"F-001",blocking:true},{id:"F-002",blocking:false}]};
test("seleciona bloqueantes por padrão",()=>assert.deepEqual(selectFindings(review).map(x=>x.id),["F-001"]));
test("seleciona IDs aceitos",()=>assert.deepEqual(selectFindings(review,{ids:["F-002"]}).map(x=>x.id),["F-002"]));
test("prompt preserva IDs",()=>assert.match(compileRemediation(review,review.findings),/F-001/));
