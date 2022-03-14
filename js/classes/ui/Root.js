(function() {
    let Composite = Matter.Composite,
        Bodies = Matter.Bodies,
        Engine = Matter.Engine,
        Render = Matter.Render,
        Common = Matter.Common,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse,
        Events = Matter.Events,
        Vertices = Matter.Vertices;

    class Root extends GS.SD.BaseElement {
        mouseConstraint;
        mouse;
        world;
        engine;
        render;
        draggedBodyPosition;
        draggedBodyRef;

        constructor() {
            super();
        }

        mount() {
            this._domElement = document.createElement('DIV');
            this._domElement.id = 'root';
            document.body.appendChild(this._domElement);

        }

        init() {
            this.mount();

            const cp = new GS.SD.ControlPanel();
            this.attach(cp);
            cp.mount();



            // provide concave decomposition support library
            Common.setDecomp(decomp);

            // create engine
            this.engine = Engine.create();
            this.world = this.engine.world;

            // create renderer
            this.render = Render.create({
                element: this._domElement,
                engine: this.engine,
                options: {
                    width: 800,
                    height: 600
                }
            });


            this.setupRunner();

            new GS.SD.Process(this.world);

            this.addWalls();

            this.setupMouse();

            this.setEvents();

            // fit the render viewport to the scene
            Render.lookAt(this.render, {
                min: { x: 0, y: 0 },
                max: { x: 800, y: 600 }
            });

            Render.run(this.render);

        }

        setupRunner() {
            let Runner = Matter.Runner;
            // create runner
            let runner = Runner.create();

            Runner.run(runner, this.engine);
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

        addWalls() {

            Composite.add(this.world, [
                Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
                Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
                Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
                Bodies.rectangle(0, 300, 50, 600, { isStatic: true })
            ]);
        }


        removeFromWorld(object) {
            Composite.remove(this.world, object);
        }
        setDraggedBodyRef(body) {
            this.draggedBodyRef = body;
        }

        setEvents() {

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
                        _.setDraggedBodyRef(body);
                        _.draggedBodyPosition = (function(){
                            let { x,y } = _.draggedBodyRef.position;
                            return { x,y };
                        }());

                        return;
                    }

                }

            })

            Events.on(this.mouseConstraint, 'mousemove', function({mouse}) {
                let dx = mouse.mousedownPosition.x - mouse.position.x;
                let dy = mouse.mousedownPosition.y - mouse.position.y;
                if(_.draggedBodyRef) {
                    let newPosition = {
                        x: _.draggedBodyPosition.x - dx,
                        y: _.draggedBodyPosition.y - dy,
                    };

                    Matter.Body.setPosition(_.draggedBodyRef, newPosition);

                }

            })

            Events.on(this.mouseConstraint, 'mouseup', function({mouse}) {
                _.draggedBodyRef = null;
                _.draggedBodyPosition = null;
            })



        }
    }

    if(typeof window.GS === 'undefined') {
        window.GS = {};
    }

    if(typeof window.GS.SD === 'undefined') {
        window.GS.SD = {};
    }
    window.GS.SD.Root = Root;
}())
