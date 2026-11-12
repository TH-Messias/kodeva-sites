// KODEVA, página de venda. Sem dependências.
(() => {
  const WHATSAPP = '5511941066262';
  document.documentElement.classList.add('js');

  // Mensagem do WhatsApp já pede o que a prévia precisa. Nos cartões de modelo, já diz o ramo.
  const msg = (ramo) => [
    'Olá! Quero ver a prévia do site do meu negócio.',
    ramo && ramo !== 'geral' ? `Modelo: ${ramo}` : null,
    'Nome do negócio: ',
    'Link do Google: ',
  ].filter(Boolean).join('\n');
  document.querySelectorAll('.js-wa').forEach((a) => {
    a.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg(a.dataset.msg))}`;
  });

  const ano = document.querySelector('.js-ano');
  if (ano) ano.textContent = new Date().getFullYear();

  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));
    return;
  }

  // Borda do topo e botão flutuante aparecem depois que o topo sai da tela.
  const topbar = document.querySelector('.topbar');
  const flutuante = document.querySelector('.wa-float');
  const hero = document.querySelector('.hero');
  new IntersectionObserver(([e]) => {
    topbar.classList.toggle('rolou', !e.isIntersecting);
  }).observe(document.getElementById('topo'));
  if (hero) {
    new IntersectionObserver(([e]) => {
      flutuante.classList.toggle('on', !e.isIntersecting);
    }, { threshold: 0 }).observe(hero);
  } else if (flutuante) flutuante.classList.add('on');

  const io = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
})();
