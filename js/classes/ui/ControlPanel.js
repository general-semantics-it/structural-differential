(function() {
    class ControlPanel extends GS.SD.BaseElement {

        constructor() {
            super();

        }

        mount() {
            this._domElement = document.createElement('DIV');
            this._domElement.classList.add('controls');

            this._domAbstract = document.createElement('BUTTON');
            this._domAbstract.textContent = "Абстрагировать свойство";

            this._domElement.appendChild(this._domAbstract);
            this.parent()._domElement.appendChild(this._domElement)

            this._domElement.addEventListener('click', function() {

            })
        }


    }

    if(typeof window.GS === 'undefined') {
        window.GS = {};
    }

    if(typeof window.GS.SD === 'undefined') {
        window.GS.SD = {};
    }
    window.GS.SD.ControlPanel = ControlPanel;
}());