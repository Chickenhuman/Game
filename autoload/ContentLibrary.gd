extends Node

var style_specs: Dictionary = {}
var prompt_specs: Dictionary = {}
var rig_specs: Dictionary = {}
var environment_sets: Dictionary = {}
var weapons: Dictionary = {}
var abilities: Dictionary = {}
var relics: Dictionary = {}
var enemies: Dictionary = {}
var boss_phases: Dictionary = {}
var rooms: Dictionary = {}
var dialogues: Dictionary = {}
var oaths := {
	"execution": {"display_name": "Execution", "damage_multiplier": 1.15, "gloom_bonus": 1.0},
	"pursuit": {"display_name": "Pursuit", "damage_multiplier": 1.0, "gloom_bonus": 1.25, "move_bonus": 30.0},
	"silence": {"display_name": "Silence", "damage_multiplier": 1.0, "gloom_bonus": 1.1, "parry_bonus": 0.12},
}

func _ready() -> void:
	_build_styles()
	_build_prompt_specs()
	_build_rigs()
	_build_environment_sets()
	_build_weapons()
	_build_abilities()
	_build_relics()
	_build_enemies()
	_build_boss_phases()
	_build_rooms()
	_build_dialogues()

func get_default_weapon_for_profile() -> StringName:
	if GameState.meta.unlocked_weapons.has("fallen_greatblade"):
		return &"fallen_greatblade"
	if not GameState.meta.unlocked_weapons.is_empty():
		return StringName(GameState.meta.unlocked_weapons[0])
	return &"fallen_greatblade"

func get_default_oath() -> StringName:
	return &"execution"

func get_style_spec(spec_id: StringName) -> StyleSpecData:
	return style_specs.get(spec_id)

func get_prompt_spec(prompt_id: StringName) -> AssetPromptSpecData:
	return prompt_specs.get(prompt_id)

func get_rig_spec(rig_id: StringName) -> CharacterRigSpecData:
	return rig_specs.get(rig_id)

func get_environment_set(set_id: StringName) -> EnvironmentSetSpecData:
	return environment_sets.get(set_id)

func get_weapon(weapon_id: StringName) -> WeaponData:
	return weapons.get(weapon_id)

func get_weapon_ids() -> Array[String]:
	var result: Array[String] = []
	for key in weapons.keys():
		result.append(str(key))
	return result

func get_ability(ability_id: StringName) -> AbilityData:
	return abilities.get(ability_id)

func get_relic(relic_id: StringName) -> RelicData:
	return relics.get(relic_id)

func get_relic_ids() -> Array[String]:
	var result: Array[String] = []
	for key in relics.keys():
		result.append(str(key))
	return result

func get_enemy(enemy_id: StringName) -> EnemyArchetypeData:
	return enemies.get(enemy_id)

func get_room(room_id: StringName) -> RoomTemplateData:
	return rooms.get(room_id)

func get_side_room_ids() -> Array[String]:
	var result: Array[String] = []
	for key in rooms.keys():
		var room: RoomTemplateData = rooms[key]
		if not room.is_main_path:
			result.append(str(key))
	return result

func get_dialogue_lines(trigger_id: StringName) -> Array[DialogueBeatData]:
	return dialogues.get(trigger_id, [])

func get_oath(oath_id: StringName) -> Dictionary:
	return oaths.get(str(oath_id), oaths["execution"])

func get_boss_phase_set(boss_id: StringName) -> Array[BossPhaseData]:
	return boss_phases.get(boss_id, [])

func _build_styles() -> void:
	var style := StyleSpecData.new()
	style.spec_id = &"black_halo"
	style.title = "Black Halo"
	style.palette = PackedStringArray(["#1b1a20", "#3b3742", "#9a8350", "#7f1d2b", "#7ad7e0", "#e3dbc7"])
	style.material_tokens = PackedStringArray(["scorched steel", "frayed cloth", "stained glass", "ritual metal"])
	style.silhouette_rules = PackedStringArray(["fallen hero asymmetrical", "paladins geometric", "final boss regal and threatening"])
	style.camera_rules = PackedStringArray(["strict side view", "profile readable", "gameplay scale clarity"])
	style.negative_tokens = PackedStringArray(["no cartoon style", "no modern props", "no frontal pose", "no embedded text"])
	style_specs[style.spec_id] = style

