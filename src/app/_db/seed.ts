import { Client, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

import galnas from '../../data/galeri-nasional.json';
import { CreateCollectionSchema } from '../_types/collection';
import * as CollectionDataSource from './collection';

async function seed() {
  neonConfig.webSocketConstructor = ws

  const collections: Array<Omit<CreateCollectionSchema, "id">> = [
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

  const databaseURL = `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}/${process.env.PGDATABASE}`
  const client = new Client(databaseURL)

  try {
    await client.connect()

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