import HomeHero from './HomeHero'
import HomeMarquee from './HomeMarquee'
import HomeIntro from './HomeIntro'
import HomeProjectGrid from './HomeProjectGrid'

export default function HomePage() {
  return (
    <main className="bg-white text-black">
      <HomeHero />
      <HomeMarquee />
      <HomeIntro />
      <HomeProjectGrid />
    </main>
  )
}