func _build_prompt_specs() -> void:
	_register_prompt(&"cael_hero", "character", "A fallen hero in broken ceremonial armor, strict side-view gameplay illustration, fragmented halo, torn cape, oversized cursed greatblade, transparent background.")
	_register_prompt(&"dawn_paladin", "character", "A kingdom paladin in disciplined white-gold armor, strict side-view gameplay enemy silhouette, shield or spear stance, transparent background.")
	_register_prompt(&"seraph_vale", "character", "The successor hero and paladin commander, immaculate armor and sacred cyan halo crown, strict side-view final boss profile, long oath blade, transparent background.")
	_register_prompt(&"ashfall_sector", "environment", "Ruined bastion side-view backdrop modules, scorched stone, torn holy banners, stained light, no characters.")
	_register_prompt(&"reliquary_sector", "environment", "Vertical sanctum side-view backdrop modules, chained relic altars, stone columns, sanctified dust, no characters.")
	_register_prompt(&"mirror_sector", "environment", "Final area sacred side-view backdrop, fractured marble, radiant glass reflections, ritual dais, no characters.")
	_register_prompt(&"hud_frame", "ui", "Liturgical combat HUD frame, dark metal, parchment motifs, sacred seals, transparent background, no readable text.")

func _register_prompt(prompt_id: StringName, asset_type: String, primary_prompt: String) -> void:
	var data := AssetPromptSpecData.new()
	data.prompt_id = prompt_id
	data.asset_type = asset_type
	data.primary_prompt = primary_prompt
	data.variant_rules = PackedStringArray(["strict side view", "layer-ready silhouette", "transparent background preferred"])
	data.negative_prompt_tokens = PackedStringArray(["text", "watermark", "modern props", "front pose"])
	prompt_specs[prompt_id] = data

func _build_rigs() -> void:
	var offsets := {
		"leg_back": Vector2(-14, 26),
		"leg_front": Vector2(10, 28),
		"torso": Vector2(0, -10),
		"head": Vector2(0, -68),
		"cape": Vector2(-26, -22),
		"arm_upper": Vector2(22, -20),
		"arm_lower": Vector2(26, 14),
		"weapon": Vector2(28, 18),
		"aura": Vector2(0, -40),
	}

	var hero := CharacterRigSpecData.new()
	hero.rig_id = &"fallen_hero"
	hero.display_name = "Cael Ashborne"
	hero.part_order = PackedStringArray(["leg_back", "leg_front", "cape", "torso", "head", "arm_upper", "arm_lower", "weapon", "aura"])
	hero.part_texture_paths = _character_layer_paths("cael")
	hero.part_texture_paths["weapon"] = "res://assets/weapons/imagen/cael_greatblade.png"
	hero.part_offsets = offsets
	hero.part_modulates = {
		"default": Color.WHITE,
		"cape": Color.WHITE,
		"aura": Color.WHITE,
		"weapon": Color.WHITE,
	}
	hero.base_scale = 0.9
	rig_specs[hero.rig_id] = hero

	var paladin := CharacterRigSpecData.new()
	paladin.rig_id = &"paladin_knight"
	paladin.display_name = "Dawn Paladin"
	paladin.part_order = hero.part_order
	paladin.part_texture_paths = _character_layer_paths("dawn_paladin")
	paladin.part_texture_paths["weapon"] = "res://assets/weapons/imagen/paladin_spear.png"
	paladin.part_offsets = offsets
	paladin.part_modulates = {
		"default": Color.WHITE,
		"cape": Color.WHITE,
		"aura": Color.WHITE,
		"weapon": Color.WHITE,
	}
	paladin.base_scale = 0.82
	rig_specs[paladin.rig_id] = paladin

	var aurex := CharacterRigSpecData.new()
	aurex.rig_id = &"sir_aurex"
	aurex.display_name = "Sir Aurex"
	aurex.part_order = hero.part_order
	aurex.part_texture_paths = _character_layer_paths("sir_aurex")
	aurex.part_texture_paths["weapon"] = "res://assets/weapons/imagen/aurex_halberd.png"
	aurex.part_offsets = offsets
	aurex.part_modulates = {
		"default": Color.WHITE,
		"cape": Color.WHITE,
		"aura": Color.WHITE,
		"weapon": Color.WHITE,
	}
	aurex.base_scale = 0.96
	rig_specs[aurex.rig_id] = aurex

	var seraph := CharacterRigSpecData.new()
	seraph.rig_id = &"seraph_vale"
	seraph.display_name = "Seraph Vale"
	seraph.part_order = hero.part_order
	seraph.part_texture_paths = _character_layer_paths("seraph_vale")
	seraph.part_texture_paths["weapon"] = "res://assets/weapons/imagen/seraph_blade.png"
	seraph.part_offsets = offsets
	seraph.part_modulates = {
		"default": Color.WHITE,
		"cape": Color.WHITE,
		"aura": Color.WHITE,
		"weapon": Color.WHITE,
	}
	seraph.base_scale = 1.05
	rig_specs[seraph.rig_id] = seraph

