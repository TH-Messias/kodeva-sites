// Modelo "estetica-classica": derivado do site da Belíssima Laser.
// Clínicas de estética, studios de beleza, depilação, massagem.
import { esc, slug, se, lista, paragrafos, estrelas, virgula, json, jsonLd } from '../../gerador/lib.mjs';

// ---------- Paletas (claro e escuro). A cliente escolhe uma no pedido. ----------
const PALETAS = {
  dourado: {
    claro: { canvas: '#FBF8F4', surface: '#FFFFFF', ink: '#1F1A17', steel: '#6F655C', border: '#EADFD3', accent: '#94701F', 'accent-hover': '#7A5C18', 'accent-soft': '#F7EEDB', gold: '#C9A24A', 'gold-hover': '#B38D36', rose: '#E8B4B8', 'rose-soft': '#FAEDEE' },
    escuro: { canvas: '#15120F', surface: '#1F1B17', ink: '#F7F1E8', steel: '#B0A495', border: '#3A332B', accent: '#D9B45A', 'accent-hover': '#E8C878', 'accent-soft': '#2E2516', gold: '#D9B45A', 'gold-hover': '#E8C878', rose: '#E8B4B8', 'rose-soft': '#2A1E20' },
  },
  rose: {
    claro: { canvas: '#FCF7F6', surface: '#FFFFFF', ink: '#241A1C', steel: '#74626A', border: '#EFDDE0', accent: '#A24A62', 'accent-hover': '#873B50', 'accent-soft': '#F8E6EB', gold: '#D98BA0', 'gold-hover': '#C77189', rose: '#E8B4B8', 'rose-soft': '#FAEDEE' },
    escuro: { canvas: '#161012', surface: '#201719', ink: '#F8EEF0', steel: '#B9A3AA', border: '#3B2B30', accent: '#E79AAF', 'accent-hover': '#F2B5C5', 'accent-soft': '#341F25', gold: '#E79AAF', 'gold-hover': '#F2B5C5', rose: '#E8B4B8', 'rose-soft': '#2A1E20' },
  },
  salvia: {
    claro: { canvas: '#F7F8F4', surface: '#FFFFFF', ink: '#1B1F1A', steel: '#626B60', border: '#DFE4D8', accent: '#4F6B47', 'accent-hover': '#3F573A', 'accent-soft': '#E8EFE3', gold: '#9AB38E', 'gold-hover': '#86A079', rose: '#E8C9B4', 'rose-soft': '#F6EEE7' },
    escuro: { canvas: '#111410', surface: '#1A1E19', ink: '#EEF2EA', steel: '#A6B09F', border: '#2F362C', accent: '#A9C79B', 'accent-hover': '#C0D9B4', 'accent-soft': '#232D20', gold: '#A9C79B', 'gold-hover': '#C0D9B4', rose: '#E8C9B4', 'rose-soft': '#2A231E' },
  },
};

// ---------- Textos padrão (a IA ou a revisão podem sobrescrever) ----------
const PASSOS_PADRAO = [
  { titulo: 'Você chama no WhatsApp', texto: 'Conte o que gostaria de tratar, do seu jeito. A equipe responde suas primeiras dúvidas e marca um horário que encaixe na sua rotina.' },
  { titulo: 'Uma conversa no espaço', texto: 'A profissional ouve seu objetivo, pergunta sobre sua saúde e rotina e avalia a região a tratar. Pode perguntar tudo, sem vergonha.' },
  { titulo: 'Um plano feito pra você', texto: 'Você recebe a indicação do tratamento, o número estimado de sessões e os valores. Pensa com calma e decide no seu tempo.' },
];

export function validar(d) {
  if (d.paleta && !PALETAS[d.paleta]) throw new Error('paleta inválida: ' + d.paleta + ' (use ' + Object.keys(PALETAS).join(', ') + ')');
}

// Fotos que este modelo usa (caminhos do JSON). O gerador copia e devolve os caminhos finais.
export const fotos = (d) => ({
  logo: d.fotos?.logo,
  fachada: d.fotos?.fachada,
  estrutura: d.fotos?.estrutura,
  servicos: (d.servicos || []).map((s) => s.foto),
  galeria: d.fotos?.galeria || [],
});

function cssPaleta(nome) {
  const p = PALETAS[nome || 'dourado'];
  const vars = (o) => Object.entries(o).map(([k, v]) => `--${k}:${v}`).join(';');
  return `:root{${vars(p.claro)}}`
    + `@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){${vars(p.escuro)}}}`
    + `:root[data-theme="dark"]{${vars(p.escuro)}}`;
}

