import { supabase } from "../supabaseClient";

/**
 * Toggles the contract read-only setting and updates the db
 */
export async function updateContractPerms() {
  const contractStatusBool = await fetchContractPerms();
  const { error } = await supabase
    .from("settings")
    .update({ value: !contractStatusBool })
    .eq("key", "contract-read-only");

  if (error) {
    throw Error(error.message);
  }
}

/**
 * Function the value of the read-only values of the contract
 */
export async function fetchContractPerms() {
  const { data, error } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "contract-read-only");

  if (error) {
    throw Error(error.message);
  }
  const contractStatusBool = data?.[0].value === "true";

  return contractStatusBool;
}
