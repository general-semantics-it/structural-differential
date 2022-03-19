(function() {
    const Bodies = Matter.Bodies,
        Svg = Matter.Svg,
        Body = Matter.Body;

    class Conclusion extends GS.SD.BaseMatterElement {

        static buttonText = "Добавить заключение";

        constructor(elements, render) {
            super('CONCLUSION', elements, render);
            this.label = 'conclusion';
            this.moveable = true;
            //this.unpinable = true;
        }

        async create(point) {

            this.matterElement = Bodies.rectangle(point.x, point.y, 100, 150, {
                collisionFilter: {
                    group: -1
                },
                chamfer: {
                    radius:  10
                },
                isStatic: true
            })
        }
    }

    window.GS.SD.Conclusion = Conclusion;
}())