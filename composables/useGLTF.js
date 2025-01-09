import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/Addons.js';


/**
 * UseGLTF class for Loading GLTF Models With Draco Compression
 * @param {String} url - THE URL of the GLTF/GLB model to Load
 */
export class UseGLTF {
    /** Private Variable */
    #url;
    #loader;
    #dracoLoader;

    constructor({ url }) {
        console.log(url)
        this.#url = url;
        this.#loader = new GLTFLoader();
        this.#dracoLoader = new DRACOLoader();

        this.scene = {
            gltf: {},
            load: 0
        }

        this.#init();
    }

    #init() {
        this.#dracoLoader.setDecoderPath('/draco/');
        this.#loader.setDRACOLoader(this.#dracoLoader);

        this.#loader.load(this.#url,
            (gltf) => {
                this.scene.gltf = gltf;
            }, (xhr) => {
                this.scene.load = (xhr.loaded / xhr.total * 100)
            }, (error) => {
                console.warn('Something Wrong in here, check it out !!!');
            }
        )

        return this.scene;

    }
}