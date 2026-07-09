'use client'

import { usePathname } from 'next/navigation'
import Footer from '@/components/Footer'

export default function ConditionalFooter() {
  const pathname = usePathname()
  if (pathname === '/') return null
  return <Footer />
}
