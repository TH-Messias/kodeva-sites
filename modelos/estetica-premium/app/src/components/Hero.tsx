import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { hero } from '../data'
import { Container, CtaButton, EASE } from './ui'

export function Hero() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  // Parallax leve na foto para dar profundidade ao primeiro scroll.
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 80])

  const enter = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay, ease: EASE },
        }

  return (
    <section id="topo" ref={ref} className="relative flex min-h-[100dvh] items-center pt-24 pb-12 md:pb-16">
      <Container className="grid items-center gap-10 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-6 lg:col-span-6">
          <motion.p {...enter(0)} className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            {hero.chamada}
          </motion.p>
          <motion.h1
            {...enter(0.08)}
            className="text-4xl font-semibold leading-[1.05] tracking-tighter text-balance md:text-5xl lg:text-6xl"
          >
            {hero.titulo} <em className="font-medium text-accent">{hero.destaque}</em>{hero.final}
          </motion.h1>
          {hero.lead && (
            <motion.p {...enter(0.16)} className="mt-6 max-w-[46ch] text-base leading-relaxed text-ink-soft md:text-lg">
              {hero.lead}
            </motion.p>
          )}
          <motion.div {...enter(0.24)} className="mt-9 flex flex-wrap items-center gap-3">
            <CtaButton />
            <a
              href="#tratamentos"
              className="inline-flex items-center rounded-full border border-line px-6 py-3.5 text-sm font-semibold transition hover:bg-surface-2 active:scale-[0.98]"
            >
              Ver tratamentos
            </a>
          </motion.div>
        </div>

        <motion.div
          className="relative md:col-span-6 lg:col-span-5 lg:col-start-8"
          initial={reduce ? false : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: EASE }}
        >
          <div className="aspect-[4/5] overflow-hidden rounded-3xl bg-surface-3 md:max-h-[72dvh] md:w-full">
            <motion.img
              style={{ y }}
              src={hero.foto}
              alt={hero.fotoAlt}
              className="h-[110%] w-full object-cover"
              fetchPriority="high"
            />
          </div>
        </motion.div>
      </Container>
    </section>
  )
}
