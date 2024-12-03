class Example extends Phaser.Scene {
    preload() {}

    create() {}
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: Example,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCente: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 200 }
        }
    }
};

const game = new Phaser.Game(config);