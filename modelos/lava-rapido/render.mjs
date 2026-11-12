// Modelo "lava-rapido": derivado do modelo Lavô.
// Lava-rápidos, estética automotiva, polimento, higienização.
import { esc, se, lista, json, jsonLd, waLink, mapaEmbed, horarioCurto, virgula, estrelas } from '../../gerador/lib.mjs';

const PALETAS = {
  petroleo: { ink: '#0d171c', petrol: '#0f3440', water: '#7fc8d6', accent: '#f2c230' },
  grafite: { ink: '#121212', petrol: '#232323', water: '#ff7a59', accent: '#ff4d2e' },
  marinho: { ink: '#0b1220', petrol: '#13284d', water: '#8fb4ff', accent: '#3ddc97' },
};

// Fotos padrão de ambientação (geradas por IA, sem marca). A foto da cliente substitui cada uma.
const PADRAO = {
  hero: 'img/hero.webp', heroMobile: 'img/hero-m.webp', espuma: 'img/espuma.webp', jato: 'img/jato.webp',
  farol: 'img/farol.webp', brilho: 'img/brilho.webp', final: 'img/final.webp', finalMobile: 'img/final-m.webp',
};

const ICONES = {
  carro: '<path d="M5 17h14M6 17l1.5-5h9L18 17M8 12l1-3h6l1 3"/><circle cx="8" cy="18" r="1.5"/><circle cx="16" cy="18" r="1.5"/>',
  agua: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z"/><path d="M9 15a3 3 0 0 0 3 3"/>',
  estrela: '<path d="m12 3 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9L12 3Z"/>',
  relogio: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
};
const iconeDe = (it, i) => it.icone || (/água|agua|reuso|ecol|sustent/i.test(it.titulo + it.texto) ? 'agua'
  : /rápid|rapid|minuto|fila|tempo/i.test(it.titulo + it.texto) ? 'relogio'
  : /carro|limp|detalh/i.test(it.titulo + it.texto) ? 'carro' : ['carro', 'agua', 'estrela'][i % 3]);

export function validar(d) {
  if (d.paleta && !PALETAS[d.paleta]) throw new Error('paleta inválida: ' + d.paleta + ' (use ' + Object.keys(PALETAS).join(', ') + ')');
}

export const fotos = (d) => ({
  hero: d.fotos?.hero, espuma: d.fotos?.processo?.[0], jato: d.fotos?.processo?.[1],
  farol: d.fotos?.servicos, brilho: d.fotos?.resultado, final: d.fotos?.chamada,
});

const WA_SVG = '<svg viewBox="0 0 32 32"><path d="M16 3C9 3 3.3 8.6 3.3 15.6c0 2.2.6 4.4 1.7 6.3L3 29l7.3-1.9a12.7 12.7 0 0 0 5.7 1.4c7 0 12.7-5.6 12.7-12.6S23 3 16 3Zm0 23.1c-1.9 0-3.7-.5-5.3-1.4l-.4-.2-4.3 1.1 1.2-4.2-.3-.4a10.4 10.4 0 0 1-1.6-5.4C5.3 9.8 10.1 5.1 16 5.1s10.6 4.7 10.6 10.5S21.9 26.1 16 26.1Zm5.8-7.8c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.4.2-.7.1a8.6 8.6 0 0 1-4.3-3.7c-.3-.6.3-.5.9-1.6.1-.2 0-.4 0-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.2 1.4 3.4c.2.2 2.4 3.6 5.8 5 2.2.9 3 .9 4.1.8.7-.1 1.9-.8 2.2-1.5.3-.8.3-1.4.2-1.5-.1-.1-.3-.2-.6-.3Z"/></svg>';

export function render(d, f) {
  const p = PALETAS[d.paleta || 'petroleo'];
  const foto = (k) => f[k] || PADRAO[k];
  const wa = esc(waLink(d));
  const titulo = d.seo?.titulo || `${d.nome} · Lava-rápido em ${d.cidade}`;
  const descricao = d.seo?.descricao || `Lava-rápido e estética automotiva em ${d.cidade}. ${d.servicos.slice(0, 4).map((s) => s.nome).join(', ')}. Agende pelo WhatsApp.`;
  const base = d.dominio ? `https://${d.dominio}/` : '';
  const horario = d.horarioTexto || horarioCurto(d.horario);
  const nomeCurto = d.nomeCurto || d.nome;
  const hero = d.hero || {};
  const g = d.google || {};
  const proc = d.processo;
  const resultado = d.resultado === false ? null : (d.resultado || { titulo: 'Brilho de carro recém-saído da loja.', texto: 'É isso que você leva pra casa.' });
  const delay = (i) => (i % 3 ? ` d${i % 3}` : '');

  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(descricao)}">