func _build_environment_sets() -> void:
	_register_environment(&"ashfall_bastion", "Ashfall Bastion", "ashfall", "res://assets/environments/ashfall/layers/back.png")
	_register_environment(&"reliquary_shaft", "Reliquary Shaft", "reliquary", "res://assets/environments/reliquary/layers/back.png")
	_register_environment(&"mirror_chapel", "Mirror Chapel", "mirror", "res://assets/environments/mirror/layers/back.png")

func _register_environment(set_id: StringName, display_name: String, sector: String, backdrop_path: String) -> void:
	var environment := EnvironmentSetSpecData.new()
	environment.set_id = set_id
	environment.display_name = display_name
	environment.sector = StringName(sector)
	environment.layer_assets = {
		"backdrop": backdrop_path,
		"mid": backdrop_path.replace("/back.png", "/mid.png"),
		"fore": backdrop_path.replace("/back.png", "/fore.png"),
	}
	environment.module_assets = {
		"wall": backdrop_path.replace("/back.png", "/module_wall.png"),
		"window": backdrop_path.replace("/back.png", "/module_window.png"),
		"altar": backdrop_path.replace("/back.png", "/module_altar.png"),
	}
	environment.collision_tags = PackedStringArray(["ground", "platform", "wall"])
	environment.palette = PackedStringArray(["#1b1a20", "#3b3742", "#9a8350"])
	environment_sets[set_id] = environment

func _build_weapons() -> void:
	var greatblade := WeaponData.new()
	greatblade.weapon_id = &"fallen_greatblade"
	greatblade.display_name = "Fallen Greatblade"
	greatblade.description = "A brutal, deliberate blade that rewards spacing and punishes hesitation."
	greatblade.base_damage = 18.0
	greatblade.heavy_damage = 34.0
	greatblade.range = 126.0
	greatblade.stagger = 280.0
	greatblade.gloom_gain = 9.0
	greatblade.attack_cooldown = 0.38
	greatblade.skill_name = "Halo Breaker"
	greatblade.weapon_asset_path = "res://assets/weapons/imagen/cael_greatblade.png"
	weapons[greatblade.weapon_id] = greatblade

	var glaive := WeaponData.new()
	glaive.weapon_id = &"chain_glaive"
	glaive.display_name = "Chain Glaive"
	glaive.description = "A relentless weapon that extends reach and mobility through momentum."
	glaive.base_damage = 14.0
	glaive.heavy_damage = 26.0
	glaive.range = 148.0
	glaive.stagger = 160.0
	glaive.gloom_gain = 10.0
	glaive.attack_cooldown = 0.28
	glaive.skill_name = "Grief Spiral"
	glaive.weapon_asset_path = "res://assets/weapons/imagen/chain_glaive.png"
	weapons[glaive.weapon_id] = glaive

