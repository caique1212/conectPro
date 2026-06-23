#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/conectapro}"

cd "$APP_DIR"
git pull --ff-only

if [[ ! -f /etc/conectapro/backend.env ]]; then
  echo "Configuracao ausente. Execute primeiro: ./deploy/vps/setup-vps.sh"
  exit 1
fi

if [[ ! -f "$APP_DIR/frontend/.env.production" ]]; then
  echo "Configuracao do frontend ausente. Execute primeiro: ./deploy/vps/setup-vps.sh"
  exit 1
fi

cd "$APP_DIR/backend"
chmod +x gradlew
./gradlew bootJar --no-daemon
cp "$(find build/libs -maxdepth 1 -name '*.jar' ! -name '*-plain.jar' | head -n 1)" app.jar
systemctl restart conectapro-backend

cd "$APP_DIR/frontend"
npm ci
npm run build

if pm2 describe conectapro-frontend >/dev/null 2>&1; then
  pm2 restart conectapro-frontend --update-env
else
  pm2 start npm --name conectapro-frontend --cwd "$APP_DIR/frontend" -- start -- -p 3001
fi

pm2 save
systemctl --no-pager --full status conectapro-backend
pm2 status
