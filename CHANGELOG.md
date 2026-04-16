# Changelog

All notable changes to the Space Museum project will be documented in this file. We practice Continuous Logging; every structural or stylistic change must be cataloged here with its date and rationale.

## [2026-04-16] - Planet Cards Layout Update (Sprint 6)
### Changed
* **Planet Card Layout**: Restructured `.active-artifact-display` and `.artifact-visual` into a side-by-side layout in `index.html` via a new `.timeline-content-split` grid class. **Reason**: Improves use of horizontal space on desktop and highlights 3D models/images better.
* **Explore CTA Button**: Upgraded the subtle `Explore Artifact` text link to match the prominent blue button style (`.hero-cta`) from the hero section. **Reason**: Better call-to-action visibility.
* **Consistency**: Applied the exact same side-by-side layout to the "Latest Discoveries" section.

## [2026-04-15] - Artifact Page UI Enhancements (Sprint 5)
### New Features
* **Quick-stat sidebar** alongside hero image showing Mass, Diameter, Distance, Orbital Period, Moons. Added `stats` data to all 9 planet entries in `script.js`. **Reason**: Provides scannable numeric data without reading long paragraphs.
* **SVG icon indicators** on detail card titles (info, warning triangle, house). **Reason**: Improves visual scanning and card identity.
* **Accordion expand/collapse** on all three detail cards. Default: collapsed with gradient fade. **Reason**: Expanded content made cards very long; accordion maintains readability.
* **Crossfade navigation** between planets via next/prev buttons. **Reason**: Replaces jarring hard page reload with smooth transition.
* **Sticky section nav** bar (Overview · Info · Dangers · Habitability · Gallery) with IntersectionObserver-based active highlighting. **Reason**: Long page needs quick-jump navigation.
* **Hero image parallax** scroll effect. **Reason**: Adds visual depth and premium feel.
* **Gallery lightbox** with full-screen overlay, zoom animation, keyboard (Esc) and click-to-close support. **Reason**: Gallery images were too small to appreciate detail.

### Files Modified
* `script.js` — Added `stats` objects to all 9 planets, plus JS logic for accordion, lightbox, parallax, crossfade, sticky nav
* `artifact.html` — Rebuilt with stat sidebar, sticky nav, card icons, accordion toggles, lightbox overlay
* `style.css` — Added ~350 lines of styles for all 7 new features including responsive rules

## [2026-04-15] - Content Expansion & Process Workflow
* Expanded **all 9 planet data sections** in `script.js` with 2 additional paragraphs each across Basic Info, Environmental Dangers, and Habitability Analysis (54 new paragraphs total). **Reason**: Original content was thin; each section now provides comprehensive scientific depth covering internal structure, mission history, comparative data, and future exploration prospects.
* Created **process update workflow** at `.agent/workflows/update-process-docs.md`. **Reason**: Ensures `CHANGELOG.md`, `QA_log.md`, and `SPRINT_log.md` are updated after every change.

## [2026-04-15] - QA Audit & Artifact Page Overhaul
### Landing Page Fixes
* Removed dead `Planetariam Museum/main.js` (266 lines of unreferenced legacy code). **Reason**: File was never loaded; caused codebase confusion.
* Added **museum footer** to all 3 HTML pages with navigation, planet directory, curator attribution, and copyright. Fully responsive at tablet and mobile breakpoints.
* Fixed **"Start Exploring" mobile scroll** by applying `scroll-margin-top` to the target section.
* Fixed **hardcoded alt text** on the hero planet image (`"Earth from Space"` → dynamic planet-specific fallback).
* Added missing **Uranus link** in the footer's "Explore" planet directory.

### Artifact Page Overhaul
* Implemented **dynamic browser tab titles** — each planet now sets `document.title` for proper SEO, bookmarking, and tab identification.
* Built **Next/Previous planet navigation** at the bottom of every artifact page with per-planet accent colors and planet names.
* Removed dead **`<body class="artifact-page">`** markup with no corresponding CSS.
* **Regenerated 10 gallery images** for Mars, Jupiter, Saturn, Uranus, and Neptune at higher quality to match the established visual standard.
* Implemented **auto-paragraph formatting** — long text blocks are now split every 3 sentences with proper spacing for readability.
* Renamed **"ARCHIVAL FOOTAGE"** section to **"OBSERVATION GALLERY"** (section contains still images, not footage).
* Added **planet-specific accent colors** — hero image glow, planet badge, and accent bar are tinted per planet (9 unique colors).
* **Rebuilt header layout** to match the homepage/about page pattern for visual consistency across all pages.

## [2026-03-30] - Initial Build & Orchestration Setup
* Established the structural foundation using a **Swiss grid layout** alongside high-contrast typography (Bebas Neue / Inter) to organize complex data.
* Executed full **NASA data integration**, building extensive data arrays in `script.js` featuring accurate basic info, environmental dangers, and habitability metrics.
* Designed and integrated the **'Dr. M. Explorer' profile** to anchor the site's authority and institutional credibility.
* Implemented `sessionStorage` caching mechanism. **Reason**: Resolved state-loss friction whereby visitors clicking back from `artifact.html` were forced to restart their timeline from the Sun.
* Overhauled "Latest NASA Discoveries". **Reason**: Original Wikimedia links were prone to breaking; replaced with OSIRIS-REx, Europa Clipper, and Psyche missions utilizing generated local image assets for maximum stability.
