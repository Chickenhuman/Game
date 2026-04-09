import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const rootDir = resolve(fileURLToPath(new URL("..", import.meta.url)));
const source = await readFile(resolve(rootDir, "web/game.js"), "utf8");

function extractLiteral(name) {
  const marker = `const ${name} = `;
  const start = source.indexOf(marker);
  if (start === -1) {
    throw new Error(`Could not find ${name} in web/game.js`);
  }

  let index = start + marker.length;
  while (/\s/.test(source[index])) {
    index += 1;
  }

  const open = source[index];
  const close = open === "{" ? "}" : open === "[" ? "]" : null;
  if (!close) {
    throw new Error(`Unsupported literal opener for ${name}: ${open}`);
  }

  let depth = 0;
  let stringQuote = null;
  let escaped = false;

  for (let i = index; i < source.length; i += 1) {
    const char = source[i];
    if (stringQuote) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === stringQuote) {
        stringQuote = null;
      }
      continue;
    }

    if (char === "\"" || char === "'" || char === "`") {
      stringQuote = char;
      continue;
    }
    if (char === open) {
      depth += 1;
      continue;
    }
    if (char === close) {
      depth -= 1;
      if (depth === 0) {
        return source.slice(index, i + 1);
      }
    }
  }

  throw new Error(`Unterminated literal for ${name}`);
}

function readDataLiteral(name) {
  const literal = extractLiteral(name);
  return vm.runInNewContext(`(${literal})`);
}

const WEAPONS = readDataLiteral("WEAPONS");
const RELICS = readDataLiteral("RELICS");
const ABILITIES = readDataLiteral("ABILITIES");
const CHECKPOINTS = readDataLiteral("CHECKPOINTS");
const FIXED_ROOM_REWARDS = readDataLiteral("FIXED_ROOM_REWARDS");
const ROOMS = readDataLiteral("ROOMS");

function hasExit(from, to) {
  return Object.values(ROOMS[from]?.exits || {}).some((exit) => exit.target === to);
}

function reachableRooms(unlockedAbilities) {
  const unlocked = new Set(unlockedAbilities);
  const visited = new Set(["hub_sanctuary"]);
  const queue = ["hub_sanctuary"];

  while (queue.length) {
    const roomId = queue.shift();
    for (const exit of Object.values(ROOMS[roomId]?.exits || {})) {
      if (exit.gate && !unlocked.has(exit.gate)) {
        continue;
      }
      if (!visited.has(exit.target)) {
        visited.add(exit.target);
        queue.push(exit.target);
      }
    }
  }

  return visited;
}

function expectReachable(rooms, id, message) {
  assert(rooms.has(id), message);
}

function expectBlocked(rooms, id, message) {
  assert(!rooms.has(id), message);
}

for (const [roomId, room] of Object.entries(ROOMS)) {
  for (const [direction, exit] of Object.entries(room.exits || {})) {
    assert(ROOMS[exit.target], `Room ${roomId}.${direction} points to missing room ${exit.target}`);
    if (exit.gate) {
      assert(ABILITIES[exit.gate], `Room ${roomId}.${direction} uses unknown gate ability ${exit.gate}`);
    }
  }
}

for (const roomId of Object.keys(CHECKPOINTS)) {
  assert(ROOMS[roomId], `Checkpoint room ${roomId} is missing from ROOMS`);
}

for (const [roomId, rewards] of Object.entries(FIXED_ROOM_REWARDS)) {
  assert(ROOMS[roomId], `Fixed reward room ${roomId} is missing from ROOMS`);
  for (const reward of rewards) {
    assert(["weapon", "relic", "memory_shard", "ash"].includes(reward.type), `Unsupported reward type ${reward.type} in ${roomId}`);
    if (reward.type === "weapon") {
      assert(WEAPONS[reward.weaponId], `Reward room ${roomId} references missing weapon ${reward.weaponId}`);
    }
    if (reward.type === "relic") {
      assert(RELICS[reward.relicId], `Reward room ${roomId} references missing relic ${reward.relicId}`);
    }
  }
}

assert(ABILITIES.cinder_dive, "Cinder Dive ability is missing");
assert(ABILITIES.chain_grapple, "Chain Grapple ability is missing");
assert(ABILITIES.black_wing, "Black Wing ability is missing");

const requiredRooms = [
  "hub_sanctuary",
  "bellwright_forge",
  "archive_cloister",
  "prayer_cistern",
  "aurex_arena",
  "reliquary_archive",
  "mirror_choir",
  "sealed_roof",
  "seraph_sanctum"
];
requiredRooms.forEach((roomId) => assert(ROOMS[roomId], `Required room ${roomId} is missing`));

