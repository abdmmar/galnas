import { MagnifyingGlassIcon } from '@radix-ui/react-icons'

export default function Home() {
  return (
    <div className="flex w-full gap-10">
      <div className="flex w-1/4">
        <ul className="w-full">
          <li>image</li>
        </ul>
      </div>
      <div className="flex w-1/2">
        <div className="flex w-full flex-col gap-10">
          <div className="flex flex-col gap-10">
            <header className="flex items-center justify-between">
              <div>Dokumentasi</div>
              <div>
                <MagnifyingGlassIcon />
              </div>
            </header>
            <main>
              <h1>
                Galeri
                <br />
                Nasional
                <br />
                Indonesia
              </h1>
            </main>
          </div>
          <div className="flex w-full flex-row gap-10">
            <ul className="w-full">
              <li>image</li>
            </ul>
            <ul className="w-full">
              <li>image</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex w-1/4">
        <ul className="w-full">
          <li>image</li>
        </ul>
      </div>
    </div>
  )
}
