import * as THREE from 'three';
import { TextHelper } from './textHelper.js';

/**
 * @param {string} [texturePath] - the path of texture for panel
 * @param {number} [opacity] - opacity of panel,
 * @param {boolean} [transparent] - transparent of panel
 * @param {number} [width] - width of panel,
 * @param {number} [height] - height of panel
 * @param {number} [scaleY] - height of panel
 * @param {number} [scaleX] - height of panel
 */
export class PanelHelper {
    constructor({
        texturePath = '',
        opacity = 1,
        transparent = true,
        scale = { x: 1, y: 1, z: 1 },
        position = { x: 0, y: 1, z: -1 },
        rotation = { x: 0, y: 0, z: 0 },
        width,
        height,
        visible = true,
        content = {
            title,
            fontSize,
            textAlign,
            position,
            rotation,
            maxWidth
        },
        footer = false
    }) {
        content.maxWidth = 1;
        const textureLoader = new THREE.TextureLoader();
        const panelTexture = textureLoader.load(texturePath, (texture) => {
            texture.wrapS = THREE.ClampToEdgeWrapping;
            texture.wrapT = THREE.ClampToEdgeWrapping;
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.needsUpdate = true;
        });

        if (width && height) {
            const panelGeometry = new THREE.PlaneGeometry(width, height);
            const panelMaterial = new THREE.MeshBasicMaterial({
                color: 0x22d3ee,
                opacity,
                transparent,
                map: panelTexture,
                side: THREE.DoubleSide,
            });

            const panelMesh = new THREE.Mesh(panelGeometry, panelMaterial);
            panelMesh.scale.set(scale.x, scale.y, scale.z);
            panelMesh.position.set(position.x, position.y, position.z);
            panelMesh.rotation.set(rotation.x * (Math.PI / 180), rotation.y * (Math.PI / 180), rotation.z * (Math.PI / 180));
            panelMesh.visible = visible;
            panelMesh.name = `panel ${content.title}`;

            // get width of mesh
            if (content) {
                const title = new TextHelper({
                    text: content.title,
                    fontSize: content.fontSize,
                    position: content.position,
                    textAlign: content.textAlign,
                });
                panelMesh.add(title);
            }

            if (footer) {
                const footer = new TextHelper({
                    text: '@2024 Web Virtual Reality | Powered by Labtech Penta International',
                    position: { x: 0, y: -.25, z: 0.001 },                    
                });
                panelMesh.add(footer);
            }
            return panelMesh;
        } else {
            console.warn('Please input width and height value to your panel');
        }

    }
}