# Black Halo QA Checklist

## Core feel

- Player movement responds immediately with keyboard and controller.
- Dash grants invulnerability and does not trap the player in collision.
- Light, heavy, skill, and parry each feel distinct.
- Gloom gain and spending are visible and understandable.

## Room flow

- Main route remains stable across different seeds.
- Only the intended side rooms activate per seeded run.
- Locked exits clearly report the missing ability.
- Returning to previous rooms preserves unlocked progression.

## Progression

- `Chain Grapple` unlocks after `Sir Aurex`.
- `Black Wing` unlocks from the `Mirror Choir` altar.
- Bosses do not respawn after defeat in the same run.
- Room rewards cannot be claimed repeatedly in the same run.

## Save and restore

- Fresh launch creates a profile.
- Save file survives restart with meta progression intact.
- Current run room, health, relics, and abilities restore correctly.
- Damaged or missing fields degrade gracefully instead of crashing.

## Visual pipeline

- All referenced SVG assets import correctly in Godot.
- Character part anchors remain aligned during idle, dash, attack, and parry.
- Backdrop art reads clearly against gameplay silhouettes.
- HUD frame never obscures critical text or bars.

## Boss gates

- `Sir Aurex` fight transitions phases correctly.
- `Seraph Vale` enters all three phases.
- Final sanctum stays locked until `Black Wing` is unlocked.
- Final victory sets the story flag and does not softlock the run.

