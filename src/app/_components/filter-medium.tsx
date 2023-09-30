'use client'

import { CheckIcon, ComponentInstanceIcon } from '@radix-ui/react-icons'
import { AnimatePresence } from 'framer-motion'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import * as React from 'react'

import { ResetButton } from '@/app/_components/reset-button'
import { Medium } from '@/app/_schemas/medium'
import { Button } from '@/components/ui/button'
import { Command, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

type FilterType = 'medium'

/**
 * Filter collections.
 * ?medium=1,2,3,4,5,6
 */
export function FilterMedium({ mediums }: { mediums: Array<Medium> }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const inputRef = React.useRef<HTMLInputElement>(null)
  const [inputValue, setInputValue] = React.useState<string>('')

  const mediumFilter = searchParams.get('medium')?.split(',') || []
  const isFiltered = mediumFilter.length > 0

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
    params.delete('medium')
    router.push(pathname + '?' + params.toString())
  }

  const onFilter = (type: FilterType, value: string) => {
    router.push(pathname + '?' + createQueryString(type, value))
  }

  return (
    <Popover>
      <div className="relative">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button size="icon" variant="outline" aria-label="Filter medium">
                  <ComponentInstanceIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent className="px-1 py-1" sideOffset={0}>
              <span>Filter Medium</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <AnimatePresence>
          {isFiltered && <ResetButton onClick={resetFilter} tooltip="Reset Filter" />}
        </AnimatePresence>
      </div>
      <PopoverContent className="w-56 p-1">
        <Command loop>
          <CommandInput ref={inputRef} value={inputValue} onValueChange={setInputValue} />
          <CommandGroup>
            {mediums.map((medium) => {
              const isActive = mediumFilter.includes(medium.id.toString())

              return (
                <CommandItem
                  key={medium.id}
                  value={medium.id}
                  onSelect={() => onFilter('medium', medium.id.toString())}
                >
                  <CheckIcon
                    className={cn('mr-2 h-4 w-4', isActive ? 'opacity-100' : 'opacity-0')}
                  />
                  <div className="flex-1">{medium.name}</div>
                </CommandItem>
              )
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
