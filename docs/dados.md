# Formato do `dados.json`

As fotos são caminhos relativos ao próprio `dados.json`.

## Campos comuns (todos os modelos)

| Campo | Obrigatório | Exemplo | Observação |
|---|---|---|---|
| `nome` | sim | `"Studio Aurora Estética"` | nome completo do negócio |
| `nomeCurto` | não | `"Studio Aurora"` | usado no logo em texto e nos títulos |
| `paleta` | não | `"rose"` | ver as paletas de cada modelo no README |
| `cidade`, `uf` | sim | `"Arujá"`, `"SP"` | |
| `bairro` | não | `"Centro"` | |
| `endereco` | sim | `"Rua Exemplo, 123"` | rua e número |
| `telefone` | sim | `"(11) 90000-0000"` | como aparece no site |
| `whatsapp` | sim | `"5511900000000"` | só dígitos: 55 + DDD + número |
| `horario` | não | `{ "1": ["09:00","18:00"], "6": ["09:00","13:00"] }` | 0 = domingo. Dia ausente = fechado |
| `horarioTexto` | não | `"Seg. a sex., 09:00 às 18:00"` | sem ele, o texto sai do `horario` |
| `google` | não | `{ "nota": 4.8, "total": 87, "mapaUrl": "..." }` | dados da API do Google Places |
| `instagram` | não | `[{ "usuario": "studioaurora", "rotulo": "Studio Aurora" }]` | |
| `hero` | não | `{ "titulo", "destaque", "subtitulo", "chamada", "lead" }` | cada modelo usa uma parte |
| `servicos` | sim | `[{ "nome", "descricao", "sub", "tags", "preco", "quando", "foto" }]` | `nome` é obrigatório em cada item |
| `diferenciais` | não | `["Atendimento individual"]` ou `[{ "titulo", "texto" }]` | |
| `passos` | não | `[{ "titulo", "texto" }]` | sem ele, entra o passo a passo padrão do modelo |
| `avaliacoes` | não | `[{ "texto", "autor", "detalhe", "estrelas" }]` | só avaliações reais |
| `faq` | não | `[{ "pergunta", "resposta" }]` | |
| `dominio` | não | `"studioaurora.com.br"` | gera canonical e sitemap |
| `seo` | não | `{ "titulo", "descricao" }` | sem ele, o modelo monta um padrão |
| `textos` | não | `{ "servicosTitulo": "..." }` | sobrescreve títulos de seção |

## Campos próprios

### `estetica-classica`
- `hero.titulo` + `hero.destaque` formam o H1 ("Studio *Aurora*").
- `destaquePreco`: `{ "titulo", "valor", "sub" }`, o cartão de preço abaixo do topo.
- `outros`: `[{ "titulo": "Corpo", "itens": ["Drenagem", "..."] }]`, os serviços em pílulas.
- `fotos`: `{ "logo", "fachada", "estrutura", "estruturaLegenda", "galeria": [] }`.
- `tipoSchema`: padrão `BeautySalon` (use `DaySpa`, `HealthAndBeautyBusiness` etc. se fizer mais sentido).

### `oficina`
- `segmento`: texto pequeno do logo, padrão `"Centro Automotivo"`.
- `servicos[].quando`: recomendação de intervalo ("10.000 km ou 12 meses").
- `servicos[].icone` e `diferenciais[].icone`: `oil`, `belt`, `brake`, `susp`, `tire`, `chip`, `bolt`, `gear`, `snow`, `shield`, `doc`, `award`, `cup`. Sem ele, o modelo escolhe pelo nome.
- `marcas`: lista de marcas atendidas, ou `false` para esconder a faixa.
- `telefoneFixo`, `cnpj`, `mensagemWhatsapp`.
- `fotos`: `{ "hero", "logo" }`. A foto do topo funciona melhor com o carro de lado e o fundo preto.

### `lava-rapido`
- `nomeCurto` vira o logo em texto ("brilho.").
- `servicos[].preco`: "R$ 40", mostrado como "a partir de".
- `servicosNota`, `promocao` (`{ "titulo", "texto" }`).
- `processo`: `{ "chamada", "titulo", "texto", "itens": [{ "titulo", "texto" }] }`. Sem ele, a seção não aparece.
- `resultado`: `{ "titulo", "texto" }` ou `false`.
- `fotos`: `{ "hero", "processo": [a, b], "servicos", "resultado", "chamada" }`. Cada foto ausente usa a imagem padrão do modelo.

### `estetica-premium`
- `hero`: `{ "chamada", "titulo", "destaque", "final", "lead" }`. O H1 sai como "titulo *destaque*final".
- `textos.manifesto` + `textos.manifestoFinal`: a frase grande depois do topo. Sem ela, a seção não aparece.
- `areas`: `[{ "nome", "resumo", "itens": [], "foto" }]`, as abas de tratamento. Sem `areas`, cada serviço vira uma aba e as `tags` viram os itens.
- `diferenciais`: até 5. O primeiro ganha a foto `fotos.diferenciais`.
- `destaques`: `[{ "titulo", "texto", "foto" }]`, o carrossel "Os mais procurados".
- `equipe`: `[{ "nome", "cargo", "registro", "foto", "frase" }]`. **Só profissionais reais, com o registro (CRM, CRBM etc.) informado pela cliente.**
- `comodidades`: `["Estacionamento no local"]`.
- `complemento`, `facebook`, `responsavelTecnico` (aparece no rodapé; para clínica médica, o CFM exige o nome e o CRM do responsável técnico na publicidade).
- `tipoSchema`: padrão `MedicalClinic`.
- `fotos`: `{ "hero", "logo", "diferenciais", "galeria": [] }`. Fotos padrão (Unsplash) só entram no topo, nas abas e nos destaques. Equipe e galeria nunca usam foto de banco.

### `negocio-local` (categoria OUTROS)
- `categoria`: "Pet shop", "Padaria e confeitaria"... aparece na chamada do topo e no SEO.
- `hero`: `{ "chamada", "titulo", "destaque", "lead", "fotoAlt" }`. O H1 sai como "titulo *destaque*".
- `servicos[].preco`: opcional, mostrado como "a partir de". O primeiro serviço é o destaque.
- `diferenciais`, `avaliacoes` (até 3), `faq`, `complemento`, `cnpj`.
- `fotos`: `{ "hero" (ou "fachada"), "logo", "galeria": [] }`. Sem foto no topo, entra um painel na cor da marca com o nome.
- `tipoSchema`: padrão `LocalBusiness`. Use o tipo mais específico do schema.org quando houver (`PetStore`, `Bakery`, `AccountingService`...).
