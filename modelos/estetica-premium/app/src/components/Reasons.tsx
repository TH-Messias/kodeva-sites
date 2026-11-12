import { Armchair, Certificate, ChartLineUp, Cpu, UserFocus } from '@phosphor-icons/react'
import { fotoDiferenciais, highlights, reasons, textos } from '../data'
import { Container, CtaButton, Reveal } from './ui'

const icons = [Certificate, Cpu, UserFocus, Armchair, ChartLineUp]

// Bento com exatamente 5 células: 1 grande com foto, 1 em acento, 3 neutras.
const cellClass = [
  'md:col-span-4 md:row-span-2 min-h-[320px] text-white',
  'md:col-span-2 bg-accent text-accent-ink',
  'md:col-span-2 bg-surface-2',
  'md:col-span-3 bg-surface-2',
  'md:col-span-3 bg-accent-soft',
]

export function Reasons() {
  if (!reasons.length) return null
  return (
    <section id="diferenciais" className="py-20 md:py-28">
      <Container>
        <Reveal>
          <h2 className="max-w-[20ch] text-3xl font-semibold tracking-tight text-balance md:text-5xl">
            {textos.diferenciaisTitulo}
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-6">
          {reasons.map((r, i) => {
            const Icon = icons[i]
            const isPhoto = i === 0
            return (
              <Reveal key={r.title} delay={i * 0.06} className={`relative flex flex-col justify-end overflow-hidden rounded-3xl p-7 ${cellClass[i]}`}>
                {isPhoto && (
                  <>
                    <img
                      src={fotoDiferenciais}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover object-[center_20%]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f1413]/85 via-[#0f1413]/30 to-transparent" />
                  </>
                )}
                <div className="relative">
                  <Icon size={28} weight="light" aria-hidden className={isPhoto ? '' : 'opacity-80'} />
                  <h3 className={`mt-5 font-semibold tracking-tight ${isPhoto ? 'text-2xl md:text-3xl' : 'text-xl'}`}>{r.title}</h3>
                  {r.body && <p className={`mt-2 max-w-[40ch] text-sm leading-relaxed ${isPhoto ? 'text-white/80' : 'opacity-75'}`}>{r.body}</p>}
                </div>
              </Reveal>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

export function Highlights() {
  if (!highlights.length) return null
  return (
    <section className="bg-surface-2 py-20 md:py-28">
      <Container>
        <Reveal>
          <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">{textos.destaquesTitulo}</h2>
        </Reveal>
      </Container>

      <div className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-4 px-4 pb-4 md:scroll-px-8 md:px-8 xl:px-[max(2rem,calc((100vw-80rem)/2+2rem))]">
        {highlights.map((h, i) => (
          <Reveal key={h.title} delay={i * 0.08} className="w-[78vw] shrink-0 snap-start sm:w-[44vw] lg:w-[30vw] xl:w-[23rem]">
            <article className="group">
              <div className="aspect-[4/5] overflow-hidden rounded-3xl bg-surface-3">
                <img
                  src={h.image}
                  alt={h.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
              </div>
              <h3 className="mt-5 text-xl font-semibold tracking-tight">{h.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{h.body}</p>
            </article>
          </Reveal>
        ))}
      </div>

      <Container className="mt-10">
        <CtaButton />
      </Container>
    </section>
  )
}
