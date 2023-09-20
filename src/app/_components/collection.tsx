import Image from 'next/image'

import { Collection as CollectionType } from '@/app/_types/collection'

export type Collections = {
  others: {
    data: Array<CollectionType>
    total: number
  }
  paintings: {
    data: Array<CollectionType>
    total: number
  }
  sculptures: {
    data: Array<CollectionType>
    total: number
  }
  total: number
}

export function Collection({ data }: { data: Array<CollectionType> }) {
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
