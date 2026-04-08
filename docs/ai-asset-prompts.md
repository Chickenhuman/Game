# Black Halo AI Asset Prompt Pack

These prompts are written for an AI-only visual production workflow.
The current repo uses SVG placeholders only as runtime fallback art.
The intended production path is external image generation into layered PNG assets.

## Production docs

- Character part packet for Cael: [`ai-character-part-packets-cael.md`](/workspaces/Game/docs/ai-character-part-packets-cael.md)
- Character part packet for paladin order cast: [`ai-character-part-packets-order.md`](/workspaces/Game/docs/ai-character-part-packets-order.md)
- Environment layer packet: [`ai-environment-layer-packets.md`](/workspaces/Game/docs/ai-environment-layer-packets.md)
- UI and VFX packet: [`ai-ui-vfx-packets.md`](/workspaces/Game/docs/ai-ui-vfx-packets.md)
- Drop-in file and folder rules: [`imagen-dropin-pipeline.md`](/workspaces/Game/docs/imagen-dropin-pipeline.md)

## Global prompt shell

```text
Use case: stylized-concept
Asset type: 2D side-view gameplay illustration for layered cutout animation
Primary request: <asset-specific request>
Scene/backdrop: side-view gothic dark fantasy setting
Subject: readable side-profile character or environment module
Style/medium: premium dark fantasy illustration, high silhouette clarity, cutout-friendly layer separation
Composition/framing: strict side view, centered subject, transparent or clean isolated background when possible
Lighting/mood: ash-dark ambience with sacred cyan and tarnished gold highlights
Color palette: charcoal, cathedral stone, tarnished gold, crimson, sacred cyan, halo ivory
Materials/textures: scorched steel, frayed cloth, stone dust, stained glass glow, ritual metal
Constraints: maintain clean silhouette, preserve profile readability, separate major body masses clearly
Avoid: frontal pose, unreadable perspective, tiny details that break at gameplay scale, modern elements, text, watermark
```

## Character prompts

### Cael Ashborne

```text
Primary request: a fallen hero in broken ceremonial armor, side-view gameplay character, damaged halo fragments, tattered cape, oversized cursed greatblade, asymmetrical silhouette, transparent background
```

### Dawn Paladin

```text
Primary request: an armored kingdom paladin in disciplined white-gold plate, side-view gameplay enemy, rectangular shield, spear-ready stance, severe military silhouette, transparent background
```

### Seraph Vale

```text
Primary request: the successor hero and paladin commander, immaculate ceremonial armor with sacred cyan halo crown, side-view final boss profile, long oath blade, regal yet threatening silhouette, transparent background
```

## Environment prompts

### Ashfall Bastion

```text
Primary request: modular side-view ruined fortress panels, scorched stone walls, torn holy banners, iron braces, chapel windows, gameplay-friendly 2D backdrop layers, no characters
```

### Reliquary Shaft

```text
Primary request: side-view vertical sanctum backdrop modules, chained relic altars, suspended bridges, candlelight, heavy stone columns, gameplay-friendly layered composition, no characters
```

### Mirror Chapel

```text
Primary request: side-view sacred final-area backdrop, polished fractured marble, radiant stained glass reflections, ritual dais, divine symmetry breaking apart, gameplay-friendly layered composition, no characters
```

## UI prompts

### HUD frame

```text
Primary request: liturgical combat HUD frame, dark metal and parchment motifs, sacred seals, clean central negative space for engine text, no readable text, transparent background
```

### Boss intro card

```text
Primary request: gothic boss intro panel, cathedral ornament, holy seal motifs, dramatic asymmetrical framing, transparent background, no readable text
```

## VFX prompts

### Slash arc

```text
Primary request: side-view dark fantasy sword slash effect, sacred cyan core with crimson corruption edge, isolated on transparent background, readable at gameplay scale
```

### Parry flash

```text
Primary request: holy impact flash for successful parry, circular seal burst, sacred cyan and halo ivory sparks, isolated on transparent background
```
