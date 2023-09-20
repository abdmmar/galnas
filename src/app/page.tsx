import Link from 'next/link'

import { Collection } from '@/app/_components/collection'
import { Search } from '@/app/_components/search'
import { Collection as CollectionType } from '@/app/_types/collection'
import { Button } from '@/components/ui/button'

import galnas from '../data/galeri-nasional.json'

const items: Array<CollectionType> = [
  ...galnas.paintings.data.map((item) => ({
    ...item,
    classification: 'painting',
    year: item.year.toString(),
  })),
  ...galnas.sculptures.data.map((item) => ({
    ...item,
    classification: 'sculpture',
    year: item.year.toString(),
  })),
  ...galnas.others.data.map((item) => ({
    ...item,
    classification: 'other',
    year: item.year.toString(),
  })),
].filter((item) => Boolean(item?.image))

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

type Filter = { title?: string; classification?: string[]; medium?: string[] }
type FilterKey = keyof Filter

function applyFilter(items: CollectionType[], filter: Filter) {
  return items.filter((item) => {
    return Object.entries(filter).every(([key_, value]) => {
      if (value == undefined || (Array.isArray(value) && value.length === 0)) return true // Skip undefined or null values

      const key = key_ as FilterKey

      switch (key) {
        case 'title': {
          return item.title.toLowerCase().includes(value as string)
        }
        case 'classification': {
          return (value as string[]).includes(item.classification)
        }
        case 'medium': {
          return (value as string[]).includes(item.medium)
        }
        default: {
          return false
        }
      }
    })
  })
}

type SearchParams = { title?: string; classification?: string; medium?: string }
type Props = {
  searchParams: SearchParams
}

export default async function Home({ searchParams }: Props) {
  const collections = applyFilter(items, {
    title: searchParams.title,
    classification: searchParams.classification?.split(','),
    medium: searchParams.medium?.split(','),
  })
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
