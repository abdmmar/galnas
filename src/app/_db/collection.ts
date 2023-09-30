import { Client } from "@neondatabase/serverless";

import { Collection } from "@/app/_types/collection";

async function createMedium(client: Client, data: string | Array<string>): Promise<Array<string> | undefined> {
  try {
    const conditions = []
    const values = []

    if (Array.isArray(data)) {
      // eslint-disable-next-line unicorn/no-for-loop
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        conditions.push(`($${i + 1})`)
        values.push(item)
      }
    }

    if (typeof data === 'string') {
      conditions.push(`($1)`)
      values.push(data)
    }

    const valuesClause = conditions.join(', ')
    const query = `
    WITH inserted_medium AS (
      INSERT INTO medium (name) 
      VALUES ${valuesClause}
      ON CONFLICT DO NOTHING
      RETURNING id
    )
    SELECT * from inserted_medium
    UNION
    SELECT id from medium WHERE name = ANY ($${conditions.length + 1})
    `
    const result = await client.query(
      query,
      [...values, values],
    )

    return result.rows.map(row => row.id) as Array<string>
  } catch (error) {
    console.error('[DB] error create medium', error)
    throw error
  }
}

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

    const mediumIds = await createMedium(client, data.medium)

    if (!mediumIds || mediumIds?.length === 0) {
      throw new Error('[DB] Error insert medium')
    }
    console.log('[DB][Medium] Success insert medium')

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

    for (const mediumId of mediumIds) {
      await client.query('INSERT INTO collection_medium (collection_id, medium_id) VALUES ($1, $2)', [
        collectionId,
        mediumId,
      ])
    }

    await client.query('COMMIT')
  } catch (error) {
    console.error('[DB] error create a collection', error)
    throw error
  }
}

export type Params = {
  title?: string;
  classification?: string[];
  medium?: string[];
  sort?: {
    field: string;
    value: string;
  }
}

export async function get(client: Client, params: Params) {
  try {
    let paramQuery = 1
    const conditions = []
    const values = []

    if (params.title) {
      conditions.push(`c.title ILIKE $${paramQuery}`)
      values.push(`%${params.title}%`)
      paramQuery++
    }

    if (params.classification) {
      conditions.push(`cl.name = ANY ($${paramQuery})`)
      values.push(params.classification.map(c => c.toLowerCase()))
      paramQuery++
    }
    if (params.medium) {
      conditions.push(`m.id = ANY ($${paramQuery})`)
      values.push(params.medium)
      paramQuery++
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
    let orderByClause = ''

    if (params.sort) {
      const orderBy = ['title', 'year'].includes(params.sort.field) ? params.sort.field : "id"
      const order = ['ASC', 'DESC'].includes(params.sort.value.toUpperCase()) ? params.sort.value : 'ASC'
      orderByClause = `ORDER BY ${orderBy} ${order}`
    }

    console.time('collection')

    const query = `
      SELECT 
        c.id AS id,
        c.title as title,
        c.description as description,
        c.year as year,
        c.size as size,
        cl.name as classification,
        c.image as image,
        c.link as link,
        JSONB_AGG(DISTINCT JSONB_BUILD_OBJECT('id', m.id, 'name', m.name)) AS medium,
        JSONB_AGG(DISTINCT JSONB_BUILD_OBJECT('id', a.id, 'name', a.name)) AS artist
      FROM 
        collection AS c 
      LEFT JOIN 
        collection_medium AS cm ON c.id = cm.collection_id 
      LEFT JOIN 
        medium AS m ON cm.medium_id = m.id
      LEFT JOIN
        collection_artist AS ca ON c.id = ca.collection_id
      LEFT JOIN
        artist AS a ON ca.artist_id = a.id
      LEFT JOIN
        classification AS cl ON c.classification_id = cl.id
      ${whereClause}
      GROUP BY 
        c.id, cl.name
      ${orderByClause}
    `

    const result = await client.query<Collection>(query, values)

    console.timeEnd('collection')

    return result
  } catch (error) {
    console.error('[ERROR][DB_COLLECTION_GET]', error)
    throw error
  }
}