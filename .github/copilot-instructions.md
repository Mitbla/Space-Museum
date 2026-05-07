# Copilot Instructions — Space Museum

## Project Overview
- This repo is a static, browser-first web experience with two coupled modules:
  - `index.html` + `artifact.html` + `about.html` + `style.css` + `script.js` for the 2D archive UI.
  - `Planetariam Museum/index.html` + `Planetariam Museum/app.js` for the 3D museum.
- `script.js` is the shared runtime for multiple pages; most logic is guarded by DOM checks (e.g., `if (pageTitle)`) rather than split files.
- Core content is data-driven: `museumData`, `discoveryData`, and `craftData` in `script.js` feed timeline cards, detail pages, and modals.

## Architecture & Data Flow
- Timeline selection on `index.html` updates UI from `museumData` and persists selected planet via `sessionStorage` key `activePlanet`.
- `artifact.html` reads `?id=<planet>` and renders long-form sections, stats, gallery, next/prev navigation, and accent theme from `museumData`.
- 2D to 3D navigation is intentionally intercepted by `setupRocketTransition()` in `script.js` (uses `#rocket-transition`, 3.5s delay before redirect).
- 3D floors are generated procedurally in `Planetariam Museum/app.js` via `createPlanetFloorExhibit()` using `planetData` + `planetLoreCards`.
- Interactivity in 3D uses raycasting against invisible hit areas (`infoCardTargets`) to open popup lore cards.

## Dev Workflow (Important)
- Do **not** open HTML files directly from disk for normal development; use a local server (CORS/module loading).
- Recommended run commands from repo root:
  - `npx http-server`
  - or VS Code Live Server on `index.html`.
- No package manager setup, build pipeline, or automated tests are currently defined in this repo.

## Project Conventions
- Visual language is intentionally Swiss-style inspired (see `process/SPEC_plan.md`): dark base `#121418`, blue accent `#4dabf7`, `Bebas Neue` + `Inter` typography.
- Preserve “Sage/authority” tone in content; curated voice and curator identity (`Dr. M. Explorer`) are part of UX.
- Keep data additions in `museumData` complete: `title`, `subtitle`, `description`, `basicInfo`, `dangers`, `habitability`, `stats`, and media paths.
- Maintain cross-page consistency: header/nav/footer patterns are shared across `index.html`, `about.html`, and `artifact.html`.
- Record notable functional/design changes in `CHANGELOG.md` (project uses continuous logging).

## 3D Module Notes (`Planetariam Museum/`)
- Three.js is loaded from CDN; `app.js` expects `window.THREE` and dynamically imports `GLTFLoader`.
- Movement model: pointer-lock mouse look + WASD + collision AABBs + floor/elevator logic (`Digit1`-`Digit8` for floor selection near elevator).
- Asset maps in `app.js` are the source of truth for 3D planet models/textures/posters (`modelMap`, `textureMap`, `galleryImageMap`).
- Be careful with existing path/name quirks: directory is `Planetariam Museum` and one model file is `jupitor.glb`.

## Editing Guidance for Agents
- Prefer extending existing data structures and generator functions over hardcoding per-planet/per-floor one-offs.
- For new UI interactions in `script.js`, gate logic by page-specific DOM presence to avoid cross-page runtime errors.
- Keep animations and transitions lightweight; this codebase relies on vanilla JS + CSS timing rather than frameworks.
- When changing 3D interactions, verify both keyboard/mouse flow and popup/raycast behavior still work.