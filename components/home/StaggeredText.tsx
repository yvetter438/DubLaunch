'use client'

interface StaggeredTextProps {
  text: string
  className?: string
  delay?: number
  as?: 'span' | 'h1' | 'h2' | 'p'
}

export default function StaggeredText({
  text,
  className = '',
  delay = 0,
  as: Tag = 'span',
}: StaggeredTextProps) {
  return (
    <Tag className={className} aria-label={text}>
      {text.split('').map((char, index) => (
        <span key={`${char}-${index}`} className="inline-block overflow-hidden align-bottom">
          <span
            className="inline-block animate-text-reveal"
            style={{ animationDelay: `${delay + index * 0.025}s` }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        </span>
      ))}
    </Tag>
  )
}
