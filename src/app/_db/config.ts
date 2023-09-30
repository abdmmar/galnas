import { neon } from "@neondatabase/serverless";

export const DATABASE_URL = `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}/${process.env.PGDATABASE}`

const sql = neon(DATABASE_URL)

export {
  sql
};
