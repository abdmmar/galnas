import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair-display' })

export const metadata: Metadata = {
  title: 'Galeri Nasional Indonesia - Unofficial',
  description: 'Koleksi Galeri Nasional Indonesia',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="overflow-y-scroll">
      <body
        className={`${inter.variable} ${playfair.variable} ${inter.className}`}
        style={{
          marginRight: '0 !important',
        }}
      >
        {children}
      </body>
    </html>
  )
}
