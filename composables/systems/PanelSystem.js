import { System } from 'three/addons/libs/ecsy.module.js';
import { Object3D } from '../../composables/components/Object3DComponent.js';
import { PanelComponent } from '../components/PanelComponent.js';
import { Box3, Vector3 } from 'three';

export class PanelSystem extends System {
    init() {
        this.anchor = null;
    }
    execute() {
        this.queries.panel.results.forEach(entity => {
            const panel = entity.getMutableComponent(PanelComponent);
            const object = entity.getComponent(Object3D).object;

            if (panel.originalParent == null) {
                panel.originalParent = object.parent;
            }
            
            switch (panel.state) {
                case 'to-be-attached':
                    panel.attachedPointer.attach(object);
                    panel.state = 'attached';
                    break;

                case 'attached':
                    const worldPosition = new Vector3();
                    object.getWorldPosition(worldPosition);

                    panel.anchors.children.forEach(anchor => {
                        const anchorWorldPosition = new Vector3();
                        anchor.getWorldPosition(anchorWorldPosition);
                        if (Math.abs(anchorWorldPosition.x - worldPosition.x) < 0.1) {
                            this.anchor = anchor;
                        }
                    });
                    break;
                case 'to-be-detached':
                    panel.originalParent.attach(object);
                    panel.state = 'detached';

                    if (this.anchor) {
                        const anchorWorldPosition = new Vector3();
                        this.anchor.getWorldPosition(anchorWorldPosition);

                        const anc = this.#getObjectSize(this.anchor);
                        const obj = this.#getObjectSize(object);

                        object.scale.set(anc.width / obj.width, anc.height / obj.height, anc.depth / obj.depth);
                        object.position.copy(anchorWorldPosition);
                        object.quaternion.copy(this.anchor.quaternion);
                    }
                    break;
                default:
                    object.scale.set(1, 1, 1);
            }
        });
    }

    #getObjectSize(object) {
        const box = new Box3().setFromObject(object);
        const size = new Vector3();
        box.getSize(size);

        return {
            width: size.x,
            height: size.y,
            depth: size.z
        };
    }

}

PanelSystem.queries = {
    panel: { components: [PanelComponent] }
};
