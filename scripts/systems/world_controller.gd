class_name WorldController
extends Node2D

const ROOM_SIZE := Vector2(1600, 900)

var background_layer := Node2D.new()
var geometry_layer := Node2D.new()
var entity_layer := Node2D.new()
var marker_layer := Node2D.new()
var player: PlayerActor
var hud: BlackHaloHUD
var enemies: Array[EnemyActor] = []
var boss: BossActor
var interactions: Array[Dictionary] = []
var grapple_points: Array[Vector2] = []
var reward_claimed := false

func _ready() -> void:
	add_child(background_layer)
	add_child(geometry_layer)
	add_child(entity_layer)
	add_child(marker_layer)
	_spawn_player()
	load_current_room(GameState.run.player_spawn_tag)

func bind_hud(hud_node: BlackHaloHUD) -> void:
	hud = hud_node

func _spawn_player() -> void:
	player = PlayerActor.new()
	player.world = self
	entity_layer.add_child(player)

func load_current_room(spawn_tag := "start") -> void:
	_clear_room()
	var room := ContentLibrary.get_room(GameState.run.current_room)
	if room == null:
		return

	_build_background(room)
	_build_geometry(room.layout_id)
	_spawn_room_content(room)
	_spawn_interactions(room)
	player.visual.setup_from_rig(ContentLibrary.get_rig_spec(&"fallen_hero"), ContentLibrary.get_weapon(GameState.run.current_weapon).weapon_asset_path)
	player.global_position = _spawn_position(spawn_tag)
	push_message("Entering %s." % room.display_name)
	SaveService.save_game()

func _clear_room() -> void:
	for child in background_layer.get_children():
		child.queue_free()
	for child in geometry_layer.get_children():
		child.queue_free()
	for child in marker_layer.get_children():
		child.queue_free()
	for enemy in enemies:
		if is_instance_valid(enemy):
			enemy.queue_free()
	enemies.clear()
	if boss != null and is_instance_valid(boss):
		boss.queue_free()
	boss = null
	interactions.clear()
	grapple_points.clear()
	reward_claimed = false

func _build_background(room: RoomTemplateData) -> void:
	var environment := ContentLibrary.get_environment_set(room.environment_set_id)
	_add_background_layer(
		str(environment.layer_assets.get("backdrop", "")),
		_fallback_backdrop_path(room.sector),
		ROOM_SIZE * 0.5,
		Vector2(2.3, 2.0),
		Color(1, 1, 1, 0.9)
	)
	_add_background_layer(
		str(environment.layer_assets.get("mid", "")),
		_fallback_backdrop_path(room.sector),
		Vector2(ROOM_SIZE.x * 0.5, ROOM_SIZE.y * 0.53),
		Vector2(2.28, 1.95),
		Color(1, 1, 1, 0.55)
	)
	_add_background_layer(
		str(environment.layer_assets.get("fore", "")),
		_fallback_backdrop_path(room.sector),
		Vector2(ROOM_SIZE.x * 0.5, ROOM_SIZE.y * 0.58),
		Vector2(2.25, 1.9),
		Color(1, 1, 1, 0.28)
	)

func _add_background_layer(
	primary_path: String,
	fallback_path: String,
	position: Vector2,
	layer_scale: Vector2,
	modulate: Color
) -> void:
	var backdrop := Sprite2D.new()
	backdrop.texture = _load_texture_or_fallback(primary_path, fallback_path)
	backdrop.position = position
	backdrop.scale = layer_scale
	backdrop.modulate = modulate
	background_layer.add_child(backdrop)

