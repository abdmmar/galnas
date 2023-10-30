import * as CollectionService from '@/app/_services/collection'
import { ImageIcon } from '@radix-ui/react-icons'
import Image from 'next/image'
import * as React from 'react'

const getCollection = React.cache(async (collectionId: string) => {
  const result = await CollectionService.getById(collectionId)
  const collection = (await result.json()) as CollectionService.GetByIdResponse
  return collection
})

export default async function Page({ params: { id: collectionId } }: { params: { id: string } }) {
  const result = await getCollection(collectionId)

  if (result.status === 'error') {
    return <p>Oops there&apos;s an error</p>
  }

  const collection = result.data

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
        <div className="flex h-screen flex-col justify-between bg-zinc-50 px-6 pb-6 pt-6 md:pt-20">
          <div className="flex items-start justify-center">
            <figure>
              {collection.image ? (
                <Image
                  title={collection.title}
                  alt={`${collection.title} thumbnail`}
                  className="max-h-[70vh] w-fit object-contain"
                  height={300}
                  sizes="100vw"
                  width={500}
                  src={`https://cdn.statically.io/img/galnas.abdmmar.com/images/webp/${collection.image}.webp`}
                  priority
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
          <div className="flex justify-between">
            <button className="text-sm text-zinc-700">Share</button>
            <button className="text-sm text-zinc-700">Download</button>
          </div>
        </div>
      </div>
    </div>
  )
}
