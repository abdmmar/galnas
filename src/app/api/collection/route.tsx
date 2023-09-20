import { Client } from '@neondatabase/serverless'
import { NextResponse } from 'next/server'

import { Collection, collectionSchema } from '@/app/_types/collection'
import { flattenErrors } from '@/lib/utils'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const titleParams = url.searchParams.get('title')
  const classificationParams = url.searchParams.get('classification')
  const mediumParams = url.searchParams.get('medium')
  const sortParams = url.searchParams.get('sort')
  const sortValue = sortParams ? sortParams.split(':') : undefined
  const params = {
    title: titleParams,
    classification: classificationParams?.split(',') || undefined,
    medium: mediumParams?.split(',') || undefined,
    sort: sortValue
      ? {
          field: sortValue[0],
          value: sortValue[1],
        }
      : undefined,
  }

  console.log(params)

  const client = new Client(process.env.DATABASE_URL)

  try {
    await client.connect()

    const result = await client.query('SELECT * FROM collection')
    const totalRows = result.rowCount
    const collections = result.rows

    return NextResponse.json({
      status: 'ok',
      message: 'successfully get collections',
      data: { total: totalRows, items: collections },
    })
  } catch (error) {
    console.error('[GET] Collection :', error)

    return NextResponse.json(
      {
        status: 'error',
        message: 'failed to get collections',
      },
      { status: 400 },
    )
  } finally {
    await client.end()
  }
}

export async function POST(request: Request) {
  const input: Collection = await request.json()

  const result = collectionSchema.safeParse(input)

  if (!result.success) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'invalid input field',
        error: flattenErrors(result.error.format()),
      },
      { status: 400 },
    )
  }

  const client = new Client(process.env.DATABASE_URL)

  try {
    await client.connect()
    await client.query('BEGIN')

    const classificationResult = await client.query(
      `WITH inserted_classification AS (
        INSERT INTO classification (name) 
        VALUES ($1)
        ON CONFLICT DO NOTHING
        RETURNING name
      )
      SELECT * from inserted_classification
      UNION
      SELECT name from classification WHERE name = $1`,
      [result.data.classification],
    )
    const classificationName = classificationResult.rows[0].name

    const artistResult = await client.query(
      'INSERT INTO artist (name, link) VALUES ($1, $2) RETURNING id',
      [result.data.artist.name, result.data.artist.link],
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
      [result.data.medium],
    )
    const mediumId = mediumResult.rows[0].id

    const collectionResult = await client.query(
      `INSERT INTO collection (title, description, image, year, link, size, classification) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [
        result.data.title,
        result.data.description,
        result.data.image,
        result.data.year,
        result.data.link,
        result.data.size,
        classificationName,
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

    return NextResponse.json({
      status: 'ok',
      message: 'successfully insert a collection',
      data: result.data,
    })
  } catch (error) {
    console.error('[POST] Collection', error)

    await client.query('ROLLBACK')
    return NextResponse.json(
      { status: 'error', message: 'error insert a collection' },
      { status: 400 },
    )
  } finally {
    await client.end()
  }
}
