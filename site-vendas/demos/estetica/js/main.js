// Dados do negócio: o gerador injeta window.SITE no <head> de cada site.
const SITE = window.SITE || {};
const WHATSAPP = 'https://wa.me/' + (SITE.whatsapp || '');
const LINKS = SITE.links || {};
const NOME = SITE.nome || '';

// Mensagens prontas do WhatsApp, por tipo de botão (data-link).
// "geral": botões comuns. "sobre": quando o botão ou a página (body) tem data-assunto.
const MENSAGENS = {
  whatsapp: {
    geral: `Olá! Vim pelo site da ${NOME} e gostaria de mais informações.`,
    sobre: (assunto) => `Olá! Vim pelo site e gostaria de mais informações sobre ${assunto}.`,
  },
  whatsappDuvida: {
    geral: `Olá! Vim pelo site da ${NOME} e gostaria de tirar uma dúvida.`,
    sobre: (assunto) => `Olá! Li sobre ${assunto} no site e fiquei com uma dúvida.`,
  },
  whatsappAvaliacao: {
    geral: 'Olá! Vim pelo site e gostaria de agendar uma avaliação.',
    sobre: (assunto) => `Olá! Li sobre ${assunto} no site e gostaria de agendar uma avaliação.`,
  },
};

// Monta o endereço final do botão: link comum ou WhatsApp com mensagem
function urlDoBotao(botao) {
  const tipo = botao.dataset.link;
  const mensagem = MENSAGENS[tipo];
  if (!mensagem) return LINKS[tipo];
  const assunto = botao.dataset.assunto || document.body.dataset.assunto;
  const texto = assunto ? mensagem.sobre(assunto) : mensagem.geral;
  return WHATSAPP + '?text=' + encodeURIComponent(texto);
}

// Liga todo elemento com data-link ao canal correspondente
function ligarBotoes() {
  document.querySelectorAll('[data-link]').forEach((botao) => {
    const url = urlDoBotao(botao);
    if (!url) return;
    botao.href = url;
    botao.addEventListener('click', (evento) => {
      evento.preventDefault();
      window.open(url, '_blank', 'noopener');
    });
  });
}

// Abre e fecha a descrição de cada serviço ao clicar
function ligarServicos() {
  document.querySelectorAll('.svc-toggle').forEach((botao) => {
    botao.addEventListener('click', () => {
      const estavaAberto = botao.getAttribute('aria-expanded') === 'true';
      botao.setAttribute('aria-expanded', String(!estavaAberto));
      document.getElementById(botao.getAttribute('aria-controls')).classList.toggle('open', !estavaAberto);
    });
  });
}

// Abre o tratamento indicado no endereço (ex.: index.html#hifu, vindo dos posts)
function abrirServicoDoEndereco() {
  const id = decodeURIComponent(location.hash.slice(1));
  const item = id && document.getElementById(id);
  if (!item || !item.classList.contains('svc-item')) return;
  const botao = item.querySelector('.svc-toggle');
  if (botao.getAttribute('aria-expanded') !== 'true') botao.click();
}

// Avaliações: mostra o começo e abre o texto completo no botão.
// O botão some quando o texto inteiro já cabe no espaço.
function ligarAvaliacoes() {
  const conferir = () => {
    document.querySelectorAll('.review').forEach((review) => {
      const texto = review.querySelector('.review-text');
      const botao = review.querySelector('.review-more');
      if (!texto || !botao || review.classList.contains('aberta')) return;
      botao.hidden = texto.scrollHeight <= texto.clientHeight + 2;
      texto.style.webkitMaskImage = texto.style.maskImage = botao.hidden ? 'none' : '';
    });
  };

  document.querySelectorAll('.review-more').forEach((botao) => {
    botao.addEventListener('click', () => {
      const review = botao.closest('.review');
      const aberta = review.classList.toggle('aberta');
      botao.setAttribute('aria-expanded', String(aberta));
      botao.textContent = aberta ? 'Mostrar menos' : 'Ler avaliação completa';
    });
  });

  conferir();
  if (document.fonts) document.fonts.ready.then(conferir);
  window.addEventListener('resize', conferir, { passive: true });
}

// Mapa: troca a capa pelo Google Maps só quando a pessoa pede
function ligarMapa() {
  const mapa = document.querySelector('.map[data-mapa]');
  if (!mapa) return;
  mapa.querySelector('.map-abrir').addEventListener('click', () => {
    const quadro = document.createElement('iframe');
    quadro.src = mapa.dataset.mapa;
    quadro.title = mapa.dataset.titulo || 'Mapa';
    quadro.referrerPolicy = 'no-referrer-when-downgrade';
    quadro.allowFullscreen = true;
    mapa.replaceChildren(quadro);
  });
}