func _character_layer_paths(character_key: String) -> Dictionary:
	return {
		"leg_back": "res://assets/characters/%s/layers/leg_back.png" % character_key,
		"leg_front": "res://assets/characters/%s/layers/leg_front.png" % character_key,
		"torso": "res://assets/characters/%s/layers/torso.png" % character_key,
		"head": "res://assets/characters/%s/layers/head.png" % character_key,
		"cape": "res://assets/characters/%s/layers/cape.png" % character_key,
		"arm_upper": "res://assets/characters/%s/layers/arm_upper.png" % character_key,
		"arm_lower": "res://assets/characters/%s/layers/arm_lower.png" % character_key,
		"aura": "res://assets/characters/%s/layers/aura.png" % character_key,
	}

func _build_abilities() -> void:
	var grapple := AbilityData.new()
	grapple.ability_id = &"chain_grapple"
	grapple.display_name = "Chain Grapple"
	grapple.description = "Latch to sanctified anchors and fling yourself through vertical rooms."
	grapple.gate_tag = &"chain_grapple"
	grapple.unlock_room_id = &"aurex_arena"
	grapple.cooldown = 0.8
	grapple.is_mobility = true
	abilities[grapple.ability_id] = grapple

	var black_wing := AbilityData.new()
	black_wing.ability_id = &"black_wing"
	black_wing.display_name = "Black Wing"
	black_wing.description = "A second jump born from sacrilege and memory."
	black_wing.gate_tag = &"black_wing"
	black_wing.unlock_room_id = &"mirror_choir"
	black_wing.cooldown = 0.0
	black_wing.is_mobility = true
	abilities[black_wing.ability_id] = black_wing

func _build_relics() -> void:
	_register_relic(&"ember_bead", "Ember Bead", "Gain bonus Gloom from successful hits.", {"gloom_bonus": 3.0})
	_register_relic(&"oath_nail", "Oath Nail", "Heavy attacks deal more stagger.", {"stagger_bonus": 40.0})
	_register_relic(&"veil_ribbon", "Veil Ribbon", "Parry window slightly increases.", {"parry_bonus": 0.06})
	_register_relic(&"crypt_salt", "Crypt Salt", "Recover a little health after each cleared room.", {"room_heal": 6.0})
	_register_relic(&"choir_censer", "Choir Censer", "Skill attacks deal bonus damage.", {"skill_bonus": 10.0})

func _register_relic(relic_id: StringName, display_name: String, description: String, modifiers: Dictionary) -> void:
	var relic := RelicData.new()
	relic.relic_id = relic_id
	relic.display_name = display_name
	relic.description = description
	relic.effect_tags = PackedStringArray(modifiers.keys())
	relic.stat_modifiers = modifiers
	relics[relic_id] = relic

func _build_enemies() -> void:
	_register_enemy(&"shield_paladin", "Shield Paladin", "anchor", 55.0, 90.0, 12.0, 90.0, 1.0, &"paladin_knight")
	_register_enemy(&"lancer", "Lancer", "pressure", 42.0, 135.0, 10.0, 118.0, 1.2, &"paladin_knight")
	_register_enemy(&"choir_adept", "Choir Adept", "support", 34.0, 80.0, 9.0, 150.0, 0.9, &"paladin_knight")
	_register_enemy(&"inquisitor", "Inquisitor", "hunter", 48.0, 150.0, 11.0, 108.0, 1.3, &"paladin_knight")
	_register_enemy(&"blessed_hound", "Blessed Hound", "beast", 36.0, 180.0, 8.0, 86.0, 1.5, &"paladin_knight")

