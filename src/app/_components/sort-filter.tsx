'use client'

import { AnimatePresence } from 'framer-motion'
import * as React from 'react'

import { ResetButton } from '@/app/_components/reset-button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type Sort = '' | 'title:asc' | 'title:desc' | 'year:asc' | 'year:desc'

export function SortFilter() {
  const [sort, setSort] = React.useState<Sort>('')
  const isSorted = sort !== ''

  const onSort = (s: Sort) => setSort(s)

  return (
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
  )
}
