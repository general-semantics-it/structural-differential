
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Common = Matter.Common,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    Composite = Matter.Composite,
    Svg = Matter.Svg,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Composites = Matter.Composites,
    Events = Matter.Events;

// provide concave decomposition support library
Common.setDecomp(decomp);

// create engine
var engine = Engine.create(),
    world = engine.world;

// create renderer
var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: 800,
        height: 600
    }
});

Render.run(render);

// create runner
var runner = Runner.create();
Runner.run(runner, engine);

// add bodies
if (typeof fetch !== 'undefined') {
    var select = function(root, selector) {
        return Array.prototype.slice.call(root.querySelectorAll(selector));
    };

    var loadSvg = function(url) {
        return fetch(url)
            .then(function(response) { return response.text(); })
            .then(function(raw) { return (new window.DOMParser()).parseFromString(raw, 'image/svg+xml'); });
    };


    loadSvg('./svg/process.svg').then(function(root) {
        var color = Common.choose(['#f19648', '#f5d259', '#f55a3c', '#063e7b', '#ececd1']);

        var vertexSets = select(root, 'path')
            .map(function(path) {
                return Svg.pathToVertices(path, 30);
            });


        Composite.add(world, Bodies.fromVertices(400, 80, vertexSets, {
            render: {
                fillStyle: color,
                strokeStyle: color,
                lineWidth: 2
            },
            collisionFilter: {
                group: -1,
            },
            isStatic: true
        }, true));
    });
} else {
    Common.warn('Fetch is not available. Could not load SVG.');
}

Composite.add(world, [
    Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
    Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
    Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
    Bodies.rectangle(0, 300, 50, 600, { isStatic: true })
]);

// add mouse control
var mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: {
                visible: false
            }
        }
    });

Events.on(mouseConstraint, 'mouseup', function({mouse}) {
    console.log(mouse);
    var string1 = string(mouse.mouseupPosition.x, mouse.mouseupPosition.y, -1);

    console.log(string1);


    string1.bodies[0].isStatic = true;


    Composite.add(world, [
        string1,
    ]);
})

Composite.add(world, mouseConstraint);

// keep the mouse in sync with rendering
render.mouse = mouse;

// fit the render viewport to the scene
Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: 800, y: 600 }
});

Render.run(render);



function string(xx, yy, group) {
    var particleOptions = Common.extend({ inertia: Infinity, friction: 0.00001, collisionFilter: { group: group }, render: { visible: true } } , {});
    var constraintOptions = Common.extend({ stiffness: 0.06, render: { type: 'line', anchors: false } }, constraintOptions);

    var string = Composites.stack(xx, yy, 1, 12, 5, 5, function(x, y) {
        return Bodies.circle(x, y, 8, particleOptions);
    });

    Composites.mesh(string, 1, 12, false, constraintOptions);
    return string;
}


function makeCloth(xx, yy, columns, rows, columnGap, rowGap, crossBrace, particleRadius, particleOptions, constraintOptions) {
    var Body = Matter.Body,
        Bodies = Matter.Bodies,
        Common = Matter.Common,
        Composites = Matter.Composites;

    var group = Body.nextGroup(true);
    particleOptions = Common.extend({ inertia: Infinity, friction: 0.00001, collisionFilter: { group: group }, render: { visible: false }}, particleOptions);
    constraintOptions = Common.extend({ stiffness: 0.06, render: { type: 'line', anchors: false } }, constraintOptions);

    var cloth = Composites.stack(xx, yy, columns, rows, columnGap, rowGap, function(x, y) {
        return Bodies.circle(x, y, particleRadius, particleOptions);
    });
    console.log(cloth);

    Composites.mesh(cloth, columns, rows, crossBrace, constraintOptions);

    cloth.label = 'Cloth Body';

    return cloth;
};


