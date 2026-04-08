const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const roomNameEl = document.getElementById("roomName");
const messageEl = document.getElementById("messageText");
const statsEl = document.getElementById("stats");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const FLOOR_Y = 760;
const GRAVITY = 2200;
const STORAGE_KEY = "black_halo_web_save_v1";
const ROOM_SIZE = { width: WIDTH, height: HEIGHT };

const COLORS = {
  ink: "#f2ead7",
  muted: "#c2b7a0",
  gold: "#a88c57",
  crimson: "#7f1d2b",
  cyan: "#7ad7e0",
  ivory: "#e3dbc7",
  stone: "#3b3742",
  charcoal: "#1b1a20",
  floor: "#2a252e"
};

const WEAPONS = {
  fallen_greatblade: {
    id: "fallen_greatblade",
    name: "Fallen Greatblade",
    baseDamage: 18,
    heavyDamage: 34,
    reach: 132,
    stagger: 0.34,
    gloomGain: 9,
    skill: "Ash Breaker",
    bladeLength: 192,
    bladeWidth: 24,
    gripOffset: { x: 28, y: -84 },
    profiles: {
      light: {
        duration: 0.24,
        activeStart: 0.14,
        activeEnd: 0.74,
        startAngle: -2.15,
        endAngle: 0.45,
        trailColor: "#efe7d4",
        glowColor: "rgba(227,219,199,0.42)"
      },
      heavy: {
        duration: 0.38,
        activeStart: 0.18,
        activeEnd: 0.86,
        startAngle: -2.4,
        endAngle: 0.92,
        trailColor: "#d8b46a",
        glowColor: "rgba(168,140,87,0.44)"
      },
      skill: {
        duration: 0.46,
        activeStart: 0.12,
        activeEnd: 0.9,
        startAngle: -2.2,
        endAngle: 1.05,
        trailColor: "#7ad7e0",
        glowColor: "rgba(122,215,224,0.48)"
      }
    }
  },
  chain_glaive: {
    id: "chain_glaive",
    name: "Chain Glaive",
    baseDamage: 14,
    heavyDamage: 26,
    reach: 156,
    stagger: 0.28,
    gloomGain: 10,
    skill: "Grief Spiral",
    bladeLength: 176,
    bladeWidth: 18,
    gripOffset: { x: 30, y: -82 },
    profiles: {
      light: {
        duration: 0.2,
        activeStart: 0.1,
        activeEnd: 0.78,
        startAngle: -1.9,
        endAngle: 0.62,
        trailColor: "#efe7d4",
        glowColor: "rgba(227,219,199,0.34)"
      },
      heavy: {
        duration: 0.34,
        activeStart: 0.12,
        activeEnd: 0.88,
        startAngle: -2.3,
        endAngle: 1.16,
        trailColor: "#d8b46a",
        glowColor: "rgba(168,140,87,0.42)"
      },
      skill: {
        duration: 0.44,
        activeStart: 0.08,
        activeEnd: 0.94,
        startAngle: -2.6,
        endAngle: 1.36,
        trailColor: "#7ad7e0",
        glowColor: "rgba(122,215,224,0.52)"
      }
    }
  }
};

const OATHS = {
  execution: {
    id: "execution",
    name: "Execution",
    damageMultiplier: 1.15,
    gloomMultiplier: 1
  },
  pursuit: {
    id: "pursuit",
    name: "Pursuit",
    damageMultiplier: 1,
    gloomMultiplier: 1.2,
    moveBonus: 28
  },
  silence: {
    id: "silence",
    name: "Silence",
    damageMultiplier: 1,
    gloomMultiplier: 1.08,
    parryBonus: 0.08
  }
};

const RELICS = {
  ember_bead: {
    id: "ember_bead",
    name: "Ember Bead",
    description: "Gain more Gloom from aggression.",
    modifiers: { gloomBonus: 0.2 }
  },
  oath_nail: {
    id: "oath_nail",
    name: "Oath Nail",
    description: "Heavy attacks stagger harder.",
    modifiers: { heavyBonus: 8 }
  },
  veil_ribbon: {
    id: "veil_ribbon",
    name: "Veil Ribbon",
    description: "The parry window opens a little wider.",
    modifiers: { parryBonus: 0.05 }
  },
  crypt_salt: {
    id: "crypt_salt",
    name: "Crypt Salt",
    description: "Recover a little health after clearing a room.",
    modifiers: { roomHeal: 6 }
  },
  choir_censer: {
    id: "choir_censer",
    name: "Choir Censer",
    description: "Skill attacks burn hotter.",
    modifiers: { skillBonus: 10 }
  }
};

const ABILITIES = {
  chain_grapple: {
    id: "chain_grapple",
    name: "Chain Grapple",
    description: "Latch onto anchors and fling upward."
  },
  black_wing: {
    id: "black_wing",
    name: "Black Wing",
    description: "A second jump born from ash and memory."
  }
};

const ENEMIES = {
  shield_paladin: {
    id: "shield_paladin",
    name: "Shield Paladin",
    drawKind: "shield_paladin",
    maxHealth: 58,
    speed: 86,
    damage: 12,
    reach: 86,
    attackWindup: 0.38
  },
  lancer: {
    id: "lancer",
    name: "Lancer",
    drawKind: "lancer",
    maxHealth: 46,
    speed: 124,
    damage: 11,
    reach: 132,
    attackWindup: 0.28
  },
  choir_adept: {
    id: "choir_adept",
    name: "Choir Adept",
    drawKind: "choir_adept",
    maxHealth: 36,
    speed: 72,
    damage: 9,
    reach: 168,
    attackWindup: 0.6,
    ranged: true
  },
  inquisitor: {
    id: "inquisitor",
    name: "Inquisitor",
    drawKind: "inquisitor",
    maxHealth: 50,
    speed: 148,
    damage: 12,
    reach: 108,
    attackWindup: 0.3
  },
  blessed_hound: {
    id: "blessed_hound",
    name: "Blessed Hound",
    drawKind: "hound",
    maxHealth: 40,
    speed: 176,
    damage: 8,
    reach: 86,
    attackWindup: 0.22
  }
};

const BOSSES = {
  sir_aurex: {
    id: "sir_aurex",
    name: "Sir Aurex",
    drawKind: "aurex",
    maxHealth: 220,
    speed: 118,
    damage: 15,
    reach: 132,
    phases: [
      { threshold: 1, name: "Mercy Bound", specialCooldown: 3.2 },
      { threshold: 0.48, name: "Mercy Broken", specialCooldown: 2.1 }
    ]
  },
  seraph_vale: {
    id: "seraph_vale",
    name: "Seraph Vale",
    drawKind: "seraph",
    maxHealth: 340,
    speed: 154,
    damage: 18,
    reach: 148,
    phases: [
      { threshold: 1, name: "Second Dawn", specialCooldown: 3.1 },
      { threshold: 0.66, name: "Holy Pursuit", specialCooldown: 2.2 },
      { threshold: 0.34, name: "Radiant Collapse", specialCooldown: 1.5 }
    ]
  }
};

const SIDE_ROOM_IDS = [
  "fallen_armory",
  "banner_ossuary",
  "prayer_cistern",
  "thorns_vault",
  "sunken_cells",
  "bell_tower",
  "scriptorium",
  "sealed_roof"
];

const ROOMS = {
  hub_sanctuary: {
    id: "hub_sanctuary",
    name: "Sanctuary of Ash",
    sector: "ashfall",
    layout: "hub",
    mainPath: true,
    exits: {
      right: {
        target: "ashfall_gate",
        label: "March into the Bastion",
        spawnTag: "left"
      }
    }
  },
  ashfall_gate: {
    id: "ashfall_gate",
    name: "Ashfall Gate",
    sector: "ashfall",
    layout: "gate",
    mainPath: true,
    enemies: ["shield_paladin"],
    exits: {
      left: { target: "hub_sanctuary", label: "Return to Sanctuary", spawnTag: "right" },
      right: { target: "ashfall_rampart", label: "Advance the Rampart", spawnTag: "left" },
      up: { target: "fallen_armory", label: "Side Path: Fallen Armory", spawnTag: "down" }
    }
  },
  ashfall_rampart: {
    id: "ashfall_rampart",
    name: "Torn Rampart",
    sector: "ashfall",
    layout: "rampart",
    mainPath: true,
    enemies: ["lancer", "blessed_hound"],
    exits: {
      left: { target: "ashfall_gate", label: "Back to the Gate", spawnTag: "right" },
      right: { target: "ashfall_crypt", label: "Descend the Crypt", spawnTag: "left" },
      down: { target: "banner_ossuary", label: "Side Path: Banner Ossuary", spawnTag: "up" }
    }
  },
  ashfall_crypt: {
    id: "ashfall_crypt",
    name: "Crypt Threshold",
    sector: "ashfall",
    layout: "crypt",
    mainPath: true,
    enemies: ["shield_paladin", "choir_adept"],
    exits: {
      left: { target: "ashfall_rampart", label: "Climb to the Rampart", spawnTag: "right" },
      right: { target: "reliquary_lift", label: "Enter the Shaft", spawnTag: "left" },
      down: { target: "prayer_cistern", label: "Side Path: Prayer Cistern", spawnTag: "up" }
    }
  },
  reliquary_lift: {
    id: "reliquary_lift",
    name: "Reliquary Lift",
    sector: "reliquary",
    layout: "lift",
    mainPath: true,
    enemies: ["lancer", "inquisitor"],
    exits: {
      left: { target: "ashfall_crypt", label: "Return to the Crypt", spawnTag: "right" },
      right: { target: "aurex_arena", label: "Face Sir Aurex", spawnTag: "left" },
      up: {
        target: "thorns_vault",
        label: "Side Path: Thorns Vault",
        spawnTag: "down",
        gate: "chain_grapple"
      }
    }
  },
  aurex_arena: {
    id: "aurex_arena",
    name: "Hall of Mercy",
    sector: "reliquary",
    layout: "arena",
    mainPath: true,
    boss: "sir_aurex",
    exits: {
      left: { target: "reliquary_lift", label: "Retreat to the Lift", spawnTag: "right" },
      right: {
        target: "reliquary_archive",
        label: "Advance to the Archive",
        spawnTag: "left",
        gate: "chain_grapple"
      }
    }
  },
  reliquary_archive: {
    id: "reliquary_archive",
    name: "Reliquary Archive",
    sector: "reliquary",
    layout: "bridge",
    mainPath: true,
    enemies: ["choir_adept", "inquisitor"],
    exits: {
      left: { target: "aurex_arena", label: "Return to Aurex Hall", spawnTag: "right" },
      right: { target: "mirror_bridge", label: "Cross the Mirror Bridge", spawnTag: "left" },
      up: { target: "bell_tower", label: "Side Path: Bell Tower", spawnTag: "down" },
      down: { target: "sunken_cells", label: "Side Path: Sunken Cells", spawnTag: "up" }
    }
  },
  mirror_bridge: {
    id: "mirror_bridge",
    name: "Mirror Bridge",
    sector: "mirror",
    layout: "bridge",
    mainPath: true,
    enemies: ["shield_paladin", "lancer", "blessed_hound"],
    exits: {
      left: { target: "reliquary_archive", label: "Back to the Archive", spawnTag: "right" },
      right: { target: "mirror_choir", label: "Enter the Choir", spawnTag: "left" },
      down: { target: "scriptorium", label: "Side Path: Lost Scriptorium", spawnTag: "up" }
    }
  },
  mirror_choir: {
    id: "mirror_choir",
    name: "Choir of Glass",
    sector: "mirror",
    layout: "choir",
    mainPath: true,
    enemies: ["choir_adept", "inquisitor"],
    exits: {
      left: { target: "mirror_bridge", label: "Return to the Bridge", spawnTag: "right" },
      right: {
        target: "seraph_sanctum",
        label: "Confront Seraph Vale",
        spawnTag: "left",
        gate: "black_wing"
      },
      up: {
        target: "sealed_roof",
        label: "Side Path: Sealed Roof",
        spawnTag: "down",
        gate: "black_wing"
      }
    }
  },
  seraph_sanctum: {
    id: "seraph_sanctum",
    name: "Sanctum of the Second Dawn",
    sector: "mirror",
    layout: "finale",
    mainPath: true,
    boss: "seraph_vale",
    exits: {
      left: { target: "mirror_choir", label: "Return to the Choir", spawnTag: "right" }
    }
  },
  fallen_armory: {
    id: "fallen_armory",
    name: "Fallen Armory",
    sector: "ashfall",
    layout: "armory",
    mainPath: false,
    enemies: ["shield_paladin"],
    rewards: ["ash_cache"],
    exits: {
      down: { target: "ashfall_gate", label: "Back to the Gate", spawnTag: "up" }
    }
  },
  banner_ossuary: {
    id: "banner_ossuary",
    name: "Banner Ossuary",
    sector: "ashfall",
    layout: "crypt",
    mainPath: false,
    enemies: ["blessed_hound"],
    rewards: ["memory_shard"],
    exits: {
      up: { target: "ashfall_rampart", label: "Back to the Rampart", spawnTag: "down" }
    }
  },
  prayer_cistern: {
    id: "prayer_cistern",
    name: "Prayer Cistern",
    sector: "ashfall",
    layout: "crypt",
    mainPath: false,
    enemies: ["lancer"],
    rewards: ["relic"],
    exits: {
      up: { target: "ashfall_crypt", label: "Back to the Crypt", spawnTag: "down" }
    }
  },
  thorns_vault: {
    id: "thorns_vault",
    name: "Thorns Vault",
    sector: "reliquary",
    layout: "lift",
    mainPath: false,
    enemies: ["inquisitor"],
    rewards: ["ash_cache"],
    exits: {
      down: { target: "reliquary_lift", label: "Back to the Lift", spawnTag: "up" }
    }
  },
  sunken_cells: {
    id: "sunken_cells",
    name: "Sunken Cells",
    sector: "reliquary",
    layout: "arena",
    mainPath: false,
    enemies: ["shield_paladin", "choir_adept"],
    rewards: ["relic"],
    exits: {
      up: { target: "reliquary_archive", label: "Back to the Archive", spawnTag: "down" }
    }
  },
  bell_tower: {
    id: "bell_tower",
    name: "Bell Tower",
    sector: "reliquary",
    layout: "bridge",
    mainPath: false,
    enemies: ["lancer"],
    rewards: ["memory_shard"],
    exits: {
      down: { target: "reliquary_archive", label: "Back to the Archive", spawnTag: "up" }
    }
  },
  scriptorium: {
    id: "scriptorium",
    name: "Lost Scriptorium",
    sector: "mirror",
    layout: "bridge",
    mainPath: false,
    enemies: ["inquisitor"],
    rewards: ["relic"],
    exits: {
      up: { target: "mirror_bridge", label: "Back to the Bridge", spawnTag: "down" }
    }
  },
  sealed_roof: {
    id: "sealed_roof",
    name: "Sealed Roof",
    sector: "mirror",
    layout: "finale",
    mainPath: false,
    enemies: ["blessed_hound", "lancer"],
    rewards: ["ash_cache"],
    exits: {
      down: { target: "mirror_choir", label: "Back to the Choir", spawnTag: "up" }
    }
  }
};