assert(hasExit("hub_sanctuary", "bellwright_forge") && hasExit("bellwright_forge", "hub_sanctuary"), "Hub <-> Forge split is not bidirectional");
assert(hasExit("hub_sanctuary", "archive_cloister") && hasExit("archive_cloister", "hub_sanctuary"), "Hub <-> Archive split is not bidirectional");
assert(hasExit("fallen_armory", "banner_ossuary") && hasExit("banner_ossuary", "fallen_armory"), "Ashfall side ring between Fallen Armory and Banner Ossuary is incomplete");
assert(hasExit("banner_ossuary", "prayer_cistern") && hasExit("prayer_cistern", "banner_ossuary"), "Ashfall side ring between Banner Ossuary and Prayer Cistern is incomplete");
assert(hasExit("reliquary_lift", "prayer_cistern") && hasExit("prayer_cistern", "reliquary_lift"), "Prayer Cistern <-> Reliquary Lift shortcut is incomplete");
assert(hasExit("thorns_vault", "bell_tower") && hasExit("bell_tower", "thorns_vault"), "Reliquary upper loop between Thorns Vault and Bell Tower is incomplete");
assert(hasExit("bell_tower", "sunken_cells") && hasExit("sunken_cells", "bell_tower"), "Reliquary side loop between Bell Tower and Sunken Cells is incomplete");
assert(hasExit("scriptorium", "sealed_roof") && hasExit("sealed_roof", "scriptorium"), "Mirror side loop between Scriptorium and Sealed Roof is incomplete");

const startReachable = reachableRooms([]);
expectReachable(startReachable, "archive_cloister", "Archive Cloister should be reachable from the start");
expectReachable(startReachable, "prayer_cistern", "Prayer Cistern should be reachable from the start");
expectReachable(startReachable, "aurex_arena", "Hall of Mercy should remain reachable before unlocking extra abilities");
expectBlocked(startReachable, "reliquary_archive", "Reliquary Archive should remain gated before Chain Grapple");
expectBlocked(startReachable, "thorns_vault", "Thorns Vault should remain gated before Chain Grapple");
expectBlocked(startReachable, "sealed_roof", "Sealed Roof should remain gated before Black Wing");

const cinderReachable = reachableRooms(["cinder_dive"]);
expectReachable(cinderReachable, "fallen_armory", "Fallen Armory should be reachable after Cinder Dive");
expectReachable(cinderReachable, "bellwright_forge", "Bellwright Forge should stay reachable after Cinder Dive");
expectBlocked(cinderReachable, "reliquary_archive", "Reliquary Archive should not unlock with only Cinder Dive");

const chainReachable = reachableRooms(["cinder_dive", "chain_grapple"]);
expectReachable(chainReachable, "reliquary_archive", "Reliquary Archive should unlock with Chain Grapple");
expectReachable(chainReachable, "thorns_vault", "Thorns Vault should unlock with Chain Grapple");
expectReachable(chainReachable, "bell_tower", "Bell Tower should unlock with Chain Grapple");
expectReachable(chainReachable, "sunken_cells", "Sunken Cells should unlock once the midgame loop opens");
expectReachable(chainReachable, "mirror_choir", "Choir of Glass should remain on the main path after Chain Grapple");
expectBlocked(chainReachable, "sealed_roof", "Sealed Roof should remain gated before Black Wing");
expectBlocked(chainReachable, "seraph_sanctum", "Seraph Sanctum should remain gated before Black Wing");

const lateReachable = reachableRooms(["cinder_dive", "chain_grapple", "black_wing"]);
expectReachable(lateReachable, "sealed_roof", "Sealed Roof should unlock with Black Wing");
expectReachable(lateReachable, "seraph_sanctum", "Seraph Sanctum should unlock with Black Wing");
expectReachable(lateReachable, "scriptorium", "Scriptorium should stay connected in the late-game loop");

assert(/ability:\s*\[\s*"KeyA"\s*\]/.test(source), "Ability control should be bound to KeyA");
assert(/skill:\s*\[\s*"KeyS"\s*\]/.test(source), "Weapon skill control should be bound to KeyS");
assert(/room\.id === "prayer_cistern" && !hasAbility\("cinder_dive"\)/.test(source), "Prayer Cistern altar hook for Cinder Dive is missing");
assert(/room\.id === "mirror_choir" && !hasAbility\("black_wing"\)/.test(source), "Mirror Choir altar hook for Black Wing is missing");

const rootIndex = await readFile(resolve(rootDir, "index.html"), "utf8");
const webIndex = await readFile(resolve(rootDir, "web/index.html"), "utf8");
for (const [label, html] of [["root", rootIndex], ["web", webIndex]]) {
  assert(html.includes('id="goalText"'), `${label} index is missing the dynamic goal element`);
  assert(html.includes('data-i18n="ctrl_ability_label"'), `${label} index is missing the ability control row`);
  assert(html.includes('data-i18n="ctrl_skill_label"'), `${label} index is missing the weapon skill control row`);
  assert(!html.includes('data-i18n="ctrl_new_run_label"'), `${label} index still exposes the removed gameplay new-run control row`);
}

console.log("validate-web-remake: all structural checks passed");
