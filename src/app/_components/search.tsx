'use client'

import { DropdownMenuCheckboxItemProps } from '@radix-ui/react-dropdown-menu'
import { MagnifyingGlassIcon, MixerVerticalIcon } from '@radix-ui/react-icons'
import { AnimatePresence } from 'framer-motion'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import * as React from 'react'

import { ResetButton } from '@/app/_components/reset-button'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type Checked = DropdownMenuCheckboxItemProps['checked']
type Sort = '' | 'title:asc' | 'title:desc' | 'year:asc' | 'year:desc'

export function Search() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParameters = useSearchParams()

  const [sort, setSort] = React.useState<Sort>('')
  const isSorted = sort !== ''

  const createQueryString = React.useCallback(
    (name: string, value: string) => {
      const parameters = new URLSearchParams(searchParameters)
      parameters.set(name, value)

      return parameters.toString()
    },
    [searchParameters],
  )

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target

    if (!value) {
      router.push(pathname)
      return
    }

    router.push(pathname + '?' + createQueryString('title', value))
  }

  const onSort = (s: Sort) => setSort(s)

  return (
    <div className="flex items-center gap-3">
      <SearchFilter />
      <Select onValueChange={(v) => onSort(v as Sort)} value={sort}>
        <div className="relative">
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Urutkan" />
          </SelectTrigger>
          <AnimatePresence>
            {isSorted && <ResetButton onClick={() => onSort('')} tooltip="Reset Urutkan" />}
          </AnimatePresence>
        </div>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="title:asc">Judul (A-Z)</SelectItem>
            <SelectItem value="title:desc">Judul (Z-A)</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectItem value="year:asc">Tahun Terbaru</SelectItem>
            <SelectItem value="year:desc">Tahun Terlama</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <div className="relative">
        <Input
          className="pr-8"
          onChange={onChange}
          placeholder="Cari koleksi"
          value={searchParameters.get('title') || ''}
        />
        <div className="absolute inset-y-0 right-0 flex items-center p-2">
          <MagnifyingGlassIcon className="h-4 w-4 text-secondary-foreground" />
        </div>
      </div>
    </div>
  )
}

type FilterType = 'medium' | 'classification'

/**
 * Filter collections.
 * ?classification=paintings,sculpture&medium=1,2,3,4,5,6&sort=title-asc&search=kapal
 */
function SearchFilter() {
  // const searchParams = useSearchParams()
  const [filter, setFilter] = React.useState<Record<FilterType, Record<string, Checked>>>({
    classification: {},
    medium: {},
  })
  const isFiltered =
    Object.values(filter.classification).includes(true) ||
    Object.values(filter.medium).includes(true)

  // const createQueryString = React.useCallback(
  //   (name: string, value: string) => {
  //     const parameters = new URLSearchParams(searchParams)
  //     parameters.set(name, value)

  //     return parameters.toString()
  //   },
  //   [searchParams],
  // )

  const onFilter = (type: FilterType, key: string, value: boolean) => {
    const f = {
      ...filter,
      [`${type}`]: { ...filter[`${type}`], [`${key}`]: value },
    }
    setFilter(f)
  }

  return (
    <DropdownMenu>
      <div className="relative">
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="outline">
            <MixerVerticalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <AnimatePresence>
          {isFiltered && (
            <ResetButton
              onClick={() => setFilter({ classification: {}, medium: {} })}
              tooltip="Reset Filter"
            />
          )}
        </AnimatePresence>
      </div>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Classification</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={filter.classification?.['paintings']}
          onCheckedChange={(c) => onFilter('classification', 'paintings', c)}
        >
          Paintings
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={filter.classification?.['sculpture']}
          onCheckedChange={(c) => onFilter('classification', 'sculpture', c)}
        >
          Sculpture
        </DropdownMenuCheckboxItem>
        <DropdownMenuLabel>Medium</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={filter.medium?.['Cat minyak pada kanvas.']}
          onCheckedChange={(c) => onFilter('medium', 'Cat minyak pada kanvas.', c)}
        >
          Cat minyak pada kanvas.
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={filter.medium?.['Akrilik pada kertas.']}
          onCheckedChange={(c) => onFilter('medium', 'Akrilik pada kertas.', c)}
        >
          Akrilik pada kertas.
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
