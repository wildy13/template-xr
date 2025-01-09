import { System } from 'three/addons/libs/ecsy.module.js';
import { Object3D } from '../../composables/components/Object3DComponent.js';
import { DraggableDefault } from '../components/DraggableDefaultComponent.js';
import * as THREE from 'three';

export class DraggableDefaultSystem extends System {
    execute() {
        this.queries.draggable.results.forEach(entity => {
            const draggable = entity.getMutableComponent(DraggableDefault);
            const object = entity.getComponent(Object3D).object;

            if (draggable.originalParent == null) {
                draggable.originalParent = object.parent;
            }

            switch (draggable.state) {
                case 'to-be-attached':
                    draggable.attachedPointer.attach(object);
                    draggable.state = 'attached';
                    break;
                case 'to-be-detached':
                    draggable.originalParent.attach(object);
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
            }
        });
    }
}

DraggableDefaultSystem.queries = {
    draggable: { components: [DraggableDefault] }
};
