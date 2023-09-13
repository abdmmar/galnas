'use client'

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
 * ?classification=paintings,sculpture&medium=1,2,3,4,5,6
 */
function SearchFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const classificationFilter = searchParams.get('classification')?.split(',') || []
  const mediumFilter = searchParams.get('medium')?.split(',') || []
  const isFiltered = classificationFilter.length > 0 || mediumFilter.length > 0

  const createQueryString = React.useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)

      if (searchParams.has(name)) {
        let p = searchParams.get(name)?.split(',') || []

        if (p.includes(value)) {
          p = p.filter((v) => v !== value)
        } else {
          p.push(value)
        }

        if (p.length === 0) {
          params.delete(name)
        } else {
          params.set(name, p.join(','))
        }
      } else {
        params.set(name, value)
      }

      return params.toString()
    },
    [searchParams],
  )

  const resetFilter = () => {
    const params = new URLSearchParams(searchParams)
    params.delete('classification')
    params.delete('medium')
    router.push(pathname + '?' + params.toString())
  }

  const onFilter = (type: FilterType, value: string) => {
    router.push(pathname + '?' + createQueryString(type, value))
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
          {isFiltered && <ResetButton onClick={resetFilter} tooltip="Reset Filter" />}
        </AnimatePresence>
      </div>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Classification</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={classificationFilter.includes('paintings')}
          onCheckedChange={() => onFilter('classification', 'paintings')}
        >
          Paintings
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={classificationFilter.includes('sculpture')}
          onCheckedChange={() => onFilter('classification', 'sculpture')}
        >
          Sculpture
        </DropdownMenuCheckboxItem>
        <DropdownMenuLabel>Medium</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={mediumFilter.includes('Cat minyak pada kanvas.')}
          onCheckedChange={() => onFilter('medium', 'Cat minyak pada kanvas.')}
        >
          Cat minyak pada kanvas.
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={mediumFilter.includes('Akrilik pada kertas.')}
          onCheckedChange={() => onFilter('medium', 'Akrilik pada kertas.')}
        >
          Akrilik pada kertas.
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
