import { System } from 'three/addons/libs/ecsy.module.js';
import { Object3D } from '../components/Object3DComponent.js';
import { DraggablePhysique } from '../components/DraggablePhysiqueComponent.js';
import * as THREE from 'three';

export class DraggablePhysiqueSystem extends System {
    execute() {
        this.queries.draggable.results.forEach(entity => {
            const draggable = entity.getMutableComponent(DraggablePhysique);
            const object = entity.getComponent(Object3D).object;
            const body = entity.getComponent(Object3D).body;

            if (draggable.originalParent == null) {
                draggable.originalParent = object.parent;
            }

            switch (draggable.state) {
                case 'to-be-attached':
                    draggable.attachedPointer.children[0].attach(object);
                    draggable.state = 'attached';

                    break;
                case 'attached':
                    const point = draggable.attachedPointer.raycaster.intersectObjects([object])[0]?.point;
                    const obj = draggable.attachedPointer.raycaster.intersectObjects([object])[0]?.object;

                    if (point) {
                        body.position.copy(point);
                        body.quaternion.copy(obj.quaternion);
                    }

                    body.velocity.set(0, 0, 0);


                    break;
                case 'to-be-detached':
                    draggable.originalParent.attach(object);
                    draggable.state = 'detached';
                    break;
                    
                default:
                    object.scale.set(1, 1, 1);
            }

        });
    }
}

DraggablePhysiqueSystem.queries = {
    draggable: { components: [DraggablePhysique] }
};
