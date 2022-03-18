(function() {
    const Composite = Matter.Composite,
        Common = Matter.Common,
        Composites = Matter.Composites,
        Bodies = Matter.Bodies;

    class AbstractedProperty extends GS.SD.BaseMatterElement {

        static buttonText = "Абстрагировать свойство";

        constructor(world, elements, mouse) {
            super('ABSTRACTED_PROPERTY', world, elements, mouse);
            this.group = -1;
            this.pinPointsAmount = 2;
            this.moveable = false;
        }

        draw(point) {
            let particleOptions = Common.extend({ inertia: Infinity, friction: 0.00001, collisionFilter: { group: this.group }, render: { visible: false } } , {});
            let constraintOptions = Common.extend({ stiffness: 0.06, render: { type: 'line', anchors: false } });

            this.matterElement = Composites.stack(point.x, point.y, 1, 12, 5, 5, function(x, y, column, row) {
                particleOptions.render.visible = (row === 0 || row === 11);
                return Bodies.circle(x, y, 8, particleOptions);
            });

            Composites.mesh(this.matterElement, 1, 12, false, constraintOptions);
            this.matterElement.bodies[0].isStatic = true;
        }

        pin() {
            let _ = this;
            this.elements.forEach(function(el) {
                if(_.matterElement !== el.matterElement && el.containsPointResolver(_.mouse.position)) {
                    _.pinConstraint = Constraint.create({
                        bodyB: el.matterBodyResolver(),
                        bodyA: _.matterBodyResolver(),
                        pointB: {
                            x: _.mouse.position.x - el.matterBodyResolver().position.x,
                            y: _.mouse.position.y - el.matterBodyResolver().position.y
                        }
                    })
                    Body.setStatic(_.matterBodyResolver(), false);
                    Composite.add(_.world, _.pinConstraint);
                    if(el.unpinable) {

                        el.unPlace();
                        el.externalPinned = true;
                    }

                }
            })
        }

        afterPin() {
            if(!this.isLastPin()) {
                Body.setStatic(this.matterBodyResolver(), true);
            }

            this.matterTypeResolver().translate(this.matterBodyResolver(), {
                x: this.mouse.position.x - this.matterBodyResolver().position.x,
                y: this.mouse.position.y - this.matterBodyResolver().position.y
            })
        }

        matterBodyResolver() {
            if(this.pinPointIndex === 0) {
                return this.matterElement.bodies[0];
            } else {
                return this.matterElement.bodies[this.matterElement.bodies.length - 1];
            }
        }
    }

    window.GS.SD.AbstractedProperty = AbstractedProperty;
}())



