(function() {
    const Composite = Matter.Composite,
        Common = Matter.Common,
        Composites = Matter.Composites,
        Bodies = Matter.Bodies;

    class AbstractedProperty extends GS.SD.BaseMatterElement {

        static buttonText = "Абстрагировать свойство";

        constructor(elements, render) {
            super('ABSTRACTED_PROPERTY', elements, render);
            this.label = 'abstracted property';
            this.group = -1;
            this.maxPinPointsAmount = 2;
            this.moveable = false;
            this.segments = 3;
            this.particleOptions = {
                inertia: Infinity,
                friction: 0.00001,
                collisionFilter: { group: this.group },
                render: {
                    visible: false
                }
            }
            this.constraintOptions = { stiffness: 0.06, render: { type: 'line', anchors: false } };
            this.insertPinToEl = null;
        }

        async create(point) {
            this.matterElement = this.createString(point);
            this.matterBodyResolver().isStatic = true;
        }

        /*        async update() {
                    const constraints = Composite.allConstraints(this.matterElement);
                    const bodies = Composite.allBodies(this.matterElement);
                    console.log('constraints', constraints);
                    console.log('constraints', bodies);
                    for(let i = 0; i < constraints.length; i++) {
                        const c = constraints[i];
                        const b = bodies[i];
                        Composite.removeConstraint(this.matterElement, c);
                        Composite.removeBody(this.matterElement, b);
                    }
                    this.matterElement = this.createString({x: 200, y: 500})
                    this.connectTogether(this.matterElement);
                    this.addToWorld();
                    //this.removeFromWorld();
                    //this.create(this.mouse.position);
                    //this.addToWorld();
                    //this.pin();
                }*/

        createString(point) {
            const stack = this.createStackOfCircles(point);
            this.connectTogether(stack);
            return stack;
        }

        createStackOfCircles(point) {
            return Composites.stack(point.x, point.y, 1, this.segments, 5, 5, function(x, y, column, row) {
                this.particleOptions.render.visible = true;
                return Bodies.circle(x, y, 8, this.particleOptions);
            }.bind(this));
        }

        connectTogether(target) {
            Composites.mesh(
                target,
                1,
                this.segments,
                false,
                this.constraintOptions
            );
        }


        resolvePinOnPlace() {
            const el = this.insertPinToEl;
            let _ = this;

            return Constraint.create({
                bodyB: el.matterBodyResolver(),
                bodyA: _.matterBodyResolver(),
                pointB: {
                    x: _.mouse.position.x - el.matterBodyResolver().position.x,
                    y: _.mouse.position.y - el.matterBodyResolver().position.y
                }
            })
        }

        resolveCompositeOnPlace() {
            return this.matterElement
        }

        canPlace() {
            return this.canPin();
        }

        canPin() {
            for(let i = 0; i < this.elements.length; i++) {
                const el = this.elements[i];
                if(this.matterElement !== el.matterElement && el.containsPointResolver(this.mouse.position)) {
                    this.insertPinToEl = el;
                    return true;
                }
            }
            return false;
        }


        afterPinned() {

            if(this.isLastPin()) {
                Body.setStatic(this.matterElement.bodies[0], false);
                Body.setStatic(this.matterElement.bodies[this.matterElement.bodies.length - 1], false);
            } else {
                Body.setStatic(this.matterBodyResolver(), true);
            }


            this.matterTypeResolver().translate(this.matterBodyResolver(), {
                x: this.mouse.position.x - this.matterBodyResolver().position.x,
                y: this.mouse.position.y - this.matterBodyResolver().position.y
            })

            if(this.insertPinToEl.unpinWhenAbstracted) {

                this.insertPinToEl.unPlace();
                this.insertPinToEl.externalPinned = true;
            }
        }

        matterBodyResolver() {

            if(this.pinsAmount() === 0) {
                return this.matterElement.bodies[0];
            } else {
                return this.matterElement.bodies[this.matterElement.bodies.length - 1];
            }
        }

        /*              onMove(mouse) {
                  setTimeout(() => {
                      this.segments+1;
                      this.update();
                  },3000)
              }*/

    }

    window.GS.SD.AbstractedProperty = AbstractedProperty;
}())



