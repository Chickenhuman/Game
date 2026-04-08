extends Node

const DEFAULT_WEAPON: StringName = &"fallen_greatblade"
const DEFAULT_OATH: StringName = &"execution"

var meta := MetaProgressionState.new()
var run := RunState.new()
var boss_intro_seen: Dictionary = {}

func ensure_profile() -> void:
	if meta.unlocked_weapons.is_empty():
		reset_profile()

func reset_profile() -> void:
	meta = MetaProgressionState.new()
	meta.unlocked_weapons = PackedStringArray([str(DEFAULT_WEAPON), "chain_glaive"])
	meta.story_flags = PackedStringArray(["intro_awake"])
	meta.ash = 25

func start_new_run(seed := -1) -> void:
	ensure_profile()
	RunDirector.begin_run(seed)

func has_ability(ability_id: StringName) -> bool:
	return meta.unlocked_abilities.has(str(ability_id))

func unlock_ability(ability_id: StringName) -> bool:
	if has_ability(ability_id):
		return false
	meta.unlocked_abilities.append(str(ability_id))
	SaveService.save_game()
	return true

func unlock_weapon(weapon_id: StringName) -> bool:
	if meta.unlocked_weapons.has(str(weapon_id)):
		return false
	meta.unlocked_weapons.append(str(weapon_id))
	SaveService.save_game()
	return true

func award_memory_shard(shard_id: StringName) -> void:
	if not meta.memory_shards.has(str(shard_id)):
		meta.memory_shards.append(str(shard_id))
	SaveService.save_game()

func add_ash(amount: int) -> void:
	meta.ash = max(0, meta.ash + amount)

func set_story_flag(flag_id: StringName) -> void:
	if not meta.story_flags.has(str(flag_id)):
		meta.story_flags.append(str(flag_id))

func has_story_flag(flag_id: StringName) -> bool:
	return meta.story_flags.has(str(flag_id))

