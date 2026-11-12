// Modelo "oficina": derivado do modelo Torque Centro Automotivo.
// Oficinas mecânicas, centros automotivos, auto elétricas, funilarias.
import { esc, se, lista, estrelas, json, jsonLd, waLink, mapaUrl, horarioCurto } from '../../gerador/lib.mjs';

// Cores de marca. brand = textos e detalhes, accent = botões. escuro = brand no modo noturno.
const PALETAS = {
  vermelho: { brand: '#b3141c', accent: '#e3202b', escuro: '#ff5a5f' },
  azul: { brand: '#1347a8', accent: '#1f63e3', escuro: '#6f9cff' },
  laranja: { brand: '#b4520a', accent: '#ef6c00', escuro: '#ffa04d' },
  verde: { brand: '#1d6b3a', accent: '#23934c', escuro: '#5ccf8a' },
  amarelo: { brand: '#8a6a00', accent: '#e0a800', escuro: '#ffd24d', onAccent: '#151214' },
};

// Ícones disponíveis (símbolos no SVG do topo). O serviço pode escolher com "icone";
// sem isso, o modelo adivinha pelo nome.
const ICONES = {
  oil: /óleo|oleo|filtro|lubrifica/i,
  belt: /correia|tensor/i,
  brake: /freio|pastilha|disco/i,
  susp: /suspens|amortec|bucha/i,
  tire: /pneu|alinha|balancea|geometria|roda/i,
  chip: /injeç|injec|scanner|diagn|eletr[oô]nic/i,
  bolt: /elétric|eletric|bateria|alternador|farol/i,
  gear: /câmbio|cambio|embreag|transmiss/i,
  snow: /ar.condicionado|climatiza|ar-cond/i,
  shield: /garantia|seguran/i,
  doc: /orçamento|orcamento|nota|document/i,
  award: /experi|anos|certific|premi/i,
  cup: /café|cafe|espera|wi-?fi|conforto/i,
};
const iconeDe = (item, padrao = 'gear') => item.icone
  || Object.entries(ICONES).find(([, re]) => re.test(`${item.nome || item.titulo} ${item.descricao || item.texto || ''}`))?.[0]
  || padrao;

const MARCAS = ['Chevrolet', 'Volkswagen', 'Fiat', 'Toyota', 'Honda', 'Hyundai', 'Renault', 'Jeep', 'Nissan', 'Ford', 'Peugeot', 'BMW', 'Audi', 'Mercedes-Benz'];

const PASSOS_PADRAO = [
  { titulo: 'Agende', texto: 'Mande o modelo e a quilometragem no WhatsApp e escolha o horário.' },
  { titulo: 'Diagnóstico', texto: 'O carro passa por uma inspeção para encontrar a causa do problema.' },
  { titulo: 'Aprovação', texto: 'Você recebe o orçamento e aprova só o que quiser.' },
  { titulo: 'Entrega', texto: 'Carro pronto no prazo combinado, com nota do serviço.' },
];

export function validar(d) {
  if (d.paleta && !PALETAS[d.paleta]) throw new Error('paleta inválida: ' + d.paleta + ' (use ' + Object.keys(PALETAS).join(', ') + ')');
}

export const fotos = (d) => ({ hero: d.fotos?.hero, logo: d.fotos?.logo });

// Divide o nome para o logo em texto: última palavra em destaque ("Tor<b>que</b>" no original)
function logoTexto(d) {
  const nome = d.nomeCurto || d.nome;
  const partes = nome.split(' ');
  if (partes.length === 1) {
    const meio = Math.ceil(nome.length / 2);
    return `${esc(nome.slice(0, meio))}<b>${esc(nome.slice(meio))}</b>`;
  }
  return `${esc(partes.slice(0, -1).join(' '))} <b>${esc(partes.at(-1))}</b>`;
}

export function render(d, f) {
  const p = PALETAS[d.paleta || 'vermelho'];
  const msg = d.mensagemWhatsapp || 'Olá! Vim pelo site e quero agendar um serviço.';
  const wa = esc(waLink(d, msg));
  const tel = `tel:+${d.whatsapp}`;
  const titulo = d.seo?.titulo || `${d.nome} · Oficina mecânica em ${d.cidade}`;
  const descricao = d.seo?.descricao || `Oficina mecânica em ${d.cidade}. ${d.servicos.slice(0, 4).map((s) => s.nome).join(', ')}. Agende pelo WhatsApp.`;
  const base = d.dominio ? `https://${d.dominio}/` : '';
  const horario = d.horarioTexto || horarioCurto(d.horario);
  const marcas = d.marcas === false ? [] : (d.marcas || MARCAS);
  const passos = d.passos?.length ? d.passos : PASSOS_PADRAO;
  const segmento = d.segmento || 'Centro Automotivo';
  const nomeCurto = d.nomeCurto || d.nome;
  const mapa = esc(mapaUrl(d));
  const hero = d.hero || {};

  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(descricao)}">
