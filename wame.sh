#!/usr/bin/env bash
# Scripts de automação do projeto wame
set -euo pipefail

cd "$(dirname "$0")"

DOCKER_PORT="${PORT:-8080}"

usage() {
  cat <<'EOF'
Uso: ./wame.sh <comando> [args]

Comandos:
  dev         Inicia servidor de desenvolvimento (Vite, hot reload)
  build       Gera build de produção em dist/
  preview     Pré-visualiza o build de produção localmente
  test        Executa os testes (Vitest, modo run)
  test:watch  Executa os testes em modo watch
  coverage    Executa os testes com cobertura
  lint        Verifica o código com ESLint
  check       Roda lint + test + build (verificação completa)
  docker:build  Constrói a imagem Docker
  docker:up     Sobe o container (porta via env PORT, padrão 8080)
  docker:down   Derruba o container
  docker:logs   Mostra os logs do container
  help        Mostra esta ajuda
EOF
}

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "Erro: '$1' não instalado. Abra o README." >&2
    exit 1
  }
}

case "${1:-help}" in
  dev)
    require_cmd npm
    npm run dev
    ;;
  build)
    require_cmd npm
    npm run build
    ;;
  preview)
    require_cmd npm
    npm run preview
    ;;
  test)
    require_cmd npm
    npm test
    ;;
  test:watch)
    require_cmd npm
    npm run test:watch
    ;;
  coverage)
    require_cmd npm
    npm run test:coverage
    ;;
  lint)
    require_cmd npm
    npm run lint
    ;;
  check)
    "$0" lint
    "$0" test
    "$0" build
    ;;
  docker:build)
    require_cmd docker
    docker compose build
    ;;
  docker:up)
    require_cmd docker
    docker compose up -d
    echo "Aplicação em http://localhost:${DOCKER_PORT}"
    ;;
  docker:down)
    require_cmd docker
    docker compose down
    ;;
  docker:logs)
    require_cmd docker
    docker compose logs -f web
    ;;
  help|--help|-h)
    usage
    ;;
  *)
    echo "Comando desconhecido: ${1}" >&2
    usage
    exit 1
    ;;
esac