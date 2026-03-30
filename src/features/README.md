# Feature Ownership

This project keeps team ownership under `src/features`:

- `p1-frontend/*`: UI and user-facing pages.
- `p2-backend/*`: API, data, and integration services.
- `p3-integration/*`: auth, dashboard shell, admin controls, deploy flow.

Rule: new feature code starts in its owner folder, then shared code can move to
`src/components/shared` or `src/lib` once stable.
