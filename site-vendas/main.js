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

  const calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Faixa de modelos: setas, barra de progresso e arrastar com o mouse (no toque, a rolagem é nativa).
  const rail = document.querySelector('.rail');
  if (rail) {
    const prev = document.querySelector('.js-prev');
    const next = document.querySelector('.js-next');
    const barra = document.querySelector('.js-progress');
    const passo = () => (rail.querySelector('.rail-item')?.offsetWidth || 300) + 20;
    const atualizar = () => {
      const max = rail.scrollWidth - rail.clientWidth;
      const p = max > 0 ? rail.scrollLeft / max : 1;
      if (prev) prev.disabled = rail.scrollLeft < 8;
      if (next) next.disabled = rail.scrollLeft > max - 8;
      if (barra) barra.style.setProperty('--p', (rail.clientWidth / rail.scrollWidth) + p * (1 - rail.clientWidth / rail.scrollWidth));
    };
    const ir = (dir) => rail.scrollBy({ left: dir * passo(), behavior: calmo ? 'auto' : 'smooth' });
    prev?.addEventListener('click', () => ir(-1));
    next?.addEventListener('click', () => ir(1));
    rail.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); ir(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); ir(-1); }
    });
    rail.addEventListener('scroll', () => requestAnimationFrame(atualizar), { passive: true });
    addEventListener('resize', atualizar);
    atualizar();

    let x0 = 0, s0 = 0, moveu = false, ativo = false;
    rail.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      ativo = true; moveu = false; x0 = e.clientX; s0 = rail.scrollLeft;
    });
    addEventListener('pointermove', (e) => {
      if (!ativo) return;
      const dx = e.clientX - x0;
      if (!moveu && Math.abs(dx) > 6) { moveu = true; rail.classList.add('arrastando'); }
      if (moveu) rail.scrollLeft = s0 - dx;
    });
    addEventListener('pointerup', () => {
      if (!ativo) return;
      ativo = false;
      if (moveu) {
        // solta e deixa o snap encaixar o cartão mais próximo
        const alvo = Math.round(rail.scrollLeft / passo()) * passo();
        rail.classList.remove('arrastando');
        rail.scrollTo({ left: alvo, behavior: calmo ? 'auto' : 'smooth' });
      }
    });
  }

  // Luz na borda dos cartões seguindo o cursor
  if (matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.spot').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--x', `${e.clientX - r.left}px`);
        el.style.setProperty('--y', `${e.clientY - r.top}px`);
      });
    });
  }

  // Cascata: cada item de um grupo entra um pouco depois do anterior
  document.querySelectorAll('.steps, .features').forEach((g) => {
    [...g.children].forEach((el, i) => el.style.setProperty('--d', `${i * 90}ms`));
  });

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
