// Testes do gerador: node --test testes/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { validarBase, horarioCurto, jsonLd, aplicarPrevia, aplicarDemo, esc } from '../gerador/lib.mjs';
import { gerar } from '../gerador/gerar.mjs';

const minimo = () => ({
  nome: 'Loja <Teste> & Cia',
  cidade: 'Arujá',
  uf: 'SP',
  endereco: 'Rua Um, 10',
  telefone: '(11) 90000-0000',
  whatsapp: '5511900000000',
  servicos: [{ nome: 'Serviço A' }, { nome: 'Serviço B' }],
});

test('validarBase recusa campo obrigatório faltando', () => {
  const d = minimo(); delete d.cidade;
  assert.throws(() => validarBase(d), /cidade/);
});

test('validarBase recusa WhatsApp sem 55 e DDD', () => {
  assert.throws(() => validarBase({ ...minimo(), whatsapp: '11900000000' }), /whatsapp/);
  assert.doesNotThrow(() => validarBase(minimo()));
});

test('horarioCurto junta dias seguidos com o mesmo horário', () => {
  const h = { 1: ['09:00', '18:00'], 2: ['09:00', '18:00'], 3: ['09:00', '18:00'], 4: ['09:00', '18:00'], 5: ['09:00', '18:00'], 6: ['09:00', '13:00'] };
  assert.equal(horarioCurto(h), 'Seg a Sex 09:00 às 18:00 · Sáb 09:00 às 13:00');
  assert.equal(horarioCurto({}), '');
});

test('jsonLd nunca usa a nota do Google como aggregateRating', () => {
  const ld = jsonLd({ ...minimo(), google: { nota: 4.9, total: 120 } }, 'LocalBusiness');
  assert.ok(!ld.includes('aggregateRating'));
  assert.ok(!ld.includes('<'), 'o JSON-LD precisa escapar "<"');
});

const pagina = '<html><head><title>X</title><link rel="canonical" href="https://a.com/"></head><body><p>oi</p></body></html>';

test('prévia sai com noindex, sem canonical e com a faixa', () => {
  const h = aplicarPrevia(pagina, { expira: '19/11/2026' });
  assert.match(h, /noindex/);
  assert.doesNotMatch(h, /canonical/);
  assert.match(h, /<title>\[Prévia\] X/);
  assert.match(h, /disponível até 19\/11\/2026/);
});

test('demonstração avisa que os dados são ilustrativos e não leva marca d\'água', () => {
  const h = aplicarDemo(pagina);
  assert.match(h, /noindex/);
  assert.match(h, /ilustrativos/);
  assert.doesNotMatch(h, /kodeva-previa-marca/);
});

// Modelos em HTML puro: com só os campos obrigatórios, nada pode sair inventado nem quebrado.
for (const modelo of ['estetica-classica', 'oficina', 'lava-rapido', 'negocio-local']) {
  test(`${modelo}: renderiza só com os campos obrigatórios, sem conteúdo inventado`, async () => {
    const mod = await import(`../modelos/${modelo}/render.mjs`);
    const d = minimo();
    mod.validar?.(d);
    // mesmo formato que o gerar() entrega quando nenhuma foto foi enviada
    const f = Object.fromEntries(Object.entries(mod.fotos(d)).map(([k, v]) => [k, Array.isArray(v) ? v.map(() => null) : null]));
    const html = mod.render(d, f);
    assert.ok(html.includes(esc('Loja <Teste> & Cia')), 'o nome precisa sair escapado');
    assert.ok(!html.includes('Loja <Teste>'), 'nome sem escape é risco de HTML injetado');
    assert.doesNotMatch(html, /\bundefined\b|>null<|NaN/);
    assert.doesNotMatch(html, /id="avaliacoes"/, 'sem avaliações reais, a seção não aparece');
    assert.doesNotMatch(html, /Nota no Google/i, 'sem nota do Google, ela não aparece');
    assert.doesNotMatch(html, /aggregateRating/);
  });
}

test('gerar: prévia bloqueia buscadores e demonstração não escreve robots.txt', async () => {
  const pasta = mkdtempSync(join(tmpdir(), 'kodeva-'));
  try {
    const previa = join(pasta, 'previa');
    await gerar({ modelo: 'negocio-local', dados: minimo(), origem: pasta, saida: previa, previa: true });
    assert.match(readFileSync(join(previa, 'robots.txt'), 'utf8'), /Disallow: \//);

    const demo = join(pasta, 'demo');
    await gerar({ modelo: 'negocio-local', dados: minimo(), origem: pasta, saida: demo, demo: true });
    assert.ok(!existsSync(join(demo, 'robots.txt')));
    assert.match(readFileSync(join(demo, 'index.html'), 'utf8'), /ilustrativos/);
  } finally {
    rmSync(pasta, { recursive: true, force: true });
  }
});
