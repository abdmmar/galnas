import * as CollectionDataSource from '@/app/_db/collection'
import { ImageIcon } from '@radix-ui/react-icons'
import Image from 'next/image'

export default async function Page({ params: { id: collectionId } }: { params: { id: string } }) {
  const result = await CollectionDataSource.getById(collectionId)
  const collection = result[0]

  return (
    <div className="w-full">
      <div className="grid w-full grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col bg-white p-6">
          <div className="mb-4 w-fit rounded-full border border-zinc-800 px-3 py-1 text-sm">
            {collection.classification}
          </div>
          <h1 className="mb-4 font-serif text-2xl text-zinc-900 md:text-4xl">
            {collection.title}{' '}
            <span className="font-mono text-base text-zinc-500 md:text-lg">
              ({collection.year})
            </span>
          </h1>
          <div className="flex flex-col md:h-full md:justify-between">
            <p className="text-sm text-zinc-700">{collection.description}</p>
          </div>
        </div>
        <div className="bg-zinc-50 px-6 pb-6 pt-6 md:pt-20">
          <figure>
            {collection.image ? (
              <Image
                title={collection.title}
                alt={`${collection.title} thumbnail`}
                height={300}
                sizes="100vw"
                width={500}
                src={'/images/webp/' + collection?.image?.replaceAll(/(\.(jpe?g|png)$)/gi, '.webp')}
                style={{
                  height: 'auto',
                  width: '100%',
                }}
              />
            ) : (
              <div
                className="flex h-[200px] items-center justify-center bg-zinc-100"
                title={collection.title}
              >
                <ImageIcon className="h-5 w-5 text-zinc-300" />
              </div>
            )}
            <figcaption className="mt-1 inline-block text-xs text-zinc-600">
              © Galeri Nasional Indonesia
            </figcaption>
          </figure>
        </div>
      </div>
    </div>
  )
}
