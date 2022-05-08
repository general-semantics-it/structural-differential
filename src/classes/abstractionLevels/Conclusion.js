import {BaseMatterElement} from "./BaseMatterElement";
import {
    Bodies,
    Svg,
    Body
} from "matter-js";

class Conclusion extends BaseMatterElement {

    static buttonText = "Добавить заключение";

    constructor(elements, render) {
        super('CONCLUSION', elements, render);
        this.label = 'conclusion';
        this.moveable = true;
    }

    async create(point) {

        this.matterElement = Bodies.rectangle(point.x, point.y, 100, 150, {
            collisionFilter: {
                group: -1
            },
            chamfer: {
                radius:  10
            },
            isStatic: true
        })
    }
}

export {
    Conclusion
}