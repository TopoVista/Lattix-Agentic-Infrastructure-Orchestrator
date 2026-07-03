# Frontend

## Purpose

Holds browser-based Lattix product surfaces, beginning with the developer workspace and later expanding into repository browsing, editor, chat, task board, observability, digital twin, and operations views.

## Owner Type

Product engineering and frontend platform.

## Conventions

- TypeScript packages use `@lattix/<package>`.
- Shared API types should come from `shared/` or generated SDK packages.
- Frontend code must call the API gateway, not internal services directly.
- UI state must preserve loading, empty, error, permission-denied, and audit-sensitive states.
- Future Next.js apps should live under `frontend/apps/`.
- Phase 10 introduces `frontend/apps/web` as the first runnable workspace shell.

## Future Phase Dependencies

- Phase 10 builds the developer workspace.
- Phase 11 adds the intelligent editor.
- Phase 18 adds streaming chat surfaces.
- Phase 27 adds digital twin views.
