import { _decorator, Component, Node } from 'cc';
import Colyseus from "db://colyseus-sdk/colyseus.js";
const { ccclass, property } = _decorator;

@ccclass('network_manager')
export class network_manager extends Component {
    @property hostname = "20.64.226.102";
    @property port = 2567;
    @property useSSL = false;

    client!: Colyseus.Client;
    room!: Colyseus.Room;

    async connect() {
        console.log("Connecting");
        try {
            this.room = await this.client.joinOrCreate("room01");

            console.log("user joined room");
            console.log("users's session id: " + this.room.sessionId);

            this.room.onStateChange((state) => {
                console.log("State has changed, new State: \n" + state);
            });

            this.room.onLeave((code) => {
                console.log("Leaving room with status code: " + code);
            });
        } catch (e) {
            console.error(e);   
        }
    }

    start() {
        this.client = new Colyseus.Client(`ws://${this.hostname}:${this.port}`);
        console.log("Client created");
        console.log("Trying to connect to a room");
        (async () => await this.connect())();
    }

    update(deltaTime: number) {
        
    }
}


