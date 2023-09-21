import { Client } from '@neondatabase/serverless'
import { NextResponse } from 'next/server'

import * as CollectionService from '@/app/_services/collection'
import { Collection } from '@/app/_types/collection'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const sortParams = url.searchParams.get('sort')
  const sortValue = sortParams ? sortParams.split(':') : undefined
  const classificationParams = url.searchParams.get('classification')
  const mediumParams = url.searchParams.get('medium')
  const params = {
    title: url.searchParams.get('title'),
    classification: classificationParams?.split(','),
    medium: mediumParams?.split(','),
    sort: sortValue && {
      field: sortValue[0],
      value: sortValue[1],
    },
  }

  const client = new Client(process.env.DATABASE_URL)

  try {
    await client.connect()

    let paramQuery = 1
    const conditions = []
    const values = []

    if (params.title) {
      conditions.push(`c.title ILIKE $${paramQuery}`)
      values.push(`%${params.title}%`)
      paramQuery++
    }

    if (params.classification) {
      conditions.push(`c.classification IN ($${paramQuery})`)
      values.push(classificationParams)
      paramQuery++
    }

    if (params.medium) {
      conditions.push(`m.id IN ($${paramQuery})`)
      values.push(mediumParams)
      paramQuery++
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
    let orderByClause = ''

    if (params.sort) {
      orderByClause = `ORDER BY $${paramQuery} ${params.sort.value === 'asc' ? 'ASC' : 'DESC'}`
      values.push(params.sort.field)
      paramQuery++
    }

    const query = `
    SELECT 
      c.id AS id,
      c.title as title,
      c.description as description,
      c.year as year,
      c.size as size,
      c.classification as classification,
      c.image as image,
      c.link as link,
      JSONB_AGG(JSONB_BUILD_OBJECT('id', m.id, 'name', m.name)) AS medium
    FROM 
      collection AS c 
    JOIN 
      collection_medium AS cm ON c.id = cm.collection_id 
    JOIN 
      medium AS m ON cm.medium_id = m.id
    ${whereClause}
    GROUP BY 
      c.id
    ${orderByClause}
    `

    const result = await client.query(query, values)
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
  return await CollectionService.create(input)
}
