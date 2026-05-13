# Project Structure (Current)

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
│   │   │   ├── admin/communities/route.ts
│   │   │   ├── communities/route.ts
│   │   │   └── posts/[postId]/comments/route.ts
│   │   ├── auth/signin/page.tsx
│   │   ├── dashboard/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── admin/page.tsx
│   │   │   ├── checkout/page.tsx
│   │   │   ├── communities/[communityId]/page.tsx
│   │   │   ├── invitations/page.tsx
│   │   │   ├── owned-communities/page.tsx
│   │   │   └── progress/page.tsx
│   │   ├── communities/[slug]/about/page.tsx
│   │   ├── communities/[slug]/classroom/page.tsx
│   │   ├── communities/[slug]/community/page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── admin/
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
  `admin`, `community`, `classroom`, or `progress`.
- Keep shared route scaffolding stable so teammate branches can plug feature work
  into existing pages instead of inventing new paths.
- Keep App Router files thin and call feature modules.
- Promote shared utilities to `src/lib` or `src/components/shared` only after reuse.
- Ownership is handled by git branches and PRs, not by person/team folders in the repo.
