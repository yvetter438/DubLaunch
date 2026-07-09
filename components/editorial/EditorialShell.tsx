'use client'

import CustomCursor from './CustomCursor'
import EditorialHeader from './EditorialHeader'
import EditorialFooter from './EditorialFooter'

export default function EditorialShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CustomCursor />
      <EditorialHeader />
      {children}
      <EditorialFooter />
    </>
  )
}