<meta property="og:title" content="${esc(titulo)}">
<meta property="og:description" content="${esc(descricao)}">
<meta property="og:type" content="website">
${se(base, `<meta property="og:url" content="${base}">\n<link rel="canonical" href="${base}">`)}
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0d0b0c">
<link rel="icon" href="${f.logo || 'img/favicon.svg'}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700&family=Barlow:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap">
<script type="application/ld+json">
${jsonLd(d, 'AutoRepair')}
</script>
<link rel="stylesheet" href="css/style.css">
<style>:root{--brand:${p.brand};--accent:${p.accent};${p.onAccent ? `--on-accent:${p.onAccent};` : ''}}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--brand:${p.escuro}}}:root[data-theme="dark"]{--brand:${p.escuro}}</style>
<script>window.SITE=${json({ whatsapp: d.whatsapp })};</script>

<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <symbol id="i-wa" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M3.5 20.5l1.3-4.2A8.5 8.5 0 1 1 8 19.4z"/><path fill="currentColor" d="M9 8.2c.2-.4.6-.4.8-.4h.5c.2 0 .4 0 .5.4l.6 1.5c.1.2 0 .4-.1.6l-.5.6c.6 1.1 1.5 2 2.6 2.6l.6-.6c.2-.2.4-.2.6-.1l1.5.7c.3.1.4.3.3.6-.2.9-1 1.5-1.9 1.5-2.9-.2-5.6-2.9-5.8-5.8 0-.6.1-1.2.3-1.6z"/></symbol>
  <symbol id="i-phone" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z"/></symbol>
  <symbol id="i-clock" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></g></symbol>
  <symbol id="i-pin" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></g></symbol>
  <symbol id="i-oil" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" d="M12 3s-6 7-6 11a6 6 0 0 0 12 0c0-4-6-11-6-11z"/></symbol>
  <symbol id="i-belt" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2"><circle cx="7" cy="12" r="3.5"/><circle cx="17" cy="12" r="3.5"/><path d="M7 8.5h10M7 15.5h10"/></g></symbol>
  <symbol id="i-brake" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M4.5 7.5A9 9 0 0 1 9 3.6" stroke-linecap="round"/></g></symbol>
  <symbol id="i-susp" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M12 2v3M12 19v3M8 5h8M8 19h8M9 7l6 2-6 2 6 2-6 2 6 2"/></symbol>
  <symbol id="i-tire" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M12 3v5M12 16v5M3 12h5M16 12h5"/></g></symbol>
  <symbol id="i-chip" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="6" width="12" height="12" rx="1"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/></g></symbol>
  <symbol id="i-bolt" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" d="M13 2L4 14h7l-1 8 9-12h-7z"/></symbol>
  <symbol id="i-gear" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="6" cy="5" r="2"/><circle cx="12" cy="5" r="2"/><circle cx="18" cy="5" r="2"/><circle cx="6" cy="19" r="2"/><circle cx="12" cy="19" r="2"/><path d="M6 7v10M12 7v10M18 7v5H6"/></g></symbol>
  <symbol id="i-snow" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7M9 4l3 2 3-2M9 20l3-2 3 2"/></symbol>
  <symbol id="i-shield" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM8.5 12l2.5 2.5 4.5-5"/></symbol>
  <symbol id="i-cup" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" d="M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM16 10h2a2.5 2.5 0 0 1 0 5h-2M8 3v3M12 3v3"/></symbol>
  <symbol id="i-doc" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" d="M6 2h9l4 4v16H6zM9 11h7M9 15h7M9 19h4"/></symbol>
  <symbol id="i-award" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><circle cx="12" cy="9" r="6"/><path d="M8.5 14L7 22l5-3 5 3-1.5-8"/></g></symbol>
</svg>
</head>
<body>

<a class="skip" href="#servicos">Pular para o conteúdo</a>
<header class="nav"><div class="wrap">
  <nav aria-label="Principal">
    <ul class="nl">
      <li><a href="#topo" aria-current="page">Início</a></li>
      <li><a href="#servicos">Serviços</a></li>
      ${se(d.diferenciais?.length, '<li><a href="#diferenciais">Diferenciais</a></li>')}
    </ul>
    <a class="logo" href="#topo" aria-label="${esc(d.nome)}, início">
      ${f.logo ? `<img src="${f.logo}" height="40" alt="">` : `<svg width="34" height="34" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="none" stroke="var(--accent)" stroke-width="2"/><path d="M12 7v5l4 3" stroke="var(--band-ink)" stroke-width="2.2" stroke-linecap="round" fill="none"/></svg>`}
      <span>${logoTexto(d)}<small>${esc(segmento)}</small></span>
    </a>
    <ul class="nr">
      <li><a href="#como-funciona">Como funciona</a></li>
      <li><a href="#contato">Contato</a></li>
      <li><a href="${wa}" target="_blank" rel="noopener"><svg width="15" height="15"><use href="#i-wa"/></svg>WhatsApp</a></li>
    </ul>
  </nav>
  <a class="btn btn-accent call" href="${tel}"><svg width="18" height="18"><use href="#i-phone"/></svg>Ligar</a>
