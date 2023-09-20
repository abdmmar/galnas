import { Client } from "@neondatabase/serverless";

async function init() {
  const client = new Client(process.env.DATABASE_URL)

  try {
    await client.connect()
    await client.query('BEGIN')

    await client.query(`CREATE TABLE IF NOT EXISTS artist (
      id SERIAL PRIMARY KEY,
      name TEXT,
      link TEXT NULL
    )`)
    await client.query(`CREATE TABLE IF NOT EXISTS medium (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE
    )`)
    await client.query(`CREATE TABLE IF NOT EXISTS classification (
      id SERIAL PRIMARY KEY
      name VARCHAR(255) UNIQUE
    )`)
    await client.query(`CREATE TABLE IF NOT EXISTS collection (
      id SERIAL PRIMARY KEY,
      title TEXT,
      description TEXT,
      year INTEGER,
      image TEXT NULL,
      link TEXT NULL,
      size TEXT NULL,
      classification_id INT,
      FOREIGN KEY (classification_id) REFERENCES classification(id)
    )`)

    await client.query(`CREATE TABLE IF NOT EXISTS collection_artist (
      collection_id INT,
      artist_id INT,
      PRIMARY KEY (collection_id, artist_id),
      FOREIGN KEY (collection_id) REFERENCES collection(id),
      FOREIGN KEY (artist_id) REFERENCES artist(id)
    )`)

    await client.query(`CREATE TABLE IF NOT EXISTS collection_medium (
      collection_id INT,
      medium_id INT,
      PRIMARY KEY (collection_id, medium_id),
      FOREIGN KEY (collection_id) REFERENCES collection(id),
      FOREIGN KEY (medium_id) REFERENCES medium(id)
    )`)

    await client.query('COMMIT')
  } catch (error) {
    console.error('[INIT] failed creates table', error)
    await client.query('ROLLBACK')
  } finally {
    await client.end()
  }
}

// eslint-disable-next-line unicorn/prefer-top-level-await
init().then(() => console.log('[INIT] success creates table'))