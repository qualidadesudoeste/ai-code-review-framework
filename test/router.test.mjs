import test from "node:test"; import assert from "node:assert/strict";
import { selectModules } from "../src/router.mjs";
const manifest={modules:["01","02","03","04","05","06"].map(id=>({id,autoPatterns:id==="03"?["migration"]:[]}))};
const base={focus:"general",mode:"change",origin:"human",securityAlways:true,modules:{enable:[],disable:[]}};
test("seleciona base e dados por sinal",()=>assert.deepEqual(selectModules({manifest,files:["db/migration.sql"],config:base}).map(x=>x.id),["01","02","03","04"]));
test("adiciona criação e IA",()=>assert.deepEqual(selectModules({manifest,files:[],config:{...base,mode:"initial",origin:"ai"}}).map(x=>x.id),["01","02","04","05","06"]));
