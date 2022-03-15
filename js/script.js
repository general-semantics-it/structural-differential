let Composite = Matter.Composite,
    Bodies = Matter.Bodies,
    Engine = Matter.Engine,
    Render = Matter.Render,
    Common = Matter.Common,
    MouseConstraint = Matter.MouseConstraint,
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
    tempBody;
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
                _.prevMousePosition = _.mouse.position;
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

    setupEvents() {
        let _ = this;
        Events.on(this.mouseConstraint, 'mousedown', function({mouse}) {

            if(_.mode === 'MOVE') {
                // wrapping using matter-wrap plugin
                let allBodies = Composite.allBodies(_.world);

                function isProcess(body) {
                    return body.plugin.type === 'process';
                }

                for (let i = 0; i < allBodies.length; i += 1) {
                    let body = allBodies[i];

                    if(Vertices.contains(body.vertices, mouse.mousedownPosition) && isProcess(body)) {
                        _.tempBody = body;
                        Body.setStatic(_.tempBody, false);
                        return;
                    }

                }
            } if (_.mode === 'ABSTRACT_PROPERTY') {
                _.mode = 'MOVE';
                _.temp = null;
            }


        })

        _.prevTranslation = {
            x: 0,
            y: 0
        }



        Events.on(this.mouseConstraint, 'mousemove', function({ mouse }) {

            if(_.mode === 'ABSTRACT_PROPERTY') {


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
            if(_.tempBody) {
                Body.setStatic(_.tempBody, true);
                _.tempBody = null;
            }

        })
    }

    draw() {
        new GS.SD.Process(this.world);
        this.drawWalls()
    }

    drawWalls() {
        Composite.add(this.world, [
            Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
            Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
            Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
            Bodies.rectangle(0, 300, 50, 600, { isStatic: true })
        ]);
    }
}

new SD();



