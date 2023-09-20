import * as z from 'zod'

import { collectionSchema } from '@/app/_schemas/collection'

export type Collection = z.infer<typeof collectionSchema>