</div></header>

<main id="topo">
<section class="hero">
  <div class="hero-car" aria-hidden="true"${f.hero ? ` style="background-image:url('${f.hero}')"` : ''}></div>
  <div class="wrap"><div class="hero-text">
    ${se(hero.chamada, `<p class="kicker">${esc(hero.chamada)}</p>`)}
    <h1>${esc(hero.titulo || `Oficina mecânica em ${d.cidade}`)}</h1>
    ${se(hero.lead, `<p class="lead">${esc(hero.lead)}</p>`)}
    <div class="ctas">
      <a class="btn btn-wa" href="${wa}" target="_blank" rel="noopener"><svg width="20" height="20"><use href="#i-wa"/></svg>Agendar no WhatsApp</a>
      <a class="btn btn-ghost" href="${tel}"><svg width="18" height="18"><use href="#i-phone"/></svg>${esc(d.telefone)}</a>
    </div>
  </div></div>
${se(marcas.length, `
  <div class="hero-brands">
    <p class="sr">Atendemos as marcas: ${esc(marcas.join(', '))}</p>
    <ul>
      ${marcas.map((m) => `<li>${esc(m)}</li>`).join('')}
      ${marcas.map((m) => `<li aria-hidden="true">${esc(m)}</li>`).join('')}
    </ul>
  </div>`)}
</section>

<section class="sec" id="servicos"><div class="wrap">
  <div class="sec-head rv">
    <p class="eyebrow">${esc(d.textos?.servicosChamada || 'Serviços')}</p>
    <h2>${esc(d.textos?.servicosTitulo || 'O que a gente faz no seu carro')}</h2>
    ${se(d.textos?.servicosIntro, `<p>${esc(d.textos?.servicosIntro)}</p>`)}
  </div>
  <div class="checks">
${lista(d.servicos, (s) => `    <article class="check rv"><div class="ico"><svg width="24" height="24"><use href="#i-${iconeDe(s)}"/></svg></div><h3>${esc(s.nome)}</h3>${se(s.descricao, `<p>${esc(s.descricao)}</p>`)}${se(s.quando, `<p class="when"><span>Recomendação:</span> ${esc(s.quando)}</p>`)}${se(s.sub && !s.quando, `<p class="when">${esc(s.sub)}</p>`)}</article>`)}
  </div>
</div></section>
${se(d.diferenciais?.length, `
<section class="sec why" id="diferenciais"><div class="wrap">
  <div class="sec-head rv">
    <p class="eyebrow">Por que a ${esc(nomeCurto)}</p>
    <h2>${esc(d.textos?.diferenciaisTitulo || 'Oficina de confiança, conversa direta')}</h2>
    ${se(d.textos?.diferenciaisIntro, `<p>${esc(d.textos?.diferenciaisIntro)}</p>`)}
  </div>
  <div class="feats">
${lista(d.diferenciais, (x) => {
    const it = typeof x === 'string' ? { titulo: x } : x;
    return `    <div class="feat rv"><svg width="30" height="30"><use href="#i-${iconeDe(it, 'shield')}"/></svg><h3>${esc(it.titulo)}</h3>${se(it.texto, `<p>${esc(it.texto)}</p>`)}</div>`;
  })}
  </div>
</div></section>`)}

<section class="sec" id="como-funciona"><div class="wrap">
  <div class="sec-head rv">
    <p class="eyebrow">Como funciona</p>
    <h2>Da mensagem à entrega</h2>
  </div>
  <ol class="steps">
${lista(passos, (s) => `    <li class="rv"><h3>${esc(s.titulo)}</h3><p>${esc(s.texto)}</p></li>`)}
  </ol>
</div></section>
${se(d.avaliacoes?.length, `
<section class="sec sec-tight"><div class="wrap">
  <div class="sec-head rv">
    <p class="eyebrow">Clientes${se(d.google?.nota, ` · ${String(d.google?.nota).replace('.', ',')} ★ no Google`)}</p>
    <h2>Quem já confia na ${esc(nomeCurto)}</h2>
  </div>
  <div class="quotes">
${lista(d.avaliacoes, (r) => `    <figure class="quote rv"><div><div class="stars" aria-label="${r.estrelas || 5} de 5 estrelas">${estrelas(r.estrelas || 5)}</div><blockquote>${esc(r.texto)}</blockquote></div><figcaption><b>${esc(r.autor)}</b>${esc(r.detalhe || 'Avaliação no Google')}</figcaption></figure>`)}
  </div>
</div></section>`)}

