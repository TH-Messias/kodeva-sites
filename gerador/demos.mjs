#!/usr/bin/env node
// Gera os sites de demonstração da vitrine em site-vendas/demos/<id>/.
//   node gerador/demos.mjs
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gerar } from './gerar.mjs';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const DEMOS = [
  ['estetica', 'estetica-classica', 'exemplos/estetica-classica/dados.json'],
  ['clinica', 'estetica-premium', 'exemplos/estetica-premium/dados.json'],
  ['oficina', 'oficina', 'exemplos/oficina/dados.json'],
  ['lava-rapido', 'lava-rapido', 'exemplos/lava-rapido/dados.json'],
  ['petshop', 'negocio-local', 'exemplos/negocio-local/petshop.json'],
  ['padaria', 'negocio-local', 'exemplos/negocio-local/padaria.json'],
  ['escritorio', 'negocio-local', 'exemplos/negocio-local/escritorio.json'],
];

for (const [id, modelo, arquivo] of DEMOS) {
  const entrada = join(RAIZ, arquivo);
  const dados = JSON.parse(readFileSync(entrada, 'utf8'));
  await gerar({ modelo, dados, origem: dirname(entrada), saida: join(RAIZ, 'site-vendas', 'demos', id), demo: true });
  console.log('ok', id);
}
