# Finanças+

App de gestão financeira pessoal: registre receitas e despesas, categorize,
acompanhe um dashboard com resumo mensal e gráfico por categoria, filtre por
período/categoria/descrição e exporte suas transações em CSV.

Stack: Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui + Supabase
(Auth + Postgres + RLS) + Recharts.

## Configurar o Supabase

1. Crie um projeto em [supabase.com](https://supabase.com).
2. No **SQL Editor** do projeto, cole e execute o conteúdo de
   [`supabase/schema.sql`](./supabase/schema.sql). Isso cria as tabelas
   `categories`/`transactions`, as políticas de Row Level Security e faz o
   seed das categorias padrão.
3. Em **Project Settings → API**, copie a **Project URL** e a chave
   **anon public**.
4. Copie `.env.local.example` para `.env.local` e preencha:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```

5. (Opcional) Em **Authentication → Providers → Email**, desative
   "Confirm email" durante o desenvolvimento para poder logar logo após o
   cadastro sem precisar confirmar o e-mail.

## Rodar localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Deploy

Importe o repositório na [Vercel](https://vercel.com/new) e configure as
mesmas variáveis de ambiente (`NEXT_PUBLIC_SUPABASE_URL` e
`NEXT_PUBLIC_SUPABASE_ANON_KEY`) no projeto criado.
