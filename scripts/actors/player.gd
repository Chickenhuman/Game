class_name PlayerActor
extends CharacterBody2D

const MOVE_SPEED := 320.0
const JUMP_FORCE := -680.0
const GRAVITY := 1800.0
const DASH_SPEED := 920.0
const DASH_DURATION := 0.16

var world: WorldController
var visual := LayeredActor.new()
var dash_timer := 0.0
var attack_timer := 0.0
var skill_timer := 0.0
var parry_window := 0.0
var invulnerability_timer := 0.0
var facing := 1.0
var double_jump_available := false
var grapple_target: Vector2
var has_grapple_target := false
var current_pose: StringName = &"idle"

func _ready() -> void:
	add_child(visual)
	var weapon := ContentLibrary.get_weapon(GameState.run.current_weapon)
	visual.setup_from_rig(ContentLibrary.get_rig_spec(&"fallen_hero"), weapon.weapon_asset_path)
	var collision := CollisionShape2D.new()
	var shape := CapsuleShape2D.new()
	shape.radius = 20.0
	shape.height = 92.0
	collision.shape = shape
	add_child(collision)

func _physics_process(delta: float) -> void:
	if world == null:
		return

	_update_timers(delta)

	if has_grapple_target:
		var direction := global_position.direction_to(grapple_target)
		velocity = direction * 900.0
		current_pose = &"dash"
		if global_position.distance_to(grapple_target) < 28.0:
			has_grapple_target = false
		move_and_slide()
		visual.animate_pose(current_pose, delta, facing, velocity, 1.0)
		_sync_run_state()
		return

	if not is_on_floor():
		velocity.y += GRAVITY * delta
	else:
		double_jump_available = GameState.has_ability(&"black_wing")

	var axis := Input.get_axis("move_left", "move_right")
	if axis != 0:
		facing = sign(axis)

	if dash_timer > 0.0:
		velocity.x = facing * DASH_SPEED
		current_pose = &"dash"
	elif attack_timer > 0.0:
		velocity.x = move_toward(velocity.x, 0.0, 1800.0 * delta)
	else:
		velocity.x = move_toward(velocity.x, axis * MOVE_SPEED, 1800.0 * delta)

	if Input.is_action_just_pressed("jump"):
		if is_on_floor():
			velocity.y = JUMP_FORCE
			current_pose = &"jump"
		elif double_jump_available:
			double_jump_available = false
			velocity.y = JUMP_FORCE * 0.92
			current_pose = &"jump"

	if Input.is_action_just_pressed("dash") and dash_timer <= 0.0 and attack_timer <= 0.0:
		dash_timer = DASH_DURATION
		invulnerability_timer = max(invulnerability_timer, DASH_DURATION)

	if Input.is_action_just_pressed("light_attack") and attack_timer <= 0.0 and dash_timer <= 0.0:
		_attack(false)
	if Input.is_action_just_pressed("heavy_attack") and attack_timer <= 0.0 and dash_timer <= 0.0:
		_attack(true)
	if Input.is_action_just_pressed("skill") and skill_timer <= 0.0:
		if GameState.has_ability(&"chain_grapple") and world.try_grapple(self):
			skill_timer = 0.35
		else:
			_skill_attack()
	if Input.is_action_just_pressed("parry"):
		parry_window = 0.26 + float(ContentLibrary.get_oath(GameState.run.oath).get("parry_bonus", 0.0))
		current_pose = &"parry"
	if Input.is_action_just_pressed("interact"):
		world.try_interact(self)

	move_and_slide()
	global_position.x = clamp(global_position.x, 40.0, 1560.0)
	if global_position.y > 980.0:
		world.handle_player_death()

	if attack_timer <= 0.0 and dash_timer <= 0.0 and abs(velocity.x) < 10.0 and is_on_floor():
		current_pose = &"idle"
	elif attack_timer <= 0.0 and dash_timer <= 0.0 and not is_on_floor():
		current_pose = &"jump"

	visual.animate_pose(current_pose, delta, facing, velocity, clamp(GameState.run.gloom / 100.0, 0.0, 1.0))
	_sync_run_state()

func _attack(is_heavy: bool) -> void:
	var weapon := ContentLibrary.get_weapon(GameState.run.current_weapon)
	var oath := ContentLibrary.get_oath(GameState.run.oath)
	var damage := weapon.base_damage if not is_heavy else weapon.heavy_damage
	damage *= float(oath.get("damage_multiplier", 1.0))
	var reach := weapon.range
	if GameState.run.current_weapon == &"chain_glaive":
		reach += 18.0
	attack_timer = weapon.attack_cooldown * (1.35 if is_heavy else 1.0)
	current_pose = &"attack_heavy" if is_heavy else &"attack_light"
	world.perform_player_attack(self, damage, reach, is_heavy, false)

func _skill_attack() -> void:
	if GameState.run.gloom < 30.0:
		world.push_message("Not enough Gloom for a skill attack.")
		return
	GameState.run.gloom = max(0.0, GameState.run.gloom - 30.0)
	skill_timer = 0.8
	attack_timer = 0.24
	current_pose = &"cast"
	var weapon := ContentLibrary.get_weapon(GameState.run.current_weapon)
	world.perform_player_attack(self, weapon.heavy_damage + 18.0, weapon.range + 46.0, true, true)

func gain_gloom(amount: float) -> void:
	var bonus := float(ContentLibrary.get_oath(GameState.run.oath).get("gloom_bonus", 1.0))
	for relic_id in GameState.run.relics:
		var relic := ContentLibrary.get_relic(StringName(relic_id))
		if relic != null:
			bonus += float(relic.stat_modifiers.get("gloom_bonus", 0.0)) / 10.0
	GameState.run.gloom = clamp(GameState.run.gloom + amount * bonus, 0.0, 100.0)

func try_parry(attacker_position: Vector2) -> bool:
	if parry_window <= 0.0:
		return false
	if global_position.distance_to(attacker_position) > 120.0:
		return false
	parry_window = 0.0
	gain_gloom(18.0)
	current_pose = &"parry"
	world.push_message("Parry shattered the holy guard.")
	return true

func take_damage(amount: float, attacker_position: Vector2) -> void:
	if invulnerability_timer > 0.0:
		return
	if try_parry(attacker_position):
		return
	GameState.run.health = max(0.0, GameState.run.health - amount)
	invulnerability_timer = 0.65
	velocity.x = -sign(attacker_position.x - global_position.x) * 260.0
	velocity.y = -220.0
	if GameState.run.health <= 0.0:
		world.handle_player_death()

func trigger_grapple(target: Vector2) -> void:
	grapple_target = target
	has_grapple_target = true
	invulnerability_timer = 0.15
	current_pose = &"dash"

func heal(amount: float) -> void:
	GameState.run.health = min(GameState.run.max_health, GameState.run.health + amount)

func _update_timers(delta: float) -> void:
	dash_timer = max(0.0, dash_timer - delta)
	attack_timer = max(0.0, attack_timer - delta)
	skill_timer = max(0.0, skill_timer - delta)
	parry_window = max(0.0, parry_window - delta)
	invulnerability_timer = max(0.0, invulnerability_timer - delta)

func _sync_run_state() -> void:
	GameState.run.health = clamp(GameState.run.health, 0.0, GameState.run.max_health)
