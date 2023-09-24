import * as MediumService from '@/app/_services/medium'

export async function GET() {
  return await MediumService.get()
}
