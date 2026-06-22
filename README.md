# ConectaPro

ConectaPro e um marketplace de servicos tecnicos que conecta clientes a prestadores avaliados e aprovados administrativamente.

## Stack

- Backend: Java 25, Spring Boot, Gradle, Spring Data JPA, Spring Security, PostgreSQL
- Frontend: Next.js, React, Tailwind CSS, TypeScript
- Deploy sugerido: frontend na Vercel, backend no Render e banco PostgreSQL no Railway

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
SERVER_PORT=8080
```

No Railway, use os dados do servico PostgreSQL para montar a `DB_URL` JDBC:

```env
DB_URL=jdbc:postgresql://<RAILWAY_HOST>:<RAILWAY_PORT>/<RAILWAY_DATABASE>?sslmode=require
DB_USERNAME=<RAILWAY_USER>
DB_PASSWORD=<RAILWAY_PASSWORD>
```

Existe um exemplo em `backend/.env.example`.

### Frontend

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
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

A API sobe por padrao em `http://localhost:8080`.

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
docker run --rm -p 8080:8080 \
  -e DB_URL="jdbc:postgresql://host.docker.internal:5432/conectapro" \
  -e DB_USERNAME="postgres" \
  -e DB_PASSWORD="postgres" \
  -e SERVER_PORT="8080" \
  conectapro-backend
```

## Deploy

### PostgreSQL no Railway

1. Crie um projeto no Railway.
2. Adicione um servico PostgreSQL.
3. Copie os dados de conexao do banco.
4. No backend hospedado no Render, configure:
   - `DB_URL=jdbc:postgresql://HOST:PORT/DATABASE?sslmode=require`
   - `DB_USERNAME=USER`
   - `DB_PASSWORD=PASSWORD`

### Backend no Render

Opcao com Docker:

1. Crie um novo Web Service no Render usando este repositorio do GitHub.
2. Configure o root directory como `backend`.
3. Selecione Docker.
4. Configure as variaveis:
   - `DB_URL`
   - `DB_USERNAME`
   - `DB_PASSWORD`
   - `SERVER_PORT=8080`
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
