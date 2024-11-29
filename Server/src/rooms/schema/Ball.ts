import { Schema, Context, type} from "@colyseus/schema";

export class Ball extends Schema {
    @type("float32") pos_x: number;
    @type("float32") pos_y: number;
    @type("string") in_hold_by_player_id: string = null;
}