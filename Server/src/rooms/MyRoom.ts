import { Room, Client } from "@colyseus/core";
import { WorldState } from "./schema/WorldState";
import { Ball } from "./schema/Ball";

export class MyRoom extends Room<WorldState> {
  maxClients = 6;

  onCreate (options: any) {
    this.setState(new WorldState());
    this.state.ball = new Ball();
    this.state.ball.in_hold_by_player_id = null;
    this.state.ball.pos_x = 0;
    this.state.ball.pos_y = 0;
    
    this.onMessage("grab_ball", (client, message) => {
      console.log("Player in control by " + client.sessionId + " grabbed ball");
      this.state.ball.in_hold_by_player_id = client.sessionId;
    });

    this.onMessage("goal_scored", (client, message) => {
      console.log("Client " + client.sessionId + " scored a goal for team "  + message["team"] + 
        "\nScore\n" + "Team A: " + this.state.score_team_a + "\tTeam B: " + this.state.score_team_b);
      if (message["team"] === "a") {
        this.state.score_team_a += 1;
      } else {
        this.state.score_team_b += 1;
      }
      this.state.players.forEach((value, key) => {
        value.pos_x = value.spawn_point_x;
        value.pos_y = value.spawn_point_y;
      })
    });

    this.onMessage("died", (client, message) => {
      console.log("Client " + client.sessionId + " died");
      var player = this.state.players.get(client.sessionId);
      this.state.ball.in_hold_by_player_id = null;
      setTimeout(function() {
        player.pos_x = player.spawn_point_x;
        player.pos_y = player.spawn_point_y;
      }, 3000);
    });

    this.onMessage("move", (client, message) => {
      console.log("Player controlled by " + client.sessionId + " new position {x: " + message["pos_x"] + ", y: " + message["pos_y"] + "}");
      var player = this.state.players.get(client.sessionId);
      player.pos_x = message["pos_x"];
      player.pos_y = message["pos_y"];
    })

    this.onMessage("punched", (client, message) => {
      console.log("Player controlled by " + client + " got punched");
      this.state.ball.in_hold_by_player_id = null;
    })
  }

  onJoin (client: Client, options: any) {
    console.log(client.sessionId, "joined!");
    var team;
    if (this.state.num_team_a_members <= this.state.num_team_b_members) {
      team = "a";
    } else {
      team = "b";
    }
    this.state.newPlayer(client.sessionId, options["character"], team);
  }

  onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
    this.state.players.delete(client.sessionId);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
    this.state.players.clear();
    this.state.num_team_a_members = 0;
    this.state.num_team_b_members = 0;
    this.state.score_team_b = 0;
    this.state.score_team_a = 0;
  }

}
