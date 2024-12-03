extends Node

@export var start_button: Button

func _start_game():
	get_tree().change_scene_to_file("res://scenes/game.tscn")


func _ready() -> void:
	start_button.pressed.connect(self._start_game)


func _process(_delta: float) -> void:
	pass
