import * as THREE from 'three';

export class CreateIconHelper {
    constructor({
        iconPath,
        visible,
        width,
        height,
        mesh,
        position = { x: -.07, y: 0, z: 0.0001 },
    }) {
        const textureLoader = new THREE.TextureLoader();
        const logoTexture = textureLoader.load(iconPath, (texture) => {
            texture.wrapS = THREE.ClampToEdgeWrapping;
            texture.wrapT = THREE.ClampToEdgeWrapping;
            texture.needsUpdate = true;
            texture.colorSpace = THREE.SRGBColorSpace;
        });

        const logoGeometry = new THREE.PlaneGeometry(width, height);
        const logoMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            opacity: 1,
            map: logoTexture,
            transparent: true,
            alphaTest: 0.1,
        });
        const logo = new THREE.Mesh(logoGeometry, logoMaterial);
        logo.scale.set(0.25, 0.5, 0.5);
        logo.position.set(position.x, position.y, position.z)
        logo.visible = visible;

        if(mesh){
            mesh.add(logo);
        }
        
        return logo;
    }
}