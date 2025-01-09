import * as THREE from 'three';
import { System } from 'three/addons/libs/ecsy.module.js';
import { Object3D } from '../components/Object3DComponent.js';
import { DraggableReturn } from '../components/DraggableReturnComponent.js';

export class DraggableReturnSystem extends System {
    execute() {
        this.queries.draggable.results.forEach(entity => {
            const draggable = entity.getMutableComponent(DraggableReturn);
            const object = entity.getComponent(Object3D).object;

            if (draggable.originalParent == null) {
                draggable.originalParent = object.parent;
            }

            if (draggable.originalPosition == null) {
                this.globalPosition = new THREE.Vector3();
                object.updateWorldMatrix(true, true);
                object.getWorldPosition(this.globalPosition);
                draggable.originalPosition = draggable.originalParent.worldToLocal(this.globalPosition.clone());
            }
            if (draggable.originalQuaternion == null) {
                draggable.originalQuaternion = object.quaternion.clone();
            }

            switch (draggable.state) {
                case 'to-be-attached':
                    draggable.attachedPointer.attach(object);
                    draggable.state = 'attached';
                    break;
                case 'to-be-detached':
                    draggable.originalParent.attach(object);

                    object.position.copy(draggable.originalPosition);
                    object.quaternion.copy(draggable.originalQuaternion);
                    object.updateMatrixWorld(true);

                    draggable.state = 'detached';
                    break;
                case 'to-be-draggable':
                    object.position.z = THREE.MathUtils.damp(object.position.z, -0.3, 0.1, 0.6);
                    if (Math.abs(object.position.z - 0.1) < 0.01) {
                        draggable.state = 'attached';
                    }
                    break;
                default:
                    object.scale.set(1, 1, 1);
                    break;

            }
        });
    }
}

DraggableReturnSystem.queries = {
    draggable: { components: [DraggableReturn] }
};
