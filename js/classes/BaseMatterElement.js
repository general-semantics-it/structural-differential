(function() {

    const Composite = Matter.Composite;
    const Body = Matter.Body;

    class BaseMatterElement {
        constructor(type, elements, render) {
            this.type = type;
            this.label = "Base element"
            this.world = render.engine.world;
            this.mouse = render.mouse;
            this.canvas = render.canvas;
            this.matterElement = null;
            this.prevMousePosition = null;
            this.elements = elements;
            this.maxPinPointsAmount = 1;
            this.moveable = false;
            this.pinConstraints = [];
            this.pinConstraint = null;
            this.unpinWhenAbstracted = false;
            this.externalPinned = false;
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

        pin(pinConstraint, target) {
            if(!this.canPin()) {
                return;
            }
            this.beforePinned();
            this.addPin(pinConstraint, target);
            this.afterPinned();
        }

        pinToWorld(pinConstraint) {
            this.pin(pinConstraint, this.world)
        }

        beforePinned() {

        }

        afterPinned() {
            Body.setStatic(this.matterBodyResolver(), false)
        }

        unpin(pinConstraint) {
            this.beforeUnpinned();
            this.removePin(pinConstraint);
            this.afterUnpinned();
        }

        unpinLast() {
            this.unpin(this.lastPin());
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

        addPin(pinConstraint, target) {
            Composite.add(target, pinConstraint);
            this.pinConstraints.push(pinConstraint);
        }

        removePin(pinConstraint) {
            Composite.remove(this.world, pinConstraint);
            this.pinConstraints.pop();
        }

        beforeDrag() {
            this.unPlace();
        }

        afterDrag() {
            this.place();
        }

        canPlace() {
            return true;
        }

        place() {
            if(!this.canPlace()) {
                return;
            }
            if(!this.externalPinned) {
                const pinConstraint = this.resolvePinOnPlace();
                this.pinToWorld(pinConstraint);
            }
        }

        resolvePinOnPlace() {
            return this.createPin();
        }

        unPlace() {
            if(!this.externalPinned) {
                this.unpinLast()
            }
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

    window.GS.SD.BaseMatterElement = BaseMatterElement;
}())