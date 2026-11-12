import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'
import { WhatsappLogo } from '@phosphor-icons/react'
import { CTA_LABEL, WHATSAPP } from '../data'

// Regra de forma: botões sempre pill, imagens e blocos rounded-3xl, inputs rounded-xl.
export const EASE = [0.16, 1, 0.3, 1] as const

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

export function CtaButton({ className = '', variant = 'solid' }: { className?: string; variant?: 'solid' | 'light' }) {
  const styles =
    variant === 'solid'
      ? 'bg-accent text-accent-ink hover:brightness-110'
      : 'bg-surface text-ink hover:bg-surface-2'
  return (
    <a
      href={WHATSAPP}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-6 py-3.5 text-sm font-semibold transition duration-300 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${styles} ${className}`}
    >
      <WhatsappLogo size={18} weight="fill" aria-hidden />
      {CTA_LABEL}
    </a>
  )
}

export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-7xl px-4 md:px-8 ${className}`}>{children}</div>
}
