extends Node

func _ready() -> void:
	_ensure_action("move_left", [KEY_A, KEY_LEFT], [JOY_BUTTON_DPAD_LEFT])
	_ensure_action("move_right", [KEY_D, KEY_RIGHT], [JOY_BUTTON_DPAD_RIGHT])
	_ensure_action("jump", [KEY_SPACE, KEY_W, KEY_UP], [JOY_BUTTON_A])
	_ensure_action("dash", [KEY_SHIFT, KEY_X], [JOY_BUTTON_B])
	_ensure_action("light_attack", [KEY_J], [JOY_BUTTON_X, JOY_BUTTON_RIGHT_SHOULDER])
	_ensure_action("heavy_attack", [KEY_K], [JOY_BUTTON_Y])
	_ensure_action("skill", [KEY_L], [JOY_BUTTON_RIGHT_TRIGGER])
	_ensure_action("parry", [KEY_I], [JOY_BUTTON_LEFT_SHOULDER])
	_ensure_action("interact", [KEY_E, KEY_ENTER], [JOY_BUTTON_A])
	_ensure_action("pause", [KEY_ESCAPE], [JOY_BUTTON_START])

func _ensure_action(action_name: StringName, keys: Array[int], buttons: Array[int], deadzone := 0.2) -> void:
	if not InputMap.has_action(action_name):
		InputMap.add_action(action_name, deadzone)
	if not InputMap.action_get_events(action_name).is_empty():
		return

	for keycode in keys:
		var event := InputEventKey.new()
		event.physical_keycode = keycode
		InputMap.action_add_event(action_name, event)

	for button_id in buttons:
		var joy_event := InputEventJoypadButton.new()
		joy_event.button_index = button_id
		InputMap.action_add_event(action_name, joy_event)

