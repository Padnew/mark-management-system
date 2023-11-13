import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from './components/Navbar'

export const metadata: Metadata = {
  title: {
    template: '%s | MMS',
    default: 'Mark Manager',
  },
  description: 'Mark management system for distributed examiniation decisions',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ display: 'flex' }}>
        <div className='main-page'>
                <Navbar />
          {children}
        </div>
      </body>
    </html>
  )
}