func _build_geometry(layout_id: StringName) -> void:
	_add_floor(Rect2(0, 760, 1600, 160))
	match str(layout_id):
		"hub":
			_add_platform(Rect2(170, 560, 320, 28))
			_add_platform(Rect2(1090, 530, 280, 28))
		"gate":
			_add_platform(Rect2(620, 570, 360, 28))
		"rampart":
			_add_platform(Rect2(340, 610, 250, 24))
			_add_platform(Rect2(1040, 520, 240, 24))
		"crypt":
			_add_platform(Rect2(690, 560, 240, 26))
		"lift":
			_add_platform(Rect2(260, 560, 220, 24))
			_add_platform(Rect2(1080, 430, 220, 24))
			grapple_points = [Vector2(1160, 290)]
		"bridge":
			_add_platform(Rect2(320, 550, 260, 24))
			_add_platform(Rect2(940, 450, 260, 24))
			if GameState.has_ability(&"chain_grapple"):
				grapple_points = [Vector2(820, 250)]
		"choir":
			_add_platform(Rect2(520, 580, 280, 24))
			_add_platform(Rect2(1080, 350, 240, 24))
			grapple_points = [Vector2(1220, 220)]
		"arena":
			_add_platform(Rect2(320, 520, 220, 22))
			_add_platform(Rect2(1060, 520, 220, 22))
		"finale":
			_add_platform(Rect2(540, 480, 520, 24))
			grapple_points = [Vector2(800, 250)]
		"armory":
			_add_platform(Rect2(980, 530, 240, 24))

	_build_grapple_markers()

func _build_grapple_markers() -> void:
	for point in grapple_points:
		var marker := Polygon2D.new()
		marker.polygon = PackedVector2Array([
			Vector2(0, -18), Vector2(14, 0), Vector2(0, 18), Vector2(-14, 0)
		])
		marker.color = Color("7ad7e0")
		marker.position = point
		marker_layer.add_child(marker)

func _add_floor(rect: Rect2) -> void:
	_add_platform(rect, Color("2a262e"))

func _add_platform(rect: Rect2, tint := Color("332f39")) -> void:
	var body := StaticBody2D.new()
	var collision := CollisionShape2D.new()
	var shape := RectangleShape2D.new()
	shape.size = rect.size
	collision.shape = shape
	collision.position = rect.position + rect.size * 0.5
	body.add_child(collision)

	var poly := Polygon2D.new()
	poly.polygon = PackedVector2Array([
		rect.position,
		rect.position + Vector2(rect.size.x, 0),
		rect.position + rect.size,
		rect.position + Vector2(0, rect.size.y),
	])
	poly.color = tint
	body.add_child(poly)
	geometry_layer.add_child(body)

func _spawn_room_content(room: RoomTemplateData) -> void:
	match str(room.room_id):
		"hub_sanctuary":
			_spawn_hub_npcs()
		"aurex_arena":
			if not GameState.run.defeated_bosses.has(str(room.room_id)):
				_spawn_boss(&"sir_aurex", Vector2(1180, 650))
				play_dialogue(&"aurex_intro")
		"seraph_sanctum":
			if not GameState.run.defeated_bosses.has(str(room.room_id)):
				_spawn_boss(&"seraph_vale", Vector2(1180, 640))
				play_dialogue(&"seraph_intro")
		_:
			var spawns := _encounter_positions(room.layout_id)
			for index in range(room.encounter_ids.size()):
				var encounter_id := StringName(room.encounter_ids[index])
				if str(encounter_id).begins_with("sir_") or encounter_id == &"seraph_vale":
					continue
				var enemy := EnemyActor.new()
				entity_layer.add_child(enemy)
				enemy.global_position = spawns[index % spawns.size()]
				enemy.configure(ContentLibrary.get_enemy(encounter_id), self, player)
				enemies.append(enemy)

func _spawn_hub_npcs() -> void:
	_register_interaction(Vector2(220, 650), "forge", "Mara Bellwright: Cycle weapon")
	_register_interaction(Vector2(1200, 650), "archive", "Brother Niv: Hear memory")
	_register_interaction(Vector2(780, 650), "oath", "Sir Joren: Cycle oath")

func _spawn_boss(boss_id: StringName, position: Vector2) -> void:
	boss = BossActor.new()
	entity_layer.add_child(boss)
	boss.global_position = position
	boss.configure_boss(boss_id, self, player)

