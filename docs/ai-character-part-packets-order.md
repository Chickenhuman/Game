# Paladin Order Part Pack

External generation spec for Imagen-style artwork. This document defines layered cutout deliverables for `Dawn Paladin`, `Sir Aurex`, and `Seraph Vale` as side-view gameplay characters.

## Target Output

- Subjects: rank-and-file order soldier, gate boss commander, final boss successor hero
- Style: premium gothic dark fantasy illustration with rigid holy geometry
- Use: layered cutout animation for side-scrolling gameplay
- Deliverable set: one file per part plus optional aura overlays

## Naming Rules

- Use lowercase snake case.
- Prefix by character:
  - `dawn_paladin_`
  - `sir_aurex_`
  - `seraph_vale_`
- Use exact part names:
  - `head`
  - `torso`
  - `upper_arm`
  - `lower_arm`
  - `back_leg`
  - `front_leg`
  - `cape`
  - `weapon`
  - `aura`
- Format: `<prefix><part>_v01.png`

## Canvas Guidance

- Preferred canvas: `2048 x 2048` per part.
- Keep each part centered with generous padding.
- Use strict side view for every part.
- Preserve clear empty space around the silhouette for extraction cleanup.
- Do not crop long weapons or capes unless they still fit safely inside the canvas.

## Transparent Background Rules

- Request transparent background for all finals.
- Avoid scenic backdrops and cast shadows.
- If transparency fails during generation, use flat mid-gray only for intermediate extraction.
- Keep all glows inside canvas bounds.

## Pivot Guidance

- `head`: neck base
- `torso`: upper spine
- `upper_arm`: shoulder joint
- `lower_arm`: elbow joint
- `back_leg` and `front_leg`: hip joint
- `cape`: upper clasp line
- `weapon`: grip point
- `aura`: centered behind torso

## Negative Prompt Set

```text
no front view, no three-quarter angle, no chibi proportions, no extra limbs, no extra weapons,
no detached shield, no background scenery, no text, no watermark, no toy-like proportions,
no muddy glow, no modern iconography, no overdesigned ornament that hurts gameplay readability
```

## Dawn Paladin

### Silhouette Rules

- Compact infantry silhouette
- Rectangular shield-wall mass
- Disciplined spear line
- Clean, anonymous military geometry

### Part Prompts

#### Head

```text
Dawn Paladin head as a strict side-profile gameplay asset, near-closed helm, narrow visor, anonymous order soldier identity, clean rigid silhouette, transparent background
```

#### Torso

```text
Dawn Paladin torso as a strict side-profile gameplay asset, white-gold plate cuirass, severe geometric chest mass, disciplined tabard, no boss-tier ornament, transparent background
```

#### Upper Arm

```text
Dawn Paladin upper arm as a strict side-profile gameplay asset, compact pauldron and armored bicep, military profile, readable at gameplay scale, transparent background
```

#### Lower Arm

```text
Dawn Paladin lower arm as a strict side-profile gameplay asset, gauntlet with integrated shield-bearing mass, rectangular defensive silhouette, transparent background
```

#### Back Leg

```text
Dawn Paladin back leg as a strict side-profile gameplay asset, planted marching support leg, armored greave, stable infantry stance, transparent background
```

#### Front Leg

```text
Dawn Paladin front leg as a strict side-profile gameplay asset, forward pressure stance leg, armored boot and greave, transparent background
```

#### Cape

```text
Dawn Paladin cape as a strict side-profile gameplay asset, short disciplined back drape, minimal flourish, transparent background
```

#### Weapon

```text
Dawn Paladin weapon as a strict side-profile gameplay asset, long order spear, ceremonial but battlefield practical, readable profile, transparent background
```

#### Aura

```text
Dawn Paladin aura overlay as a strict side-profile gameplay asset, faint holy seal glow, restrained sacred cyan light, transparent background
```

## Sir Aurex

