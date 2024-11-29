import { _decorator, CircleCollider2D, Collider2D, Component, Contact2DType, find, IPhysics2DContact, RigidBody2D } from "cc";
import { Holdable } from "./player";
import { game_manager } from "./game_manager";

const {ccclass, property} = _decorator;

@ccclass("Ball")
export class Ball extends Component implements Holdable {
    private died = false;
    private player_got_hit = false;
    start() {}

    got_hit() {
        this.node.setParent(find("Canvas"))
        this.player_got_hit = true;
    }

    onCollision(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        switch (otherCollider.tag) {
            case 5:
                this.node.setParent(find("Canvas"))
                this.died = true
                break
        }
    }

    update() {
        if (this.player_got_hit) {
            this.getComponent(CircleCollider2D).enabled = true;
            this.getComponent(RigidBody2D).enabled = true;
            this.player_got_hit = false;
        }
        if (this.died) {
            this.getComponent(CircleCollider2D).enabled = true;
            this.getComponent(RigidBody2D).enabled = true;
            this.node.setPosition(find("GameManager").getComponent(game_manager).ball_initial_position);
            this.died = false;
        }
        this.node.getComponent(CircleCollider2D).on(Contact2DType.BEGIN_CONTACT, this.onCollision, this);
    }
}