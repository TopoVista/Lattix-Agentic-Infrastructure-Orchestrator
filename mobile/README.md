# Mobile

## Purpose

Reserved for future mobile or companion clients for Lattix workflows such as approvals, incident updates, notifications, and lightweight workspace review.

## Owner Type

Product engineering.

## Conventions

- Mobile clients must use public gateway APIs and SDKs.
- No mobile app may call internal service endpoints directly.
- Sensitive actions require the same approval and audit rules as the web app.
- Shared contracts should come from `shared/` or `sdk/`.

## Future Phase Dependencies

- Phase 39 defines public SDK and CLI interfaces that mobile clients can reuse.
- Phase 40 determines production support and release expectations.
