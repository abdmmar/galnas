import { Client, neon } from '@neondatabase/serverless'
import { NextResponse } from 'next/server'
import * as z from 'zod'

import { flattenErrors } from '@/lib/utils'

const sql = neon(process.env.DATABASE_URL as string)
const collectionSchema = z.object({
  title: z.string().nonempty({ message: 'Title is required' }),
  description: z.string().nonempty({ message: 'Description is required' }),
  classification: z.string().nonempty({ message: 'Classification is required' }),
  year: z.string().nonempty({ message: 'Year is required' }),
  medium: z.string().nonempty({ message: 'Medium is required' }),
  artist: z.object(
    {
      name: z
        .string({ required_error: 'Artist name is required' })
        .nonempty({ message: 'Artist name is required' }),
      link: z.string().optional(),
    },
    { required_error: 'Artist is required' },
  ),
  image: z.string().optional(),
  link: z.string().optional(),
  size: z.string().optional(),
})

type CollectionInput = z.infer<typeof collectionSchema>

export async function GET() {
  const start = new Date()
  const [dbResponse] = await sql`SELECT NOW();`
  const dbNow = dbResponse && dbResponse.now ? dbResponse.now : ''
  const end = new Date()
  const diff = end.getTime() - start.getTime()
  return NextResponse.json({ dbNow: dbNow, latency: diff })
}

export async function POST(request: Request) {
  const input: CollectionInput = await request.json()

  const result = collectionSchema.safeParse(input)

  if (!result.success) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Invalid input field',
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
        RETURNING id
      )
      SELECT * from inserted_classification
      UNION
      SELECT id from classification WHERE name = $1`,
      [result.data.classification],
    )
    const classificationName = classificationResult.rows[0].id

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
      VALUES ($1, $2, $3, $4, $5, $6, $7)`,
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
      status: 'OK',
      message: 'Successfully insert a collection',
      data: result.data,
    })
  } catch {
    await client.query('ROLLBACK')
    return NextResponse.json(
      { status: 'Error', message: 'Error insert collection' },
      { status: 400 },
    )
  } finally {
    await client.end()
  }
}
