# Review Checklist

- Auth route still works (`/auth/signin`, `/api/auth/[...nextauth]`)
- Protected pages require login (`/dashboard/*`)
- Admin API accepts only valid payloads (`POST/DELETE /api/admin/courses`)
- Prisma schema and migrations are included
- README setup steps run cleanly on a new machine
