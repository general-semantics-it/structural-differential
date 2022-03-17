(function() {

    const Composite = Matter.Composite;
    const Body = Matter.Body;

    class BaseMatterElement {
        constructor(type, world, elements, mouse) {
            this.type = type;
            this.world = world;
            this.mouse = mouse;
            this.matterElement = null;
            this.prevMousePosition = null;
            this.elements = elements;
        }

        correctPosition(mouse) {

            if(!this.prevMousePosition) {
                this.correctPositionResolver();

                this.prevMousePosition = {
                    x: mouse.position.x,
                    y: mouse.position.y,
                };
            }
        }

        correctPositionResolver() {
            throw Error('You need to declare [correctPositionResolver] function');
        }

        matterTypeResolver() {
            throw Error('You need to declare [matterTypeResolver] function');
        }

        containsPointResolver() {
            throw Error('You need to declare [containsPoint] function');
        }

        beforeMove() {
            throw Error('You need to declare [beforeMove] function');
        }

        afterMove() {
            throw Error('You need to declare [afterMove] function');
        }


        move(mouse) {
            this.correctPosition(mouse)

            this.matterTypeResolver().translate(this.matterElement, {
                x:  mouse.position.x - this.prevMousePosition.x,
                y:  mouse.position.y - this.prevMousePosition.y,
            });

            this.prevMousePosition = {
                x: mouse.position.x,
                y: mouse.position.y,

            };
        }
    }

    if(typeof window.GS === 'undefined') {
        window.GS = {};
    }

    if(typeof window.GS.SD === 'undefined') {
        window.GS.SD = {};
    }
    window.GS.SD.BaseMatterElement = BaseMatterElement;
}())