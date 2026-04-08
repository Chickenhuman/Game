class_name RunState
extends Resource

@export var seed := 0
@export var current_room: StringName
@export var health := 100.0
@export var max_health := 100.0
@export var gloom := 0.0
@export var relics: PackedStringArray = PackedStringArray()
@export var visited_rooms: PackedStringArray = PackedStringArray()
@export var defeated_bosses: PackedStringArray = PackedStringArray()
@export var claimed_rewards: PackedStringArray = PackedStringArray()
@export var temporary_currency := 0
@export var active_side_rooms: PackedStringArray = PackedStringArray()
@export var current_weapon: StringName
@export var oath: StringName
@export var player_spawn_tag := "start"

func _to_packed_strings(values: Variant) -> PackedStringArray:
	var result := PackedStringArray()
	for value in values:
		result.append(str(value))
	return result

func to_dict() -> Dictionary:
	return {
		"seed": seed,
		"current_room": str(current_room),
		"health": health,
		"max_health": max_health,
		"gloom": gloom,
		"relics": Array(relics),
		"visited_rooms": Array(visited_rooms),
		"defeated_bosses": Array(defeated_bosses),
		"claimed_rewards": Array(claimed_rewards),
		"temporary_currency": temporary_currency,
		"active_side_rooms": Array(active_side_rooms),
		"current_weapon": str(current_weapon),
		"oath": str(oath),
		"player_spawn_tag": player_spawn_tag,
	}

func from_dict(source: Dictionary) -> void:
	seed = int(source.get("seed", 0))
	current_room = StringName(source.get("current_room", ""))
	health = float(source.get("health", 100.0))
	max_health = float(source.get("max_health", 100.0))
	gloom = float(source.get("gloom", 0.0))
	relics = _to_packed_strings(source.get("relics", []))
	visited_rooms = _to_packed_strings(source.get("visited_rooms", []))
	defeated_bosses = _to_packed_strings(source.get("defeated_bosses", []))
	claimed_rewards = _to_packed_strings(source.get("claimed_rewards", []))
	temporary_currency = int(source.get("temporary_currency", 0))
	active_side_rooms = _to_packed_strings(source.get("active_side_rooms", []))
	current_weapon = StringName(source.get("current_weapon", "fallen_greatblade"))
	oath = StringName(source.get("oath", "execution"))
	player_spawn_tag = str(source.get("player_spawn_tag", "start"))
