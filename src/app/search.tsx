'use client'

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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { DropdownMenuCheckboxItemProps } from '@radix-ui/react-dropdown-menu'
import { MagnifyingGlassIcon, MixerVerticalIcon, ResetIcon } from '@radix-ui/react-icons'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import * as React from 'react'

type Checked = DropdownMenuCheckboxItemProps['checked']
type Sort = '' | 'title:asc' | 'title:desc' | 'year:asc' | 'year:desc'

export function Search() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()!

  const [filter, setFilter] = React.useState<
    Record<'medium' | 'classification', Record<string, Checked>>
  >({ classification: {}, medium: {} })
  const isFiltered =
    Object.values(filter.classification).some((v) => v === true) ||
    Object.values(filter.medium).some((v) => v === true)
  const [sort, setSort] = React.useState<Sort>('')
  const isSorted = sort !== ''

  const createQueryString = React.useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams],
  )

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    router.push(pathname + '?' + createQueryString('title', value))
  }

  const onFilter = (filter: 'medium' | 'classification', key: string, value: boolean) => {
    setFilter((f) => ({
      ...f,
      [`${filter}`]: { ...f[`${filter}`], [`${key}`]: value },
    }))
  }

  const onSort = (s: Sort) => setSort(s)

  return (
    <div className="flex items-center gap-3">
      <DropdownMenu>
        <div className="relative">
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MixerVerticalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          {isFiltered && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="absolute -right-2 -top-3">
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-4 w-4 rounded-full p-0"
                      onClick={() => setFilter({ medium: {}, classification: {} })}
                    >
                      <ResetIcon className="h-[11px] w-[11px]" />
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="px-1 py-1" sideOffset={0}>
                  <span>Reset Filter</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
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
      <Select value={sort} onValueChange={(v) => onSort(v as Sort)}>
        <div className="relative">
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Urutkan" />
          </SelectTrigger>
          {isSorted && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="absolute -right-2 -top-3">
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-4 w-4 rounded-full p-0"
                      onClick={() => onSort('')}
                    >
                      <ResetIcon className="h-[11px] w-[11px]" />
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="px-1 py-1" sideOffset={0}>
                  <span>Reset Urutkan</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
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
          placeholder="Cari koleksi"
          className="pr-8"
          value={searchParams.get('title') || ''}
          onChange={onChange}
        />
        <div className="absolute inset-y-0 right-0 flex items-center p-2">
          <MagnifyingGlassIcon className="h-4 w-4 text-secondary-foreground" />
        </div>
      </div>
    </div>
  )
}