// ---------- Página ----------
export function render(d, f) {
  const base = d.dominio ? `https://${d.dominio}/` : '';
  const titulo = d.seo?.titulo || `${d.nome} | Estética em ${d.cidade}`;
  const descricao = d.seo?.descricao || `${d.nome} em ${d.cidade}. Agende sua avaliação pelo WhatsApp.`;
  const wa = 'https://wa.me/' + d.whatsapp;
  const insta = d.instagram || [];
  const g = d.google || {};
  const passos = d.passos?.length ? d.passos : PASSOS_PADRAO;
  f.galeria = (f.galeria || []).filter(Boolean);
  const temGaleria = f.galeria.length > 0;

  const nav = [
    ['servicos', 'Serviços', true],
    ['avaliacao', 'Avaliação', true],
    ['outros', 'Outros serviços', d.outros?.length],
    ['espaco', 'Espaço', f.estrutura || d.diferenciais?.length],
    ['fotos', 'Fotos', temGaleria],
    ['avaliacoes', 'Avaliações', d.avaliacoes?.length],
    ['duvidas', 'Dúvidas', d.faq?.length],
    ['local', 'Local', true],
    ['redes', 'Redes', insta.length],
  ].filter((x) => x[2]);

  const site = {
    nome: d.nome,
    whatsapp: d.whatsapp,
    horario: d.horario || {},
    links: {
      mapa: g.mapaUrl,
      avaliacoes: g.avaliacoesUrl || g.mapaUrl,
      ...Object.fromEntries(insta.map((i, n) => ['instagram' + n, 'https://instagram.com/' + i.usuario])),
    },
  };

  const mapaQuery = encodeURIComponent(`${d.nome}, ${d.endereco}, ${d.cidade} - ${d.uf}`);
  const mapaEmbed = `https://maps.google.com/maps?q=${mapaQuery}&amp;output=embed`;
  const fato = (k, v, s, extra = '') => `<li class="fact"><span class="fact-k">${esc(k)}</span><span class="fact-v">${v}</span><span class="fact-s">${esc(s)}</span>${extra}</li>`;

  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(titulo)}</title>
  <meta name="description" content="${esc(descricao)}">
  ${se(base, `<link rel="canonical" href="${base}">`)}
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${esc(d.nome)}">
  <meta property="og:title" content="${esc(titulo)}">
  <meta property="og:description" content="${esc(descricao)}">
  ${se(base && f.fachada, `<meta property="og:image" content="${base}${f.fachada}">`)}
  <meta property="og:locale" content="pt_BR">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="preload" href="fonts/geist-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="fonts/outfit-latin.woff2" as="font" type="font/woff2" crossorigin>
  ${se(f.logo, `<link rel="icon" href="${f.logo}">`)}
  <meta name="theme-color" content="${PALETAS[d.paleta || 'dourado'].claro.canvas}">
  <script>try{var t=localStorage.getItem('tema')}catch(e){}document.documentElement.dataset.theme=t||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');</script>
  <link rel="stylesheet" href="css/styles.css">
  <style>${cssPaleta(d.paleta)}</style>
  <script>window.SITE=${json(site)};</script>
  <script type="application/ld+json">
${jsonLd(d, d.tipoSchema || 'BeautySalon')}
  </script>
</head>
<body>

  <header class="nav">
    <div class="wrap">
      <a class="brand" href="#top" aria-label="${esc(d.nome)}, início">
        ${f.logo ? `<img src="${f.logo}" height="56" alt="">` : `<span class="foot-brand">${esc(d.nomeCurto || d.nome)}</span>`}
      </a>
      <ul class="nav-links">
