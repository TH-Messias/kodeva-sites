import { ClosingCta, Footer, WhatsAppFab } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Highlights, Reasons } from './components/Reasons'
import { Gallery, Location, Team } from './components/Team'
import { Intro, Treatments } from './components/Treatments'
import { Reviews } from './components/Reviews'

export default function App() {
  return (
    <>
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-ink">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo">
        <Hero />
        <Intro />
        <Treatments />
        <Reasons />
        <Highlights />
        <Team />
        <Reviews />
        <Gallery />
        <Location />
        <ClosingCta />
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  )
}
