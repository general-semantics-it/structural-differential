(function() {
    class BaseElement {

        constructor() {
            this._domElement = null;
            this._children = [];
            this._parent = null;
        }

        attach(component, index) {
            if(component._parent) {
                component._parent.detach(component);
            }

            component._parent = this;

            if(typeof index !== 'undefined') {
                this._children.splice(index, 0, component)
            } else {
                this._children.push(component);
            }
        }

        detach(component) {
            let componentIndex = this._children.indexOf(component);

            if(component === -1) {
                return;
            }

            this._children.splice(componentIndex, 1);
        }

        children() {
            return this._children.slice();
        }

        domElement() {
            return this._domElement;
        }

        parent() {
            return this._parent
        }

        mount() {}

        unmount() {
            if(!this.isMounted()) {
                return;
            }

            if(this._domElement.parentNode) {
                this._domElement.parentNode.removeChild(this._domElement);
            }

            this._domElement = null;
        }

        isMounted() {
            return this._domElement != null;
        }
    }

    if(typeof window.GS === 'undefined') {
        window.GS = {};
    }

    if(typeof window.GS.SD === 'undefined') {
        window.GS.SD = {};
    }
    window.GS.SD.BaseElement = BaseElement;
}())