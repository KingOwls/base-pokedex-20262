# Crowleth Pokédex Phases 0–4 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the existing functional PokéAPI React app into the Crowleth Pokédex experience covering generations I–IX, regional/alternate forms, deep Pokémon profiles, visual regions, and five playable PokéArcade modes.

**Architecture:** Preserve the existing API/search/type utilities, add React Router, centralize generation metadata and asset resolution, then build page-level shells for Pokédex and Arcade. Deterministic game logic lives in pure utility modules with Vitest coverage, while pages consume shared Pokémon loaders and local assets with PokéAPI fallbacks.

**Tech Stack:** React 18, Vite 5, React Router DOM, JavaScript ES modules, CSS, PokéAPI REST v2, localStorage, Vitest.

**Spec:** `docs/superpowers/specs/2026-09-16-crowleth-pokedex-phases-0-4-design.md`

## Global Constraints

- Cover generations I–IX plus the special Hisui regional view.
- National Pokédex covers #001–1025 species; forms remain variants rather than duplicate National numbers.
- PokéAPI is the central data source; local Crowleth/pixel assets have visual priority with PokéAPI fallback.
- No RPG, capture loop, playable maps, bag, field techniques, Event Engine, accounts, or backend.
- README must contain `Jorge Luis Osorio Silva` and a clearly marked GitHub Pages link placeholder.
- Main UI must be responsive, keyboard-usable, and honor `prefers-reduced-motion`.
- Minigames must explain results and persist relevant records locally.

---

### Task 1: Asset pipeline, router, and app shell

**Files:**
- Modify: `package.json`
- Modify: `src/main.jsx`
- Replace: `src/App.jsx`
- Create: `src/routes/AppRoutes.jsx`
- Create: `src/components/common/AppShell.jsx`
- Create: `src/components/common/CrowlethHeader.jsx`
- Create: `src/components/common/PixelPokemonSprite.jsx`
- Create: `src/data/generations.js`
- Create: `src/utils/assets.js`
- Replace: `src/styles.css`
- Copy: `public/assets/**`
- Test: `src/utils/assets.test.js`

**Interfaces:**
- Produces: `getLocalSpriteUrl(id)`, `getPokemonSpriteUrl(pokemon, shiny)`, `GENERATIONS`, routed app shell.

- [ ] Write tests proving four-digit local sprite paths and PokéAPI fallback selection.
- [ ] Run `npm test -- src/utils/assets.test.js` and verify failure.
- [ ] Add `react-router-dom`, generation metadata, asset helpers, shell/header, and route skeleton.
- [ ] Copy supplied assets into `public/assets/crowleth/`, `public/assets/pokedex/`, and `public/assets/pokesprint/`.
- [ ] Run the asset tests and `npm run build` until both pass.

### Task 2: Home portal and generation library

**Files:**
- Replace: `src/pages/HomePage.jsx`
- Create: `src/pages/PokedexLibraryPage.jsx`
- Create: `src/components/pokedex/GenerationCard.jsx`
- Create: `src/components/common/CrowlethNote.jsx`
- Modify: `src/routes/AppRoutes.jsx`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: `GENERATIONS`, shared shell.
- Produces: `/`, `/pokedex`, generation navigation cards.

- [ ] Build the four-entry Crowleth portal with real router links.
- [ ] Build generation cards for Kanto through Paldea, Hisui, and National using supplied Pokédex art.
- [ ] Add responsive and focus-visible behavior.
- [ ] Run `npm run build`.

### Task 3: Unified Pokédex data model and regional browser

**Files:**
- Modify: `src/api/pokeApi.js`
- Modify: `src/hooks/useRegionalPokedex.js`
- Create: `src/hooks/usePokedexEntries.js`
- Create: `src/pages/PokedexBrowserPage.jsx`
- Create: `src/components/pokedex/PokedexSidebar.jsx`
- Create: `src/components/pokedex/PokedexEntryRow.jsx`
- Create: `src/utils/pokedexRanges.js`
- Test: `src/utils/pokedexRanges.test.js`

**Interfaces:**
- Produces: range-based fallback entries for generations I–IX/National and region-aware PokéAPI Pokédex loading.

