class_name CharacterRigSpecData
extends Resource

@export var rig_id: StringName
@export var display_name := ""
@export var part_order: PackedStringArray = PackedStringArray()
@export var part_texture_paths: Dictionary = {}
@export var part_offsets: Dictionary = {}
@export var part_modulates: Dictionary = {}
@export var base_scale := 1.0
@export var weapon_socket := Vector2.ZERO
@export var vfx_socket := Vector2.ZERO
