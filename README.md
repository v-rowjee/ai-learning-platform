# nexora/learn

An open-source, mock-first AI coding education platform. Learn AI APIs, prompting, RAG, agents, and production concerns through lessons, quizzes, challenges, a playground, and a contextual tutor.

## Run locally

Prerequisites: Node.js 20+ and npm.

```cmd
npm install
npm run dev
```

Open http://localhost:3000. Mock mode requires no database, Docker, API key, or external service. Use the demo account on `/login`.

## Architecture

- `src/types` contains stable domain and service contracts.
- `src/mocks` contains curriculum fixtures only.
- `src/services` is the dependency-injection boundary. Replace the mock implementations with HTTP implementations later without changing page components.
- `src/components` contains the interactive shell and learning experiences.
- Progress is stored in browser `localStorage` under a namespaced demo key.
- Course and lesson authoring is documented in [docs/course-authoring.md](./docs/course-authoring.md).

Set `NEXT_PUBLIC_DATA_PROVIDER=mock` in `.env.local` for clarity. No secret values belong in `NEXT_PUBLIC_*` variables.

## Future backend

Implement the interfaces in `src/types/index.ts` with secure route handlers or a separate API, then select the provider in `src/services/index.ts`. Keep provider credentials server-side.