${lista(nav, ([id, rotulo]) => `        <li><a href="#${id}">${rotulo}</a></li>`)}
      </ul>
      <div class="nav-cta">
        <button class="theme-toggle" type="button" aria-label="Ativar modo noturno">
          <svg class="icon-moon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>
          <svg class="icon-sun" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
        </button>
        <a class="btn btn-primary btn-sm" href="${wa}" data-link="whatsapp" target="_blank" rel="noopener">Agendar</a>
      </div>
    </div>
  </header>

  <main id="top">
    <div class="wrap hero">
      <div class="hero-text">
        <h1>${esc(d.hero?.titulo || d.nomeCurto || d.nome)}${se(d.hero?.destaque, ` <em>${esc(d.hero?.destaque)}</em>`)} <span class="h1-sub">${esc(d.hero?.subtitulo || `Estética em ${d.cidade}`)}</span></h1>
        ${se(d.hero?.lead, `<p class="lead">${esc(d.hero.lead)}</p>`)}
        <div class="hero-actions">
          <a class="btn btn-primary" href="${wa}" data-link="whatsapp" target="_blank" rel="noopener">Agendar avaliação</a>
          ${se(insta[0], `<a class="btn btn-outline" href="https://instagram.com/${esc(insta[0]?.usuario)}" data-link="instagram0" target="_blank" rel="noopener">Ver no Instagram</a>`)}
        </div>
      </div>
      <figure class="banner">
        <div class="banner-placeholder">Foto da fachada</div>
        ${se(f.fachada, `<img src="${f.fachada}" width="1200" height="1600" fetchpriority="high" decoding="async" alt="${esc(d.fotos?.fachadaAlt || 'Fachada da ' + d.nome)}" onerror="this.remove()">`)}
      </figure>
    </div>

    <div class="wrap">
      <ul class="facts">
        ${se(g.nota, `<li><a class="fact fact-link" href="${esc(g.avaliacoesUrl || g.mapaUrl)}" data-link="avaliacoes" target="_blank" rel="noopener" aria-label="Nota ${virgula(g.nota)} de 5 no Google, com ${g.total} avaliações. Ver avaliações">
          <span class="fact-k">Nota no Google</span>
          <span class="fact-v">${virgula(g.nota)} <span class="fact-star" aria-hidden="true">&#9733;</span></span>
          <span class="fact-s">${esc(g.total)} avaliações</span>
        </a></li>`)}
        ${se(d.destaquePreco, fato(d.destaquePreco?.titulo, esc(d.destaquePreco?.valor), d.destaquePreco?.sub))}
        ${se(d.horarioTexto, fato('Horário', esc(d.horarioTexto.split(',')[0]), d.horarioTexto.split(',').slice(1).join(',').trim(), '<span class="status-horario" data-status-horario hidden></span>'))}
        ${fato('Endereço', esc(d.bairro ? `${d.bairro}, ${d.cidade}` : d.cidade), d.endereco)}
      </ul>
    </div>
  </main>

  <section class="block" id="servicos">
    <div class="wrap trat">
      <div class="trat-head">
        <p class="label">Serviços</p>
        <h2>${esc(d.textos?.servicosTitulo || 'Cuidado para cada necessidade')}</h2>
        <p class="block-intro">${esc(d.textos?.servicosIntro || 'Cada tratamento é escolhido de acordo com o seu objetivo. Na avaliação, a equipe indica o que faz mais sentido pra você.')}</p>
        <a class="btn btn-primary trat-cta" href="${wa}" data-link="whatsapp" target="_blank" rel="noopener">Agendar avaliação</a>
      </div>
      <ul class="svc">
${lista(d.servicos, (s, i) => {
    const id = slug(s.nome);
    return `        <li class="svc-item" id="${id}">
          <button class="svc-toggle" type="button" aria-expanded="${i === 0}" aria-controls="desc-${id}">
            <span class="svc-name">${esc(s.nome)}</span>
            ${se(s.sub, `<span class="svc-sub">${esc(s.sub)}</span>`)}
          </button>
          <div class="svc-desc${i === 0 ? ' open' : ''}" id="desc-${id}"><div class="svc-inner">
            ${se(f.servicos[i], `<img class="svc-img" src="${f.servicos[i]}" width="800" height="500" loading="lazy" decoding="async" alt="${esc(s.nome)}">`)}
            <p>${esc(s.descricao)}</p>
            ${se(s.tags?.length, `<ul class="svc-tags">${lista(s.tags, (t) => `<li>${esc(t)}</li>`)}</ul>`)}
            <a class="btn btn-outline btn-sm svc-cta" href="${wa}" data-link="whatsapp" data-assunto="${esc(s.assunto || s.nome)}" target="_blank" rel="noopener">Quero saber mais</a>
          </div></div>
        </li>`;
  })}
      </ul>
    </div>
  </section>

  <section class="block" id="avaliacao">
    <div class="wrap">
      <h2>Como funciona a avaliação</h2>
      <p class="block-intro">${esc(d.textos?.avaliacaoIntro || 'Nunca fez um procedimento estético? Tudo bem. A avaliação existe para você conhecer o espaço, tirar suas dúvidas e só depois decidir.')}</p>
      <ol class="steps">
