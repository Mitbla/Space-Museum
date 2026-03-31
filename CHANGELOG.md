# Changelog

All notable changes to the Space Museum project will be documented in this file. We practice Continuous Logging; every structural or stylistic change must be cataloged here with its date and rationale.

## [2026-03-30] - Initial Build & Orchestration Setup
* Established the structural foundation using a **Swiss grid layout** alongside high-contrast typography (Bebas Neue / Inter) to organize complex data.
* Executed full **NASA data integration**, building extensive data arrays in `script.js` featuring accurate basic info, environmental dangers, and habitability metrics.
* Designed and integrated the **'Dr. M. Explorer' profile** to anchor the site's authority and institutional credibility.
* Implemented `sessionStorage` caching mechanism. **Reason**: Resolved state-loss friction whereby visitors clicking back from `artifact.html` were forced to restart their timeline from the Sun.
* Overhauled "Latest NASA Discoveries". **Reason**: Original Wikimedia links were prone to breaking; replaced with OSIRIS-REx, Europa Clipper, and Psyche missions utilizing generated local image assets for maximum stability.