func _spawn_interactions(room: RoomTemplateData) -> void:
	for exit_name in room.exits.keys():
		var exit_data: Dictionary = room.exits[exit_name]
		var target := StringName(exit_data.get("target", ""))
		if not RunDirector.is_room_active(target):
			continue
		var label := str(exit_data.get("label", target))
		var gate := StringName(exit_data.get("gate", ""))
		var position := _door_position(exit_name)
		_register_interaction(position, "door", label, {
			"target": target,
			"spawn_tag": str(exit_data.get("spawn_tag", "start")),
			"gate": gate,
		})

	if room.room_id == &"mirror_choir" and not GameState.has_ability(&"black_wing"):
		_register_interaction(Vector2(1180, 290), "altar", "Claim Black Wing")

	if not room.reward_tags.is_empty() and not reward_claimed and not GameState.run.claimed_rewards.has(str(room.room_id)):
		_register_interaction(Vector2(800, 650), "reward", "Claim room reward")

func _register_interaction(position: Vector2, kind: String, label: String, payload := {}) -> void:
		var marker := Node2D.new()
		marker.position = position
		var sigil := Sprite2D.new()
		sigil.texture = _load_texture_or_fallback(
			"res://assets/ui/imagen/black_halo_sigil.png",
			"res://assets/ui/generated/black_halo_sigil.svg"
		)
		sigil.scale = Vector2(0.12, 0.12)
		sigil.modulate = Color(1, 1, 1, 0.5)
	marker.add_child(sigil)
	var text := Label.new()
	text.position = Vector2(-120, -48)
	text.size = Vector2(260, 40)
	text.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	text.text = label
	marker.add_child(text)
	marker_layer.add_child(marker)
	interactions.append({"kind": kind, "label": label, "position": position, "payload": payload, "marker": marker})

func try_interact(actor: PlayerActor) -> void:
	var nearest := {}
	var nearest_distance := 999999.0
	for interaction in interactions:
		var distance := actor.global_position.distance_to(interaction.get("position", Vector2.ZERO))
		if distance < 120.0 and distance < nearest_distance:
			nearest = interaction
			nearest_distance = distance
	if nearest.is_empty():
		return

	var nearest_kind := str(nearest.get("kind", ""))
	var payload: Dictionary = nearest.get("payload", {})
	match nearest_kind:
		"door":
			var gate: StringName = payload.get("gate", &"")
			if str(gate) != "" and not GameState.has_ability(gate):
				push_message("Locked by %s." % ContentLibrary.get_ability(gate).display_name)
				return
			if RunDirector.travel_to(payload.get("target", &""), payload.get("spawn_tag", "start")):
				load_current_room(payload.get("spawn_tag", "start"))
		"forge":
			_cycle_weapon()
			play_dialogue(&"mara_forge")
		"archive":
			play_dialogue(&"hub_intro")
			push_message("Memory shards recovered: %d." % GameState.meta.memory_shards.size())
		"oath":
			_cycle_oath()
			play_dialogue(&"joren_oath")
		"altar":
			if GameState.unlock_ability(&"black_wing"):
				play_dialogue(&"black_wing_unlock")
				push_message("Black Wing unlocked. Double jump awakened.")
		"reward":
			_claim_room_reward()

func try_grapple(actor: PlayerActor) -> bool:
	if not GameState.has_ability(&"chain_grapple") or grapple_points.is_empty():
		return false
	var nearest := grapple_points[0]
	var nearest_distance := actor.global_position.distance_to(nearest)
	for point in grapple_points:
		var distance := actor.global_position.distance_to(point)
		if distance < nearest_distance:
			nearest = point
			nearest_distance = distance
	if nearest_distance > 340.0:
		return false
	actor.trigger_grapple(nearest)
	push_message("Chain Grapple ignites.")
	return true