// Tour em vídeo: botão grande de play, capítulos que pulam para o trecho
// e pausa automática quando o vídeo sai da tela
function ligarTour() {
  const video = document.querySelector('.tour-video');
  if (!video) return;
  const play = document.querySelector('.tour-play');
  const capitulos = [...document.querySelectorAll('.tour-caps [data-tempo]')];

  const ir = (tempo) => {
    // Com preload="none" o vídeo ainda não carregou: espera os metadados para pular
    if (video.readyState) video.currentTime = tempo;
    else video.addEventListener('loadedmetadata', () => { video.currentTime = tempo; }, { once: true });
    video.play().catch(() => {});
  };

  // Antes do play só aparece o botão grande; os controles nativos entram depois
  video.controls = false;
  play.hidden = false;
  play.addEventListener('click', () => ir(video.currentTime));
  video.addEventListener('play', () => { play.hidden = true; video.controls = true; });

  capitulos.forEach((botao) => botao.addEventListener('click', () => {
    ir(Number(botao.dataset.tempo));
    // No celular o vídeo fica abaixo do texto: leva a pessoa até ele
    const caixa = video.getBoundingClientRect();
    if (caixa.top < 0 || caixa.bottom > innerHeight) video.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }));

  video.addEventListener('timeupdate', () => {
    const atual = capitulos.filter((b) => Number(b.dataset.tempo) <= video.currentTime + 0.25).pop();
    capitulos.forEach((b) => b.setAttribute('aria-current', String(b === atual)));
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entrada]) => {
      if (!entrada.isIntersecting && !video.paused) video.pause();
    }, { threshold: 0.25 }).observe(video);
  }
}

// Horário de funcionamento por dia (0 = domingo), em minutos, horário de Brasília.
// SITE.horario = { "1": ["09:00","20:00"], ... }. Dia ausente = fechado.
// Feriados não entram na conta.
const NOMES_DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
const minutos = (hhmm) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };

function statusHorario(agora) {
  const horario = SITE.horario || {};
  if (!Object.keys(horario).length) return null;
  const partes = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23',
  }).formatToParts(agora);
  const pegar = (tipo) => partes.find((p) => p.type === tipo).value;
  const dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(pegar('weekday'));
  const agoraMin = Number(pegar('hour')) * 60 + Number(pegar('minute'));
  const hoje = horario[dia];

  if (hoje && agoraMin >= minutos(hoje[0]) && agoraMin < minutos(hoje[1])) {
    return { aberto: true, texto: `Aberto agora, até ${hoje[1]}` };
  }
  if (hoje && agoraMin < minutos(hoje[0])) {
    return { aberto: false, texto: `Fechado, abre hoje às ${hoje[0]}` };
  }
  for (let i = 1; i <= 7; i++) {
    const proximo = (dia + i) % 7;
    if (horario[proximo]) {
      const quando = i === 1 ? 'amanhã' : NOMES_DIAS[proximo];
      return { aberto: false, texto: `Fechado, abre ${quando} às ${horario[proximo][0]}` };
    }
  }
  return null;
}

function ligarHorario() {
  const selos = document.querySelectorAll('[data-status-horario]');
  if (!selos.length || !window.Intl) return;
  const atualizar = () => {
    let status;
    try { status = statusHorario(new Date()); } catch (e) { return; }
    if (!status) return;
    selos.forEach((selo) => {
      selo.textContent = status.texto;
      selo.classList.toggle('aberto', status.aberto);
      selo.hidden = false;
    });
  };
  atualizar();
  setInterval(atualizar, 60 * 1000);
}

// Alterna entre modo diurno e noturno, e lembra a escolha
function ligarTema() {
  const botao = document.querySelector('.theme-toggle');
  if (!botao) return;
  const raiz = document.documentElement;

  const barra = document.querySelector('meta[name="theme-color"]');
  const atualizarRotulo = () => {
    const escuro = raiz.dataset.theme === 'dark';
    botao.setAttribute('aria-label', escuro ? 'Ativar modo diurno' : 'Ativar modo noturno');
    // Barra do navegador no celular acompanha o tema
    if (barra) barra.content = getComputedStyle(raiz).getPropertyValue('--canvas').trim() || barra.content;
  };
  atualizarRotulo();

  botao.addEventListener('click', () => {
    raiz.classList.add('theme-anim');
    raiz.dataset.theme = raiz.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('tema', raiz.dataset.theme); } catch (e) {}
    atualizarRotulo();
    setTimeout(() => raiz.classList.remove('theme-anim'), 500);
  });
}

