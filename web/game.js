const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const shellEl = document.querySelector(".shell");
const roomNameEl = document.getElementById("roomName");
const messageEl = document.getElementById("messageText");
const statsEl = document.getElementById("stats");
const languageSelectEl = document.getElementById("languageSelect");
const titleOverlayEl = document.getElementById("titleOverlay");
const titleMenuEl = document.getElementById("titleMenu");
const titleHeroImageEl = document.getElementById("titleHeroImage");
const titleLogoImageEl = document.getElementById("titleLogoImage");
const titleTaglineEl = document.getElementById("titleTagline");
const titleLoglineEl = document.getElementById("titleLogline");
const titlePanelEyebrowEl = document.getElementById("titlePanelEyebrow");
const titlePanelTitleEl = document.getElementById("titlePanelTitle");
const titlePanelBodyEl = document.getElementById("titlePanelBody");
const titlePanelListEl = document.getElementById("titlePanelList");
const titleSecondaryEyebrowEl = document.getElementById("titleSecondaryEyebrow");
const titleSecondaryTitleEl = document.getElementById("titleSecondaryTitle");
const titleSecondaryListEl = document.getElementById("titleSecondaryList");
const titleControlsHintEl = document.getElementById("titleControlsHint");
const titleActionButtons = Array.from(document.querySelectorAll("[data-title-action]"));

const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const FLOOR_Y = 760;
const GRAVITY = 2200;
const JUMP_VELOCITY = 1120;
const DOUBLE_JUMP_VELOCITY = 1040;
const DEATH_COLLAPSE_TIME = 0.46;
const DEATH_RESPAWN_DELAY = 1.32;
const STORAGE_KEY = "black_halo_web_save_v1";
const LANGUAGE_KEY = "black_halo_web_lang_v1";
const ROOM_SIZE = { width: WIDTH, height: HEIGHT };
const TITLE_ACTION_ORDER = ["continue", "new_run", "chronicle", "armory", "reset_game"];

const PLAYER_BASE_STATS = {
  maxHealth: 60,
  speed: 300,
  skillCost: 34
};

const UPGRADE_PATHS = {
  vigor: [
    { cost: 4, healthBonus: 12 },
    { cost: 7, healthBonus: 14 },
    { cost: 11, healthBonus: 18 }
  ],
  might: [
    { cost: 4, damageBonus: 0.14 },
    { cost: 7, damageBonus: 0.16 },
    { cost: 11, damageBonus: 0.18 }
  ],
  focus: [
    { cost: 5, gloomBonus: 0.18, skillCostReduction: 4 },
    { cost: 9, gloomBonus: 0.24, skillCostReduction: 6 }
  ]
};