### Silhouette Rules

- Broader and heavier than rank-and-file
- Fortress-like chest mass
- Heavy command stance
- Immediate miniboss read in silhouette alone

### Part Prompts

#### Head

```text
Sir Aurex head as a strict side-profile gameplay asset, veteran commander helm or stern exposed face, authoritative profile, heavy reliquary crown detail, transparent background
```

#### Torso

```text
Sir Aurex torso as a strict side-profile gameplay asset, reinforced command armor, broad gorget, reliquary-grade plating, fortress-like chest silhouette, transparent background
```

#### Upper Arm

```text
Sir Aurex upper arm as a strict side-profile gameplay asset, oversized pauldron, boss-tier shoulder mass, rigid holy authority, transparent background
```

#### Lower Arm

```text
Sir Aurex lower arm as a strict side-profile gameplay asset, armored forearm with integrated tower-shield weight, severe command silhouette, transparent background
```

#### Back Leg

```text
Sir Aurex back leg as a strict side-profile gameplay asset, heavily planted rear leg, thick greave and boot, immovable stance, transparent background
```

#### Front Leg

```text
Sir Aurex front leg as a strict side-profile gameplay asset, advancing judge-like step, heavy plated boot, transparent background
```

#### Cape

```text
Sir Aurex cape as a strict side-profile gameplay asset, heavy mantle or command tabard, weighty and severe, transparent background
```

#### Weapon

```text
Sir Aurex weapon as a strict side-profile gameplay asset, judgment halberd or heavy spear-lance hybrid, boss-readable profile, transparent background
```

#### Aura

```text
Sir Aurex aura overlay as a strict side-profile gameplay asset, austere halo-seal glow, stern holy authority, transparent background
```

## Seraph Vale

### Silhouette Rules

- Tallest and cleanest profile
- Regal duelist line
- Halo crown clearly separated from head silhouette
- Final-boss read even in grayscale

### Part Prompts

#### Head

```text
Seraph Vale head as a strict side-profile gameplay asset, youthful but severe face or immaculate helm, sacred cyan halo crown separated from skull line, transparent background
```

#### Torso

```text
Seraph Vale torso as a strict side-profile gameplay asset, elegant ceremonial chest armor, sharp waist taper, immaculate authority, transparent background
```

#### Upper Arm

```text
Seraph Vale upper arm as a strict side-profile gameplay asset, refined duelist shoulder mass, clean ceremonial armor line, transparent background
```

#### Lower Arm

```text
Seraph Vale lower arm as a strict side-profile gameplay asset, blade-leading gauntlet, no shield mass, precise duelist profile, transparent background
```

#### Back Leg

```text
Seraph Vale back leg as a strict side-profile gameplay asset, poised rear duelist stance, immaculate greave, transparent background
```

#### Front Leg

```text
Seraph Vale front leg as a strict side-profile gameplay asset, longer aggressive step line for final-boss telegraphing, transparent background
```

#### Cape

```text
Seraph Vale cape as a strict side-profile gameplay asset, long split mantle, elegant ceremonial motion line, transparent background
```

#### Weapon

```text
Seraph Vale weapon as a strict side-profile gameplay asset, long oath blade, immaculate and threatening profile, final-boss readability, transparent background
```

#### Aura

```text
Seraph Vale aura overlay as a strict side-profile gameplay asset, sacred cyan halo filaments and radiant seal glow, strongest aura in the order set, transparent background
```

## Acceptance Criteria

- Each character remains readable at gameplay scale.
- `Dawn Paladin` reads as standard enemy, not boss.
- `Sir Aurex` reads as gate boss immediately.
- `Seraph Vale` reads as final boss before color.
- The three characters remain distinct by shape, not only palette.
- Shield-bearing characters keep shield mass on the arm silhouette without hiding torso telegraphs.
- Aura and halo shapes do not block pivot zones.
- Each part extracts cleanly without depending on background detail.

