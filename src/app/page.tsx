import Link from 'next/link'

import { Collection } from '@/app/_components/collection'
import { Search } from '@/app/_components/search'
import { Button } from '@/components/ui/button'

import galnas from '../data/galeri-nasional.json'

const items: Array<Collection> = [
  ...galnas.paintings.data,
  ...galnas.sculptures.data,
  ...galnas.others.data,
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

export default async function Home({ searchParams }: { searchParams: { title: string } }) {
  const collections = searchParams.title
    ? items.filter((item) => item.title.toLowerCase().includes(searchParams.title))
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
