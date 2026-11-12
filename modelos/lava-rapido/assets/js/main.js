const WHATSAPP = (window.SITE && window.SITE.whatsapp) || "";

  const header = document.querySelector("header");
  const onScroll = () => header.classList.toggle("solid", scrollY > 60);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  const menuBtn = document.querySelector(".menu-btn"), menu = document.getElementById("menu");
  menuBtn.onclick = () => { const open = menu.classList.toggle("open"); menuBtn.setAttribute("aria-expanded", open); header.classList.add("solid"); };
  menu.querySelectorAll("a").forEach(a => a.onclick = () => { menu.classList.remove("open"); menuBtn.setAttribute("aria-expanded", false); });

  const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))), { threshold: .15 });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce) {
    // bolhas de sabão no hero
    const b = document.querySelector(".bubbles");
    for (let i = 0, n = innerWidth < 700 ? 7 : 14; i < n; i++) {
      const s = document.createElement("span"), size = 8 + Math.random() * 34;
      s.style.cssText = `width:${size}px;height:${size}px;left:${Math.random() * 100}%;animation-duration:${9 + Math.random() * 10}s;animation-delay:${-Math.random() * 15}s;--dx:${(Math.random() - .5) * 120}px`;
      b.appendChild(s);
    }
    // parallax suave na foto do resultado
    const img = document.getElementById("parallax");
    if (img) {
    let ticking = false;
    addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const r = img.parentElement.getBoundingClientRect();
        if (r.bottom > 0 && r.top < innerHeight) img.style.transform = `translateY(${(r.top / innerHeight) * -12}%)`;
        ticking = false;
      });
    }, { passive: true });
    }
  }

  document.getElementById("agendar").onsubmit = e => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.target));
    const data = f.data.split("-").reverse().join("/");
    const msg = `Olá! Quero agendar:\n• Nome: ${f.nome}\n• Carro: ${f.carro}\n• Serviço: ${f.servico}\n• Data: ${data}` + (f.obs ? `\n• Obs: ${f.obs}` : "");
    open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
  };
