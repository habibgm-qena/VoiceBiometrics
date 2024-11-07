'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'

export function Layout({ children }: { children: ReactNode }) {
  return (
      <div>
        {children}
      </div>
  )
}
