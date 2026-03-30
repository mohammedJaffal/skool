# Project Structure (Stable Standard)

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
│   │   └── <feature-name>/
│   ├── hooks/
│   ├── lib/
│   ├── styles/
│   └── types/
├── .env.example
└── README.md
```

Guidelines:
- Use `src/features/<feature-name>` for product domains such as `auth`,
  `admin`, `courses`, `lessons`, or `community`.
- Keep App Router files thin and call feature modules.
- Promote shared utilities to `src/lib` or `src/components/shared` only after reuse.
- Ownership is handled by git branches and PRs, not by person/team folders in the repo.