${lista(passos, (p, i) => `        <li class="step"><span class="step-num" aria-hidden="true">${i + 1}</span><h3>${esc(p.titulo)}</h3><p>${esc(p.texto)}</p></li>`)}
      </ol>
      <div class="steps-foot">
        <a class="btn btn-primary" href="${wa}" data-link="whatsappAvaliacao" target="_blank" rel="noopener">Agendar avaliação</a>
        <p class="steps-note">Sem compromisso e sem pressão para fechar na hora.</p>
      </div>
    </div>
  </section>
${se(d.outros?.length, `
  <section class="block" id="outros">
    <div class="wrap">
      <h2>${esc(d.textos?.outrosTitulo || 'Corpo, pele e bem-estar')}</h2>
      <p class="block-intro">Toque em um serviço para perguntar sobre ele no WhatsApp.</p>
      <div class="groups">
${lista(d.outros, (grupo) => `        <div class="group">
          <h3 class="group-title">${esc(grupo.titulo)}</h3>
          <ul class="pills">${lista(grupo.itens, (it) => `<li><a href="${wa}" data-link="whatsapp" data-assunto="${esc(it)}" target="_blank" rel="noopener">${esc(it)}</a></li>`)}</ul>
        </div>`)}
      </div>
    </div>
  </section>`)}
${se(f.estrutura || d.diferenciais?.length, `
  <section class="block" id="espaco">
    <div class="wrap">
      <p class="label">Estrutura</p>
      <h2>${esc(d.textos?.espacoTitulo || 'Nosso espaço e diferenciais')}</h2>
      <div class="espaco">
        ${se(f.estrutura, `<figure class="espaco-foto"><img src="${f.estrutura}" loading="lazy" decoding="async" alt="${esc(d.fotos?.estruturaAlt || 'Espaço da ' + d.nome)}">${se(d.fotos?.estruturaLegenda, `<figcaption>${esc(d.fotos?.estruturaLegenda)}</figcaption>`)}</figure>`)}
        ${se(d.diferenciais?.length, `<div class="espaco-why"><h3>Por que escolher a ${esc(d.nomeCurto || d.nome)}</h3><ul class="why-list">${lista(d.diferenciais, (x) => `<li>${esc(x)}</li>`)}</ul></div>`)}
      </div>
    </div>
  </section>`)}
${se(temGaleria, `
  <section class="block" id="fotos">
    <div class="wrap">
      <h2>Conheça o espaço</h2>
      <div class="galeria">
${lista(f.galeria, (src, i) => `        <figure><img src="${src}" loading="lazy" decoding="async" alt="${esc(d.fotos?.galeriaAlt?.[i] || 'Foto do espaço da ' + d.nome)}"></figure>`)}
      </div>
    </div>
  </section>`)}
${se(d.avaliacoes?.length, `
  <section class="block" id="avaliacoes">
    <div class="wrap">
      <h2>O que dizem nossas clientes</h2>
      <p class="block-intro">Avaliações publicadas no Google.</p>
      <ul class="reviews">
${lista(d.avaliacoes, (r, i) => `        <li class="review${i === 0 ? ' review-main' : ''}">
          <blockquote class="review-text" id="rev-${i}">${paragrafos(r.texto)}</blockquote>
          <button class="review-more" type="button" aria-expanded="false" aria-controls="rev-${i}">Ler avaliação completa</button>
          <p class="review-by"><span class="review-stars" role="img" aria-label="${r.estrelas || 5} de 5 estrelas">${estrelas(r.estrelas || 5)}</span> ${esc(r.autor)}</p>
        </li>`)}
      </ul>
      ${se(g.avaliacoesUrl || g.mapaUrl, `<div class="local-actions"><a class="btn btn-outline" href="${esc(g.avaliacoesUrl || g.mapaUrl)}" data-link="avaliacoes" target="_blank" rel="noopener">Ver todas no Google</a></div>`)}
    </div>
  </section>`)}
