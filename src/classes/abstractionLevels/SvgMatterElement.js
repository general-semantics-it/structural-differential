import {
    Composite,
    Body,
    Svg
} from "matter-js";
import {BaseMatterElement} from "./BaseMatterElement";

class SvgMatterElement extends BaseMatterElement {
    constructor(type, elements, render, path) {
        super(type, elements, render);
        this.path = path;
        this.vertices = [];
    }

    select(root, selector) {
        return Array.prototype.slice.call(root.querySelectorAll(selector));
    };

    loadSvg(url) {
        return fetch(url)
            .then(function(response) { return response.text(); })
            .then(function(raw) { return (new window.DOMParser()).parseFromString(raw, 'image/svg+xml'); });
    };

    async setVertices() {
        let _ = this;

        return _.loadSvg(_.path).then(function(root) {
            return _.vertices = _.select(root, 'path')
                .map(function(path) {
                    return Svg.pathToVertices(path, 30);
                });

        });

    }
}

export {
    SvgMatterElement
}