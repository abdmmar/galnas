import * as CollectionDataSource from '@/app/_db/collection'

export default async function Page({ params: { id: collectionId } }: { params: { id: string } }) {
  const result = await CollectionDataSource.getById(collectionId)
  const collection = result[0]
  return <pre>{collection.title}</pre>
}
