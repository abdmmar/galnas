'use client'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'

export function Modal({ children, className }: { children?: React.ReactNode; className?: string }) {
  const router = useRouter()

  return (
    <Dialog open onOpenChange={() => router.back()}>
      <DialogContent className={className}>{children}</DialogContent>
    </Dialog>
  )
}
