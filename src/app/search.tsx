'use client'

import { Input } from '@/components/ui/input'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

export function Search() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()!

  const createQueryString = useCallback(
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

  return (
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
  )
}
