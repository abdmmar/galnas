import { NextResponse } from "next/server"

import * as ClassificationDataSource from '@/app/_db/classification'
import { Classification } from "@/app/_schemas/classification"
import { Response } from "@/app/_types/common"

export type GetResponse = Response<Array<Classification>>

export async function get(): Promise<NextResponse<GetResponse>> {
  try {
    const result = await ClassificationDataSource.get()

    if (!result) {
      return NextResponse.json({
        status: 'error',
        message: 'classifications not found',
        // eslint-disable-next-line unicorn/no-null
        data: null,
      })
    }

    return NextResponse.json({
      status: 'ok',
      message: 'successfully get classifications',
      data: result,
    })
  } catch (error) {
    console.error('[ERROR][SERVICE_CLASSIFICATION_GET]', error)

    return NextResponse.json(
      {
        status: 'error',
        message: 'failed to get classifications',
      },
      { status: 400 },
    )
  }
}