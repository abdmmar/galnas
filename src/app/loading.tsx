import { ArrowRightIcon } from '@radix-ui/react-icons'
import Link from 'next/link'

export default function Loading() {
  return (
    <div className="flex min-h-screen w-full flex-col gap-10 bg-background p-4">
      <div className="flex flex-col gap-20 lg:mx-[260px] xl:mx-[380px]">
        <header className="flex w-full flex-col items-center justify-between gap-4 sm:flex-row sm:flex-wrap md:flex-nowrap xl:gap-10">
          <Link
            className="inline-flex w-full items-center justify-between gap-2 py-2 text-sm text-secondary-foreground sm:w-fit sm:justify-normal"
            href="/doc"
          >
            Dokumentasi
            <span>
              <ArrowRightIcon className="h-4 w-4 text-secondary-foreground" />
            </span>
          </Link>
          <div className="h-9 w-full bg-zinc-300 md:w-[480px]" />
        </header>
        <main>
          <h1 className="font-serif text-6xl font-medium leading-none text-foreground md:text-[8.3vw]">
            Galeri
            <br />
            Nasional
            <br />
            Indonesia
          </h1>
        </main>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:-mt-[485px] xl:-mt-[540px]">
          <div className="h-[250px] w-full bg-zinc-300" />
          <div className="h-[250px] w-full bg-zinc-300" />
          <div className="h-[250px] w-full bg-zinc-300" />
        </div>
        <div className="h-[250px] w-full bg-zinc-300" />
        <div className="h-[250px] w-full bg-zinc-300" />
        <div className="lg:-mt-[485px] xl:-mt-[540px]">
          <div className="h-[250px] w-full bg-zinc-300" />
          <div className="h-[250px] w-full bg-zinc-300" />
        </div>
      </div>
    </div>
  )
}
