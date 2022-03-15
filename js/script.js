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
    draggedBodyRef;

    constructor(){
        let _ = this;
        Common.setDecomp(decomp);
        _.init();
    }

    init() {
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

            // wrapping using matter-wrap plugin
            let allBodies = Composite.allBodies(_.world);

            function isProcess(body) {
                return body.plugin.type === 'process';
            }

            for (let i = 0; i < allBodies.length; i += 1) {
                let body = allBodies[i];
                if(Vertices.contains(body.vertices, mouse.mouseupPosition) && isProcess(body)) {
                    _.draggedBodyRef = body;
                    Body.setStatic(_.draggedBodyRef, false);
                    return;
                }

            }

        })



        Events.on(this.mouseConstraint, 'mouseup', function({mouse}) {
            if(_.draggedBodyRef) {
                Body.setStatic(_.draggedBodyRef, true);
                _.draggedBodyRef = null;
                _.draggedBodyPosition = null;
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



