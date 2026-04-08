class_name BlackHaloHUD
extends CanvasLayer

var room_label: Label
var stats_label: Label
var message_label: Label
var hint_label: Label
var message_timer := 0.0

func _ready() -> void:
	var root := Control.new()
	root.set_anchors_preset(Control.PRESET_FULL_RECT)
	add_child(root)

	var frame := TextureRect.new()
	frame.texture = _load_ui_texture(
		"res://assets/ui/imagen/hud_frame.png",
		"res://assets/ui/generated/hud_frame.svg"
	)
	frame.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_COVERED
	frame.modulate = Color(1, 1, 1, 0.75)
	frame.position = Vector2(16, 16)
	frame.size = Vector2(560, 170)
	root.add_child(frame)

	room_label = Label.new()
	room_label.position = Vector2(36, 32)
	room_label.add_theme_font_size_override("font_size", 26)
	root.add_child(room_label)

	stats_label = Label.new()
	stats_label.position = Vector2(36, 72)
	stats_label.add_theme_font_size_override("font_size", 20)
	root.add_child(stats_label)

	hint_label = Label.new()
	hint_label.position = Vector2(36, 132)
	hint_label.add_theme_font_size_override("font_size", 16)
	hint_label.text = "Move: A/D  Jump: Space  Dash: Shift  Attack: J/K  Skill: L  Parry: I  Interact: E"
	root.add_child(hint_label)

	message_label = Label.new()
	message_label.position = Vector2(840, 40)
	message_label.size = Vector2(700, 90)
	message_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
	message_label.add_theme_font_size_override("font_size", 24)
	root.add_child(message_label)

func _process(delta: float) -> void:
	var room := ContentLibrary.get_room(GameState.run.current_room)
	room_label.text = room.display_name if room != null else "Black Halo"
	stats_label.text = "HP %.0f/%.0f   Gloom %.0f   Ash %d   Weapon %s   Oath %s" % [
		GameState.run.health,
		GameState.run.max_health,
		GameState.run.gloom,
		GameState.meta.ash,
		ContentLibrary.get_weapon(GameState.run.current_weapon).display_name,
		str(ContentLibrary.get_oath(GameState.run.oath).get("display_name", "Execution"))
	]
	message_timer = max(0.0, message_timer - delta)
	if message_timer <= 0.0:
		message_label.text = ""

func show_message(text: String, duration := 3.2) -> void:
	message_label.text = text
	message_timer = duration

func _load_ui_texture(primary_path: String, fallback_path: String) -> Texture2D:
	var texture := load(primary_path) as Texture2D
	if texture != null:
		return texture
	return load(fallback_path) as Texture2D
