import Image from 'next/image'

import { Collection } from '@/app/_types/collection'

export type Collections = {
  others: {
    data: Array<Collection>
    total: number
  }
  paintings: {
    data: Array<Collection>
    total: number
  }
  sculptures: {
    data: Array<Collection>
    total: number
  }
  total: number
}

export function Collection({ data }: { data: Array<Collection> }) {
  return (
    <ul className="flex w-full flex-col gap-10">
      {data.map((c) => (
        <li key={c.title + c.image}>
          <Image
            alt={c.title}
            height={300}
            sizes="100vw"
            src={'/images/' + c.image}
            style={{
              height: 'auto',
              width: '100%',
            }}
            width={500}
          />
        </li>
      ))}
    </ul>
  )
}
