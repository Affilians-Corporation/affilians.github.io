import {Schema, Context, type} from "@colyseus/schema";

export class Player extends Schema {
    @type("string") team: string;
    @type("float32") pos_x: number;
    @type("float32") pos_y: number;
    @type("boolean") has_ball: boolean;
    @type("string") sprite: string;
    @type("float32") spawn_point_x: number;
    @type("float32") spawn_point_y: number;
}