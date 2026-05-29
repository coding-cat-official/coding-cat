import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { config } from "dotenv";import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, "../.env.local") });

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
// not a real domain, just to comply with Supabase email field
const EMAIL_DOMAIN = "coding-cat.internal"; 

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing REACT_APP_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const usernameParts = JSON.parse(readFileSync(join(__dirname, "./username-words.json"), "utf-8"));
const usedUsernames: string[] = [];

function generateAdjAnimalCombo() {
  const adjective = usernameParts.adjectives[
    Math.floor(Math.random() * usernameParts.adjectives.length)
  ];
  const animal = usernameParts.animals[
    Math.floor(Math.random() * usernameParts.animals.length)
  ];
  
  return `${adjective}${animal}`;
}

function generateUniqueUsername() {
  let username;

  do{
    username = generateAdjAnimalCombo() + Math.floor(Math.random() * 1000);
  }while(usedUsernames.includes(username));
  usedUsernames.push(username);

  return username;
}

async function createUser(username: string, password: string) {
  const email = `${username}@${EMAIL_DOMAIN}`;

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    console.error(`Auth error for "${username}": ${error.message}`);
    return false;
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .upsert({
      profile_id: data.user.id,
      username: username,
      created_at: data.user.created_at,
    }, { onConflict: "profile_id" });

  if (profileError) {
    console.error(`Profile error for "${username}": ${profileError.message}`);
    return false;
  }

  return true;
}

async function main() {
  const count = parseInt(process.argv[2]);
  if (!count || isNaN(count) || count < 1) {
    console.error("Usage: node create-users.mjs <number_of_users>");
    console.error("Example: node create-users.mjs 10");
    process.exit(1);
  }

  console.log(`\nCreating ${count} users...\n`);

  let successCount = 0;

  for (let i = 0; i < count; i++) {
    const username = generateUniqueUsername();
    const password = generateAdjAnimalCombo();
    const ok = await createUser(username, password);
    if (ok) {
      console.log(`User: ${username}\nPass: ${password}\n`);
      successCount++;
    }
  }
  console.log(`Done. ${successCount}/${count} users created successfully.`);
  console.log("Note: usernames are not case-sensitive, passwords are")
}

main();
