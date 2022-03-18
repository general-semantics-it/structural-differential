(function() {

    const Composite = Matter.Composite;
    const Body = Matter.Body;

    class BaseMatterElement {
        constructor(type, world, elements, mouse) {
            this.type = type;
            this.world = world;
            this.mouse = mouse;
            this.matterElement = null;
            this.prevMousePosition = null;
            this.elements = elements;
            this.pinPointsAmount = 1;
            this.pinPointIndex = 0;
            this.moveable = false;
            this.pinConstraints = [];
            this.pinConstraint = null;
            this.unpinable = false;
            this.externalPinned = false;
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

        pin() {

            this.pinConstraint = Constraint.create({
                bodyA: this.matterBodyResolver(),
                pointB: {
                    x: this.matterBodyResolver().position.x,
                    y: this.matterBodyResolver().position.y
                }
            })

            Body.setStatic(this.matterBodyResolver(), false);
            Composite.add(this.world, this.pinConstraint);

        }

        unpin() {
            Composite.remove(this.world, this.pinConstraints[this.pinPointIndex]);
        }

        beforeMove() {
            this.unPlace();
        }

        afterMove() {
            this.place();
        }

        afterPin() {}

        afterUnpin() {}

        place() {
            if(!this.externalPinned) {
                this.pin();
                this.pinPointIndex++;
                this.pinConstraints.push(this.pinConstraint);
                this.afterPin();
            }

        }

        unPlace() {
            if(!this.externalPinned) {
                this.pinPointIndex--;
                this.unpin();
                Body.setStatic(this.matterBodyResolver(), false);

                this.pinConstraints.pop();
                this.afterUnpin();
            }
        }

        isLastPin() {
            return this.pinPointIndex >= this.pinPointsAmount;
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
    }

    if(typeof window.GS === 'undefined') {
        window.GS = {};
    }

    if(typeof window.GS.SD === 'undefined') {
        window.GS.SD = {};
    }
    window.GS.SD.BaseMatterElement = BaseMatterElement;
}())