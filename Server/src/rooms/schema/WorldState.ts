import { Schema, Context, type, MapSchema } from "@colyseus/schema";
import { Player } from "./Player";
import { Ball } from "./Ball";

export class WorldState extends Schema {
  @type({map: Player}) players = new MapSchema<Player>();
  @type(Ball) ball: Ball;
  @type("uint8") score_team_a: number = 0;
  @type("uint8") score_team_b: number = 0;
  @type("uint8") num_team_a_members: number = 0;
  @type("uint8") num_team_b_members: number = 0;

  newPlayer (sessionId: string, character: string, team: string) {
    var player = new Player();
    player.sprite = character;
    player.has_ball = false;
    player.team = team;
    var spawn_point = [0, 0];
    if (team === "a") {
      if (this.num_team_a_members === 0) {
        spawn_point[0] = -444.841;
        spawn_point[1] = 270.471;
      } else if (this.num_team_a_members === 1) {
        spawn_point[0] = -371.527;
        spawn_point[1] = 209.045;
      } else if (this.num_team_a_members === 2) {
        spawn_point[0] = -230.842;
        spawn_point[1] = 139.693;
      }
      this.num_team_a_members += 1;
    } else {
      if (this.num_team_a_members === 0) {
        spawn_point[0] = 304.012;
        spawn_point[1] = -20.263;
      } else if (this.num_team_a_members === 1) {
        spawn_point[0] = 192.376;
        spawn_point[1] = -70.249;
      } else if (this.num_team_a_members === 2) {
        spawn_point[0] = 181.653;
        spawn_point[1] = 75.282;
      }
      this.num_team_b_members += 1;
    }
    player.pos_x = spawn_point[0];
    player.pos_y = spawn_point[1];
    player.spawn_point_x = spawn_point[0];
    player.spawn_point_y = spawn_point[1];
    this.players.set(sessionId, player);
  }
}