const DIALOGUE = {
  hub_intro: "Brother Niv: The kingdom named you blasphemy. The walls remember another title.",
  mara_forge: "Mara Bellwright: Pick your edge carefully. The bastion forgives nothing.",
  joren_oath: "Sir Joren: Every oath is a chain. Choose the one you can bear.",
  aurex_intro: "Sir Aurex: Mercy belongs to the obedient. Kneel, and I may make your death brief.",
  aurex_shift: "Sir Aurex: Then I will break mercy itself.",
  aurex_defeat: "Cael Ashborne: Your mercy was another blade. I carry the chain onward.",
  black_wing_unlock: "Memory of Cael: Even ash remembers how to rise.",
  seraph_intro: "Seraph Vale: They made me in your image. I chose to surpass it.",
  seraph_shift_1: "Seraph Vale: You taught the kingdom how to fear. I taught it how to endure.",
  seraph_shift_2: "Seraph Vale: Then come, predecessor. Let the second dawn bury the first.",
  seraph_defeat: "Seraph Vale: If I fall... do not let them make a third."
};

const CONTROLS = {
  moveLeft: ["ArrowLeft"],
  moveRight: ["ArrowRight"],
  jump: ["Space", "ArrowUp"],
  lightAttack: ["KeyZ"],
  heavyAttack: ["KeyX"],
  dash: ["KeyC"],
  parry: ["KeyV"],
  skill: ["KeyA"],
  interact: ["ArrowDown", "Enter"],
  newRun: ["KeyN"]
};

const input = {
  down: new Set(),
  pressed: new Set()
};

window.addEventListener("keydown", (event) => {
  if (!input.down.has(event.code)) {
    input.pressed.add(event.code);
  }
  input.down.add(event.code);
  const reservedCodes = Object.values(CONTROLS).flat();
  if (reservedCodes.includes(event.code)) {
    event.preventDefault();
  }
});

window.addEventListener("keyup", (event) => {
  input.down.delete(event.code);
});

function isDown(...codes) {
  return codes.some((code) => input.down.has(code));
}

function wasPressed(...codes) {
  return codes.some((code) => input.pressed.has(code));
}

function clearPressed() {
  input.pressed.clear();
}

