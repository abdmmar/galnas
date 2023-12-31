import * as CollectionService from '@/app/_services/collection'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const sortParams = url.searchParams.get('sort')
  const sortValue = sortParams ? sortParams.split(':') : undefined
  const params = {
    title: url.searchParams.get('title') || undefined,
    classification: url.searchParams.get('classification')?.split(','),
    medium: url.searchParams.get('medium')?.split(','),
    sort: sortValue && {
      field: sortValue[0],
      value: sortValue[1],
    },
  }
  return await CollectionService.get(params)
}
