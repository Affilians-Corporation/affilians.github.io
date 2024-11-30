import { _decorator, BoxCollider2D, CircleCollider2D, Collider2D, Component, Contact2DType, ECollider2DType, ERigidBody2DType, IPhysics2DContact, Node, RigidBody2D, Vec2 } from 'cc';
import { Player } from './player';
const { ccclass, property } = _decorator;

@ccclass('player_force')
export class player_force extends Component {
    @property({type: Node})
    private thisPlayer;
    applyForce(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (otherCollider.getComponent(RigidBody2D).type != ERigidBody2DType.Static && otherCollider != this.thisPlayer.getComponent(BoxCollider2D)) {
            console.log("Contacted: " + otherCollider.tag)
            console.log("Player Velocity: " + this.thisPlayer.getComponent(RigidBody2D).linearVelocity)
            var deltaPos = new Vec2(selfCollider.node.position.x - otherCollider.node.position.x, selfCollider.node.position.y - otherCollider.node.position.y);
            console.log(deltaPos)
            var velocity_x;
            if (selfCollider.node.getWorldPosition().x < otherCollider.node.getWorldPosition().x ) {
                velocity_x = -10;
            } else {
                velocity_x = 10;
            }
            var velocity_y = Math.abs(5);
            otherCollider.getComponent(RigidBody2D).applyLinearImpulseToCenter(new Vec2(velocity_x, velocity_y), true)
        }
    }

    start() {
        this.getComponent(CircleCollider2D).on(Contact2DType.BEGIN_CONTACT, this.applyForce, this);
    }

    update(deltaTime: number) {
        console.log("Force Activated")
    }
}


