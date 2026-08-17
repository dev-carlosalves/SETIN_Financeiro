# SETIN Financeiro

Sistema interno de controle financeiro do evento SETIN. Desenvolvido em Next.js + Prisma + Neon Postgres.

## Passo a passo de deploy

### 1. Criar banco Neon

1. Acesse [neon.tech](https://neon.tech) e crie uma conta gratuita
2. Crie um novo projeto (ex.: `setin-financeiro`)
3. Copie a **connection string** no formato:
   ```
   postgresql://usuario:senha@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

### 2. Configurar variáveis de ambiente localmente

Crie um arquivo `.env` na raiz do projeto (nunca commite este arquivo!):

```bash
cp .env.example .env
```

Preencha as três variáveis:

```env
DATABASE_URL=postgresql://...     # connection string do Neon
SITE_PASSWORD=sua-senha-aqui      # senha compartilhada pela equipe
SESSION_SECRET=string-aleatoria-longa-pelo-menos-32-chars
```

> **Dica:** Gere o SESSION_SECRET com `openssl rand -base64 32` ou qualquer gerador de senhas.

### 3. Rodar as migrations (criar as tabelas)

Primeiro, exporte a `DATABASE_URL` no terminal (ou crie o arquivo `.env`):

```bash
# Windows (PowerShell)
$env:DATABASE_URL = "postgresql://..."

# Linux/Mac
export DATABASE_URL="postgresql://..."
```

Depois rode a migration:

```bash
cd setin-app
npx prisma migrate deploy
```

> Em desenvolvimento local com banco Neon, use também `npx prisma migrate deploy`.
> O arquivo SQL da migration inicial já está em `prisma/migrations/0001_init/migration.sql`.

### 4. Subir o repositório no GitHub

```bash
git init
git add .
git commit -m "feat: SETIN financeiro inicial"
git branch -M main
git remote add origin https://github.com/seu-usuario/setin-financeiro.git
git push -u origin main
```

### 5. Importar projeto na Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em **Add New Project** → importe o repositório do GitHub
3. Na tela de configuração:
   - **Framework Preset:** Next.js (detectado automaticamente)
   - **Root Directory:** `setin-app` (se o projeto estiver em subpasta)
4. Clique em **Deploy** (vai falhar na primeira vez sem as variáveis — isso é normal)

### 6. Preencher variáveis de ambiente na Vercel

1. Vá em **Settings → Environment Variables** do projeto na Vercel
2. Adicione as três variáveis:
   - `DATABASE_URL` = connection string do Neon
   - `SITE_PASSWORD` = senha da equipe
   - `SESSION_SECRET` = string secreta longa
3. Clique em **Save** e depois **Redeploy**

### 7. Verificar

- Acesse a URL gerada pela Vercel (ex.: `setin-financeiro.vercel.app`)
- Você será redirecionado para a tela de login
- Use a senha definida em `SITE_PASSWORD`

---

## Desenvolvimento local

```bash
cd setin-app
npm install
npx prisma migrate dev --name init
npm run dev
```

Acesse: http://localhost:3000

---

## Stack

- **Framework:** Next.js 15 (App Router)
- **Linguagem:** TypeScript
- **Banco:** PostgreSQL (Neon)
- **ORM:** Prisma
- **Autenticação:** iron-session (cookie httpOnly)
- **Estilo:** Tailwind CSS
- **Gráficos:** Recharts
- **Deploy:** Vercel

## Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | Connection string do Neon Postgres |
| `SITE_PASSWORD` | Senha única compartilhada pela equipe |
| `SESSION_SECRET` | Segredo para assinar o cookie de sessão (≥ 32 chars) |
