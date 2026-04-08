class_name BossActor
extends EnemyActor

var boss_id: StringName
var phases: Array[BossPhaseData] = []
var current_phase_index := 0
var special_cooldown := 1.4

func configure_boss(id: StringName, world_ref: WorldController, player_ref: PlayerActor) -> void:
	boss_id = id
	phases = ContentLibrary.get_boss_phase_set(id)
	var archetype_id: StringName = &"inquisitor"
	var rig_id: StringName = &"paladin_knight"
	var weapon_path := "res://assets/weapons/imagen/paladin_spear.png"
	if id == &"sir_aurex":
		archetype_id = &"shield_paladin"
		rig_id = &"sir_aurex"
		weapon_path = "res://assets/weapons/imagen/aurex_halberd.png"
	if id == &"seraph_vale":
		archetype_id = &"inquisitor"
		rig_id = &"seraph_vale"
		weapon_path = "res://assets/weapons/imagen/seraph_blade.png"
	var data := ContentLibrary.get_enemy(archetype_id)
	data = data.duplicate()
	data.rig_id = rig_id
	data.max_health = 210.0 if id == &"sir_aurex" else 330.0
	data.move_speed = 130.0 if id == &"sir_aurex" else 165.0
	data.weapon_reach = 120.0 if id == &"sir_aurex" else 145.0
	data.contact_damage = 15.0 if id == &"sir_aurex" else 18.0
	super.configure(data, world_ref, player_ref, weapon_path)

func _physics_process(delta: float) -> void:
	_update_phase()
	super._physics_process(delta)
	if health <= 0.0:
		return
	special_cooldown = max(0.0, special_cooldown - delta)
	if special_cooldown <= 0.0 and player != null and stun_timer <= 0.0:
		match current_phase_index:
			0:
				velocity.x = facing * 460.0
				world.resolve_enemy_attack(self, archetype.contact_damage + 4.0, archetype.weapon_reach + 24.0)
				special_cooldown = phases[current_phase_index].dash_rate
			1:
				velocity.x = facing * 620.0
				world.resolve_enemy_attack(self, archetype.contact_damage + 7.0, archetype.weapon_reach + 40.0)
				special_cooldown = phases[current_phase_index].dash_rate
			2:
				world.resolve_area_burst(self.global_position, 250.0, archetype.contact_damage + 10.0)
				current_pose = &"cast"
				special_cooldown = phases[current_phase_index].dash_rate

func _update_phase() -> void:
	if phases.is_empty():
		return
	var hp_ratio := health / max(archetype.max_health, 1.0)
	var new_index := current_phase_index
	for index in range(phases.size()):
		if hp_ratio <= phases[index].hp_threshold:
			new_index = index
	if new_index != current_phase_index:
		current_phase_index = new_index
		world.play_dialogue(phases[current_phase_index].dialogue_key)
		world.push_message("%s enters %s." % [boss_id, phases[current_phase_index].display_name])
