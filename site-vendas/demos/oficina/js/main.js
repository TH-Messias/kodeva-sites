document.documentElement.classList.add("js");
const io = "IntersectionObserver" in window && new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
document.querySelectorAll(".rv").forEach(el => { const sib = [...el.parentElement.children].filter(c => c.classList.contains("rv")); el.style.setProperty("--d", Math.min(sib.indexOf(el), 5) * 0.07 + "s"); io ? io.observe(el) : el.classList.add("in"); });
const WA = (window.SITE && window.SITE.whatsapp) || "";
document.getElementById("agendar").addEventListener("submit", e => {
  e.preventDefault();
  const f = e.target, out = document.getElementById("wa-out");
  f.nome.setAttribute("aria-invalid", !f.nome.value.trim()); f.tel.setAttribute("aria-invalid", !f.tel.value.trim());
  if (!f.nome.value.trim() || !f.tel.value.trim()) { out.textContent = "Preencha nome e telefone para enviar."; (f.nome.value.trim() ? f.tel : f.nome).focus(); return; }
  const txt = `Olá! Sou ${f.nome.value.trim()} (${f.tel.value.trim()}).\nCarro: ${f.carro.value || "-"} · ${f.km.value || "-"} km\nServiço: ${f.serv.value}\n${f.msg.value}`;
  const url = `https://wa.me/${WA}?text=${encodeURIComponent(txt)}`;
  out.innerHTML = "";
  const a = Object.assign(document.createElement("a"), { href: url, target: "_blank", rel: "noopener", textContent: "Abrir conversa no WhatsApp com sua mensagem" });
  out.append("Mensagem pronta. ", a);
  window.open(url, "_blank", "noopener");
});
