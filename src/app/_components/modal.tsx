'use client'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'

export function Modal({ children }: { children?: React.ReactNode }) {
  const router = useRouter()

  return (
    <Dialog open onOpenChange={() => router.back()}>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  )
}
