import { neon } from "@neondatabase/serverless";

const databaseURL = `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}/${process.env.PGDATABASE}`
const sql = neon(databaseURL);

async function initTable() {
  await sql.transaction([
    sql`
      CREATE TABLE IF NOT EXISTS artist (
            id SERIAL PRIMARY KEY,
            name TEXT,
            link TEXT NULL
          )
    `,
    sql`
      CREATE TABLE IF NOT EXISTS medium (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) UNIQUE
          )
    `,
    sql`
      CREATE TABLE IF NOT EXISTS classification (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) UNIQUE
          )
    `,
    sql`
      CREATE TABLE IF NOT EXISTS collection (
            id SERIAL PRIMARY KEY,
            title TEXT,
            description TEXT,
            year INTEGER,
            image TEXT NULL,
            link TEXT NULL,
            size TEXT NULL,
            classification_id INT,
            FOREIGN KEY (classification_id) REFERENCES classification(id)
          )
    `,
    sql`
      CREATE TABLE IF NOT EXISTS collection_artist (
            collection_id INT,
            artist_id INT,
            PRIMARY KEY (collection_id, artist_id),
            FOREIGN KEY (collection_id) REFERENCES collection(id),
            FOREIGN KEY (artist_id) REFERENCES artist(id)
          )
    `,
    sql`
      CREATE TABLE IF NOT EXISTS collection_medium (
            collection_id INT,
            medium_id INT,
            PRIMARY KEY (collection_id, medium_id),
            FOREIGN KEY (collection_id) REFERENCES collection(id),
            FOREIGN KEY (medium_id) REFERENCES medium(id)
          )
    `,
  ])
}

// eslint-disable-next-line unicorn/prefer-top-level-await
initTable().then(() => console.log('[INIT] success creates table')).catch((error) => console.error(error))