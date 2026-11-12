// Modelo "negocio-local": genérico para a categoria OUTROS (pet shop, padaria, escritório, loja...).
// A prévia sai na hora com este modelo. Depois do pagamento, o site pode ser personalizado à mão.
import { esc, se, lista, json, jsonLd, waLink, mapaEmbed, mapaUrl, horarioCurto, virgula, estrelas } from '../../gerador/lib.mjs';

// Acento claro e escuro. Fundo neutro é do CSS; só o acento muda por paleta.
const PALETAS = {
  cobalto: { claro: ['#2348c4', '#ffffff', '#e5ebfb'], escuro: ['#8aa6ff', '#0f1530', '#1c2547'] },
  esmeralda: { claro: ['#0f7a55', '#ffffff', '#dff2ea'], escuro: ['#5fd3a5', '#06281c', '#16352a'] },
  terracota: { claro: ['#b8472a', '#ffffff', '#f8e4dc'], escuro: ['#f0937a', '#2a120b', '#3a211a'] },
  ameixa: { claro: ['#7b2d6b', '#ffffff', '#f3e1ef'], escuro: ['#e19ad3', '#2a0f25', '#382035'] },
  grafite: { claro: ['#22262b', '#ffffff', '#e6e8ea'], escuro: ['#e6e8ea', '#16191c', '#272b30'] },
  mostarda: { claro: ['#a26a00', '#ffffff', '#f6ead0'], escuro: ['#f2c14e', '#2a1d00', '#362c14'] },
};

const WA_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.42.25-.7.25-1.29.18-1.41-.08-.13-.27-.2-.57-.35m-5.42 7.4h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.69 1.45h.01c6.55 0 11.89-5.34 11.89-11.89a11.82 11.82 0 0 0-3.48-8.41Z"/></svg>';

export function validar(d) {
  if (d.paleta && !PALETAS[d.paleta]) throw new Error('paleta inválida: ' + d.paleta + ' (use ' + Object.keys(PALETAS).join(', ') + ')');
}

export const fotos = (d) => ({ logo: d.fotos?.logo, hero: d.fotos?.hero || d.fotos?.fachada, galeria: d.fotos?.galeria || [] });

export function render(d, f) {
  const p = PALETAS[d.paleta || 'cobalto'];
  const vars = ([a, ink, soft]) => `--accent:${a};--accent-ink:${ink};--accent-soft:${soft}`;
  const cta = 'Chamar no WhatsApp';
  const wa = (assunto) => esc(waLink(d, assunto ? `Olá! Vim pelo site e quero saber sobre ${assunto}.` : (d.mensagemWhatsapp || 'Olá! Vim pelo site e quero mais informações.')));
  const nomeCurto = d.nomeCurto || d.nome;
  const categoria = d.categoria || 'Negócio local';
  const titulo = d.seo?.titulo || `${d.nome} | ${categoria} em ${d.cidade}`;
  const descricao = d.seo?.descricao || `${d.nome}, ${categoria.toLowerCase()} em ${d.cidade}. ${d.servicos.slice(0, 3).map((s) => s.nome).join(', ')}. Fale pelo WhatsApp.`;
  const base = d.dominio ? `https://${d.dominio}/` : '';
  const horario = d.horarioTexto || horarioCurto(d.horario);
  const hero = d.hero || {};
  const g = d.google || {};
  const galeria = (f.galeria || []).filter(Boolean);
  const temDifs = d.diferenciais?.length > 0;
  const comoChegar = esc(mapaUrl(d));

  const nav = [
    ['servicos', d.textos?.menuServicos || 'Serviços', true],
    ['fotos', 'Fotos', galeria.length],
    ['avaliacoes', 'Avaliações', d.avaliacoes?.length],
    ['local', 'Onde estamos', true],
  ].filter((x) => x[2]);

  const fatos = [
    se(horario, `<div class="fact"><span class="fact-k">Horário</span><span class="fact-v">${esc(horario)}</span><span class="status" data-status hidden></span></div>`),
    se(g.nota, `<div class="fact"><span class="fact-k">Nota no Google</span><a class="fact-v" href="${esc(g.avaliacoesUrl || g.mapaUrl || mapaUrl(d))}" target="_blank" rel="noopener">${virgula(g.nota)} de 5${g.total ? `, ${esc(g.total)} avaliações` : ''}</a></div>`),
    `<div class="fact"><span class="fact-k">Endereço</span><a class="fact-v" href="${comoChegar}" target="_blank" rel="noopener">${esc(d.endereco)}${se(d.bairro, `, ${esc(d.bairro)}`)}</a></div>`,
  ].filter(Boolean);

  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(descricao)}">
