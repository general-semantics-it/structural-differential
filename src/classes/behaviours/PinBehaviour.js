import {
    Body,
    Composite,
    Constraint
} from "matter-js";


class PinBehaviour {

    constructor() {
        this.pinConstraints = [];
        this.pinConstraint = null;
        this.unpinWhenAbstracted = false;
        this.externalPinned = false;
        this.maxPinPointsAmount = 1;
        this.pinnable = true;
    }

    createPin() {
        return Constraint.create({
            bodyA: this.matterBodyResolver(),
            pointB: {
                x: this.matterBodyResolver().position.x,
                y: this.matterBodyResolver().position.y
            }
        })
    }

    canPin() {
        return true;
    }

    _pin(pinConstraint, composite) {
        if(!this.canPin()) {
            return;
        }
        this.beforePinned();
        this.addPin(pinConstraint, composite);
        this.afterPinned();
    }

    pinToWorld(pinConstraint) {
        this._pin(pinConstraint, this.world)
    }

    beforePinned() {

    }

    afterPinned() {
        Body.setStatic(this.matterBodyResolver(), false)
    }

    _unpin(pinConstraint) {
        this.beforeUnpinned();
        this.removePin(pinConstraint);
        this.afterUnpinned();
    }

    unpinLast() {
        this._unpin(this.lastPin());
    }

    beforeUnpinned() {

    }

    afterUnpinned() {
        Body.setStatic(this.matterBodyResolver(), false);
    }

    isLastPin() {
        return this.pinsAmount() === this.maxPinPointsAmount;
    }

    lastPin() {
        return this.pinConstraints[this.pinsAmount()-1]
    }

    pinsAmount() {
        return this.pinConstraints.length;
    }

    addPin(pinConstraint, composite) {
        Composite.add(composite, pinConstraint);
        this.pinConstraints.push(pinConstraint);
    }

    removePin(pinConstraint) {
        Composite.remove(this.world, pinConstraint);
        this.pinConstraints.pop();
    }

    pin() {
        if(!this.externalPinned) {
            const pinConstraint = this.resolvePinOnPlace();
            const target = this.resolveCompositeOnPlace();
            this._pin(pinConstraint, target);
        }
    }

    unpin() {
        if(!this.externalPinned) {
            this.unpinLast()
        }
    }

    resolveCompositeOnPlace() {
        return this.world;
    }

    resolvePinOnPlace() {
        return this.createPin();
    }
}

export {
    PinBehaviour
}
