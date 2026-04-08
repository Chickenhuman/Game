# Black Halo UI And VFX Pack

External generation spec for Imagen-style UI and VFX assets. Engine text remains authored in Godot; generated art supplies frames, sigils, and effect shapes only.

## Global Rules

- Style anchors:
  - gothic dark fantasy
  - liturgical ornament
  - ash, iron, parchment, sacred cyan, tarnished gold
- Never bake readable text into the image.
- No watermarks, screenshots, mockup devices, or full-scene backgrounds.
- Use lowercase snake case with category prefixes `ui_` and `vfx_`.
- Final export: transparent `PNG`, one asset per file, clean alpha.

## HUD Frame

- Deliverable: ornate edge frame only
- Canvas: `3840 x 2160`
- Prompt focus: dark metal, parchment, sacred seals, empty center for runtime HUD
- Filename: `ui_hud_frame_v01.png`
- Acceptance: does not reduce combat readability

## Boss Intro Card

- Deliverable: cinematic backplate with safe zone for runtime boss name
- Canvas: `2560 x 1440`
- Prompt focus: cathedral severity, boss reveal energy, asymmetrical drama
- Filename: `ui_boss_intro_card_v01.png`
- Acceptance: leaves a clear portrait and text zone

## Relic Cards

- Deliverables:
  - `base`
  - `selected`
  - `corrupted`
- Canvas: `1024 x 1024`
- Prompt focus: reliquary framing, icon window, rarity-readable trim
- Filenames:
  - `ui_relic_card_base_v01.png`
  - `ui_relic_card_selected_v01.png`
  - `ui_relic_card_corrupted_v01.png`
- Acceptance: remains readable at small UI sizes

## Sigils

- Deliverables:
  - `neutral`
  - `holy`
  - `corrupt`
  - `interaction`
- Canvas: `1024 x 1024`
- Prompt focus: circular ritual geometry, clean center mass, crisp transparent edge
- Filenames:
  - `ui_sigil_neutral_v01.png`
  - `ui_sigil_holy_v01.png`
  - `ui_sigil_corrupt_v01.png`
  - `ui_sigil_interaction_v01.png`
- Acceptance: still legible when scaled very small

## Slash Arcs

- Deliverables:
  - `light`
  - `heavy`
  - `skill`
- Canvas: `2048 x 1024`
- Prompt focus: side-view sweep, sacred cyan core, crimson corruption edge
- Filenames:
  - `vfx_slash_arc_light_v01.png`
  - `vfx_slash_arc_heavy_v01.png`
  - `vfx_slash_arc_skill_v01.png`
- Acceptance: direction reads instantly at gameplay scale

## Parry Flashes

- Deliverables:
  - `perfect_parry`
  - `guard_break`
- Canvas: `2048 x 2048`
- Prompt focus: holy seal burst, ivory/cyan impact core, radial clarity
- Filenames:
  - `vfx_parry_flash_perfect_v01.png`
  - `vfx_parry_flash_guard_break_v01.png`
- Acceptance: bright and sharp, not a white blob

## Corruption Miasma

- Deliverables:
  - `idle_plume`
  - `burst_cloud`
  - `trail_wisp`
- Canvas: `2048 x 2048`
- Prompt focus: ash-black smoke with cyan/crimson infection traces
- Filenames:
  - `vfx_miasma_idle_plume_v01.png`
  - `vfx_miasma_burst_cloud_v01.png`
  - `vfx_miasma_trail_wisp_v01.png`
- Acceptance: readable over both dark and bright backgrounds

## Example Prompt Shell

```text
Use case: stylized-concept
Asset type: isolated UI or VFX game asset
Primary request: <asset request>
Style/medium: premium gothic dark fantasy illustration, cutout-friendly, transparent background
Lighting/mood: sacred cyan, tarnished gold, ash-charcoal contrast
Constraints: no text, no watermark, centered subject, gameplay readability first
Avoid: background scene, mockup device, perspective-heavy composition, muddy glow
```

## Acceptance Checklist

- Alpha edges are clean in-engine.
- The asset reads at target gameplay or UI size.
- Ornament does not invade gameplay-critical zones.
- No asset depends on a specific background color.
- Text and icons remain engine-driven, not baked into the artwork.

