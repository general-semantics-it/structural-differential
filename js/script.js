let Composite = Matter.Composite,
    Bodies = Matter.Bodies,
    Engine = Matter.Engine,
    Render = Matter.Render,
    Common = Matter.Common,
    MouseConstraint = Matter.MouseConstraint,
    Constraint = Matter.Constraint,
    Mouse = Matter.Mouse,
    Events = Matter.Events,
    Vertices = Matter.Vertices,
    Body = Matter.Body;

class SD {
    mouseConstraint;
    mouse;
    world;
    engine;
    render;
    abstractButton;
    mode;
    temp;
    prevTranslation;

    constructor(){
        Common.setDecomp(decomp);
        this.init();
    }

    init() {
        this.mode = 'MOVE';
        this.engine = Engine.create();
        this.world = this.engine.world;

        this.render = Render.create({
            element: document.querySelector("#root"),
            engine: this.engine,
            options: {
                width: 800,
                height: 600
            }
        });

        let Runner = Matter.Runner;
        let runner = Runner.create();
        Runner.run(runner, this.engine);

        this.setupMouse();
        this.setupEvents();

        // fit the render viewport to the scene
        Render.lookAt(this.render, {
            min: { x: 0, y: 0 },
            max: { x: 800, y: 600 }
        });

        this.draw();

        Render.run(this.render);

        this.abstractButton = document.querySelector('.js-abstract-property');

        let _ = this;

        if(this.abstractButton) {
            this.abstractButton.addEventListener('click', function() {
                _.mode = 'ABSTRACT_PROPERTY';
                console.log(_.mouse);
                _.temp = new GS.SD.AbstractedProperty(_.mouse.position.x, _.mouse.position.y, -1);
                _.temp.draw();
                _.prevMousePosition = null;
                Composite.add(_.world, _.temp.matterElement());
            })
        }


    }

    setupMouse() {
        // add mouse control
        this.mouse = Mouse.create(this.render.canvas);

        this.mouseConstraint = MouseConstraint.create(this.engine, {
            mouse: this.mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });

        Composite.add(this.world, this.mouseConstraint);

        // keep the mouse in sync with rendering
        this.render.mouse = this.mouse;
    }

    isProcess(body) {
        return body.plugin.type === 'process';
    }

    getBodyHovered(point) {
        let allBodies = Composite.allBodies(this.world);

        for (let i = 0; i < allBodies.length; i += 1) {
            let body = allBodies[i];

            if(Vertices.contains(body.vertices, point)) {
                return body;
            }

        }
    }

    getHoveredProcess(point) {
        let body = this.getBodyHovered(point);
        if(body && this.isProcess(body)) {
            return body;
        }
    }

    setupEvents() {
        let _ = this;
        Events.on(this.mouseConstraint, 'mousedown', function({mouse}) {

            if(_.mode === 'MOVE') {
                let body = _.getHoveredProcess(mouse.mousedownPosition);
                console.log(body);

                if(body) {
                    _.temp = body;
                    Body.setStatic(_.temp, false);
                }
            } if (_.mode === 'ABSTRACT_PROPERTY') {
                _.mode = 'MOVE';
                let body = _.getHoveredProcess(mouse.mousedownPosition);


                if(body) {
                    let constraint = Constraint.create({
                        bodyB: body,
                        bodyA: _.temp.matterElement().bodies[0],
                        pointA: {
                            x: 0,
                            y: 0
                        },
                        pointB: {
                            x: _.mouse.position.x - body.position.x,
                            y: _.mouse.position.y - body.position.y
                        }
                    })

                    Body.setStatic(_.temp.matterElement().bodies[0], false);
                    Composite.add(_.world, constraint);
                }


                _.temp = null;
            }


        })

        _.prevTranslation = {
            x: 0,
            y: 0
        }



        Events.on(this.mouseConstraint, 'mousemove', function({ mouse }) {

            if(_.mode === 'ABSTRACT_PROPERTY') {

                if(!_.prevMousePosition) {
                    let tran = {
                        x: (_.temp.matterElement().bodies[0].position.x - _.mouse.position.x) * -1,
                        y: (_.temp.matterElement().bodies[0].position.y - _.mouse.position.y) * -1,
                    };
                    console.log(tran);
                    Composite.translate(_.temp.matterElement(), tran);
                    _.prevMousePosition = {
                        x: _.mouse.position.x,
                        y: _.mouse.position.y,
                    };
                    return;
                }
                let translation = {
                    x:  mouse.position.x - _.prevMousePosition.x,
                    y:  mouse.position.y - _.prevMousePosition.y,
                }


                Composite.translate(_.temp.matterElement(), translation);


                _.prevMousePosition = {
                    x: mouse.position.x,
                    y: mouse.position.y,

                };


            }
        })


        Events.on(this.mouseConstraint, 'mouseup', function({ mouse }) {
            if(_.temp) {
                Body.setStatic(_.temp, true);
                _.temp = null;
            }

        })
    }

    draw() {
        new GS.SD.Process(this.world);

    }

}

new SD();



