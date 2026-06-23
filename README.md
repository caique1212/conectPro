# ConectaPro

Marketplace de servicos tecnicos com clientes, prestadores, solicitacoes, avaliacoes e aprovacao administrativa.

## Stack

- Backend: Java 25, Spring Boot, JPA, PostgreSQL
- Frontend: Next.js, React, Tailwind CSS, TypeScript
- VPS: backend em `8080`, frontend em `3001`

## Estrutura

```text
backend/       API Spring Boot
frontend/      Aplicacao Next.js
deploy/vps/    Scripts e configuracoes do VPS
vps.sh         Atalho para setup, deploy, status e logs
```

## Cadastro

- Cliente: cria somente a conta.
- Prestador: cria a conta e o perfil profissional na mesma operacao.
- O perfil profissional possui tipo de servico, qualificacao, descricao, cidade e telefone.
- Novos prestadores ficam pendentes ate a aprovacao do Admin.

## Rodar localmente

Backend:

```powershell
cd backend
$env:DB_URL="jdbc:postgresql://localhost:5432/conectapro"
$env:DB_USERNAME="postgres"
$env:DB_PASSWORD="sua_senha"
$env:SERVER_PORT="8080"
.\gradlew.bat bootRun
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Configure `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Deploy no VPS

Projeto esperado em:

```text
/var/www/conectapro
```

Primeira configuracao:

```bash
cd /var/www/conectapro
chmod +x vps.sh
PUBLIC_HOST=187.127.17.146 ./vps.sh setup
```

O setup instala/configura PostgreSQL, gera uma senha forte, cria o banco, prepara o backend como servico systemd e o frontend no PM2.

Publicar ou atualizar:

```bash
cd /var/www/conectapro
./vps.sh deploy
```

Status e logs:

```bash
./vps.sh status
./vps.sh logs-backend
./vps.sh logs-frontend
```

Documentacao detalhada: `deploy/vps/README.md`.

## Dados para apresentacao

O VPS usa `DEMO_DATA_ENABLED=true` e cria os dados apenas uma vez.

Admin:

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

O seed inclui prestadores aprovados e pendentes, solicitacoes em todos os status e avaliacoes de servicos finalizados.

## Seguranca

- Senhas do PostgreSQL nao sao versionadas.
- O setup salva as credenciais em `/etc/conectapro/backend.env` com permissao `600`.
- O login ainda e simples para o MVP; JWT e BCrypt ficam para uma etapa futura.
