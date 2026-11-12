// Modelo negocio-local: horário ao vivo, mapa sob demanda, entrada suave e borda do topo.
(function () {
  var SITE = window.SITE || {};
  document.documentElement.classList.add('js');

  // Horário: SITE.horario = { "1": ["09:00","18:00"], ... } (0 = domingo), horário de Brasília
  var DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  var min = function (h) { var p = h.split(':'); return +p[0] * 60 + +p[1]; };
  function status() {
    var h = SITE.horario || {};
    if (!Object.keys(h).length || !window.Intl) return null;
    var partes = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date());
    var pega = function (t) { return partes.find(function (p) { return p.type === t; }).value; };
    var dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(pega('weekday'));
    var agora = +pega('hour') * 60 + +pega('minute');
    var hoje = h[dia];
    if (hoje && agora >= min(hoje[0]) && agora < min(hoje[1])) return { aberto: true, texto: 'Aberto agora, até ' + hoje[1] };
    if (hoje && agora < min(hoje[0])) return { aberto: false, texto: 'Fechado, abre hoje às ' + hoje[0] };
    for (var i = 1; i <= 7; i++) {
      var d = (dia + i) % 7;
      if (h[d]) return { aberto: false, texto: 'Fechado, abre ' + (i === 1 ? 'amanhã' : DIAS[d]) + ' às ' + h[d][0] };
    }
    return null;
  }
  function atualizarStatus() {
    var s; try { s = status(); } catch (e) { return; }
    if (!s) return;
    document.querySelectorAll('[data-status]').forEach(function (el) {
      el.textContent = s.texto; el.classList.toggle('aberto', s.aberto); el.hidden = false;
    });
  }
  atualizarStatus();
  setInterval(atualizarStatus, 60000);

  // Mapa: só carrega o Google Maps quando a pessoa pede
  var mapa = document.querySelector('.map[data-src]');
  if (mapa) {
    mapa.querySelector('button').addEventListener('click', function () {
      var f = document.createElement('iframe');
      f.src = mapa.dataset.src; f.title = mapa.dataset.titulo || 'Mapa'; f.loading = 'lazy';
      f.referrerPolicy = 'no-referrer-when-downgrade'; f.allowFullscreen = true;
      mapa.replaceChildren(f);
    });
  }

  // Borda do topo depois de rolar (sem listener de scroll: sentinela + IntersectionObserver)
  var nav = document.querySelector('.nav');
  var sentinela = document.getElementById('topo');
  if (nav && sentinela && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (e) { nav.classList.toggle('solid', !e[0].isIntersecting); }).observe(sentinela);
  }

  // Entrada suave: cada bloco aparece ao entrar na tela, com pequeno atraso entre irmãos
  var itens = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    itens.forEach(function (el) {
      var irmaos = Array.prototype.filter.call(el.parentElement.children, function (c) { return c.classList.contains('rv'); });
      el.style.setProperty('--d', Math.min(irmaos.indexOf(el), 4) * 0.07 + 's');
      io.observe(el);
    });
  } else {
    itens.forEach(function (el) { el.classList.add('in'); });
  }
})();
