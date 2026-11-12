// Visualizador: carrega demos/<id>/ num iframe e alterna entre tela de computador e de celular.
(() => {
  document.body.classList.add('pg-ver');
  const id = new URLSearchParams(location.search).get('m');
  const m = window.MODELOS[id];
  if (!m) { location.replace('modelos.html'); return; }

  const src = `demos/${id}/`;
  document.title = `${m.nome}, demonstração | KODEVA Studio`;
  document.querySelector('.js-nome').textContent = m.nome;
  document.querySelector('.js-ramo').textContent = m.ramo;
  document.querySelector('.js-frame').src = src;
  document.querySelector('.js-full').href = src;
  document.querySelector('.js-quero').href = m.wa;

  const palco = document.querySelector('.vstage');
  const botoes = [...document.querySelectorAll('.seg button')];
  const modo = (v) => {
    palco.dataset.v = v;
    botoes.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.v === v)));
  };
  botoes.forEach((b) => b.addEventListener('click', () => modo(b.dataset.v)));
})();