${se(base, `<link rel="canonical" href="${base}">\n<meta property="og:url" content="${base}">`)}
<link rel="icon" href="img/favicon.svg" type="image/svg+xml">
<meta name="theme-color" content="${p.petrol}">
<meta property="og:type" content="website">
<meta property="og:locale" content="pt_BR">
<meta property="og:title" content="${esc(titulo)}">
<meta property="og:description" content="${esc(descricao)}">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,700&family=Manrope:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/style.css">
<style>:root{--ink:${p.ink};--petrol:${p.petrol};--water:${p.water};--accent:${p.accent}}</style>
<script>window.SITE=${json({ whatsapp: d.whatsapp })};</script>
<script type="application/ld+json">
${jsonLd(d, 'AutoWash')}
</script>
</head>
<body>
<header id="top">
  <div class="wrap">
    <a href="#" class="logo">${esc(nomeCurto)}<i>.</i></a>
    <button class="menu-btn" aria-expanded="false" aria-controls="menu">Menu</button>
    <nav id="menu">
      ${se(d.diferenciais?.length, '<a href="#sobre">Quem somos</a>')}
      <a href="#servicos">Serviços</a>
      <a href="#contato">Contato</a>
      <a href="#contato" class="btn btn-primary">Agendar</a>
    </nav>
  </div>
</header>

<section class="hero">
  <div class="hero-bg" role="img" aria-label="${esc(hero.fotoAlt || 'Carro sendo lavado')}"${f.hero ? ` style="background-image:url('${f.hero}')"` : ''}></div>
  <div class="bubbles" aria-hidden="true"></div>
  <div class="wrap">
    <div>
      <p class="label reveal">${esc(hero.chamada || `Lava-rápido em ${d.cidade}`)}</p>
      <h1 class="reveal d1">${esc(hero.titulo || 'Seu carro de volta ao brilho.')}</h1>
      ${se(hero.lead, `<p class="reveal d2">${esc(hero.lead)}</p>`)}
      <div class="hero-ctas reveal d3">
        <a href="#contato" class="btn btn-primary">Agendar lavagem</a>
        <a href="#servicos" class="btn btn-ghost">Ver serviços</a>
      </div>
    </div>
    ${se(d.promocao, `<aside class="promo reveal d3"><b>${esc(d.promocao?.titulo)}</b>${esc(d.promocao?.texto)}</aside>`)}
  </div>
</section>
${se(d.diferenciais?.length, `
<section id="sobre">
  <div class="wrap">
    <div class="difs-head">
      <p class="label reveal">Por que a ${esc(nomeCurto)}</p>
      <h2 class="reveal d1">${esc(d.textos?.diferenciaisTitulo || 'Limpeza que dá pra ver. E sentir.')}</h2>
    </div>
    <div class="difs">
${lista(d.diferenciais, (x, i) => {
    const it = typeof x === 'string' ? { titulo: x, texto: '' } : x;
    return `      <div class="dif reveal${delay(i)}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">${ICONES[iconeDe(it, i)]}</svg><h3>${esc(it.titulo)}</h3>${se(it.texto, `<p>${esc(it.texto)}</p>`)}</div>`;
  })}
    </div>
  </div>
</section>`)}
${se(proc, `
<section style="padding-top:0">
  <div class="wrap split">
    <div class="crops reveal">
      <img class="a" src="${foto('espuma')}" width="1200" height="800" decoding="async" alt="Lavagem com espuma" loading="lazy">
      <img class="b" src="${foto('jato')}" width="900" height="720" decoding="async" alt="Lavagem com jato de água" loading="lazy">
    </div>
    <div>
      <p class="label reveal">${esc(proc?.chamada || 'Como trabalhamos')}</p>
      <h2 class="reveal d1">${esc(proc?.titulo)}</h2>
      ${se(proc?.texto, `<p class="reveal d2">${esc(proc?.texto)}</p>`)}
      ${se(proc?.itens?.length, `<div class="two reveal d2">${lista(proc?.itens, (it) => `<div><h3>${esc(it.titulo)}</h3><p>${esc(it.texto)}</p></div>`)}</div>`)}
      <a href="#servicos" class="link-arrow reveal d3">Conheça os serviços <span>→</span></a>
    </div>
  </div>
</section>`)}

<section class="services" id="servicos">
  <div class="wrap svc-grid">
    <div class="svc-side">
      <p class="label reveal">Serviços${d.servicos.some((s) => s.preco) ? ' & preços' : ''}</p>
      <h2 class="reveal d1">${esc(d.textos?.servicosTitulo || 'Escolha o cuidado do dia.')}</h2>
      <img class="reveal d2" src="${foto('farol')}" width="1000" height="1498" decoding="async" alt="Detalhe de carro limpo e brilhando" loading="lazy">
    </div>
    <div>
      <ul class="svc-list">
