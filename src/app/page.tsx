import Link from 'next/link'
import * as React from 'react'

import { Collection } from '@/app/_components/collection'
import { Search } from '@/app/_components/search'
import * as CollectionService from '@/app/_services/collection'
import { Collection as CollectionType } from '@/app/_types/collection'
import { Button } from '@/components/ui/button'

const createColumns = (data: Array<CollectionType>) => {
  let col = 0
  const columns: Array<Array<CollectionType>> = [[], [], [], []]
  for (const collection of data) {
    if (col > 3) {
      col = 0
    }
    columns[col].push(collection)
    col++
  }
  return columns
}

type SearchParams = { title?: string; classification?: string; medium?: string; sort?: string }
type Props = {
  searchParams: SearchParams
}

const getCollections = React.cache(
  async (searchParams: SearchParams) =>
    await CollectionService.get({
      title: searchParams.title,
      classification: searchParams.classification?.split(','),
      medium: searchParams.medium?.split(','),
    }),
)

export default async function Home({ searchParams }: Props) {
  const result = await getCollections(searchParams)
  const response = (await result.json()) as CollectionService.GetResponse

  if (response.status === 'error') {
    return <p>Oops there&apos;s an error</p>
  }

  const collections = response.data.items
  const columns = createColumns(collections)

  return (
    <div className="flex min-h-screen w-full gap-10 bg-background">
      <div className="flex w-1/4">
        <Collection data={columns[0]} />
      </div>
      <div className="flex w-1/2">
        <div className="flex w-full flex-col gap-10">
          <div className="mt-10 flex flex-col gap-20">
            <header className="flex items-center justify-between">
              <Button asChild variant={'link'}>
                <Link className="text-secondary-foreground" href="/doc">
                  Dokumentasi
                </Link>
              </Button>
              <Search />
            </header>
            <main>
              <h1 className="font-serif text-9xl font-medium text-foreground">
                Galeri
                <br />
                Nasional
                <br />
                Indonesia
              </h1>
            </main>
          </div>
          <div className="flex w-full flex-row gap-10">
            <Collection data={columns[1]} />
            <Collection data={columns[2]} />
          </div>
        </div>
      </div>
      <div className="flex w-1/4">
        <Collection data={columns[3]} />
      </div>
    </div>
  )
}
