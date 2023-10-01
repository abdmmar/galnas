import * as CollectionService from '@/app/_services/collection'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params
  return await CollectionService.getById(id)
}