${se(base, `<link rel="canonical" href="${base}">\n<meta property="og:url" content="${base}">`)}
<meta property="og:type" content="website">
<meta property="og:locale" content="pt_BR">
<meta property="og:title" content="${esc(titulo)}">
<meta property="og:description" content="${esc(descricao)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#f6f6f4" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#111315" media="(prefers-color-scheme: dark)">
${f.logo ? `<link rel="icon" href="${f.logo}">` : `<link rel="icon" href="data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="${p.claro[0]}"/><text x="16" y="22" font-family="sans-serif" font-size="17" font-weight="600" fill="${p.claro[1]}" text-anchor="middle">${esc(nomeCurto.trim()[0]?.toUpperCase() || 'K')}</text></svg>`)}">`}
<link rel="preload" href="fonts/outfit-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="fonts/geist-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="css/style.css">
<style>html:root{${vars(p.claro)}}@media (prefers-color-scheme: dark){html:root{${vars(p.escuro)}}}</style>
<script>window.SITE=${json({ horario: d.horario || {} })};</script>
<script type="application/ld+json">
${jsonLd(d, d.tipoSchema || 'LocalBusiness')}
</script>
</head>
<body>
<div id="topo" style="position:absolute;top:0;height:1px;width:1px"></div>

<header class="nav"><div class="wrap">
  <a class="brand" href="#" aria-label="${esc(d.nome)}, início">
    ${f.logo ? `<img src="${f.logo}" alt="">` : `<span class="brand-mark" aria-hidden="true">${esc(nomeCurto.trim()[0]?.toUpperCase() || '')}</span>`}
    <span>${esc(nomeCurto)}</span>
  </a>
  <ul>${nav.map(([id, rotulo]) => `<li><a href="#${id}">${esc(rotulo)}</a></li>`).join('')}</ul>
  <a class="btn btn-main btn-sm nav-cta" href="${wa()}" target="_blank" rel="noopener" aria-label="${cta}">${WA_SVG}<span>${cta}</span></a>
</div></header>

<main>
<section class="hero"><div class="wrap">
  <div>
    <p class="eyebrow rv">${esc(hero.chamada || `${categoria} em ${d.cidade}`)}</p>
    <h1 class="rv">${esc(hero.titulo || d.nome)}${se(hero.destaque, ` <em>${esc(hero.destaque)}</em>`)}</h1>
    ${se(hero.lead, `<p class="lead rv">${esc(hero.lead)}</p>`)}
    <div class="hero-ctas rv">
      <a class="btn btn-main" href="${wa()}" target="_blank" rel="noopener">${WA_SVG}${cta}</a>
      <a class="btn btn-line" href="${comoChegar}" target="_blank" rel="noopener">Como chegar</a>
    </div>
  </div>
  ${f.hero
    ? `<figure class="hero-media rv"><img src="${f.hero}" alt="${esc(hero.fotoAlt || `Foto da ${d.nome}`)}" fetchpriority="high" decoding="async"></figure>`
    : `<div class="hero-media vazio rv" aria-hidden="true"><span>${esc(nomeCurto)}</span></div>`}
</div></section>

<div class="wrap"><div class="facts rv" style="--n:${fatos.length}">
  ${fatos.join('\n  ')}
</div></div>

<section class="sec" id="servicos"><div class="wrap">
  <div class="svc-head rv">
    <h2>${esc(d.textos?.servicosTitulo || 'O que você encontra aqui')}</h2>
    ${se(d.textos?.servicosIntro, `<p class="lead">${esc(d.textos?.servicosIntro)}</p>`)}
  </div>
  <div class="svc-grid" style="--linhas:${Math.max(1, Math.ceil((d.servicos.length - 1) / 2))}">
${lista(d.servicos, (s, i) => `    <article class="svc rv${i === 0 ? ' destaque' : ''}">
      <h3>${esc(s.nome)}</h3>
      ${se(s.descricao, `<p>${esc(s.descricao)}</p>`)}
      ${se(s.preco, `<p class="svc-preco"><small>a partir de</small>${esc(s.preco)}</p>`)}
      ${i === 0 ? `<a class="btn btn-sm svc-cta" href="${wa(s.nome.toLowerCase())}" target="_blank" rel="noopener">Perguntar sobre ${esc(s.nome.toLowerCase())}</a>` : ''}
    </article>`)}
  </div>
