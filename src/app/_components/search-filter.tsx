'use client'

import { MixerVerticalIcon } from '@radix-ui/react-icons'
import { AnimatePresence } from 'framer-motion'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import * as React from 'react'

import { ResetButton } from '@/app/_components/reset-button'
import { Medium } from '@/app/_schemas/medium'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type FilterType = 'medium' | 'classification'

/**
 * Filter collections.
 * ?classification=painting,sculpture&medium=1,2,3,4,5,6
 */
export function SearchFilter({ mediums }: { mediums: Array<Medium> }) {
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
          checked={classificationFilter.includes('painting')}
          onCheckedChange={() => onFilter('classification', 'painting')}
        >
          Painting
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={classificationFilter.includes('sculpture')}
          onCheckedChange={() => onFilter('classification', 'sculpture')}
        >
          Sculpture
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={classificationFilter.includes('other')}
          onCheckedChange={() => onFilter('classification', 'other')}
        >
          Other
        </DropdownMenuCheckboxItem>
        <DropdownMenuLabel>Medium</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {mediums.map((medium) => (
          <DropdownMenuCheckboxItem
            key={medium.id}
            checked={mediumFilter.includes(medium.id)}
            onCheckedChange={() => onFilter('medium', medium.id)}
          >
            {medium.name}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
