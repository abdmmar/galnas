import { CollectionCard } from '@/app/_components/collection-image'
import { Collection as CollectionType } from '@/app/_types/collection'
import Link from 'next/link'

export function Collection({ data }: { data: Array<CollectionType> }) {
  return (
    <ul className="flex w-full flex-col gap-10">
      {data.map((c) => (
        <li key={c.id}>
          <Link href={'/collection/' + c.id}>
            <CollectionCard collection={c} />
          </Link>
        </li>
      ))}
    </ul>
  )
}
