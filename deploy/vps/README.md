# Deploy do ConectaPro no VPS

Configuracao prevista:

- Projeto: `/var/www/conectapro`
- PostgreSQL: porta local `5432`
- Backend Spring Boot: porta `8080`, gerenciado pelo systemd
- Frontend Next.js: porta `3001`, gerenciado pelo PM2

## Primeira instalacao

No terminal do VPS:

```bash
cd /var/www/conectapro
chmod +x vps.sh
PUBLIC_HOST=187.127.17.146 ./vps.sh setup
```

O script:

1. Instala e inicia PostgreSQL.
2. Cria o banco `conectapro`.
3. Cria um usuario PostgreSQL exclusivo chamado `conectapro`.
4. Gera uma senha forte automaticamente.
5. Salva a senha em `/etc/conectapro/backend.env`, com permissao `600`.
6. Cria `frontend/.env.production` apontando para o backend.
7. Instala o servico systemd do backend.
8. Prepara o PM2 para o frontend.

Nao coloque a senha gerada no GitHub.

## Primeira publicacao e atualizacoes

Depois do setup:

```bash
cd /var/www/conectapro
./vps.sh deploy
```

Esse comando atualiza o Git, gera o JAR do backend, reinicia o systemd, gera o build do frontend e reinicia o PM2.

## Contas de demonstracao

Com `DEMO_DATA_ENABLED=true`, o backend cria os dados apenas uma vez.

Administrador:

```text
Email: admin@conectapro.com
Senha: Admin@123
Tipo: ADMIN
```

Clientes:

```text
cliente1@conectapro.com ate cliente10@conectapro.com
Senha: Demo@123
Tipo: CLIENTE
```

Prestadores:

```text
prestador1@conectapro.com ate prestador10@conectapro.com
Senha: Demo@123
Tipo: PRESTADOR
```

Os prestadores 1 a 8 iniciam aprovados. Os prestadores 9 e 10 ficam pendentes para demonstrar o fluxo administrativo.

## Verificar

```bash
systemctl status conectapro-backend
pm2 status
curl http://127.0.0.1:8080/usuarios
curl http://127.0.0.1:3001
```

## Logs

```bash
journalctl -u conectapro-backend -f
pm2 logs conectapro-frontend
```

Ou use os atalhos:

```bash
./vps.sh status
./vps.sh logs-backend
./vps.sh logs-frontend
```

## Alterar configuracoes

Backend e banco:

```bash
nano /etc/conectapro/backend.env
systemctl restart conectapro-backend
```

Frontend:

```bash
nano /var/www/conectapro/frontend/.env.production
cd /var/www/conectapro/frontend
npm run build
pm2 restart conectapro-frontend --update-env
```
