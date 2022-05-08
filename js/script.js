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
        this.gui = null;
        this.showIds = false;
        this.elementsClasses = [
            GS.SD.Process,
            GS.SD.AbstractedProperty,
            GS.SD.Object,
            GS.SD.Conclusion,
        ]
        this.inspector = null;

        this.init();
    }

    init() {
        this.engine = Engine.create();
        this.world = this.engine.world;

        this.render = Render.create({
            element: document.querySelector(".matter-demo"),
            engine: this.engine,
            options: {
                width: 800,
                height: 600,
            }
        });

        this.setupGui();

        Events.on(this.render, 'afterRender', (event) => {
            if(this.showIds) {
                let ctx = event.source.context;
                this.elements.forEach((el, index) => {
                    let body = el.matterBodyResolver();
                    let width = Math.abs(body.bounds.max.x - body.bounds.min.x);
                    let height = Math.abs(body.bounds.max.y - body.bounds.min.y);

                    ctx.globalAlpha = 1;
                    ctx.font = "12px sans-serif";
                    ctx.fillStyle = "#fff";
                    ctx.fillText(el.label + " " + index,body.position.x - width / 2 ,body.position.y - height/ 2);
                })
            }
        })

        let Runner = Matter.Runner;
        let runner = Runner.create();
        Runner.run(runner, this.engine);

        this.setupMouse();
        this.setupMouseEvents();

        Composite.add(this.world, [
/*            Bodies.rectangle(500, 0, 1000, 50, { isStatic: true }),
            Bodies.rectangle(500, 1000, 1000, 50, { isStatic: true }),
            Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
            Bodies.rectangle(0, 500, 50, 1000, { isStatic: true })*/
        ]);

        Render.lookAt(this.render, {
            min: { x: 0, y: 0 },
            max: { x: 1000, y: 1000 }
        });

        Render.run(this.render);

        this.inspector = new GS.SD.Inspector(this);
        this.inspector.create();
    }

    setupGui() {

        this.gui = new dat.gui.GUI();

        let obj = {
            showIds: false,
        };

        //this.gui.remember(obj);

        let buttonsGui = this.gui.addFolder('Figures');
        this.elementsClasses.forEach((cls, i) => {
            obj[cls.buttonText] = () => {
                this.mode = 'PLACING';
                this.temp = new cls(this.elements, this.render);
                this.temp.create(this.mouse.position).then(() => {
                    this.temp.addToWorld();
                    this.elements.push(this.temp);
                    this.inspector.update();
                });
            };
            buttonsGui.add(obj, cls.buttonText);
        })

        buttonsGui.open();

        let settingsGui = this.gui.addFolder('Settings');
        let showIdsController = settingsGui.add(obj, 'showIds')

        settingsGui.open();
        showIdsController.onChange((value) => {
            this.showIds = value;
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
                        _.temp.beforeDrag();
                        _.mode = 'DRAGGING';
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
            if(_.mode === 'DRAGGING') {
                _.temp.afterDrag();
                _.temp = null;
                _.mode = 'IDLE';
            }
        })
    }

}

window.sd = new SD();



