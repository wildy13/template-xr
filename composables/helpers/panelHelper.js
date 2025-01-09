import * as THREE from 'three';

export class PanelHelper extends THREE.Mesh {
    constructor(
        {
            position = { x: 0, y: 1 },
            rotation = { x: 0, y: 0, z: 0 },
            width = 1,
            height = 0.5,
            opacity = 0.5,
            color = 0x22d3ee,
            texturePath
        }
    ) {
        const geometry = new THREE.PlaneGeometry(width, height);
        const material = new THREE.MeshBasicMaterial({
            color,
        });

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
        super(geometry, material)

        this.position.set(position.x, position.y, -0.7999999999999998);
        this.rotation.set(rotation.x, rotation.y, rotation.z);

        return this;
    }
}