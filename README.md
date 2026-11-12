# KODEVA Sites

Gerador de landing pages a partir dos modelos da KODEVA Studio. Cada cliente vira um arquivo `dados.json`. O gerador junta esse arquivo com um modelo e entrega um site estático pronto para publicar (HTML, CSS e JS, sem build).

```bash
node gerador/gerar.mjs <modelo> <dados.json> <pasta-de-saida> [--previa] [--expira 19/11/2026]
```

Exemplos:

```bash
node gerador/gerar.mjs estetica-classica exemplos/estetica-classica/dados.json saida/aurora
node gerador/gerar.mjs oficina exemplos/oficina/dados.json saida/mecanica --previa --expira 19/11/2026
```

Só precisa de Node 18+. Os três modelos em HTML puro não têm dependências. O `estetica-premium` roda um build do Vite: na primeira vez, o gerador instala as dependências dele sozinho (`npm ci` em `modelos/estetica-premium/app`).

## Modelos

| Modelo | Origem | Para quem | Paletas |
|---|---|---|---|
| `estetica-classica` | site da Belíssima Laser | estética, beleza, depilação, massagem | `dourado`, `rose`, `salvia` |
| `oficina` | modelo Torque | oficina mecânica, centro automotivo | `vermelho`, `azul`, `laranja`, `verde`, `amarelo` |
| `lava-rapido` | modelo Lavô | lava-rápido, estética automotiva | `petroleo`, `grafite`, `marinho` |
| `estetica-premium` | modelo Lumea (React + Vite) | clínica de medicina estética, clínica com equipe | `floresta`, `vinho`, `areia`, `grafite` |
| `negocio-local` | novo, genérico | categoria OUTROS: pet shop, padaria, escritório, loja... | `cobalto`, `esmeralda`, `terracota`, `ameixa`, `grafite`, `mostarda` |

**Categoria OUTROS:** a prévia sai na hora com o `negocio-local`. Depois do pagamento, o pedido vai para uma fila em que o site é personalizado à mão no Claude Code. Quando um nicho se repete, ele vira um modelo novo em `modelos/`.

Cada modelo fica em `modelos/<nome>/` com:

- `render.mjs`: recebe os dados e devolve o HTML. Exporta `render`, `fotos` e, se precisar, `validar`.
- `assets/`: CSS, JS, fontes e imagens padrão, copiados para a raiz do site gerado.
- No `estetica-premium`, em vez de `render`, existe `build`: ele escreve `app/src/site.json` numa cópia temporária do app e roda o Vite. Para mexer no visual, rode `npm run dev` dentro de `modelos/estetica-premium/app` (ele usa o `src/site.json` de exemplo).

## Prévia

Com `--previa`, o site sai com uma faixa "Prévia KODEVA Studio", uma marca d'água por cima, `noindex` e um `robots.txt` que bloqueia buscadores. Isso desestimula a cópia, mas **não impede**: qualquer HTML pode ser salvo pelo navegador. A proteção de verdade é a prévia ficar no subdomínio da KODEVA e o link expirar.

## Formato dos dados

Ver [docs/dados.md](docs/dados.md). Os campos comuns (nome, contato, endereço, horário, serviços, avaliações, fotos) valem para todos os modelos. Cada modelo usa também alguns campos próprios.

Regra para quem preenche (pessoa ou IA): **nada de conteúdo inventado.** Avaliação, nota do Google, anos de experiência, garantia e equipe só entram se vierem da cliente ou do Google. Seção sem dado real não aparece.