func _register_enemy(enemy_id: StringName, display_name: String, role: String, max_health: float, move_speed: float, contact_damage: float, weapon_reach: float, aggression: float, rig_id: StringName) -> void:
	var enemy := EnemyArchetypeData.new()
	enemy.enemy_id = enemy_id
	enemy.display_name = display_name
	enemy.role = role
	enemy.max_health = max_health
	enemy.move_speed = move_speed
	enemy.contact_damage = contact_damage
	enemy.weapon_reach = weapon_reach
	enemy.aggression = aggression
	enemy.palette_key = &"holy"
	enemy.rig_id = rig_id
	enemies[enemy_id] = enemy

func _build_boss_phases() -> void:
	var aurex: Array[BossPhaseData] = []
	aurex.append(_create_phase(&"aurex_phase_1", "Mercy Bound", 1.0, ["march", "shield_bash"], 2.6, 0.0, &"aurex_intro"))
	aurex.append(_create_phase(&"aurex_phase_2", "Mercy Broken", 0.45, ["rush", "halo_break"], 1.8, 0.0, &"aurex_phase_shift"))
	boss_phases[&"sir_aurex"] = aurex

	var seraph: Array[BossPhaseData] = []
	seraph.append(_create_phase(&"seraph_phase_1", "Second Dawn", 1.0, ["measured_slash", "lunge"], 2.2, 0.0, &"seraph_intro"))
	seraph.append(_create_phase(&"seraph_phase_2", "Holy Pursuit", 0.66, ["lunge", "cross_cut"], 1.5, 0.0, &"seraph_phase_shift_1"))
	seraph.append(_create_phase(&"seraph_phase_3", "Radiant Collapse", 0.33, ["halo_burst", "executioner_dash"], 1.2, 0.0, &"seraph_phase_shift_2"))
	boss_phases[&"seraph_vale"] = seraph

func _create_phase(phase_id: StringName, display_name: String, hp_threshold: float, attacks: Array[String], dash_rate: float, projectile_interval: float, dialogue_key: StringName) -> BossPhaseData:
	var phase := BossPhaseData.new()
	phase.phase_id = phase_id
	phase.display_name = display_name
	phase.hp_threshold = hp_threshold
	phase.attack_pattern = PackedStringArray(attacks)
	phase.dash_rate = dash_rate
	phase.projectile_interval = projectile_interval
	phase.dialogue_key = dialogue_key
	return phase

