import { ReactNode } from 'react'

interface EditorialPageProps {
  children: ReactNode
  className?: string
  narrow?: boolean
}

export default function EditorialPage({
  children,
  className = '',
  narrow = false,
}: EditorialPageProps) {
  return (
    <div className={`min-h-screen bg-white pt-28 pb-16 ${className}`}>
      <div
        className={`mx-auto px-6 md:px-24 ${narrow ? 'max-w-4xl' : 'max-w-7xl'}`}
      >
        {children}
      </div>
    </div>
  )
}
