class_name RoomTemplateData
extends Resource

@export var room_id: StringName
@export var display_name := ""
@export var sector: StringName
@export var layout_id: StringName
@export var is_main_path := true
@export var exits: Dictionary = {}
@export var gate_requirements: Dictionary = {}
@export var encounter_ids: PackedStringArray = PackedStringArray()
@export var reward_tags: PackedStringArray = PackedStringArray()
@export var dialogue_id: StringName
@export var environment_set_id: StringName
@export var prompt_spec_id: StringName