</div></section>
${se(galeria.length, `
<section class="sec" id="fotos" style="padding-top:0"><div class="wrap">
  <h2 class="rv">${esc(d.textos?.galeriaTitulo || `Por dentro da ${nomeCurto}`)}</h2>
  <div class="galeria">
${lista(galeria, (src, i) => `    <figure class="rv"><img src="${src}" alt="${esc(d.fotos?.galeriaAlt?.[i] || `Foto da ${d.nome}`)}" loading="lazy" decoding="async"></figure>`)}
  </div>
</div></section>`)}
${se(temDifs, `
<section class="sec" style="padding-top:0"><div class="wrap"><div class="difs rv">
  <h2>${esc(d.textos?.diferenciaisTitulo || `Por que escolher a ${nomeCurto}`)}</h2>
  <ul>
${lista(d.diferenciais, (x) => {
    const it = typeof x === 'string' ? { titulo: x } : x;
    return `    <li><h3>${esc(it.titulo)}</h3>${se(it.texto, `<p>${esc(it.texto)}</p>`)}</li>`;
  })}
  </ul>
</div></div></section>`)}
${se(d.avaliacoes?.length, `
<section class="sec" id="avaliacoes"${temDifs ? ' style="padding-top:0"' : ''}><div class="wrap">
  <div class="rev-head rv">
    <h2>${esc(d.textos?.avaliacoesTitulo || 'Quem já veio, recomenda')}</h2>
    ${se(g.nota, `<p class="nota"><b>${virgula(g.nota)}</b><span>${g.total ? `${esc(g.total)} avaliações ` : ''}no Google</span></p>`)}
  </div>
  <ul class="reviews">
${lista((d.avaliacoes || []).slice(0, 3), (r) => `    <li class="review rv"><div><p class="stars" aria-label="${r.estrelas || 5} de 5 estrelas">${estrelas(r.estrelas || 5)}</p><blockquote>“${esc(r.texto)}”</blockquote></div><cite><b>${esc(r.autor)}</b>${se(r.detalhe, `, ${esc(r.detalhe)}`)}</cite></li>`)}
  </ul>
</div></section>`)}
${se(d.faq?.length, `
<section class="sec" style="padding-top:0"><div class="wrap">
  <h2 class="rv">Dúvidas frequentes</h2>
  <div class="faq">
${lista(d.faq, (q) => `    <details class="rv"><summary>${esc(q.pergunta)}</summary><p>${esc(q.resposta)}</p></details>`)}
  </div>
</div></section>`)}

<section class="sec" id="local"${d.faq?.length || d.avaliacoes?.length ? ' style="padding-top:0"' : ''}><div class="wrap local">
  <div class="rv">
    <h2>${esc(d.textos?.localTitulo || 'Venha até a gente')}</h2>
    <dl>
      <div><dt>Endereço</dt><dd>${esc(d.endereco)}${se(d.complemento, `, ${esc(d.complemento)}`)}<br>${esc([d.bairro, `${d.cidade} - ${d.uf}`].filter(Boolean).join(', '))}</dd></div>
      ${se(horario, `<div><dt>Horário</dt><dd>${esc(horario)}</dd></div>`)}
      <div><dt>WhatsApp</dt><dd><a href="${wa()}" target="_blank" rel="noopener">${esc(d.telefone)}</a></dd></div>
    </dl>
    <div class="hero-ctas">
      <a class="btn btn-main" href="${wa()}" target="_blank" rel="noopener">${WA_SVG}${cta}</a>
      <a class="btn btn-line" href="${comoChegar}" target="_blank" rel="noopener">Como chegar</a>
    </div>
  </div>
  <div class="map rv" data-src="${mapaEmbed(d)}" data-titulo="${esc(`Mapa com a localização da ${d.nome}`)}">
    <button class="btn btn-line" type="button">Ver no mapa</button>
  </div>
</div></section>
</main>

<footer><div class="wrap">
  <div>
    <a class="brand" href="#">${f.logo ? `<img src="${f.logo}" alt="">` : `<span class="brand-mark" aria-hidden="true">${esc(nomeCurto.trim()[0]?.toUpperCase() || '')}</span>`}<span>${esc(d.nome)}</span></a>
    ${se(hero.lead, `<p style="margin-top:14px;max-width:40ch">${esc(hero.lead)}</p>`)}
  </div>
  <ul>${nav.map(([id, rotulo]) => `<li><a href="#${id}">${esc(rotulo)}</a></li>`).join('')}</ul>
  <ul>
    <li><a href="${wa()}" target="_blank" rel="noopener">WhatsApp ${esc(d.telefone)}</a></li>
${lista(d.instagram, (i) => `    <li><a href="https://instagram.com/${esc(i.usuario)}" target="_blank" rel="noopener">Instagram @${esc(i.usuario)}</a></li>`)}
  </ul>
  <div class="foot-bottom"><span>© ${new Date().getFullYear()} ${esc(d.nome)}${se(d.cnpj, `, CNPJ ${esc(d.cnpj)}`)}</span><span>Site por <a href="https://kodeva.com.br" target="_blank" rel="noopener">KODEVA Studio</a></span></div>
</div></footer>

<a class="wa-float" href="${wa()}" target="_blank" rel="noopener" aria-label="${cta}">${WA_SVG}</a>
<script src="js/main.js" defer></script>
</body>
</html>
`;
}
