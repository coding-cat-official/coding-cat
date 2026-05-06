import { execSync } from "child_process";

try {
  execSync(`cd src/blogs && bash build-all && bash build-blogs-list`, { stdio: "inherit", shell: true })
} catch(e) {
  console.error("❌ Script failed:", e.message);
  process.exit(1);
}
