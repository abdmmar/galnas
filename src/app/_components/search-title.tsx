'use client'

import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import * as React from 'react'

import { useDebounce } from '@/app/_hooks/use-debounce'
import { Input } from '@/components/ui/input'

export function SearchTitle() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [s, setSearch] = React.useState(() => searchParams.get('title') || '')
  const search = useDebounce(s, 500)

  React.useEffect(() => {
    if (!search) {
      const params = new URLSearchParams(searchParams)
      params.delete('title')
      router.push(pathname + '?' + params.toString())
      return
    }

    router.push(pathname + '?' + createQueryString('title', search))
  }, [search])

  const createQueryString = React.useCallback(
    (name: string, value: string) => {
      const parameters = new URLSearchParams(searchParams)
      parameters.set(name, value)

      return parameters.toString()
    },
    [searchParams],
  )

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setSearch(value)
  }

  return (
    <div className="relative w-full">
      <Input className="pr-8" onChange={onChange} placeholder="Cari koleksi" value={s} />
      <div className="absolute inset-y-0 right-0 flex items-center p-2">
        <MagnifyingGlassIcon className="h-4 w-4 text-secondary-foreground" />
      </div>
    </div>
  )
}
