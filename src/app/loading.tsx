export default function Loading() {
  return (
    <div className="flex min-h-screen w-full animate-pulse gap-10 bg-background">
      <div className="flex w-1/4">
        <div className="flex w-full flex-col gap-10">
          <div className="h-[250px] w-full bg-zinc-300" />
          <div className="h-[250px] w-full bg-zinc-300" />
          <div className="h-[250px] w-full bg-zinc-300" />
        </div>
      </div>
      <div className="flex w-1/2">
        <div className="flex w-full flex-col gap-10">
          <div className="mt-10 flex flex-col gap-20">
            <header className="flex items-center justify-between">
              <p className="text-secondary-foreground">Dokumentasi</p>
              <div className="h-9 w-[486px] bg-zinc-300" />
            </header>
            <main>
              <h1 className="font-serif text-9xl font-medium text-foreground">
                Galeri
                <br />
                Nasional
                <br />
                Indonesia
              </h1>
            </main>
          </div>
          <div className="flex w-full flex-row gap-10">
            <div className="flex w-full flex-col gap-10">
              <div className="h-[250px] w-full bg-zinc-300" />
            </div>
            <div className="flex w-full flex-col gap-10">
              <div className="h-[250px] w-full bg-zinc-300" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-1/4">
        <div className="flex w-full flex-col gap-10">
          <div className="h-[250px] w-full bg-zinc-300" />
          <div className="h-[250px] w-full bg-zinc-300" />
          <div className="h-[250px] w-full bg-zinc-300" />
        </div>
      </div>
    </div>
  )
}
