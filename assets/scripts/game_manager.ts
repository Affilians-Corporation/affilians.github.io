import { _decorator, CircleCollider2D, Component, find, Node, RigidBody, RigidBody2D } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('game_manager')
export class game_manager extends Component {
    private team_a_goals = 0;
    private team_b_goals = 0;
    @property(Node)
    public ball: Node;
    public ball_initial_position;
    private is_goal_scored = false;

    died() {
        this.ball.setParent(find("Canvas"));
        this.ball.setPosition(this.ball_initial_position);
        this.is_goal_scored = true;
    }

    score(team) {
        this.is_goal_scored = true;
        if (team === "a") {
            this.team_a_goals += 1;
        } else if (team === "b") {
            this.team_b_goals += 1;
        }
        this.ball.setParent(find("Canvas"));
        this.ball.setPosition(this.ball_initial_position);
    }

    start() {
        this.ball_initial_position = this.ball.getPosition();
    }

    update(deltaTime: number) {
        //console.log("Ball Initial Position: " + this.ball_initial_position);
        //console.log("Ball Current Position: " + this.ball.getPosition());
        if(this.is_goal_scored) {
            this.ball.setPosition(this.ball_initial_position);
            this.ball.getComponent(CircleCollider2D).enabled = true;
            this.ball.getComponent(RigidBody2D).enabled = true;
            this.is_goal_scored = false;
        }
        if (this.team_a_goals === 3) {
            //console.log("Team A Won");
        }
        if (this.team_b_goals === 3) {
            //console.log("Team B Won");
        }
        //console.log("Time A: " + this.team_a_goals + "\tTime B: " + this.team_b_goals);
    }
}


