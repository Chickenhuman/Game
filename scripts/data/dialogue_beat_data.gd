class_name DialogueBeatData
extends Resource

@export var speaker_id: StringName
@export var trigger_id: StringName
@export_multiline var line := ""
@export var run_condition := "always"
@export var persistence_rule := "once"
