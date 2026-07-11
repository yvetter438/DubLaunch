import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

const CONTACT_METHODS = [
  {
    label: 'Email',
    title: 'Email us',
    description: 'General inquiries, feedback, support, or partnership opportunities.',
    links: [
      { href: 'mailto:support@dublaunch.io', label: 'support@dublaunch.io' },
      { href: 'mailto:info@dublaunch.io', label: 'info@dublaunch.io' },
    ],
  },
  {
    label: 'Community',
    title: 'Join the community',
    description: 'Connect with other UW students and get help from the DubLaunch community.',
    links: [{ href: '/forums', label: 'Join Discord' }],
  },
  {
    label: 'GitHub',
    title: 'Bug reports & features',
    description: 'Report bugs, request features, or contribute to the codebase.',
    links: [
      {
        href: 'https://github.com/yvetter438/DubLaunch',
        label: 'github.com/yvetter438/DubLaunch',
        external: true,
      },
    ],
  },
  {
    label: 'Social',
    title: 'Follow us',
    description: 'Announcements, new features, and highlights from the UW builder community.',
    links: [{ href: 'https://x.com/dub_launch', label: '@dub_launch', external: true }],
  },
]

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white pt-28 pb-16">
      <div className="mx-auto max-w-4xl px-6 md:px-24">
        <div className="mb-12 text-center">
          <p className="editorial-mono mb-4 text-uw-purple">Contact</p>
          <h1 className="editorial-heading mb-4">Get in touch</h1>
          <p className="editorial-subheading mx-auto max-w-2xl">
            Questions, feedback, or ideas — we&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {CONTACT_METHODS.map((method) => (
            <div key={method.label} className="card">
              <p className="editorial-mono mb-3 text-uw-purple">{method.label}</p>
              <h2 className="mb-3 text-xl font-bold tracking-tight">{method.title}</h2>
              <p className="mb-6 text-neutral-600">{method.description}</p>
              <div className="space-y-2">
                {method.links.map((link) =>
                  link.external ? (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-medium text-uw-purple transition-colors hover:text-uw-purple/80"
                    >
                      {link.label}
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  ) : link.href.startsWith('mailto:') ? (
                    <a
                      key={link.href}
                      href={link.href}
                      className="block text-sm font-medium text-uw-purple transition-colors hover:text-uw-purple/80"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="inline-flex items-center gap-1 text-sm font-medium text-uw-purple transition-colors hover:text-uw-purple/80"
                    >
                      {link.label}
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
