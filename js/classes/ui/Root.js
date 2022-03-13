(function() {
    class Root extends GS.SD.BaseElement {
        mouseConstraint;
        mouse;
        world;
        engine;
        render;

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

            const Engine = Matter.Engine,
                Render = Matter.Render,
                Common = Matter.Common;

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
            let MouseConstraint = Matter.MouseConstraint;
            let Composite = Matter.Composite,
                Mouse = Matter.Mouse;
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
            let Composite = Matter.Composite,
                Bodies = Matter.Bodies;
            Composite.add(this.world, [
                Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
                Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
                Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
                Bodies.rectangle(0, 300, 50, 600, { isStatic: true })
            ]);
        }

        setEvents() {
            let Events = Matter.Events,
                Vertices = Matter.Vertices,
                Composite = Matter.Composite;
            let _ = this;

            function isProcess(body) {
                return body.plugin.type === 'process';
            }

            /*Events.on(this.mouseConstraint, 'mouseup', function({mouse}) {

                // wrapping using matter-wrap plugin
                let allBodies = Composite.allBodies(_.world);

                function isProcess(body) {
                    return body.plugin.type === 'process';
                }

                for (let i = 0; i < allBodies.length; i += 1) {
                    let body = allBodies[i];
                    if(Vertices.contains(body.vertices, mouse.mouseupPosition) && isProcess(body)) {
                        let ap1 = new GS.SD.AbstractedProperty(mouse.mouseupPosition.x, mouse.mouseupPosition.y, -1);
                        ap1.draw();

                        Composite.add(_.world, [
                            ap1.matterElement(),
                        ]);

                        return;
                    }

                }

            })*/
            let mouse = this.mouse;

            let targetConstraint = null;
            Events.on(this.mouseConstraint, 'startdrag', function() {
                console.log('startdrag');
                let allBodies = Composite.allBodies(_.world);
                let allConstraints = Composite.allConstraints(_.world);

                console.log(allConstraints);


                for (let i = 0; i < allConstraints.length; i += 1) {
                    let body = allConstraints[i].bodyA;
                    if(!body) {
                        continue;
                    }
                    if(Vertices.contains(body.vertices, mouse.mouseupPosition) && isProcess(body)) {
                        console.log('selected', body);
                        console.log(body);
                        targetConstraint = allConstraints[i];

                        Composite.remove(_.world, targetConstraint);
                        return;
                    }

                }
            })

            Events.on(this.mouseConstraint, 'mousemove', function() {

            })

            Events.on(this.mouseConstraint, 'enddrag', function(mouseConstraint) {
                console.log('enddrag', targetConstraint);
                if(targetConstraint) {

                    let constraint = Matter.Constraint.create({
                        pointA: {
                            x: 0,
                            y: 0
                        },
                        pointB: {
                            x: mouseConstraint.body.position.x,
                            y: mouseConstraint.body.position.y
                        },
                        bodyA: mouseConstraint.body
                    })
                    Composite.add(_.world, [
                        constraint
                    ]);

                }
                targetConstraint = null;

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
