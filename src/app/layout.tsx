import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@mantine/core/styles.css'
import './globals.css'
import Navbar from './_components/Navbar'
import { MantineProvider } from '@mantine/core'

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
        <MantineProvider>
        <div className='main-page'>
                <Navbar />
          {children}
        </div>
        </MantineProvider>
      </body>
    </html>
  )
}
