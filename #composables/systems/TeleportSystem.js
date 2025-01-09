import { System } from 'three/addons/libs/ecsy.module.js';
import { Teleport } from '../components/TeleportComponent';
import { Object3D } from '../../composables/components/Object3DComponent';
import * as THREE from 'three';

export class TeleportSystem extends System {
    init(attributes) {
        this.renderer = attributes.template.renderer;
        this.camera = attributes.template.camera;
    }

    execute() {
        this.queries.teleport.results.forEach(entity => {
            const teleport = entity.getMutableComponent(Teleport);
            const object = entity.getComponent(Object3D).object;
            if (teleport.attachedPointer != null) {
                const intersection = teleport.attachedPointer.raycaster.intersectObjects([object])[0];

                if (intersection) {
                    const point = intersection.point;

                    const baseReferenceSpace = this.renderer.xr.getReferenceSpace()
                    const offsetPosition = { x: point.x, y: point.y, z: point.z };
                    const offsetRotation = new THREE.Quaternion(); // atau rotasi lain jika diperlukan
                    const transform = new XRRigidTransform(offsetPosition, offsetRotation);
                    const teleportSpaceOffset = baseReferenceSpace.getOffsetReferenceSpace(transform);

                    this.renderer.xr.setReferenceSpace(teleportSpaceOffset);

                    console.log("Before teleport:", this.camera.position);
                    console.log("Teleport to:", point);

                }
            }
        });
    }
}

TeleportSystem.queries = {
    teleport: { components: [Teleport] }
};
