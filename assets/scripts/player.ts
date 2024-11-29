import { _decorator, BoxCollider2D, CircleCollider2D, Component, PhysicsSystem, PhysicsSystem2D, Rect, RigidBody2D, RigidBodyComponent, Vec2, Vec3, Node, Contact2DType, Collider2D, IPhysics2DContact, ERigidBody2DType, Camera, Color, Scene, find, Sprite, SpriteFrame } from "cc";
import { player_force } from "./player_force";
import { Ball } from "./ball";
import { game_manager } from "./game_manager";
import { network_manager } from "./network_manager";

const { ccclass, property } = _decorator

export enum FeetState {
    Stationary,
    Walking,
    Jumping,
    Falling,
    Sliding,
    Diving,
    Grounded
}

export enum HandsState {
    Stationary,
    Punching,
    Holding
}

export interface Holdable {

}

var delta = 0;
var initial_pos;
var initial_camera_pos;
var old_position;

@ccclass("Player")
export class Player extends Component {
    @property({type: Number})
    public speed: number = 1.0;
    @property({type: Node})
    private force_field: Node;
    @property({type: Node})
    private camera: Node;
    @property({type: SpriteFrame})
    private punching: SpriteFrame;
    @property({type: SpriteFrame})
    private idle: SpriteFrame;
    private feet_state: FeetState;
    private hands_state: HandsState = HandsState.Stationary;
    private holding: Holdable;
    private disable_physics: Array<Node> = Array(1);

    updateState(new_state: FeetState) {
        if ((this.isFalling() || this.isDiving()) && new_state === FeetState.Grounded) {
            console.log("Hit the ground")
        }
        var temp = this.feet_state;
        this.feet_state = new_state;
        return temp
    }

    onMove (displacement: Vec2) {
        this.getComponent(RigidBody2D).linearVelocity.x = 0
        if(this.isGrounded()) {
            this.updateState(FeetState.Walking)
        }
        if(displacement.y > 0.6) {
            this.onJump(displacement.y * 100)
        }
        this.node.translate(new Vec3(displacement.x * this.speed))
    }

    onJump(angle: number) { 
        if (this.isGrounded() || this.isWalking()){
            this.getComponent(RigidBody2D).applyLinearImpulse(new Vec2(0.0, 7.5 + delta), new Vec2(10.0, angle), true);
            this.updateState(FeetState.Jumping)
        }
    }

    onStop() {
        
    }

    onSwipeUp(target: String) {
        
    }

    onSwipeDown(target: String) {
        if (target == "Left-Touch" && this.canDive()) {
            console.log("Swipe Down")
            this.feet_state = FeetState.Diving
            this.getComponent(RigidBody2D).applyLinearImpulse(new Vec2(0.0, -75.0), new Vec2(1.0, 10.0), true)
        }
    }

    onSwipeLeft(target: String) {
        if (target === "Left-Touch" && this.canSlide()) {
            console.log("Sliding")
            this.feet_state = FeetState.Sliding
            this.getComponent(RigidBody2D).applyLinearImpulse(new Vec2(-5.0, 0.0), new Vec2(1.0, 10.0), true)
        }
    }

    onSwipeRight(target: String) {
        if (target === "Left-Touch" && this.canSlide()) {
            console.log("Sliding")
            this.feet_state = FeetState.Sliding
            this.getComponent(RigidBody2D).applyLinearImpulse(new Vec2(5.0, 0.0), new Vec2(1.0, 10.0), true)
        }
    }

    punch() {
        if (!this.isPunching() && !(this.holding === "Ball")) {
            this.hands_state = HandsState.Punching;
            this.getComponent(Sprite).spriteFrame = this.punching;
            this.force_field.active = true;
            var that = this;
            setTimeout(function() {
                that.hands_state = HandsState.Stationary;
                that.getComponent(Sprite).spriteFrame = that.idle;
                that.force_field.active = false;
            }, 250);
        }
    }

    canSlide() {
        if (!this.isSliding()) {
            return true 
        }
        return false
    }

