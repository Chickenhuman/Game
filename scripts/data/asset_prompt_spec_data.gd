class_name AssetPromptSpecData
extends Resource

@export var prompt_id: StringName
@export var asset_type := ""
@export_multiline var primary_prompt := ""
@export var variant_rules: PackedStringArray = PackedStringArray()
@export var negative_prompt_tokens: PackedStringArray = PackedStringArray()
@export var aspect_ratio := "16:9"
@export var reference_tags: PackedStringArray = PackedStringArray()