<section class="banner"><div class="wrap">
  <div><h2>${esc(d.textos?.bannerTitulo || 'Buscando oficina de confiança?')}</h2><p>${esc(d.textos?.bannerTexto || 'Chame no WhatsApp e receba o orçamento antes de qualquer serviço.')}</p></div>
  <a class="btn btn-dark" href="${wa}" target="_blank" rel="noopener"><svg width="20" height="20"><use href="#i-wa"/></svg>Falar no WhatsApp</a>
</div></section>

<section class="sec" id="contato"><div class="wrap contact">
  <div class="info">
    <div class="sec-head flush"><p class="eyebrow">Contato</p><h2>Fale com a ${esc(nomeCurto)}</h2></div>
    <div><svg width="22" height="22"><use href="#i-wa"/></svg><p><b>WhatsApp</b><span class="sel">${esc(d.telefone)}</span></p></div>
    ${se(d.telefoneFixo, `<div><svg width="22" height="22"><use href="#i-phone"/></svg><p><b>Telefone</b><span class="sel">${esc(d.telefoneFixo)}</span></p></div>`)}
    <div><svg width="22" height="22"><use href="#i-pin"/></svg><p><b>Endereço</b><span>${esc(d.endereco)}${se(d.bairro, `, ${esc(d.bairro)}`)} · ${esc(d.cidade)}/${esc(d.uf)}</span><br><a href="${mapa}" target="_blank" rel="noopener">Abrir no Google Maps</a></p></div>
    ${se(horario, `<div><svg width="22" height="22"><use href="#i-clock"/></svg><p><b>Horário</b><span>${esc(horario)}</span></p></div>`)}
  </div>

  <form id="agendar" novalidate>
    <h3>Pedir orçamento</h3>
    <div class="row">
      <label for="f-nome">Nome<input id="f-nome" name="nome" autocomplete="name" required></label>
      <label for="f-tel">Telefone<input id="f-tel" name="tel" type="tel" autocomplete="tel" inputmode="tel" placeholder="(00) 00000-0000" required></label>
    </div>
    <div class="row">
      <label for="f-carro">Carro e ano<input id="f-carro" name="carro" placeholder="Ex.: Onix 2021"></label>
      <label for="f-km">Quilometragem<input id="f-km" name="km" inputmode="numeric" placeholder="Ex.: 48.000"></label>
    </div>
    <label for="f-serv">Serviço<select id="f-serv" name="serv">${d.servicos.map((s) => `<option>${esc(s.nome)}</option>`).join('')}<option>Outro / não sei</option></select></label>
    <label for="f-msg">O que está acontecendo?<textarea id="f-msg" name="msg" placeholder="Ex.: barulho na roda dianteira ao frear"></textarea></label>
    <button class="btn btn-wa" type="submit"><svg width="20" height="20"><use href="#i-wa"/></svg>Enviar pelo WhatsApp</button>
    <p id="wa-out" role="status"></p>
  </form>
</div></section>
</main>

<footer class="site"><div class="wrap">
  <div><h4>${esc(d.nome)}</h4>${se(d.descricaoCurta || hero.lead, `<p>${esc(d.descricaoCurta || hero.lead)}</p>`)}</div>
  <div><h4>Navegue</h4><ul><li><a href="#servicos">Serviços</a></li>${se(d.diferenciais?.length, '<li><a href="#diferenciais">Diferenciais</a></li>')}<li><a href="#como-funciona">Como funciona</a></li><li><a href="#contato">Contato</a></li></ul></div>
  <div><h4>Contato</h4><ul><li>${esc(d.telefone)}</li><li>${esc(d.endereco)} · ${esc(d.cidade)}/${esc(d.uf)}</li>${lista(d.instagram, (i) => `<li><a href="https://instagram.com/${esc(i.usuario)}" target="_blank" rel="noopener">Instagram @${esc(i.usuario)}</a></li>`)}</ul></div>
  <p class="legal">© ${new Date().getFullYear()} ${esc(d.nome)}${se(d.cnpj, ` · CNPJ ${esc(d.cnpj)}`)} · Site por <a href="https://kodeva.com.br" target="_blank" rel="noopener">KODEVA Studio</a></p>
</div></footer>

<a class="float" href="${wa}" target="_blank" rel="noopener" aria-label="Falar no WhatsApp"><svg width="30" height="30"><use href="#i-wa"/></svg></a>

<script src="js/main.js" defer></script>
</body>
</html>
`;
}
