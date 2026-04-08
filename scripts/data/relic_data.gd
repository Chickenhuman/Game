class_name RelicData
extends Resource

@export var relic_id: StringName
@export var display_name := ""
@export var description := ""
@export var rarity := "common"
@export var slot_cost := 1
@export var effect_tags: PackedStringArray = PackedStringArray()
@export var stat_modifiers: Dictionary = {}
