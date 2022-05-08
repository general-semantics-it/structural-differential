import {SvgMatterElement} from "./SvgMatterElement";
import {
    Bodies,
    Svg,
    Body,
} from "matter-js";

import processSvgSrc from "../../assets/svg/process.svg";

export class Process extends SvgMatterElement {

    static buttonText = "Добавить процесс";

    constructor(elements, render) {
        super('PROCESS', elements, render, processSvgSrc);
        this.label = 'process';
        this.moveable = true;
        this.unpinWhenAbstracted = false;
        this.pinnable = true;
    }

    async create(point) {
        await this.setVertices();
        console.log(Bodies);
        console.log(this.vertices);
        this.matterElement = Bodies.fromVertices(point.x, point.y, this.vertices, {
            render: {
                lineWidth: 2
            },
            collisionFilter: {
                group: -1,
            },
            plugin: {
                type: 'PROCESS',
            },
            isStatic: true
        }, true);
    }
}
