import { sql } from "@/app/_db/config";
import { Classification } from "@/app/_schemas/classification";

export async function get() {
  try {
    const result = await sql`
      SELECT * FROM classification
    `
    return result as Array<Classification>
  } catch (error) {
    console.error('[ERROR][DB_CLASSIFICATION_GET]', error)
    throw error
  }
}