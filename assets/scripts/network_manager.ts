import { _decorator, Component, find, game, instantiate, Node, Prefab, Vec3 } from 'cc';
import Colyseus from "db://colyseus-sdk/colyseus.js";
import { game_manager } from './game_manager';
import { Player } from './player';
const { ccclass, property } = _decorator;

var spawn_point_x
var spawn_point_y

@ccclass('network_manager')
export class network_manager extends Component {
    @property hostname = "20.64.226.102";
    @property port = 2567;
    @property useSSL = false;
    @property({type: Prefab}) cowboy_prefab;
    @property({type: Prefab}) native_prefab;
    @property({type: Prefab}) cyberpunk_prefab;

    client!: Colyseus.Client;
    room!: Colyseus.Room;
    session_id
    
    async connect() {
        console.log("Connecting");
        try {
            this.room = await this.client.joinOrCreate("room01");
            this.room.state.listen("score_team_a", (current, previous) => {
                console.log("Team A Score changed from " + previous + " to " + current);
            });
            this.room.state.listen("score_team_b", (current, previous) => {
                console.log("Team B Score changed from " + previous + " to " + current);
            });
            this.room.state.listen("num_team_a_members", (current, previous) => {
                console.log("Num team A players change from" + previous + " to " + current);
            });
            this.room.state.listen("num_team_ab_members", (current, previous) => {
                console.log("Num team b players change from " + previous + " to " + current);
            })

            console.log("user joined room");
            console.log("users's session id: " + this.room.sessionId)
            console.log("Initial players: ", this.room.state["players"])
            this.room.onStateChange(this.state_change);
            this.session_id = this.room.sessionId
        } catch (e) {
            console.error(e);
        }
    }

    state_change(state) {
        var that = find("GameManager").getComponent(network_manager);
        
        console.log("State Change: " + that.room.sessionId)
        if (that.room != null){
            state["players"].forEach((player, key) => {
                if (key != that.room.sessionId) {
                    var player_node = find("Canvas/" + key)
                    if(player_node != null) {
                        if (player_node.position.x != player["pos_x"] || player_node.position.y != player["pos_y"]){
                            player_node.setPosition(new Vec3(player["pos_x"], player["pos_y"], 0))
                        }
                    }
                }
            });
            console.log(state)
        }
        //console.log("State Changed: ", state)
    }

    start() {
        this.client = new Colyseus.Client(`ws://20.64.226.102:2567`);
        console.log("Client created");
        console.log("Trying to connect to a room");
        (async () => await this.connect())();
    }

    update(deltaTime: number) {
        this.room.state["players"].forEach((player, key) => {
            if (find("Canvas/" + key) === null) {
                const pl = instantiate(this.cowboy_prefab);
                pl.parent = find("Canvas")
                pl.name = key;
                pl.setPosition(player["spawn_point_x"], player["spawn_point_y"], 0)

                if (pl.name != this.room.sessionId) {
                    pl.getChildByName("Camera").active = false;
                }
            }
        })
        if(spawn_point_x === undefined) {
            spawn_point_x = this.room.state["players"].get(this.room.sessionId)["spawn_point_x"]
            spawn_point_y = this.room.state["players"].get(this.room.sessionId)["spawn_point_y"]
        }
        console.log("Spawn Point X: " + spawn_point_x + "\tSpawn Point Y: " + spawn_point_y)
        
        this.room.state["players"].forEach((player, key) => {
            if (key != this.room.sessionId) {
                var player_node = find("Canvas/" + key)
                if(player_node != null) {
                    if (player_node.position.x != player["pos_x"] || player_node.position.y != player["pos_y"]){
                        player_node.setPosition(new Vec3(player["pos_x"], player["pos_y"], 0))
                    }
                }
            }
        });
        //find("GameManager").getComponent(game_manager).ball.setPosition(new Vec3(this.room.state["ball"]["pos_x"], this.room.state["ball"]["pos_y"], 0))
    }
}


