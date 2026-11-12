import { CheckCircle, Clock, MapPin } from '@phosphor-icons/react'
import { gallery, local, NOME, team, textos } from '../data'
import { Container, CtaButton, Reveal } from './ui'

export function Team() {
  if (!team.length) return null
  return (
    <section id="equipe" className="py-20 md:py-28">
      <Container>
        <Reveal>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-accent">Corpo clínico</p>
          <h2 className="max-w-[18ch] text-3xl font-semibold tracking-tight text-balance md:text-5xl">
            {textos.equipeTitulo}
          </h2>
        </Reveal>

        <ul className="mt-14 grid gap-x-12 md:grid-cols-2">
          {team.map((m, i) => (
            <li key={m.name} className="border-t border-line">
              <Reveal delay={(i % 2) * 0.08} className="flex gap-5 py-8">
                {m.photo ? (
                  <img
                    src={m.photo}
                    alt={`Retrato de ${m.name}`}
                    loading="lazy"
                    className="size-20 shrink-0 rounded-full object-cover grayscale transition duration-500 hover:grayscale-0 md:size-24"
                  />
                ) : (
                  <span aria-hidden className="grid size-20 shrink-0 place-items-center rounded-full bg-accent-soft text-2xl font-semibold text-accent md:size-24">{m.name.replace(/^(Dra?\.?\s+)/, '')[0]}</span>
                )}
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">{m.name}</h3>
                  <p className="text-sm text-ink-soft">
                    {[m.role, m.reg].filter(Boolean).join(', ')}
                  </p>
                  {m.quote && (
                    <blockquote className="mt-3 max-w-[44ch] text-[15px] leading-relaxed">
                      <p>“{m.quote}”</p>
                    </blockquote>
                  )}
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

export function Gallery() {
  if (!gallery.length) return null
  return (
    <section id="clinica" className="bg-surface-2 py-20 md:py-28">
      <Container>
        <Reveal>
          <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">{textos.galeriaTitulo}</h2>
          <p className="mt-4 max-w-[55ch] text-ink-soft">{textos.galeriaIntro}</p>
        </Reveal>

        <div className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {gallery.map((g, i) => (
            <Reveal key={g.src} delay={(i % 3) * 0.06} className="mb-4 break-inside-avoid overflow-hidden rounded-3xl bg-surface-3">
              <img src={g.src} alt={g.alt} loading="lazy" className="w-full object-cover" />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}

export function Location() {
  return (
    <section id="localizacao" className="py-20 md:py-28">
      <Container className="grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
        <Reveal>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-accent">Onde estamos</p>
          <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">{textos.localTitulo}</h2>
          <p className="mt-6 flex items-start gap-3 text-ink-soft">
            <MapPin size={22} weight="light" className="mt-0.5 shrink-0 text-accent" aria-hidden />
            <span>
              {local.linha1}
              <br />
              {local.linha2}
            </span>
          </p>
          {local.horario && (
            <p className="mt-4 flex items-start gap-3 text-ink-soft">
              <Clock size={22} weight="light" className="mt-0.5 shrink-0 text-accent" aria-hidden />
              <span>{local.horario}</span>
            </p>
          )}
          {local.comodidades.length > 0 && (
            <ul className="mt-8 grid gap-4">
              {local.comodidades.map((text) => (
                <li key={text} className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-full bg-accent-soft text-accent">
                    <CheckCircle size={20} weight="light" aria-hidden />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          )}
          <CtaButton className="mt-10" />
        </Reveal>

        <Reveal delay={0.1} className="aspect-[4/3] overflow-hidden rounded-3xl bg-surface-3 md:aspect-square">
          <iframe
            title={`Mapa da ${NOME}`}
            src={local.mapa}
            className="h-full w-full border-0 grayscale-[0.4]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </Reveal>
      </Container>
    </section>
  )
}
