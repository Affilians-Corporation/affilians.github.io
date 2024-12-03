const Phaser = require("phaser")
const Initialize = require("./scenes/initialize")
const MainMenu = require("./scenes/main_menu")

const config = {
    type: Phaser.WEBGL,
    parent: "game-container",
    scene: [
        Initialize.Initialize,
        MainMenu.MainMenu
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: window.innerWidth,
        height: window.innerHeight
    },
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 200 }
        }
    }
};

const game = new Phaser.Game(config);