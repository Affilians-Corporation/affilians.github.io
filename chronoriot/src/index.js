function requestFullScreen(element) {
    var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;

    if (requestMethod) {
        requestMethod.call(element);
    } else if (typeof window.ActiveXObject !== "undefined") {
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
}

requestFullScreen(document.getElementById("game-container"))

class Example extends Phaser.Scene {
    preload() {}

    create() {}
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