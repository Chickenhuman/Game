class_name BossPhaseData
extends Resource

@export var phase_id: StringName
@export var display_name := ""
@export var hp_threshold := 1.0
@export var attack_pattern: PackedStringArray = PackedStringArray()
@export var dash_rate := 0.0
@export var projectile_interval := 0.0
@export var dialogue_key: StringName
