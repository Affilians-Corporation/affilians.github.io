import Phaser, { Physics } from "phaser"
class Example extends Phaser.Scene {
    preload () {
        this.load.setBaseURL("https://affilians.com.br/chronoriot")
    }

    create () {
        
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: Example,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    }
};

const game = new Phaser.Game(config);