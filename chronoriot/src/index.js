class Example extends Phaser.Scene {
    preload() {}

    create() {
        this.scale.startFullscreen();
    }
}

const config = {
    type: Phaser.AUTO,
    scene: Example,
    scale: {
        parent: "game-container",
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