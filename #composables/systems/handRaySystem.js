import { System } from 'three/addons/libs/ecsy.module.js';
import { Button } from '../components/ButtonComponent.js';
import { Object3D } from '../../composables/components/Object3DComponent.js';
import { Intersectable } from '../components/IntersectableComponent.js';
import { DraggableReturn } from '../../composables/components/DraggableReturnComponent.js';
import { DraggableDefault } from '../components/DraggableDefaultComponent.js';
import { DraggablePhysique } from '../../composables/components/DraggablePhysiqueComponent.js';
import { Teleport } from '../components/TeleportComponent.js';
export class HandRaySystem extends System {

    init(attributes) {
        this.handPointers = attributes.handPointers;
        this.scene = attributes.scene;
    }

    execute( /*delta, time*/) {

        this.handPointers.forEach(hp => {
            let distance = null;
            let intersectionsPoint = null;
            let intersectingEntity = null;
            this.queries.intersectable.results.forEach(entity => {
                const object = entity.getComponent(Object3D).object;
                let intersections;
                if (this.scene.getObjectById(object.id)) {
                    intersections = hp.intersectObject(object, false);
                }
                if (intersections && intersections.length > 0) {

                    if (distance == null || intersections[0].distance < distance) {
                        distance = intersections[0].distance;
                        intersectingEntity = entity;
                    }

                    if (intersections[0].point || intersectionsPoint == null) {
                        intersectionsPoint = intersections[0].point;
                    }
                }

            });
            if (distance) {

                hp.setCursor(distance);
                if (intersectingEntity.hasComponent(Button)) {

                    const button = intersectingEntity.getMutableComponent(Button);
                    if (hp.isPinched()) {

                        button.currState = 'pressed';

                    } else if (button.currState != 'pressed') {

                        button.currState = 'hovered';

                    }
                }

                if (intersectingEntity.hasComponent(DraggableReturn)) {

                    const draggable = intersectingEntity.getMutableComponent(DraggableReturn);
                    const object = intersectingEntity.getComponent(Object3D).object;
                    object.scale.set(1.1, 1.1, 1.1);

                    if (hp.isPinched()) {

                        if (!hp.isAttached() && draggable.state != 'attached') {

                            draggable.state = 'to-be-attached';
                            draggable.attachedPointer = hp;
                            hp.setAttached(true);
                        }

                    } else {

                        if (hp.isAttached() && draggable.state == 'attached') {
                            console.log('hello return');
                            draggable.state = 'to-be-detached';
                            draggable.attachedPointer = null;
                            hp.setAttached(false);

                        }

                    }
                }

                if (intersectingEntity.hasComponent(DraggableDefault)) {

                    const draggable = intersectingEntity.getMutableComponent(DraggableDefault);
                    const object = intersectingEntity.getComponent(Object3D).object;
                    object.scale.set(1.1, 1.1, 1.1);

                    if (hp.isPinched()) {

                        if (!hp.isAttached() && draggable.state != 'attached') {

                            draggable.state = 'to-be-attached';
                            draggable.attachedPointer = hp;
                            hp.setAttached(true);
                        }

                    } else {

                        if (hp.isAttached() && draggable.state == 'attached') {
                            console.log('hello default');
                            draggable.state = 'to-be-detached';
                            draggable.attachedPointer = null;
                            hp.setAttached(false);

                        }

                    }
                }

                if (intersectingEntity.hasComponent(DraggablePhysique)) {

                    const draggable = intersectingEntity.getMutableComponent(DraggablePhysique);
                    const object = intersectingEntity.getComponent(Object3D).object;
                    object.scale.set(1.1, 1.1, 1.1);

                    if (hp.isPinched()) {

                        if (!hp.isAttached() && draggable.state != 'attached') {

                            draggable.state = 'to-be-attached';
                            draggable.attachedPointer = hp;
                            hp.setAttached(true);
                        }

                    } else {

                        if (hp.isAttached() && draggable.state == 'attached') {
                            console.log('hello phsique');
                            draggable.state = 'to-be-detached';
                            draggable.attachedPointer = null;
                            hp.setAttached(false);

                        }

                    }
                }

                if(intersectingEntity.hasComponent(Teleport)) {
                    const teleport =  intersectingEntity.getMutableComponent(Teleport);
                    const object = intersectingEntity.getComponent(Object3D).object;

                    if(hp.isPinched()) {
                        teleport.state = 'to-be-pinched';
                        teleport.attachedPointer = hp;
                    } else {
                        teleport.state = 'none';
                        teleport.attachedPointer = null;
                    }
                }

            } else {

                hp.setCursor(0.5);

            }

        });

    }

}

HandRaySystem.queries = {
    intersectable: { components: [Intersectable] }
};
