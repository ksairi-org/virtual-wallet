import fs from "fs";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { specsFolder } from "../constants.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(dirname(__filename));

const dbOpenApiSpecFileName = "./db-open-api-spec.json";
const dbOpenApiSpecPath = path.join(
  __dirname,
  specsFolder,
  dbOpenApiSpecFileName,
);

const openApiSpecFileName = "./open-api-spec.json";
const openApiSpecPath = path.join(__dirname, specsFolder, openApiSpecFileName);

fs.unlinkSync(dbOpenApiSpecPath);
fs.unlinkSync(openApiSpecPath);
