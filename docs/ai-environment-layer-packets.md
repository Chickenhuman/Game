# Black Halo Environment Layer Packets

This document defines the external Imagen-style generation contract for Black Halo's side-scrolling environments. Each sector should be delivered as separated `back`, `mid`, `play`, and `fore` layers plus reusable modules.

## Target Output

- Gameplay view: `1600 x 900`
- Sectors:
  - `ashfall`
  - `reliquary`
  - `mirror`
- Deliverables:
  - panorama background
  - reusable structural modules
  - hero landmarks
  - foreground overlays

## Naming Rules

- Use `sector_layer_module_v01.png`.
- Examples:
  - `ashfall_back_panorama_v01.png`
  - `ashfall_mid_wall_repeat_a_v01.png`
  - `ashfall_play_gate_frame_v01.png`
  - `ashfall_fore_banner_cluster_v01.png`

## Global Canvas And Export Rules

- `back`: `4096 x 1536`, opaque allowed
- `mid`: `2048 x 1024`, transparent preferred
- `play`: `1024 x 1024`, transparent required
- `fore`: `1024 x 1536` or `1024 x 1024`, transparent required
- Final format: transparent `PNG` where applicable
- No text, no watermark, no characters

## Layer Intent

- `back`: skyline, atmospheric light, large distant masses only
- `mid`: walls, windows, columns, repeated architecture
- `play`: arches, doors, bridge backing, altar frames, rear support structures
- `fore`: chains, banners, glass shards, dust, smoke, light veils
- Only the `play` layer may imply believable standing surfaces.

## Ashfall Bastion

### Keywords

- scorched stone
- torn holy banners
- iron braces
- cracked fortress masonry

### Required Deliverables

- `back`
  - ruined bastion skyline panorama
- `mid`
  - wall repeat
  - chapel ruin panel
  - brace and window segment
  - crypt recess module
- `play`
  - gate frame
  - rampart backer
  - crypt arch
  - armory wall kit
  - sanctuary alcove
- `fore`
  - torn banner cluster
  - hanging chain set
  - ember haze strip
  - foreground iron brace

## Reliquary Shaft

### Keywords

- chained altars
- vertical sanctum void
- suspended bridges
- bells
- prison cells

### Required Deliverables

- `back`
  - deep shaft panorama with descending light
- `mid`
  - column repeat
  - chain curtain
  - reliquary niche
  - suspended masonry segment
- `play`
  - lift chamber frame
  - arena apse
  - archive bridge backer
  - cell gate surround
  - bell tower opening
- `fore`
  - chain swing cluster
  - incense haze
  - bell silhouette strip
  - dust shaft overlay

## Mirror Chapel

### Keywords

- fractured marble
- radiant stained glass
- sacred symmetry
- ritual dais

### Required Deliverables

- `back`
  - sacred chapel panorama with radiant breach
- `mid`
  - mirrored rib arches
  - stained-glass repeat
  - marble fracture repeat
  - choir recess module
- `play`
  - mirror bridge frame
  - choir platform backer
  - sanctum dais surround
  - scriptorium wall kit
  - sealed roof buttress
- `fore`
  - glass shard cluster
  - light veil strip
  - hanging seal fragments
  - foreground marble ribs

## Tiling And Landmark Rules

- Every repeating module should have at least two visual variants.
- Do not place unique landmarks inside repeat modules.
- Use dedicated landmark modules for gates, altars, rose windows, bell assemblies, and final sanctum features.
- Keep strong landmark shapes offset from the player's centerline so silhouettes remain readable.

## Negative Prompt Set

```text
no front perspective, no characters, no text, no watermark, no modern props,
no fake platform edges outside play layer, no overbusy foreground clutter, no muddy contrast
```

## Acceptance Criteria

- At `1600 x 900`, player and enemy silhouettes do not disappear into the background.
- Non-play layers never look like jumpable collision.
- `back`, `mid`, and `fore` read as separate depth planes.
- Repeating modules tile without obvious seam breaks.
- Hero landmarks do not over-repeat.
- Atmosphere does not obscure HUD or interaction markers.