func perform_player_attack(actor: PlayerActor, damage: float, reach: float, is_heavy: bool, is_skill: bool) -> void:
	var hit_count := 0
	for enemy in enemies:
		if not is_instance_valid(enemy):
			continue
		var to_enemy := enemy.global_position - actor.global_position
		if sign(to_enemy.x) == sign(actor.facing) and actor.global_position.distance_to(enemy.global_position) <= reach:
			enemy.take_hit(damage + _relic_damage_bonus(is_skill), 220.0 if not is_heavy else 340.0, actor.global_position, is_heavy)
			hit_count += 1

	if boss != null and is_instance_valid(boss) and actor.global_position.distance_to(boss.global_position) <= reach + 20.0:
		boss.take_hit(damage + _relic_damage_bonus(is_skill), 260.0 if not is_heavy else 360.0, actor.global_position, is_heavy)
		hit_count += 1

	if hit_count > 0:
		actor.gain_gloom(ContentLibrary.get_weapon(GameState.run.current_weapon).gloom_gain * hit_count)

func _relic_damage_bonus(is_skill: bool) -> float:
	var bonus := 0.0
	for relic_id in GameState.run.relics:
		var relic := ContentLibrary.get_relic(StringName(relic_id))
		if relic == null:
			continue
		if is_skill:
			bonus += float(relic.stat_modifiers.get("skill_bonus", 0.0))
	return bonus

func resolve_enemy_attack(attacker: EnemyActor, damage: float, reach: float) -> void:
	if player == null:
		return
	if player.global_position.distance_to(attacker.global_position) > reach + 24.0:
		return
	if player.try_parry(attacker.global_position):
		attacker.on_parried()
		return
	player.take_damage(damage, attacker.global_position)

func resolve_area_burst(origin: Vector2, radius: float, damage: float) -> void:
	if player == null:
		return
	if player.global_position.distance_to(origin) <= radius:
		player.take_damage(damage, origin)
	push_message("Radiant collapse erupts from the sanctum floor.")

func on_enemy_defeated(enemy: EnemyActor) -> void:
	if enemy == boss:
		_handle_boss_defeat()
		return
	GameState.add_ash(5)
	enemy.queue_free()
	enemies.erase(enemy)
	if enemies.is_empty():
		_handle_room_clear()

func _handle_room_clear() -> void:
	for relic_id in GameState.run.relics:
		var relic := ContentLibrary.get_relic(StringName(relic_id))
		if relic != null:
			player.heal(float(relic.stat_modifiers.get("room_heal", 0.0)))
	push_message("Room cleared.")

func _handle_boss_defeat() -> void:
	if boss == null:
		return
	var current_room_id := GameState.run.current_room
	GameState.add_ash(30)
	GameState.run.defeated_bosses.append(str(current_room_id))
	if current_room_id == &"aurex_arena":
		play_dialogue(&"aurex_defeat")
		if GameState.unlock_ability(&"chain_grapple"):
			push_message("Chain Grapple unlocked.")
	elif current_room_id == &"seraph_sanctum":
		play_dialogue(&"seraph_defeat")
		GameState.set_story_flag(&"seraph_defeated")
		push_message("Seraph Vale has fallen. The cycle breaks for now.")
	boss.queue_free()
	boss = null
	SaveService.save_game()

func _claim_room_reward() -> void:
	if reward_claimed:
		return
	if GameState.run.claimed_rewards.has(str(GameState.run.current_room)):
		return
	if not enemies.is_empty() or boss != null:
		push_message("Defeat the room's defenders before claiming its reward.")
		return
	reward_claimed = true
	var room := ContentLibrary.get_room(GameState.run.current_room)
	for tag in room.reward_tags:
		match str(tag):
			"ash_cache":
				GameState.add_ash(20)
				push_message("Recovered 20 Ash.")
			"memory_shard":
				var shard_id := "%s_memory" % room.room_id
				GameState.award_memory_shard(StringName(shard_id))
				push_message("Recovered a memory shard.")
			"relic":
				var relic_id := ContentLibrary.get_relic_ids().pick_random()
				if not GameState.run.relics.has(relic_id):
					GameState.run.relics.append(relic_id)
				push_message("Relic claimed: %s." % ContentLibrary.get_relic(StringName(relic_id)).display_name)
	GameState.run.claimed_rewards.append(str(GameState.run.current_room))
	SaveService.save_game()