function mulberry32(seed) {
  return function random() {
    let t = seed += 0x6d2b79f5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickFrom(array, random) {
  return array[Math.floor(random() * array.length)];
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function clamp01(value) {
  return clamp(value, 0, 1);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function easeOutCubic(value) {
  const t = 1 - clamp01(value);
  return 1 - t * t * t;
}

function easeInOutCubic(value) {
  const t = clamp01(value);
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function overlaps(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

function rectFromEntity(entity) {
  return {
    x: entity.x - entity.w / 2,
    y: entity.y - entity.h / 2,
    w: entity.w,
    h: entity.h
  };
}

function distance(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.hypot(dx, dy);
}

function randomRange(min, max) {
  return lerp(min, max, Math.random());
}

function angleForFacing(angle, facing) {
  return facing === 1 ? angle : Math.PI - angle;
}

function rotateFromAngle(angle, length) {
  return {
    x: Math.cos(angle) * length,
    y: Math.sin(angle) * length
  };
}

function pointToSegmentDistance(px, py, ax, ay, bx, by) {
  const abx = bx - ax;
  const aby = by - ay;
  const abLengthSq = abx * abx + aby * aby;
  if (abLengthSq === 0) {
    return Math.hypot(px - ax, py - ay);
  }
  const t = clamp01(((px - ax) * abx + (py - ay) * aby) / abLengthSq);
  const sx = ax + abx * t;
  const sy = ay + aby * t;
  return Math.hypot(px - sx, py - sy);
}

function closestPointOnSegment(px, py, ax, ay, bx, by) {
  const abx = bx - ax;
  const aby = by - ay;
  const abLengthSq = abx * abx + aby * aby;
  if (abLengthSq === 0) {
    return { x: ax, y: ay, t: 0 };
  }
  const t = clamp01(((px - ax) * abx + (py - ay) * aby) / abLengthSq);
  return {
    x: ax + abx * t,
    y: ay + aby * t,
    t
  };
}

function createDefaultMeta() {
  return {
    unlockedAbilities: [],
    unlockedWeapons: ["fallen_greatblade", "chain_glaive"],
    memoryShards: [],
    storyFlags: ["intro_awake"],
    ash: 25
  };
}

function pickSideRooms(seed) {
  const random = mulberry32(seed ^ 0x7f4a7c15);
  const pool = [...SIDE_ROOM_IDS];
  const picked = [];
  while (pool.length && picked.length < 4) {
    const index = Math.floor(random() * pool.length);
    picked.push(pool.splice(index, 1)[0]);
  }
  return picked;
}

function createRun(seed = Math.floor(Math.random() * 2147483647)) {
  const random = mulberry32(seed);
  const relicIds = Object.keys(RELICS);
  return {
    seed,
    currentRoom: "hub_sanctuary",
    health: 100,
    maxHealth: 100,
    gloom: 0,
    relics: [pickFrom(relicIds, random)],
    visitedRooms: ["hub_sanctuary"],
    defeatedBosses: [],
    claimedRewards: [],
    activeSideRooms: pickSideRooms(seed),
    temporaryCurrency: 0,
    currentWeapon: "fallen_greatblade",
    oath: "execution",
    playerSpawnTag: "start"
  };
}

function sanitizeMeta(raw) {
  const meta = createDefaultMeta();
  if (!raw || typeof raw !== "object") {
    return meta;
  }
  meta.unlockedAbilities = Array.isArray(raw.unlockedAbilities)
    ? raw.unlockedAbilities.filter((id) => ABILITIES[id])
    : [];
  meta.unlockedWeapons = Array.isArray(raw.unlockedWeapons)
    ? raw.unlockedWeapons.filter((id) => WEAPONS[id])
    : [...meta.unlockedWeapons];
  if (!meta.unlockedWeapons.length) {
    meta.unlockedWeapons = ["fallen_greatblade", "chain_glaive"];
  }
  meta.memoryShards = Array.isArray(raw.memoryShards) ? [...new Set(raw.memoryShards)] : [];
  meta.storyFlags = Array.isArray(raw.storyFlags) ? [...new Set(raw.storyFlags)] : ["intro_awake"];
  meta.ash = Number.isFinite(raw.ash) ? Math.max(0, Math.floor(raw.ash)) : 25;
  return meta;
}

function sanitizeRun(raw, meta) {
  const run = createRun();
  if (!raw || typeof raw !== "object") {
    run.currentWeapon = meta.unlockedWeapons[0] || "fallen_greatblade";
    return run;
  }

  run.seed = Number.isFinite(raw.seed) ? raw.seed : run.seed;
  run.currentRoom = ROOMS[raw.currentRoom] ? raw.currentRoom : "hub_sanctuary";
  run.health = Number.isFinite(raw.health) ? clamp(raw.health, 0, 999) : run.health;
  run.maxHealth = Number.isFinite(raw.maxHealth) ? clamp(raw.maxHealth, 1, 999) : run.maxHealth;
  run.gloom = Number.isFinite(raw.gloom) ? clamp(raw.gloom, 0, 100) : 0;
  run.relics = Array.isArray(raw.relics) ? raw.relics.filter((id) => RELICS[id]) : [];
  if (!run.relics.length) {
    run.relics = createRun(run.seed).relics;
  }
  run.visitedRooms = Array.isArray(raw.visitedRooms)
    ? raw.visitedRooms.filter((id) => ROOMS[id])
    : ["hub_sanctuary"];
  run.defeatedBosses = Array.isArray(raw.defeatedBosses)
    ? raw.defeatedBosses.filter((id) => ROOMS[id])
    : [];
  run.claimedRewards = Array.isArray(raw.claimedRewards)
    ? raw.claimedRewards.filter((id) => ROOMS[id])
    : [];
  run.activeSideRooms = Array.isArray(raw.activeSideRooms)
    ? raw.activeSideRooms.filter((id) => SIDE_ROOM_IDS.includes(id))
    : pickSideRooms(run.seed);
  if (!run.activeSideRooms.length) {
    run.activeSideRooms = pickSideRooms(run.seed);
  }
  run.temporaryCurrency = Number.isFinite(raw.temporaryCurrency)
    ? Math.floor(raw.temporaryCurrency)
    : 0;
  run.currentWeapon = WEAPONS[raw.currentWeapon] && meta.unlockedWeapons.includes(raw.currentWeapon)
    ? raw.currentWeapon
    : meta.unlockedWeapons[0] || "fallen_greatblade";
  run.oath = OATHS[raw.oath] ? raw.oath : "execution";
  run.playerSpawnTag = typeof raw.playerSpawnTag === "string" ? raw.playerSpawnTag : "start";
  if (!ROOMS[run.currentRoom].mainPath && !run.activeSideRooms.includes(run.currentRoom)) {
    run.currentRoom = "hub_sanctuary";
  }
  return run;
}

function loadSave() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const meta = createDefaultMeta();
      const run = createRun();
      return { meta, run };
    }
    const parsed = JSON.parse(raw);
    const meta = sanitizeMeta(parsed.meta);
    const run = sanitizeRun(parsed.run, meta);
    return { meta, run };
  } catch {
    return { meta: createDefaultMeta(), run: createRun() };
  }
}

function saveGame() {
  const payload = {
    meta: game.meta,
    run: game.run
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore quota and privacy mode failures.
  }
}

function createPlayer() {
  return {
    kind: "player",
    x: 220,
    y: 650,
    w: 54,
    h: 110,
    vx: 0,
    vy: 0,
    speed: 320,
    facing: 1,
    onGround: false,
    dashTime: 0,
    dashCooldown: 0,
    attackTime: 0,
    action: "idle",
    heavyAttack: false,
    skillTime: 0,
    parryTime: 0,
    invulnerable: 0,
    doubleJumpReady: false,
    grappleTarget: null,
    attackFlash: 0,
    contactMessageCooldown: 0,
    attackState: null,
    afterimageTimer: 0
  };
}

function createEnemy(enemyId, x, y) {
  const template = ENEMIES[enemyId];
  return {
    type: "enemy",
    id: enemyId,
    name: template.name,
    drawKind: template.drawKind,
    x,
    y,
    w: template.drawKind === "hound" ? 74 : 56,
    h: template.drawKind === "hound" ? 58 : 98,
    vx: 0,
    vy: 0,
    speed: template.speed,
    facing: -1,
    onGround: false,
    maxHealth: template.maxHealth,
    health: template.maxHealth,
    damage: template.damage,
    reach: template.reach,
    attackWindup: template.attackWindup,
    attackTimer: 0,
    attackType: null,
    attackWindupTotal: 0,
    attackData: null,
    cooldown: 0.5,
    stun: 0,
    hurtFlash: 0,
    leapTime: 0,
    leapImpactPending: false,
    phaseIndex: 0,
    specialCooldown: 2,
    isBoss: false,
    ranged: !!template.ranged
  };
}

function createBoss(bossId, x, y) {
  const template = BOSSES[bossId];
  return {
    ...createEnemy("inquisitor", x, y),
    type: "boss",
    id: bossId,
    name: template.name,
    drawKind: template.drawKind,
    x,
    y,
    w: bossId === "seraph_vale" ? 64 : 76,
    h: bossId === "seraph_vale" ? 128 : 122,
    speed: template.speed,
    maxHealth: template.maxHealth,
    health: template.maxHealth,
    damage: template.damage,
    reach: template.reach,
    phases: template.phases,
    isBoss: true,
    specialCooldown: template.phases[0].specialCooldown,
    phaseIndex: 0
  };
}

function getLayout(layoutId) {
  const base = {
    solids: [{ x: 0, y: FLOOR_Y, w: WIDTH, h: HEIGHT - FLOOR_Y }],
    grapplePoints: []
  };

  switch (layoutId) {
    case "hub":
      base.solids.push({ x: 170, y: 560, w: 320, h: 28 });
      base.solids.push({ x: 1090, y: 530, w: 280, h: 28 });
      break;
    case "gate":
      base.solids.push({ x: 620, y: 570, w: 360, h: 28 });
      break;
    case "rampart":
      base.solids.push({ x: 340, y: 610, w: 250, h: 24 });
      base.solids.push({ x: 1040, y: 520, w: 240, h: 24 });
      break;
    case "crypt":
      base.solids.push({ x: 690, y: 560, w: 240, h: 26 });
      break;
    case "lift":
      base.solids.push({ x: 260, y: 560, w: 220, h: 24 });
      base.solids.push({ x: 1080, y: 430, w: 220, h: 24 });
      base.grapplePoints = [{ x: 1160, y: 290 }];
      break;
    case "bridge":
      base.solids.push({ x: 320, y: 550, w: 260, h: 24 });
      base.solids.push({ x: 940, y: 450, w: 260, h: 24 });
      base.grapplePoints = [{ x: 820, y: 250 }];
      break;
    case "choir":
      base.solids.push({ x: 520, y: 580, w: 280, h: 24 });
      base.solids.push({ x: 1080, y: 350, w: 240, h: 24 });
      base.grapplePoints = [{ x: 1220, y: 220 }];
      break;
    case "arena":
      base.solids.push({ x: 320, y: 520, w: 220, h: 22 });
      base.solids.push({ x: 1060, y: 520, w: 220, h: 22 });
      break;
    case "finale":
      base.solids.push({ x: 540, y: 480, w: 520, h: 24 });
      base.grapplePoints = [{ x: 800, y: 250 }];
      break;
    case "armory":
      base.solids.push({ x: 980, y: 530, w: 240, h: 24 });
      break;
    default:
      break;
  }

  return base;
}

function spawnPosition(tag) {
  switch (tag) {
    case "left":
      return { x: 150, y: 650 };
    case "right":
      return { x: 1450, y: 650 };
    case "up":
      return { x: 800, y: 210 };
    case "down":
      return { x: 800, y: 660 };
    default:
      return { x: 220, y: 650 };
  }
}

function doorPosition(direction) {
  switch (direction) {
    case "left":
      return { x: 90, y: 650 };
    case "right":
      return { x: 1510, y: 650 };
    case "up":
      return { x: 800, y: 170 };
    case "down":
      return { x: 800, y: 725 };
    default:
      return { x: 800, y: 650 };
  }
}

function encounterPositions(layoutId) {
  switch (layoutId) {
    case "rampart":
      return [{ x: 960, y: 650 }, { x: 1240, y: 650 }, { x: 1120, y: 480 }];
    case "crypt":
      return [{ x: 940, y: 650 }, { x: 780, y: 520 }];
    case "lift":
      return [{ x: 860, y: 650 }, { x: 1110, y: 400 }];
    case "bridge":
      return [{ x: 880, y: 650 }, { x: 1080, y: 400 }, { x: 1240, y: 650 }];
    case "choir":
      return [{ x: 760, y: 650 }, { x: 1120, y: 320 }];
    case "arena":
      return [{ x: 920, y: 650 }, { x: 1120, y: 650 }];
    default:
      return [{ x: 980, y: 650 }, { x: 1200, y: 650 }, { x: 1340, y: 650 }];
  }
}

function hasAbility(abilityId) {
  return game.meta.unlockedAbilities.includes(abilityId);
}

function grantAbility(abilityId) {
  if (!ABILITIES[abilityId] || hasAbility(abilityId)) {
    return false;
  }
  game.meta.unlockedAbilities.push(abilityId);
  saveGame();
  return true;
}

function isRoomActive(roomId) {
  const room = ROOMS[roomId];
  if (!room) {
    return false;
  }
  return room.mainPath || game.run.activeSideRooms.includes(roomId);
}

function startNewRun(seed = Math.floor(Math.random() * 2147483647)) {
  const relicIds = Object.keys(RELICS);
  const random = mulberry32(seed);
  game.run = {
    seed,
    currentRoom: "hub_sanctuary",
    health: 100,
    maxHealth: 100,
    gloom: 0,
    relics: [pickFrom(relicIds, random)],
    visitedRooms: ["hub_sanctuary"],
    defeatedBosses: [],
    claimedRewards: [],
    activeSideRooms: pickSideRooms(seed),
    temporaryCurrency: 0,
    currentWeapon: game.meta.unlockedWeapons[0] || "fallen_greatblade",
    oath: "execution",
    playerSpawnTag: "start"
  };
  saveGame();
  loadRoom(game.run.currentRoom, "start");
  pushMessage("The sanctuary drags Cael back from ruin.");
}

const initialState = loadSave();
const game = {
  meta: initialState.meta,
  run: initialState.run,
  room: null,
  roomLayout: null,
  player: createPlayer(),
  enemies: [],
  projectiles: [],
  effects: [],
  interactables: [],
  victory: false,
  message: "",
  messageTime: 0,
  statsPulse: 0,
  hitstop: 0,
  camera: {
    trauma: 0,
    offsetX: 0,
    offsetY: 0,
    flash: 0,
    flashColor: "rgba(227,219,199,0.22)"
  }
};

window.blackHaloGame = game;

function pushMessage(text, duration = 4.2) {
  game.message = text;
  game.messageTime = duration;
  messageEl.textContent = text;
}

function addEffect(effect) {
  effect.maxLife = effect.maxLife || effect.life;
  effect.age = effect.age || 0;
  effect.seed = effect.seed || Math.random() * 1000;
  game.effects.push(effect);
}

function createProjectile(x, y, vx, vy, radius, color, damage, owner, life = 1.8, options = {}) {
  game.projectiles.push({
    x,
    y,
    vx,
    vy,
    radius,
    color,
    damage,
    owner,
    life,
    maxLife: life,
    trailTimer: 0,
    gravity: options.gravity || 0,
    maxDistance: options.maxDistance || Infinity,
    startX: x,
    startY: y,
    shape: options.shape || "direct"
  });
}

function loadRoom(roomId, spawnTag = "start") {
  const room = ROOMS[roomId];
  if (!room) {
    return;
  }

  game.room = room;
  game.roomLayout = getLayout(room.layout);
  game.enemies = [];
  game.projectiles = [];
  game.effects = [];
  game.interactables = [];
  game.victory = false;
  game.hitstop = 0;
  game.camera.trauma = 0;
  game.camera.flash = 0;

  const spawn = spawnPosition(spawnTag);
  game.player.x = spawn.x;
  game.player.y = spawn.y;
  game.player.vx = 0;
  game.player.vy = 0;
  game.player.dashTime = 0;
  game.player.attackTime = 0;
  game.player.skillTime = 0;
  game.player.parryTime = 0;
  game.player.invulnerable = 0;
  game.player.grappleTarget = null;
  game.player.action = "idle";
  game.player.doubleJumpReady = hasAbility("black_wing");
  game.player.attackState = null;
  game.player.afterimageTimer = 0;

  const encounterSpots = encounterPositions(room.layout);
  if (room.boss) {
    if (!game.run.defeatedBosses.includes(room.id)) {
      const bossPosition = room.id === "seraph_sanctum"
        ? { x: 1180, y: 640 }
        : { x: 1180, y: 650 };
      game.enemies.push(createBoss(room.boss, bossPosition.x, bossPosition.y));
      if (room.boss === "sir_aurex") {
        pushMessage(DIALOGUE.aurex_intro);
      } else {
        pushMessage(DIALOGUE.seraph_intro);
      }
    }
  } else if (Array.isArray(room.enemies)) {
    room.enemies.forEach((enemyId, index) => {
      const spot = encounterSpots[index % encounterSpots.length];
      game.enemies.push(createEnemy(enemyId, spot.x, spot.y));
    });
  }

  buildInteractionsForRoom(room);
  if (!game.run.visitedRooms.includes(roomId)) {
    game.run.visitedRooms.push(roomId);
  }
  game.run.currentRoom = roomId;
  game.run.playerSpawnTag = spawnTag;
  roomNameEl.textContent = room.name;
  updateStats();
  saveGame();
}

function buildInteractionsForRoom(room) {
  game.interactables = [];

  Object.entries(room.exits || {}).forEach(([direction, exit]) => {
    if (!isRoomActive(exit.target)) {
      return;
    }
    const pos = doorPosition(direction);
    game.interactables.push({
      type: "door",
      x: pos.x,
      y: pos.y,
      radius: 80,
      label: exit.label,
      target: exit.target,
      spawnTag: exit.spawnTag,
      gate: exit.gate || null
    });
  });

  if (room.id === "hub_sanctuary") {
    game.interactables.push({
      type: "forge",
      x: 220,
      y: 650,
      radius: 80,
      label: "Mara Bellwright: Cycle weapon"
    });
    game.interactables.push({
      type: "archive",
      x: 1190,
      y: 650,
      radius: 80,
      label: "Brother Niv: Hear memory"
    });
    game.interactables.push({
      type: "oath",
      x: 790,
      y: 650,
      radius: 80,
      label: "Sir Joren: Cycle oath"
    });
  }

  if (room.id === "mirror_choir" && !hasAbility("black_wing")) {
    game.interactables.push({
      type: "altar",
      x: 1190,
      y: 290,
      radius: 90,
      label: "Claim Black Wing"
    });
  }

  if (room.rewards && room.rewards.length && !game.run.claimedRewards.includes(room.id)) {
    game.interactables.push({
      type: "reward",
      x: 800,
      y: 650,
      radius: 80,
      label: "Claim room reward"
    });
  }
}

function updateStats() {
  const weapon = WEAPONS[game.run.currentWeapon];
  const oath = OATHS[game.run.oath];
  statsEl.innerHTML = [
    `<div><strong>Health</strong><span>${Math.ceil(game.run.health)} / ${Math.ceil(game.run.maxHealth)}</span></div>`,
    `<div><strong>Gloom</strong><span>${Math.ceil(game.run.gloom)} / 100</span></div>`,
    `<div><strong>Ash</strong><span>${game.meta.ash}</span></div>`,
    `<div><strong>Weapon</strong><span>${weapon.name}</span></div>`,
    `<div><strong>Oath</strong><span>${oath.name}</span></div>`,
    `<div><strong>Abilities</strong><span>${formatAbilitySummary()}</span></div>`,
    `<div><strong>Relic</strong><span>${RELICS[game.run.relics[0]]?.name || "None"}</span></div>`
  ].join("");
}

function formatAbilitySummary() {
  const names = game.meta.unlockedAbilities.map((id) => ABILITIES[id]?.name).filter(Boolean);
  return names.length ? names.join(", ") : "None yet";
}

function getActiveRelicModifiers() {
  return game.run.relics.reduce((result, relicId) => {
    const relic = RELICS[relicId];
    if (!relic) {
      return result;
    }
    Object.entries(relic.modifiers).forEach(([key, value]) => {
      result[key] = (result[key] || 0) + value;
    });
    return result;
  }, {});
}

function addHitstop(duration) {
  game.hitstop = Math.max(game.hitstop, duration);
}

function addCameraTrauma(amount) {
  game.camera.trauma = clamp(game.camera.trauma + amount, 0, 1.6);
}

function flashScreen(color, amount) {
  game.camera.flash = Math.max(game.camera.flash, amount);
  game.camera.flashColor = color;
}

function updateCamera(dt) {
  game.camera.trauma = Math.max(0, game.camera.trauma - dt * 2.6);
  game.camera.flash = Math.max(0, game.camera.flash - dt * 2.8);
  const shake = game.camera.trauma * game.camera.trauma;
  game.camera.offsetX = randomRange(-1, 1) * shake * 22;
  game.camera.offsetY = randomRange(-1, 1) * shake * 16;
}

function attackActionName(kind) {
  if (kind === "heavy") {
    return "heavy";
  }
  if (kind === "skill") {
    return "cast";
  }
  return "attack";
}

function getPlayerWeaponPose(player, overrideProgress = null) {
  const weapon = WEAPONS[game.run.currentWeapon];
  const attack = player.attackState;
  const baseX = player.x + player.facing * weapon.gripOffset.x;
  const baseY = player.y + player.h * 0.5 + weapon.gripOffset.y;

  let angle = angleForFacing(-0.26, player.facing);
  let progress = 0;
  let kind = "idle";

  if (attack) {
    kind = attack.kind;
    progress = overrideProgress === null
      ? clamp01(attack.elapsed / attack.duration)
      : clamp01(overrideProgress);
    const profile = attack.profile;
    const sweep = easeInOutCubic(progress);
    const settle = easeOutCubic(progress);
    angle = lerp(
      angleForFacing(profile.startAngle, player.facing),
      angleForFacing(profile.endAngle, player.facing),
      sweep
    );
    angle += player.facing * Math.sin(settle * Math.PI) * (kind === "light" ? 0.06 : 0.12);
  } else if (player.action === "parry") {
    angle = angleForFacing(-0.72, player.facing);
  } else if (player.action === "dash") {
    angle = angleForFacing(0.06, player.facing);
  }

  const tip = rotateFromAngle(angle, weapon.bladeLength);
  const mid = rotateFromAngle(angle, weapon.bladeLength * 0.72);
  return {
    weapon,
    kind,
    progress,
    angle,
    hiltX: baseX,
    hiltY: baseY,
    midX: baseX + mid.x,
    midY: baseY + mid.y,
    tipX: baseX + tip.x,
    tipY: baseY + tip.y,
    width: weapon.bladeWidth
  };
}

function getLocalWeaponAngle(player, overrideProgress = null) {
  const attack = player.attackState;
  if (attack) {
    const progress = overrideProgress === null
      ? clamp01(attack.elapsed / attack.duration)
      : clamp01(overrideProgress);
    const sweep = easeInOutCubic(progress);
    return lerp(attack.profile.startAngle, attack.profile.endAngle, sweep)
      + Math.sin(easeOutCubic(progress) * Math.PI) * (attack.kind === "light" ? 0.06 : 0.12);
  }
  if (player.action === "parry") {
    return -0.72;
  }
  if (player.action === "dash") {
    return 0.06;
  }
  return -0.26;
}

function spawnWeaponTrail(pose, attack, opacity = 1) {
  addEffect({
    type: "weapon_trail",
    x: (pose.hiltX + pose.tipX) * 0.5,
    y: (pose.hiltY + pose.tipY) * 0.5,
    hiltX: pose.hiltX,
    hiltY: pose.hiltY,
    tipX: pose.tipX,
    tipY: pose.tipY,
    midX: pose.midX,
    midY: pose.midY,
    color: attack.profile.trailColor,
    glowColor: attack.profile.glowColor,
    heavy: attack.kind !== "light",
    life: attack.kind === "light" ? 0.12 : 0.16,
    opacity
  });
}

function spawnDirectionalImpact(x, y, angle, primaryColor, accentColor, intensity) {
  addEffect({
    type: "impact_sparks",
    x,
    y,
    angle,
    primaryColor,
    accentColor,
    intensity,
    life: 0.22 + intensity * 0.06
  });
  addEffect({
    type: "shock_ring",
    x,
    y,
    color: accentColor,
    intensity,
    life: 0.18 + intensity * 0.05
  });
}

function getEnemyHitCenter(enemy) {
  return {
    x: enemy.x,
    y: enemy.y - enemy.h * 0.18
  };
}

function sampleBladeSweepHit(previousPose, currentPose, enemy, bladeRadius) {
  const hitCenter = getEnemyHitCenter(enemy);
  const enemyRadius = Math.max(enemy.w, enemy.h) * 0.34;
  const combinedRadius = enemyRadius + bladeRadius;

  for (let i = 0; i <= 5; i += 1) {
    const t = i / 5;
    const ax = lerp(previousPose.hiltX, currentPose.hiltX, t);
    const ay = lerp(previousPose.hiltY, currentPose.hiltY, t);
    const bx = lerp(previousPose.tipX, currentPose.tipX, t);
    const by = lerp(previousPose.tipY, currentPose.tipY, t);
    const distanceToBlade = pointToSegmentDistance(hitCenter.x, hitCenter.y, ax, ay, bx, by);
    if (distanceToBlade <= combinedRadius) {
      return closestPointOnSegment(hitCenter.x, hitCenter.y, ax, ay, bx, by);
    }
  }

  return null;
}

function gainGloom(amount) {
  game.run.gloom = clamp(game.run.gloom + amount, 0, 100);
}

function resolvePlayerAttackHit(enemy, attack, hitPoint) {
  const player = game.player;
  const weapon = WEAPONS[game.run.currentWeapon];
  const relicMods = getActiveRelicModifiers();
  const oath = OATHS[game.run.oath];
  const primaryColor = attack.kind === "skill" ? COLORS.cyan : COLORS.ivory;
  const accentColor = attack.kind === "heavy" ? COLORS.gold : attack.kind === "skill" ? COLORS.cyan : COLORS.crimson;
  const knockback = attack.kind === "light" ? 240 : attack.kind === "heavy" ? 360 : 420;
  const stun = attack.kind === "light" ? 0.22 : attack.kind === "heavy" ? 0.42 : 0.5;
  const intensity = attack.kind === "light" ? 0.55 : attack.kind === "heavy" ? 0.9 : 1.2;
  const hitAngle = Math.atan2(hitPoint.y - player.y, hitPoint.x - player.x);

  enemy.health -= attack.damage;
  enemy.stun = stun;
  enemy.hurtFlash = 0.12;
  enemy.vx = player.facing * knockback;
  enemy.vy = attack.kind === "light" ? -80 : -150;

  spawnDirectionalImpact(hitPoint.x, hitPoint.y, hitAngle, primaryColor, accentColor, intensity);
  addEffect({
    type: attack.kind === "skill" ? "skill_slash" : attack.kind === "heavy" ? "heavy_slash" : "light_slash",
    x: hitPoint.x,
    y: hitPoint.y,
    facing: player.facing,
    life: attack.kind === "light" ? 0.16 : 0.2
  });
  addHitstop(attack.kind === "light" ? 0.035 : attack.kind === "heavy" ? 0.06 : 0.075);
  addCameraTrauma(attack.kind === "light" ? 0.18 : attack.kind === "heavy" ? 0.3 : 0.42);
  flashScreen(attack.kind === "skill" ? "rgba(122,215,224,0.26)" : "rgba(227,219,199,0.18)", intensity * 0.16);
  gainGloom(weapon.gloomGain * (oath.gloomMultiplier + (relicMods.gloomBonus || 0)) * 0.85);
}

function startPlayerAttack(kind) {
  const player = game.player;
  const weapon = WEAPONS[game.run.currentWeapon];
  const profile = weapon.profiles[kind];
  const oath = OATHS[game.run.oath];
  const relicMods = getActiveRelicModifiers();

  let damage = kind === "heavy" ? weapon.heavyDamage : weapon.baseDamage;
  if (kind === "heavy") {
    damage += relicMods.heavyBonus || 0;
  }
  if (kind === "skill") {
    damage = weapon.heavyDamage + 16 + (relicMods.skillBonus || 0);
  }
  damage *= oath.damageMultiplier;

  player.attackState = {
    kind,
    duration: profile.duration,
    elapsed: 0,
    damage,
    profile,
    hitIds: new Set(),
    trailTimer: 0,
    afterimageTimer: 0
  };
  player.action = attackActionName(kind);
  player.attackFlash = kind === "skill" ? 0.28 : kind === "heavy" ? 0.22 : 0.16;
  if (kind === "skill") {
    player.skillTime = profile.duration;
    player.attackTime = 0;
  } else {
    player.attackTime = profile.duration;
    player.skillTime = 0;
  }

  addEffect({
    type: "windup_glow",
    x: player.x + player.facing * 54,
    y: player.y - 48,
    color: profile.trailColor,
    life: kind === "light" ? 0.12 : 0.18
  });
}

function updatePlayerAttack(dt) {
  const player = game.player;
  const attack = player.attackState;
  if (!attack) {
    return;
  }

  const previousProgress = clamp01(attack.elapsed / attack.duration);
  const previousPose = getPlayerWeaponPose(player, previousProgress);
  attack.elapsed = Math.min(attack.duration, attack.elapsed + dt);
  attack.trailTimer = Math.max(0, attack.trailTimer - dt);
  attack.afterimageTimer = Math.max(0, attack.afterimageTimer - dt);

  const progress = clamp01(attack.elapsed / attack.duration);
  const currentPose = getPlayerWeaponPose(player, progress);
  const activeStart = attack.profile.activeStart;
  const activeEnd = attack.profile.activeEnd;
  const activeWindowTouched = previousProgress <= activeEnd && progress >= activeStart;
  const activeNow = progress >= activeStart && progress <= activeEnd;

  if (activeNow && attack.trailTimer <= 0) {
    spawnWeaponTrail(currentPose, attack, 0.95 - progress * 0.22);
    attack.trailTimer = attack.kind === "light" ? 0.018 : 0.022;
  }

  if (activeNow && attack.afterimageTimer <= 0 && attack.kind !== "light") {
    addEffect({
      type: "afterimage",
      x: player.x,
      y: player.y,
      h: player.h,
      facing: player.facing,
      color: attack.kind === "skill" ? "rgba(122,215,224,0.32)" : "rgba(227,219,199,0.18)",
      life: 0.12
    });
    attack.afterimageTimer = 0.04;
  }

  if (activeWindowTouched) {
    const bladeRadius = currentPose.width * 0.55 + (attack.kind === "skill" ? 10 : attack.kind === "heavy" ? 6 : 0);
    for (const enemy of game.enemies) {
      if (enemy.health <= 0 || attack.hitIds.has(enemy)) {
        continue;
      }
      const hitPoint = sampleBladeSweepHit(previousPose, currentPose, enemy, bladeRadius);
      if (!hitPoint) {
        continue;
      }
      attack.hitIds.add(enemy);
      resolvePlayerAttackHit(enemy, attack, hitPoint);
    }
  }

  if (progress >= 1) {
    player.attackState = null;
  }
}

function updatePlayer(dt) {
  const player = game.player;
  const weapon = WEAPONS[game.run.currentWeapon];
  const oath = OATHS[game.run.oath];
  const relicMods = getActiveRelicModifiers();

  player.dashTime = Math.max(0, player.dashTime - dt);
  player.dashCooldown = Math.max(0, player.dashCooldown - dt);
  player.attackTime = Math.max(0, player.attackTime - dt);
  player.skillTime = Math.max(0, player.skillTime - dt);
  player.parryTime = Math.max(0, player.parryTime - dt);
  player.invulnerable = Math.max(0, player.invulnerable - dt);
  player.attackFlash = Math.max(0, player.attackFlash - dt);
  player.contactMessageCooldown = Math.max(0, player.contactMessageCooldown - dt);
  player.afterimageTimer = Math.max(0, player.afterimageTimer - dt);

  if (player.grappleTarget) {
    const dx = player.grappleTarget.x - player.x;
    const dy = player.grappleTarget.y - player.y;
    const len = Math.hypot(dx, dy) || 1;
    player.vx = (dx / len) * 900;
    player.vy = (dy / len) * 900;
    player.action = "dash";
    if (len < 30) {
      player.grappleTarget = null;
      player.vy = -480;
    }
    moveEntity(player, dt);
    return;
  }

  const moveLeft = isDown(...CONTROLS.moveLeft);
  const moveRight = isDown(...CONTROLS.moveRight);
  const axis = (moveRight ? 1 : 0) - (moveLeft ? 1 : 0);

  if (axis !== 0) {
    player.facing = axis > 0 ? 1 : -1;
  }

  if (player.onGround) {
    player.doubleJumpReady = hasAbility("black_wing");
  }

  if (wasPressed(...CONTROLS.newRun)) {
    startNewRun();
    clearPressed();
    return;
  }

  if (player.dashTime > 0) {
    player.vx = player.facing * 920;
    player.action = "dash";
  } else if (player.attackState) {
    const attackProgress = clamp01(player.attackState.elapsed / player.attackState.duration);
    const drive = player.attackState.kind === "light"
      ? 120
      : player.attackState.kind === "heavy"
        ? 190
        : 230;
    const lunge = Math.sin(attackProgress * Math.PI) * drive;
    player.vx = player.facing * lunge;
  } else if (player.attackTime > 0 || player.skillTime > 0) {
    player.vx = lerp(player.vx, 0, 0.3);
  } else {
    player.vx = axis * (player.speed + (oath.moveBonus || 0));
  }

  if (wasPressed(...CONTROLS.jump)) {
    if (player.onGround) {
      player.vy = -700;
      player.onGround = false;
      player.action = "jump";
    } else if (player.doubleJumpReady) {
      player.doubleJumpReady = false;
      player.vy = -650;
      player.action = "jump";
      addEffect({
        type: "wing_burst",
        x: player.x,
        y: player.y,
        life: 0.3
      });
    }
  }

  if (wasPressed(...CONTROLS.parry)) {
    player.parryTime = 0.24 + (oath.parryBonus || 0) + (relicMods.parryBonus || 0);
    player.action = "parry";
  } else if (wasPressed(...CONTROLS.dash) && player.dashCooldown <= 0 && player.attackTime <= 0 && player.skillTime <= 0) {
    player.dashTime = 0.16;
    player.dashCooldown = 0.4;
    player.invulnerable = 0.2;
    addCameraTrauma(0.08);
  } else if (wasPressed(...CONTROLS.skill) && player.skillTime <= 0) {
    if (hasAbility("chain_grapple") && tryActivateGrapple()) {
      player.skillTime = 0.3;
      player.invulnerable = 0.18;
      player.action = "dash";
    } else if (game.run.gloom >= 30) {
      game.run.gloom = Math.max(0, game.run.gloom - 30);
      startPlayerAttack("skill");
      const direction = player.facing;
      createProjectile(
        player.x + direction * 60,
        player.y - 40,
        direction * 760,
        0,
        28,
        COLORS.cyan,
        weapon.heavyDamage + 12 + (relicMods.skillBonus || 0),
        "player_skill",
        0.55
      );
      pushMessage(`${weapon.skill} tears through the sanctified air.`);
    } else if (player.contactMessageCooldown <= 0) {
      pushMessage("Not enough Gloom for a skill attack.");
      player.contactMessageCooldown = 1.4;
    }
  } else if (wasPressed(...CONTROLS.heavyAttack) && player.attackTime <= 0 && player.skillTime <= 0) {
    startPlayerAttack("heavy");
  } else if (wasPressed(...CONTROLS.lightAttack) && player.attackTime <= 0 && player.skillTime <= 0) {
    startPlayerAttack("light");
  }

  if (wasPressed(...CONTROLS.interact)) {
    tryInteract();
  }

  player.vy += GRAVITY * dt;
  moveEntity(player, dt);
  updatePlayerAttack(dt);

  if ((player.dashTime > 0 || (player.attackState && player.attackState.kind !== "light")) && player.afterimageTimer <= 0) {
    addEffect({
      type: "afterimage",
      x: player.x,
      y: player.y,
      h: player.h,
      facing: player.facing,
      color: player.attackState?.kind === "skill"
        ? "rgba(122,215,224,0.3)"
        : "rgba(227,219,199,0.16)",
      life: player.dashTime > 0 ? 0.08 : 0.12
    });
    player.afterimageTimer = player.dashTime > 0 ? 0.025 : 0.05;
  }

  player.x = clamp(player.x, 30, WIDTH - 30);
  if (player.y > HEIGHT + 180) {
    handlePlayerDeath();
    return;
  }

  if (player.attackTime <= 0 && player.skillTime <= 0 && player.dashTime <= 0) {
    if (!player.onGround) {
      player.action = "jump";
    } else if (Math.abs(player.vx) > 8) {
      player.action = "run";
    } else {
      player.action = "idle";
    }
  }
}

function moveEntity(entity, dt) {
  const prevX = entity.x;
  const prevY = entity.y;
  entity.x += entity.vx * dt;
  resolveHorizontal(entity, prevX);
  entity.y += entity.vy * dt;
  entity.onGround = false;
  resolveVertical(entity, prevY);
}

function resolveHorizontal(entity, prevX) {
  const rect = rectFromEntity(entity);
  for (const solid of game.roomLayout.solids) {
    if (!overlaps(rect, solid)) {
      continue;
    }
    if (prevX + entity.w / 2 <= solid.x) {
      entity.x = solid.x - entity.w / 2;
      entity.vx = 0;
    } else if (prevX - entity.w / 2 >= solid.x + solid.w) {
      entity.x = solid.x + solid.w + entity.w / 2;
      entity.vx = 0;
    }
  }
}

function resolveVertical(entity, prevY) {
  const rect = rectFromEntity(entity);
  for (const solid of game.roomLayout.solids) {
    if (!overlaps(rect, solid)) {
      continue;
    }
    if (prevY + entity.h / 2 <= solid.y) {
      entity.y = solid.y - entity.h / 2;
      entity.vy = 0;
      entity.onGround = true;
    } else if (prevY - entity.h / 2 >= solid.y + solid.h) {
      entity.y = solid.y + solid.h + entity.h / 2;
      entity.vy = 0;
    }
  }
}

function tryActivateGrapple() {
  const player = game.player;
  if (!game.roomLayout.grapplePoints.length) {
    return false;
  }
  let best = null;
  let bestDist = Infinity;
  for (const point of game.roomLayout.grapplePoints) {
    const dist = Math.hypot(point.x - player.x, point.y - player.y);
    if (dist < 340 && dist < bestDist) {
      best = point;
      bestDist = dist;
    }
  }
  if (!best) {
    return false;
  }
  player.grappleTarget = best;
  player.vx = 0;
  player.vy = 0;
  addEffect({ type: "grapple_line", x: player.x, y: player.y, x2: best.x, y2: best.y, life: 0.18 });
  pushMessage("Chain Grapple ignites.");
  return true;
}

function getPlayerHitCenter() {
  return {
    x: game.player.x,
    y: game.player.y - game.player.h * 0.18
  };
}

function getEnemyWindupProgress(enemy) {
  if (!enemy.attackType || enemy.attackWindupTotal <= 0) {
    return 0;
  }
  return clamp01(1 - enemy.attackTimer / enemy.attackWindupTotal);
}

function queueEnemyAttack(enemy, attackType, data) {
  enemy.attackType = attackType;
  enemy.attackData = data;
  enemy.attackTimer = data.windup;
  enemy.attackWindupTotal = data.windup;
  addEffect({
    type: "attack_tell",
    x: data.tellX,
    y: data.tellY,
    facing: enemy.facing,
    color: data.tellColor,
    life: data.windup,
    tellShape: data.tellShape,
    parryable: data.parryable !== false
  });
}

function finishEnemyAttack(enemy) {
  enemy.cooldown = enemy.attackData?.recover || (enemy.isBoss ? 0.95 : 0.8);
  enemy.attackTimer = 0;
  enemy.attackWindupTotal = 0;
  enemy.attackType = null;
  enemy.attackData = null;
}

function resolveEnemyParry(enemy, pointX, pointY, amount = 18) {
  enemy.stun = enemy.isBoss ? 0.45 : 0.72;
  enemy.cooldown = enemy.isBoss ? 1.2 : 1.05;
  addEffect({ type: "parry_flash", x: pointX, y: pointY, life: 0.18 });
  spawnDirectionalImpact(pointX, pointY, 0, COLORS.cyan, COLORS.ivory, enemy.isBoss ? 1 : 0.82);
  addHitstop(enemy.isBoss ? 0.06 : 0.05);
  addCameraTrauma(enemy.isBoss ? 0.34 : 0.26);
  flashScreen("rgba(122,215,224,0.24)", enemy.isBoss ? 0.18 : 0.14);
  gainGloom(amount);
}

function resolveEnemyStrike(enemy, strike) {
  const playerCenter = getPlayerHitCenter();
  const playerRadius = Math.max(game.player.w, game.player.h) * 0.28;
  const distanceToStrike = pointToSegmentDistance(
    playerCenter.x,
    playerCenter.y,
    strike.ax,
    strike.ay,
    strike.bx,
    strike.by
  );
  if (distanceToStrike > playerRadius + strike.radius) {
    return false;
  }

  const impactPoint = closestPointOnSegment(playerCenter.x, playerCenter.y, strike.ax, strike.ay, strike.bx, strike.by);
  if (strike.parryable !== false && tryParry({ x: impactPoint.x, y: impactPoint.y })) {
    resolveEnemyParry(enemy, impactPoint.x, impactPoint.y, strike.parryGloom || 18);
    return true;
  }

  damagePlayer(strike.damage, { x: impactPoint.x, y: impactPoint.y });
  return true;
}

function chooseEnemyAttack(enemy, dx, dy) {
  const range = Math.abs(dx);
  const height = Math.abs(dy);

  if (enemy.isBoss) {
    if (enemy.id === "sir_aurex") {
      if (enemy.specialCooldown <= 0) {
        if (enemy.phaseIndex === 0) {
          queueEnemyAttack(enemy, "aurex_charge", {
            windup: 0.72,
            recover: 1.15,
            tellShape: "charge",
            tellColor: COLORS.cyan,
            tellX: enemy.x + enemy.facing * 124,
            tellY: enemy.y - 56,
            parryable: true
          });
        } else {
          queueEnemyAttack(enemy, "aurex_halo", {
            windup: 0.9,
            recover: 1.3,
            tellShape: "burst",
            tellColor: COLORS.crimson,
            tellX: enemy.x,
            tellY: enemy.y - 92,
            parryable: false
          });
        }
        return true;
      }
      if (range <= 162 && height < 110) {
        queueEnemyAttack(enemy, "aurex_cleave", {
          windup: 0.5,
          recover: 0.95,
          tellShape: "shield",
          tellColor: COLORS.cyan,
          tellX: enemy.x + enemy.facing * 106,
          tellY: enemy.y - 42,
          parryable: true
        });
        return true;
      }
      return false;
    }

    if (enemy.specialCooldown <= 0) {
      if (enemy.phaseIndex === 0) {
        queueEnemyAttack(enemy, "seraph_dash", {
          windup: 0.48,
          recover: 1,
          tellShape: "charge",
          tellColor: COLORS.cyan,
          tellX: enemy.x + enemy.facing * 132,
          tellY: enemy.y - 64,
          parryable: true
        });
      } else if (enemy.phaseIndex === 1) {
        queueEnemyAttack(enemy, "seraph_cross", {
          windup: 0.62,
          recover: 1.2,
          tellShape: "cross",
          tellColor: COLORS.cyan,
          tellX: enemy.x + enemy.facing * 84,
          tellY: enemy.y - 74,
          parryable: true
        });
      } else {
        queueEnemyAttack(enemy, "seraph_halo", {
          windup: 0.82,
          recover: 1.25,
          tellShape: "burst",
          tellColor: COLORS.crimson,
          tellX: enemy.x,
          tellY: enemy.y - 86,
          parryable: false
        });
      }
      return true;
    }

    if (range <= 176 && height < 110) {
      queueEnemyAttack(enemy, "seraph_cleave", {
        windup: 0.42,
        recover: 0.86,
        tellShape: "thrust",
        tellColor: COLORS.cyan,
        tellX: enemy.x + enemy.facing * 140,
        tellY: enemy.y - 50,
        parryable: true
      });
      return true;
    }
    return false;
  }

  switch (enemy.id) {
    case "shield_paladin":
      if (range <= 138 && height < 96) {
        queueEnemyAttack(enemy, "shield_bash", {
          windup: 0.58,
          recover: 1.05,
          tellShape: "shield",
          tellColor: COLORS.cyan,
          tellX: enemy.x + enemy.facing * 92,
          tellY: enemy.y - 40,
          parryable: true
        });
        return true;
      }
      break;
    case "lancer":
      if (range <= 228 && range >= 70 && height < 92) {
        queueEnemyAttack(enemy, "sunlance_thrust", {
          windup: 0.46,
          recover: 0.96,
          tellShape: "thrust",
          tellColor: COLORS.cyan,
          tellX: enemy.x + enemy.facing * 142,
          tellY: enemy.y - 42,
          parryable: true
        });
        return true;
      }
      break;
    case "choir_adept":
      if (range <= 480 && range >= 140 && height < 220) {
        const useArc = range > 280 || game.player.y + 20 < enemy.y;
        queueEnemyAttack(enemy, useArc ? "choir_arc" : "choir_direct", {
          windup: useArc ? 0.78 : 0.66,
          recover: useArc ? 1.28 : 1.12,
          tellShape: useArc ? "arc" : "glyph",
          tellColor: COLORS.cyan,
          tellX: enemy.x + enemy.facing * 46,
          tellY: enemy.y - 74,
          parryable: true
        });
        return true;
      }
      break;
    case "inquisitor":
      if (range <= 260 && range >= 86 && height < 108) {
        queueEnemyAttack(enemy, "inquisitor_lash", {
          windup: 0.54,
          recover: 1.04,
          tellShape: "lash",
          tellColor: COLORS.cyan,
          tellX: enemy.x + enemy.facing * 112,
          tellY: enemy.y - 48,
          parryable: true
        });
        return true;
      }
      break;
    case "blessed_hound":
      if (range <= 230 && range >= 50 && height < 92 && enemy.onGround) {
        queueEnemyAttack(enemy, "hound_pounce", {
          windup: 0.38,
          recover: 1.18,
          tellShape: "pounce",
          tellColor: COLORS.cyan,
          tellX: enemy.x + enemy.facing * 74,
          tellY: enemy.y - 22,
          parryable: true,
          targetX: game.player.x
        });
        return true;
      }
      break;
    default:
      break;
  }

  return false;
}

function updateEnemyWindupMotion(enemy, dt) {
  const progress = getEnemyWindupProgress(enemy);
  switch (enemy.attackType) {
    case "shield_bash":
    case "aurex_cleave":
      enemy.vx = -enemy.facing * 70 * (1 - progress);
      break;
    case "sunlance_thrust":
    case "seraph_cleave":
      enemy.vx = -enemy.facing * 110 * (1 - progress);
      break;
    case "inquisitor_lash":
      enemy.vx = -enemy.facing * 52 * (1 - progress);
      break;
    case "hound_pounce":
      enemy.vx = -enemy.facing * 150 * (1 - progress);
      break;
    case "aurex_charge":
    case "seraph_dash":
      enemy.vx = -enemy.facing * 120 * (1 - progress);
      break;
    default:
      enemy.vx = 0;
      break;
  }
}

function updateEnemyLeap(enemy, dt) {
  if (enemy.leapTime <= 0) {
    return false;
  }

  enemy.leapTime = Math.max(0, enemy.leapTime - dt);
  enemy.vy += GRAVITY * dt;
  moveEntity(enemy, dt);
  enemy.x = clamp(enemy.x, 40, WIDTH - 40);

  if ((enemy.onGround || enemy.leapTime <= 0) && enemy.leapImpactPending) {
    addEffect({ type: "rush_arc", x: enemy.x, y: enemy.y - 24, facing: enemy.facing, life: 0.22 });
    resolveEnemyStrike(enemy, {
      ax: enemy.x - enemy.facing * 12,
      ay: enemy.y - 18,
      bx: enemy.x + enemy.facing * 92,
      by: enemy.y - 12,
      radius: 60,
      damage: enemy.damage + 3,
      parryable: true,
      parryGloom: 16
    });
    enemy.leapImpactPending = false;
    enemy.cooldown = 1.18;
  }

  return true;
}

function updateEnemies(dt) {
  const player = game.player;

  for (const enemy of game.enemies) {
    enemy.cooldown = Math.max(0, enemy.cooldown - dt);
    enemy.attackTimer = Math.max(0, enemy.attackTimer - dt);
    enemy.stun = Math.max(0, enemy.stun - dt);
    enemy.hurtFlash = Math.max(0, enemy.hurtFlash - dt);
    if (enemy.isBoss) {
      updateBossPhase(enemy);
      enemy.specialCooldown = Math.max(0, enemy.specialCooldown - dt);
    }

    if (enemy.health <= 0) {
      continue;
    }

    if (enemy.leapTime > 0) {
      updateEnemyLeap(enemy, dt);
      continue;
    }

    if (enemy.stun > 0) {
      enemy.vx = lerp(enemy.vx, 0, 0.22);
      enemy.vy += GRAVITY * dt;
      moveEntity(enemy, dt);
      continue;
    }

    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    enemy.facing = dx >= 0 ? 1 : -1;

    if (enemy.attackTimer > 0) {
      updateEnemyWindupMotion(enemy, dt);
      if (enemy.attackTimer <= 0.05) {
        executeEnemyAttack(enemy);
      }
    } else if (enemy.cooldown <= 0 && chooseEnemyAttack(enemy, dx, dy)) {
      enemy.vx = 0;
    } else {
      const speed = enemy.isBoss ? enemy.speed : ENEMIES[enemy.id].speed;
      if (enemy.id === "choir_adept" && Math.abs(dx) < 180) {
        enemy.vx = -Math.sign(dx || enemy.facing) * speed * 0.82;
      } else if (enemy.id === "inquisitor" && Math.abs(dx) < 100) {
        enemy.vx = -Math.sign(dx || enemy.facing) * speed * 0.55;
      } else {
        enemy.vx = Math.sign(dx) * speed;
      }
    }

    if (!enemy.onGround) {
      enemy.vy += GRAVITY * dt;
    }

    moveEntity(enemy, dt);
    enemy.x = clamp(enemy.x, 40, WIDTH - 40);
  }

  const survivors = [];
  for (const enemy of game.enemies) {
    if (enemy.health > 0) {
      survivors.push(enemy);
      continue;
    }
    handleEnemyDeath(enemy);
  }
  game.enemies = survivors;
}

function executeEnemyAttack(enemy) {
  switch (enemy.attackType) {
    case "shield_bash":
      resolveEnemyStrike(enemy, {
        ax: enemy.x + enemy.facing * 24,
        ay: enemy.y - 40,
        bx: enemy.x + enemy.facing * 120,
        by: enemy.y - 36,
        radius: 44,
        damage: enemy.damage + 2,
        parryable: true
      });
      addEffect({ type: "rush_arc", x: enemy.x + enemy.facing * 64, y: enemy.y - 38, facing: enemy.facing, life: 0.18 });
      break;
    case "sunlance_thrust":
      resolveEnemyStrike(enemy, {
        ax: enemy.x + enemy.facing * 28,
        ay: enemy.y - 42,
        bx: enemy.x + enemy.facing * 206,
        by: enemy.y - 42,
        radius: 24,
        damage: enemy.damage + 3,
        parryable: true
      });
      addEffect({ type: "seraph_slash", x: enemy.x + enemy.facing * 124, y: enemy.y - 42, facing: enemy.facing, life: 0.16 });
      break;
    case "choir_direct":
      createProjectile(
        enemy.x + enemy.facing * 36,
        enemy.y - 64,
        enemy.facing * 460,
        0,
        16,
        COLORS.cyan,
        enemy.damage,
        "enemy",
        0.82,
        { maxDistance: 320, shape: "direct" }
      );
      addEffect({ type: "choir_cast", x: enemy.x + enemy.facing * 36, y: enemy.y - 68, life: 0.28 });
      break;
    case "choir_arc":
      createProjectile(
        enemy.x + enemy.facing * 30,
        enemy.y - 70,
        enemy.facing * 260,
        -420,
        15,
        COLORS.ivory,
        enemy.damage + 2,
        "enemy",
        1.22,
        { gravity: 820, maxDistance: 430, shape: "arc" }
      );
      addEffect({ type: "choir_cast", x: enemy.x + enemy.facing * 30, y: enemy.y - 72, life: 0.32 });
      break;
    case "inquisitor_lash":
      createProjectile(
        enemy.x + enemy.facing * 40,
        enemy.y - 50,
        enemy.facing * 580,
        0,
        18,
        COLORS.crimson,
        enemy.damage + 2,
        "enemy",
        0.5,
        { maxDistance: 250, shape: "direct" }
      );
      addEffect({ type: "cross_cut", x: enemy.x + enemy.facing * 72, y: enemy.y - 52, facing: enemy.facing, life: 0.18 });
      break;
    case "hound_pounce":
      enemy.vx = enemy.facing * 360;
      enemy.vy = -560;
      enemy.leapTime = 0.6;
      enemy.leapImpactPending = true;
      finishEnemyAttack(enemy);
      return;
    case "aurex_cleave":
      resolveEnemyStrike(enemy, {
        ax: enemy.x + enemy.facing * 30,
        ay: enemy.y - 48,
        bx: enemy.x + enemy.facing * 148,
        by: enemy.y - 40,
        radius: 52,
        damage: enemy.damage + 4,
        parryable: true,
        parryGloom: 20
      });
      addEffect({ type: "rush_arc", x: enemy.x + enemy.facing * 76, y: enemy.y - 46, facing: enemy.facing, life: 0.2 });
      break;
    case "aurex_charge":
      enemy.vx = enemy.facing * 680;
      addEffect({ type: "rush_arc", x: enemy.x + enemy.facing * 88, y: enemy.y - 52, facing: enemy.facing, life: 0.24 });
      resolveEnemyStrike(enemy, {
        ax: enemy.x + enemy.facing * 36,
        ay: enemy.y - 52,
        bx: enemy.x + enemy.facing * 186,
        by: enemy.y - 44,
        radius: 58,
        damage: enemy.damage + 6,
        parryable: true,
        parryGloom: 22
      });
      enemy.specialCooldown = enemy.phases[enemy.phaseIndex].specialCooldown;
      break;
    case "aurex_halo":
      addEffect({ type: "halo_burst", x: enemy.x, y: enemy.y - 90, life: 0.5 });
      addCameraTrauma(0.12);
      resolveEnemyStrike(enemy, {
        ax: enemy.x - 180,
        ay: enemy.y - 60,
        bx: enemy.x + 180,
        by: enemy.y - 60,
        radius: 96,
        damage: enemy.damage + 9,
        parryable: false
      });
      enemy.specialCooldown = enemy.phases[enemy.phaseIndex].specialCooldown;
      break;
    case "seraph_cleave":
      resolveEnemyStrike(enemy, {
        ax: enemy.x + enemy.facing * 34,
        ay: enemy.y - 50,
        bx: enemy.x + enemy.facing * 180,
        by: enemy.y - 40,
        radius: 34,
        damage: enemy.damage + 3,
        parryable: true,
        parryGloom: 22
      });
      addEffect({ type: "seraph_slash", x: enemy.x + enemy.facing * 108, y: enemy.y - 54, facing: enemy.facing, life: 0.2 });
      break;
    case "seraph_dash":
      enemy.vx = enemy.facing * 820;
      addEffect({ type: "seraph_slash", x: enemy.x + enemy.facing * 92, y: enemy.y - 58, facing: enemy.facing, life: 0.22 });
      resolveEnemyStrike(enemy, {
        ax: enemy.x + enemy.facing * 30,
        ay: enemy.y - 58,
        bx: enemy.x + enemy.facing * 190,
        by: enemy.y - 42,
        radius: 42,
        damage: enemy.damage + 5,
        parryable: true,
        parryGloom: 24
      });
      enemy.specialCooldown = enemy.phases[enemy.phaseIndex].specialCooldown;
      break;
    case "seraph_cross":
      createProjectile(
        enemy.x + enemy.facing * 36,
        enemy.y - 56,
        enemy.facing * 520,
        0,
        22,
        COLORS.cyan,
        enemy.damage + 5,
        "enemy",
        0.92,
        { maxDistance: 360, shape: "direct" }
      );
      createProjectile(
        enemy.x + enemy.facing * 30,
        enemy.y - 18,
        enemy.facing * 250,
        -340,
        16,
        COLORS.ivory,
        enemy.damage + 4,
        "enemy",
        1.08,
        { gravity: 780, maxDistance: 390, shape: "arc" }
      );
      addEffect({ type: "cross_cut", x: enemy.x + enemy.facing * 76, y: enemy.y - 56, facing: enemy.facing, life: 0.26 });
      enemy.specialCooldown = enemy.phases[enemy.phaseIndex].specialCooldown;
      break;
    case "seraph_halo":
      addEffect({ type: "seraph_halo", x: enemy.x, y: enemy.y - 80, life: 0.55 });
      flashScreen("rgba(122,215,224,0.18)", 0.08);
      addCameraTrauma(0.14);
      resolveEnemyStrike(enemy, {
        ax: enemy.x - 200,
        ay: enemy.y - 70,
        bx: enemy.x + 200,
        by: enemy.y - 70,
        radius: 110,
        damage: enemy.damage + 10,
        parryable: false
      });
      enemy.specialCooldown = enemy.phases[enemy.phaseIndex].specialCooldown;
      break;
    default:
      break;
  }

  finishEnemyAttack(enemy);
}

function updateBossPhase(boss) {
  const ratio = boss.health / boss.maxHealth;
  let index = boss.phaseIndex;
  for (let i = 0; i < boss.phases.length; i += 1) {
    if (ratio <= boss.phases[i].threshold) {
      index = i;
    }
  }

  if (index !== boss.phaseIndex) {
    boss.phaseIndex = index;
    boss.specialCooldown = boss.phases[index].specialCooldown;
    if (boss.id === "sir_aurex") {
      pushMessage(DIALOGUE.aurex_shift);
    } else if (boss.id === "seraph_vale") {
      pushMessage(index === 1 ? DIALOGUE.seraph_shift_1 : DIALOGUE.seraph_shift_2);
    }
  }
}

function updateProjectiles(dt) {
  const alive = [];
  for (const projectile of game.projectiles) {
    projectile.life -= dt;
    projectile.trailTimer = Math.max(0, projectile.trailTimer - dt);
    if (projectile.life <= 0) {
      continue;
    }
    if (projectile.trailTimer <= 0) {
      addEffect({
        type: "projectile_trail",
        x: projectile.x,
        y: projectile.y,
        radius: projectile.radius,
        color: projectile.color,
        vx: projectile.vx,
        vy: projectile.vy,
        life: 0.14
      });
      projectile.trailTimer = 0.03;
    }
    projectile.vy += projectile.gravity * dt;
    projectile.x += projectile.vx * dt;
    projectile.y += projectile.vy * dt;
    if (projectile.x < -40 || projectile.x > WIDTH + 40 || projectile.y < -40 || projectile.y > HEIGHT + 40) {
      continue;
    }
    if (Math.hypot(projectile.x - projectile.startX, projectile.y - projectile.startY) > projectile.maxDistance) {
      continue;
    }

    if (projectile.owner.startsWith("player")) {
      let hit = false;
      for (const enemy of game.enemies) {
        if (distance(projectile, enemy) <= projectile.radius + enemy.w * 0.4) {
          enemy.health -= projectile.damage;
          enemy.stun = 0.28;
          enemy.hurtFlash = 0.1;
          enemy.vx += Math.sign(projectile.vx || game.player.facing) * 200;
          hit = true;
          const impactX = enemy.x;
          const impactY = enemy.y - 42;
          addEffect({ type: "skill_slash", x: impactX, y: impactY, facing: game.player.facing, life: 0.18 });
          spawnDirectionalImpact(impactX, impactY, Math.atan2(projectile.vy, projectile.vx), COLORS.cyan, COLORS.ivory, 0.95);
          addHitstop(0.035);
          addCameraTrauma(0.2);
        }
      }
      if (hit) {
        gainGloom(6);
        continue;
      }
    } else if (distance(projectile, game.player) <= projectile.radius + game.player.w * 0.42) {
      if (tryParry({ x: projectile.x, y: projectile.y, isProjectile: true })) {
        addEffect({ type: "parry_flash", x: game.player.x, y: game.player.y - 55, life: 0.18 });
        spawnDirectionalImpact(projectile.x, projectile.y, Math.atan2(projectile.vy, projectile.vx), COLORS.cyan, COLORS.ivory, 0.72);
        addHitstop(0.045);
        addCameraTrauma(0.22);
        gainGloom(12);
        continue;
      }
      damagePlayer(projectile.damage, projectile);
      continue;
    }

    alive.push(projectile);
  }
  game.projectiles = alive;
}

function updateEffects(dt) {
  game.effects = game.effects.filter((effect) => {
    effect.age += dt;
    effect.life -= dt;
    return effect.life > 0;
  });
}

function handleEnemyDeath(enemy) {
  game.meta.ash += enemy.isBoss ? 30 : 5;
  if (enemy.isBoss) {
    if (!game.run.defeatedBosses.includes(game.room.id)) {
      game.run.defeatedBosses.push(game.room.id);
    }
    if (enemy.id === "sir_aurex") {
      pushMessage(DIALOGUE.aurex_defeat);
      if (grantAbility("chain_grapple")) {
        pushMessage("Chain Grapple unlocked.");
      }
    } else if (enemy.id === "seraph_vale") {
      pushMessage(DIALOGUE.seraph_defeat, 6);
      if (!game.meta.storyFlags.includes("seraph_defeated")) {
        game.meta.storyFlags.push("seraph_defeated");
      }
      game.victory = true;
    }
  }

  addEffect({
    type: enemy.isBoss ? "boss_burst" : "enemy_burst",
    x: enemy.x,
    y: enemy.y - enemy.h * 0.5,
    life: enemy.isBoss ? 0.5 : 0.3
  });
  addCameraTrauma(enemy.isBoss ? 0.42 : 0.12);
  flashScreen(enemy.isBoss ? "rgba(122,215,224,0.24)" : "rgba(227,219,199,0.12)", enemy.isBoss ? 0.16 : 0.08);

  if (!game.enemies.some((other) => other !== enemy && other.health > 0)) {
    const roomHeal = getActiveRelicModifiers().roomHeal || 0;
    if (roomHeal > 0) {
      game.run.health = clamp(game.run.health + roomHeal, 0, game.run.maxHealth);
    }
    if (!enemy.isBoss) {
      pushMessage("Room cleared.");
    }
  }

  saveGame();
}

function tryParry(attacker) {
  const player = game.player;
  if (player.parryTime <= 0) {
    return false;
  }
  if (distance(player, attacker) > 130) {
    return false;
  }
  player.parryTime = 0;
  player.action = "parry";
  player.invulnerable = 0.12;
  return true;
}

function damagePlayer(amount, source) {
  if (game.player.invulnerable > 0) {
    return;
  }

  game.run.health = Math.max(0, game.run.health - amount);
  game.player.invulnerable = 0.65;
  game.player.vx = (game.player.x < source.x ? -1 : 1) * 260;
  game.player.vy = -220;
  addEffect({ type: "hit_burst", x: game.player.x, y: game.player.y - 50, life: 0.22 });
  spawnDirectionalImpact(
    game.player.x,
    game.player.y - 52,
    Math.atan2(game.player.y - source.y, game.player.x - source.x),
    COLORS.crimson,
    COLORS.ivory,
    0.85
  );
  addHitstop(0.05);
  addCameraTrauma(0.35);
  flashScreen("rgba(127,29,43,0.22)", 0.14);
  if (game.run.health <= 0) {
    handlePlayerDeath();
  }
}

function handlePlayerDeath() {
  game.meta.ash = Math.max(0, game.meta.ash - 10);
  pushMessage("Cael falls. The sanctuary calls him back.");
  startNewRun();
}

function nearestInteraction() {
  let best = null;
  let bestDistance = Infinity;
  for (const interactable of game.interactables) {
    const d = distance(interactable, game.player);
    if (d <= interactable.radius && d < bestDistance) {
      best = interactable;
      bestDistance = d;
    }
  }
  return best;
}

function tryInteract() {
  const interaction = nearestInteraction();
  if (!interaction) {
    return;
  }

  if (interaction.type === "door") {
    if (interaction.gate && !hasAbility(interaction.gate)) {
      pushMessage(`Locked by ${ABILITIES[interaction.gate].name}.`);
      return;
    }
    loadRoom(interaction.target, interaction.spawnTag);
    return;
  }

  if (interaction.type === "forge") {
    cycleWeapon();
    pushMessage(DIALOGUE.mara_forge);
    return;
  }

  if (interaction.type === "archive") {
    pushMessage(`${DIALOGUE.hub_intro} Memory shards: ${game.meta.memoryShards.length}.`);
    return;
  }

  if (interaction.type === "oath") {
    cycleOath();
    pushMessage(DIALOGUE.joren_oath);
    return;
  }

  if (interaction.type === "altar") {
    if (grantAbility("black_wing")) {
      pushMessage(DIALOGUE.black_wing_unlock);
      addEffect({ type: "wing_burst", x: interaction.x, y: interaction.y, life: 0.45 });
      updateStats();
    }
    return;
  }

  if (interaction.type === "reward") {
    if (game.enemies.some((enemy) => enemy.health > 0)) {
      pushMessage("Defeat the room's defenders before claiming its reward.");
      return;
    }
    claimReward();
  }
}

function cycleWeapon() {
  const available = game.meta.unlockedWeapons.filter((id) => WEAPONS[id]);
  const currentIndex = available.indexOf(game.run.currentWeapon);
  const next = available[(currentIndex + 1) % available.length];
  game.run.currentWeapon = next;
  updateStats();
  saveGame();
}

function cycleOath() {
  const ids = Object.keys(OATHS);
  const currentIndex = ids.indexOf(game.run.oath);
  game.run.oath = ids[(currentIndex + 1) % ids.length];
  updateStats();
  saveGame();
}

function claimReward() {
  if (!game.room.rewards || game.run.claimedRewards.includes(game.room.id)) {
    return;
  }

  game.run.claimedRewards.push(game.room.id);
  for (const reward of game.room.rewards) {
    if (reward === "ash_cache") {
      game.meta.ash += 20;
      pushMessage("Recovered 20 Ash.");
    } else if (reward === "memory_shard") {
      const shard = `${game.room.id}_memory`;
      if (!game.meta.memoryShards.includes(shard)) {
        game.meta.memoryShards.push(shard);
      }
      pushMessage("A memory shard crawls back into focus.");
    } else if (reward === "relic") {
      const relicIds = Object.keys(RELICS).filter((id) => !game.run.relics.includes(id));
      const random = mulberry32(game.run.seed ^ game.run.claimedRewards.length);
      const relicId = relicIds.length ? pickFrom(relicIds, random) : pickFrom(Object.keys(RELICS), random);
      game.run.relics.push(relicId);
      pushMessage(`Relic claimed: ${RELICS[relicId].name}.`);
    }
  }

  buildInteractionsForRoom(game.room);
  updateStats();
  saveGame();
}

function update(dt) {
  if (!game.room) {
    loadRoom(game.run.currentRoom || "hub_sanctuary", game.run.playerSpawnTag || "start");
  }

  if (game.hitstop > 0) {
    game.hitstop = Math.max(0, game.hitstop - dt);
  }
  const simDt = game.hitstop > 0 ? dt * 0.12 : dt;
  updateCamera(dt);

  if (game.messageTime > 0) {
    game.messageTime -= simDt;
    if (game.messageTime <= 0) {
      game.message = "";
      messageEl.textContent = "Press E near sigils, altars, and doors.";
    }
  }

  updatePlayer(simDt);
  updateEnemies(simDt);
  updateProjectiles(simDt);
  updateEffects(simDt);
  updateStats();
  clearPressed();
}

function draw() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  ctx.save();
  ctx.translate(game.camera.offsetX, game.camera.offsetY);
  drawBackground();
  drawPlatforms();
  drawGrapplePoints();
  drawProjectiles();
  drawEntities();
  drawEffects();
  drawInteractables();
  ctx.restore();
  drawHud();
  if (game.camera.flash > 0) {
    ctx.save();
    ctx.globalAlpha = game.camera.flash;
    ctx.fillStyle = game.camera.flashColor;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.restore();
  }
  if (game.victory) {
    drawVictoryOverlay();
  }
}

function drawBackground() {
  const room = game.room;
  if (!room) {
    return;
  }

  const gradients = {
    ashfall: ["#2c232d", "#18131a"],
    reliquary: ["#25242f", "#111117"],
    mirror: ["#24233a", "#110f18"]
  };

  const [topColor, bottomColor] = gradients[room.sector];
  const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  gradient.addColorStop(0, topColor);
  gradient.addColorStop(1, bottomColor);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  drawBackgroundLayer(room.sector, 0.18, 0);
  drawBackgroundLayer(room.sector, 0.28, 120);
  drawBackgroundLayer(room.sector, 0.42, 260);

  if (room.sector === "mirror") {
    const radial = ctx.createRadialGradient(800, 120, 20, 800, 180, 380);
    radial.addColorStop(0, "rgba(122,215,224,0.22)");
    radial.addColorStop(1, "rgba(122,215,224,0)");
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, WIDTH, 420);
  }

  const vignette = ctx.createRadialGradient(WIDTH * 0.5, HEIGHT * 0.45, 220, WIDTH * 0.5, HEIGHT * 0.45, 980);
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.42)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
}

