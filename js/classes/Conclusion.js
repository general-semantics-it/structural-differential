(function() {
    const Bodies = Matter.Bodies,
        Svg = Matter.Svg,
        Body = Matter.Body;

    class Conclusion extends GS.SD.BaseMatterElement {

        static buttonText = "Добавить заключение";

        constructor(world, elements, mouse) {
            super('CONCLUSION', world, elements, mouse);
            this.moveable = true;
            this.unpinable = true;
        }

        draw(point) {

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
    if(typeof window.GS === 'undefined') {
        window.GS = {};
    }

    if(typeof window.GS.SD === 'undefined') {
        window.GS.SD = {};
    }
    window.GS.SD.Conclusion = Conclusion;
}())