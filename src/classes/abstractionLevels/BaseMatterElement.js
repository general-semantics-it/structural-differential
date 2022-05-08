import {
    Composite,
    Body,
    Vertices
} from "matter-js";
import {PlaceBehaviour} from "../behaviours/PlaceBehaviour";

class BaseMatterElement extends PlaceBehaviour
{
    constructor(type, elements, render) {
        super()
        this.type = type;
        this.label = "Base element"
        this.world = render.engine.world;
        this.mouse = render.mouse;
        this.canvas = render.canvas;
        this.matterElement = null;
        this.prevMousePosition = null;
        this.elements = elements;
        this.moveable = false;
        this.initiallyPlaced = false;
    }

    async create() {
        throw Error('You must declare [create function] for ' + this)
    }

    correctPosition(mouse) {
        if(!this.prevMousePosition) {
            this.correctPositionResolver();

            this.prevMousePosition = {
                x: mouse.position.x,
                y: mouse.position.y,
            };
        }
    }

    matterBodyResolver() {
        return this.matterElement;
    }

    matterTypeResolver() {
        return Body;
    }

    beforeDrag() {
        this.unPlace();
    }

    afterDrag() {
        this.place();
    }



    move(mouse) {
        this.correctPosition(mouse)

        this.matterTypeResolver().translate(this.matterBodyResolver(), {
            x:  mouse.position.x - this.prevMousePosition.x,
            y:  mouse.position.y - this.prevMousePosition.y,
        });

        this.prevMousePosition = {
            x: mouse.position.x,
            y: mouse.position.y,
        };

        this.onMove(mouse);
    }

    correctPositionResolver() {
        this.matterTypeResolver().translate(this.matterBodyResolver(), {
            x: (this.matterBodyResolver().position.x - this.mouse.position.x) * -1,
            y: (this.matterBodyResolver().position.y - this.mouse.position.y) * -1,
        });
    }

    containsPointResolver(point) {
        return Vertices.contains(this.matterBodyResolver().vertices, point);
    }

    addToWorld() {
        Composite.add(this.world, this.matterElement);
    }

    removeFromWorld() {
        let _ = this;
        Composite.remove(this.world, this.matterElement);

        this.pinConstraints.forEach(function(el) {
            _.unpin();
        })
    }

    onMove(mouse) {

    }
}

export {
    BaseMatterElement
}