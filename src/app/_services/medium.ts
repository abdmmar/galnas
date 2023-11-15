import { NextResponse } from "next/server"

import * as MediumDataSource from '@/app/_db/medium'
import { Medium } from "@/app/_schemas/medium"
import { Response } from "@/app/_types/common"

export type GetResponse = Response<Array<Medium>>

export async function get(): Promise<NextResponse<GetResponse>> {
  try {
    const result = await MediumDataSource.get()

    if (!result) {
      return NextResponse.json({
        status: 'error',
        message: 'mediums not found',
        // eslint-disable-next-line unicorn/no-null
        data: null,
      })
    }

    return NextResponse.json({
      status: 'ok',
      message: 'successfully get mediums',
      data: result,
    })
  } catch (error) {
    console.error('[ERROR][SERVICE_MEDIUM_GET]', error)

    return NextResponse.json(
      {
        status: 'error',
        message: 'failed to get mediums',
      },
      { status: 400 },
    )
  }
}