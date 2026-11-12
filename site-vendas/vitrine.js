// Filtro por ramo da vitrine. Sem JS, todos os modelos aparecem.
(() => {
  const chips = [...document.querySelectorAll('.chip')];
  const cards = [...document.querySelectorAll('.vcard')];
  const aplicar = (f) => {
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.f === f)));
    cards.forEach((c) => { c.hidden = f !== 'todos' && c.dataset.f !== f; });
  };
  chips.forEach((c) => c.addEventListener('click', () => {
    aplicar(c.dataset.f);
    history.replaceState(null, '', c.dataset.f === 'todos' ? location.pathname : `#${c.dataset.f}`);
  }));
  const inicial = location.hash.slice(1);
  if (chips.some((c) => c.dataset.f === inicial)) aplicar(inicial);
})();
