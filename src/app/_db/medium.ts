import { sql } from "@/app/_db/config";
import { Medium } from "@/app/_schemas/medium";

export async function get() {
  try {
    const result = await sql`
      SELECT * FROM medium
    `
    return result as Array<Medium>
  } catch (error) {
    console.error('[ERROR][DB_MEDIUM_GET]', error)
    throw error
  }
}