func _build_rooms() -> void:
	_register_room(&"hub_sanctuary", "Wake Ward", &"ashfall", &"hub", true, {"right": {"target": "ashfall_gate", "label": "March into the Bastion", "spawn_tag": "left"}})
	_register_room(&"ashfall_gate", "Ashfall Gate", &"ashfall", &"gate", true, {
		"left": {"target": "hub_sanctuary", "label": "Return to the Ward", "spawn_tag": "right"},
		"right": {"target": "ashfall_rampart", "label": "Advance the Rampart", "spawn_tag": "left"},
		"up": {"target": "fallen_armory", "label": "Side Path: Fallen Armory", "spawn_tag": "down"},
	}, ["shield_paladin"])
	_register_room(&"ashfall_rampart", "Torn Rampart", &"ashfall", &"rampart", true, {
		"left": {"target": "ashfall_gate", "label": "Back to the Gate", "spawn_tag": "right"},
		"right": {"target": "ashfall_crypt", "label": "Descend the Crypt", "spawn_tag": "left"},
		"down": {"target": "banner_ossuary", "label": "Side Path: Banner Ossuary", "spawn_tag": "up"},
	}, ["lancer", "blessed_hound"])
	_register_room(&"ashfall_crypt", "Crypt Threshold", &"ashfall", &"crypt", true, {
		"left": {"target": "ashfall_rampart", "label": "Climb to the Rampart", "spawn_tag": "right"},
		"right": {"target": "reliquary_lift", "label": "Enter the Shaft", "spawn_tag": "left"},
		"down": {"target": "prayer_cistern", "label": "Side Path: Prayer Cistern", "spawn_tag": "up"},
	}, ["shield_paladin", "choir_adept"])
	_register_room(&"reliquary_lift", "Reliquary Lift", &"reliquary", &"lift", true, {
		"left": {"target": "ashfall_crypt", "label": "Return to the Crypt", "spawn_tag": "right"},
		"right": {"target": "aurex_arena", "label": "Face Sir Aurex", "spawn_tag": "left"},
		"up": {"target": "thorns_vault", "label": "Side Path: Thorns Vault", "spawn_tag": "down", "gate": "chain_grapple"},
	}, ["lancer", "inquisitor"])
	_register_room(&"aurex_arena", "Hall of Mercy", &"reliquary", &"arena", true, {
		"left": {"target": "reliquary_lift", "label": "Retreat to the Lift", "spawn_tag": "right"},
		"right": {"target": "reliquary_archive", "label": "Advance to the Archive", "spawn_tag": "left", "gate": "chain_grapple"},
	}, ["sir_aurex"])
	_register_room(&"reliquary_archive", "Reliquary Archive", &"reliquary", &"bridge", true, {
		"left": {"target": "aurex_arena", "label": "Return to Aurex Hall", "spawn_tag": "right"},
		"right": {"target": "mirror_bridge", "label": "Cross the Mirror Bridge", "spawn_tag": "left"},
		"up": {"target": "bell_tower", "label": "Side Path: Bell Tower", "spawn_tag": "down"},
		"down": {"target": "sunken_cells", "label": "Side Path: Sunken Cells", "spawn_tag": "up"},
	}, ["choir_adept", "inquisitor"])
	_register_room(&"mirror_bridge", "Mirror Bridge", &"mirror", &"bridge", true, {
		"left": {"target": "reliquary_archive", "label": "Back to the Archive", "spawn_tag": "right"},
		"right": {"target": "mirror_choir", "label": "Enter the Choir", "spawn_tag": "left"},
		"down": {"target": "scriptorium", "label": "Side Path: Lost Scriptorium", "spawn_tag": "up"},
	}, ["shield_paladin", "lancer", "blessed_hound"])
	_register_room(&"mirror_choir", "Choir of Glass", &"mirror", &"choir", true, {
		"left": {"target": "mirror_bridge", "label": "Return to the Bridge", "spawn_tag": "right"},
		"right": {"target": "seraph_sanctum", "label": "Confront Seraph Vale", "spawn_tag": "left", "gate": "black_wing"},
		"up": {"target": "sealed_roof", "label": "Side Path: Sealed Roof", "spawn_tag": "down", "gate": "black_wing"},
	}, ["choir_adept", "inquisitor"])
	_register_room(&"seraph_sanctum", "Sanctum of the Second Dawn", &"mirror", &"finale", true, {
		"left": {"target": "mirror_choir", "label": "Return to the Choir", "spawn_tag": "right"},
	}, ["seraph_vale"])

	_register_room(&"fallen_armory", "Fallen Armory", &"ashfall", &"armory", false, {"down": {"target": "ashfall_gate", "label": "Back to the Gate", "spawn_tag": "up"}}, ["shield_paladin"], ["ash_cache"])
	_register_room(&"banner_ossuary", "Banner Ossuary", &"ashfall", &"crypt", false, {"up": {"target": "ashfall_rampart", "label": "Back to the Rampart", "spawn_tag": "down"}}, ["blessed_hound"], ["memory_shard"])
	_register_room(&"prayer_cistern", "Prayer Cistern", &"ashfall", &"crypt", false, {"up": {"target": "ashfall_crypt", "label": "Back to the Crypt", "spawn_tag": "down"}}, ["lancer"], ["relic"])
	_register_room(&"thorns_vault", "Thorns Vault", &"reliquary", &"lift", false, {"down": {"target": "reliquary_lift", "label": "Back to the Lift", "spawn_tag": "up"}}, ["inquisitor"], ["ash_cache"])
	_register_room(&"sunken_cells", "Sunken Cells", &"reliquary", &"arena", false, {"up": {"target": "reliquary_archive", "label": "Back to the Archive", "spawn_tag": "down"}}, ["shield_paladin", "choir_adept"], ["relic"])
	_register_room(&"bell_tower", "Bell Tower", &"reliquary", &"bridge", false, {"down": {"target": "reliquary_archive", "label": "Back to the Archive", "spawn_tag": "up"}}, ["lancer"], ["memory_shard"])
	_register_room(&"scriptorium", "Lost Scriptorium", &"mirror", &"bridge", false, {"up": {"target": "mirror_bridge", "label": "Back to the Bridge", "spawn_tag": "down"}}, ["inquisitor"], ["relic"])
	_register_room(&"sealed_roof", "Sealed Roof", &"mirror", &"finale", false, {"down": {"target": "mirror_choir", "label": "Back to the Choir", "spawn_tag": "up"}}, ["blessed_hound", "lancer"], ["ash_cache"])

