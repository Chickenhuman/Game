extends Node

var rng := RandomNumberGenerator.new()

func begin_run(seed := -1) -> void:
	if seed < 0:
		seed = int(Time.get_unix_time_from_system()) % 2147483647
	rng.seed = seed

	var new_run := RunState.new()
	new_run.seed = seed
	new_run.max_health = 100.0
	new_run.health = 100.0
	new_run.gloom = 0.0
	new_run.temporary_currency = 0
	new_run.current_room = &"hub_sanctuary"
	new_run.player_spawn_tag = "start"
	new_run.current_weapon = ContentLibrary.get_default_weapon_for_profile()
	new_run.oath = ContentLibrary.get_default_oath()
	new_run.relics = PackedStringArray([_pick_starting_relic()])
	new_run.active_side_rooms = _pick_active_side_rooms()
	new_run.visited_rooms = PackedStringArray(["hub_sanctuary"])
	new_run.claimed_rewards = PackedStringArray()
	GameState.run = new_run
	SaveService.save_game()

func _pick_starting_relic() -> String:
	var relic_ids := ContentLibrary.get_relic_ids()
	return relic_ids[rng.randi_range(0, relic_ids.size() - 1)]

func _pick_active_side_rooms() -> PackedStringArray:
	var pool := ContentLibrary.get_side_room_ids()
	var picked := PackedStringArray()
	var pick_count := min(4, pool.size())
	for _index in range(pick_count):
		var selected_index := rng.randi_range(0, pool.size() - 1)
		picked.append(pool[selected_index])
		pool.remove_at(selected_index)
	return picked

func is_room_active(room_id: StringName) -> bool:
	var room := ContentLibrary.get_room(room_id)
	if room == null:
		return false
	return room.is_main_path or GameState.run.active_side_rooms.has(str(room_id))

func can_enter_room(room_id: StringName) -> bool:
	return is_room_active(room_id)

func travel_to(room_id: StringName, spawn_tag := "start") -> bool:
	if not can_enter_room(room_id):
		return false
	GameState.run.current_room = room_id
	GameState.run.player_spawn_tag = spawn_tag
	if not GameState.run.visited_rooms.has(str(room_id)):
		GameState.run.visited_rooms.append(str(room_id))
	SaveService.save_game()
	return true
