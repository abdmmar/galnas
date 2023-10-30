import * as z from 'zod';

import { createCollectionSchema } from '@/app/_schemas/collection';

export type CreateCollectionSchema = z.infer<typeof createCollectionSchema> & { id: number }
export type Collection = {
  id: number,
  title: string;
  description: string;
  classification: string;
  year: string;
  medium: Array<{ id: number, name: string }>
  artist: Array<{
    id: number,
    name: string;
    link?: string | undefined;
  }>
  image?: string | undefined;
  link?: string | undefined;
  size?: string | undefined;
}
