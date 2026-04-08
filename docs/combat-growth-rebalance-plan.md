# Black Halo Combat And Growth Rebalance Plan

## Goals
- Expand enemy threat ranges so encounters start before the player is already touching the enemy.
- Lower the player's starting power hard enough that early rooms feel dangerous again.
- Replace some of the current front-loaded power with a kill-point growth loop that persists across runs.
- Add clear startup frames to player attacks so offense carries commitment and risk.

## Problems In The Current Prototype
- Several enemy attacks only trigger at short distances, so enemies often shuffle into melee before doing anything readable.
- The player begins with high health and solid damage, which compresses the early-game decision space.
- Progression is mostly gated by room scripts and bosses instead of a steady earn-and-grow loop.
- Player attacks become active quickly enough that opening offense is too safe.

## Implementation Scope
- Target files:
  - `docs/combat-growth-rebalance-plan.md`
  - `web/game.js`
- No engine migration.
- No art pass.
- Keep the current room graph and boss order intact.

## System Changes

### 1. Enemy Threat Range Expansion
- Increase enemy attack decision ranges for every normal enemy and both bosses.
- Increase the actual hit geometry of melee strikes so the visual swing or thrust threatens more space.
- Increase projectile travel distance for direct and arc patterns while keeping them dodgeable and parryable.
- Keep telegraph timing intact or slightly longer when necessary so the larger range does not become unfair.

### 2. Lower Base Character Power
- Reduce base run health from `100` to a much lower starting value.
- Reduce base weapon damage and Gloom generation so the player cannot bulldoze the opening rooms.
- Keep movement responsive, but tie survivability and damage recovery to progression rather than the default loadout.

### 3. Kill-Point Growth Loop
- Reuse `Imprint` as the persistent point currency earned from enemy kills.
- Lower per-kill payouts to small increments so progression happens across repeated fights instead of one large burst.
- Add hub-based upgrade interactions that spend Imprint on permanent growth.
- Growth lanes:
  - `Vigor`: max health upgrades
  - `Might`: weapon damage upgrades
  - `Focus`: Gloom gain and skill efficiency upgrades
  - `Mobility`: unlock `Chain Grapple`, then `Black Wing`
- Persist upgrades in save data and re-derive run stats from those upgrades.

### 4. Player Attack Startup
- Add explicit startup time before a player attack begins its real sweep.
- During startup, the player should commit to the attack and visually draw the weapon back.
- Only allow the active hit window after startup finishes.
- Make heavy and skill attacks commit longer than light attacks.

## Planned Tuning

### Starting Power
- Base max health: `60`
- Base weapon damage: roughly `35%` lower than the current version
- Base Gloom generation: slightly reduced

### Kill Rewards
- Normal enemies: `1` Imprint
- Elites or bosses: larger but still bounded reward spikes
- Room rewards remain, but kill income becomes the main long-term growth source

### Permanent Upgrades
- `Vigor I-III`: increase max health in chunks
- `Might I-III`: increase all weapon damage multiplicatively
- `Focus I-II`: improve Gloom gain and reduce skill strain
- `Chain Grapple`: Imprint purchase in the hub
- `Black Wing`: Imprint purchase after `Chain Grapple`

### Enemy Range
- Shield, lancer, inquisitor, hound, and both bosses all receive wider trigger windows and longer hit segments.
- Choir projectiles travel farther before dissipating.

## UI And Save Impact
- Save data must persist purchased upgrades.
- The hub interaction set needs new upgrade nodes or altars.
- The status panel should still show Imprint, and ability text must reflect purchased mobility unlocks.

## Validation
- `node --check web/game.js`
- `npm run check:web`
- Manual spot-check logic:
  - new runs start noticeably weaker
  - kills grant small Imprint increments
  - hub upgrades spend Imprint and persist
  - `Chain Grapple` and `Black Wing` can be unlocked through upgrades
  - enemy attacks start from farther away and still remain telegraphed
  - player attacks now have readable startup commitment
