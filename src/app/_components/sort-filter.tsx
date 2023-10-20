'use client'

import { AnimatePresence } from 'framer-motion'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import * as React from 'react'

import { ResetButton } from '@/app/_components/reset-button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'

type Sort = '' | 'title:asc' | 'title:desc' | 'year:asc' | 'year:desc'

export function SortFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const sort = searchParams.get('sort') || ''
  const isSorted = Boolean(sort)

  const createQueryString = React.useCallback(
    (name: string, value: string) => {
      const parameters = new URLSearchParams(searchParams)
      parameters.set(name, value)

      return parameters.toString()
    },
    [searchParams],
  )

  const onChange = (value: Sort) => {
    if (!value) {
      const params = new URLSearchParams(searchParams)
      params.delete('sort')
      router.push(pathname + '?' + params.toString())
      return
    }

    router.push(pathname + '?' + createQueryString('sort', value))
  }

  return (
    <Select onValueChange={onChange} value={sort}>
      <div className="relative">
        <SelectTrigger>
          <span className="sr-only">Sort filter</span>
        </SelectTrigger>
        <AnimatePresence>
          {isSorted && <ResetButton onClick={() => onChange('')} tooltip="Reset Urutkan" />}
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
