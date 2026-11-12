#!/usr/bin/env node
// Gera um site estático a partir de um modelo e de um JSON de dados do negócio.
//
//   node gerador/gerar.mjs <modelo> <dados.json> <pasta-de-saida> [--previa] [--expira 19/11/2026]
//
// Modelos disponíveis: pastas em modelos/ que tenham render.mjs.
// As fotos citadas no JSON são caminhos relativos ao próprio JSON.

import { readFileSync, mkdirSync, cpSync, writeFileSync, existsSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join, resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validarBase, aplicarPrevia } from './lib.mjs';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const MODELOS = readdirSync(join(RAIZ, 'modelos')).filter((m) => existsSync(join(RAIZ, 'modelos', m, 'render.mjs')));

export async function gerar({ modelo, dados, origem, saida, previa = false, expira }) {
  if (!MODELOS.includes(modelo)) throw new Error(`Modelo "${modelo}" não existe. Use: ${MODELOS.join(', ')}`);
  const pasta = join(RAIZ, 'modelos', modelo);
  const mod = await import(join(pasta, 'render.mjs'));
  validarBase(dados);
  mod.validar?.(dados);

  rmSync(saida, { recursive: true, force: true });
  mkdirSync(join(saida, 'img'), { recursive: true });
  if (existsSync(join(pasta, 'assets'))) cpSync(join(pasta, 'assets'), saida, { recursive: true });

  // Cada modelo diz quais fotos usa: { chave: caminhoNoJson | [caminhos] }
  const copiar = (caminho, nome) => {
    if (!caminho) return null;
    const de = resolve(origem, caminho);
    if (!existsSync(de)) { console.warn('Aviso: foto não encontrada, a seção fica sem ela:', caminho); return null; }
    const arquivo = `img/${nome}${extname(de).toLowerCase()}`;
    cpSync(de, join(saida, arquivo));
    return arquivo;
  };
  const fotos = {};
  for (const [chave, valor] of Object.entries(mod.fotos(dados))) {
    fotos[chave] = Array.isArray(valor)
      ? valor.map((c, i) => copiar(c, `${chave}-${i + 1}`))
      : copiar(valor, chave);
  }

  let html = mod.render(dados, fotos);
  if (previa) html = aplicarPrevia(html, { expira });
  writeFileSync(join(saida, 'index.html'), html);

  if (!previa) {
    writeFileSync(join(saida, 'robots.txt'), 'User-agent: *\nAllow: /\n' + (dados.dominio ? `Sitemap: https://${dados.dominio}/sitemap.xml\n` : ''));
    if (dados.dominio) {
      writeFileSync(join(saida, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://${dados.dominio}/</loc></url></urlset>\n`);
    }
  } else {
    writeFileSync(join(saida, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
  }
  return saida;
}

// Execução pela linha de comando
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const flag = (n) => { const i = args.indexOf(n); return i >= 0 ? args.splice(i, n === '--previa' ? 1 : 2).slice(1)[0] ?? true : undefined; };
  const previa = flag('--previa') !== undefined;
  const expira = flag('--expira');
  const [modelo, entrada, saida] = args;
  if (!modelo || !entrada || !saida) {
    console.error('Uso: node gerador/gerar.mjs <modelo> <dados.json> <saida> [--previa] [--expira DD/MM/AAAA]');
    console.error('Modelos:', MODELOS.join(', '));
    process.exit(1);
  }
  const dados = JSON.parse(readFileSync(entrada, 'utf8'));
  await gerar({ modelo, dados, origem: dirname(resolve(entrada)), saida: resolve(saida), previa, expira });
  console.log(`Site gerado em ${resolve(saida)} (modelo ${modelo}${previa ? ', prévia' : ''})`);
}
