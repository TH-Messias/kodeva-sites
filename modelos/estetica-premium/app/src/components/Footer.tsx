import { motion, useReducedMotion } from 'motion/react'
import { FacebookLogo, InstagramLogo, WhatsappLogo } from '@phosphor-icons/react'
import { areas, INICIAL, NOME, nav, site, social, textos, WHATSAPP } from '../data'
import { Container, CtaButton, Reveal } from './ui'

export function ClosingCta() {
  return (
    <section className="px-4 pb-20 md:px-8 md:pb-28">
      <Reveal className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-accent px-6 py-16 text-accent-ink md:px-16 md:py-20">
        <h2 className="max-w-[20ch] text-3xl font-semibold tracking-tight text-balance md:text-5xl">
          {textos.chamadaTitulo}
        </h2>
        <p className="mt-5 max-w-[50ch] opacity-80">
          {textos.chamadaTexto}
        </p>
        <CtaButton variant="light" className="mt-9" />
      </Reveal>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-line py-14">
      <Container className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-full bg-accent text-sm font-semibold text-accent-ink">{INICIAL}</span>
            <span className="text-lg font-semibold tracking-tight">{NOME}</span>
          </div>
          <p className="mt-4 max-w-[34ch] text-sm text-ink-soft">{textos.rodape}{site.responsavelTecnico ? ` ${site.responsavelTecnico}.` : ''}</p>
          <div className="mt-6 flex gap-2">
            {social.map(({ rede, href }) => ({ icon: rede === 'instagram' ? InstagramLogo : FacebookLogo, label: rede === 'instagram' ? 'Instagram' : 'Facebook', href })).map(({ icon: Icon, label, href }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="grid size-10 place-items-center rounded-full border border-line transition hover:bg-surface-2"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <nav className="md:col-span-3 md:col-start-6" aria-label="Rodapé">
          <h3 className="text-sm font-semibold">Navegação</h3>
          <ul className="mt-4 grid gap-2.5 text-sm text-ink-soft">
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="hover:text-ink">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3">
          <h3 className="text-sm font-semibold">Tratamentos</h3>
          <ul className="mt-4 grid gap-2.5 text-sm text-ink-soft">
            {areas.map((a) => (
              <li key={a.id}>{a.name}</li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-1 border-t border-line pt-6 text-xs text-ink-soft md:col-span-12 md:flex-row md:justify-between">
          <p>© {new Date().getFullYear()} {NOME}. Todos os direitos reservados.</p>
          <p>
            Site por <a href="https://kodeva.com.br" target="_blank" rel="noreferrer" className="hover:text-ink">KODEVA Studio</a>
          </p>
        </div>
      </Container>
    </footer>
  )
}

export function WhatsAppFab() {
  const reduce = useReducedMotion()
  return (
    <motion.a
      href={WHATSAPP}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar no WhatsApp"
      initial={reduce ? false : { opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.2, type: 'spring', stiffness: 200, damping: 18 }}
      whileHover={reduce ? undefined : { scale: 1.06 }}
      whileTap={{ scale: 0.96 }}
      className="fixed right-4 bottom-4 z-30 grid size-14 place-items-center rounded-full bg-accent text-accent-ink shadow-[0_12px_32px_-8px_rgb(var(--shadow)/0.5)] md:right-8 md:bottom-8"
    >
      <WhatsappLogo size={28} weight="fill" />
    </motion.a>
  )
}
