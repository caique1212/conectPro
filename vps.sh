#!/usr/bin/env bash
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMMAND="${1:-help}"

case "$COMMAND" in
  setup)
    chmod +x "$APP_DIR/deploy/vps/setup-vps.sh" "$APP_DIR/deploy/vps/deploy.sh"
    APP_DIR="$APP_DIR" "$APP_DIR/deploy/vps/setup-vps.sh"
    ;;
  deploy)
    chmod +x "$APP_DIR/deploy/vps/deploy.sh"
    APP_DIR="$APP_DIR" "$APP_DIR/deploy/vps/deploy.sh"
    ;;
  status)
    systemctl --no-pager --full status conectapro-backend || true
    pm2 status
    ;;
  logs-backend)
    journalctl -u conectapro-backend -f
    ;;
  logs-frontend)
    pm2 logs conectapro-frontend
    ;;
  *)
    echo "Uso:"
    echo "  ./vps.sh setup          # primeira configuracao do VPS"
    echo "  ./vps.sh deploy         # publicar ou atualizar tudo"
    echo "  ./vps.sh status         # verificar backend e frontend"
    echo "  ./vps.sh logs-backend   # acompanhar logs do Spring Boot"
    echo "  ./vps.sh logs-frontend  # acompanhar logs do Next.js"
    ;;
esac
