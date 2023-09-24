import { SearchFilter } from '@/app/_components/search-filter'
import { SearchTitle } from '@/app/_components/search-title'
import { SortFilter } from '@/app/_components/sort-filter'
import * as ClassificationDataSource from '@/app/_db/classification'
import * as MediumDataSource from '@/app/_db/medium'

export async function Search() {
  const classifications = await ClassificationDataSource.get()
  const mediums = await MediumDataSource.get()

  return (
    <div className="flex items-center gap-3">
      <SearchFilter mediums={mediums} classifications={classifications} />
      <SortFilter />
      <SearchTitle />
    </div>
  )
}
