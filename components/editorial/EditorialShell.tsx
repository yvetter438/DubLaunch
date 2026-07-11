'use client'

import EditorialHeader from './EditorialHeader'
import EditorialFooter from './EditorialFooter'

export default function EditorialShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <EditorialHeader />
      {children}
      <EditorialFooter />
    </>
  )
}
