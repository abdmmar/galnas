import { Client } from '@neondatabase/serverless';

import * as CollectionDataSource from '@/app/_db/collection';
import { Collection as CollectionType } from '@/app/_types/collection';

import galnas from '../../data/galeri-nasional.json';

async function seed() {
  const collections: Array<CollectionType> = [
    ...galnas.paintings.data.map((item) => ({
      ...item,
      classification: 'painting',
      year: item.year.toString(),
    })),
    ...galnas.sculptures.data.map((item) => ({
      ...item,
      classification: 'sculpture',
      year: item.year.toString(),
    })),
    ...galnas.others.data.map((item) => ({
      ...item,
      classification: 'other',
      year: item.year.toString(),
    })),
  ]

  const client = new Client(process.env.DATABASE_URL)

  try {
    for (const collection of collections) {
      await CollectionDataSource.create(client, collection)
    }
  } catch (error) {
    console.error('[INIT] error seed data', error)
  } finally {
    await client.end()
  }
}

// eslint-disable-next-line unicorn/prefer-top-level-await
seed().then(() => console.log('[INIT] success seed data'))