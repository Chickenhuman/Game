extends Node

func goto_main() -> void:
	get_tree().change_scene_to_file("res://scenes/main/Main.tscn")

func reload_current() -> void:
	get_tree().reload_current_scene()

