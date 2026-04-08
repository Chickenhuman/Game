extends Node2D

var world: WorldController
var hud: BlackHaloHUD

func _ready() -> void:
	GameState.ensure_profile()
	if str(GameState.run.current_room) == "":
		GameState.start_new_run()

	world = WorldController.new()
	add_child(world)

	hud = BlackHaloHUD.new()
	add_child(hud)
	world.bind_hud(hud)
