# ConectaPro

ConectaPro e um marketplace de servicos tecnicos que conecta clientes a prestadores avaliados e aprovados administrativamente.

## Stack

- Backend: Java 25, Spring Boot, Gradle, Spring Data JPA, MySQL
- Frontend: Next.js, React, Tailwind CSS
- Banco local sugerido: MySQL via XAMPP, Docker ou instalacao nativa

## Estrutura

```text
ConectPro/
  backend/   # API Spring Boot
  frontend/  # App Next.js
```

## Variaveis de ambiente

### Backend

Crie as variaveis no ambiente da maquina, no painel da plataforma de deploy ou use os valores padrao locais de `application.properties`.

```env
DB_URL=jdbc:mysql://localhost:3306/conectapro?useSSL=false&serverTimezone=UTC
DB_USERNAME=root
DB_PASSWORD=
SERVER_PORT=8080
```

Existe um exemplo em `backend/.env.example`.

### Frontend

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

Existe um exemplo em `frontend/.env.example`.

## Rodando localmente

### 1. Banco de dados

Crie o banco MySQL:

```sql
CREATE DATABASE IF NOT EXISTS conectapro CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Backend

```bash
cd backend
./gradlew.bat bootRun
```

No Windows, se estiver usando PowerShell:

```powershell
cd backend
.\gradlew.bat bootRun
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
  -e DB_URL="jdbc:mysql://host.docker.internal:3306/conectapro?useSSL=false&serverTimezone=UTC" \
  -e DB_USERNAME="root" \
  -e DB_PASSWORD="" \
  -e SERVER_PORT="8080" \
  conectapro-backend
```

## Deploy

### Frontend na Vercel

1. Publique este repositorio no GitHub.
2. Importe o projeto na Vercel.
3. Configure o root directory como `frontend`.
4. Configure a variavel `NEXT_PUBLIC_API_URL` com a URL publica do backend.
5. Use o build command padrao `npm run build`.

### Backend no Render ou Railway

Opção com Docker:

1. Crie um novo servico usando o repositorio do GitHub.
2. Configure o root directory como `backend`.
3. Use o `backend/Dockerfile`.
4. Configure as variaveis `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` e `SERVER_PORT`.
5. Aponte `DB_URL` para o MySQL gerenciado da plataforma.

Opção sem Docker:

1. Configure o root directory como `backend`.
2. Use Java 25.
3. Build command: `./gradlew bootJar`
4. Start command: `java -jar build/libs/*.jar`

## Cuidados antes de publicar

- Nao versionar `.env`.
- Nao versionar `node_modules`.
- Nao versionar `.next`.
- Nao versionar `build`.
- Nao colocar senha real em `application.properties`; use variaveis de ambiente.
