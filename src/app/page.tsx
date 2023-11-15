import * as React from 'react'

import { Collection } from '@/app/_components/collection'
import { Search } from '@/app/_components/search'
import * as CollectionService from '@/app/_services/collection'
import { Collection as CollectionType } from '@/app/_types/collection'
import { ArrowRightIcon } from '@radix-ui/react-icons'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Galeri Nasional Indonesia - Unofficial',
  description: 'Museum seni rupa modern dan kontemporer',
  authors: {
    name: 'Abdullah Ammar',
    url: 'https://abdmmar.com',
  },
  twitter: {
    title: 'Galeri Nasional Indonesia - Unofficial',
    description: 'Museum seni rupa modern dan kontemporer',
  },
  keywords: [
    'Seni',
    'Galeri',
    'GalNas',
    'Galeri Nasional Indonesia',
    'Open Source',
    'Sumber Terbuka',
  ],
  openGraph: {
    title: 'Galeri Nasional Indonesia - Unofficial',
    description: 'Museum seni rupa modern dan kontemporer',
    url: 'https://galnas.abdmmar.com',
    type: 'website',
    images: ['/galnas.webp', '/galnas.jpg'],
  },
}

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

const getCollections = React.cache(async (searchParams: SearchParams) => {
  const sortParams = searchParams.sort
  const sortValue = sortParams ? sortParams.split(':') : undefined

  const result = await CollectionService.get({
    title: searchParams.title,
    classification: searchParams.classification?.split(','),
    medium: searchParams.medium?.split(','),
    sort: sortValue && {
      field: sortValue[0],
      value: sortValue[1],
    },
  })
  const data = (await result.json()) as CollectionService.GetResponse
  return data
})

export default async function Home({ searchParams }: Props) {
  const result = await getCollections(searchParams)

  if (result.status === 'error') {
    return <p>Oops there&apos;s an error</p>
  }

  const collections = result.data.items
  const columns = createColumns(collections)

  return (
    <div className="flex min-h-screen w-full flex-col gap-10 bg-background p-4">
      <div className="flex flex-col gap-20 lg:mx-[260px] xl:mx-[380px]">
        <header className="flex w-full flex-col items-center justify-between gap-4 sm:flex-row sm:flex-wrap md:flex-nowrap xl:gap-10">
          <Link
            className="inline-flex w-full items-center justify-between gap-2 py-2 text-sm text-secondary-foreground sm:w-fit sm:justify-normal"
            href="/galnas-api.hoppscotch.json"
          >
            Dokumentasi
            <span>
              <ArrowRightIcon className="h-4 w-4 text-secondary-foreground" />
            </span>
          </Link>
          <Search />
        </header>
        <main>
          <h1 className="font-serif text-6xl font-medium leading-none text-foreground md:text-[8.3vw]">
            Galeri
            <br />
            Nasional
            <br />
            Indonesia
          </h1>
        </main>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:-mt-[485px] xl:-mt-[540px]">
          <Collection data={columns[0]} />
        </div>
        <Collection data={columns[1]} />
        <Collection data={columns[2]} />
        <div className="lg:-mt-[485px] xl:-mt-[540px]">
          <Collection data={columns[3]} />
        </div>
      </div>
    </div>
  )
}
