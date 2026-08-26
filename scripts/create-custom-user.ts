import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import * as readline from 'readline';

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

/**
 * @param input the input to be validated
 * @returns boolean whether the input is alphanumerical
 */
function validateInput(input: string){
  const regex = /^[a-zA-Z0-9]+$/;
  return regex.test(input);
}

function getInput(question: string): Promise<string>{
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer: string) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {
  let username;
  let password;
  let valid;

  do{
    username = await getInput("Enter username (only alphanumerical characters): ");
    password = await getInput("Enter password: ");

    valid = validateInput(username) && validateInput(password);
    if(!valid) console.log("Invalid input. Only alphanumerical characters are allowed.");
  }while(!valid);

  const dbOk = await createUser(username, password);
  if(dbOk) console.log(`Successfully created user ${username}!`)
}

main();
