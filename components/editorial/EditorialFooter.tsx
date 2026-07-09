import Link from 'next/link'
import Image from 'next/image'

export default function EditorialFooter() {
  return (
    <footer className="bg-[#0A0A0A] text-white">
      <div className="px-6 py-20 md:px-24 md:py-28">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 md:gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="relative h-8 w-8">
                <Image src="/logo.svg" alt="DubLaunch" fill className="object-contain brightness-0 invert" />
              </div>
              <span className="text-3xl font-bold tracking-tighter md:text-4xl">dublaunch</span>
            </div>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-white/50">
              The Product Hunt for UW students. Discover and share amazing student projects,
              connect with fellow Huskies, and showcase your innovations.
            </p>
            <div className="mt-8">
              <a
                href="https://www.producthunt.com/products/dublaunch?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-dublaunch"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-hover
              >
                <img
                  src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1025278&theme=dark&t=1760992962096"
                  alt="DubLaunch on Product Hunt"
                  width={250}
                  height={54}
                />
              </a>
            </div>
          </div>

          <div>
            <h3 className="editorial-mono text-white/40">Socials</h3>
            <ul className="mt-6 space-y-3">
              {[
                { href: 'https://discord.gg/GAbbTPv2vh', label: 'Discord' },
                { href: 'https://x.com/dub_launch', label: 'X / Twitter' },
                { href: 'https://github.com/yvetter438/DubLaunch', label: 'GitHub' },
                { href: 'https://www.linkedin.com/company/dublaunch/', label: 'LinkedIn' },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white/60 transition-colors hover:text-uw-gold"
                    data-cursor-hover
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="editorial-mono text-white/40">Contact</h3>
            <ul className="mt-6 space-y-3">
              {[
                { href: '/discover', label: 'Browse Launches' },
                { href: '/launch', label: 'Submit Project' },
                { href: '/contact', label: 'Contact' },
                { href: '/about', label: 'About Us' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-uw-gold"
                    data-cursor-hover
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-white/40 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-6">
            <Link href="/privacy" className="transition-colors hover:text-white/70" data-cursor-hover>
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-white/70" data-cursor-hover>
              Terms of Service
            </Link>
          </div>
          <p className="editorial-mono">© 2025 DubLaunch · Built by Huskies, for Huskies</p>
        </div>
      </div>
    </footer>
  )
}
