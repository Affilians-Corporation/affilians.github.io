const phaser = require("phaser")

var canvas = document.getElementById("game-container")

export class Initialize extends Phaser.Scene {
    constructor() {
        super("Initialize")
    }

    preload() {
        canvas.addEventListener("click", () => {
            canvas.requestFullscreen()
        })
        console.log("Initializing the game")
    }

    create() {
        this.scene.launch("MainMenu")
    }
}