- [ ] Write tests for generation ID ranges and National #001–1025 coverage.
- [ ] Run tests and verify failure.
- [ ] Implement ranges plus PokéAPI regional loading/fallback.
- [ ] Implement searchable sidebar using local animated sprites and route-based selected Pokémon.
- [ ] Run tests and build.

### Task 4: Pokémon detail page and six definitive tabs

**Files:**
- Replace: `src/pages/PokemonPage.jsx`
- Modify: `src/components/pokemon/PokemonHero.jsx`
- Replace: `src/components/pokemon/PokemonTabs.jsx`
- Modify: `src/components/pokemon/OverviewTab.jsx`
- Modify: `src/components/pokemon/StatsPanel.jsx`
- Modify: `src/components/pokemon/EvolutionTab.jsx`
- Modify: `src/components/pokemon/FormsGallery.jsx`
- Replace: `src/components/pokemon/WeaknessesTab.jsx`
- Create: `src/components/pokemon/MovesTab.jsx`
- Create: `src/components/pokemon/DefensesTab.jsx`
- Modify: `src/hooks/usePokemon.js`
- Modify: `src/styles.css`

**Interfaces:**
- Produces six tabs: Summary, Stats, Evolution, Forms, Defenses, Moves; normal/shiny and form controls.

- [ ] Refactor hero around artwork, type chips, generation, previous/next controls.
- [ ] Humanize abilities/species metadata in Summary.
- [ ] Preserve stats and evolution logic while adapting layout.
- [ ] Wire form variants to route/update the displayed resource.
- [ ] Replace Locations with Moves and expose categorized move details from PokéAPI.
- [ ] Reuse type relation engine for Defenses.
- [ ] Run existing and new tests plus build.

### Task 5: Regions visual encyclopedia

**Files:**
- Replace: `src/pages/RegionsPage.jsx`
- Create: `src/pages/RegionDetailPage.jsx`
- Create: `src/components/regions/RegionCard.jsx`
- Create: `src/data/regions.js`
- Modify: `src/routes/AppRoutes.jsx`
- Modify: `src/styles.css`

**Interfaces:**
- Produces `/regions` and `/regions/:region` visual encyclopedia, not a playable world.

- [ ] Build region cards for all main regions plus Hisui.
- [ ] Show generation, thematic summary, Pokédex art, and link to corresponding browser.
- [ ] Add route handling and responsive layout.
- [ ] Run build.

### Task 6: PokéArcade hub and shared persistence

**Files:**
- Create: `src/pages/ArcadePage.jsx`
- Create: `src/components/arcade/ArcadeLayout.jsx`
- Create: `src/components/arcade/GameResult.jsx`
- Create: `src/utils/arcadeStorage.js`
- Test: `src/utils/arcadeStorage.test.js`
- Modify: `src/routes/AppRoutes.jsx`

**Interfaces:**
- Produces: `loadArcadeState()`, `saveGameRecord(gameKey, record)`, arcade navigation.

- [ ] Write persistence tests using a storage mock.
- [ ] Implement record/state helpers.
- [ ] Build five-mode Arcade selector based on supplied mockups without using them as literal UI screenshots.
- [ ] Run tests and build.

### Task 7: PokéDaily daily and streak modes

**Files:**
- Modify: `src/utils/dailyGame.js`
- Modify: `src/hooks/useDailyGame.js`
- Replace: `src/components/game/DailyGame.jsx`
- Replace: `src/components/game/GuessTable.jsx`
- Replace: `src/pages/DailyPage.jsx`
- Test: `src/utils/dailyGame.test.js`

**Interfaces:**
- Produces deterministic daily target #001–1025; comparison result for number, generation, types, height, weight, rarity, form, evolution stage; competitive five-attempt streak mode.

- [ ] Extend deterministic selection to #001–1025 and write tests.
- [ ] Add pure comparison helpers with arrow/exact/partial outcomes and tests.
- [ ] Build Daily interface and local persistence keyed by date.
- [ ] Add competitive streak mode with five attempts per target.
- [ ] Run tests and build.

### Task 8: PokéCompare

