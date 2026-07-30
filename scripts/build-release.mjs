import fs from "node:fs";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";

const packageData = JSON.parse(fs.readFileSync("package.json", "utf8"));
const version = packageData.version;
const npmCli = process.env.npm_execpath;
if (!npmCli) throw new Error("Execute este script por meio de 'npm run release:artifacts'.");

function run(command, args) {
  const result = spawnSync(command, args, { encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} ${args.join(" ")} falhou com código ${result.status}`);
  return result.stdout.trim();
}

const packageFile = run(process.execPath, [npmCli, "pack", "--silent"]).split(/\r?\n/).at(-1);
const archiveFile = `AI_CODE_REVIEW_FRAMEWORK_${version}.zip`;
const checksumsFile = `RELEASE_CHECKSUMS_${version}.txt`;

run("git", ["archive", "--format=zip", `--prefix=aicr-framework-${version}/`, `--output=${archiveFile}`, "HEAD"]);

const checksum = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex").toUpperCase();
fs.writeFileSync(checksumsFile, `${checksum(archiveFile)}  ${archiveFile}\n${checksum(packageFile)}  ${packageFile}\n`, "utf8");

if (process.env.GITHUB_OUTPUT) {
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `package=${packageFile}\narchive=${archiveFile}\nchecksums=${checksumsFile}\n`, "utf8");
}

console.log(JSON.stringify({ version, package: packageFile, archive: archiveFile, checksums: checksumsFile }, null, 2));
