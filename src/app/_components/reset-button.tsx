import { ResetIcon } from '@radix-ui/react-icons'
import { motion } from 'framer-motion'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

type Props = {
  onClick: () => void
  tooltip?: string
}

export function ResetButton({ onClick, tooltip }: Props) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            animate={{ scale: 1 }}
            className="absolute -right-2 -top-3"
            exit={{ scale: 0 }}
            initial={{ scale: 0 }}
            transition={{ duration: 0.3, type: 'spring' }}
          >
            <Button
              className="h-4 w-4 rounded-full p-0"
              onClick={onClick}
              size="sm"
              variant="destructive"
            >
              <ResetIcon className="h-[11px] w-[11px]" />
            </Button>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent className="px-1 py-1" sideOffset={0}>
          <span>{tooltip}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
