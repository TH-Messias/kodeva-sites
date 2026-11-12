import { useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { List, X } from '@phosphor-icons/react'
import { INICIAL, NOME, NOME_CURTO, nav } from '../data'
import { Container, CtaButton, EASE } from './ui'

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { scrollY } = useScroll()

  // Só re-renderiza quando cruza o limite, não a cada frame.
  useMotionValueEvent(scrollY, 'change', (y) => {
    const next = y > 24
    if (next !== scrolled) setScrolled(next)
  })

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled || open ? 'border-b border-line bg-surface/85 backdrop-blur-lg' : 'border-b border-transparent'
      }`}
    >
      <Container className="flex h-[68px] items-center justify-between gap-6">
        <a href="#topo" className="flex items-center gap-2.5" aria-label={`${NOME}, início`}>
          <span className="grid size-8 place-items-center rounded-full bg-accent text-sm font-semibold text-accent-ink">{INICIAL}</span>
          <span className="text-lg font-semibold tracking-tight">{NOME_CURTO}</span>
        </a>

        <nav className="hidden lg:block" aria-label="Principal">
          <ul className="flex items-center gap-8 text-sm text-ink-soft">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="transition-colors hover:text-ink">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden lg:block">
          <CtaButton className="py-2.5" />
        </div>

        <button
          type="button"
          className="grid size-10 place-items-center rounded-full border border-line lg:hidden"
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={20} /> : <List size={20} />}
        </button>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="menu-mobile"
            aria-label="Menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="lg:hidden"
          >
            <Container className="flex flex-col gap-1 pb-6">
              {nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-2 py-3 text-lg font-medium hover:bg-surface-2"
                >
                  {item.label}
                </a>
              ))}
              <CtaButton className="mt-3 justify-center" />
            </Container>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
