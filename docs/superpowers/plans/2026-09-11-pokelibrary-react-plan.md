# PokéLibrary React Implementation Plan

**Goal:** Migrar la Pokédex Async a React/Vite conservando búsqueda, filtros, formas, lazy tabs, caché y añadiendo un Daily educativo.

**Architecture:** módulos ES para API/utilidades, hooks para estado asíncrono, componentes React pequeños y datos secundarios bajo demanda. Daily usa el mismo índice de PokéAPI y localStorage.

**Tech Stack:** React 18, Vite 5, Fetch API, CSS, localStorage, Vitest.

**Spec:** `docs/superpowers/specs/2026-09-11-pokelibrary-react-design.md`

## Tasks
- [x] Migrar utilidades y API sin globals.
- [x] Crear hooks de búsqueda, Pokémon y lazy loading.
- [x] Crear UI React de búsqueda, resultados, ficha y pestañas.
- [x] Añadir Daily con pistas y persistencia local.
- [x] Añadir pruebas deterministas.
- [x] Documentar Windows/Linux y validar test/build.
