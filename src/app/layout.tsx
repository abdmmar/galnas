import './globals.css'

import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair-display' })

export const metadata: Metadata = {
  description: 'Koleksi Galeri Nasional Indonesia',
  title: 'Galeri Nasional Indonesia - Unofficial',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className="overflow-y-scroll" lang="en">
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
