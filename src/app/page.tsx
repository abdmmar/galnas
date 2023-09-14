import Link from 'next/link'

import { Collection } from '@/app/_components/collection'
import { Search } from '@/app/_components/search'
import { Button } from '@/components/ui/button'

import galnas from '../data/galeri-nasional.json'

const items: Array<Collection> = [
  ...galnas.paintings.data.map((item) => ({ classification: 'paintings', ...item })),
  ...galnas.sculptures.data.map((item) => ({ classification: 'sculpture', ...item })),
  ...galnas.others.data.map((item) => ({ classification: 'other', ...item })),
].filter((item) => Boolean(item?.image))

const createColumns = (data: Array<Collection>) => {
  let col = 0
  const columns: Array<Array<Collection>> = [[], [], [], []]
  for (const collection of data) {
    if (col > 3) {
      col = 0
    }
    columns[col].push(collection)
    col++
  }
  return columns
}

type SearchParams = { title?: string; classification?: string; medium?: string }
type SearchParamsKey = keyof SearchParams
type Props = {
  searchParams: SearchParams
}
type Filter = { title?: string; classification?: string[]; medium?: string[] }

function buildFilter(paramsObj: Filter) {
  const filter: Filter = {}

  for (const key in paramsObj) {
    const value = paramsObj[key as SearchParamsKey]

    if (typeof value === 'string' && value) {
      filter[key as 'title'] = value
    }

    if (Array.isArray(value) && value.length > 0) {
      filter[key as 'classification' | 'medium'] = value as string[]
    }
  }

  return filter
}

export default async function Home({ searchParams }: Props) {
  const filter = buildFilter({
    title: searchParams.title,
    classification: searchParams.classification?.split(','),
    medium: searchParams.medium?.split(','),
  })
  const shouldFilter = filter?.title || filter?.classification || filter?.medium
  const collections = shouldFilter
    ? items.filter((item) => {
        return Object.keys(filter).every((k) => {
          const key = k as SearchParamsKey
          const fil = filter[key]

          if (fil && typeof fil === 'string') {
            return item.title.toLowerCase().includes(fil)
          }

          if (key === 'classification' && Array.isArray(fil) && fil?.length > 0) {
            return fil.includes(item.classification)
          }

          if (key === 'medium' && Array.isArray(fil) && fil?.length > 0) {
            return fil.includes(item.medium)
          }

          return false
        })
      })
    : items
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
