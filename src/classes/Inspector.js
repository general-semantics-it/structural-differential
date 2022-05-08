import $ from "jquery";
require('jstree');
require('@@/jstree/dist/themes/default/style.min.css')

class Inspector {

    constructor(sd) {
        this.sd = sd;
        this.$container = $('.ins-world-tree');
        this.ul = document.createElement('UL')
    }

    create() {
        this.update();

    }

    update() {
        this.$container.jstree({
            'core' : {
                'data' : [
                    'Simple root node',
                    {
                        'id' : 'node_2',
                        'text' : 'Root node with options',
                        'state' : { 'opened' : true, 'selected' : true },
                        'children' : [ { 'text' : 'Child 1' }, 'Child 2']
                    }
                ]
            }
        })
        this.ul.innerHTML = "";
        this.sd.elements.forEach((el, index) => {

            let li = document.createElement('LI');
            li.addEventListener('click', () => {
                el.removeFromWorld();
                this.sd.elements.splice(index, 1);
                this.update();
            })
            li.textContent = el.label + " " + index;
            this.ul.appendChild(li);
        });

    }
}

export {
    Inspector
}