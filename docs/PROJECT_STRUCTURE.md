# Project Structure (Team Standard)

```text
.
├── docs/
│   ├── PROJECT_STRUCTURE.md
│   └── workflows/
│       ├── git-flow.md
│       └── review-checklist.md
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   └── admin/courses/route.ts
│   │   ├── auth/signin/page.tsx
│   │   ├── dashboard/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── admin/page.tsx
│   │   │   └── deploy/page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── layout/
│   │   └── shared/
│   ├── config/
│   ├── features/
│   │   ├── p1-frontend/
│   │   ├── p2-backend/
│   │   └── p3-integration/
│   ├── hooks/
│   ├── lib/
│   ├── styles/
│   └── types/
├── .env.example
└── README.md
```

Guidelines:
- Put business logic inside the owning team folder under `src/features/*`.
- Keep App Router files thin and call feature modules.
- Promote shared utilities to `src/lib` or `src/components/shared` only after reuse.
