import * as z from 'zod'

const artistSchema = z.object(
  {
    name: z
      .string({ required_error: 'Artist name is required' })
      .nonempty({ message: "Artist name can't be empty" }),
    link: z.string().optional(),
  },
  { required_error: 'Artist is required' },
)

export const collectionSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .nonempty({ message: "Title can't be empty" }),
  description: z
    .string({ required_error: 'Description is required' })
    .nonempty({ message: "Description can't be empty" }),
  classification: z
    .string({ required_error: 'Classification is required' })
    .nonempty({ message: "Classification can't be empty" }),
  year: z
    .string({ required_error: 'Year is required' })
    .nonempty({ message: "Year can't be empty" }),
  medium: z
    .string({ required_error: 'Medium is required' })
    .nonempty({ message: "Medium can't be empty" }).or(z.array(z.string({ required_error: 'Medium is required' }))),
  artist: artistSchema,
  image: z.string().optional(),
  link: z.string().optional(),
  size: z.string().optional(),
})