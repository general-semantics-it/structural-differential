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

    constructor(){
        Common.setDecomp(decomp);
        this.mode = 'IDLE';
        this.render = null;
        this.engine = null;
        this.world = null;
        this.mouse = null;
        this.mouseConstraint = null;
        this.elements = [];
        this.elementsClasses = [
            GS.SD.Process,
            GS.SD.AbstractedProperty,
            GS.SD.Object,
            GS.SD.Conclusion,
        ]

        this.init();
    }

    init() {
        this.engine = Engine.create();
        this.world = this.engine.world;

        this.render = Render.create({
            element: document.querySelector("#root"),
            engine: this.engine,
            options: {
                width: 1000,
                height: 1000
            }
        });

        let Runner = Matter.Runner;
        let runner = Runner.create();
        Runner.run(runner, this.engine);

        this.setupMouse();
        this.setupMouseEvents();
        this.setupControls();

        Composite.add(this.world, [
            Bodies.rectangle(500, -100, 1000, 50, { isStatic: true }),
            Bodies.rectangle(500, 700, 1000, 50, { isStatic: true }),
            //Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
            Bodies.rectangle(0, 300, 50, 1000, { isStatic: true })
        ]);

        Render.lookAt(this.render, {
            min: { x: 0, y: 0 },
            max: { x: 800, y: 600 }
        });

        Render.run(this.render);


    }

    setupControls() {
        let _ = this;

        _.elementsClasses.forEach(function(cls) {
            let button = document.createElement('BUTTON');
            let controls = document.querySelector('.controls');

            button.textContent = cls.buttonText;
            controls.appendChild(button);

            button.addEventListener('click', async () => {
                _.mode = 'PLACING';
                _.temp = new cls(_.world, _.elements, _.mouse);
                await _.temp.draw(_.mouse.position);
                _.elements.push(_.temp);
                console.log(_.temp.matterElement);
                Composite.add(_.world, _.temp.matterElement);
            });
        });
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

    setupMouseEvents() {
        let _ = this;
        Events.on(this.mouseConstraint, 'mousedown', function({mouse}) {
            if(_.mode === 'IDLE') {
                for(let i = 0; i < _.elements.length; i++) {
                    let el = _.elements[i];

                    if(el.containsPointResolver(mouse.mousedownPosition) && el.moveable) {
                        _.temp = el;
                        _.temp.beforeMove();
                        _.mode = 'MOVING';
                        return;
                    }
                }
            }

            if(_.mode === 'PLACING') {
                if(_.temp) {
                    for(let i = 0; i < _.elements.length; i++) {
                        let el = _.elements[i];

                        if(el.containsPointResolver(mouse.mousedownPosition) && el.moveable) {
                            _.temp.place();

                            if(_.temp.isLastPin()) {
                                _.temp = null;
                                _.mode = 'IDLE';
                            }
                        }
                    }


                }
            }
        })

        Events.on(this.mouseConstraint, 'mousemove', function({ mouse }) {
            if(_.mode === 'PLACING') {
                _.temp.move(mouse);
            }
        })

        Events.on(this.mouseConstraint, 'mouseup', function({ mouse }) {
            if(_.mode === 'MOVING') {
                _.temp.afterMove();
                _.temp = null;
                _.mode = 'IDLE';
            }
        })
    }


}

window.sd = new SD();



