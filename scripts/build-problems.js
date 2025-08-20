import { execSync } from "child_process";
import { config } from "dotenv";

config({ path: ".env.local" })

const dir = process.env.REACT_APP_PROBLEM_SET || "public-problems";

if (!dir) {
  console.error("REACT_APP_PROBLEM_SET not defined in environment.");
  process.exit(1);
}

try {
  execSync(`cd src/${dir} && bash build-all && bash build-problem-list`, { stdio: "inherit", shell: true })
} catch(e) {
  console.error("❌ Script failed:", e.message);
  process.exit(1);
}
