const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

const envFile = process.argv[2] || ".env.local";

if (!fs.existsSync(envFile)) {
  throw new Error(`Missing env file: ${envFile}`);
}

dotenv.config({ path: path.resolve(process.cwd(), envFile) });

const projectId = process.env.SUPABASE_PROJECT_ID;

if (!projectId) {
  throw new Error("SUPABASE_PROJECT_ID is missing in .env.local");
}

if (!/^[a-z0-9]{20}$/.test(projectId)) {
  throw new Error(
    `SUPABASE_PROJECT_ID has invalid format: "${projectId}". It must look like abcdefghijklmnopqrst`
  );
}

execSync(
  `supabase gen types typescript --project-id ${projectId} > src/lib/db/database.ts`,
  { stdio: "inherit", shell: true }
);