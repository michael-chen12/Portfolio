# CLAUDE.md

Agent guide for this repository.

## Core Rules

1. Invoke `frontend-design` before frontend implementation.
2. Invoke `brainstorming` before feature/component implementation.
3. Ask 2-3 clarifying questions before coding.
4. Get explicit user approval before writing implementation code.
5. Do not run tests unless the user explicitly asks.
6. Do not add unrequested features or sections.
7. For feature work, use a clean `claude/[feature-name]` branch.

## Default Workflow

1. Clarify scope and acceptance criteria.
2. Confirm branch hygiene.
3. Draft and confirm a short plan/spec.
4. Write tests first.
5. Implement approved scope only.
6. Validate and summarize.

## Project Snapshot

- React 19 + Vite 7
- Tailwind CSS 4 (`@tailwindcss/postcss`)
- ESLint 9 (flat config)
- Vitest + Testing Library
- Playwright e2e
- ESM (`"type": "module"`)
- No Prettier configured

## Commands

```bash
npm install
npm run dev
npm run build
npm run preview
npm run lint
npm run test
npm run test:ui
npm run test:coverage
npm run test:e2e
npm run test:e2e:ui
```

Only run test commands when explicitly requested.

## Key Paths

- `.claude/plugins/portfolio-rules/`
- `.claude/commands/`
- `.claude/agents/`
- `src/`
- `docs/plans/`
- `eslint.config.js`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `playwright.config.js`

## Code Standards

- Functional React components.
- Naming: `PascalCase` components, `camelCase` vars/functions.
- Tailwind-first styling; local CSS when needed.
- Semantic HTML, keyboard support, visible focus.
- ESLint should pass for touched code.

## Done Checklist

- Scope complete with no extras.
- Workflow rules followed (questions, approval, TDD order).
- Any skipped test/lint/build execution is explicitly stated.
- Changes are summarized with rationale.

If command/agent templates conflict with repo reality, follow actual repository config first.
