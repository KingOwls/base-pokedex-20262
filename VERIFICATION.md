# Verification notes

Verification performed in the build workspace on 2026-09-16.

- Pure game/utility suite: `npm test`.
- JSX/module syntax parse: global TypeScript compiler with `allowJs` and `jsx react-jsx`.
- Local import graph: checked for missing relative imports.
- Assets: 973 local National-Dex sprite folders plus PokéAPI fallback; 12 PokéSprint runner folders.
- Full `npm install` / Vite build could not be executed in this sandbox because DNS access to `registry.npmjs.org` returned `EAI_AGAIN`. Run `npm install && npm run build` on a normal networked machine for the final production bundle.
