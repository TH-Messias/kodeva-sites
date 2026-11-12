import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { areas, textos } from '../data'
import { Container, EASE, Reveal } from './ui'

export function Intro() {
  if (!textos.manifesto) return null
  return (
    <section className="py-20 md:py-32">
      <Container>
        <Reveal>
          <p className="max-w-[28ch] text-3xl font-medium leading-[1.2] tracking-tight text-balance md:text-5xl">
            {textos.manifesto}
            {textos.manifestoFinal && <>{' '}<span className="text-ink-soft">{textos.manifestoFinal}</span></>}
          </p>
        </Reveal>
      </Container>
    </section>
  )
}

export function Treatments() {
  const [active, setActive] = useState(areas[0].id)
  const reduce = useReducedMotion()
  const area = areas.find((a) => a.id === active)!

  return (
    <section id="tratamentos" className="bg-surface-2 py-20 md:py-28">
      <Container>
        <Reveal>
          <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">{textos.tratamentosTitulo}</h2>
          <p className="mt-4 max-w-[60ch] text-ink-soft">
            {textos.tratamentosIntro}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-8 md:grid-cols-12 md:gap-12">
          <div
            role="tablist"
            aria-label="Áreas de tratamento"
            className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:col-span-4 md:mx-0 md:flex-col md:gap-1 md:overflow-visible md:px-0"
          >
            {areas.map((a) => {
              const selected = a.id === active
              return (
                <button
                  key={a.id}
                  role="tab"
                  id={`tab-${a.id}`}
                  aria-selected={selected}
                  aria-controls="painel-area"
                  onClick={() => setActive(a.id)}
                  className={`relative shrink-0 rounded-full px-5 py-3 text-left text-sm font-medium transition-colors md:text-lg ${
                    selected ? 'text-accent-ink' : 'text-ink-soft hover:text-ink'
                  }`}
                >
                  {selected && (
                    <motion.span
                      layoutId="tab-pill"
                      className="absolute inset-0 rounded-full bg-accent"
                      transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 30 }}
                    />
                  )}
                  <span className="relative whitespace-nowrap">{a.name}</span>
                </button>
              )
            })}
          </div>

          <div id="painel-area" role="tabpanel" aria-labelledby={`tab-${area.id}`} className="md:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={area.id}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="grid gap-8 lg:grid-cols-5"
              >
                <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-surface-3 lg:col-span-2 lg:aspect-[4/5]">
                  <img src={area.image} alt={`Tratamento ${area.name.toLowerCase()}`} className="h-full w-full object-cover" loading="lazy" />
                </div>
                <div className="lg:col-span-3">
                  <h3 className="text-2xl font-semibold tracking-tight">{area.name}</h3>
                  {area.summary && <p className="mt-3 max-w-[48ch] text-ink-soft">{area.summary}</p>}
                  {area.items.length > 0 && <ul className="mt-6 flex flex-wrap gap-2">
                    {area.items.map((item) => (
                      <li key={item} className="rounded-full border border-line bg-surface px-4 py-2 text-sm">
                        {item}
                      </li>
                    ))}
                  </ul>}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </section>
  )
}
