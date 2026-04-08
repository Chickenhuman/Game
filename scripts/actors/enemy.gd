class_name EnemyActor
extends CharacterBody2D

const GRAVITY := 1800.0

var archetype: EnemyArchetypeData
var world: WorldController
var player: PlayerActor
var visual := LayeredActor.new()
var health := 40.0
var attack_cooldown := 0.0
var attack_windup := 0.0
var stun_timer := 0.0
var facing := -1.0
var current_pose: StringName = &"idle"

func _ready() -> void:
	add_child(visual)
	var collision := CollisionShape2D.new()
	var shape := CapsuleShape2D.new()
	shape.radius = 18.0
	shape.height = 84.0
	collision.shape = shape
	add_child(collision)

func configure(enemy_data: EnemyArchetypeData, world_ref: WorldController, player_ref: PlayerActor, weapon_override := "") -> void:
	archetype = enemy_data
	world = world_ref
	player = player_ref
	health = archetype.max_health
	var rig := ContentLibrary.get_rig_spec(archetype.rig_id)
	var override_path := weapon_override
	visual.setup_from_rig(rig, override_path)

func _physics_process(delta: float) -> void:
	if archetype == null or player == null:
		return
	attack_cooldown = max(0.0, attack_cooldown - delta)
	attack_windup = max(0.0, attack_windup - delta)
	stun_timer = max(0.0, stun_timer - delta)

	if stun_timer > 0.0:
		velocity.x = move_toward(velocity.x, 0.0, 1800.0 * delta)
		current_pose = &"parry"
	else:
		var distance_to_player := player.global_position - global_position
		facing = sign(distance_to_player.x) if distance_to_player.x != 0 else facing
		if attack_windup > 0.0:
			current_pose = &"attack_light"
			if attack_windup <= 0.05:
				world.resolve_enemy_attack(self, archetype.contact_damage, archetype.weapon_reach)
				attack_windup = 0.0
				attack_cooldown = 1.0 / max(archetype.aggression, 0.2)
		elif abs(distance_to_player.x) <= archetype.weapon_reach and abs(distance_to_player.y) < 120.0 and attack_cooldown <= 0.0:
			attack_windup = 0.34
			current_pose = &"attack_light"
			velocity.x = 0.0
		else:
			velocity.x = sign(distance_to_player.x) * archetype.move_speed
			current_pose = &"idle" if abs(velocity.x) < 8.0 else &"dash"

	if not is_on_floor():
		velocity.y += GRAVITY * delta

	move_and_slide()
	global_position.x = clamp(global_position.x, 40.0, 1560.0)
	if global_position.y > 980.0:
		queue_free()
	visual.animate_pose(current_pose, delta, facing, velocity, 0.0)

func take_hit(amount: float, knockback: float, attacker_position: Vector2, is_heavy: bool) -> void:
	health -= amount
	stun_timer = 0.22 if not is_heavy else 0.38
	velocity.x = -sign(attacker_position.x - global_position.x) * knockback
	current_pose = &"parry"
	if health <= 0.0:
		world.on_enemy_defeated(self)

func on_parried() -> void:
	stun_timer = 0.6
	attack_windup = 0.0
	attack_cooldown = 1.2
	current_pose = &"parry"
