(function() {
    const Bodies = Matter.Bodies,
        Svg = Matter.Svg,
        Body = Matter.Body;

    class Process extends GS.SD.SvgMatterElement {

        static buttonText = "Добавить процесс";

        constructor(elements, render) {
            super('PROCESS', elements, render, './svg/process.svg');
            this.label = 'process';
            this.moveable = true;
            this.unpinable = false;
        }

        async create(point) {
            await this.setVertices();

            this.matterElement = Bodies.fromVertices(point.x, point.y, this.vertices, {
                render: {
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
    }

    window.GS.SD.Process = Process;
}())
