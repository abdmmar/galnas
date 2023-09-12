import Image from 'next/image'

export type Collection = {
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

export type Collections = {
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

export function Collection({ data }: { data: Array<Collection> }) {
  return (
    <ul className="flex w-full flex-col gap-10">
      {data.map((c, i) => (
        <li key={c.title + c.image}>
          <Image
            src={'/images/' + c.image}
            alt={c.title}
            sizes="100vw"
            style={{
              width: '100%',
              height: 'auto',
            }}
            width={500}
            height={300}
          />
        </li>
      ))}
    </ul>
  )
}
