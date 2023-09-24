'use client'

import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import * as React from 'react'

import { Input } from '@/components/ui/input'

export function SearchTitle() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

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

    if (!value) {
      const params = new URLSearchParams(searchParams)
      params.delete('title')
      router.push(pathname + '?' + params.toString())
      return
    }

    router.push(pathname + '?' + createQueryString('title', value))
  }
  return (
    <div className="relative">
      <Input
        className="pr-8"
        onChange={onChange}
        placeholder="Cari koleksi"
        value={searchParams.get('title') || ''}
      />
      <div className="absolute inset-y-0 right-0 flex items-center p-2">
        <MagnifyingGlassIcon className="h-4 w-4 text-secondary-foreground" />
      </div>
    </div>
  )
}
