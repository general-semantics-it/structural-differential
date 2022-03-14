(function() {
    var Composite = Matter.Composite,
        Bodies = Matter.Bodies,
        Constraint = Matter.Constraint,
        Common = Matter.Common,
        Svg = Matter.Svg;

    class Process {
        vertices = [];
        color = Common.choose(['#f19648', '#f5d259', '#f55a3c', '#063e7b', '#ececd1']);
        _pinConstraint;

        constructor(world) {
            this.world = world;
            this.init();
        }

        async init() {
            await this.setVertices();
            this.addToWorld();
        }

        select(root, selector) {
            return Array.prototype.slice.call(root.querySelectorAll(selector));
        };

        async loadSvg(url) {
            return fetch(url)
                .then(function(response) { return response.text(); })
                .then(function(raw) { return (new window.DOMParser()).parseFromString(raw, 'image/svg+xml'); });
        };

        async setVertices() {
            let _ = this;

            await _.loadSvg('./svg/process.svg').then(function(root) {
                _.vertices = _.select(root, 'path')
                    .map(function(path) {
                        return Svg.pathToVertices(path, 30);
                    });

            });

        }

        addToWorld() {

            this.draw();

            Composite.add(this.world, [
                this._matterElement
            ]);
        }

        draw() {
            this._matterElement = Bodies.fromVertices(400, 200, this.vertices, {
                render: {
                    fillStyle: this.color,
                    strokeStyle: this.color,
                    lineWidth: 2
                },
                collisionFilter: {
                    group: -1,
                },
                plugin: {
                    type: 'process',
                },
                isStatic: true
            }, true);
        }

    }
    if(typeof window.GS === 'undefined') {
        window.GS = {};
    }

    if(typeof window.GS.SD === 'undefined') {
        window.GS.SD = {};
    }
    window.GS.SD.Process = Process;
}())
