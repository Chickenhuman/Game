# Black Halo

`Black Halo` is now split into two tracks:

- a Godot 4.x + GDScript scaffold for the long-form production structure
- a browser-playable web vertical slice that runs in this environment

## What is included

- A text-authored Godot project scaffold that does not require the editor to inspect.
- A browser-playable canvas action build under `web/`.
- Core runtime architecture for:
  - meta progression and run state
  - room graph traversal with fixed main path and seeded side content
  - side-scrolling combat, bosses, abilities, save/load, HUD
  - AI-only visual pipeline data for layered cutout characters
- AI-authored SVG art placeholders for:
  - UI sigils
  - layered character parts
  - weapon silhouettes
  - backdrop plates
- Production docs for AI art prompts and style rules

## Project structure

- `project.godot`: Godot project settings and autoloads
- `autoload/`: global services such as save/load, content, input, and run orchestration
- `scripts/`: gameplay, data types, UI, and systems
- `scenes/`: main scene entrypoint
- `web/`: browser-playable vertical slice and local static server
- `assets/`: generated SVG placeholders ready to swap with higher-fidelity AI renders
- `docs/`: style bible and prompt packs for the AI-only art workflow
- `docs/imagen-dropin-pipeline.md`: exact file and folder contract for external Imagen-style asset generation

## Current status

This repo was scaffolded in an environment without a local Godot installation, so editor import artifacts and runtime verification are intentionally absent. The project is set up so it can be opened and continued in a machine with Godot 4.x installed.

## Play The Web Build

Fastest local option:

1. Double-click [`index.html`](/workspaces/Game/index.html)
2. Play immediately in the browser without starting a server

Local server option:

1. Run `npm run web`
2. Open `http://127.0.0.1:4173`
3. Play the web vertical slice directly in the browser

The web build currently includes:

- side-scrolling combat with light, heavy, dash, parry, and skill attacks
- split hub wings for forge and archive functions
- fixed world progression with looped side routes and checkpoint respawn
- `Cinder Dive`, `Chain Grapple`, and `Black Wing` unlocks
- `Sir Aurex` and `Seraph Vale` boss fights
- local save via browser storage

Web validation commands:

1. `npm run check:web`
2. `npm run validate:web:data`
3. `npm run smoke:web`
4. `npm run test:web`

## Next steps in a Godot-enabled environment

1. Open the project in Godot 4.x stable.
2. Let Godot import the SVG assets and generate `.godot/` metadata.
3. Set the main scene if the editor prompts.
4. Run the project and tune physics, collisions, and animation timings.
5. Generate layered PNG assets externally using the packets in [`docs/ai-asset-prompts.md`](/workspaces/Game/docs/ai-asset-prompts.md) and the drop-in rules in [`docs/imagen-dropin-pipeline.md`](/workspaces/Game/docs/imagen-dropin-pipeline.md).