    canWalk() {
        return !this.isJumping()
    }

    canJump() {
        return this.isGrounded()
    }

    canDive() {
        if (!this.isDiving() && !this.isGrounded()) {
            return true
        }
        return false
    }

    isSliding() {
        return this.feet_state == FeetState.Sliding
    }

    isWalking() {
        return this.feet_state == FeetState.Walking
    }

    isStationary() {
        return this.feet_state == FeetState.Stationary
    }

    isJumping() {
        return this.feet_state == FeetState.Jumping
    }

    isFalling () {
        return this.feet_state === FeetState.Falling
    }

    isDiving() {
        return this.feet_state === FeetState.Diving
    }

    isGrounded() {
        return this.feet_state === FeetState.Grounded
    }

    isPunching() {
        return this.hands_state === HandsState.Punching
    }

    pickupBall(ballRef: Node){
        this.hands_state = HandsState.Holding;
        this.holding = ballRef.name;
        //ballRef.setWorldPosition(new Vec3(1000, 1000, 1000))
        ballRef.setParent(this.node);
        this.disable_physics.push(ballRef)
    }

    onCollision(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        switch (otherCollider.tag) {
            case 0:
                break
                //this.force_field.enabled = true;
            case 1:
                this.updateState(FeetState.Grounded)
                break
            case 2:
                this.pickupBall(otherCollider.node)
                console.log("Hit the Ball")
                break
            case 3:
                if (this.holding == "Ball") {
                    console.log("Marked goal")
                    this.holding = ""
                    this.hands_state = HandsState.Stationary
                    find("GameManager").getComponent(game_manager).score("a");
                }
                console.log("Hit the goal")
                break
            
            case 4:
                if (this.holding == "Ball") {
                    console.log("Marked goal")
                    this.holding = ""
                    this.hands_state = HandsState.Stationary
                    find("GameManager").getComponent(game_manager).score("b");
                }
                console.log("Hit the goal")
                break
            case 5:
                var visibility = this.camera.getComponent(Camera).visibility;
                this.camera.getComponent(Camera).visibility = 0;
                this.node.getComponent(RigidBody2D).linearVelocity = new Vec2(0, 0);
                this.node.getComponent(RigidBody2D).linearDamping = 0;
                this.node.getComponent(RigidBody2D).angularDamping = 0;
                if (this.holding == "Ball") {
                    find("GameManager").getComponent(game_manager).died();
                }
                var that = this;
                setTimeout(function(){
                    that.node.setPosition(initial_pos);
                    that.camera.getComponent(Camera).visibility = visibility;
                }, 3000);
                console.log("Player is dead");
                break
            default:
                console.log("Hit something: " + otherCollider.tag)
                break
        }
    }

    start() {
        this.node.getComponent(BoxCollider2D).on(Contact2DType.BEGIN_CONTACT, this.onCollision, this);
        initial_pos = this.node.getPosition();
        initial_camera_pos = this.camera.getWorldPosition();
        old_position = initial_pos;
    }

    update(deltaTime: number) {
        console.log("Current Position: " + this.node.getPosition() + "\nOld Position: " + old_position);
        var current_position = this.node.getPosition();
        if (current_position.x != old_position.x || current_position.y != old_position.y) {
            console.log("Player has moved");
            old_position = this.node.getPosition();
            find("GameManager").getComponent(network_manager).room.send("move", {"pos_x": current_position.x, "pos_y": current_position.y});
        }
        var velocity = this.node.getComponent(RigidBody2D).linearVelocity
        if (velocity.y < -0.001 && !this.isDiving()){
            this.updateState(FeetState.Falling)
        } 

        console.log("Feet State: " + FeetState[this.feet_state] + "\tHands State: " + this.hands_state.valueOf())
        this.disable_physics.map((node) => {
            node.getComponent(RigidBody2D).enabled = false;
            node.getComponent(CircleCollider2D).enabled = false;
            node.setPosition(new Vec3(16, 6.5, 0.0));
        })
        this.disable_physics = Array(1)
    }
}