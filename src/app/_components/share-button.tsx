'use client'

import { cn } from '@/lib/utils'

type ShareButtonProps = {
  className?: string
  data: {
    title: string
    text: string
    url: string
  }
}

export const ShareButton = ({ className, data }: ShareButtonProps) => {
  const onShareCollection = async () => {
    if (typeof window !== 'undefined' && navigator?.share) {
      try {
        await navigator?.share({
          title: data.title,
          text: data.text,
          url: data.url,
        })
        console.log('Thanks for sharing!')
        return
      } catch (error) {
        console.error(error)
      }
    }
  }

  return (
    <button
      className={cn(
        'w-fit rounded-full border border-zinc-800 px-3 py-1 text-sm',
        'text-zinc-600 transition-colors hover:border-primary hover:bg-primary hover:text-zinc-50',
        className,
      )}
      onClick={onShareCollection}
    >
      Share
    </button>
  )
}