func handle_player_death() -> void:
	push_message("Cael falls. The sanctuary calls him back.")
	GameState.add_ash(-10)
	GameState.start_new_run()
	load_current_room("start")

func play_dialogue(trigger_id: StringName) -> void:
	var lines := ContentLibrary.get_dialogue_lines(trigger_id)
	if lines.is_empty():
		return
	var beat: DialogueBeatData = lines[0]
	push_message("%s: %s" % [beat.speaker_id, beat.line], 4.8)

func push_message(text: String, duration := 3.0) -> void:
	if hud != null:
		hud.show_message(text, duration)

func _spawn_position(spawn_tag: String) -> Vector2:
	match spawn_tag:
		"left":
			return Vector2(150, 650)
		"right":
			return Vector2(1450, 650)
		"up":
			return Vector2(800, 210)
		"down":
			return Vector2(800, 660)
		_:
			return Vector2(220, 650)

func _door_position(exit_name: String) -> Vector2:
	match str(exit_name):
		"left":
			return Vector2(90, 650)
		"right":
			return Vector2(1510, 650)
		"up":
			return Vector2(800, 170)
		"down":
			return Vector2(800, 725)
		_:
			return Vector2(800, 650)

func _encounter_positions(layout_id: StringName) -> Array[Vector2]:
	match str(layout_id):
		"rampart":
			return [Vector2(960, 650), Vector2(1240, 650), Vector2(1120, 480)]
		"crypt":
			return [Vector2(940, 650), Vector2(780, 520)]
		"lift":
			return [Vector2(860, 650), Vector2(1110, 400)]
		"bridge":
			return [Vector2(880, 650), Vector2(1080, 400), Vector2(1240, 650)]
		"choir":
			return [Vector2(760, 650), Vector2(1120, 320)]
		"arena":
			return [Vector2(920, 650), Vector2(1120, 650)]
		_:
			return [Vector2(980, 650), Vector2(1200, 650), Vector2(1340, 650)]

func _cycle_weapon() -> void:
	var ids := ContentLibrary.get_weapon_ids()
	var current_index := ids.find(str(GameState.run.current_weapon))
	if current_index == -1:
		current_index = 0
	var next_id := ids[(current_index + 1) % ids.size()]
	if not GameState.meta.unlocked_weapons.has(next_id):
		next_id = ids[0]
	GameState.run.current_weapon = StringName(next_id)
	player.visual.setup_from_rig(ContentLibrary.get_rig_spec(&"fallen_hero"), ContentLibrary.get_weapon(GameState.run.current_weapon).weapon_asset_path)
	push_message("Weapon switched to %s." % ContentLibrary.get_weapon(GameState.run.current_weapon).display_name)
	SaveService.save_game()

func _cycle_oath() -> void:
	var ids := ["execution", "pursuit", "silence"]
	var current_index := ids.find(str(GameState.run.oath))
	var next_id := ids[(current_index + 1) % ids.size()]
	GameState.run.oath = StringName(next_id)
	push_message("Oath sworn: %s." % str(ContentLibrary.get_oath(GameState.run.oath).get("display_name", "Execution")))
	SaveService.save_game()

func _fallback_backdrop_path(sector: StringName) -> String:
	match str(sector):
		"ashfall":
			return "res://assets/environments/generated/ashfall_backdrop.svg"
		"reliquary":
			return "res://assets/environments/generated/reliquary_backdrop.svg"
		"mirror":
			return "res://assets/environments/generated/mirror_backdrop.svg"
		_:
			return "res://assets/environments/generated/ashfall_backdrop.svg"

func _load_texture_or_fallback(primary_path: String, fallback_path: String) -> Texture2D:
	var texture := load(primary_path) as Texture2D
	if texture != null:
		return texture
	return load(fallback_path) as Texture2D
