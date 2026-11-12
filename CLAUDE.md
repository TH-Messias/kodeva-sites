# KODEVA Sites

Gerador de landing pages (ver README.md e docs/dados.md) e a página de venda em `site-vendas/`.

## Como trabalhar neste repositório

As skills em `.claude/skills/` vêm do [superpowers](https://github.com/obra/superpowers) (MIT, commit 22f0b46). Use:

- `brainstorming` antes de criar um modelo novo ou uma seção nova: entenda o ramo e o que o cliente final procura antes de desenhar.
- `writing-plans` para trabalhos com mais de um arquivo (modelo novo, mudança no formato do `dados.json`).
- `test-driven-development` para mudanças no gerador ou em `render.mjs`: escreva o teste em `testes/` primeiro e veja ele falhar.
- `systematic-debugging` quando um modelo quebrar com algum dado: ache a causa antes de remendar.
- `verification-before-completion` antes de dizer que terminou: rode `npm test`, gere os exemplos e olhe o resultado no navegador.
- `receiving-code-review` ao responder revisão no PR.

## Regras do projeto

- Nada de conteúdo inventado. Avaliação, nota, anos de experiência, garantia e equipe só entram com dado real. Seção sem dado não aparece. Há teste para isso.
- `se(cond, html)` em `gerador/lib.mjs` avalia o HTML mesmo quando `cond` é falso. Dentro dele, use sempre `?.` (`d.hero?.lead`, nunca `d.hero.lead`).
- Texto que a cliente final lê: português do Brasil, sem travessão, sem jargão de IA.
- Depois de mexer num modelo: `npm test`, `npm run exemplos` e `npm run demos` (atualiza as demonstrações da vitrine).
