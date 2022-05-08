import {PinBehaviour} from "./PinBehaviour";
import {
    Body
} from "matter-js";

export class PlaceBehaviour extends PinBehaviour {

    constructor() {
        super();
    }

    canPlace() {
        return true;
    }

    place() {
        console.log('start placing', this.label)
        if(!this.canPlace()) {
            return false;
        }
        if(this.pinnable) {
            console.log('we are placing element via pin behaviour')
            this.pin();
            return this.isLastPin();
        } else {
            console.log('we are placing element making it static', this.matterBodyResolver());
            if(this.initiallyPlaced) {
                Body.setStatic(this.matterBodyResolver(), true)
            }
            console.log('we placed element', this.matterBodyResolver());
            return true;
        }

    }

    unPlace() {
        if(this.pinnable) {
            console.log('we are unplacing element via pin behaviour')
            this.unpin();
        } else {
            console.log('we are unplacing element making it not static')
            Body.setStatic(this.matterBodyResolver(), false)
        }
    }

}
