const Phaser = require("phaser")

export class MainMenu extends Phaser.Scene {
    constructor() {
        super("MainMenu")
    }

    preload() {
        console.log("Welcome to the MainMenu")
    }

    create() { }
}