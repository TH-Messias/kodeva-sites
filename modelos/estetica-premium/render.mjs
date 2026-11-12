// Modelo "estetica-premium": derivado do modelo Lumea (React + Vite + Tailwind).
// Clínicas de medicina estética, harmonização, dermatologia, clínicas com equipe.
// Diferente dos outros modelos, este precisa de build: o gerador escreve src/site.json
// numa cópia temporária do app, roda o Vite e copia o resultado para a saída.

import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc, jsonLd, horarioCurto } from '../../gerador/lib.mjs';

const APP = join(dirname(fileURLToPath(import.meta.url)), 'app');

// Claro e escuro: acento, texto sobre o acento e fundo suave do acento.
const PALETAS = {
  floresta: { claro: ['#1f5c4d', '#f3f4f2', '#d6e5df'], escuro: ['#7fc2ac', '#0f1413', '#1c3a32'] },
  vinho: { claro: ['#7a2440', '#f7f2f3', '#f0dbe2'], escuro: ['#e38aa6', '#140f11', '#3a1c26'] },
  areia: { claro: ['#8a5a2b', '#faf6f1', '#f1e3d2'], escuro: ['#e0b483', '#14110e', '#3a2a1a'] },
  grafite: { claro: ['#26292e', '#f3f4f2', '#e1e3e6'], escuro: ['#d6d9de', '#0f1113', '#2a2e33'] },
};

export function validar(d) {
  if (d.paleta && !PALETAS[d.paleta]) throw new Error('paleta inválida: ' + d.paleta + ' (use ' + Object.keys(PALETAS).join(', ') + ')');
}

export const fotos = (d) => ({
  hero: d.fotos?.hero,
  logo: d.fotos?.logo,
  diferenciais: d.fotos?.diferenciais,
  areas: (d.areas?.length ? d.areas : d.servicos).map((a) => a.foto),
  destaques: (d.destaques || []).map((x) => x.foto),
  equipe: (d.equipe || []).map((m) => m.foto),
  galeria: d.fotos?.galeria || [],
});

function garantirDependencias() {
  if (existsSync(join(APP, 'node_modules', '.bin', 'vite'))) return;
  console.log('Instalando dependências do modelo estetica-premium (só na primeira vez)...');
  execFileSync('npm', ['ci', '--no-audit', '--no-fund'], { cwd: APP, stdio: 'inherit' });
}

export async function build({ dados: d, fotos: f }) {
  garantirDependencias();
  const tmp = mkdtempSync(join(tmpdir(), 'kodeva-premium-'));
  try {
    cpSync(APP, tmp, { recursive: true, filter: (src) => !/[\\/](node_modules|dist)([\\/]|$)/.test(src.slice(APP.length)) });
    symlinkSync(join(APP, 'node_modules'), join(tmp, 'node_modules'), 'dir');

    // Dados que o app lê, com os caminhos finais das fotos
    const fonteAreas = d.areas?.length ? 'areas' : 'servicos';
    const site = {
      ...d,
      horarioTexto: d.horarioTexto || horarioCurto(d.horario) || undefined,
      hero: { ...d.hero, foto: f.hero || undefined },
      fotoDiferenciais: f.diferenciais || undefined,
      [fonteAreas]: d[fonteAreas].map((a, i) => ({ ...a, foto: f.areas[i] || undefined })),
      destaques: (d.destaques || []).map((x, i) => ({ ...x, foto: f.destaques[i] || undefined })),
      equipe: (d.equipe || []).map((m, i) => ({ ...m, foto: f.equipe[i] || undefined })),
      galeria: (f.galeria || []).filter(Boolean).map((src, i) => ({ src, alt: d.fotos?.galeriaAlt?.[i] })),
    };
    writeFileSync(join(tmp, 'src', 'site.json'), JSON.stringify(site, null, 2));

    const p = PALETAS[d.paleta || 'floresta'];
    const nomeCurto = d.nomeCurto || d.nome;
    const titulo = d.seo?.titulo || `${d.nome} | Estética em ${d.cidade}`;
    const descricao = d.seo?.descricao || `${d.nome} em ${d.cidade}: ${d.servicos.slice(0, 4).map((s) => s.nome).join(', ')}. Agende sua avaliação pelo WhatsApp.`;
    const base = d.dominio ? `https://${d.dominio}/` : '';
    const inicial = esc(nomeCurto.trim()[0]?.toUpperCase() || 'K');
    const favicon = f.logo || `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="16" fill="${p.claro[0]}"/><text x="16" y="22" font-family="sans-serif" font-size="17" font-weight="600" fill="${p.claro[1]}" text-anchor="middle">${inicial}</text></svg>`)}`;
    const vars = ([a, ink, soft]) => `--accent:${a};--accent-ink:${ink};--accent-soft:${soft}`;

    writeFileSync(join(tmp, 'index.html'), `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="${esc(favicon)}" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(titulo)}</title>
    <meta name="description" content="${esc(descricao)}" />
    ${base ? `<link rel="canonical" href="${base}" />` : ''}
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:title" content="${esc(titulo)}" />
    <meta property="og:description" content="${esc(descricao)}" />
    <meta name="theme-color" content="#f3f4f2" media="(prefers-color-scheme: light)" />
    <meta name="theme-color" content="#0f1413" media="(prefers-color-scheme: dark)" />
    <style>html:root{${vars(p.claro)}}@media (prefers-color-scheme: dark){html:root{${vars(p.escuro)}}}</style>
    <script type="application/ld+json">
${jsonLd(d, d.tipoSchema || 'MedicalClinic')}
    </script>
  </head>
  <body>
    <div id="root"><noscript>${esc(d.nome)} · ${esc(d.endereco)}, ${esc(d.cidade)}/${esc(d.uf)} · WhatsApp ${esc(d.telefone)}</noscript></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`);

    execFileSync(join(APP, 'node_modules', '.bin', 'vite'), ['build', '--base', './', '--outDir', join(tmp, 'dist'), '--logLevel', 'warn'], { cwd: tmp, stdio: 'inherit' });
    const html = readFileSync(join(tmp, 'dist', 'index.html'), 'utf8');
    return { html, extras: join(tmp, 'dist'), limpar: () => rmSync(tmp, { recursive: true, force: true }) };
  } catch (e) {
    rmSync(tmp, { recursive: true, force: true });
    throw e;
  }
}
