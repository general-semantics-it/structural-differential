(function() {
    var Composite = Matter.Composite,
        Bodies = Matter.Bodies,
        Constraint = Matter.Constraint,
        Common = Matter.Common,
        Svg = Matter.Svg,
        Body = Matter.Body;

    class Process extends GS.SD.BaseMatterElement {

        static buttonText = "Добавить процесс";

        vertices = [];
        color = Common.choose(['#f19648', '#f5d259', '#f55a3c', '#063e7b', '#ececd1']);


        constructor(world, elements, mouse) {
            super('PROCESS', world, elements, mouse);

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

        correctPositionResolver() {
            Body.translate(this.matterElement, {
                x: (this.matterElement.position.x - this.mouse.position.x) * -1,
                y: (this.matterElement.position.y - this.mouse.position.y) * -1,
            });
        }

        matterTypeResolver() {
            return Body;
        }


        async draw(point) {
            await this.setVertices();

            this.matterElement = Bodies.fromVertices(point.x, point.y, this.vertices, {
                render: {
                    fillStyle: this.color,
                    strokeStyle: this.color,
                    lineWidth: 2
                },
                collisionFilter: {
                    group: -1,
                },
                plugin: {
                    type: 'PROCESS',
                },
                isStatic: true
            }, true);
        }

        place() {

        }

        beforeMove() {
            Body.setStatic(this.matterElement, false);
        }

        afterMove() {
            Body.setStatic(this.matterElement, true);
        }


        containsPointResolver(point) {
            return Vertices.contains(this.matterElement.vertices, point);
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
