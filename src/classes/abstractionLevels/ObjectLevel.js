import {BaseMatterElement} from "./BaseMatterElement";
import {
    Bodies,
    Svg,
    Body
} from "matter-js";


class ObjectLevel extends BaseMatterElement {

    static buttonText = "Добавить объект";

    constructor(elements, render) {
        super('OBJECT', elements, render);
        this.label = 'object';
        this.moveable = true;
        this.unpinWhenAbstracted = false;

    }

    async create(point) {

        this.matterElement = Bodies.circle(point.x, point.y, 50, {
            isStatic: true,
            collisionFilter: {
                group: -1
            },
        })
    }
}

export {
    ObjectLevel
}