${lista(d.servicos, (s, i) => `        <li class="svc reveal"><span class="n">${String(i + 1).padStart(2, '0')}</span><div><h3>${esc(s.nome)}</h3>${se(s.descricao, `<p>${esc(s.descricao)}</p>`)}</div>${s.preco ? `<span class="price"><small>a partir de</small>${esc(s.preco)}</span>` : '<span></span>'}</li>`)}
      </ul>
      ${se(d.servicosNota, `<p class="svc-note reveal">${esc(d.servicosNota)}</p>`)}
    </div>
  </div>
</section>
${se(resultado, `
<section class="result" aria-label="Resultado">
  <figure>
    <img id="parallax" src="${foto('brilho')}" width="1200" height="1500" decoding="async" alt="Carro limpo e brilhando" loading="lazy">
    <figcaption>
      <h2 class="reveal">${esc(resultado?.titulo)}</h2>
      ${se(resultado?.texto, `<p class="reveal d1">${esc(resultado?.texto)}</p>`)}
    </figcaption>
  </figure>
</section>`)}
${se(d.avaliacoes?.length, `
<section>
  <div class="wrap">
    <div class="quotes-head">
      <div>
        <p class="label reveal">Quem já lavou</p>
        <h2 class="reveal d1">Clientes que voltam.</h2>
      </div>
      ${se(g.nota, `<div class="rating reveal d2"><b>${virgula(g.nota)}</b><div class="stars" aria-label="Nota ${virgula(g.nota)} de 5">★★★★★</div><span class="label">${se(g.total, `${esc(g.total)} avaliações `)}no Google</span></div>`)}
    </div>
    <div class="quotes">
${lista(d.avaliacoes, (r, i) => `      <figure class="quote reveal${delay(i)}"><blockquote>“${esc(r.texto)}”</blockquote><cite>${esc(r.autor)}${se(r.detalhe, ` · ${esc(r.detalhe)}`)}</cite></figure>`)}
    </div>
  </div>
</section>`)}

<section class="cta">
  <div class="cta-bg" aria-hidden="true"${f.final ? ` style="background-image:url('${f.final}')"` : ''}></div>
  <div class="wrap">
    <p class="label reveal">${esc(d.textos?.chamadaRotulo || 'Sem fila, sem espera')}</p>
    <h2 class="reveal d1">${esc(d.textos?.chamadaTitulo || 'Agende em 1 minuto pelo WhatsApp.')}</h2>
    <a href="#contato" class="btn btn-primary reveal d2">Quero agendar</a>
  </div>
</section>

<section id="contato">
  <div class="wrap contact-grid">
    <div>
      <p class="label reveal">Contato</p>
      <h2 class="reveal d1">Vem lavar com a gente.</h2>
      <ul class="info reveal d2">
        <li><span class="label">WhatsApp</span><a href="${wa}" target="_blank" rel="noopener">${esc(d.telefone)}</a></li>
        <li><span class="label">Endereço</span><span>${esc(d.endereco)}${se(d.bairro, ` · ${esc(d.bairro)}`)} · ${esc(d.cidade)}, ${esc(d.uf)}</span></li>
        ${se(horario, `<li><span class="label">Horário</span><span>${esc(horario)}</span></li>`)}
      </ul>
      <iframe class="map reveal d3" title="Mapa com a localização da ${esc(d.nome)}" loading="lazy" src="${mapaEmbed(d)}"></iframe>
    </div>
    <form id="agendar" class="reveal d1">
      <h3>Agendar lavagem</h3>
      <label>Nome<input name="nome" required autocomplete="name"></label>
      <div class="row">
        <label>Carro<input name="carro" placeholder="Ex: Onix prata" required></label>
        <label>Data<input name="data" type="date" required></label>
      </div>
      <label>Serviço
        <select name="servico">${d.servicos.map((s) => `<option>${esc(s.nome)}</option>`).join('')}</select>
      </label>
      <label>Observação<textarea name="obs" rows="3" placeholder="Opcional"></textarea></label>
      <button class="btn btn-primary" type="submit">Enviar pelo WhatsApp →</button>
    </form>
  </div>
</section>

<footer>
  <div class="wrap">
    <a href="#" class="logo">${esc(nomeCurto)}<i>.</i></a>
    <span>${esc(d.servicos.map((s) => s.nome).slice(0, 6).join(' · '))}</span>
    <span>© ${new Date().getFullYear()} ${esc(d.nome)} · Site por <a href="https://kodeva.com.br" target="_blank" rel="noopener">KODEVA Studio</a></span>
  </div>
</footer>

<a class="wa" href="${wa}" target="_blank" rel="noopener" aria-label="Falar no WhatsApp">
  ${WA_SVG}
</a>

<script src="js/main.js" defer></script>
</body>
</html>
`;
}
