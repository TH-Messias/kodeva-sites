// Utilidades compartilhadas pelos modelos.

export const esc = (v) => String(v ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const slug = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const se = (cond, html) => (cond ? html : '');
export const lista = (arr, fn) => (arr || []).map(fn).join('\n');
export const paragrafos = (texto) => String(texto).split(/\n{2,}/)
  .map((p) => `<p>${esc(p).replace(/\n/g, '<br>')}</p>`).join('');
export const estrelas = (n = 5) => '★'.repeat(n) + '☆'.repeat(5 - n);
export const virgula = (n) => String(n).replace('.', ',');
export const json = (o) => JSON.stringify(o).replace(/</g, '\\u003c');

// Texto curto do horário a partir do mapa { "1": ["09:00","18:00"], ... }
const ABREV = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
export function horarioCurto(horario = {}) {
  const grupos = [];
  for (let dia = 1; dia <= 7; dia++) {
    const d = dia % 7;
    const h = horario[d];
    const chave = h ? h.join('–') : null;
    const ultimo = grupos[grupos.length - 1];
    if (chave && ultimo && ultimo.chave === chave && ultimo.fim === (d + 6) % 7) ultimo.fim = d;
    else if (chave) grupos.push({ chave, ini: d, fim: d });
  }
  return grupos.map((g) => `${ABREV[g.ini]}${g.fim !== g.ini ? ' a ' + ABREV[g.fim] : ''} ${g.chave}`).join(' · ');
}

const DIAS_SCHEMA = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// JSON-LD de negócio local. A nota do Google não entra como aggregateRating (regra do Google).
export function jsonLd(d, tipo, extra = {}) {
  const base = d.dominio ? `https://${d.dominio}/` : undefined;
  const horas = Object.entries(d.horario || {}).map(([dia, [abre, fecha]]) => ({
    '@type': 'OpeningHoursSpecification', dayOfWeek: DIAS_SCHEMA[dia], opens: abre, closes: fecha,
  }));
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': tipo,
    name: d.nome,
    description: d.seo?.descricao,
    url: base,
    telephone: '+' + d.whatsapp,
    hasMap: d.google?.mapaUrl,
    address: { '@type': 'PostalAddress', streetAddress: d.endereco, addressLocality: d.cidade, addressRegion: d.uf, addressCountry: 'BR' },
    openingHoursSpecification: horas.length ? horas : undefined,
    sameAs: (d.instagram || []).map((i) => 'https://instagram.com/' + i.usuario),
    ...extra,
  }, null, 2).replace(/</g, '\\u003c');
}

export const waLink = (d, texto) => `https://wa.me/${d.whatsapp}${texto ? '?text=' + encodeURIComponent(texto) : ''}`;
export const mapaEmbed = (d) => `https://maps.google.com/maps?q=${encodeURIComponent(`${d.nome}, ${d.endereco}, ${d.cidade} - ${d.uf}`)}&amp;output=embed`;
export const mapaUrl = (d) => d.google?.mapaUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${d.nome}, ${d.endereco}, ${d.cidade} - ${d.uf}`)}`;
export const enderecoCompleto = (d) => [d.endereco, d.bairro, `${d.cidade} - ${d.uf}`].filter(Boolean).join(', ');

export function validarBase(d) {
  const faltando = ['nome', 'cidade', 'uf', 'whatsapp', 'telefone', 'endereco', 'servicos']
    .filter((k) => d[k] == null || d[k] === '' || (Array.isArray(d[k]) && !d[k].length));
  if (faltando.length) throw new Error('Campos obrigatórios faltando: ' + faltando.join(', '));
  if (!/^55\d{10,11}$/.test(d.whatsapp)) throw new Error('whatsapp deve ter só dígitos com 55 + DDD, ex.: 5511999998888');
}

// Prévia: faixa fixa, noindex e aviso no título. A prévia não é protegida contra cópia
// (HTML nunca é); a faixa e o link que expira só desestimulam.
export function aplicarPrevia(html, { expira } = {}) {
  const aviso = `Prévia KODEVA Studio${expira ? ` · disponível até ${expira}` : ''} · site ainda não publicado`;
  const css = `<style>.kodeva-previa{position:fixed;left:0;right:0;bottom:0;z-index:2147483647;background:#111;color:#fff;font:600 13px/1.3 system-ui,sans-serif;text-align:center;padding:10px 16px;letter-spacing:.02em}
.kodeva-previa-marca{position:fixed;inset:0;z-index:2147483646;pointer-events:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='360' height='220'%3E%3Ctext x='20' y='130' transform='rotate(-24 180 110)' font-family='system-ui' font-size='30' font-weight='700' fill='%23888' fill-opacity='.13'%3EPRÉVIA KODEVA%3C/text%3E%3C/svg%3E")}
body{padding-bottom:42px}</style>`;
  return html
    .replace('<head>', '<head>\n  <meta name="robots" content="noindex,nofollow">')
    .replace(/<link rel="canonical"[^>]*>/, '')
    .replace(/<title>/, '<title>[Prévia] ')
    .replace('</head>', css + '\n</head>')
    .replace(/<\/body>/, `<div class="kodeva-previa-marca" aria-hidden="true"></div><div class="kodeva-previa" role="note">${esc(aviso)}</div>\n</body>`);
}
