(function() {
    class AbstractedProperty extends GS.SD.BaseMatterElement {

        constructor(x, y, group) {
            super();
            this.x = x;
            this.y = y;
            this.group = group;
        }

        draw() {
            let Common = Matter.Common,
                Composites = Matter.Composites,
                Bodies = Matter.Bodies;
            let particleOptions = Common.extend({ inertia: Infinity, friction: 0.00001, collisionFilter: { group: this.group }, render: { visible: false } } , {});
            let constraintOptions = Common.extend({ stiffness: 0.06, render: { type: 'line', anchors: false } });

            this._matterElement = Composites.stack(this.x, this.y, 1, 12, 5, 5, function(x, y, column, row) {

                particleOptions.render.visible = row === 0;
                return Bodies.circle(x, y, 8, particleOptions);
            });


            Composites.mesh(this._matterElement, 1, 12, false, constraintOptions);
            this._matterElement.bodies[0].isStatic = true;
        }

    }
    if(typeof window.GS === 'undefined') {
        window.GS = {};
    }

    if(typeof window.GS.SD === 'undefined') {
        window.GS.SD = {};
    }
    window.GS.SD.AbstractedProperty = AbstractedProperty;
}())



