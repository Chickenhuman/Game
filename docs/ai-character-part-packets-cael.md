# Cael Ashborne Part Pack

External generation spec for Imagen-style artwork. This document defines the deliverables for Cael Ashborne as layered cutout art, ready for 2D side-view gameplay assembly.

## Target Output

- Subject: Cael Ashborne, fallen hero, side-profile gameplay character
- Style: premium gothic dark fantasy illustration with clean cutout separation
- Use: layered animation in a side-scroller
- Deliverable set: one file per part plus optional aura overlays

## Naming Rules

- Use lowercase snake case.
- Prefix every asset with `cael_`.
- Use the exact part names below.
- Version each final selected output with `_v01`, `_v02`, etc.
- Recommended names:
  - `cael_head_v01.png`
  - `cael_torso_v01.png`
  - `cael_upper_arm_v01.png`
  - `cael_lower_arm_v01.png`
  - `cael_back_leg_v01.png`
  - `cael_front_leg_v01.png`
  - `cael_cape_v01.png`
  - `cael_weapon_v01.png`
  - `cael_aura_v01.png`

## Canvas Guidance

- Preferred canvas: `2048 x 2048` per part.
- Keep the subject centered with generous padding.
- Render each part in strict side view unless the part needs a slight angle for readability.
- Leave full bleed around the silhouette for clean background removal.
- Do not crop limbs at the edges unless the part is intentionally long, like the weapon or cape.

## Transparent Background Rules

- Request transparent background for every part.
- Avoid scenic backdrops inside the part files.
- Avoid outer glows that merge into the background.
- Keep the silhouette fully separated from any cast shadow.
- If the model insists on a background, request flat mid-gray only for intermediate generation, then remove it before export.

## Pivot Guidance

- `head`: pivot at the base of the neck.
- `torso`: pivot at the upper spine, just below the collar.
- `upper arm`: pivot at the shoulder joint.
- `lower arm`: pivot at the elbow joint.
- `back leg`: pivot at the hip joint.
- `front leg`: pivot at the hip joint.
- `cape`: pivot near the upper clasp at the shoulder blades.
- `weapon`: pivot at the hand grip or weapon hilt.
- `aura`: pivot centered behind the torso.

## Negative Prompt Set

Use this on every generation:

```text
no front view, no three-quarter portrait, no chibi proportions, no modern clothing, no firearms,
no extra limbs, no disconnected hands, no cropped feet, no background scenery, no text,
no watermark, no frame, no blur, no low detail silhouette, no toy-like proportions
```

## Part Prompts

### Head

```text
Cael Ashborne head as a strict side-profile gameplay asset, fallen heroic features, damaged halo fragments,
scarred face, tired expression, darkened hair, ash-streaked skin, broken sanctified dignity, transparent background,
clean edge separation for cutout animation, readable silhouette at gameplay scale
```

### Torso

```text
Cael Ashborne torso as a strict side-profile gameplay asset, broken ceremonial armor, frayed straps,
scarred chest plate, asymmetrical holy corruption marks, battle-worn plating, layered armor masses,
transparent background, clean edge separation for cutout animation, readable silhouette at gameplay scale
```

### Upper Arm

```text
Cael Ashborne upper arm as a strict side-profile gameplay asset, armored shoulder and bicep, torn cloth wrap,
battle-ready form, strong readable mass, transparent background, clean edge separation, gameplay-scale clarity
```

### Lower Arm

```text
Cael Ashborne lower arm as a strict side-profile gameplay asset, gauntlet forearm, hand positioned for weapon grip,
slightly battered armor, transparent background, clean edge separation, gameplay-scale clarity
```

### Back Leg

```text
Cael Ashborne back leg as a strict side-profile gameplay asset, weight-bearing rear leg, battle boots,
armor plates and cloth split clearly, transparent background, clean edge separation, gameplay-scale clarity
```

### Front Leg

```text
Cael Ashborne front leg as a strict side-profile gameplay asset, forward stepping leg, battle boots,
slightly more aggressive stance than the back leg, transparent background, clean edge separation, gameplay-scale clarity
```

### Cape

```text
Cael Ashborne cape as a strict side-profile gameplay asset, torn and asymmetrical cloth, stained and wind-swept,
broken noble silhouette, transparent background, clean edge separation, gameplay-scale clarity
```

### Weapon

```text
Cael Ashborne weapon as a strict side-profile gameplay asset, oversized cursed greatblade,
heavy ceremonial steel, cracked sacred inlay, intimidating readable profile, transparent background,
clean edge separation, gameplay-scale clarity
```

### Aura

```text
Cael Ashborne aura overlay as a strict side-profile gameplay asset, corrupted holy aura, fractured halo glow,
subtle ash-black and sacred cyan effects, transparent background, no hard shadow, gameplay-scale clarity
```

## Acceptance Criteria

- Each part is legible at `128 px` height and still recognizable in motion.
- The silhouette reads as a fallen hero, not a generic knight.
- The head, torso, limbs, cape, weapon, and aura can be separated without visual tears.
- The weapon remains readable in profile and does not obscure the torso.
- The cape and aura do not hide the body anchor points.
- The whole set feels like one character, with consistent palette and material language.
- No part depends on background detail to read correctly.

