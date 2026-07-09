'use client'

import { useEffect, useRef, type ReactNode, type ElementType } from 'react'

interface TectonicSectionProps {
  children: ReactNode
  className?: string
  /** Parallax intensity — higher = more shift on scroll */
  speed?: number
  as?: ElementType
}

export default function TectonicSection({
  children,
  className = '',
  speed = 0.08,
  as: Tag = 'section',
}: TectonicSectionProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onScroll = () => {
      const rect = el.getBoundingClientRect()
      const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height)
      const shift = (progress - 0.5) * speed * 120
      el.style.transform = `translateY(${shift}px)`
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [speed])

  return (
    <Tag
      ref={ref}
      className={`will-change-transform ${className}`}
      style={{ transition: 'transform 700ms cubic-bezier(0.22, 1, 0.36, 1)' }}
    >
      {children}
    </Tag>
  )
}
