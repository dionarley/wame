# wame

Gerador de links diretos para o WhatsApp (`wa.me`). SPA em Vanilla JS, sem dependências de runtime, com build via [Vite](https://vitejs.dev/), testes [Vitest](https://vitest.dev/) e deployment via [Docker](https://www.docker.com/) + nginx.

## Funcionalidades

- Geração de link `https://wa.me/<número>?text=<mensagem>` com validação por país
- Formatação automática de telefone brasileiro (DDD + celular/fixo)
- Confirmação de estado (status do link e botões habilitados/desabilitados)
- Copiar link (Clipboard API com fallback para `execCommand`)
- Abrir conversa em nova aba
- Contador de caracteres da mensagem (máx. 1000)

## Estrutura de arquivos

```
.
├── index.html              # Página principal
├── style.css               # Estilos
├── src/
│   ├── main.js             # Orquestração do DOM e eventos
│   └── lib.mjs             # Lógica pura (testável): validação, formatação, link
├── test/
│   └── lib.test.mjs        # Testes unitários (24 casos)
├── Dockerfile              # Build multi-stage (node → nginx)
├── docker-compose.yml      # Orquestração do container web
├── nginx.conf              # Configuração do servidor de produção
├── eslint.config.js        # Configuração do ESLint
├── vitest.config.mjs       # Configuração do Vitest
└── wame.sh                 # Script de automação (dev/test/build/docker)
```

## Pré-requisitos

- **Node.js** 20+ (para desenvolvimento local)
- **npm** 9+
- **Docker** + **Docker Compose** (para execução em container)

## Desenvolvimento local

### Instalar dependências

```bash
npm install
```

### Servidor de desenvolvimento (hot reload)

```bash
npm run dev
# ou
./wame.sh dev
```

O Vite abre em `http://localhost:5173`.

## Testes (TDD)

A lógica pura fica isolada em `src/lib.mjs`, sem acoplamento ao DOM, o que permite
testes unitários rápidos e determinísticos.

```bash
npm test           # executa uma vez
npm run test:watch # modo watch
npm run test:coverage
# ou
./wame.sh test
```

A suíte cobre **24 casos**: sanitização de números, formatação BR, concatenação
DDI+DDD+número, validação por país e geração de link com/no texto codificado.

## Lint

```bash
npm run lint
```

## Build de produção

```bash
npm run build
# gera os assets em dist/
npm run preview    # pré-visualiza o build localmente
```

## Verificação completa

Roda lint + testes + build em sequência:

```bash
./wame.sh check
```

## Docker

O `Dockerfile` é multi-stage: a etapa `build` compila os assets com Vite e a etapa
final serve via nginx (imagem `nginx:1.27-alpine`), com healthcheck.

```bash
./wame.sh docker:build   # constrói a imagem wame:latest
./wame.sh docker:up      # sobe em http://localhost:8080 (porta via env PORT)
./wame.sh docker:down    # derruba o container
./wame.sh docker:logs    # acompanha os logs
```

### docker-compose

```bash
docker compose up -d
```

O serviço `web` publica a porta `80` do container na porta `8080` do host
(configurável com `PORT=9000 docker compose up -d`).

## Script de automação

`wame.sh` centraliza os comandos do projeto:

| Comando           | Descrição                                   |
| ----------------- | ------------------------------------------- |
| `dev`             | Servidor de desenvolvimento (hot reload)    |
| `build`           | Build de produção em `dist/`                |
| `preview`         | Pré-visualiza o build                       |
| `test`            | Roda os testes (Vitest)                     |
| `test:watch`      | Roda os testes em modo watch                |
| `coverage`        | Roda os testes com cobertura                |
| `lint`            | Verifica o código com ESLint                |
| `check`           | lint + test + build                         |
| `docker:build`    | Constrói a imagem Docker                    |
| `docker:up`       | Sobe o container (padrão porta 8080)        |
| `docker:down`     | Derruba o container                         |
| `docker:logs`     | Mostra os logs do container                 |
| `help`            | Mostra a ajuda                              |

## Stack

- **Runtime**: Vanilla JS (ESM) — sem dependências de produção
- **Build/dev**: Vite
- **Testes**: Vitest
- **Lint**: ESLint
- **Deploy**: Docker (multi-stage) + nginx