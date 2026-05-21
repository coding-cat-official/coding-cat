import { supabase } from "../supabaseClient";
import { StudentRecord } from "../types";

type TextOperator = "like" | "ilike";
type ExactOperator = "eq" | "neq";

/**
 * This function fetches profile data in the profile table where you can provide optional filters or just get all rows
 * @param column (Optional) String value for the column in the db. Specify only if you need a filter
 * @param value (Optional) String value which represent the value to be used when filtering
 * @param operator The specific operator (i.e ilike, like, eq, neq etc...) Default is ilike
 * @returns A list of objects representing rows from the profile table
 */
export async function getProfiles(
  column?: string,
  value?: string,
  operator: TextOperator | ExactOperator = "ilike",
) {
  let query: any = supabase.from("profiles").select();

  if (column && value) {
    if (operator === "like" || operator === "ilike") {
      query = query[operator](column, `%${value}%`);
    } else {
      query = query[operator](column, value);
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error("Failed to fetch student profiles:", error);
    throw error;
  }

  return data as StudentRecord[] | null;
}
