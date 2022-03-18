(function() {
    const Bodies = Matter.Bodies,
        Svg = Matter.Svg,
        Body = Matter.Body;

    class Object extends GS.SD.BaseMatterElement {

        static buttonText = "Добавить объект";

        constructor(world, elements, mouse) {
            super('OBJECT', world, elements, mouse);
            this.moveable = true;
            this.unpinable = true;

        }

        draw(point) {

            this.matterElement = Bodies.circle(point.x, point.y, 50, {
                isStatic: true,
                collisionFilter: {
                    group: -1
                },
            })
        }
    }

    window.GS.SD.Object = Object;
}())
