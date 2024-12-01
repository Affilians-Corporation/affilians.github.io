import { Scene, Types } from "phaser"
class Example extends Scene {
    preload () {
        this.load.setBaseURL("https://affilians.com.br/chronoriot")
    }

    create () {

    }
}

const config: Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: Example,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: -0, y: 200 }
        }
    }
};

const game = new Phaser.Game(config);