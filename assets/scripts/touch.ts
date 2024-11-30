import { _decorator, clamp, Component, Director, EventTouch, find, Input, input, math, Node, Scene, Vec2, Vec3 } from 'cc';
import { Player } from './player';
import { network_manager } from './network_manager';
const { ccclass, property } = _decorator;

var touch_init_time;
var left_displacement = new Vec2(0,0);
var right_displacement = new Vec2(0,0);
var max = window.screen.width / 4;

@ccclass('Touch')
export class Touch extends Component {
    private player: Node;

    @property({type: Node})
    private left_touch: Node = null;

    @property({type: Node})
    private right_touch: Node = null;

    touchStart(event: EventTouch) {
        touch_init_time = Date.now();
    }

    touchMove(event: EventTouch) {
        if (Date.now() - touch_init_time > 200) {
            var delta = new Vec2(event.getLocationX() - event.getStartLocation().x, 
                                 event.getLocationY() - event.getStartLocation().y);
            if (Math.abs(delta.x) >= max ){
                if (delta.x < 0) {
                    delta.x = -max
                } else {
                    delta.x = max
                }
            }
            if (Math.abs(delta.y) >= max) {
                if (delta.y < 0) {
                    delta.y = -max;
                } else {
                    delta.y = max;
                }
            }
            if ((event.target as Node).name == "Left-Touch") {
                left_displacement = delta.divide2f(max, max)
            } else {
                right_displacement = delta.divide2f(max, max)
            }
            
        }
    }
    
    touchEnd(event: EventTouch) {
        left_displacement = new Vec2(0,0)
        right_displacement = new Vec2(0,0)
        var elapsed_time = Date.now() - touch_init_time;
        var delta_pos_y = event.getLocationY() - event.getStartLocation().y;
        var delta_pos_x = event.getLocationX() - event.getStartLocation().x;
        
        if ((Math.abs(delta_pos_y) > screen.height / 5 || Math.abs(delta_pos_x) > screen.width / 5) && (Date.now() - touch_init_time) < 200) {
            if (Math.abs(delta_pos_y) > Math.abs(delta_pos_x)) {
                if (delta_pos_y > 0) {
                    
                    this.player.getComponent(Player).onSwipeUp((event.target as Node).name)
                } else {
                    
                    this.player.getComponent(Player).onSwipeDown((event.target as Node).name)
                }
            } else {
                if (delta_pos_x > 0 ){
                    
                    this.player.getComponent(Player).onSwipeRight((event.target as Node).name)
                } else {
                    
                    this.player.getComponent(Player).onSwipeLeft((event.target as Node).name)
                }
            }
        }
    }

    punch (event: EventTouch) {
        this.player.getComponent(Player).punch();
    }

    touchCancel(event: EventTouch) {
        left_displacement = new Vec2(0,0)
        right_displacement = new Vec2(0,0)
        
    }

    start() {
        this.player = find("Canvas/" + find("GameManager").getComponent(network_manager).room.sessionId)
    }

    update(deltaTime: number) {
        this.left_touch.on(Input.EventType.TOUCH_START, this.touchStart, this)
        this.left_touch.on(Input.EventType.TOUCH_MOVE, this.touchMove, this)
        this.left_touch.on(Input.EventType.TOUCH_END, this.touchEnd, this)
        this.left_touch.on(Input.EventType.TOUCH_CANCEL, this.touchCancel, this)
        this.right_touch.on(Input.EventType.TOUCH_START, this.punch, this)
        this.right_touch.on(Input.EventType.TOUCH_MOVE, this.touchMove, this)
        this.right_touch.on(Input.EventType.TOUCH_END, this.touchEnd, this)
        this.right_touch.on(Input.EventType.TOUCH_CANCEL, this.touchCancel, this)
        
        if (left_displacement.x != 0 && left_displacement.y != 0) {
            this.player.getComponent(Player).onMove(left_displacement)
        } else {
            this.player.getComponent(Player).onStop()
        }
    }
}


