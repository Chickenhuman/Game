class_name MetaProgressionState
extends Resource

@export var unlocked_abilities: PackedStringArray = PackedStringArray()
@export var unlocked_weapons: PackedStringArray = PackedStringArray()
@export var hub_upgrades: PackedStringArray = PackedStringArray()
@export var memory_shards: PackedStringArray = PackedStringArray()
@export var story_flags: PackedStringArray = PackedStringArray()
@export var ash := 0

func _to_packed_strings(values: Variant) -> PackedStringArray:
	var result := PackedStringArray()
	for value in values:
		result.append(str(value))
	return result

func to_dict() -> Dictionary:
	return {
		"unlocked_abilities": Array(unlocked_abilities),
		"unlocked_weapons": Array(unlocked_weapons),
		"hub_upgrades": Array(hub_upgrades),
		"memory_shards": Array(memory_shards),
		"story_flags": Array(story_flags),
		"ash": ash,
	}

func from_dict(source: Dictionary) -> void:
	unlocked_abilities = _to_packed_strings(source.get("unlocked_abilities", []))
	unlocked_weapons = _to_packed_strings(source.get("unlocked_weapons", []))
	hub_upgrades = _to_packed_strings(source.get("hub_upgrades", []))
	memory_shards = _to_packed_strings(source.get("memory_shards", []))
	story_flags = _to_packed_strings(source.get("story_flags", []))
	ash = int(source.get("ash", 0))
