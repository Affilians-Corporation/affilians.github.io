const Phaser = require("phaser")
const Scene = Phaser.Scene
const Scale = Phaser.Scale

class Example extends Scene {
    preload() {
        this.scale.startFullscreen()
    }

    create() {
        
    }
}

const config = {
    type: Phaser.AUTO,
    scene: Example,
    scale: {
        parent: "game-container",
        mode: Scale.FIT,
        autoCenter: Scale.CENTER_BOTH,
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