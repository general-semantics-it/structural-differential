(function() {
    class BaseMatterElement {
        constructor() {
            this._matterElement = null;
        }

        matterElement() {
            return this._matterElement;
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