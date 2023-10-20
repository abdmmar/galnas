'use client'

import { Collection as CollectionType } from '@/app/_types/collection'
import { cn } from '@/lib/utils'
import { ImageIcon } from '@radix-ui/react-icons'
import { motion, useAnimation } from 'framer-motion'
import Image from 'next/image'

export function CollectionCard({ collection }: { collection: CollectionType }) {
  const controls = useAnimation()

  function onMouseEnter() {
    controls.start('hover')
  }

  function onMouseLeave() {
    controls.start('initial')
  }

  return (
    <motion.div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      whileHover={{
        scale: 1.1,
        transition: { duration: '150ms' },
      }}
      className={cn(
        'col-span-2 flex w-full flex-col rounded-md border transition-all',
        'bg-white hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-900',
        'relative',
      )}
    >
      {collection.image ? (
        <Image
          title={collection.title}
          alt={`${collection.title} thumbnail`}
          height={300}
          sizes="100vw"
          src={'/images/webp/' + collection.image.replaceAll(/(\.(jpe?g|png)$)/gi, '.webp')}
          style={{
            height: 'auto',
            width: '100%',
          }}
          width={500}
        />
      ) : (
        <div
          className="flex h-[200px] items-center justify-center bg-zinc-100"
          title={collection.title}
        >
          <ImageIcon className="h-5 w-5 text-zinc-300" />
        </div>
      )}
      <motion.div
        animate={controls}
        transition={{ opacity: { ease: 'easeInOut' } }}
        initial="initial"
        variants={{
          initial: {
            opacity: 0,
            background:
              'linear-gradient(to top, rgba(63,63,70, 0.5), rgba(63,63,70, 0.2), rgba(63,63,70, 0))',
          },
          hover: {
            opacity: 1,
            background:
              'linear-gradient(to top, rgba(63,63,70, 0.5), rgba(63,63,70, 0.2), rgba(63,63,70, 0))',
          },
        }}
        className="absolute bottom-0 w-full p-4 transition-all "
      >
        <motion.p
          animate={controls}
          className="font-medium text-white"
          transition={{ opacity: { ease: 'easeInOut', duration: 0.15 } }}
          variants={{
            initial: { visibility: 'hidden', y: 10, opacity: 0 },
            hover: { visibility: 'visible', y: 0, opacity: 1 },
          }}
        >
          {collection.title}
        </motion.p>
      </motion.div>
    </motion.div>
  )
}