func _register_room(room_id: StringName, display_name: String, sector: StringName, layout_id: StringName, is_main_path: bool, exits: Dictionary, encounter_ids: Array[String] = [], reward_tags: Array[String] = []) -> void:
	var room := RoomTemplateData.new()
	room.room_id = room_id
	room.display_name = display_name
	room.sector = sector
	room.layout_id = layout_id
	room.is_main_path = is_main_path
	room.exits = exits
	room.encounter_ids = PackedStringArray(encounter_ids)
	room.reward_tags = PackedStringArray(reward_tags)
	room.environment_set_id = _environment_for_sector(sector)
	room.prompt_spec_id = _prompt_for_sector(sector)
	var requirements := {}
	for exit_name in exits.keys():
		var gate_name := str(exits[exit_name].get("gate", ""))
		if gate_name != "":
			requirements[exit_name] = gate_name
	room.gate_requirements = requirements
	rooms[room_id] = room

func _environment_for_sector(sector: StringName) -> StringName:
	match str(sector):
		"ashfall":
			return &"ashfall_bastion"
		"reliquary":
			return &"reliquary_shaft"
		"mirror":
			return &"mirror_chapel"
		_:
			return &"ashfall_bastion"

func _prompt_for_sector(sector: StringName) -> StringName:
	match str(sector):
		"ashfall":
			return &"ashfall_sector"
		"reliquary":
			return &"reliquary_sector"
		"mirror":
			return &"mirror_sector"
		_:
			return &"ashfall_sector"

func _build_dialogues() -> void:
	_register_dialogue(&"hub_intro", "Brother Niv", "The kingdom named you blasphemy. The walls still remember another title.")
	_register_dialogue(&"mara_forge", "Mara Bellwright", "Pick your edge carefully. The bastion forgives nothing.")
	_register_dialogue(&"joren_oath", "Sir Joren", "Every oath is a chain. Choose the one you can bear.")
	_register_dialogue(&"aurex_intro", "Sir Aurex", "Mercy belongs to the obedient. Kneel, and I may make your death brief.")
	_register_dialogue(&"aurex_phase_shift", "Sir Aurex", "Then I will break mercy itself.")
	_register_dialogue(&"aurex_defeat", "Cael Ashborne", "Your mercy was another blade. I will carry the chain onward.")
	_register_dialogue(&"black_wing_unlock", "Memory of Cael", "Even the fallen remember how to rise.")
	_register_dialogue(&"seraph_intro", "Seraph Vale", "They made me in your image. I chose to surpass it.")
	_register_dialogue(&"seraph_phase_shift_1", "Seraph Vale", "You taught the kingdom how to fear. I taught it how to endure.")
	_register_dialogue(&"seraph_phase_shift_2", "Seraph Vale", "Then come, predecessor. Let the second dawn bury the first.")
	_register_dialogue(&"seraph_defeat", "Seraph Vale", "If I fall... do not let them make a third.")

func _register_dialogue(trigger_id: StringName, speaker: String, line: String) -> void:
	var beat := DialogueBeatData.new()
	beat.speaker_id = StringName(speaker)
	beat.trigger_id = trigger_id
	beat.line = line
	beat.run_condition = "always"
	beat.persistence_rule = "repeatable"
	if not dialogues.has(trigger_id):
		dialogues[trigger_id] = []
	dialogues[trigger_id].append(beat)
