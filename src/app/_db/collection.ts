import { Client } from "@neondatabase/serverless"

import { Collection } from "@/app/_types/collection"

export async function create(client: Client, data: Collection) {
  try {
    await client.query('BEGIN')

    const classificationResult = await client.query(
      `WITH inserted_classification AS (
          INSERT INTO classification (name) 
          VALUES ($1)
          ON CONFLICT DO NOTHING
          RETURNING id
        )
        SELECT * from inserted_classification
        UNION
        SELECT id from classification WHERE name = $1`,
      [data.classification],
    )
    const classificationId = classificationResult.rows[0].id

    const artistResult = await client.query(
      'INSERT INTO artist (name, link) VALUES ($1, $2) RETURNING id',
      [data.artist.name, data.artist.link],
    )
    const artistId = artistResult.rows[0].id

    const mediumResult = await client.query(
      `WITH inserted_medium AS (
          INSERT INTO medium (name) 
          VALUES ($1)
          ON CONFLICT DO NOTHING
          RETURNING id
        )
        SELECT * from inserted_medium
        UNION
        SELECT id from medium WHERE name = $1`,
      [data.medium],
    )
    const mediumId = mediumResult.rows[0].id

    const collectionResult = await client.query(
      `INSERT INTO collection (title, description, image, year, link, size, classification_id) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [
        data.title,
        data.description,
        data.image,
        data.year,
        data.link,
        data.size,
        classificationId,
      ],
    )
    const collectionId = collectionResult.rows[0].id

    await client.query('INSERT INTO collection_artist (collection_id, artist_id) VALUES ($1, $2)', [
      collectionId,
      artistId,
    ])
    await client.query('INSERT INTO collection_medium (collection_id, medium_id) VALUES ($1, $2)', [
      collectionId,
      mediumId,
    ])

    await client.query('COMMIT')
  } catch (error) {
    console.error('[DB] error create a collection', error)
    throw error
  }
}