${se(d.faq?.length, `
  <section class="block" id="duvidas">
    <div class="wrap">
      <p class="label">Dúvidas comuns</p>
      <h2>Respostas rápidas antes de você agendar</h2>
      <div class="faq">
${lista(d.faq, (q) => `        <details class="faq-item"><summary>${esc(q.pergunta)}</summary><p>${esc(q.resposta)}</p></details>`)}
      </div>
    </div>
  </section>`)}

  <section class="block" id="local">
    <div class="wrap local">
      <div class="local-text">
        <h2>${esc(d.endereco)}</h2>
        <ul class="info-list">
          <li><span class="k">Bairro</span><span class="v">${esc([d.bairro, `${d.cidade} - ${d.uf}`].filter(Boolean).join(', '))}</span></li>
          ${se(d.horarioTexto, `<li><span class="k">Horário</span><span class="v">${esc(d.horarioTexto)}<br><span class="status-horario" data-status-horario hidden></span></span></li>`)}
          <li><span class="k">Telefone</span><span class="v"><a href="tel:+${d.whatsapp}">${esc(d.telefone)}</a></span></li>
        </ul>
        <div class="local-actions">
          ${se(g.mapaUrl, `<a class="btn btn-primary" href="${esc(g.mapaUrl)}" data-link="mapa" target="_blank" rel="noopener">Como chegar</a>`)}
          <a class="btn btn-outline" href="${wa}" data-link="whatsappDuvida" target="_blank" rel="noopener">Falar no WhatsApp</a>
        </div>
      </div>
      <div class="map" data-mapa="${mapaEmbed}" data-titulo="${esc(`Mapa com a localização da ${d.nome}`)}">
        ${se(f.fachada, `<img class="map-capa" src="${f.fachada}" loading="lazy" decoding="async" alt="">`)}
        <button class="map-abrir btn btn-primary" type="button">Ver no mapa</button>
        <noscript><iframe src="${mapaEmbed}" title="${esc(`Mapa com a localização da ${d.nome}`)}" loading="lazy" allowfullscreen></iframe></noscript>
      </div>
    </div>
  </section>
${se(insta.length, `
  <section class="block" id="redes">
    <div class="wrap">
      <h2>Acompanhe a ${esc(d.nomeCurto || d.nome)}</h2>
      <ul class="redes-list">
${lista(insta, (i, n) => `        <li><a class="rede" href="https://instagram.com/${esc(i.usuario)}" data-link="instagram${n}" target="_blank" rel="noopener"><span class="rede-net">${esc(i.rotulo || 'Instagram')}</span><span class="rede-handle">@${esc(i.usuario)}</span><span class="rede-arrow" aria-hidden="true">&#8599;</span></a></li>`)}
        <li><a class="rede" href="${wa}" data-link="whatsappDuvida" target="_blank" rel="noopener"><span class="rede-net">WhatsApp</span><span class="rede-handle">${esc(d.telefone)}</span><span class="rede-arrow" aria-hidden="true">&#8599;</span></a></li>
      </ul>
    </div>
  </section>`)}

  <footer>
    <div class="wrap">
      <div class="foot-grid">
        <div>
          <p class="foot-brand">${esc(d.nome)}</p>
          ${se(d.hero?.lead, `<p>${esc(d.hero.lead)}</p>`)}
        </div>
        <ul>
          <li>${esc(d.endereco)}</li>
          <li>${esc([d.bairro, `${d.cidade} - ${d.uf}`].filter(Boolean).join(', '))}</li>
          ${se(d.horarioTexto, `<li>${esc(d.horarioTexto)}</li>`)}
          <li><a href="tel:+${d.whatsapp}">${esc(d.telefone)}</a></li>
        </ul>
        <ul>
${lista(insta, (i, n) => `          <li><a href="https://instagram.com/${esc(i.usuario)}" data-link="instagram${n}" target="_blank" rel="noopener">@${esc(i.usuario)}</a></li>`)}
          <li><a href="${wa}" data-link="whatsappDuvida" target="_blank" rel="noopener">WhatsApp</a></li>
          ${se(g.mapaUrl, `<li><a href="${esc(g.mapaUrl)}" data-link="mapa" target="_blank" rel="noopener">Como chegar</a></li>`)}
        </ul>
      </div>
      <p class="foot-bottom">&copy; ${new Date().getFullYear()} ${esc(d.nome)} · ${esc(d.cidade)}, ${esc(d.uf)} · Site por <a href="https://kodeva.com.br" target="_blank" rel="noopener">KODEVA Studio</a></p>
    </div>
  </footer>

  <a class="wa-float" href="${wa}" data-link="whatsapp" target="_blank" rel="noopener" aria-label="Agendar pelo WhatsApp">
    <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path fill="currentColor" d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.42.25-.7.25-1.29.18-1.41-.08-.13-.27-.2-.57-.35m-5.42 7.4h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.69 1.45h.01c6.55 0 11.89-5.34 11.89-11.89a11.82 11.82 0 0 0-3.48-8.41Z"/></svg>
  </a>

  <script src="js/main.js" defer></script>
</body>
</html>
`;
}

