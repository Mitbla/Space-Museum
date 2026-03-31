# Specification Plan

## 1. Design Style: Swiss Design
The primary aesthetic constraint for the Museum of Our Universe is the Swiss Style (International Typographic Style).

### Technical Requirements:
*   **Grid System**: The 2D layout must adhere to a strict CSS Grid structure, emphasizing asymmetric balance and modular scale. 
*   **Typography**: We mandate bold, sans-serif typography. `Bebas Neue` serves as our striking header typeface, establishing hierarchy, while `Inter` provides high legibility for the dense body copy.
*   **Color Palette**: High-contrast, minimal palette. A stark dark background (`#121418`) serves as negative space, allowing the glowing AI-blue accents (`#4dabf7`) and vivid planetary imagery to immediately draw the eye without clutter.
*   **Purpose**: The Swiss Style ensures that the immense volume of scientific data remains accessible, rigorously organized, and visually authoritative.

## 2. Brand Archetype: The Sage
The overarching persona governing content, structure, and user interaction is "The Sage." We are positioned not merely as an entertainer, but as a prestigious, wise researcher deeply committed to the unearthing and preservation of celestial truth.

### Execution Constraints:
*   **Copywriting Tone**: Objective, elevated, and precise, yet awe-inspiring. Avoid colloquialisms. Treat the user as a peer in the pursuit of knowledge.
*   **Cialdini Principle of Authority**: To operationalize The Sage archetype, we invoke the Cialdini Principle of Authority via the inclusion of "Dr. M. Explorer," Chief Curator. Presenting expert credentials alongside meticulously verified "Facts and Figures" establishes immediate institutional trust.

## 3. The 3D Environment: Three.js Integration
The "Virtual Space Museum" acts as the immersive counter-balance to the 2D archive.

### Architectural Specs:
*   **Engine**: Vanilla Three.js (`v0.155.0` via CDN) to avoid unnecessary framework overhead.
*   **Structure**: An 8-story procedural museum. Each floor corresponds sequentially to the planetary timeline.
*   **Data Binding**: Dynamic generation of 5 lore boards per floor reading directly from the native JavaScript data array, ensuring the 3D geometry stays in sync with our verified knowledge base.
*   **Navigation**: First-person WASD controls with a mouse-look camera to cultivate a genuine sense of physical presence within the digital gallery.