const MOBILITY_UPGRADES = [
  { abilityId: "chain_grapple", cost: 8 },
  { abilityId: "black_wing", cost: 14, requires: "chain_grapple" }
];

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
    baseDamage: 11,
    heavyDamage: 21,
    reach: 132,
    stagger: 0.34,
    gloomGain: 7,
    skill: "Halo Breaker",
    bladeLength: 192,
    bladeWidth: 24,
    gripOffset: { x: 28, y: -84 },
    profiles: {
      light: {
        startup: 0.1,
        duration: 0.24,
        activeStart: 0.14,
        activeEnd: 0.74,
        startAngle: -2.15,
        endAngle: 0.45,
        trailColor: "#efe7d4",
        glowColor: "rgba(227,219,199,0.42)"
      },
      heavy: {
        startup: 0.18,
        duration: 0.38,
        activeStart: 0.18,
        activeEnd: 0.86,
        startAngle: -2.4,
        endAngle: 0.92,
        trailColor: "#d8b46a",
        glowColor: "rgba(168,140,87,0.44)"
      },
      skill: {
        startup: 0.16,
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
    baseDamage: 9,
    heavyDamage: 17,
    reach: 156,
    stagger: 0.28,
    gloomGain: 8,
    skill: "Grief Spiral",
    bladeLength: 176,
    bladeWidth: 18,
    gripOffset: { x: 30, y: -82 },
    profiles: {
      light: {
        startup: 0.08,
        duration: 0.2,
        activeStart: 0.1,
        activeEnd: 0.78,
        startAngle: -1.9,
        endAngle: 0.62,
        trailColor: "#efe7d4",
        glowColor: "rgba(227,219,199,0.34)"
      },
      heavy: {
        startup: 0.15,
        duration: 0.34,
        activeStart: 0.12,
        activeEnd: 0.88,
        startAngle: -2.3,
        endAngle: 1.16,
        trailColor: "#d8b46a",
        glowColor: "rgba(168,140,87,0.42)"
      },
      skill: {
        startup: 0.14,
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
    reach: 132,
    attackWindup: 0.38
  },
  lancer: {
    id: "lancer",
    name: "Lancer",
    drawKind: "lancer",
    maxHealth: 46,
    speed: 124,
    damage: 11,
    reach: 184,
    attackWindup: 0.28
  },
  choir_adept: {
    id: "choir_adept",
    name: "Choir Adept",
    drawKind: "choir_adept",
    maxHealth: 36,
    speed: 72,
    damage: 9,
    reach: 224,
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
    reach: 162,
    attackWindup: 0.3
  },
  blessed_hound: {
    id: "blessed_hound",
    name: "Blessed Hound",
    drawKind: "hound",
    maxHealth: 40,
    speed: 176,
    damage: 8,
    reach: 148,
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
    reach: 196,
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
    reach: 212,
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
    name: "Wake Ward",
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
      left: { target: "hub_sanctuary", label: "Return to the Ward", spawnTag: "right" },
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
  hub_intro: {
    en: "Brother Niv: The kingdom named you blasphemy. The walls remember another title.",
    ko: "니브 형제: 왕국은 널 신성모독이라 불렀지. 하지만 이 벽은 네게 다른 이름을 기억하고 있네."
  },
  mara_forge: {
    en: "Mara Bellwright: Pick your edge carefully. The bastion forgives nothing.",
    ko: "마라 벨라이트: 칼끝은 신중히 골라. 이 성채는 어떤 실수도 용서하지 않아."
  },
  joren_oath: {
    en: "Sir Joren: Every oath is a chain. Choose the one you can bear.",
    ko: "조렌 경: 모든 서약은 사슬이다. 끝까지 감당할 수 있는 것을 골라라."
  },
  aurex_intro: {
    en: "Sir Aurex: Mercy belongs to the obedient. Kneel, and I may make your death brief.",
    ko: "오렉스 경: 자비는 순종하는 자의 것이다. 무릎 꿇어라. 그러면 네 목숨만은 단번에 끊어주마."
  },
  aurex_shift: {
    en: "Sir Aurex: Then I will break mercy itself.",
    ko: "오렉스 경: 그렇다면 자비 자체를 부숴주지."
  },
  aurex_defeat: {
    en: "Cael Ashborne: Your mercy was another blade. I carry the chain onward.",
    ko: "케일 애시본: 네 자비도 결국 또 다른 칼날이었군. 이제 그 사슬은 내가 끌고 간다."
  },
  black_wing_unlock: {
    en: "Memory of Cael: Even the fallen remember how to rise.",
    ko: "케일의 기억: 추락한 것조차 다시 떠오르는 법을 기억한다."
  },
  seraph_intro: {
    en: "Seraph Vale: They made me in your image. I chose to surpass it.",
    ko: "세라프 베일: 그들은 나를 네 형상으로 빚었지. 하지만 나는 그 형상마저 넘어서는 길을 택했다."
  },
  seraph_shift_1: {
    en: "Seraph Vale: You taught the kingdom how to fear. I taught it how to endure.",
    ko: "세라프 베일: 넌 왕국에 공포를 가르쳤다. 나는 견디는 법을 가르쳤지."
  },
  seraph_shift_2: {
    en: "Seraph Vale: Then come, predecessor. Let the second dawn bury the first.",
    ko: "세라프 베일: 그렇다면 와라, 선대여. 두 번째 새벽으로 첫 번째를 묻어주마."
  },
  seraph_defeat: {
    en: "Seraph Vale: If I fall... do not let them make a third.",
    ko: "세라프 베일: 내가 쓰러지더라도... 그들이 세 번째를 만들게 두진 마라."
  }
};

const UI_TEXT = {
  en: {
    page_title: "Black Halo",
    heading: "Black Halo",
    language_label: "Language",
    card_status: "Status",
    card_controls: "Controls",
    card_goal: "Goal",
    ctrl_move_label: "Move",
    ctrl_move_value: "Left / Right Arrow",
    ctrl_jump_label: "Jump",
    ctrl_jump_value: "Space / Up Arrow",
    ctrl_light_label: "Light Attack",
    ctrl_light_value: "Z",
    ctrl_heavy_label: "Heavy Attack",
    ctrl_heavy_value: "X",
    ctrl_dash_label: "Dash / Evade",
    ctrl_dash_value: "C",
    ctrl_parry_label: "Parry",
    ctrl_parry_value: "V",
    ctrl_skill_label: "Skill / Grapple",
    ctrl_skill_value: "A",
    ctrl_interact_label: "Interact",
    ctrl_interact_value: "Down Arrow / Enter",
    ctrl_new_run_label: "New Run",
    ctrl_new_run_value: "N",
    goal_body: "Break through the Ashfall Bastion, defeat Sir Aurex, claim Chain Grapple, ascend the Reliquary, awaken Black Wing, and confront Seraph Vale.",
    canvas_label: "Black Halo game canvas",
    title_menu_aria: "Title Menu",
    title_status_room: "Wake Ward",
    title_status_message: "The Black Halo is no halo at all. It is a sacred machine built to remember how to make another hero.",
    title_hero_alt: "Cael Ashborne standing beneath the broken Black Halo while Seraph Vale watches from the reflected sanctum.",
    title_logo_alt: "Black Halo title mark",
    title_tagline: "Metroidvania Roguelike of Broken Oaths, Relics, and Manufactured Saints",
    title_logline: "Awaken as Cael Ashborne, the fallen original frame, cross Ashfall, Reliquary, and Mirror, and shatter the succession engine that forged Seraph Vale in your image.",
    title_action_continue: "Continue",
    title_action_new_run: "New Run",
    title_action_chronicle: "Chronicle",
    title_action_armory: "Armory",
    title_action_reset_game: "Reset Game",
    title_reset_confirm: "Reset Game",
    title_reset_prompt: "Erase all saved progress and begin from a clean state? Language settings will stay.",
    title_controls_hint: "Arrow Up / Down to choose, Enter or Z to confirm, Left / Right to swap panels.",
    title_chronicle_eyebrow: "Original Frame",
    title_chronicle_title: "Cael Ashborne and the Second Dawn",
    title_chronicle_body: "The Black Halo is not a saint's crown. It is a succession engine that catalogued a hero, broke him into memory and combat data, and built Seraph Vale as a more obedient dawn.",
    title_chronicle_item_1_title: "Black Halo",
    title_chronicle_item_1_body: "A fractured halo-memory device that preserves war, guilt, and technique so the kingdom can manufacture another champion.",
    title_chronicle_item_2_title: "Wake Ward",
    title_chronicle_item_2_body: "Not a true refuge, but a recovery chamber disguised as mercy and resurrection.",
    title_chronicle_item_3_title: "Sir Aurex",
    title_chronicle_item_3_body: "Warden of mercy. He prolongs suffering to preserve order, then realizes mercy was another blade.",
    title_chronicle_item_4_title: "Seraph Vale",
    title_chronicle_item_4_body: "The immaculate Second Dawn, refined from Cael's frame data to surpass and bury the first hero.",
    title_dominion_eyebrow: "Three Dominions",
    title_dominion_title: "Ashfall, Reliquary, Mirror",
    title_dominion_item_1_title: "Ashfall",
    title_dominion_item_1_body: "War ruin, ash storms, torn banners, and the outer bastion where the kingdom learned to sanctify execution.",
    title_dominion_item_2_title: "Reliquary",
    title_dominion_item_2_body: "Lifts, chains, archives, and official mercy: the institution that stored heroes like weapons.",
    title_dominion_item_3_title: "Mirror",
    title_dominion_item_3_body: "Glass choirs and reflective sanctums where identities are corrected, copied, and replaced.",
    title_dominion_item_4_title: "Second Dawn",
    title_dominion_item_4_body: "The kingdom's answer to failure was never mourning. It was building a better successor.",
    title_armory_eyebrow: "War Ecologies",
    title_armory_title: "Weapons, Oaths, Relics, Growth",
    title_armory_body: "Black Halo's equipment ecology runs on four layers: weapons define cadence, relics tune doctrine, oaths lock long-form philosophy, and reinforcement currencies from routes, vaults, and bosses harden Cael between descents.",
    title_armory_item_1_title: "{weapon} / {skill}",
    title_armory_item_1_body: "Deliberate execution steel. Slow, punishing arcs built to crush anchors, judges, and bosses.",
    title_armory_item_2_title: "{weapon} / {skill}",
    title_armory_item_2_body: "Pursuit weaponry. Chain reach, crowd pressure, and air control for hunting backline zealots and breakaway prey.",
    title_armory_item_3_title: "{oath1} / {oath2} / {oath3}",
    title_armory_item_3_body: "Choose a creed, not a class: execution for damage, pursuit for tempo, silence for composure and parry stability.",
    title_armory_item_4_title: "Reinforcement Economy",
    title_armory_item_4_body: "Imprint caches, side-room spoils, Aurex-level gates, and boss victories all feed permanent upgrades instead of disposable loot inflation.",
    title_growth_eyebrow: "Run Shapers",
    title_growth_title: "Relics, Mobility, and Future Frames",
    title_growth_item_1_title: "{ability1} / {ability2}",
    title_growth_item_1_body: "Mobility is story: seize the chain that bound the institution, then claim the wing that lets the discarded rise again.",
    title_growth_item_2_title: "{relic1} / {relic2} / {relic3}",
    title_growth_item_2_body: "Ember Bead, Oath Nail, and Veil Ribbon show how relics bend aggression, stagger, parry windows, and route planning.",
    title_growth_item_3_title: "{relic4} / {weapon3} / {weapon4}",
    title_growth_item_3_body: "Choir Censer pushes skills, while the documented Glass Rapier and Penitence Maul prove the wider armory reaches past two starting weapons.",
    title_growth_item_4_title: "{boss1} / {boss2}",
    title_growth_item_4_body: "Aurex is mercy turned into violence. Seraph is the perfected successor waiting at the end of the machine.",
    hint_default: "Press Down Arrow or Enter near sigils, shrines, and doors.",
    stat_health: "Health",
    stat_gloom: "Gloom",
    stat_ash: "Imprint",
    stat_weapon: "Weapon",
    stat_oath: "Oath",
    stat_abilities: "Abilities",
    stat_growth: "Growth",
    stat_relic: "Relic",
    stat_none: "None",
    stat_none_yet: "None yet",
    growth_summary: "V{vigor} / M{might} / F{focus}",
    upgrade_vigor_name: "Vigor",
    upgrade_might_name: "Might",
    upgrade_focus_name: "Focus",
    upgrade_mobility_name: "Mobility",
    label_vigor_next: "Vigor +{amount} ({cost} Imprints)",
    label_might_next: "Might {rank} ({cost} Imprints)",
    label_focus_next: "Focus {rank} ({cost} Imprints)",
    label_mobility_next: "{ability} ({cost} Imprints)",
    label_upgrade_maxed: "{name} Max",
    overlay_title: "Seraph Vale Falls",
    overlay_body: "The cycle breaks, but only for now.",
    overlay_restart: "Press N to begin another run.",
    msg_run_start: "The ward drags Cael back from ruin. Imprints and etched growth remain.",
    msg_skill_fire: "{skill} tears through the sanctified air.",
    msg_not_enough_gloom: "Not enough Gloom for a skill attack.",
    msg_chain_grapple_ignite: "Chain Grapple ignites.",
    msg_chain_grapple_unlock: "Chain Grapple unlocked.",
    msg_room_cleared: "Room cleared.",
    msg_player_death: "Cael falls. The ward calls him back.",
    msg_locked_by: "Locked by {ability}.",
    msg_archive: "{dialogue} Memory shards: {count}.",
    msg_defeat_defenders: "Defeat the room's defenders before claiming its reward.",
    msg_recovered_ash: "Recovered {amount} Imprints.",
    msg_memory_shard: "A memory shard crawls back into focus.",
    msg_relic_claimed: "Relic claimed: {relic}.",
    msg_need_ash: "Need {cost} Imprints.",
    msg_upgrade_maxed: "{name} cannot grow further.",
    msg_upgrade_vigor: "Vigor rises. Max health reaches {value}.",
    msg_upgrade_might: "Might rises. Weapon damage grows by {percent}%.",
    msg_upgrade_focus: "Focus deepens. Skill cost falls to {value} Gloom.",
    msg_upgrade_mobility: "{ability} is etched into Cael's body.",
    msg_continue_run: "The archive opens where the last run left off.",
    msg_awaken: "Awaken, fallen hero. Break the second dawn."
  },
  ko: {
    page_title: "블랙 헤일로",
    heading: "블랙 헤일로",
    language_label: "언어",
    card_status: "상태",
    card_controls: "조작",
    card_goal: "목표",
    ctrl_move_label: "이동",
    ctrl_move_value: "좌 / 우 방향키",
    ctrl_jump_label: "점프",
    ctrl_jump_value: "스페이스 / 위 방향키",
    ctrl_light_label: "약공격",
    ctrl_light_value: "Z",
    ctrl_heavy_label: "강공격",
    ctrl_heavy_value: "X",
    ctrl_dash_label: "회피 / 대시",
    ctrl_dash_value: "C",
    ctrl_parry_label: "패링",
    ctrl_parry_value: "V",
    ctrl_skill_label: "스킬 / 그래플",
    ctrl_skill_value: "A",
    ctrl_interact_label: "상호작용",
    ctrl_interact_value: "아래 방향키 / Enter",
    ctrl_new_run_label: "새 런",
    ctrl_new_run_value: "N",
    goal_body: "애시폴 성채를 돌파하고, 오렉스 경을 쓰러뜨려 체인 그래플을 얻은 뒤, 성유물 승강로를 올라 블랙 윙을 깨우고 세라프 베일과 결전하라.",
    canvas_label: "블랙 헤일로 게임 캔버스",
    title_menu_aria: "타이틀 메뉴",
    title_status_room: "각성실",
    title_status_message: "블랙 헤일로는 후광이 아니다. 또 다른 영웅을 만들어 내기 위해 기억을 보존하는 신성한 전쟁 기계다.",
    title_hero_alt: "부서진 블랙 헤일로 아래 선 케일 애시본과, 거울 성소 너머에서 그를 지켜보는 세라프 베일",
    title_logo_alt: "블랙 헤일로 타이틀 로고",
    title_tagline: "부서진 서약과 금지된 유물, 인공 성자가 얽힌 메트로베니아 로그라이크",
    title_logline: "몰락한 원형 개체 케일 애시본으로 되살아나 애시폴과 성유물 성역, 거울 성역을 돌파하고, 네 형상을 바탕으로 세라프 베일을 빚어 낸 계승 장치를 파괴하라.",
    title_action_continue: "이어하기",
    title_action_new_run: "새 런",
    title_action_chronicle: "연대기",
    title_action_armory: "무기고",
    title_action_reset_game: "게임 초기화",
    title_reset_confirm: "게임 초기화",
    title_reset_prompt: "저장된 진행 상황을 모두 지우고 완전히 처음부터 시작할까요? 언어 설정은 유지됩니다.",
    title_controls_hint: "위 / 아래 방향키로 선택하고 Enter 또는 Z로 확정하세요. 좌 / 우 방향키로 패널을 넘길 수 있습니다.",
    title_chronicle_eyebrow: "원형 개체",
    title_chronicle_title: "케일 애시본과 두 번째 새벽",
    title_chronicle_body: "블랙 헤일로는 성인의 왕관이 아니다. 한 영웅을 기억과 전투 감각의 데이터로 분해해 기록하고, 그보다 더 순종적인 후계자 세라프 베일을 빚어 내는 계승 장치다.",
    title_chronicle_item_1_title: "블랙 헤일로",
    title_chronicle_item_1_body: "전쟁과 죄책감, 기술을 보존해 왕국이 또 다른 구원자를 만들어 낼 수 있게 하는 파편화된 후광 기억 장치.",
    title_chronicle_item_2_title: "각성실",
    title_chronicle_item_2_body: "진정한 안식처가 아니라 자비와 부활의 이름으로 꾸민 회수실이다.",
    title_chronicle_item_3_title: "오렉스 경",
    title_chronicle_item_3_body: "자비의 수호자. 질서를 지키기 위해 고통을 길게 끌며, 끝내 자비 또한 또 하나의 칼날이었음을 깨닫는다.",
    title_chronicle_item_4_title: "세라프 베일",
    title_chronicle_item_4_body: "케일의 전투 감각을 정제해 첫 번째 영웅을 넘어설 목적으로 빚어낸 완벽한 두 번째 새벽.",
    title_dominion_eyebrow: "세 구역",
    title_dominion_title: "애시폴, 성유물 성역, 거울 성역",
    title_dominion_item_1_title: "애시폴",
    title_dominion_item_1_body: "재 폭풍과 찢긴 깃발, 처형의 논리를 성스럽게 만든 외곽 성채의 전쟁 폐허.",
    title_dominion_item_2_title: "성유물 성역",
    title_dominion_item_2_body: "승강로와 사슬, 기록고와 공식적인 자비가 영웅을 무기처럼 보관하던 제도의 심장부.",
    title_dominion_item_3_title: "거울 성역",
    title_dominion_item_3_body: "정체성을 교정하고 복제하고 대체하는 유리의 합창당과 반사 성소.",
    title_dominion_item_4_title: "두 번째 새벽",
    title_dominion_item_4_body: "왕국은 실패를 애도하지 않았다. 더 나은 후계자를 만들어 대체했을 뿐이다.",
    title_armory_eyebrow: "전쟁 생태계",
    title_armory_title: "무기, 서약, 유물, 성장",
    title_armory_body: "블랙 헤일로의 장비 체계는 네 축으로 이루어진다. 무기가 전투 리듬을 만들고, 유물이 운용의 성향을 기울이며, 서약이 장기적인 철학을 정하고, 루트와 금고, 보스에서 회수한 강화 재화가 케일의 몸을 단련한다.",
    title_armory_item_1_title: "{weapon} / {skill}",
    title_armory_item_1_body: "느리고 무거운 처형의 강철. 앵커형 적과 심판자, 보스를 부수기 위한 명확한 일격.",
    title_armory_item_2_title: "{weapon} / {skill}",
    title_armory_item_2_body: "추격을 위한 무기. 사슬 리치와 군중 압박, 공중 제어로 후열과 도주 대상을 사냥한다.",
    title_armory_item_3_title: "{oath1} / {oath2} / {oath3}",
    title_armory_item_3_body: "직업이 아니라 교리를 고른다. 처형은 화력, 추적은 템포, 침묵은 침착함과 패링 운용을 안정시키는 데 초점을 둔다.",
    title_armory_item_4_title: "강화 재화의 사다리",
    title_armory_item_4_body: "각인 보관함, 사이드룸 전리품, 오렉스급 관문 보상, 보스 격파가 모두 일회성 전리품이 아니라 영구 성장의 자원이 된다.",
    title_growth_eyebrow: "런을 바꾸는 축",
    title_growth_title: "유물, 기동, 다음 프레임",
    title_growth_item_1_title: "{ability1} / {ability2}",
    title_growth_item_1_body: "기동은 곧 서사다. 제도를 묶던 사슬을 붙잡고, 버려진 원형을 다시 떠오르게 하는 날개를 손에 넣어라.",
    title_growth_item_2_title: "{relic1} / {relic2} / {relic3}",
    title_growth_item_2_body: "불씨 구슬, 서약 못, 장막 리본은 공격성, 경직, 패링 타이밍, 루트 선택을 어떻게 뒤트는지 보여 준다.",
    title_growth_item_3_title: "{relic4} / {weapon3} / {weapon4}",
    title_growth_item_3_body: "합창단 향로는 스킬 축을 밀어 올리고, 문서에 기록된 유리 세검과 참회 철퇴는 무기고가 두 시작 무기보다 훨씬 넓다는 사실을 보여 준다.",
    title_growth_item_4_title: "{boss1} / {boss2}",
    title_growth_item_4_body: "오렉스는 폭력으로 뒤틀린 자비이고, 세라프는 기계 끝에서 기다리는 완성된 후계자다.",
    hint_default: "문양, 제단, 출입문 앞에서 아래 방향키나 Enter를 누르세요.",
    stat_health: "체력",
    stat_gloom: "글룸",
    stat_ash: "각인",
    stat_weapon: "무기",
    stat_oath: "서약",
    stat_abilities: "능력",
    stat_growth: "성장",
    stat_relic: "유물",
    stat_none: "없음",
    stat_none_yet: "아직 없음",
    growth_summary: "강인함 {vigor} / 위력 {might} / 집중 {focus}",
    upgrade_vigor_name: "강인함",
    upgrade_might_name: "위력",
    upgrade_focus_name: "집중",
    upgrade_mobility_name: "기동",
    label_vigor_next: "강인함 +{amount} ({cost} 각인)",
    label_might_next: "위력 {rank}단계 ({cost} 각인)",
    label_focus_next: "집중 {rank}단계 ({cost} 각인)",
    label_mobility_next: "{ability} ({cost} 각인)",
    label_upgrade_maxed: "{name} 강화 완료",
    overlay_title: "세라프 베일 격파",
    overlay_body: "순환은 끊어졌지만, 아직 완전히 끝난 것은 아니다.",
    overlay_restart: "다음 런을 시작하려면 N을 누르세요.",
    msg_run_start: "각성실이 케일을 파멸의 끝에서 다시 끌어올린다. 각인과 새겨진 성장은 남는다.",
    msg_skill_fire: "{skill}가 성스러운 공기를 찢어발긴다.",
    msg_not_enough_gloom: "스킬 공격에 필요한 글룸이 부족하다.",
    msg_chain_grapple_ignite: "체인 그래플이 타오른다.",
    msg_chain_grapple_unlock: "체인 그래플이 개방되었다.",
    msg_room_cleared: "구역을 제압했다.",
    msg_player_death: "케일이 쓰러졌다. 각성실이 그를 다시 불러낸다.",
    msg_locked_by: "{ability}가 있어야 열린다.",
    msg_archive: "{dialogue} 기억 조각: {count}개.",
    msg_defeat_defenders: "보상을 손에 넣으려면 먼저 이 구역의 수호자들을 쓰러뜨려야 한다.",
    msg_recovered_ash: "각인 {amount}을 회수했다.",
    msg_memory_shard: "잊힌 기억 조각이 되살아난다.",
    msg_relic_claimed: "유물 획득: {relic}.",
    msg_need_ash: "{cost} 각인이 필요하다.",
    msg_upgrade_maxed: "{name}은 더 이상 강화할 수 없다.",
    msg_upgrade_vigor: "강인함이 높아진다. 최대 체력이 {value}가 된다.",
    msg_upgrade_might: "위력이 높아진다. 무기 공격력이 {percent}% 상승한다.",
    msg_upgrade_focus: "집중이 깊어진다. 스킬 소모가 글룸 {value}로 줄어든다.",
    msg_upgrade_mobility: "{ability}가 케일의 육신에 새겨진다.",
    msg_continue_run: "기록고가 지난 런이 멈춘 자리에서 다시 열린다.",
    msg_awaken: "깨어나라, 타락한 용사여. 두 번째 새벽을 부숴라."
  }
};

const LOCALIZED_NAMES = {
  ko: {
    weapons: {
      fallen_greatblade: "타락한 대검",
      chain_glaive: "사슬 글레이브",
      glass_rapier: "유리 세검",
      penitence_maul: "참회 철퇴"
    },
    weaponSkills: {
      fallen_greatblade: "후광 파쇄",
      chain_glaive: "비탄의 나선"
    },
    oaths: {
      execution: "처형",
      pursuit: "추적",
      silence: "침묵"
    },
    relics: {
      ember_bead: "불씨 구슬",
      oath_nail: "서약 못",
      veil_ribbon: "장막 리본",
      crypt_salt: "지하묘지 소금",
      choir_censer: "합창단 향로"
    },
    abilities: {
      chain_grapple: "체인 그래플",
      black_wing: "블랙 윙"
    },
    enemies: {
      shield_paladin: "방패 성기사",
      lancer: "창기병",
      choir_adept: "성가 수행사제",
      inquisitor: "심문관",
      blessed_hound: "축복받은 사냥개"
    },
    bosses: {
      sir_aurex: "오렉스 경",
      seraph_vale: "세라프 베일"
    },
    rooms: {
      hub_sanctuary: "각성실",
      ashfall_gate: "애시폴 관문",
      ashfall_rampart: "찢긴 성벽길",
      ashfall_crypt: "지하묘지 초입",
      reliquary_lift: "성유물 승강로",
      aurex_arena: "자비의 전당",
      reliquary_archive: "성유물 기록고",
      mirror_bridge: "거울 다리",
      mirror_choir: "유리의 합창당",
      seraph_sanctum: "두 번째 새벽의 성소",
      fallen_armory: "몰락한 병기고",
      banner_ossuary: "깃발 납골당",
      prayer_cistern: "기도의 저수조",
      thorns_vault: "가시 금고",
      sunken_cells: "가라앉은 감방",
      bell_tower: "종탑",
      scriptorium: "잊힌 필사실",
      sealed_roof: "봉인된 옥상"
    }
  }
};

const LOCALIZED_LABELS = {
  ko: {
    "March into the Bastion": "성채로 진군",
    "Return to the Ward": "각성실로 돌아가기",
    "Advance the Rampart": "성벽길로 전진",
    "Side Path: Fallen Armory": "샛길: 몰락한 병기고",
    "Back to the Gate": "관문으로 돌아가기",
    "Descend the Crypt": "지하묘지로 내려가기",
    "Side Path: Banner Ossuary": "샛길: 깃발 납골당",
    "Climb to the Rampart": "성벽길로 올라가기",
    "Enter the Shaft": "승강로로 진입",
    "Side Path: Prayer Cistern": "샛길: 기도의 저수조",
    "Return to the Crypt": "지하묘지로 돌아가기",
    "Face Sir Aurex": "오렉스 경에게 맞서기",
    "Side Path: Thorns Vault": "샛길: 가시 금고",
    "Retreat to the Lift": "승강로로 후퇴",
    "Advance to the Archive": "기록고로 전진",
    "Return to Aurex Hall": "오렉스 전당으로 돌아가기",
    "Cross the Mirror Bridge": "거울 다리 건너기",
    "Side Path: Bell Tower": "샛길: 종탑",
    "Side Path: Sunken Cells": "샛길: 가라앉은 감방",
    "Back to the Archive": "기록고로 돌아가기",
    "Enter the Choir": "합창당으로 진입",
    "Side Path: Lost Scriptorium": "샛길: 잊힌 필사실",
    "Return to the Bridge": "다리로 돌아가기",
    "Return to the Choir": "합창당으로 돌아가기",
    "Confront Seraph Vale": "세라프 베일과 결전",
    "Side Path: Sealed Roof": "샛길: 봉인된 옥상",
    "Back to the Rampart": "성벽길로 돌아가기",
    "Back to the Crypt": "지하묘지로 돌아가기",
    "Back to the Lift": "승강로로 돌아가기",
    "Back to the Bridge": "다리로 돌아가기",
    "Back to the Choir": "합창당으로 돌아가기",
    "Mara Bellwright: Cycle weapon": "마라 벨라이트: 무기 전환",
    "Brother Niv: Hear memory": "니브 형제: 기억 듣기",
    "Sir Joren: Cycle oath": "조렌 경: 서약 변경",
    "Claim Black Wing": "블랙 윙 획득",
    "Claim room reward": "보상 받기"
  }
};

const LOCALIZED_PROPER_NOUNS = {
  ko: [
    ["Sanctum of the Second Dawn", "두 번째 새벽의 성소"],
    ["Seraph Sanctum", "두 번째 새벽의 성소"],
    ["Black Halo Succession Protocol", "블랙 헤일로 계승 의정서"],
    ["Black Halo Inventory Fragment", "블랙 헤일로 분류표 단편"],
    ["Drowned Prayer Leaves", "가라앉은 기도문"],
    ["Brother Niv", "니브 형제"],
    ["Mara Bellwright", "마라 벨라이트"],
    ["Cael Ashborne", "케일 애시본"],
    ["Sir Joren", "조렌 경"],
    ["Sir Aurex", "오렉스 경"],
    ["Seraph Vale", "세라프 베일"],
    ["Wake Ward", "각성실"],
    ["Ashfall Bastion", "애시폴 성채"],
    ["Ashfall Crypt", "애시폴 지하묘지"],
    ["Ashfall Gate", "애시폴 관문"],
    ["Torn Rampart", "찢긴 성벽길"],
    ["Crypt Threshold", "지하묘지 초입"],
    ["Fallen Armory", "몰락한 병기고"],
    ["Banner Ossuary", "깃발 납골당"],
    ["Prayer Cistern", "기도의 저수조"],
    ["Reliquary Lift", "성유물 승강로"],
    ["Hall of Mercy", "자비의 전당"],
    ["Thorns Vault", "가시 금고"],
    ["Reliquary Archive", "성유물 기록고"],
    ["Bell Tower", "종탑"],
    ["Sunken Cells", "가라앉은 감방"],
    ["Mirror Bridge", "거울 다리"],
    ["Choir of Glass", "유리의 합창당"],
    ["Lost Scriptorium", "잊힌 필사실"],
    ["Sealed Roof", "봉인된 옥상"],
    ["Black Wing", "블랙 윙"],
    ["Chain Grapple", "체인 그래플"],
    ["Mercy Broken", "부서진 자비"],
    ["Second Dawn", "두 번째 새벽"],
    ["Black Halo", "블랙 헤일로"],
    ["Original Frame: C.A.", "원형 개체: C.A."],
    ["Ashfall", "애시폴"],
    ["Reliquary", "성유물 성역"],
    ["Mirror", "거울 성역"]
  ]
};

const DESIGN_WEAPON_NAMES = {
  glass_rapier: "Glass Rapier",
  penitence_maul: "Penitence Maul"
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

function hasUiControlFocus() {
  const active = document.activeElement;
  if (!active || active === document.body) {
    return false;
  }
  const tagName = active.tagName;
  return (
    active.isContentEditable ||
    tagName === "SELECT" ||
    tagName === "INPUT" ||
    tagName === "TEXTAREA" ||
    tagName === "BUTTON" ||
    tagName === "OPTION"
  );
}

window.addEventListener("keydown", (event) => {
  if (hasUiControlFocus()) {
    return;
  }
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

function loadLanguage() {
  try {
    const stored = localStorage.getItem(LANGUAGE_KEY);
    return stored === "ko" ? "ko" : "en";
  } catch {
    return "en";
  }
}

let currentLanguage = loadLanguage();

function interpolate(template, vars = {}) {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? ""));
}

function t(key, vars = {}) {
  const template = UI_TEXT[currentLanguage]?.[key] ?? UI_TEXT.en[key] ?? key;
  return localizeProperNouns(interpolate(template, vars));
}

function d(key, vars = {}) {
  const template = DIALOGUE[key]?.[currentLanguage] ?? DIALOGUE[key]?.en ?? key;
  return localizeProperNouns(interpolate(template, vars));
}

function localizeProperNouns(text) {
  if (typeof text !== "string") {
    return text;
  }
  const glossary = LOCALIZED_PROPER_NOUNS[currentLanguage];
  if (!glossary?.length) {
    return text;
  }
  let localized = text;
  glossary.forEach(([source, target]) => {
    localized = localized.replaceAll(source, target);
  });
  return localized;
}

function getLocalizedName(group, id, fallback) {
  return localizeProperNouns(LOCALIZED_NAMES[currentLanguage]?.[group]?.[id] ?? fallback);
}

function getWeaponName(id) {
  return getLocalizedName("weapons", id, WEAPONS[id]?.name || DESIGN_WEAPON_NAMES[id] || id);
}

function getWeaponSkillName(id) {
  return getLocalizedName("weaponSkills", id, WEAPONS[id]?.skill || id);
}

function getOathName(id) {
  return getLocalizedName("oaths", id, OATHS[id]?.name || id);
}

function getRelicName(id) {
  return getLocalizedName("relics", id, RELICS[id]?.name || id);
}

function getAbilityName(id) {
  return getLocalizedName("abilities", id, ABILITIES[id]?.name || id);
}

function getEnemyName(id) {
  return getLocalizedName("enemies", id, ENEMIES[id]?.name || id);
}

function getBossName(id) {
  return getLocalizedName("bosses", id, BOSSES[id]?.name || id);
}

function getRoomName(id) {
  return getLocalizedName("rooms", id, ROOMS[id]?.name || id);
}

function localizeLabel(text) {
  return localizeProperNouns(LOCALIZED_LABELS[currentLanguage]?.[text] ?? text);
}

function resolveMessageToken(token) {
  if (!token) {
    return t("hint_default");
  }
  if (typeof token === "string") {
    return token;
  }
  if (token.dialogue) {
    return d(token.dialogue, token.vars);
  }
  if (token.key) {
    return t(token.key, token.vars);
  }
  return "";
}

function getTitleAssetBase() {
  return window.location.pathname.includes("/web/") ? "../assets/title" : "./assets/title";
}

function getTitleLogoPath() {
  return `${getTitleAssetBase()}/${currentLanguage === "ko"
    ? "black-halo-title-logo-ko.svg"
    : "black-halo-title-logo-en.svg"}`;
}

function createTitleListItem(title, body) {
  return { title: localizeProperNouns(title), body: localizeProperNouns(body) };
}

function getTitlePanels() {
  return {
    chronicle: {
      eyebrow: t("title_chronicle_eyebrow"),
      title: t("title_chronicle_title"),
      body: t("title_chronicle_body"),
      items: [
        createTitleListItem(t("title_chronicle_item_1_title"), t("title_chronicle_item_1_body")),
        createTitleListItem(t("title_chronicle_item_2_title"), t("title_chronicle_item_2_body")),
        createTitleListItem(t("title_chronicle_item_3_title"), t("title_chronicle_item_3_body")),
        createTitleListItem(t("title_chronicle_item_4_title"), t("title_chronicle_item_4_body"))
      ],
      secondaryEyebrow: t("title_dominion_eyebrow"),
      secondaryTitle: t("title_dominion_title"),
      secondaryItems: [
        createTitleListItem(t("title_dominion_item_1_title"), t("title_dominion_item_1_body")),
        createTitleListItem(t("title_dominion_item_2_title"), t("title_dominion_item_2_body")),
        createTitleListItem(t("title_dominion_item_3_title"), t("title_dominion_item_3_body")),
        createTitleListItem(t("title_dominion_item_4_title"), t("title_dominion_item_4_body"))
      ]
    },
    armory: {
      eyebrow: t("title_armory_eyebrow"),
      title: t("title_armory_title"),
      body: t("title_armory_body"),
      items: [
        createTitleListItem(
          t("title_armory_item_1_title", {
            weapon: getWeaponName("fallen_greatblade"),
            skill: getWeaponSkillName("fallen_greatblade")
          }),
          t("title_armory_item_1_body")
        ),
        createTitleListItem(
          t("title_armory_item_2_title", {
            weapon: getWeaponName("chain_glaive"),
            skill: getWeaponSkillName("chain_glaive")
          }),
          t("title_armory_item_2_body")
        ),
        createTitleListItem(
          t("title_armory_item_3_title", {
            oath1: getOathName("execution"),
            oath2: getOathName("pursuit"),
            oath3: getOathName("silence")
          }),
          t("title_armory_item_3_body")
        ),
        createTitleListItem(t("title_armory_item_4_title"), t("title_armory_item_4_body"))
      ],
      secondaryEyebrow: t("title_growth_eyebrow"),
      secondaryTitle: t("title_growth_title"),
      secondaryItems: [
        createTitleListItem(
          t("title_growth_item_1_title", {
            ability1: getAbilityName("chain_grapple"),
            ability2: getAbilityName("black_wing")
          }),
          t("title_growth_item_1_body")
        ),
        createTitleListItem(
          t("title_growth_item_2_title", {
            relic1: getRelicName("ember_bead"),
            relic2: getRelicName("oath_nail"),
            relic3: getRelicName("veil_ribbon")
          }),
          t("title_growth_item_2_body")
        ),
        createTitleListItem(
          t("title_growth_item_3_title", {
            relic4: getRelicName("choir_censer"),
            weapon3: getWeaponName("glass_rapier"),
            weapon4: getWeaponName("penitence_maul")
          }),
          t("title_growth_item_3_body")
        ),
        createTitleListItem(
          t("title_growth_item_4_title", {
            boss1: getBossName("sir_aurex"),
            boss2: getBossName("seraph_vale")
          }),
          t("title_growth_item_4_body")
        )
      ]
    }
  };
}

function renderTitleList(container, items) {
  if (!container) {
    return;
  }
  container.replaceChildren();
  items.forEach((item) => {
    const row = document.createElement("div");
    row.className = "title-card-item";
    const title = document.createElement("strong");
    title.textContent = item.title;
    const body = document.createElement("span");
    body.textContent = item.body;
    row.append(title, body);
    container.append(row);
  });
}

function setTitleSelection(index) {
  if (!game?.title) {
    return;
  }
  let nextIndex = index;
  if (nextIndex < 0) {
    nextIndex = TITLE_ACTION_ORDER.length - 1;
  }
  if (nextIndex >= TITLE_ACTION_ORDER.length) {
    nextIndex = 0;
  }
  if (!game.hasSave && TITLE_ACTION_ORDER[nextIndex] === "continue") {
    nextIndex = nextIndex === 0 ? 1 : nextIndex;
  }
  game.title.selectedIndex = nextIndex;
}

function moveTitleSelection(step) {
  if (!game?.title) {
    return;
  }
  let nextIndex = game.title.selectedIndex;
  do {
    nextIndex = (nextIndex + step + TITLE_ACTION_ORDER.length) % TITLE_ACTION_ORDER.length;
  } while (!game.hasSave && TITLE_ACTION_ORDER[nextIndex] === "continue");
  game.title.selectedIndex = nextIndex;
}

function renderTitleOverlay() {
  if (!titleOverlayEl || !game?.title) {
    return;
  }
  const panels = getTitlePanels();
  const panel = panels[game.title.activePanel] ?? panels.chronicle;
  titleMenuEl?.setAttribute("aria-label", t("title_menu_aria"));
  if (titleHeroImageEl) {
    titleHeroImageEl.src = `${getTitleAssetBase()}/black-halo-title-hero.svg`;
    titleHeroImageEl.alt = t("title_hero_alt");
  }
  if (titleLogoImageEl) {
    titleLogoImageEl.src = getTitleLogoPath();
    titleLogoImageEl.alt = t("title_logo_alt");
  }
  if (titleTaglineEl) {
    titleTaglineEl.textContent = t("title_tagline");
  }
  if (titleLoglineEl) {
    titleLoglineEl.textContent = t("title_logline");
  }
  if (titlePanelEyebrowEl) {
    titlePanelEyebrowEl.textContent = panel.eyebrow;
  }
  if (titlePanelTitleEl) {
    titlePanelTitleEl.textContent = panel.title;
  }
  if (titlePanelBodyEl) {
    titlePanelBodyEl.textContent = panel.body;
  }
  if (titleSecondaryEyebrowEl) {
    titleSecondaryEyebrowEl.textContent = panel.secondaryEyebrow;
  }
  if (titleSecondaryTitleEl) {
    titleSecondaryTitleEl.textContent = panel.secondaryTitle;
  }
  if (titleControlsHintEl) {
    titleControlsHintEl.textContent = t("title_controls_hint");
  }
  renderTitleList(titlePanelListEl, panel.items);
  renderTitleList(titleSecondaryListEl, panel.secondaryItems);
  titleActionButtons.forEach((button, index) => {
    const action = button.dataset.titleAction;
    button.textContent = t(`title_action_${action}`);
    const isDisabled = action === "continue" && !game.hasSave;
    button.disabled = isDisabled;
    button.classList.toggle("is-disabled", isDisabled);
    button.classList.toggle("is-selected", game.screen !== "play" && game.title.selectedIndex === index);
    if (action === "chronicle" || action === "armory") {
      button.setAttribute("aria-pressed", String(action === game.title.activePanel));
    } else {
      button.removeAttribute("aria-pressed");
    }
  });
}

function refreshEntityNames() {
  if (!window.blackHaloGame) {
    return;
  }
  game.enemies.forEach((enemy) => {
    enemy.name = enemy.isBoss ? getBossName(enemy.id) : getEnemyName(enemy.id);
  });
}

function renderLocalizedMessage() {
  if (!messageEl) {
    return;
  }
  if (game?.screen !== "play") {
    messageEl.textContent = t("title_status_message");
    return;
  }
  messageEl.textContent = resolveMessageToken(game?.messageToken);
}

function applyStaticTranslations() {
  document.documentElement.lang = currentLanguage;
  document.title = t("page_title");
  canvas.setAttribute("aria-label", t("canvas_label"));
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  if (languageSelectEl) {
    languageSelectEl.value = currentLanguage;
    languageSelectEl.setAttribute("aria-label", t("language_label"));
  }
}

function applyLanguage() {
  applyStaticTranslations();
  renderTitleOverlay();
  if (game?.screen === "play" && game?.room) {
    roomNameEl.textContent = getRoomName(game.room.id);
    buildInteractionsForRoom(game.room);
  } else {
    roomNameEl.textContent = t("title_status_room");
  }
  refreshEntityNames();
  renderLocalizedMessage();
  if (statsEl && game?.screen === "play") {
    updateStats();
  }
}

function setLanguage(language) {
  currentLanguage = language === "ko" ? "ko" : "en";
  try {
    localStorage.setItem(LANGUAGE_KEY, currentLanguage);
  } catch {
    // Ignore storage write failures.
  }
  applyLanguage();
}

languageSelectEl?.addEventListener("change", (event) => {
  setLanguage(event.target.value);
});

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

function createDefaultUpgrades() {
  return {
    vigor: 0,
    might: 0,
    focus: 0
  };
}

function sanitizeUpgradeState(raw) {
  const defaults = createDefaultUpgrades();
  if (!raw || typeof raw !== "object") {
    return defaults;
  }
  return Object.fromEntries(
    Object.keys(defaults).map((track) => {
      const cap = UPGRADE_PATHS[track].length;
      const level = Number.isFinite(raw[track]) ? Math.floor(raw[track]) : 0;
      return [track, clamp(level, 0, cap)];
    })
  );
}

function derivePlayerGrowth(meta) {
  const upgrades = sanitizeUpgradeState(meta?.upgrades);
  let maxHealth = PLAYER_BASE_STATS.maxHealth;
  let damageMultiplier = 1;
  let gloomMultiplier = 1;
  let skillCost = PLAYER_BASE_STATS.skillCost;

  for (let i = 0; i < upgrades.vigor; i += 1) {
    maxHealth += UPGRADE_PATHS.vigor[i].healthBonus;
  }
  for (let i = 0; i < upgrades.might; i += 1) {
    damageMultiplier += UPGRADE_PATHS.might[i].damageBonus;
  }
  for (let i = 0; i < upgrades.focus; i += 1) {
    gloomMultiplier += UPGRADE_PATHS.focus[i].gloomBonus;
    skillCost -= UPGRADE_PATHS.focus[i].skillCostReduction;
  }

  return {
    upgrades,
    maxHealth,
    damageMultiplier,
    gloomMultiplier,
    skillCost: Math.max(14, skillCost),
    speed: PLAYER_BASE_STATS.speed
  };
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
    ash: 0,
    upgrades: createDefaultUpgrades()
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

function createRun(seed = Math.floor(Math.random() * 2147483647), meta = createDefaultMeta()) {
  const random = mulberry32(seed);
  const relicIds = Object.keys(RELICS);
  const growth = derivePlayerGrowth(meta);
  return {
    seed,
    currentRoom: "hub_sanctuary",
    health: growth.maxHealth,
    maxHealth: growth.maxHealth,
    gloom: 0,
    relics: [pickFrom(relicIds, random)],
    visitedRooms: ["hub_sanctuary"],
    defeatedBosses: [],
    claimedRewards: [],
    activeSideRooms: pickSideRooms(seed),
    temporaryCurrency: 0,
    currentWeapon: meta.unlockedWeapons[0] || "fallen_greatblade",
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
  meta.ash = Number.isFinite(raw.ash) ? Math.max(0, Math.floor(raw.ash)) : 0;
  meta.upgrades = sanitizeUpgradeState(raw.upgrades);
  return meta;
}

function sanitizeRun(raw, meta) {
  const growth = derivePlayerGrowth(meta);
  const run = createRun(undefined, meta);
  if (!raw || typeof raw !== "object") {
    run.currentWeapon = meta.unlockedWeapons[0] || "fallen_greatblade";
    return run;
  }

  run.seed = Number.isFinite(raw.seed) ? raw.seed : run.seed;
  run.currentRoom = ROOMS[raw.currentRoom] ? raw.currentRoom : "hub_sanctuary";
  run.maxHealth = growth.maxHealth;
  run.health = Number.isFinite(raw.health) ? clamp(raw.health, 0, growth.maxHealth) : run.health;
  run.gloom = Number.isFinite(raw.gloom) ? clamp(raw.gloom, 0, 100) : 0;
  run.relics = Array.isArray(raw.relics) ? raw.relics.filter((id) => RELICS[id]) : [];
  if (!run.relics.length) {
    run.relics = createRun(run.seed, meta).relics;
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

function isMeaningfulSavedRun(rawRun, run, meta) {
  if (!rawRun || typeof rawRun !== "object") {
    return false;
  }
  const baseline = createRun(run.seed, meta);
  const listChanged = (left, right) => (
    left.length !== right.length ||
    left.some((value, index) => value !== right[index])
  );
  return (
    run.currentRoom !== baseline.currentRoom ||
    run.playerSpawnTag !== baseline.playerSpawnTag ||
    run.health !== baseline.health ||
    run.gloom !== baseline.gloom ||
    run.currentWeapon !== baseline.currentWeapon ||
    run.oath !== baseline.oath ||
    listChanged(run.visitedRooms, baseline.visitedRooms) ||
    listChanged(run.relics, baseline.relics) ||
    run.defeatedBosses.length > 0 ||
    run.claimedRewards.length > 0 ||
    run.temporaryCurrency > 0
  );
}

function loadSave() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const meta = createDefaultMeta();
      const run = createRun(undefined, meta);
      return { meta, run, hasSave: false };
    }
    const parsed = JSON.parse(raw);
    const meta = sanitizeMeta(parsed.meta);
    const run = sanitizeRun(parsed.run, meta);
    return { meta, run, hasSave: isMeaningfulSavedRun(parsed.run, run, meta) };
  } catch {
    const meta = createDefaultMeta();
    return { meta, run: createRun(undefined, meta), hasSave: false };
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

function resetGameProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage removal failures.
  }
  const meta = createDefaultMeta();
  const run = createRun(undefined, meta);
  game.meta = meta;
  game.run = run;
  game.hasSave = false;
  game.room = null;
  game.roomLayout = null;
  game.player = createPlayer();
  game.enemies = [];
  game.projectiles = [];
  game.effects = [];
  game.interactables = [];
  game.victory = false;
  game.message = "";
  game.messageToken = null;
  game.messageTime = 0;
  game.statsPulse = 0;
  game.hitstop = 0;
  game.title.activePanel = "chronicle";
  game.title.selectedIndex = 1;
  game.title.time = 0;
  game.screen = "title";
  game.camera = {
    trauma: 0,
    offsetX: 0,
    offsetY: 0,
    flash: 0,
    flashColor: "rgba(227,219,199,0.22)"
  };
  syncScreenState();
  renderTitleOverlay();
  applyLanguage();
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
    speed: PLAYER_BASE_STATS.speed,
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
    afterimageTimer: 0,
    deathState: null
  };
}

function createEnemy(enemyId, x, y) {
  const template = ENEMIES[enemyId];
  return {
    type: "enemy",
    id: enemyId,
    name: getEnemyName(enemyId),
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
    name: getBossName(bossId),
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
  const growth = derivePlayerGrowth(game.meta);
  game.run = {
    seed,
    currentRoom: "hub_sanctuary",
    health: growth.maxHealth,
    maxHealth: growth.maxHealth,
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
  pushMessage({ key: "msg_run_start" });
}

const initialState = loadSave();
const game = {
  meta: initialState.meta,
  run: initialState.run,
  hasSave: initialState.hasSave,
  screen: "title",
  room: null,
  roomLayout: null,
  player: createPlayer(),
  enemies: [],
  projectiles: [],
  effects: [],
  interactables: [],
  victory: false,
  message: "",
  messageToken: null,
  messageTime: 0,
  statsPulse: 0,
  hitstop: 0,
  title: {
    activePanel: "chronicle",
    selectedIndex: initialState.hasSave ? 0 : 1,
    time: 0
  },
  camera: {
    trauma: 0,
    offsetX: 0,
    offsetY: 0,
    flash: 0,
    flashColor: "rgba(227,219,199,0.22)"
  }
};

window.blackHaloGame = game;

function syncScreenState() {
  const titleActive = game.screen !== "play";
  document.body.classList.toggle("screen-title", titleActive);
  document.body.classList.toggle("screen-play", !titleActive);
  shellEl?.classList.toggle("title-mode", titleActive);
  titleOverlayEl?.setAttribute("aria-hidden", String(!titleActive));
}

function activateTitleAction(action) {
  if (!game?.title) {
    return;
  }
  if (action === "continue") {
    if (!game.hasSave) {
      return;
    }
    beginGameplay("continue");
    return;
  }
  if (action === "new_run") {
    beginGameplay("new");
    return;
  }
  if (action === "chronicle" || action === "armory") {
    game.title.activePanel = action;
    setTitleSelection(TITLE_ACTION_ORDER.indexOf(action));
    renderTitleOverlay();
    return;
  }
  if (action === "reset_game") {
    if (window.confirm(t("title_reset_prompt"))) {
      resetGameProgress();
    }
  }
}

function beginGameplay(mode) {
  game.screen = "play";
  syncScreenState();
  if (mode === "new") {
    game.hasSave = true;
    startNewRun();
  } else {
    loadRoom(game.run.currentRoom || "hub_sanctuary", game.run.playerSpawnTag || "start");
    pushMessage({ key: "msg_continue_run" });
    updateStats();
  }
  applyLanguage();
}

function updateTitle(dt) {
  game.title.time += dt;
  if (hasUiControlFocus()) {
    return;
  }
  if (wasPressed("ArrowUp")) {
    moveTitleSelection(-1);
    renderTitleOverlay();
  }
  if (wasPressed("ArrowDown")) {
    moveTitleSelection(1);
    renderTitleOverlay();
  }
  if (wasPressed("ArrowLeft") || wasPressed("ArrowRight")) {
    game.title.activePanel = game.title.activePanel === "chronicle" ? "armory" : "chronicle";
    renderTitleOverlay();
  }
  if (wasPressed("Enter") || wasPressed("KeyZ") || wasPressed("Space")) {
    activateTitleAction(TITLE_ACTION_ORDER[game.title.selectedIndex]);
  }
  if (wasPressed(...CONTROLS.newRun)) {
    beginGameplay("new");
  }
}

titleActionButtons.forEach((button, index) => {
  button.addEventListener("mouseenter", () => {
    setTitleSelection(index);
    renderTitleOverlay();
  });
  button.addEventListener("focus", () => {
    setTitleSelection(index);
    renderTitleOverlay();
  });
  button.addEventListener("click", () => {
    activateTitleAction(button.dataset.titleAction);
  });
});

function getPlayerGrowth() {
  return derivePlayerGrowth(game.meta);
}

function applyProgressionToRun(options = {}) {
  if (!game.run) {
    return;
  }
  const growth = getPlayerGrowth();
  const previousMax = game.run.maxHealth || growth.maxHealth;
  game.run.maxHealth = growth.maxHealth;
  if (options.fullHeal) {
    game.run.health = growth.maxHealth;
  } else if (options.healDelta) {
    game.run.health = clamp(game.run.health + Math.max(0, growth.maxHealth - previousMax), 0, growth.maxHealth);
  } else {
    game.run.health = clamp(game.run.health, 0, growth.maxHealth);
  }
  if (game.player) {
    game.player.speed = growth.speed;
  }
}

function getNextTrackUpgrade(track) {
  const level = game.meta.upgrades[track] || 0;
  return UPGRADE_PATHS[track][level] || null;
}

function getNextMobilityUpgrade() {
  return MOBILITY_UPGRADES.find((upgrade) => {
    if (upgrade.requires && !hasAbility(upgrade.requires)) {
      return false;
    }
    return !hasAbility(upgrade.abilityId);
  }) || null;
}

function formatUpgradeRank(rank) {
  const numerals = ["I", "II", "III", "IV", "V"];
  return currentLanguage === "ko" ? String(rank) : (numerals[rank - 1] || String(rank));
}

function formatGrowthSummary() {
  return t("growth_summary", {
    vigor: game.meta.upgrades.vigor,
    might: game.meta.upgrades.might,
    focus: game.meta.upgrades.focus
  });
}

function buildTrackUpgradeLabel(track) {
  const next = getNextTrackUpgrade(track);
  const name = t(`upgrade_${track}_name`);
  if (!next) {
    return t("label_upgrade_maxed", { name });
  }
  if (track === "vigor") {
    return t("label_vigor_next", {
      amount: next.healthBonus,
      cost: next.cost
    });
  }
  if (track === "might") {
    return t("label_might_next", {
      rank: formatUpgradeRank((game.meta.upgrades.might || 0) + 1),
      cost: next.cost
    });
  }
  return t("label_focus_next", {
    rank: formatUpgradeRank((game.meta.upgrades.focus || 0) + 1),
    cost: next.cost
  });
}

function buildMobilityUpgradeLabel() {
  const next = getNextMobilityUpgrade();
  const name = t("upgrade_mobility_name");
  if (!next) {
    return t("label_upgrade_maxed", { name });
  }
  return t("label_mobility_next", {
    ability: getAbilityName(next.abilityId),
    cost: next.cost
  });
}

function spendAsh(cost) {
  if (game.meta.ash < cost) {
    pushMessage({ key: "msg_need_ash", vars: { cost } });
    return false;
  }
  game.meta.ash -= cost;
  return true;
}

function buyTrackUpgrade(track) {
  const next = getNextTrackUpgrade(track);
  const name = t(`upgrade_${track}_name`);
  if (!next) {
    pushMessage({ key: "msg_upgrade_maxed", vars: { name } });
    return;
  }
  if (!spendAsh(next.cost)) {
    return;
  }
  game.meta.upgrades[track] += 1;
  applyProgressionToRun({ healDelta: track === "vigor" });
  buildInteractionsForRoom(game.room);
  updateStats();
  saveGame();

  const growth = getPlayerGrowth();
  if (track === "vigor") {
    pushMessage({ key: "msg_upgrade_vigor", vars: { value: growth.maxHealth } });
  } else if (track === "might") {
    pushMessage({
      key: "msg_upgrade_might",
      vars: { percent: Math.round((growth.damageMultiplier - 1) * 100) }
    });
  } else {
    pushMessage({ key: "msg_upgrade_focus", vars: { value: growth.skillCost } });
  }
}

function buyMobilityUpgrade() {
  const next = getNextMobilityUpgrade();
  const name = t("upgrade_mobility_name");
  if (!next) {
    pushMessage({ key: "msg_upgrade_maxed", vars: { name } });
    return;
  }
  if (!spendAsh(next.cost)) {
    return;
  }
  grantAbility(next.abilityId);
  applyProgressionToRun();
  buildInteractionsForRoom(game.room);
  updateStats();
  saveGame();
  pushMessage({ key: "msg_upgrade_mobility", vars: { ability: getAbilityName(next.abilityId) } });
}

function pushMessage(text, duration = 4.2) {
  game.message = resolveMessageToken(text);
  game.messageToken = text;
  game.messageTime = duration;
  renderLocalizedMessage();
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
  game.player.deathState = null;
  applyProgressionToRun();

  const encounterSpots = encounterPositions(room.layout);
  if (room.boss) {
    if (!game.run.defeatedBosses.includes(room.id)) {
      const bossPosition = room.id === "seraph_sanctum"
        ? { x: 1180, y: 640 }
        : { x: 1180, y: 650 };
      game.enemies.push(createBoss(room.boss, bossPosition.x, bossPosition.y));
      if (room.boss === "sir_aurex") {
        pushMessage({ dialogue: "aurex_intro" });
      } else {
        pushMessage({ dialogue: "seraph_intro" });
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
  roomNameEl.textContent = getRoomName(room.id);
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
      label: localizeLabel(exit.label),
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
      label: localizeLabel("Mara Bellwright: Cycle weapon")
    });
    game.interactables.push({
      type: "vigor_upgrade",
      x: 336,
      y: 528,
      radius: 80,
      label: buildTrackUpgradeLabel("vigor")
    });
    game.interactables.push({
      type: "might_upgrade",
      x: 790,
      y: 650,
      radius: 80,
      label: buildTrackUpgradeLabel("might")
    });
    game.interactables.push({
      type: "focus_upgrade",
      x: 1188,
      y: 650,
      radius: 80,
      label: buildTrackUpgradeLabel("focus")
    });
    game.interactables.push({
      type: "mobility_upgrade",
      x: 1226,
      y: 498,
      radius: 80,
      label: buildMobilityUpgradeLabel()
    });
  }

  if (room.rewards && room.rewards.length && !game.run.claimedRewards.includes(room.id)) {
    game.interactables.push({
      type: "reward",
      x: 800,
      y: 650,
      radius: 80,
      label: localizeLabel("Claim room reward")
    });
  }
}

function updateStats() {
  statsEl.innerHTML = [
    `<div><strong>${t("stat_health")}</strong><span>${Math.ceil(game.run.health)} / ${Math.ceil(game.run.maxHealth)}</span></div>`,
    `<div><strong>${t("stat_gloom")}</strong><span>${Math.ceil(game.run.gloom)} / 100</span></div>`,
    `<div><strong>${t("stat_ash")}</strong><span>${game.meta.ash}</span></div>`,
    `<div><strong>${t("stat_weapon")}</strong><span>${getWeaponName(game.run.currentWeapon)}</span></div>`,
    `<div><strong>${t("stat_oath")}</strong><span>${getOathName(game.run.oath)}</span></div>`,
    `<div><strong>${t("stat_abilities")}</strong><span>${formatAbilitySummary()}</span></div>`,
    `<div><strong>${t("stat_growth")}</strong><span>${formatGrowthSummary()}</span></div>`,
    `<div><strong>${t("stat_relic")}</strong><span>${game.run.relics[0] ? getRelicName(game.run.relics[0]) : t("stat_none")}</span></div>`
  ].join("");
}

function formatAbilitySummary() {
  const names = game.meta.unlockedAbilities.map((id) => getAbilityName(id)).filter(Boolean);
  return names.length ? names.join(", ") : t("stat_none_yet");
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

function getAttackMotion(attack, overrideElapsed = null) {
  if (!attack) {
    return {
      elapsed: 0,
      startupProgress: 0,
      swingProgress: 0,
      totalProgress: 0,
      inStartup: false
    };
  }
  const elapsed = overrideElapsed === null ? attack.elapsed : overrideElapsed;
  const startup = attack.startup || 0;
  const swingDuration = attack.swingDuration || Math.max(0.001, attack.duration - startup);
  return {
    elapsed,
    startupProgress: startup > 0 ? clamp01(elapsed / startup) : 1,
    swingProgress: clamp01((elapsed - startup) / swingDuration),
    totalProgress: clamp01(elapsed / attack.duration),
    inStartup: elapsed < startup
  };
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

function getPlayerWeaponPose(player, overrideElapsed = null) {
  const weapon = WEAPONS[game.run.currentWeapon];
  const attack = player.attackState;
  const baseX = player.x + player.facing * weapon.gripOffset.x;
  const baseY = player.y + player.h * 0.5 + weapon.gripOffset.y;

  const idleAngle = angleForFacing(-0.26, player.facing);
  let angle = idleAngle;
  let progress = 0;
  let kind = "idle";
  let totalProgress = 0;
  let inStartup = false;

  if (attack) {
    kind = attack.kind;
    const motion = getAttackMotion(attack, overrideElapsed);
    progress = motion.swingProgress;
    totalProgress = motion.totalProgress;
    inStartup = motion.inStartup;
    const profile = attack.profile;
    if (motion.inStartup) {
      angle = lerp(idleAngle, angleForFacing(profile.startAngle, player.facing), easeOutCubic(motion.startupProgress));
    } else {
      const sweep = easeInOutCubic(progress);
      const settle = easeOutCubic(progress);
      angle = lerp(
        angleForFacing(profile.startAngle, player.facing),
        angleForFacing(profile.endAngle, player.facing),
        sweep
      );
      angle += player.facing * Math.sin(settle * Math.PI) * (kind === "light" ? 0.06 : 0.12);
    }
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
    totalProgress,
    inStartup,
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

function getLocalWeaponAngle(player, overrideElapsed = null) {
  if (player.deathState) {
    const collapse = easeOutCubic(clamp01(player.deathState.elapsed / DEATH_COLLAPSE_TIME));
    return lerp(-0.26, 1.34, collapse);
  }
  const attack = player.attackState;
  if (attack) {
    const motion = getAttackMotion(attack, overrideElapsed);
    if (motion.inStartup) {
      return lerp(-0.26, attack.profile.startAngle, easeOutCubic(motion.startupProgress));
    }
    const sweep = easeInOutCubic(motion.swingProgress);
    return lerp(attack.profile.startAngle, attack.profile.endAngle, sweep)
      + Math.sin(easeOutCubic(motion.swingProgress) * Math.PI) * (attack.kind === "light" ? 0.06 : 0.12);
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
  const growth = getPlayerGrowth();
  game.run.gloom = clamp(game.run.gloom + amount * growth.gloomMultiplier, 0, 100);
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
  const growth = getPlayerGrowth();

  let damage = kind === "heavy" ? weapon.heavyDamage : weapon.baseDamage;
  if (kind === "heavy") {
    damage += relicMods.heavyBonus || 0;
  }
  if (kind === "skill") {
    damage = weapon.heavyDamage + 10 + (relicMods.skillBonus || 0);
  }
  damage *= oath.damageMultiplier * growth.damageMultiplier;

  const startup = profile.startup || 0;
  const totalDuration = startup + profile.duration;

  player.attackState = {
    kind,
    duration: totalDuration,
    startup,
    swingDuration: profile.duration,
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
    player.skillTime = totalDuration;
    player.attackTime = 0;
  } else {
    player.attackTime = totalDuration;
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

  const previousElapsed = attack.elapsed;
  const previousMotion = getAttackMotion(attack, previousElapsed);
  const previousPose = getPlayerWeaponPose(player, previousElapsed);
  attack.elapsed = Math.min(attack.duration, attack.elapsed + dt);
  attack.trailTimer = Math.max(0, attack.trailTimer - dt);
  attack.afterimageTimer = Math.max(0, attack.afterimageTimer - dt);

  const currentMotion = getAttackMotion(attack, attack.elapsed);
  const currentPose = getPlayerWeaponPose(player, attack.elapsed);
  const activeStart = attack.profile.activeStart;
  const activeEnd = attack.profile.activeEnd;
  const activeWindowTouched = !currentMotion.inStartup
    && previousMotion.swingProgress <= activeEnd
    && currentMotion.swingProgress >= activeStart;
  const activeNow = !currentMotion.inStartup
    && currentMotion.swingProgress >= activeStart
    && currentMotion.swingProgress <= activeEnd;

  if (activeNow && attack.trailTimer <= 0) {
    spawnWeaponTrail(currentPose, attack, 0.95 - currentMotion.totalProgress * 0.22);
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

  if (attack.elapsed >= attack.duration) {
    player.attackState = null;
  }
}

function updatePlayer(dt) {
  const player = game.player;
  const weapon = WEAPONS[game.run.currentWeapon];
  const oath = OATHS[game.run.oath];
  const relicMods = getActiveRelicModifiers();
  const growth = getPlayerGrowth();

  player.speed = growth.speed;

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
    const attackMotion = getAttackMotion(player.attackState);
    const drive = player.attackState.kind === "light"
      ? 120
      : player.attackState.kind === "heavy"
        ? 190
        : 230;
    if (attackMotion.inStartup) {
      const brace = player.attackState.kind === "light" ? 56 : player.attackState.kind === "heavy" ? 84 : 72;
      player.vx = -player.facing * brace * (1 - attackMotion.startupProgress);
    } else {
      const lunge = Math.sin(attackMotion.swingProgress * Math.PI) * drive;
      player.vx = player.facing * lunge;
    }
  } else if (player.attackTime > 0 || player.skillTime > 0) {
    player.vx = lerp(player.vx, 0, 0.3);
  } else {
    player.vx = axis * (player.speed + (oath.moveBonus || 0));
  }

  if (wasPressed(...CONTROLS.jump)) {
    if (player.onGround) {
      player.vy = -JUMP_VELOCITY;
      player.onGround = false;
      player.action = "jump";
    } else if (player.doubleJumpReady) {
      player.doubleJumpReady = false;
      player.vy = -DOUBLE_JUMP_VELOCITY;
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
    } else if (game.run.gloom >= growth.skillCost) {
      game.run.gloom = Math.max(0, game.run.gloom - growth.skillCost);
      startPlayerAttack("skill");
      const direction = player.facing;
      createProjectile(
        player.x + direction * 60,
        player.y - 40,
        direction * 760,
        0,
        28,
        COLORS.cyan,
        (weapon.heavyDamage + 10 + (relicMods.skillBonus || 0)) * oath.damageMultiplier * growth.damageMultiplier,
        "player_skill",
        0.55
      );
      pushMessage({ key: "msg_skill_fire", vars: { skill: getWeaponSkillName(game.run.currentWeapon) } });
    } else if (player.contactMessageCooldown <= 0) {
      pushMessage({ key: "msg_not_enough_gloom" });
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
    handlePlayerDeath({ x: player.x, y: player.y + 120, abyss: true });
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
  pushMessage({ key: "msg_chain_grapple_ignite" });
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
      if (range <= 220 && height < 130) {
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

    if (range <= 236 && height < 120) {
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
      if (range <= 184 && height < 110) {
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
      if (range <= 310 && range >= 80 && height < 100) {
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
      if (range <= 620 && range >= 120 && height < 240) {
        const useArc = range > 320 || game.player.y + 20 < enemy.y;
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
      if (range <= 340 && range >= 72 && height < 124) {
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
      if (range <= 320 && range >= 40 && height < 96 && enemy.onGround) {
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
      bx: enemy.x + enemy.facing * 126,
      by: enemy.y - 12,
      radius: 74,
      damage: enemy.damage + 4,
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
        bx: enemy.x + enemy.facing * 162,
        by: enemy.y - 36,
        radius: 58,
        damage: enemy.damage + 2,
        parryable: true
      });
      addEffect({ type: "rush_arc", x: enemy.x + enemy.facing * 64, y: enemy.y - 38, facing: enemy.facing, life: 0.18 });
      break;
    case "sunlance_thrust":
      resolveEnemyStrike(enemy, {
        ax: enemy.x + enemy.facing * 28,
        ay: enemy.y - 42,
        bx: enemy.x + enemy.facing * 280,
        by: enemy.y - 42,
        radius: 30,
        damage: enemy.damage + 3,
        parryable: true
      });
      addEffect({ type: "seraph_slash", x: enemy.x + enemy.facing * 124, y: enemy.y - 42, facing: enemy.facing, life: 0.16 });
      break;
    case "choir_direct":
      createProjectile(
        enemy.x + enemy.facing * 36,
        enemy.y - 64,
        enemy.facing * 500,
        0,
        18,
        COLORS.cyan,
        enemy.damage,
        "enemy",
        0.9,
        { maxDistance: 420, shape: "direct" }
      );
      addEffect({ type: "choir_cast", x: enemy.x + enemy.facing * 36, y: enemy.y - 68, life: 0.28 });
      break;
    case "choir_arc":
      createProjectile(
        enemy.x + enemy.facing * 30,
        enemy.y - 70,
        enemy.facing * 300,
        -460,
        15,
        COLORS.ivory,
        enemy.damage + 2,
        "enemy",
        1.28,
        { gravity: 820, maxDistance: 540, shape: "arc" }
      );
      addEffect({ type: "choir_cast", x: enemy.x + enemy.facing * 30, y: enemy.y - 72, life: 0.32 });
      break;
    case "inquisitor_lash":
      createProjectile(
        enemy.x + enemy.facing * 40,
        enemy.y - 50,
        enemy.facing * 660,
        0,
        20,
        COLORS.crimson,
        enemy.damage + 2,
        "enemy",
        0.56,
        { maxDistance: 330, shape: "direct" }
      );
      addEffect({ type: "cross_cut", x: enemy.x + enemy.facing * 72, y: enemy.y - 52, facing: enemy.facing, life: 0.18 });
      break;
    case "hound_pounce":
      enemy.vx = enemy.facing * 460;
      enemy.vy = -560;
      enemy.leapTime = 0.72;
      enemy.leapImpactPending = true;
      finishEnemyAttack(enemy);
      return;
    case "aurex_cleave":
      resolveEnemyStrike(enemy, {
        ax: enemy.x + enemy.facing * 30,
        ay: enemy.y - 48,
        bx: enemy.x + enemy.facing * 190,
        by: enemy.y - 40,
        radius: 64,
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
        bx: enemy.x + enemy.facing * 248,
        by: enemy.y - 44,
        radius: 72,
        damage: enemy.damage + 7,
        parryable: true,
        parryGloom: 22
      });
      enemy.specialCooldown = enemy.phases[enemy.phaseIndex].specialCooldown;
      break;
    case "aurex_halo":
      addEffect({ type: "halo_burst", x: enemy.x, y: enemy.y - 90, life: 0.5 });
      addCameraTrauma(0.12);
      resolveEnemyStrike(enemy, {
        ax: enemy.x - 220,
        ay: enemy.y - 60,
        bx: enemy.x + 220,
        by: enemy.y - 60,
        radius: 112,
        damage: enemy.damage + 9,
        parryable: false
      });
      enemy.specialCooldown = enemy.phases[enemy.phaseIndex].specialCooldown;
      break;
    case "seraph_cleave":
      resolveEnemyStrike(enemy, {
        ax: enemy.x + enemy.facing * 34,
        ay: enemy.y - 50,
        bx: enemy.x + enemy.facing * 220,
        by: enemy.y - 40,
        radius: 44,
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
        bx: enemy.x + enemy.facing * 250,
        by: enemy.y - 42,
        radius: 54,
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
        { maxDistance: 450, shape: "direct" }
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
        { gravity: 780, maxDistance: 460, shape: "arc" }
      );
      addEffect({ type: "cross_cut", x: enemy.x + enemy.facing * 76, y: enemy.y - 56, facing: enemy.facing, life: 0.26 });
      enemy.specialCooldown = enemy.phases[enemy.phaseIndex].specialCooldown;
      break;
    case "seraph_halo":
      addEffect({ type: "seraph_halo", x: enemy.x, y: enemy.y - 80, life: 0.55 });
      flashScreen("rgba(122,215,224,0.18)", 0.08);
      addCameraTrauma(0.14);
      resolveEnemyStrike(enemy, {
        ax: enemy.x - 230,
        ay: enemy.y - 70,
        bx: enemy.x + 230,
        by: enemy.y - 70,
        radius: 122,
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
      pushMessage({ dialogue: "aurex_shift" });
    } else if (boss.id === "seraph_vale") {
      pushMessage({ dialogue: index === 1 ? "seraph_shift_1" : "seraph_shift_2" });
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
  const ashReward = enemy.isBoss ? (enemy.id === "seraph_vale" ? 12 : 9) : 1;
  game.meta.ash += ashReward;
  if (enemy.isBoss) {
    if (!game.run.defeatedBosses.includes(game.room.id)) {
      game.run.defeatedBosses.push(game.room.id);
    }
    if (enemy.id === "sir_aurex") {
      pushMessage({ dialogue: "aurex_defeat" });
    } else if (enemy.id === "seraph_vale") {
      pushMessage({ dialogue: "seraph_defeat" }, 6);
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
      pushMessage({ key: "msg_room_cleared" });
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
    handlePlayerDeath(source);
  }
}

function updatePlayerDeath(dt) {
  const player = game.player;
  const death = player.deathState;
  if (!death) {
    return false;
  }

  death.elapsed += dt;
  player.attackState = null;
  player.attackTime = 0;
  player.skillTime = 0;
  player.parryTime = 0;
  player.dashTime = 0;
  player.dashCooldown = Math.max(player.dashCooldown, 0.18);
  player.grappleTarget = null;
  player.attackFlash = 0;
  player.invulnerable = Math.max(player.invulnerable, DEATH_RESPAWN_DELAY - death.elapsed);
  player.action = "death";
  player.vx = lerp(player.vx, 0, player.onGround ? 0.18 : 0.035);
  player.vy += GRAVITY * 1.08 * dt;
  moveEntity(player, dt);

  if (player.onGround && !death.groundBurstDone) {
    death.groundBurstDone = true;
    addEffect({
      type: "death_impact",
      x: player.x,
      y: player.y + player.h * 0.5 - 6,
      life: 0.34
    });
    addEffect({
      type: "death_feathers",
      x: player.x - player.facing * 18,
      y: player.y - 36,
      facing: player.facing,
      color: COLORS.crimson,
      life: 0.36
    });
    addHitstop(0.045);
    addCameraTrauma(0.16);
    flashScreen("rgba(127,29,43,0.14)", 0.1);
  }

  if (!player.onGround && death.trailTimer > 0) {
    death.trailTimer = Math.max(0, death.trailTimer - dt);
  } else if (!player.onGround && death.elapsed < DEATH_COLLAPSE_TIME) {
    addEffect({
      type: "afterimage",
      x: player.x,
      y: player.y,
      h: player.h,
      facing: player.facing,
      color: "rgba(127,29,43,0.16)",
      life: 0.12
    });
    death.trailTimer = 0.045;
  }

  if (death.elapsed >= DEATH_RESPAWN_DELAY) {
    startNewRun();
    return true;
  }
  return true;
}

function handlePlayerDeath(source = null) {
  const player = game.player;
  if (player.deathState) {
    return;
  }

  const sourceX = Number.isFinite(source?.x) ? source.x : player.x - player.facing * 40;
  const knockDirection = source?.abyss ? player.facing : player.x < sourceX ? -1 : 1;

  player.deathState = {
    elapsed: 0,
    trailTimer: 0,
    groundBurstDone: false
  };
  player.attackState = null;
  player.attackTime = 0;
  player.skillTime = 0;
  player.parryTime = 0;
  player.dashTime = 0;
  player.doubleJumpReady = false;
  player.grappleTarget = null;
  player.facing = knockDirection;
  player.vx = knockDirection * 300;
  player.vy = source?.abyss ? -220 : -420;
  player.invulnerable = DEATH_RESPAWN_DELAY;
  player.action = "death";
  game.run.health = 0;
  game.projectiles = [];

  addEffect({
    type: "death_bloom",
    x: player.x,
    y: player.y - 52,
    life: 0.46
  });
  addEffect({
    type: "death_feathers",
    x: player.x,
    y: player.y - 62,
    facing: player.facing,
    color: COLORS.cyan,
    life: 0.48
  });
  addEffect({
    type: "death_feathers",
    x: player.x + player.facing * 16,
    y: player.y - 44,
    facing: -player.facing,
    color: COLORS.ivory,
    life: 0.4
  });
  addEffect({
    type: "death_feathers",
    x: player.x - player.facing * 10,
    y: player.y - 30,
    facing: player.facing,
    color: COLORS.crimson,
    life: 0.34
  });
  addHitstop(0.09);
  addCameraTrauma(0.5);
  flashScreen("rgba(127,29,43,0.28)", 0.18);
  pushMessage({ key: "msg_player_death" });
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
      pushMessage({ key: "msg_locked_by", vars: { ability: getAbilityName(interaction.gate) } });
      return;
    }
    loadRoom(interaction.target, interaction.spawnTag);
    return;
  }

  if (interaction.type === "forge") {
    cycleWeapon();
    pushMessage({ dialogue: "mara_forge" });
    return;
  }

  if (interaction.type === "vigor_upgrade") {
    buyTrackUpgrade("vigor");
    return;
  }

  if (interaction.type === "might_upgrade") {
    buyTrackUpgrade("might");
    return;
  }

  if (interaction.type === "focus_upgrade") {
    buyTrackUpgrade("focus");
    return;
  }

  if (interaction.type === "mobility_upgrade") {
    buyMobilityUpgrade();
    return;
  }

  if (interaction.type === "reward") {
    if (game.enemies.some((enemy) => enemy.health > 0)) {
      pushMessage({ key: "msg_defeat_defenders" });
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
      const ashReward = 6;
      game.meta.ash += ashReward;
      pushMessage({ key: "msg_recovered_ash", vars: { amount: ashReward } });
    } else if (reward === "memory_shard") {
      const shard = `${game.room.id}_memory`;
      if (!game.meta.memoryShards.includes(shard)) {
        game.meta.memoryShards.push(shard);
      }
      pushMessage({ key: "msg_memory_shard" });
    } else if (reward === "relic") {
      const relicIds = Object.keys(RELICS).filter((id) => !game.run.relics.includes(id));
      const random = mulberry32(game.run.seed ^ game.run.claimedRewards.length);
      const relicId = relicIds.length ? pickFrom(relicIds, random) : pickFrom(Object.keys(RELICS), random);
      game.run.relics.push(relicId);
      pushMessage({ key: "msg_relic_claimed", vars: { relic: getRelicName(relicId) } });
    }
  }

  buildInteractionsForRoom(game.room);
  updateStats();
  saveGame();
}

function update(dt) {
  if (game.screen !== "play") {
    updateTitle(dt);
    clearPressed();
    return;
  }

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
      game.messageToken = null;
      renderLocalizedMessage();
    }
  }

  if (game.player.deathState) {
    updatePlayerDeath(simDt);
    updateEffects(simDt);
    updateStats();
    clearPressed();
    return;
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
  if (game.screen !== "play") {
    drawTitleScreen();
    return;
  }
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

function drawTitleScreen() {
  const time = game.title.time;
  const sky = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  sky.addColorStop(0, "#18131b");
  sky.addColorStop(0.52, "#120f15");
  sky.addColorStop(1, "#09080c");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const glow = ctx.createRadialGradient(WIDTH * 0.52, HEIGHT * 0.28, 60, WIDTH * 0.52, HEIGHT * 0.28, 420);
  glow.addColorStop(0, "rgba(227,219,199,0.18)");
  glow.addColorStop(0.45, "rgba(122,215,224,0.10)");
  glow.addColorStop(1, "rgba(11,10,15,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.save();
  ctx.globalAlpha = 0.18;
  ctx.strokeStyle = "rgba(168,140,87,0.85)";
  ctx.lineWidth = 3;
  for (let i = 0; i < 5; i += 1) {
    const x = 170 + i * 315;
    ctx.beginPath();
    ctx.moveTo(x, HEIGHT);
    ctx.lineTo(x, 178);
    ctx.quadraticCurveTo(x + 72, 48, x + 146, 178);
    ctx.lineTo(x + 146, HEIGHT);
    ctx.stroke();
  }
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = 0.1;
  ctx.strokeStyle = "rgba(122,215,224,0.8)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 4; i += 1) {
    const x = 250 + i * 360;
    ctx.beginPath();
    ctx.moveTo(x, 88);
    ctx.lineTo(x + 20, 292);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + 76, 88);
    ctx.lineTo(x + 56, 252);
    ctx.stroke();
  }
  ctx.restore();

  ctx.save();
  ctx.translate(WIDTH * 0.53, HEIGHT * 0.30);
  ctx.rotate(Math.sin(time * 0.22) * 0.05);
  ctx.strokeStyle = "rgba(168,140,87,0.68)";
  ctx.lineWidth = 16;
  ctx.beginPath();
  ctx.setLineDash([280, 56, 120, 76, 154, 88]);
  ctx.arc(0, 0, 176, -2.24, 1.08);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.strokeStyle = "rgba(122,215,224,0.32)";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(0, 0, 146, -1.84, 0.94);
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = 0.28;
  ctx.translate(1110, 218);
  ctx.strokeStyle = "rgba(122,215,224,0.7)";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(-76, -52);
  ctx.lineTo(-10, -4);
  ctx.lineTo(-52, 70);
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.translate(1160, 448);
  ctx.globalAlpha = 0.44;
  const mirrorGlow = ctx.createLinearGradient(0, -180, 0, 180);
  mirrorGlow.addColorStop(0, "rgba(122,215,224,0.42)");
  mirrorGlow.addColorStop(1, "rgba(122,215,224,0.02)");
  ctx.fillStyle = mirrorGlow;
  ctx.beginPath();
  ctx.moveTo(-128, -220);
  ctx.quadraticCurveTo(-50, -280, 0, -250);
  ctx.quadraticCurveTo(62, -214, 92, -128);
  ctx.quadraticCurveTo(110, -40, 84, 98);
  ctx.quadraticCurveTo(52, 206, -26, 264);
  ctx.quadraticCurveTo(-86, 216, -116, 140);
  ctx.quadraticCurveTo(-148, 18, -128, -220);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.translate(1134, 404);
  ctx.globalAlpha = 0.74;
  ctx.fillStyle = "rgba(214,233,236,0.78)";
  ctx.beginPath();
  ctx.moveTo(0, -162);
  ctx.quadraticCurveTo(48, -142, 68, -86);
  ctx.quadraticCurveTo(82, -36, 78, 32);
  ctx.quadraticCurveTo(70, 102, 34, 156);
  ctx.quadraticCurveTo(-8, 188, -40, 176);
  ctx.quadraticCurveTo(-58, 166, -56, 132);
  ctx.quadraticCurveTo(-48, 42, -20, -46);
  ctx.quadraticCurveTo(-4, -112, 0, -162);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.fillStyle = "rgba(127,29,43,0.16)";
  ctx.beginPath();
  ctx.moveTo(830, 510);
  ctx.quadraticCurveTo(900, 462, 968, 502);
  ctx.quadraticCurveTo(1046, 554, 1082, 700);
  ctx.quadraticCurveTo(958, 770, 814, 754);
  ctx.quadraticCurveTo(816, 630, 830, 510);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.translate(705, 610);
  ctx.fillStyle = "#100E13";
  ctx.beginPath();
  ctx.moveTo(-12, -202);
  ctx.quadraticCurveTo(18, -236, 70, -230);
  ctx.quadraticCurveTo(130, -220, 160, -164);
  ctx.quadraticCurveTo(184, -118, 180, -30);
  ctx.quadraticCurveTo(172, 74, 156, 174);
  ctx.quadraticCurveTo(148, 216, 122, 236);
  ctx.quadraticCurveTo(64, 258, 10, 228);
  ctx.quadraticCurveTo(-30, 198, -42, 150);
  ctx.quadraticCurveTo(-60, 44, -64, -52);
  ctx.quadraticCurveTo(-66, -134, -12, -202);
  ctx.fill();
  ctx.fillStyle = "rgba(127,29,43,0.58)";
  ctx.beginPath();
  ctx.moveTo(70, -142);
  ctx.quadraticCurveTo(148, -68, 176, 94);
  ctx.quadraticCurveTo(164, 164, 122, 228);
  ctx.quadraticCurveTo(60, 236, 8, 218);
  ctx.quadraticCurveTo(18, 78, 34, -42);
  ctx.quadraticCurveTo(44, -112, 70, -142);
  ctx.fill();
  ctx.strokeStyle = "rgba(227,219,199,0.14)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(20, -210);
  ctx.quadraticCurveTo(60, -236, 104, -224);
  ctx.quadraticCurveTo(142, -210, 160, -174);
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.translate(520, 642);
  ctx.rotate(-0.12);
  const blade = ctx.createLinearGradient(0, -200, 0, 154);
  blade.addColorStop(0, "#F2E9D7");
  blade.addColorStop(0.34, "#A88C57");
  blade.addColorStop(1, "#211B22");
  ctx.fillStyle = blade;
  ctx.fillRect(-18, -218, 36, 320);
  ctx.fillStyle = "#A88C57";
  ctx.fillRect(-28, -192, 56, 18);
  ctx.fillStyle = "#221A1F";
  ctx.fillRect(-6, -164, 12, 124);
  ctx.restore();

  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.56)";
  ctx.beginPath();
  ctx.ellipse(714, 820, 268, 42, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  for (let i = 0; i < 54; i += 1) {
    const drift = (time * (12 + (i % 7))) + i * 31;
    const x = ((i * 97) + drift * 0.8) % (WIDTH + 160) - 80;
    const y = 120 + ((i * 53) + drift * 1.4) % 720;
    const size = 1.6 + (i % 4) * 0.7;
    ctx.fillStyle = i % 5 === 0 ? "rgba(122,215,224,0.35)" : "rgba(227,219,199,0.26)";
    ctx.fillRect(x, y, size, size);
  }

  const mist = ctx.createLinearGradient(0, HEIGHT * 0.62, 0, HEIGHT);
  mist.addColorStop(0, "rgba(15,14,18,0)");
  mist.addColorStop(1, "rgba(8,7,10,0.84)");
  ctx.fillStyle = mist;
  ctx.fillRect(0, HEIGHT * 0.58, WIDTH, HEIGHT * 0.42);
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

  const bob = entity.kind === "player" && entity.deathState
    ? 0
    : Math.sin(performance.now() * 0.008 + x * 0.01) * 2;
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
  const isPlayerDeath = entity.kind === "player" && !!entity.deathState;
  const width = entity.w * (entity.kind === "player" ? (isPlayerDeath ? 1.24 : 0.95) : entity.isBoss ? 1.2 : 1.05);
  const alpha = entity.kind === "player" ? (isPlayerDeath ? 0.24 : 0.18) : entity.isBoss ? 0.22 : 0.14;
  ctx.save();
  ctx.translate(entity.x, floorY + 10);
  ctx.fillStyle = `rgba(0,0,0,${alpha * (1 - lift * 0.45)})`;
  ctx.beginPath();
  ctx.ellipse(0, 0, width, 16 + entity.h * 0.04, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawPlayerDeathShape(player) {
  const death = player.deathState;
  const collapse = easeOutCubic(clamp01(death.elapsed / DEATH_COLLAPSE_TIME));
  const settle = death.groundBurstDone
    ? easeOutCubic(clamp01((death.elapsed - DEATH_COLLAPSE_TIME * 0.45) / (DEATH_RESPAWN_DELAY - DEATH_COLLAPSE_TIME * 0.45)))
    : 0;
  const auraAlpha = 0.08 * (1 - clamp01(death.elapsed / DEATH_RESPAWN_DELAY));
  const capeDrift = 46 + collapse * 32;

  ctx.save();
  ctx.translate(-24 * collapse, 18 + collapse * 20 + settle * 18);
  ctx.rotate(-lerp(0.18, 1.5, collapse));

  ctx.fillStyle = `rgba(122,215,224,${auraAlpha * 0.7})`;
  ctx.beginPath();
  ctx.ellipse(-12, -82, 40, 64, -0.18, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = COLORS.crimson;
  ctx.beginPath();
  ctx.moveTo(-14, -74);
  ctx.lineTo(-86, -38 + capeDrift * 0.14);
  ctx.lineTo(-54, 18 + capeDrift * 0.08);
  ctx.lineTo(-8, -4);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#2b252c";
  ctx.fillRect(-10, -72, 26, 52);
  ctx.fillRect(-22, -16, 14, 50);
  ctx.fillRect(2, -10, 14, 44);
  ctx.fillRect(16, -64, 15, 34);
  ctx.fillRect(22, -34, 14, 34);

  ctx.fillStyle = "#d0c7b7";
  ctx.beginPath();
  ctx.arc(6, -88, 16, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = `rgba(122,215,224,${0.34 + auraAlpha * 2.2})`;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(4, -96, 20, -2.6, -0.4);
  ctx.stroke();

  drawWeapon(game.run.currentWeapon, player, 0);
  ctx.restore();
}

function drawPlayerShape(player) {
  if (player.deathState) {
    drawPlayerDeathShape(player);
    return;
  }

  const attack = player.attackState;
  const attackMotion = attack ? getAttackMotion(attack) : null;
  const attackProgress = attackMotion ? attackMotion.totalProgress : 0;
  const motionLean = attack
    ? attackMotion.inStartup
      ? lerp(-0.04, -0.24, easeOutCubic(attackMotion.startupProgress))
      : lerp(-0.16, 0.18, easeInOutCubic(attackMotion.swingProgress))
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
  const progress = attack ? getAttackMotion(attack).swingProgress : 0;
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
    } else if (effect.type === "death_bloom") {
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = COLORS.crimson;
      ctx.globalAlpha = alpha * 0.22;
      ctx.beginPath();
      ctx.arc(0, 0, 54 + (1 - alpha) * 112, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = COLORS.ivory;
      ctx.lineWidth = 6;
      ctx.globalAlpha = alpha * 0.82;
      ctx.beginPath();
      ctx.arc(0, 0, 42 + (1 - alpha) * 94, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = COLORS.cyan;
      ctx.lineWidth = 3;
      ctx.globalAlpha = alpha * 0.6;
      ctx.beginPath();
      ctx.arc(0, 0, 20 + (1 - alpha) * 56, 0, Math.PI * 2);
      ctx.stroke();
    } else if (effect.type === "death_feathers") {
      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = effect.color || COLORS.ivory;
      ctx.lineWidth = 4;
      for (let i = 0; i < 8; i += 1) {
        const spread = -1.18 + i * 0.34 + Math.sin(effect.seed + i * 1.7) * 0.06;
        const length = 30 + i * 8;
        const drift = 18 + i * 6;
        ctx.globalAlpha = alpha * (0.8 - i * 0.05);
        ctx.save();
        ctx.rotate(spread);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(length * (1 - alpha * 0.18), -drift * (1 - alpha));
        ctx.stroke();
        ctx.restore();
      }
    } else if (effect.type === "death_impact") {
      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = COLORS.crimson;
      ctx.lineWidth = 6;
      ctx.globalAlpha = alpha * 0.7;
      ctx.beginPath();
      ctx.ellipse(0, 0, 44 + (1 - alpha) * 110, 10 + (1 - alpha) * 24, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = COLORS.ivory;
      ctx.lineWidth = 3;
      for (let i = 0; i < 5; i += 1) {
        const offset = -80 + i * 40;
        ctx.beginPath();
        ctx.moveTo(offset * alpha, 0);
        ctx.lineTo(offset + Math.sign(offset || 1) * 42 * (1 - alpha), -12 - i * 4);
        ctx.stroke();
      }
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
    const showLabel = isNearest || distance(interactable, game.player) < interactable.radius + 54;
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

    if (showLabel) {
      ctx.fillStyle = isNearest ? COLORS.ink : COLORS.muted;
      ctx.font = "16px Georgia";
      ctx.textAlign = "center";
      ctx.fillText(interactable.label, 0, -26);
    }
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
  ctx.fillText(t("stat_health"), 36, 52);
  ctx.fillText(t("stat_gloom"), 36, 90);

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
  ctx.fillText(t("overlay_title"), WIDTH / 2, HEIGHT / 2 - 40);
  ctx.font = "24px Georgia";
  ctx.fillStyle = COLORS.muted;
  ctx.fillText(t("overlay_body"), WIDTH / 2, HEIGHT / 2 + 10);
  ctx.fillText(t("overlay_restart"), WIDTH / 2, HEIGHT / 2 + 52);
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

syncScreenState();
renderTitleOverlay();
applyLanguage();
requestAnimationFrame(frame);
