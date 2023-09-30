import Image from 'next/image'

import { Collection as CollectionType } from '@/app/_types/collection'
import { ImageIcon } from '@radix-ui/react-icons'

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
          {c.image ? (
            <Image
              title={c.title}
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
          ) : (
            <div className="flex h-[200px] items-center justify-center bg-zinc-100" title={c.title}>
              <ImageIcon className="h-5 w-5 text-zinc-300" />
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}
