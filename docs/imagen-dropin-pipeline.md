# Black Halo Imagen Drop-In Pipeline

## Goal

This repo should accept externally generated layered PNG assets without code changes.
If a generated PNG is missing, the game falls back to the current SVG placeholder.

## Character folders

- `assets/characters/cael/layers/`
- `assets/characters/dawn_paladin/layers/`
- `assets/characters/sir_aurex/layers/`
- `assets/characters/seraph_vale/layers/`

## Required character layer filenames

- `head.png`
- `torso.png`
- `arm_upper.png`
- `arm_lower.png`
- `leg_back.png`
- `leg_front.png`
- `cape.png`
- `aura.png`

## Weapon drop-in files

- `assets/weapons/imagen/cael_greatblade.png`
- `assets/weapons/imagen/chain_glaive.png`
- `assets/weapons/imagen/paladin_spear.png`
- `assets/weapons/imagen/aurex_halberd.png`
- `assets/weapons/imagen/seraph_blade.png`

## Environment drop-in files

- `assets/environments/ashfall/layers/back.png`
- `assets/environments/ashfall/layers/mid.png`
- `assets/environments/ashfall/layers/fore.png`
- `assets/environments/reliquary/layers/back.png`
- `assets/environments/reliquary/layers/mid.png`
- `assets/environments/reliquary/layers/fore.png`
- `assets/environments/mirror/layers/back.png`
- `assets/environments/mirror/layers/mid.png`
- `assets/environments/mirror/layers/fore.png`

## UI drop-in files

- `assets/ui/imagen/hud_frame.png`
- `assets/ui/imagen/black_halo_sigil.png`

## Export rules

- Use transparent backgrounds for all character, weapon, UI, and VFX layers.
- Keep all character layers on the same canvas size per character set.
- Use consistent profile orientation across a full character set.
- Do not bake text into UI art.
- Keep outer glow inside canvas bounds so Godot does not crop it.

## Pivot guidance

- `head`: neck base centered
- `torso`: sternum center
- `arm_upper`: shoulder joint
- `arm_lower`: elbow joint
- `leg_back` and `leg_front`: hip joint
- `cape`: upper clasp point
- `weapon`: grip point
- `aura`: torso center

## Runtime behavior

- The code first attempts to load the external PNG path.
- If that file is absent, it falls back to the SVG placeholder.
- This lets art generation happen incrementally without blocking gameplay work.

