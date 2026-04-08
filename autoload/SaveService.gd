extends Node

const SAVE_PATH := "user://black_halo_save.json"

func _ready() -> void:
	GameState.reset_profile()
	load_game()

func save_game() -> void:
	var payload := {
		"meta": GameState.meta.to_dict(),
		"run": GameState.run.to_dict(),
	}

	var temp_path := "%s.tmp" % SAVE_PATH
	var file := FileAccess.open(temp_path, FileAccess.WRITE)
	if file == null:
		return
	file.store_string(JSON.stringify(payload, "\t"))
	file.flush()
	file.close()

	var dir := DirAccess.open("user://")
	if dir == null:
		return
	if dir.file_exists(SAVE_PATH.get_file()):
		dir.remove(SAVE_PATH.get_file())
	dir.rename(temp_path.get_file(), SAVE_PATH.get_file())

func load_game() -> void:
	if not FileAccess.file_exists(SAVE_PATH):
		save_game()
		return

	var file := FileAccess.open(SAVE_PATH, FileAccess.READ)
	if file == null:
		return
	var parsed := JSON.parse_string(file.get_as_text())
	if typeof(parsed) != TYPE_DICTIONARY:
		return

	GameState.meta = MetaProgressionState.new()
	GameState.meta.from_dict(parsed.get("meta", {}))
	GameState.run = RunState.new()
	GameState.run.from_dict(parsed.get("run", {}))
	GameState.ensure_profile()

