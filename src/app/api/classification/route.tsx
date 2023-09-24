import * as ClassificationService from '@/app/_services/classification'

export async function GET() {
  return await ClassificationService.get()
}
