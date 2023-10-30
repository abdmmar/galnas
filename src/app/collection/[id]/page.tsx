import { ImageIcon } from '@radix-ui/react-icons'
import Image from 'next/image'
import Link from 'next/link'
import * as React from 'react'

import { ShareButton } from '@/app/_components/share-button'
import * as CollectionService from '@/app/_services/collection'
import { getImageCDN } from '@/lib/utils'
import { Metadata, ResolvingMetadata } from 'next'

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

const getCollection = React.cache(async (collectionId: string) => {
  const result = await CollectionService.getById(collectionId)
  const collection = (await result.json()) as CollectionService.GetByIdResponse
  return collection
})

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  // read route params
  const id = params.id

  // fetch data
  const collection = await getCollection(id)

  // optionally access and extend (rather than replace) parent metadata
  const prev = await parent
  const previousImages = prev.openGraph?.images || []

  if (collection.status === 'error')
    return {
      title: 'Koleksi Galeri Nasional Indonesia',
    }

  const artists = collection.data.artist.map((artist) => ({ name: artist.name }))
  const artistsName = artists.map((artist) => artist.name)

  return {
    title: collection.data.title,
    description: collection.data.description,
    classification: collection.data.classification,
    authors: {
      name: 'Abdullah Ammar',
      url: 'https://abdmmar.com',
    },
    keywords: [
      'seni',
      'galeri',
      'galnas',
      'Galeri Nasional Indonesia',
      collection.data.title,
      collection.data.classification,
      collection.data.year,
      ...artistsName,
    ],
    creator: artistsName[0],
    openGraph: {
      images: [
        getImageCDN(`webp/${collection.data.image}.webp`),
        getImageCDN(`${collection.data.image}.jpg`),
        ...previousImages,
      ],
    },
  }
}

export default async function Page({ params: { id: collectionId } }: Props) {
  const result = await getCollection(collectionId)

  if (result.status === 'error') {
    return <p>Oops there&apos;s an error</p>
  }

  const collection = result.data

  return (
    <div className="w-full">
      <div className="grid w-full grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col justify-between gap-10 bg-white p-6">
          <div className="flex flex-col">
            <div className="mb-4 w-fit rounded-full border border-zinc-800 px-3 py-1 text-sm">
              {collection.classification}
            </div>
            <h1 className="mb-4 font-serif text-xl text-zinc-900 md:text-6xl md:leading-tight">
              {collection.title}{' '}
              <span className="font-mono text-base text-zinc-500 md:text-2xl">
                ({collection.year})
              </span>
            </h1>
            <div className="flex flex-col md:h-full md:justify-between">
              <p className="text-sm text-zinc-700">{collection.description}</p>
            </div>
            <dl className="mt-10 flex justify-between">
              <div>
                <dt className="text-sm text-zinc-500">Seniman</dt>
                <dd className="text-sm">
                  {collection.artist.map((artist) => artist.name).join(',')}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-zinc-500">Medium</dt>
                <dd className="text-sm">{collection.medium.map((m) => m.name).join(',')}</dd>
              </div>
              <div>
                <dt className="text-sm text-zinc-500">Ukuran</dt>
                <dd className="text-sm">{collection.size?.toString() || '-'}</dd>
              </div>
            </dl>
          </div>
          <div className="flex justify-between">
            <Link href="/" className="text-sm text-zinc-500 transition-colors hover:text-primary">
              Kembali ke Halaman Koleksi
            </Link>
          </div>
        </div>
        <div className="flex h-screen flex-col justify-between bg-zinc-50 px-6 pb-6 pt-6 md:pt-6">
          <div className="flex flex-col gap-4">
            <div className="flex justify-end">
              <ShareButton
                data={{
                  title: collection.title,
                  text: collection.description,
                  url: typeof window === 'undefined' ? '' : window?.location?.href,
                }}
              />
            </div>
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
                    src={getImageCDN(`webp/${collection.image}.webp`)}
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
          </div>
          <div className="flex justify-end">
            <a
              href={`/images/${collection.image}.jpg`}
              className="text-sm text-zinc-600 transition-colors hover:text-primary"
              download={`${collection.image}.jpg`}
            >
              Download
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
