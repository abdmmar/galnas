import { Client } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

import * as CollectionDataSource from '@/app/_db/collection'
import { collectionSchema } from "@/app/_schemas/collection"
import { Collection } from "@/app/_types/collection"
import { flattenErrors } from "@/lib/utils"

export async function create(input: Collection) {
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
    await CollectionDataSource.create(client, result.data)

    return NextResponse.json({
      status: 'ok',
      message: 'successfully insert a collection',
      data: result.data,
    })
  } catch (error) {
    console.error('[SERVICES] error create a collection', error)

    await client.query('ROLLBACK')
    return NextResponse.json(
      { status: 'error', message: 'error insert a collection' },
      { status: 400 },
    )
  } finally {
    await client.end()
  }
}