**Files:**
- Create: `src/utils/compareGame.js`
- Create: `src/utils/compareGame.test.js`
- Create: `src/pages/PokeComparePage.jsx`
- Create: `src/components/arcade/CompareArena.jsx`
- Modify: `src/routes/AppRoutes.jsx`

**Interfaces:**
- Produces random pair/category round, tie-safe resolution, infinite streak and best score.

- [ ] Test category extraction for National number, six stats, BST, height, and weight.
- [ ] Implement pure round resolver.
- [ ] Build two-Pokémon VS interface with value reveal and explanation.
- [ ] Persist best streak.
- [ ] Run tests and build.

### Task 9: Who’s That Pokémon?

**Files:**
- Create: `src/utils/whosThatGame.js`
- Create: `src/utils/whosThatGame.test.js`
- Create: `src/pages/WhosThatPage.jsx`
- Create: `src/components/arcade/PokemonReveal.jsx`
- Modify: `src/routes/AppRoutes.jsx`

**Interfaces:**
- Produces difficulty pools and reveal stages 1–6; score decreases as hints/reveal advance.

- [ ] Test scoring and stage progression.
- [ ] Implement difficulty pools through National #1025 with form-capable hard/expert hooks.
- [ ] Build silhouette/pixelation/blur/reveal stages using CSS/canvas-compatible image rendering.
- [ ] Add guesses, hint/reveal progression, final link to Pokémon profile.
- [ ] Run tests and build.

### Task 10: Type Master

**Files:**
- Create: `src/utils/typeMaster.js`
- Create: `src/utils/typeMaster.test.js`
- Create: `src/pages/TypeMasterPage.jsx`
- Create: `src/components/arcade/DefenseProfile.jsx`
- Modify: `src/routes/AppRoutes.jsx`

**Interfaces:**
- Produces defensive profile grouped by 4x, 2x, 1x, 0.5x, 0.25x, 0x and ability modifiers for supported defensive abilities.

- [ ] Test representative dual types and Levitate/Water Absorb/Volt Absorb/Flash Fire/Sap Sipper/Storm Drain/Lightning Rod/Thick Fat/Wonder Guard modifiers.
- [ ] Implement profile key generation and ambiguity hint selection.
- [ ] Build guessing UI with one complementary hint for shared profiles.
- [ ] Persist score/record.
- [ ] Run tests and build.

### Task 11: PokéSprint simulation

**Files:**
- Create: `src/data/sprintRoster.js`
- Create: `src/utils/raceEngine.js`
- Create: `src/utils/raceEngine.test.js`
- Create: `src/pages/PokeSprintPage.jsx`
- Create: `src/components/arcade/SprintRoster.jsx`
- Create: `src/components/arcade/RaceTrack.jsx`
- Modify: `src/routes/AppRoutes.jsx`

**Interfaces:**
- Produces seeded simulation for 5–6 racers from 12-runner roster, Top 3 prediction scoring, organic event log, animation timeline.

- [ ] Write determinism and balance tests ensuring speed remains the strongest factor across seeded runs.
- [ ] Implement roster factors and seven organic events with bounded effects.
- [ ] Build Top 3 prediction UI.
- [ ] Animate racers using supplied sprite sheets/PNGs and render event log/results.
- [ ] Persist best prediction score.
- [ ] Run tests and build.

### Task 12: Accessibility, documentation, verification, and distributable ZIP

**Files:**
- Replace: `README.md`
- Modify: `src/styles.css`
- Create: `.github/workflows/deploy-pages.yml`
- Modify: `vite.config.js`

**Interfaces:**
- Produces documented local/build/GitHub Pages workflow and final distributable archive.

- [ ] Audit keyboard focus, labels, reduced motion, mobile breakpoints, loading/error states.
- [ ] Write README with title, `Jorge Luis Osorio Silva`, installation, scripts, architecture, PokéAPI/assets note, and `GitHub Pages: [pendiente de desplegar]` placeholder.
- [ ] Add GitHub Pages workflow and relative/base-safe asset handling.
- [ ] Run `npm test` and `npm run build` from a clean install.
- [ ] Inspect built bundle and key routes using the dev/preview server where possible.
- [ ] Remove transient caches/node_modules from deliverable and create final ZIP.
