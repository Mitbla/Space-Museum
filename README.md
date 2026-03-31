# 🌌 Virtual Space Museum

Welcome to the **Virtual Space Museum**, an immersive, interactive web experience that allows users to explore the wonders of our solar system and beyond. 

Built with modern web technologies and the powerful **Three.js** 3D rendering library, this project features two distinct interactive layers: a premium, dark-themed 2D artifact landing page and an expansive, multi-story 3D Planetarium Museum you can actively walk through.

## ✨ Features

- **Interactive 2D Timeline:** A stunning, animated dashboard displaying real-world NASA discoveries, deep celestial lore, and intricate orbital mechanics for all 8 planets.
- **Dynamic Space Background:** A custom JavaScript-driven deep space background featuring drifting asteroids, comets, and high-velocity shooting stars.
- **Seamless 3D Transition:** An immersive, bespoke rocket-launch sequence that organically wipes the screen with smoke to transport you from the 2D dashboard directly into the 3D environment.
- **8-Story Virtual 3D Museum:** 
  - Free-roam first-person controls (WASD & Mouse-look) powered by Three.js.
  - Procedurally generated exhibit floors with custom lighting, collision detection, and detailed architectural geometry (including a glass dome).
  - **Dynamic Lore Boards:** Every single floor dynamically generates 5 unique, highly detailed informational boards containing scientifically accurate "General" and "Dangerous Environment" facts specific to that floor's designated planet.
  - Interactive popup system allowing you to read the detailed planetary lore.

## 🚀 Getting Started

Because this project uses external assets and raw ES modules (like Three.js), you cannot simply double-click the `index.html` file to run it in a modern browser due to strict CORS (Cross-Origin Resource Sharing) policies. 

You must run it through a local development server.

### Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine (to run `npx` commands).
- Or a code editor like **VS Code** with the **Live Server** extension installed.

### Running Locally

**Option 1: Using Node.js (http-server)**
1. Open your terminal and navigate to the root directory of this project:
   ```bash
   cd "path/to/Space Museum"
   ```
2. Start a quick local server using `npx`:
   ```bash
   npx http-server
   ```
3. Open your browser and navigate to `http://localhost:8080` (or whichever port the terminal suggests).

**Option 2: Using VS Code (Live Server)**
1. Open the project folder in VS Code.
2. Ensure you have the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) installed.
3. Open the main `index.html` file.
4. Click the **"Go Live"** button in the bottom right corner of the VS Code window, or right-click the HTML file and select **"Open with Live Server"**.

## 🛠️ Technology Stack
- **HTML5 / CSS3:** Custom styles, Flexbox, CSS Grid, and complex @keyframe animations.
- **Vanilla JavaScript:** Event handling, DOM manipulation, custom background animation loops, and routing.
- **Three.js:** WebGL 3D rendering engine driving the Planetarium Museum.
- **FontAwesome:** Scalable vector iconography for spacecraft and UI elements.

## 🧠 Agentic Orchestration

This project was developed utilizing an **Agentic Orchestration process**. Through this workflow, AI development is strictly constrained by durational artifacts, sprint logs, and specific design boundaries rather than relying on endless chat memory. 

During the development cycle, the AI acted strictly as a **Smithsonian Curator**—evaluating the narrative flow, artifact presentation, and overall visitor experience of the digital exhibition.

The strict directives governing this project are:
- **Swiss Style:** Utilizing a high-contrast, grid-based layout with bold sans-serif typography to ensure complex scientific data remains highly accessible and organized.
- **The Sage Archetype:** The museum’s persona assumes the role of a prestigious, world-class researcher strictly dedicated to facts and the preservation of celestial truth.
- **Authority Principle:** Leveraging Cialdini's Principle of Authority by integrating verified NASA Discoveries and anchoring the narrative on the expert character 'Dr. M. Explorer'.

## 📁 Project Structure

```text
Space Museum/
├── index.html                  # Main timeline landing page
├── artifact.html               # Alternate detailed lore view (2D)
├── style.css                   # Global styles and animations for 2D pages
├── script.js                   # Logic for 2D timeline, background animations, and 3D transition
├── README.md                   # This file!
├── assets/                     # (Optional) Contains logos and generated planet images
└── Planetariam Museum/         # The 3D Environment Module
    ├── index.html              # Entry point for the 3D canvas
    ├── app.js                  # Main Three.js application logic (procedural generation & interaction)
    └── main.js                 # Initialization loops and Three.js bootstrap 
```

## 🤝 Contributing
Feel free to fork this repository and submit pull requests to add new planetary facts, new museum floors, or enhance the 3D lighting!

---

## 🤖 AI Development Handoff Summary

**ATTENTION FUTURE AI ASSISTANT:** If you are reading this section, the user has cloned this repository to a new machine and is asking you to continue development. Below is the critical architectural context you need to seamlessly resume work:

### 1. The 2D Landing Page (`index.html` & `script.js`)
- **Theme**: Premium dark aesthetic (`#121418`) with AI-inspired glowing blue box-shadows (`rgba(77, 171, 247, 0.4)`). We intentionally removed the global page edge pulse but kept individual individual border pulses.
- **Background Engine**: A custom JavaScript loop dynamically generates `<div>` asteroids and comets using CSS animations (`driftDiagonal`), alongside a high-speed shooting star executing precisely every 6 seconds.
- **Lore UI**: The user can click celestial bodies on a horizontal timeline to update a central reading pane with deep, multi-paragraph lore arrays stored natively in `script.js`.
- **Spacecraft UI**: A vertical list of FontAwesome spacecraft icons separated the artifacts from NASA news. Clicking these triggers a vanilla JS frosted-glass modal (`backdrop-filter: blur(8px)`) showing telemetry data.

### 2. The 3D Planetarium Transition
- **The Rocket**: When clicking the "VIRTUAL SPACE MUSEUM" buttons, `script.js` intercepts the navigation and triggers a massive, full-screen fixed CSS overlay.
- **The Animation**: A multi-div CSS rocket (white body, yellow nose, green fins) blasts upward while geometrically expanding CSS "smoke clouds" scale up by 1500% to create an organic, full-screen white-out wipe over exactly 3.5 seconds before natively routing to the 3D sub-directory.

### 3. The 3D Environment (`Planetariam Museum/app.js`)
- **Framework**: Built using vanilla Three.js (`v0.155.0` via CDN). The user spawns inside an 8-story procedural museum featuring a glass dome, collision detection, and continuous rendering loops.
- **Navigation**: The user navigates via WASD/Mouse-look and can use a central vertical beam to traverse 8 distinct planetary floors. A custom HTML `<- Home` button is injected via `absolute` positioning to exit back to the 2D root.
- **Procedural Entities**: We thoroughly refactored the `createPlanetFloorExhibit` render loop. Instead of hard-coded geometry for one floor, the system now loops dynamically through a `planetLoreCards` data dictionary, generating and aligning 5 large reading boards (3 safe, 2 danger-themed) perfectly around the perimeter of **every** floor for all 8 planets. 

**Current Development Status:** The structural integration is complete. Visuals have been verified. Await user prompt for the next feature request!
