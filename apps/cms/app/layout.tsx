import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'drpediatre — CMS',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
