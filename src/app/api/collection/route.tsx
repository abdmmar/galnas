import { Client } from '@neondatabase/serverless'
import { NextResponse } from 'next/server'

import * as CollectionService from '@/app/_services/collection'
import { Collection } from '@/app/_types/collection'

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
    sort: sortValue && {
      field: sortValue[0],
      value: sortValue[1],
    },
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
  return await CollectionService.create(input)
}
