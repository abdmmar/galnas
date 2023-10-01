import { Modal } from '@/app/_components/modal'

export default async function CollectionModal({
  params: { id: collectionId },
}: {
  params: { id: string }
}) {
  console.log(collectionId)
  // const result = await CollectionDataSource.getById(collectionId)
  const collection = { id: collectionId }
  return (
    <Modal>
      <pre>{collection.id}</pre>
    </Modal>
  )
}
