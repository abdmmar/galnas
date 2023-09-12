import { Search } from '@/app/search'
import galnas from '../data/galeri-nasional.json'

type Collection = {
  title: string
  image?: string
  artist: {
    name: string
    link: string
  }
  year: number
  medium: string
  description: string
  link: string
  size?: string
}

type Collections = {
  total: number
  paintings: {
    total: number
    data: Array<Collection>
  }
  sculptures: {
    total: number
    data: Array<Collection>
  }
  others: {
    total: number
    data: Array<Collection>
  }
}

const items: Array<Collection> = galnas.paintings.data.concat(
  galnas.sculptures.data,
  galnas.others.data,
)

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
  const collections = items.filter((item) => item.title.toLowerCase().includes(searchParams.title))
  const columns = createColumns(collections)

  return (
    <div className="flex w-full gap-10">
      <div className="flex w-1/4">
        <ul className="w-full">
          {columns[0].map((c) => (
            <li>{c.title}</li>
          ))}
        </ul>
      </div>
      <div className="flex w-1/2">
        <div className="flex w-full flex-col gap-10">
          <div className="flex flex-col gap-10">
            <header className="flex items-center justify-between">
              <div>Dokumentasi</div>
              <div>
                <Search />
              </div>
            </header>
            <main>
              <h1>
                Galeri
                <br />
                Nasional
                <br />
                Indonesia
              </h1>
            </main>
          </div>
          <div className="flex w-full flex-row gap-10">
            <ul className="w-full">
              {columns[1].map((c) => (
                <li>{c.title}</li>
              ))}
            </ul>
            <ul className="w-full">
              {columns[2].map((c) => (
                <li>{c.title}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="flex w-1/4">
        <ul className="w-full">
          {columns[3].map((c) => (
            <li>{c.title}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
