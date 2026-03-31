# Sprint Log

## Sprint 1: 2D UI & Grid Layout
**Objective**: Establish the foundational "Archive" interface, prioritizing data ingestion and the Swiss Design aesthetic.

### Milestones Completed:
1.  **Grid Foundation**: Implemented `style.css` leveraging `display: grid` to structure the index page. Built the vertical timeline navigation allowing users to sequence through the solar artifacts natively.
2.  **Typography & Theming**: Integrated `Bebas Neue` and `Inter` from Google Fonts. Established the `#121418` dark theme to simulate the void of space, accented by glowing borders to invoke an electronic terminal aesthetic.
3.  **Data Hydration**: Constructed the `museumData` constant within `script.js`. Populated deeply researched, academically toned lore for 8 planets, breaking the data into strictly categorized panes ("Basic Info", "Dangers", "Habitability").
4.  **Dynamic Background**: Engineered the JavaScript-driven canvas alternative using DOM elements for drifting asteroids, establishing motion without compromising the static data grid.

### Sprint 1 Retrospective:
*Successes*: The data reads cleanly; the Swiss principles successfully handle the density of the text.
*Friction*: The boundary between the static data and immersive experience felt rigid. Addressed this by planning the rocket-wipe transition for Sprint 2.

---

## Sprint 2: 3D Museum Integration
**Objective**: Develop the immersive Spatial layer, utilizing Three.js to construct an interactive volume representing the museum's physical counterpart.

### Milestones Completed:
1.  **3D Bootstrap**: Initialized the `Planetariam Museum` sub-directory. Set up the Three.js scene, camera, and WebGL renderer.
2.  **Architectural Generation**: Coded the 8-story procedural floor loop. Implemented custom lighting parameters and collision detection logic to enclose the user within the exhibit spaces.
3.  **Data Injection**: Refactored the `createPlanetFloorExhibit` loop. Migrated the 2D lore dictionaries into the 3D renderer, dynamically spawning 5 precise, readable text-boards per floor.
4.  **Transition Pipeline**: Finalized the bridge between the two experiences. Built the `rocket-transition` CSS sequence that organically wipes the 2D UI with a smoke explosion to mask the loading of the Three.js canvas.

### Sprint 2 Retrospective:
*Successes*: The dynamic board generation significantly reduced manual geometry placement and guarantees data consistency between the 2D terminal and 3D halls.
*Friction*: Camera movement logic needed tuning to prevent clipping through the generated walls. Collision radii were expanded by 15% to accommodate.
