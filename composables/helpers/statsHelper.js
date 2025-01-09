import { HTMLMesh } from "three/examples/jsm/Addons.js";
import Stats from "three/examples/jsm/libs/stats.module.js";

/**
 *  @param {HTMLElement} container - The DOM element container for the stats.
 */
export class StatsHelper {
    constructor({ container }) {
        this.container = container;

        this.stats = new Stats();
        this.stats.dom.style.width = '80px';
        this.stats.dom.style.height = '48px';
        this.container.appendChild(this.stats.dom);

        this.statsMesh = new HTMLMesh(this.stats.dom);
    }
}