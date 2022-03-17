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
        }

        draw(point) {

            let particleOptions = Common.extend({ inertia: Infinity, friction: 0.00001, collisionFilter: { group: this.group }, render: { visible: false } } , {});
            let constraintOptions = Common.extend({ stiffness: 0.06, render: { type: 'line', anchors: false } });

            this.matterElement = Composites.stack(point.x, point.y, 1, 12, 5, 5, function(x, y, column, row) {

                particleOptions.render.visible = row === 0;
                return Bodies.circle(x, y, 8, particleOptions);
            });


            Composites.mesh(this.matterElement, 1, 12, false, constraintOptions);
            this.matterElement.bodies[0].isStatic = true;
        }


        place() {
            let _ = this;
            this.elements.forEach(function(el) {
                if(_.matterElement !== el.matterElement && el.containsPointResolver(_.mouse.position)) {
                    let constraint = Constraint.create({
                        bodyB: el.matterElement,
                        bodyA: _.matterElement.bodies[0],
                        pointA: {
                            x: 0,
                            y: 0
                        },
                        pointB: {
                            x: _.mouse.position.x - el.matterElement.position.x,
                            y: _.mouse.position.y - el.matterElement.position.y
                        }
                    })

                    Body.setStatic(_.matterElement.bodies[0], false);
                    Composite.add(_.world, constraint);
                }

            })

        }

        matterTypeResolver() {
            return Composite;
        }

        correctPositionResolver() {
            Composite.translate(this.matterElement, {
                x: (this.matterElement.bodies[0].position.x - this.mouse.position.x) * -1,
                y: (this.matterElement.bodies[0].position.y - this.mouse.position.y) * -1,
            });
        }

        containsPointResolver(point) {
            return Vertices.contains(this.matterElement.bodies[0].vertices, point);
        }

    }
    if(typeof window.GS === 'undefined') {
        window.GS = {};
    }

    if(typeof window.GS.SD === 'undefined') {
        window.GS.SD = {};
    }
    window.GS.SD.AbstractedProperty = AbstractedProperty;
}())



