'use client'

import CustomCursor from './CustomCursor'
import HomeHeader from './HomeHeader'
import HomeHero from './HomeHero'
import HomeMarquee from './HomeMarquee'
import HomeIntro from './HomeIntro'
import HomeProjectGrid from './HomeProjectGrid'
import HomeFooter from './HomeFooter'

export default function HomePage() {
  return (
    <div className="home-editorial bg-white text-black selection:bg-uw-purple selection:text-white md:cursor-none">
      <CustomCursor />
      <HomeHeader />
      <main>
        <HomeHero />
        <HomeMarquee />
        <HomeIntro />
        <HomeProjectGrid />
      </main>
      <HomeFooter />
    </div>
  )
}
