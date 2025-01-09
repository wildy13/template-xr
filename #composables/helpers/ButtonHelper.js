import* as THREE from "three";
import { TextHelper } from "./textHelper";

export class ButtonHelper {
    constructor({
        texturePath,
        width,
        height,
        color = 0x33d4ee,
        visible = true,
        label = '',
        fontSize = 0.02,
        texAlign = 'left',
        icon,
    }) {
        let texture;

        if (texturePath) {
            const textureLoader = new THREE.TextureLoader();
            texture = textureLoader.load(texturePath, (texture) => {
                texture.wrapS = THREE.ClampToEdgeWrapping;
                texture.wrapT = THREE.ClampToEdgeWrapping;
                texture.colorSpace = THREE.SRGBColorSpace;
                texture.needsUpdate = true;
            });
        }

        const geometry = new THREE.PlaneGeometry(width, height);
        const material = new THREE.MeshBasicMaterial({ color, opacity: 1, transparent: true, depthWrite: true, side: THREE.DoubleSide });
        const mesh = new THREE.Mesh(geometry, material);

        mesh.visible = visible;
        mesh.name = label;
        if(texture) {
            material.map = texture;
        }
        const boundingBox = new THREE.Box3().setFromObject(mesh);

        switch (texAlign) {
            case 'right':
                const rightText = new TextHelper({ text: label, fontSize, position: { x: boundingBox.max.x - .1, y: 0, z: 0.001 } }, texAlign);
                mesh.add(rightText);
                break;
            case 'left':
                const LeftText = new TextHelper({ text: label, fontSize, position: {  x: boundingBox.min.x + .07, y: 0, z: 0.001 } }, texAlign);
                mesh.add(LeftText);
                break;
            case 'center':
                const centerX = ((boundingBox.min.x + 0.05) + (boundingBox.max.x - 0.07)) / 2;
                const CenterText = new TextHelper({ text: label, fontSize, position: { x: centerX, y: 0, z: 0.001 } }, texAlign);
                mesh.add(CenterText);
                break;
            default:
                console.warn('Please provide a valid text alignment option. Accepted values are: "left", "right", or "center".');
                break;
        }

        mesh.position.z = .001
        return mesh;
    }
}