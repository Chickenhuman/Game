class_name LayeredActor
extends Node2D

var rig_spec: CharacterRigSpecData
var pivots: Dictionary = {}
var sprites: Dictionary = {}
var elapsed := 0.0

func setup_from_rig(spec: CharacterRigSpecData, weapon_override := "") -> void:
	rig_spec = spec
	for child in get_children():
		child.queue_free()
	pivots.clear()
	sprites.clear()

	var root_parts := ["leg_back", "leg_front", "cape", "torso", "aura"]
	for part_name in spec.part_order:
		var pivot := Node2D.new()
		pivot.name = str(part_name)
		pivot.position = spec.part_offsets.get(part_name, Vector2.ZERO)
		if part_name in ["head", "arm_upper"]:
			pivots["torso"].add_child(pivot)
		elif part_name == "arm_lower":
			pivots["arm_upper"].add_child(pivot)
		elif part_name == "weapon":
			pivots["arm_lower"].add_child(pivot)
		else:
			add_child(pivot)
		pivots[part_name] = pivot

		var texture_path := str(spec.part_texture_paths.get(part_name, ""))
		if part_name == "weapon" and weapon_override != "":
			texture_path = weapon_override
		var sprite := Sprite2D.new()
		sprite.centered = true
		sprite.texture = _load_texture_with_fallback(texture_path, str(part_name))
		sprite.scale = Vector2.ONE * spec.base_scale
		var color_key := "default"
		if spec.part_modulates.has(part_name):
			color_key = part_name
		sprite.modulate = spec.part_modulates.get(color_key, Color.WHITE)
		pivot.add_child(sprite)
		sprites[part_name] = sprite

	for part_name in root_parts:
		if pivots.has(part_name):
			move_child(pivots[part_name], root_parts.find(part_name))

func animate_pose(state_name: StringName, delta: float, facing := 1.0, velocity := Vector2.ZERO, emphasis := 0.0) -> void:
	if rig_spec == null:
		return
	elapsed += delta
	scale.x = facing

	var swing := sin(elapsed * 10.0) * clamp(abs(velocity.x) / 320.0, 0.0, 1.0)
	var bob := sin(elapsed * 4.0) * 2.0

	_reset_pose()
	if pivots.has("torso"):
		pivots["torso"].position.y += bob
	if pivots.has("head"):
		pivots["head"].rotation = deg_to_rad(-4.0 + bob * 0.3)
	if pivots.has("cape"):
		pivots["cape"].rotation = deg_to_rad(-10.0 - swing * 12.0)
	if pivots.has("leg_back"):
		pivots["leg_back"].rotation = deg_to_rad(-swing * 18.0)
	if pivots.has("leg_front"):
		pivots["leg_front"].rotation = deg_to_rad(swing * 18.0)
	if pivots.has("arm_upper"):
		pivots["arm_upper"].rotation = deg_to_rad(8.0 - swing * 10.0)
	if pivots.has("arm_lower"):
		pivots["arm_lower"].rotation = deg_to_rad(18.0)

	match str(state_name):
		"jump":
			pivots["leg_back"].rotation = deg_to_rad(12.0)
			pivots["leg_front"].rotation = deg_to_rad(-18.0)
			pivots["cape"].rotation = deg_to_rad(-28.0)
		"dash":
			pivots["torso"].rotation = deg_to_rad(-14.0)
			pivots["arm_upper"].rotation = deg_to_rad(-55.0)
			pivots["arm_lower"].rotation = deg_to_rad(-30.0)
		"attack_light":
			pivots["arm_upper"].rotation = deg_to_rad(-46.0 - emphasis * 10.0)
			pivots["arm_lower"].rotation = deg_to_rad(72.0)
			pivots["torso"].rotation = deg_to_rad(-8.0)
		"attack_heavy":
			pivots["arm_upper"].rotation = deg_to_rad(-74.0 - emphasis * 12.0)
			pivots["arm_lower"].rotation = deg_to_rad(98.0)
			pivots["torso"].rotation = deg_to_rad(-16.0)
			pivots["cape"].rotation = deg_to_rad(-36.0)
		"parry":
			pivots["arm_upper"].rotation = deg_to_rad(-18.0)
			pivots["arm_lower"].rotation = deg_to_rad(44.0)
			pivots["torso"].rotation = deg_to_rad(8.0)
		"cast":
			pivots["arm_upper"].rotation = deg_to_rad(-24.0)
			pivots["arm_lower"].rotation = deg_to_rad(24.0)
			if sprites.has("aura"):
				sprites["aura"].modulate.a = 0.95
		"idle":
			pass

func _reset_pose() -> void:
	for pivot_name in pivots.keys():
		pivots[pivot_name].rotation = 0.0
	if sprites.has("aura"):
		sprites["aura"].modulate.a = 0.35

func _load_texture_with_fallback(texture_path: String, part_name: String) -> Texture2D:
	var texture := load(texture_path) as Texture2D
	if texture != null:
		return texture

	if part_name == "weapon":
		var generated_path := texture_path.replace("/imagen/", "/generated/").replace(".png", ".svg")
		return load(generated_path) as Texture2D

	var fallback_path := "res://assets/characters/generated/common/%s.svg" % part_name
	return load(fallback_path) as Texture2D
