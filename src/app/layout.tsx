import type { Metadata } from 'next'
import '@mantine/core/styles.css'
import './globals.css'
import Navbar from './_components/Navbar'
import {MantineProvider } from '@mantine/core'

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
      <body>
        <MantineProvider>
        <div style={{marginLeft: '4.5rem', marginTop: '1rem'}} >
          {children}
          <Navbar />

        </div>
        </MantineProvider>
      </body>
    </html>
  )
}
