# ConectaPro

ConectaPro e um marketplace de servicos tecnicos que conecta clientes a prestadores avaliados e aprovados administrativamente.

## Stack

- Backend: Java 25, Spring Boot, Gradle, Spring Data JPA, Spring Security, PostgreSQL
- Frontend: Next.js, React, Tailwind CSS, TypeScript
- Deploy sugerido: frontend na Vercel, backend no Render e banco PostgreSQL no Supabase

## Estrutura

```text
ConectPro/
  backend/   # API Spring Boot
  frontend/  # App Next.js
```

## Variaveis de ambiente

### Backend

Configure estas variaveis localmente, no Render ou em qualquer ambiente de producao:

```env
DB_URL=jdbc:postgresql://HOST:PORT/DATABASE?sslmode=require
DB_USERNAME=postgres
DB_PASSWORD=sua_senha
SERVER_PORT=10000
```

Em producao no Render com Supabase, use a string do **Connection Pooler/Supavisor**. Evite a conexao direta do Supabase, como `db.<project>.supabase.co:5432`, porque ela pode depender de IPv6 e falhar no Render com `Network is unreachable`.

```env
DB_URL=jdbc:postgresql://<SUPABASE_POOLER_HOST>:<SUPABASE_POOLER_PORT>/<SUPABASE_DATABASE>?sslmode=require
DB_USERNAME=<SUPABASE_POOLER_USER>
DB_PASSWORD=<SUPABASE_PASSWORD>
SERVER_PORT=10000
```

Existe um exemplo em `backend/.env.example`.

### Frontend

```env
NEXT_PUBLIC_API_URL=http://localhost:10000
```

Em producao, troque para a URL publica do backend no Render:

```env
NEXT_PUBLIC_API_URL=https://sua-api.onrender.com
```

Existe um exemplo em `frontend/.env.example`.

## Rodando localmente

### 1. Banco PostgreSQL

Crie o banco local:

```sql
CREATE DATABASE conectapro;
```

### 2. Backend

Configure as variaveis de ambiente do backend e rode:

```powershell
cd backend
.\gradlew.bat bootRun
```

Em Linux/macOS:

```bash
cd backend
./gradlew bootRun
```

A API sobe por padrao em `http://localhost:10000`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

O app sobe por padrao em `http://localhost:3000` ou `http://127.0.0.1:3000`.

## Docker do backend

Build:

```bash
cd backend
docker build -t conectapro-backend .
```

Run:

```bash
docker run --rm -p 10000:10000 \
  -e DB_URL="jdbc:postgresql://host.docker.internal:5432/conectapro" \
  -e DB_USERNAME="postgres" \
  -e DB_PASSWORD="postgres" \
  -e SERVER_PORT="10000" \
  conectapro-backend
```

## Deploy

### PostgreSQL no Supabase

1. Crie ou abra o projeto no Supabase.
2. Va em Database > Connection string.
3. Selecione a string do Connection Pooler/Supavisor, nao a conexao direta.
4. Monte a URL JDBC para o Render:
   - `DB_URL=jdbc:postgresql://POOLER_HOST:POOLER_PORT/DATABASE?sslmode=require`
   - `DB_USERNAME=POOLER_USER`
   - `DB_PASSWORD=SUPABASE_PASSWORD`
5. Nao coloque usuario, senha ou host real no codigo nem no GitHub.

### Backend no Render

Opcao com Docker:

1. Crie um novo Web Service no Render usando este repositorio do GitHub.
2. Configure o root directory como `backend`.
3. Selecione Docker.
4. Configure as variaveis:
   - `DB_URL`
   - `DB_USERNAME`
   - `DB_PASSWORD`
   - `SERVER_PORT=10000`
5. Publique e copie a URL publica gerada pelo Render.

Opcao sem Docker:

1. Configure o root directory como `backend`.
2. Use Java 25.
3. Build command: `./gradlew bootJar`
4. Start command: `java -jar build/libs/*.jar`

### Frontend na Vercel

1. Importe o repositorio na Vercel.
2. Configure o root directory como `frontend`.
3. Configure `NEXT_PUBLIC_API_URL` com a URL publica do backend no Render.
4. Use o build command padrao `npm run build`.

## Cuidados antes de publicar

- Nao versionar `.env`.
- Nao versionar `node_modules`.
- Nao versionar `.next`.
- Nao versionar `build`.
- Nao colocar senha real em `application.properties`; use variaveis de ambiente.
