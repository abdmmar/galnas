import { Collection } from '@/app/collection'
import { Search } from '@/app/search'
import galnas from '../data/galeri-nasional.json'

const items: Array<Collection> = galnas.paintings.data
  .concat(galnas.sculptures.data, galnas.others.data)
  .filter((item) => Boolean(item?.image))

const createColumns = (data: Array<Collection>) => {
  let col = 0
  const columns: Array<Array<Collection>> = [[], [], [], []]
  for (let i = 0; i < data.length; i++) {
    const collection = data[i]
    if (col > 3) col = 0
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
    <div className="flex w-full gap-10 bg-amber-50">
      <div className="flex w-1/4">
        <Collection data={columns[0]} />
      </div>
      <div className="flex w-1/2">
        <div className="flex w-full flex-col gap-10">
          <div className="mt-10 flex flex-col gap-20">
            <header className="flex items-center justify-between">
              <div>Dokumentasi</div>
              <div>
                <Search />
              </div>
            </header>
            <main>
              <h1 className="font-serif text-9xl font-medium text-zinc-900">
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
