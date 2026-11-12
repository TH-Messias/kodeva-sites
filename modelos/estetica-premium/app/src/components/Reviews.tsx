import { Star } from '@phosphor-icons/react'
import { google, reviews } from '../data'
import { Container, Reveal } from './ui'

// Avaliações reais do Google. Sem avaliação, a seção não aparece.
export function Reviews() {
  if (!reviews.length) return null
  return (
    <section id="avaliacoes" className="bg-surface-2 py-20 md:py-28">
      <Container>
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="max-w-[18ch] text-3xl font-semibold tracking-tight text-balance md:text-5xl">O que dizem nossos pacientes</h2>
          {google.nota && (
            <p className="text-right">
              <span className="block text-5xl font-semibold tracking-tight">{String(google.nota).replace('.', ',')}</span>
              <span className="text-sm text-ink-soft">
                {google.total ? `${google.total} avaliações ` : ''}no Google
              </span>
            </p>
          )}
        </Reveal>
        <ul className="mt-12 grid gap-4 md:grid-cols-3">
          {reviews.map((r, i) => (
            <li key={i}>
              <Reveal delay={(i % 3) * 0.06} className="flex h-full flex-col justify-between gap-6 rounded-3xl bg-surface p-7">
                <div>
                  <div className="flex gap-0.5 text-accent" aria-label={`${r.estrelas || 5} de 5 estrelas`}>
                    {Array.from({ length: r.estrelas || 5 }).map((_, j) => (
                      <Star key={j} size={16} weight="fill" aria-hidden />
                    ))}
                  </div>
                  <blockquote className="mt-4 text-[15px] leading-relaxed">“{r.texto}”</blockquote>
                </div>
                <p className="text-sm text-ink-soft">
                  <span className="font-semibold text-ink">{r.autor}</span>
                  {r.detalhe ? ` · ${r.detalhe}` : ''}
                </p>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
