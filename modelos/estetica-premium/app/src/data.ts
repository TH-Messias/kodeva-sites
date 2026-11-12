// Conteúdo do site. O gerador escreve src/site.json com os dados da cliente antes do build.
// Seção sem dado real não aparece (equipe, galeria, destaques, avaliações).
import dadosJson from './site.json'

type Item = { titulo: string; texto?: string }
type Servico = { nome: string; descricao?: string; tags?: string[]; foto?: string }
type Area = { nome: string; resumo?: string; itens?: string[]; foto?: string }
type Membro = { nome: string; cargo?: string; registro?: string; foto?: string; frase?: string }
type Avaliacao = { texto: string; autor: string; detalhe?: string; estrelas?: number }

export type Site = {
  nome: string
  nomeCurto?: string
  cidade: string
  uf: string
  bairro?: string
  endereco: string
  complemento?: string
  telefone: string
  whatsapp: string
  horarioTexto?: string
  instagram?: { usuario: string }[]
  facebook?: string
  responsavelTecnico?: string
  google?: { nota?: number; total?: number; mapaUrl?: string }
  hero?: { chamada?: string; titulo?: string; destaque?: string; final?: string; lead?: string; foto?: string; fotoAlt?: string }
  textos?: Record<string, string>
  servicos: Servico[]
  areas?: Area[]
  diferenciais?: (string | Item)[]
  destaques?: (Item & { foto?: string })[]
  equipe?: Membro[]
  avaliacoes?: Avaliacao[]
  comodidades?: string[]
  galeria?: { src: string; alt?: string }[]
  fotoDiferenciais?: string
  mensagemWhatsapp?: string
}

export const S = dadosJson as unknown as Site

const t = (chave: string, padrao: string) => S.textos?.[chave] || padrao

// Fotos padrão (Unsplash, licença livre) só para ambientação. Nunca para equipe ou galeria.
export const img = (id: string, w: number, h: number, extra = '') =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=75${extra}`
const FOTOS_AREA = ['1713085085470-fba013d67e65', '1600334089648-b0d9d3028eb2', '1785860458107-5be1a99d4188', '1544717304-a2db4a7b16ee', '1676312754401-d97fe43c2c4b', '1512621776951-a57141f2eefd']

export const NOME = S.nome
export const NOME_CURTO = S.nomeCurto || S.nome
export const INICIAL = NOME_CURTO.trim()[0]?.toUpperCase() || 'K'
export const WHATSAPP = `https://wa.me/${S.whatsapp}?text=${encodeURIComponent(S.mensagemWhatsapp || 'Olá! Vim pelo site e quero agendar uma avaliação.')}`
export const CTA_LABEL = t('cta', 'Agendar avaliação')

export const hero = {
  chamada: S.hero?.chamada || `Estética em ${S.cidade}`,
  titulo: S.hero?.titulo || 'Sua melhor versão, com',
  destaque: S.hero?.destaque || 'cuidado de verdade',
  final: S.hero?.final ?? '.',
  lead: S.hero?.lead || '',
  foto: S.hero?.foto || img('1713207524097-596f3c17afc3', 1000, 1300),
  fotoAlt: S.hero?.fotoAlt || `Atendimento na ${NOME_CURTO}`,
}

export const textos = {
  manifesto: S.textos?.manifesto,
  manifestoFinal: S.textos?.manifestoFinal,
  tratamentosTitulo: t('tratamentosTitulo', 'Áreas de tratamento'),
  tratamentosIntro: t('tratamentosIntro', 'Escolha uma área para ver os procedimentos.'),
  diferenciaisTitulo: t('diferenciaisTitulo', `Por que escolher a ${NOME_CURTO}`),
  destaquesTitulo: t('destaquesTitulo', 'Os mais procurados'),
  equipeTitulo: t('equipeTitulo', 'Especialistas que cuidam de você do início ao fim'),
  galeriaTitulo: t('galeriaTitulo', 'Conheça o espaço'),
  galeriaIntro: t('galeriaIntro', 'Um espaço pensado para você relaxar antes, durante e depois do procedimento.'),
  localTitulo: t('localTitulo', 'Fácil de chegar, bom de ficar'),
  chamadaTitulo: t('chamadaTitulo', 'A primeira consulta é uma conversa, não uma venda.'),
  chamadaTexto: t('chamadaTexto', 'Conte o que te incomoda. A gente avalia, explica as opções e você decide no seu tempo.'),
  rodape: S.textos?.rodape || `Estética e bem-estar em ${S.cidade}.`,
}

export type AreaView = { id: string; name: string; summary: string; image: string; items: string[] }
const slug = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-')

// Com "areas" a cliente agrupa os serviços. Sem isso, cada serviço vira uma aba.
export const areas: AreaView[] = (S.areas?.length
  ? S.areas.map((a) => ({ nome: a.nome, resumo: a.resumo, itens: a.itens || [], foto: a.foto }))
  : S.servicos.map((s) => ({ nome: s.nome, resumo: s.descricao, itens: s.tags || [], foto: s.foto }))
).map((a, i) => ({
  id: slug(a.nome) || `area-${i}`,
  name: a.nome,
  summary: a.resumo || '',
  image: a.foto || img(FOTOS_AREA[i % FOTOS_AREA.length], 900, 1100),
  items: a.itens,
}))

export const reasons = (S.diferenciais || []).slice(0, 5).map((d) =>
  typeof d === 'string' ? { title: d, body: '' } : { title: d.titulo, body: d.texto || '' },
)
export const fotoDiferenciais = S.fotoDiferenciais || img('1758691462651-611d730c5272', 1200, 900)

export const highlights = (S.destaques || []).map((d, i) => ({
  title: d.titulo,
  body: d.texto || '',
  image: d.foto || img(FOTOS_AREA[i % FOTOS_AREA.length], 800, 1000),
}))

export const team = (S.equipe || []).map((m) => ({
  name: m.nome, role: m.cargo || '', reg: m.registro || '', photo: m.foto, quote: m.frase || '',
}))

export const gallery = (S.galeria || []).map((g) => ({ src: g.src, alt: g.alt || `Foto da ${NOME_CURTO}` }))

export const reviews = S.avaliacoes || []
export const google = S.google || {}

export const local = {
  linha1: [S.endereco, S.complemento].filter(Boolean).join(', '),
  linha2: [S.bairro, `${S.cidade}, ${S.uf}`].filter(Boolean).join(', '),
  horario: S.horarioTexto,
  mapa: `https://www.google.com/maps?q=${encodeURIComponent(`${S.nome}, ${S.endereco}, ${S.cidade} - ${S.uf}`)}&output=embed`,
  comodidades: S.comodidades || [],
}

export const social = [
  ...(S.instagram || []).map((i) => ({ rede: 'instagram' as const, href: `https://instagram.com/${i.usuario}` })),
  ...(S.facebook ? [{ rede: 'facebook' as const, href: S.facebook }] : []),
]

export const nav = [
  { label: 'Tratamentos', href: '#tratamentos' },
  ...(reasons.length ? [{ label: 'Diferenciais', href: '#diferenciais' }] : []),
  ...(team.length ? [{ label: 'Equipe', href: '#equipe' }] : []),
  ...(reviews.length ? [{ label: 'Avaliações', href: '#avaliacoes' }] : []),
  ...(gallery.length ? [{ label: 'Espaço', href: '#clinica' }] : []),
  { label: 'Localização', href: '#localizacao' },
]

export const site = S
