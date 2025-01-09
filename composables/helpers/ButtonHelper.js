import * as THREE from 'three';
import { CreateText } from './textHelper';

export class ButtonHelper extends THREE.Mesh {
    constructor({ position = { x: 0, y: 0 }, label, texturePath, color }) {
        const geometry = new THREE.PlaneGeometry(0.15, 0.04);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff })

        let texture;

        if (texturePath) {
            const loader = new THREE.TextureLoader();
            texture = loader.load(texturePath, (texture) => {
                texture.wrapS = THREE.ClampToEdgeWrapping;
                texture.wrapT = THREE.ClampToEdgeWrapping;
                texture.colorSpace = THREE.SRGBColorSpace;
                texture.needsUpdate = true;
            });
            material.opacity = 1;
            material.transparent = true;
            material.depthWrite = true;
            material.side = THREE.DoubleSide;
            material.map = texture;
        }

        super(geometry, material);

        if (label) {
            const text = new CreateText({ text: label });
            this.add(text);
        }
        this.name = `Button ${label}`;
        this.position.set(position.x, position.y, 0.001);

        return this;
    }
}