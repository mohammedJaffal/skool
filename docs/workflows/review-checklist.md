# Review Checklist

- Auth route still works (`/auth/signin`, `/api/auth/[...nextauth]`)
- Protected pages require login (`/dashboard/*`)
- Admin API accepts only valid payloads (`POST/DELETE /api/admin/courses`)
- Sidebar navigation stays coherent for the current role
- Shared foundation routes still load (`/dashboard/courses`, `/dashboard/community`, `/dashboard/checkout`)
- Admin route is visible only to admins and stays protected
- Prisma schema and migrations are included
- README setup steps run cleanly on a new machine
