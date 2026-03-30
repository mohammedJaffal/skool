# Skool - Team Foundation

Production-ready starter for your team using:

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- PostgreSQL (local)
- Prisma ORM
- NextAuth.js v5 (beta)

This repo already implements **P3 Integration**:
- Auth system
- Dashboard layout
- Admin panel
- Deploy + Git workflow

The full folder structure for P1/P2/P3 is already prepared and documented in
`docs/PROJECT_STRUCTURE.md`.

## 1) Prerequisites

- Node.js 20+
- npm 10+
- PostgreSQL running locally
- Git

Optional for auth provider:
- GitHub OAuth app credentials

## 2) Installation (Fresh Machine)

1. Clone:
   - `git clone <your-repo-url>`
   - `cd skool`
2. Install packages:
   - `npm install`
3. Create env file:
   - `cp .env.example .env`
4. Set your local Postgres URL inside `.env`.
5. Generate Prisma client:
   - `npm run prisma:generate`
6. Run database migration:
   - `npm run prisma:migrate -- --name init`
7. Start development server:
   - `npm run dev`
8. Open:
   - [http://localhost:3000](http://localhost:3000)

If migration fails, confirm PostgreSQL is running and the database exists.

## 3) Required Environment Variables

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/skool?schema=public"
AUTH_SECRET="replace-with-long-random-secret"
AUTH_GITHUB_ID=""
AUTH_GITHUB_SECRET=""
```

Notes:
- `AUTH_GITHUB_ID` and `AUTH_GITHUB_SECRET` are needed for GitHub sign-in.
- For production, use secure secrets and managed PostgreSQL.

## 4) P3 Routes

- `GET /auth/signin`
- `GET /dashboard`
- `GET /dashboard/admin`
- `GET /dashboard/deploy`
- `GET|POST /api/auth/[...nextauth]`
- `POST|DELETE /api/admin/courses`

## 5) Team Ownership Convention

- P1 area: `src/features/p1-frontend`
- P2 area: `src/features/p2-backend`
- P3 area: `src/features/p3-integration`

Each team starts in its own folder and moves shared code only when needed.

## 6) Git Workflow

Reference:
- `docs/workflows/git-flow.md`
- `docs/workflows/review-checklist.md`
