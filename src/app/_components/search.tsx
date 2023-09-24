import { SearchFilter } from '@/app/_components/search-filter'
import { SearchTitle } from '@/app/_components/search-title'
import { SortFilter } from '@/app/_components/sort-filter'
import * as MediumDataSource from '@/app/_db/medium'

export async function Search() {
  const mediums = await MediumDataSource.get()

  return (
    <div className="flex items-center gap-3">
      <SearchFilter mediums={mediums} />
      <SortFilter />
      <SearchTitle />
    </div>
  )
}