function drawBackgroundLayer(sector, alpha, offsetY) {
  ctx.save();
  ctx.translate(0, offsetY);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = sector === "mirror" ? "#d8e4ee" : sector === "reliquary" ? "#554f61" : "#403540";

  for (let i = 0; i < 8; i += 1) {
    const width = 140 + (i % 3) * 60;
    const height = 180 + (i % 4) * 70;
    const x = i * 220 - 40;
    const y = sector === "reliquary" ? 310 - height : 380 - height;
    ctx.beginPath();
    ctx.moveTo(x, 500);
    ctx.lineTo(x + 20, y + height);
    ctx.lineTo(x + width * 0.35, y);
    ctx.lineTo(x + width * 0.7, y + height * 0.2);
    ctx.lineTo(x + width, 500);
    ctx.closePath();
    ctx.fill();
  }

  if (sector !== "ashfall") {
    ctx.strokeStyle = sector === "mirror" ? "rgba(122,215,224,0.35)" : "rgba(227,219,199,0.25)";
    ctx.lineWidth = 6;
    for (let i = 0; i < 5; i += 1) {
      ctx.beginPath();
      ctx.moveTo(180 + i * 300, 120);
      ctx.lineTo(210 + i * 300, 500);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function drawPlatforms() {
  for (const solid of game.roomLayout.solids) {
    ctx.fillStyle = solid.y >= FLOOR_Y ? COLORS.floor : "#302a33";
    ctx.fillRect(solid.x, solid.y, solid.w, solid.h);
    ctx.fillStyle = "rgba(227,219,199,0.14)";
    ctx.fillRect(solid.x, solid.y, solid.w, 5);
  }
}

function drawGrapplePoints() {
  if (!hasAbility("chain_grapple")) {
    return;
  }
  for (const point of game.roomLayout.grapplePoints) {
    ctx.save();
    ctx.translate(point.x, point.y);
    ctx.strokeStyle = "rgba(122,215,224,0.9)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.lineTo(16, 0);
    ctx.lineTo(0, 20);
    ctx.lineTo(-16, 0);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }
}

function drawEntities() {
  const actors = [...game.enemies, game.player].sort((a, b) => a.y - b.y);
  for (const actor of actors) {
    drawActor(actor);
  }
}

function drawActor(entity) {
  const x = entity.x;
  const y = entity.y + entity.h * 0.5;
  const facing = entity.facing || 1;

  drawGroundShadow(entity, y);
  if (entity.kind === "player" || entity.isBoss) {
    const glow = ctx.createRadialGradient(x, y - entity.h * 0.8, 20, x, y - entity.h * 0.8, entity.isBoss ? 180 : 140);
    glow.addColorStop(0, entity.kind === "player" ? "rgba(122,215,224,0.18)" : "rgba(227,219,199,0.16)");
    glow.addColorStop(1, "rgba(122,215,224,0)");
    ctx.save();
    ctx.fillStyle = glow;
    ctx.fillRect(x - 220, y - 260, 440, 340);
    ctx.restore();
  }
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(facing, 1);

  const bob = Math.sin(performance.now() * 0.008 + x * 0.01) * 2;
  ctx.translate(0, bob);

  if (entity.kind === "player") {
    drawPlayerShape(entity);
  } else {
    drawEnemyShape(entity);
    if (entity.hurtFlash > 0) {
      ctx.save();
      ctx.globalAlpha = clamp01(entity.hurtFlash * 7);
      ctx.globalCompositeOperation = "lighter";
      ctx.filter = "brightness(2.4) saturate(0.3)";
      drawEnemyShape(entity);
      ctx.restore();
    }
  }

  ctx.restore();
}

function drawGroundShadow(entity, floorY) {
  const lift = clamp01((FLOOR_Y - (entity.y + entity.h * 0.5)) / 180);
  const width = entity.w * (entity.kind === "player" ? 0.95 : entity.isBoss ? 1.2 : 1.05);
  const alpha = entity.kind === "player" ? 0.18 : entity.isBoss ? 0.22 : 0.14;
  ctx.save();
  ctx.translate(entity.x, floorY + 10);
  ctx.fillStyle = `rgba(0,0,0,${alpha * (1 - lift * 0.45)})`;
  ctx.beginPath();
  ctx.ellipse(0, 0, width, 16 + entity.h * 0.04, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawPlayerShape(player) {
  const attack = player.attackState;
  const attackProgress = attack ? clamp01(attack.elapsed / attack.duration) : 0;
  const motionLean = attack
    ? lerp(-0.16, 0.18, easeInOutCubic(attackProgress))
    : player.action === "run"
      ? 0.08
      : player.action === "dash"
        ? 0.16
        : player.action === "jump"
          ? -0.05
          : 0;
  const capeDrift = attack
    ? 34 + Math.sin(attackProgress * Math.PI) * 22
    : player.action === "dash"
      ? 54
      : 28;
  const auraAlpha = 0.16 + (game.run.gloom / 100) * 0.15 + (attack ? 0.08 : 0);
  const parryAlpha = clamp01(player.parryTime * 3.6);
  ctx.fillStyle = `rgba(122,215,224,${auraAlpha * 0.8})`;
  ctx.beginPath();
  ctx.ellipse(-10, -92, 48, 78, -0.16, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = `rgba(122,215,224,${auraAlpha})`;
  ctx.beginPath();
  ctx.ellipse(-6, -98, 32, 54, -0.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.rotate(motionLean);
  ctx.fillStyle = COLORS.crimson;
  ctx.beginPath();
  ctx.moveTo(-12, -82);
  ctx.lineTo(-78, -48 + capeDrift * 0.18);
  ctx.lineTo(-48, 12 + capeDrift * 0.1);
  ctx.lineTo(-6, -8);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#2b252c";
  ctx.fillRect(-10, -78, 26, 56);
  ctx.fillRect(-22, -18, 14, 54);
  ctx.fillRect(2, -12, 14, 48);
  ctx.fillRect(16, -70, 15, 36);
  ctx.fillRect(22, -36, 14, 36);

  ctx.fillStyle = "#d0c7b7";
  ctx.beginPath();
  ctx.arc(6, -94, 16, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(122,215,224,0.75)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(4, -102, 22, -2.6, -0.4);
  ctx.stroke();
  if (parryAlpha > 0) {
    ctx.strokeStyle = `rgba(122,215,224,${0.5 + parryAlpha * 0.4})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-14, -92);
    ctx.lineTo(28, -92);
    ctx.moveTo(7, -114);
    ctx.lineTo(7, -70);
    ctx.stroke();
  }
  ctx.restore();

  drawWeapon(game.run.currentWeapon, player, player.attackFlash);
}

function drawWeapon(weaponId, player, flash) {
  const localAngle = getLocalWeaponAngle(player);
  const weapon = WEAPONS[weaponId];
  const attack = player.attackState;
  const progress = attack ? clamp01(attack.elapsed / attack.duration) : 0;
  const handX = 24 + Math.cos(localAngle) * 8;
  const handY = -38 + Math.sin(localAngle) * 8;

  ctx.strokeStyle = "#3e353f";
  ctx.lineWidth = 10;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(22, -58);
  ctx.lineTo(handX, handY);
  ctx.stroke();

  ctx.strokeStyle = "#d0c7b7";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(24, -34);
  ctx.lineTo(handX, handY + 4);
  ctx.stroke();

  ctx.save();
  ctx.translate(weapon.gripOffset.x + 2, weapon.gripOffset.y + 52);
  ctx.rotate(localAngle);
  ctx.fillStyle = flash > 0 ? "#efe7d4" : "#c5bcaf";
  ctx.shadowBlur = attack ? 24 : 10;
  ctx.shadowColor = attack ? attack.profile.trailColor : "rgba(227,219,199,0.22)";
  if (weaponId === "chain_glaive") {
    ctx.fillRect(-10, -4, 124, 8);
    ctx.beginPath();
    ctx.moveTo(108, -20);
    ctx.lineTo(weapon.bladeLength, 0);
    ctx.lineTo(108, 20);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(122,215,224,0.6)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(18, 0);
    ctx.lineTo(-6, 32 + Math.sin(progress * Math.PI) * 10);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.moveTo(0, -7);
    ctx.lineTo(138, -24);
    ctx.lineTo(weapon.bladeLength, -8);
    ctx.lineTo(142, 16);
    ctx.lineTo(0, 8);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = COLORS.crimson;
    ctx.fillRect(-18, -5, 18, 10);
  }
  ctx.shadowBlur = 0;
  ctx.restore();
}

function getEnemyWindupPose(enemy) {
  const progress = getEnemyWindupProgress(enemy);
  switch (enemy.attackType) {
    case "shield_bash":
    case "aurex_cleave":
      return { bodyLean: -0.14 + progress * 0.18, shiftX: -18 * (1 - progress), shiftY: 0, reach: 16 * progress, crouch: 0 };
    case "sunlance_thrust":
    case "seraph_cleave":
      return { bodyLean: -0.18, shiftX: -28 * (1 - progress), shiftY: 0, reach: 34 * progress, crouch: 0 };
    case "choir_direct":
    case "choir_arc":
      return { bodyLean: -0.08, shiftX: 0, shiftY: -8 * progress, reach: 12 * progress, crouch: 0 };
    case "inquisitor_lash":
      return { bodyLean: -0.2, shiftX: -18 * (1 - progress), shiftY: 0, reach: 24 * progress, crouch: 0 };
    case "hound_pounce":
      return { bodyLean: 0.12, shiftX: -30 * (1 - progress), shiftY: 18 * (1 - progress), reach: 0, crouch: 20 * (1 - progress) };
    case "aurex_charge":
    case "seraph_dash":
      return { bodyLean: -0.12, shiftX: -24 * (1 - progress), shiftY: 0, reach: 22 * progress, crouch: 0 };
    case "aurex_halo":
    case "seraph_halo":
      return { bodyLean: 0, shiftX: 0, shiftY: -10 * progress, reach: 0, crouch: 0 };
    case "seraph_cross":
      return { bodyLean: -0.08, shiftX: -10 * (1 - progress), shiftY: -4 * progress, reach: 26 * progress, crouch: 0 };
    default:
      return { bodyLean: 0, shiftX: 0, shiftY: 0, reach: 0, crouch: 0 };
  }
}

function drawEnemyShape(enemy) {
  const pose = getEnemyWindupPose(enemy);
  if (enemy.drawKind === "hound") {
    drawHound(enemy, pose);
    return;
  }

  if (enemy.drawKind === "aurex") {
    drawAurex(enemy, pose);
    return;
  }

  if (enemy.drawKind === "seraph") {
    drawSeraph(enemy, pose);
    return;
  }

  const palette = {
    shield_paladin: { body: COLORS.ivory, trim: COLORS.gold, aura: COLORS.cyan },
    lancer: { body: "#f0e7d7", trim: COLORS.gold, aura: "#9dd9de" },
    choir_adept: { body: "#d8d2c6", trim: "#8cbfc7", aura: COLORS.cyan },
    inquisitor: { body: "#d7d2c1", trim: COLORS.crimson, aura: "#8ec0da" }
  }[enemy.drawKind];

  ctx.save();
  ctx.translate(pose.shiftX, pose.shiftY);
  ctx.rotate(pose.bodyLean);
  ctx.fillStyle = `rgba(122,215,224,${enemy.drawKind === "choir_adept" ? 0.18 : 0.08})`;
  ctx.beginPath();
  ctx.ellipse(-6, -92, 28, 42, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = palette.body;
  ctx.fillRect(-8, -76, 28, 54);
  ctx.fillRect(-18, -18, 14, 52);
  ctx.fillRect(4, -12, 14, 46);
  ctx.fillRect(18, -66, 16, 32);
  ctx.fillRect(24, -34, 14, 36);
  ctx.beginPath();
  ctx.arc(6, -90, 15, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = palette.trim;
  ctx.fillRect(-10, -24, 32, 8);

  if (enemy.drawKind === "shield_paladin") {
    ctx.fillRect(30 + pose.reach * 0.2, -28, 38, 50);
    ctx.fillStyle = palette.body;
    ctx.fillRect(18, -40 - pose.reach * 0.05, 112 + pose.reach, 6);
  } else if (enemy.drawKind === "lancer") {
    ctx.fillStyle = palette.body;
    ctx.fillRect(14, -42, 136 + pose.reach, 5);
  } else if (enemy.drawKind === "choir_adept") {
    ctx.fillStyle = palette.trim;
    ctx.beginPath();
    ctx.arc(44 + pose.reach * 0.3, -26 - pose.reach * 0.5, 12 + pose.reach * 0.06, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = palette.body;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(22, -48);
    ctx.lineTo(46 + pose.reach * 0.2, -30 - pose.reach * 0.45);
    ctx.stroke();
  } else if (enemy.drawKind === "inquisitor") {
    ctx.fillStyle = palette.trim;
    ctx.fillRect(18, -44, 82 + pose.reach, 7);
    ctx.beginPath();
    ctx.moveTo(96 + pose.reach * 0.7, -50);
    ctx.lineTo(126 + pose.reach, -30);
    ctx.lineTo(100 + pose.reach * 0.72, -18);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

function drawHound(enemy, pose) {
  ctx.save();
  ctx.translate(pose.shiftX, pose.shiftY + pose.crouch);
  ctx.rotate(pose.bodyLean);
  ctx.fillStyle = "rgba(122,215,224,0.08)";
  ctx.beginPath();
  ctx.ellipse(-12, -44, 46, 26, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = COLORS.ivory;
  ctx.fillRect(-48, -38, 72, 32);
  ctx.fillRect(-36, -10, 12, 32);
  ctx.fillRect(-8, -10, 12, 32);
  ctx.fillRect(18, -10, 12, 32);
  ctx.beginPath();
  ctx.arc(26, -38, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = COLORS.gold;
  ctx.beginPath();
  ctx.moveTo(18, -50);
  ctx.lineTo(0, -70);
  ctx.lineTo(12, -40);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawAurex(enemy, pose) {
  ctx.save();
  ctx.translate(pose.shiftX, pose.shiftY);
  ctx.rotate(pose.bodyLean);
  ctx.fillStyle = "rgba(227,219,199,0.12)";
  ctx.beginPath();
  ctx.ellipse(-8, -118, 40, 58, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(122,215,224,0.55)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(0, -126, 30, -2.7, -0.4);
  ctx.stroke();

  ctx.fillStyle = COLORS.ivory;
  ctx.fillRect(-16, -98, 38, 74);
  ctx.fillRect(-28, -22, 18, 62);
  ctx.fillRect(6, -18, 18, 58);
  ctx.fillRect(18, -84, 18, 42);
  ctx.fillRect(28, -42, 16, 42);
  ctx.beginPath();
  ctx.arc(6, -112, 18, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = COLORS.gold;
  ctx.fillRect(-16, -28, 40, 10);
  ctx.fillRect(34 + pose.reach * 0.16, -32, 48, 62);
  ctx.fillRect(20, -50, 126 + pose.reach, 7);
  ctx.restore();
}

function drawSeraph(enemy, pose) {
  ctx.save();
  ctx.translate(pose.shiftX, pose.shiftY);
  ctx.rotate(pose.bodyLean);
  ctx.fillStyle = "rgba(122,215,224,0.18)";
  ctx.beginPath();
  ctx.ellipse(-6, -118, 38, 68, -0.1, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(122,215,224,0.9)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(4, -130, 30, -2.9, -0.2);
  ctx.stroke();

  ctx.fillStyle = COLORS.cyan;
  ctx.beginPath();
  ctx.moveTo(0, -164);
  ctx.lineTo(12, -142);
  ctx.lineTo(-12, -142);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = COLORS.ivory;
  ctx.beginPath();
  ctx.moveTo(-12, -102);
  ctx.lineTo(18, -102);
  ctx.lineTo(28, -30);
  ctx.lineTo(-8, -28);
  ctx.closePath();
  ctx.fill();
  ctx.fillRect(-22, -20, 14, 62);
  ctx.fillRect(6, -14, 14, 56);
  ctx.fillRect(18, -86, 16, 40);
  ctx.fillRect(30, -42, 14, 40);
  ctx.beginPath();
  ctx.arc(5, -116, 17, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = COLORS.cyan;
  ctx.beginPath();
  ctx.moveTo(-8, -98);
  ctx.lineTo(-78, -42);
  ctx.lineTo(-36, 6);
  ctx.lineTo(6, -18);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = COLORS.ivory;
  ctx.fillRect(18, -50, 156 + pose.reach, 6);
  ctx.beginPath();
  ctx.moveTo(154 + pose.reach * 0.7, -58);
  ctx.lineTo(204 + pose.reach, -47);
  ctx.lineTo(154 + pose.reach * 0.7, -36);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawProjectiles() {
  for (const projectile of game.projectiles) {
    const nx = projectile.vx || 1;
    const ny = projectile.vy || 0;
    const length = Math.min(90, Math.hypot(nx, ny) * 0.07 + projectile.radius * 1.5);
    const angle = Math.atan2(ny, nx);
    ctx.save();
    ctx.translate(projectile.x, projectile.y);
    ctx.rotate(angle);
    ctx.globalCompositeOperation = "lighter";
    const gradient = ctx.createLinearGradient(-length, 0, projectile.radius * 2, 0);
    gradient.addColorStop(0, "rgba(255,255,255,0)");
    gradient.addColorStop(0.5, projectile.color);
    gradient.addColorStop(1, "rgba(255,255,255,0.95)");
    ctx.strokeStyle = gradient;
    ctx.lineWidth = projectile.radius * 1.4;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-length, 0);
    ctx.lineTo(projectile.radius * 2.2, 0);
    ctx.stroke();
    ctx.fillStyle = projectile.color;
    ctx.beginPath();
    ctx.arc(0, 0, projectile.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.arc(0, 0, projectile.radius * 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawAfterimageShape(effect) {
  const alpha = clamp01(effect.life / effect.maxLife);
  ctx.save();
  ctx.translate(effect.x, effect.y + effect.h * 0.5);
  ctx.scale(effect.facing || 1, 1);
  ctx.globalAlpha = alpha * 0.75;
  ctx.fillStyle = effect.color;
  ctx.beginPath();
  ctx.ellipse(-8, -96, 34, 56, -0.18, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-14, -80);
  ctx.lineTo(-70, -42);
  ctx.lineTo(-48, 10);
  ctx.lineTo(-8, -8);
  ctx.closePath();
  ctx.fill();
  ctx.fillRect(-10, -78, 26, 56);
  ctx.fillRect(-22, -18, 14, 54);
  ctx.fillRect(2, -12, 14, 48);
  ctx.restore();
}

function drawEffects() {
  for (const effect of game.effects) {
    const alpha = clamp01(effect.life / effect.maxLife);

    if (effect.type === "grapple_line") {
      ctx.save();
      ctx.strokeStyle = "rgba(122,215,224,0.8)";
      ctx.lineWidth = 3;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.moveTo(effect.x, effect.y);
      ctx.lineTo(effect.x2, effect.y2);
      ctx.stroke();
      ctx.restore();
      continue;
    }

    if (effect.type === "afterimage") {
      drawAfterimageShape(effect);
      continue;
    }

    ctx.save();
    ctx.translate(effect.x, effect.y);
    ctx.scale(effect.facing || 1, 1);

    if (effect.type === "weapon_trail") {
      ctx.restore();
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = alpha * (effect.opacity || 1);
      ctx.strokeStyle = effect.glowColor;
      ctx.lineWidth = effect.heavy ? 32 : 20;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(effect.hiltX, effect.hiltY);
      ctx.quadraticCurveTo(effect.midX, effect.midY, effect.tipX, effect.tipY);
      ctx.stroke();
      ctx.strokeStyle = effect.color;
      ctx.lineWidth = effect.heavy ? 12 : 8;
      ctx.beginPath();
      ctx.moveTo(effect.hiltX, effect.hiltY);
      ctx.quadraticCurveTo(effect.midX, effect.midY, effect.tipX, effect.tipY);
      ctx.stroke();
      ctx.restore();
      continue;
    }

    if (effect.type === "projectile_trail") {
      const angle = Math.atan2(effect.vy || 0, effect.vx || 1);
      ctx.rotate(angle);
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = alpha * 0.8;
      ctx.strokeStyle = effect.color;
      ctx.lineWidth = effect.radius;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(-24, 0);
      ctx.lineTo(10, 0);
      ctx.stroke();
    } else if (effect.type === "light_slash" || effect.type === "heavy_slash" || effect.type === "skill_slash") {
      const radius = effect.type === "heavy_slash" ? 76 : effect.type === "skill_slash" ? 88 : 56;
      const color = effect.type === "skill_slash" ? COLORS.cyan : COLORS.ivory;
      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = effect.type === "heavy_slash" ? "rgba(168,140,87,0.36)" : "rgba(122,215,224,0.18)";
      ctx.lineWidth = effect.type === "heavy_slash" ? 20 : 14;
      ctx.globalAlpha = alpha * 0.7;
      ctx.beginPath();
      ctx.arc(-10, 0, radius, -0.92, 0.92);
      ctx.stroke();
      ctx.strokeStyle = color;
      ctx.lineWidth = effect.type === "heavy_slash" ? 10 : 6;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(-10, 0, radius, -0.92, 0.92);
      ctx.stroke();
    } else if (effect.type === "parry_flash") {
      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = COLORS.cyan;
      ctx.lineWidth = 6;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(0, 0, 38 + (1 - alpha) * 54, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = COLORS.ivory;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-54, 0);
      ctx.lineTo(54, 0);
      ctx.moveTo(0, -54);
      ctx.lineTo(0, 54);
      ctx.stroke();
    } else if (effect.type === "impact_sparks") {
      ctx.rotate(effect.angle || 0);
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < 8; i += 1) {
        const spread = lerp(-0.9, 0.9, i / 7);
        const length = (26 + i * 6) * (effect.intensity || 1) * (0.55 + alpha * 0.45);
        ctx.strokeStyle = i % 2 === 0 ? effect.primaryColor : effect.accentColor;
        ctx.lineWidth = i % 3 === 0 ? 4 : 2;
        ctx.globalAlpha = alpha * 0.9;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(spread) * length, Math.sin(spread) * length);
        ctx.stroke();
      }
    } else if (effect.type === "shock_ring") {
      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = effect.color;
      ctx.lineWidth = 5 + (effect.intensity || 1) * 2;
      ctx.globalAlpha = alpha * 0.7;
      ctx.beginPath();
      ctx.arc(0, 0, 16 + (1 - alpha) * 42 * (effect.intensity || 1), 0, Math.PI * 2);
      ctx.stroke();
    } else if (effect.type === "hit_burst" || effect.type === "enemy_burst" || effect.type === "boss_burst") {
      const radius = effect.type === "boss_burst" ? 92 : 40;
      const color = effect.type === "boss_burst" ? COLORS.cyan : effect.type === "enemy_burst" ? COLORS.ivory : COLORS.crimson;
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = color;
      ctx.globalAlpha = alpha * 0.32;
      ctx.beginPath();
      ctx.arc(0, 0, radius * (1.1 - alpha * 0.4), 0, Math.PI * 2);
      ctx.fill();
    } else if (effect.type === "wing_burst" || effect.type === "halo_burst" || effect.type === "seraph_halo") {
      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = effect.type === "wing_burst" ? COLORS.cyan : COLORS.ivory;
      ctx.lineWidth = effect.type === "seraph_halo" ? 7 : 5;
      ctx.globalAlpha = alpha * 0.85;
      ctx.beginPath();
      ctx.arc(0, 0, 46 + (1 - alpha) * 120, 0, Math.PI * 2);
      ctx.stroke();
    } else if (effect.type === "choir_cast" || effect.type === "windup_glow" || effect.type === "attack_tell") {
      ctx.globalCompositeOperation = "lighter";
      const color = effect.color || COLORS.cyan;
      if (effect.type === "attack_tell") {
        ctx.globalAlpha = alpha * 0.85;
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 3;
        switch (effect.tellShape) {
          case "shield":
            ctx.strokeRect(-18, -24, 36, 48);
            ctx.beginPath();
            ctx.moveTo(12, -18);
            ctx.lineTo(86, -18);
            ctx.lineTo(86, 18);
            ctx.lineTo(12, 18);
            ctx.stroke();
            break;
          case "thrust":
            ctx.beginPath();
            ctx.moveTo(0, -10);
            ctx.lineTo(180, -4);
            ctx.lineTo(180, 4);
            ctx.lineTo(0, 10);
            ctx.closePath();
            ctx.stroke();
            break;
          case "glyph":
            ctx.beginPath();
            ctx.arc(0, 0, 20, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, -32);
            ctx.lineTo(0, 32);
            ctx.moveTo(26, -14);
            ctx.lineTo(78, -14);
            ctx.moveTo(26, 14);
            ctx.lineTo(92, 14);
            ctx.stroke();
            break;
          case "arc":
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(74, -92, 148, 18);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(148, 18, 14, 0, Math.PI * 2);
            ctx.stroke();
            break;
          case "lash":
            ctx.beginPath();
            ctx.moveTo(0, -8);
            ctx.lineTo(126, -8);
            ctx.lineTo(150, 12);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(152, 14, 10, -1.6, 2.6);
            ctx.stroke();
            break;
          case "pounce":
            ctx.beginPath();
            ctx.arc(88, 22, 36 + (1 - alpha) * 12, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(42, -36, 84, 4);
            ctx.stroke();
            break;
          case "charge":
            ctx.beginPath();
            ctx.moveTo(0, -24);
            ctx.lineTo(152, 0);
            ctx.lineTo(0, 24);
            ctx.closePath();
            ctx.stroke();
            break;
          case "burst":
            ctx.beginPath();
            ctx.arc(0, 0, 26 + (1 - alpha) * 20, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(0, 0, 64 + (1 - alpha) * 24, 0, Math.PI * 2);
            ctx.stroke();
            break;
          case "cross":
            ctx.beginPath();
            ctx.moveTo(0, -42);
            ctx.lineTo(92, 34);
            ctx.moveTo(0, 42);
            ctx.lineTo(92, -34);
            ctx.stroke();
            break;
          default:
            ctx.beginPath();
            ctx.arc(0, 0, 22 + (1 - alpha) * 18, 0, Math.PI * 2);
            ctx.stroke();
            break;
        }
        if (effect.parryable === false) {
          ctx.globalAlpha = alpha * 0.2;
          ctx.fillRect(-18, -18, 36, 36);
        }
      } else {
        ctx.fillStyle = color;
        ctx.globalAlpha = alpha * 0.26;
        ctx.beginPath();
        ctx.arc(0, 0, effect.type === "windup_glow" ? 30 : 22 + (1 - alpha) * 18, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (effect.type === "cross_cut" || effect.type === "rush_arc" || effect.type === "seraph_slash") {
      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = effect.type === "cross_cut" ? COLORS.cyan : COLORS.ivory;
      ctx.lineWidth = effect.type === "rush_arc" ? 12 : 8;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.moveTo(-24, -40);
      ctx.lineTo(74, 20);
      ctx.stroke();
      if (effect.type === "cross_cut") {
        ctx.beginPath();
        ctx.moveTo(-18, 20);
        ctx.lineTo(64, -26);
        ctx.stroke();
      }
    }
    ctx.restore();
  }
}

function drawInteractables() {
  const nearest = nearestInteraction();
  for (const interactable of game.interactables) {
    const isNearest = interactable === nearest;
    ctx.save();
    ctx.translate(interactable.x, interactable.y);
    ctx.strokeStyle = isNearest ? COLORS.cyan : "rgba(227,219,199,0.55)";
    ctx.lineWidth = isNearest ? 4 : 2;
    ctx.beginPath();
    ctx.moveTo(0, -16);
    ctx.lineTo(16, 0);
    ctx.lineTo(0, 16);
    ctx.lineTo(-16, 0);
    ctx.closePath();
    ctx.stroke();

    ctx.fillStyle = isNearest ? COLORS.ink : COLORS.muted;
    ctx.font = "16px Georgia";
    ctx.textAlign = "center";
    ctx.fillText(interactable.label, 0, -26);
    ctx.restore();
  }
}

function drawHud() {
  ctx.save();
  ctx.fillStyle = "rgba(17,15,20,0.82)";
  ctx.fillRect(18, 18, 470, 112);
  ctx.strokeStyle = "rgba(168,140,87,0.35)";
  ctx.strokeRect(18, 18, 470, 112);

  const hpRatio = clamp(game.run.health / game.run.maxHealth, 0, 1);
  const gloomRatio = clamp(game.run.gloom / 100, 0, 1);

  ctx.fillStyle = COLORS.muted;
  ctx.font = "18px Georgia";
  ctx.fillText("Health", 36, 52);
  ctx.fillText("Gloom", 36, 90);

  ctx.fillStyle = "#2f2230";
  ctx.fillRect(116, 34, 340, 16);
  ctx.fillRect(116, 72, 340, 16);

  ctx.fillStyle = COLORS.crimson;
  ctx.fillRect(116, 34, 340 * hpRatio, 16);
  ctx.fillStyle = COLORS.cyan;
  ctx.fillRect(116, 72, 340 * gloomRatio, 16);

  if (game.enemies.some((enemy) => enemy.isBoss)) {
    const boss = game.enemies.find((enemy) => enemy.isBoss);
    const ratio = clamp(boss.health / boss.maxHealth, 0, 1);
    ctx.fillStyle = "rgba(17,15,20,0.86)";
    ctx.fillRect(560, 24, 480, 64);
    ctx.strokeStyle = "rgba(122,215,224,0.32)";
    ctx.strokeRect(560, 24, 480, 64);
    ctx.fillStyle = COLORS.ink;
    ctx.font = "28px Georgia";
    ctx.fillText(boss.name, 584, 52);
    ctx.fillStyle = "#2f2230";
    ctx.fillRect(584, 62, 420, 12);
    ctx.fillStyle = boss.id === "seraph_vale" ? COLORS.cyan : COLORS.gold;
    ctx.fillRect(584, 62, 420 * ratio, 12);
  }
  ctx.restore();
}

function drawVictoryOverlay() {
  ctx.save();
  ctx.fillStyle = "rgba(10, 9, 12, 0.72)";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = COLORS.ink;
  ctx.font = "56px Georgia";
  ctx.textAlign = "center";
  ctx.fillText("Seraph Vale Falls", WIDTH / 2, HEIGHT / 2 - 40);
  ctx.font = "24px Georgia";
  ctx.fillStyle = COLORS.muted;
  ctx.fillText("The cycle breaks, but only for now.", WIDTH / 2, HEIGHT / 2 + 10);
  ctx.fillText("Press N to begin another run.", WIDTH / 2, HEIGHT / 2 + 52);
  ctx.restore();
}

let lastTime = performance.now();

function frame(now) {
  const dt = Math.min(0.033, (now - lastTime) / 1000);
  lastTime = now;
  update(dt);
  draw();
  requestAnimationFrame(frame);
}

loadRoom(game.run.currentRoom || "hub_sanctuary", game.run.playerSpawnTag || "start");
pushMessage("Awaken, fallen hero. Break the second dawn.");
requestAnimationFrame(frame);
