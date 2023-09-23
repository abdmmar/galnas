import { neon } from '@neondatabase/serverless'
import { NextResponse } from 'next/server'

const sql = neon(process.env.DATABASE_URL as string)

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const result = await sql`
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
      JOIN 
        collection_medium AS cm ON c.id = cm.collection_id 
      JOIN 
        medium AS m ON cm.medium_id = m.id
      JOIN
        collection_artist AS ca ON c.id = ca.collection_id
      JOIN
        artist AS a ON ca.artist_id = a.id
      JOIN
        classification AS cl ON c.classification_id = cl.id
      WHERE
        c.id = ${id}
      GROUP BY
        c.id, cl.name
    `

    const collection = result[0]

    return NextResponse.json({
      status: 'ok',
      message: 'successfully get collection',
      data: collection,
    })
  } catch (error) {
    console.error('[ERROR][GET][COLLECTION]', error)

    return NextResponse.json(
      {
        status: 'error',
        message: 'failed to get collection',
      },
      { status: 400 },
    )
  }
}
