import { CollectionCard } from '@/app/_components/collection-image'
import { Collection as CollectionType } from '@/app/_types/collection'

export function Collection({ data }: { data: Array<CollectionType> }) {
  return (
    <ul className="flex w-full flex-col gap-10">
      {data.map((c) => (
        <li key={c.title + c.image}>
          <CollectionCard collection={c} />
        </li>
      ))}
    </ul>
  )
}
