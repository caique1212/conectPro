#!/usr/bin/env bash
set -euo pipefail

if [[ "${EUID}" -ne 0 ]]; then
  echo "Execute este script como root."
  exit 1
fi

APP_DIR="${APP_DIR:-/var/www/conectapro}"
PUBLIC_HOST="${PUBLIC_HOST:-187.127.17.146}"
FRONTEND_PORT="${FRONTEND_PORT:-3001}"
BACKEND_PORT="${BACKEND_PORT:-8080}"
DB_NAME="${DB_NAME:-conectapro}"
DB_USER="${DB_USER:-conectapro}"
CONFIG_DIR="/etc/conectapro"
BACKEND_ENV="$CONFIG_DIR/backend.env"
FRONTEND_ENV="$APP_DIR/frontend/.env.production"

echo "Preparando dependencias do ConectaPro..."
apt-get update
apt-get install -y postgresql postgresql-contrib openssl

systemctl enable --now postgresql

if ! command -v java >/dev/null 2>&1; then
  apt-get install -y openjdk-25-jdk
fi

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js nao esta instalado. Instale Node.js 20 ou superior e execute novamente."
  exit 1
fi

if ! command -v pm2 >/dev/null 2>&1; then
  npm install -g pm2
fi

pm2 startup systemd -u root --hp /root >/dev/null 2>&1 || true

if [[ -f "$BACKEND_ENV" ]]; then
  # Reaproveita a senha existente em execucoes futuras.
  DB_PASSWORD="$(sed -n 's/^DB_PASSWORD=//p' "$BACKEND_ENV" | head -n 1)"
fi

if [[ -z "${DB_PASSWORD:-}" ]]; then
  DB_PASSWORD="$(openssl rand -hex 24)"
fi

echo "Configurando PostgreSQL..."
if ! sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='${DB_USER}'" | grep -q 1; then
  sudo -u postgres psql -v ON_ERROR_STOP=1 \
    -c "CREATE ROLE ${DB_USER} LOGIN PASSWORD '${DB_PASSWORD}';"
else
  sudo -u postgres psql -v ON_ERROR_STOP=1 \
    -c "ALTER ROLE ${DB_USER} WITH LOGIN PASSWORD '${DB_PASSWORD}';"
fi

if ! sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" | grep -q 1; then
  sudo -u postgres createdb --owner="$DB_USER" "$DB_NAME"
fi

sudo -u postgres psql -v ON_ERROR_STOP=1 \
  -c "ALTER DATABASE ${DB_NAME} OWNER TO ${DB_USER};"

mkdir -p "$CONFIG_DIR"
cat > "$BACKEND_ENV" <<EOF
DB_URL=jdbc:postgresql://127.0.0.1:5432/${DB_NAME}
DB_USERNAME=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
SERVER_PORT=${BACKEND_PORT}
FRONTEND_URL=http://${PUBLIC_HOST}:${FRONTEND_PORT}
DEMO_DATA_ENABLED=true
EOF
chmod 600 "$BACKEND_ENV"

cat > "$FRONTEND_ENV" <<EOF
NEXT_PUBLIC_API_URL=http://${PUBLIC_HOST}:${BACKEND_PORT}
EOF
chmod 600 "$FRONTEND_ENV"

cp "$APP_DIR/deploy/vps/conectapro-backend.service" /etc/systemd/system/conectapro-backend.service
systemctl daemon-reload
systemctl enable conectapro-backend

chmod +x "$APP_DIR/deploy/vps/deploy.sh"

if command -v ufw >/dev/null 2>&1; then
  ufw allow "${FRONTEND_PORT}/tcp" || true
  ufw allow "${BACKEND_PORT}/tcp" || true
fi

echo
echo "Configuracao concluida."
echo "Banco: ${DB_NAME}"
echo "Usuario do banco: ${DB_USER}"
echo "Backend: http://${PUBLIC_HOST}:${BACKEND_PORT}"
echo "Frontend: http://${PUBLIC_HOST}:${FRONTEND_PORT}"
echo "Credenciais protegidas em: ${BACKEND_ENV}"
echo
echo "Agora publique com:"
echo "  cd ${APP_DIR}"
echo "  ./vps.sh deploy"
