import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readSchema = name => JSON.parse(fs.readFileSync(path.join(root, "schemas", name), "utf8"));
const ajv = new Ajv2020({ allErrors: true, strict: true });
const reviewValidator = ajv.compile(readSchema("review-result.schema.json"));
const configValidator = ajv.compile(readSchema("config.schema.json"));

function result(validate, data) {
  const valid = validate(data);
  const errors = valid ? [] : (validate.errors ?? []).map(e => `${e.instancePath || "$"} ${e.message}`.trim());
  return { valid: Boolean(valid), errors };
}

export function validateReview(data) { return result(reviewValidator, data); }
export function validateConfig(data) { return result(configValidator, data); }