// Faz cada seção surgir suavemente quando entra na tela
function ligarRevelar() {
  const calmo = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (calmo || !('IntersectionObserver' in window)) return;

  const secoes = document.querySelectorAll('.block > .wrap, .article > .wrap');
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;
      const secao = entrada.target;
      secao.classList.add('in');
      observador.unobserve(secao);
      // Depois da animação, devolve as transições originais (hover dos cards)
      setTimeout(() => secao.classList.remove('reveal', 'in'), 1300);
    });
  }, { threshold: 0, rootMargin: '0px 0px -80px 0px' });

  secoes.forEach((secao) => {
    secao.classList.add('reveal');
    observador.observe(secao);
  });
}

// Efeito de onda no ponto onde o botão foi tocado
function ligarOndas() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.addEventListener('pointerdown', (evento) => {
    const botao = evento.target.closest('.btn');
    if (!botao) return;
    const caixa = botao.getBoundingClientRect();
    const tamanho = Math.max(caixa.width, caixa.height) * 2;
    const onda = document.createElement('span');
    onda.className = 'onda';
    onda.style.width = onda.style.height = tamanho + 'px';
    onda.style.left = (evento.clientX - caixa.left - tamanho / 2) + 'px';
    onda.style.top = (evento.clientY - caixa.top - tamanho / 2) + 'px';
    botao.appendChild(onda);
    onda.addEventListener('animationend', () => onda.remove());
  }, { passive: true });
}

// Celular e tablet: cria o botão "Menu" que abre o painel com todas as seções
function ligarMenu() {
  const nav = document.querySelector('.nav');
  const wrap = nav && nav.querySelector('.wrap');
  const lista = nav && nav.querySelector('.nav-links');
  if (!wrap || !lista) return;

  lista.id = lista.id || 'menu-secoes';
  const botao = document.createElement('button');
  botao.type = 'button';
  botao.className = 'menu-toggle';
  botao.setAttribute('aria-controls', lista.id);
  botao.innerHTML = '<span aria-hidden="true"></span>';
  wrap.prepend(botao);

  // Botão de agendar também dentro do painel (no celular ele some do topo)
  const agendar = nav.querySelector('.nav-cta .btn');
  if (agendar) {
    const item = document.createElement('li');
    item.className = 'menu-cta';
    const copia = agendar.cloneNode(true);
    copia.classList.remove('btn-sm');
    copia.textContent = 'Agendar avaliação';
    item.appendChild(copia); // o clique é ligado depois por ligarBotoes()
    lista.appendChild(item);
  }

  const definir = (aberto) => {
    nav.classList.toggle('menu-aberto', aberto);
    botao.setAttribute('aria-expanded', String(aberto));
    botao.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
  };
  definir(false);
  nav.classList.add('js-menu');

  botao.addEventListener('click', () => definir(!nav.classList.contains('menu-aberto')));
  lista.addEventListener('click', (evento) => { if (evento.target.closest('a')) definir(false); });
  document.addEventListener('click', (evento) => { if (!nav.contains(evento.target)) definir(false); });
  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && nav.classList.contains('menu-aberto')) { definir(false); botao.focus(); }
  });
  window.matchMedia('(min-width: 1024px)').addEventListener('change', () => definir(false));
}

// Mostra setas no menu do celular quando há itens escondidos para os lados
function ligarSetasMenu() {
  const nav = document.querySelector('.nav');
  const lista = document.querySelector('.nav-links');
  if (!nav || !lista) return;

  const atualizar = () => {
    const resto = lista.scrollWidth - lista.clientWidth - lista.scrollLeft;
    nav.classList.toggle('mais-direita', resto > 4);
    nav.classList.toggle('mais-esquerda', lista.scrollLeft > 4);
  };
  lista.addEventListener('scroll', atualizar, { passive: true });
  window.addEventListener('resize', atualizar, { passive: true });
  if (document.fonts) document.fonts.ready.then(atualizar);
  atualizar();
}

document.addEventListener('DOMContentLoaded', () => {
  ligarMenu();
  ligarBotoes();
  ligarServicos();
  ligarAvaliacoes();
  ligarMapa();
  ligarTour();
  ligarHorario();
  abrirServicoDoEndereco();
  window.addEventListener('hashchange', abrirServicoDoEndereco);
  ligarTema();
  ligarRevelar();
  ligarOndas();
  ligarSetasMenu();
});
