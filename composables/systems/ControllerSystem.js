import { System } from "three/examples/jsm/libs/ecsy.module.js";
import { ControllerComponent } from "../components/ControllerComponent.js";
import { Object3D } from "../components/Object3DComponent.js";
import * as THREE from "three";
import { DraggableDefault } from "../components/DraggableDefaultComponent.js";
import { DraggableReturn } from "../components/DraggableReturnComponent.js";
import { PanelComponent } from "../components/PanelComponent.js";
import { CreateText } from "../helpers/textHelper.js";
import { ButtonComponent } from "../components/ButtonComponent.js";

export class ControllerSystem extends System {
    init() {
        this.raycaster = new THREE.Raycaster();
        this.tempMatrix = new THREE.Matrix4();
        this.previousButtonStates = {
            left: [],
            right: []
        };
        this.isHover = false;
        this.content = null;
    }

    /*
    execute() {
        this.queries.controllers.results.forEach(entity => {
            const controllerComponent = entity.getComponent(ControllerComponent);
            const object = entity.getComponent(Object3D).object;

            const controllers = controllerComponent.controllers;
            const renderer = controllerComponent.template.renderer;
            const scene = controllerComponent.template.scene;
            const anchors = controllerComponent.template.anchors;

            const session = renderer.xr.getSession();

            if (object.visible && scene.getObjectById(object.id)) {
                if (session) {
                    controllers.forEach((c, i) => {
                        for (const source of session.inputSources) {
                            if (source.handedness === 'left' && c.name === 'left') {
                                const intersections = this.#getIntersection(c, object)

                                if (intersections.length > 0) {
                                    const intersection = intersections[0];

                                    if (c.getObjectByName('Line Left') && intersection.distance) {
                                        const line = c.getObjectByName('Line Left');
                                        line.scale.z = intersection.distance;
                                    }

                                    source.gamepad.buttons.forEach((b, i) => {
                                        const wasPressed = this.previousButtonStates.left[i];

                                        if (b.pressed && !wasPressed) {
                                            const line = c.getObjectByName('Line Left');
                                            this.#ChangeLineController(line, 0x22d3ee);

                                            console.log(i)
                                            switch (i) {
                                                case 0:
                                                    if (entity.hasComponent(DraggableDefault)) {
                                                        const draggable = entity.getMutableComponent(DraggableDefault);
                                                        draggable.state = 'to-be-attached';
                                                        draggable.attachedPointer = c;
                                                        c.userData.attached = true;
                                                    }

                                                    if (entity.hasComponent(DraggableReturn)) {
                                                        const draggable = entity.getMutableComponent(DraggableReturn);
                                                        draggable.state = 'to-be-attached';
                                                        draggable.attachedPointer = c;
                                                        c.userData.attached = true;
                                                    }

                                                    if (entity.hasComponent(PanelComponent)) {
                                                        const panel = entity.getMutableComponent(PanelComponent);
                                                        panel.state = 'to-be-attached';
                                                        panel.attachedPointer = c;
                                                        c.userData.attached = true;
                                                        anchors.visible = true;
                                                    }
                                                    break;
                                                case 1:
                                                    break;
                                                case 2:
                                                    break;
                                                case 3:
                                                    break;
                                                case 4:
                                                    break;
                                                case 5:
                                                    break;
                                                case 6:
                                                    break;
                                                default:
                                                    console.warn("No Button Required");
                                                    break;

                                            }
                                        } else if (!b.pressed && wasPressed) {
                                            const line = c.getObjectByName('Line Left');
                                            if (line.material.color.getHexString() === '22d3ee') {
                                                this.#ChangeLineController(line, 0xffffff);
                                            }
                                            if (c.userData.selected !== undefined) {
                                                const object = c.userData.selected;
                                                scene.attach(object);
                                            } else if (c.userData.attached) {
                                                if (entity.hasComponent(DraggableDefault)) {
                                                    const draggable = entity.getMutableComponent(DraggableDefault);
                                                    draggable.state = 'to-be-detached';
                                                    draggable.attachedPointer = null;
                                                    c.userData.attached = false;
                                                }

                                                if (entity.hasComponent(DraggableReturn)) {
                                                    const draggable = entity.getMutableComponent(DraggableReturn);
                                                    draggable.state = 'to-be-detached';
                                                    draggable.attachedPointer = null;
                                                    c.userData.attached = false;
                                                }

                                                if (entity.hasComponent(PanelComponent)) {
                                                    const panel = entity.getMutableComponent(PanelComponent);
                                                    panel.state = 'to-be-detached';
                                                    panel.attachedPointer = null;
                                                    c.userData.attached = false;
                                                    anchors.visible = false;
                                                }
                                            }
                                        }

                                        this.previousButtonStates.left[i] = b.pressed;
                                    });
                                }

                            } else if (source.handedness === 'right' && c.name === 'right') {
                                const intersections = this.#getIntersection(c, object)

                                if (intersections.length > 0) {
                                    const intersection = intersections[0];

                                    if (c.getObjectByName('Line Right') && intersection.distance) {
                                        const line = c.getObjectByName('Line Right');
                                        line.scale.z = intersection.distance;
                                    }

                                    source.gamepad.buttons.forEach((b, i) => {
                                        const wasPressed = this.previousButtonStates.right[i];

                                        if (b.pressed && !wasPressed) {
                                            const line = c.getObjectByName('Line Right');
                                            this.#ChangeLineController(line, 0x22d3ee);

                                            switch (i) {
                                                case 0:
                                                    if (entity.hasComponent(DraggableDefault)) {
                                                        const draggable = entity.getMutableComponent(DraggableDefault);
                                                        draggable.state = 'to-be-attached';
                                                        draggable.attachedPointer = c;
                                                        c.userData.attached = true;
                                                    }

                                                    if (entity.hasComponent(DraggableReturn)) {
                                                        const draggable = entity.getMutableComponent(DraggableReturn);
                                                        draggable.state = 'to-be-attached';
                                                        draggable.attachedPointer = c;
                                                        c.userData.attached = true;
                                                    }

                                                    if (entity.hasComponent(PanelComponent)) {
                                                        const panel = entity.getMutableComponent(PanelComponent);
                                                        panel.state = 'to-be-attached';
                                                        panel.attachedPointer = c;
                                                        c.userData.attached = true;
                                                        anchors.visible = true;
                                                    }
                                                    break;
                                                case 1:
                                                    break;
                                                case 2:
                                                    break;
                                                case 3:
                                                    break;
                                                case 4:
                                                    break;
                                                case 5:
                                                    break;
                                                case 6:
                                                    break;
                                                default:
                                                    console.warn("No Button Required");
                                                    break;

                                            }
                                        } else if (!b.pressed && wasPressed) {
                                            const line = c.getObjectByName('Line Right');
                                            if (line.material.color.getHexString() === '22d3ee') {
                                                this.#ChangeLineController(line, 0xffffff);
                                            }
                                            if (c.userData.selected !== undefined) {
                                                const object = c.userData.selected;
                                                scene.attach(object);
                                            } else if (c.userData.attached) {
                                                if (entity.hasComponent(DraggableDefault)) {
                                                    const draggable = entity.getMutableComponent(DraggableDefault);
                                                    draggable.state = 'to-be-detached';
                                                    draggable.attachedPointer = null;
                                                    c.userData.attached = false;
                                                }

                                                if (entity.hasComponent(DraggableReturn)) {
                                                    const draggable = entity.getMutableComponent(DraggableReturn);
                                                    draggable.state = 'to-be-detached';
                                                    draggable.attachedPointer = null;
                                                    c.userData.attached = false;
                                                }

                                                if (entity.hasComponent(PanelComponent)) {
                                                    const panel = entity.getMutableComponent(PanelComponent);
                                                    panel.state = 'to-be-detached';
                                                    panel.attachedPointer = null;
                                                    c.userData.attached = false;
                                                    anchors.visible = false;
                                                }
                                            }
                                        }

                                        this.previousButtonStates.right[i] = b.pressed;
                                    });
                                }
                            }
                        }
                    });
                }

            }

        });
    } */

    execute() {
        this.queries.controllers.results.forEach(entity => {
            const controllerComponent = entity.getComponent(ControllerComponent);
            const object = entity.getComponent(Object3D).object;
            const { controllers, template: { renderer, scene, anchors } } = controllerComponent;
            const session = renderer.xr.getSession();

            if (object.visible && scene.getObjectById(object.id) && session) {
                controllers.forEach((controller, i) => {
                    this.#handleControllerInteraction(controller, entity, scene, anchors, session, i);
                });
            }
        })
    }

    #handleControllerInteraction(controller, entity, scene, anchors, session, controllerIndex) {
        session.inputSources.forEach((source, index) => {
            if (source.handedness === controller.name) {
                const intersections = this.#getIntersection(controller, entity.getComponent(Object3D).object);

                if (intersections.length > 0) {
                    const intersection = intersections[0];
                    this.#updateControllerLine(controller, intersection, controllerIndex);

                    source.gamepad.buttons.forEach((button, index) => {
                        this.#handleButtonPress(button, index, controller, entity, scene, anchors, controllerIndex, intersection);
                    });

                    this.#handleHoverUI(controller, entity, scene, anchors, controllerIndex, intersection);
                }

            }
        });
    }

    #updateControllerLine(controller, intersection, controllerIndex) {
        const line = controller.getObjectByName(`Line ${controller.name.charAt(0).toUpperCase() + controller.name.slice(1)}`);
        if (line && intersection.distance) {
            line.scale.z = intersection.distance;
        }
    }

    #handleButtonPress(button, index, controller, entity, scene, anchors, controllerIndex, intersection) {
        const wasPressed = controller.name === 'left' ? this.previousButtonStates.left[index] : this.previousButtonStates.right[index];

        //this.#handleHover(entity, controller, intersection, scene);

        if (button.pressed && !wasPressed) {
            console.log(index)
            const line = controller.getObjectByName(`Line ${controller.name.charAt(0).toUpperCase() + controller.name.slice(1)}`);
            this.#ChangeLineController(line, 0x22d3ee);

            this.#processButtonAction(index, controller, entity, scene, anchors, intersection);
        } else if (!button.pressed && wasPressed) {
            const line = controller.getObjectByName(`Line ${controller.name.charAt(0).toUpperCase() + controller.name.slice(1)}`);
            if (line.material.color.getHexString() === '22d3ee') {
                this.#ChangeLineController(line, 0xffffff);
            }
            this.#detachObjectIfNeeded(controller, entity, scene, anchors, index);
        }

        if (button.pressed) {
            const line = controller.getObjectByName(`Line ${controller.name.charAt(0).toUpperCase() + controller.name.slice(1)}`);
            if (line.material.color.getHexString() !== '22d3ee') {
                this.#ChangeLineController(line, 0x22d3ee); // Memastikan garis tetap biru jika tombol tetap ditekan
            }
        }
        controller.name == 'left' ? this.previousButtonStates.left[index] = button.pressed : this.previousButtonStates.right[index] = button.pressed;
    }

    #processButtonAction(index, controller, entity, scene, anchors, intersection) {
        if (controller.userData.attached && index == 3) {
            this.#handleSnapToController(controller, entity);
            return;
        }
        switch (index) {
            case 0:
                this.#handleAttachmentActions(controller, entity, scene, anchors);
                break;
            case 1:
                this.#handleSnapToController(controller, entity, intersection);
                break;
            default:
                console.warn("No Button Required");
                break;
        }
    }

    /*
       #handleHover(entity, controller, intersection, scene) {
           if (entity.hasComponent(DraggableDefault) || entity.hasComponent(DraggableReturn)) {
               if (this.isHover == false && this.content == null) {
                   const content = new CreateText({
                       text: intersection.object.name,
                       textAlign: 'left',
                       fontSize: 0.02,
                       position: intersection.point.add(new THREE.Vector3(0, 0.006, 0)),
                       color: 0xd1d5db,
                       maxWidth: 1
                   });
                   content.name = 'label';
                   this.content = content;
                   this.isHover = true;
   
                   scene.add(content);
                   controller.userData.isHover = true;
               } else if (this.isHover == true && this.content != null) {
                   this.content.position.copy(intersection.point.add(new THREE.Vector3(0, 0.006, 0)));
               } 
   
           }
       }
    */


    #handleHoverUI(controller, entity, scene, anchors, controllerIndex, intersection) {
        if(entity.hasComponent(ButtonComponent)) {
            const button = entity.getMutableComponent(ButtonComponent);
            
            if(button.currState != 'pressed') {
                button.currState = 'hovered';
            }
            
        }
    }

    #handleAttachmentActions(controller, entity, scene, anchors) {
        if (entity.hasComponent(DraggableDefault)) {
            const draggable = entity.getMutableComponent(DraggableDefault);
            draggable.state = 'to-be-attached';
            draggable.attachedPointer = controller;
            controller.userData.attached = true;
        }

        if (entity.hasComponent(DraggableReturn)) {
            const draggable = entity.getMutableComponent(DraggableReturn);
            draggable.state = 'to-be-attached';
            draggable.attachedPointer = controller;
            controller.userData.attached = true;
        }

        if (entity.hasComponent(PanelComponent)) {
            const panel = entity.getMutableComponent(PanelComponent);
            panel.state = 'to-be-attached';
            panel.attachedPointer = controller;
            controller.userData.attached = true;
            anchors.visible = true;
        }

        if(entity.hasComponent(ButtonComponent)) {
            const button = entity.getMutableComponent(ButtonComponent);
            button.currState = 'pressed';
        }
    }

    #handleSnapToController(controller, entity, intersection) {
        if (!controller.userData.attached) {
            console.warn("Object must be dragged before snapping");
            return;
        }

        if (entity.hasComponent(DraggableReturn)) {
            const draggable = entity.getMutableComponent(DraggableReturn);
            draggable.state = 'to-be-draggable';
            draggable.attachedPointer = controller;
            controller.userData.draggable = true;
        }

        if (entity.hasComponent(DraggableDefault)) {
            const draggable = entity.getMutableComponent(DraggableDefault);
            draggable.state = 'to-be-draggable';
            draggable.attachedPointer = controller;
            controller.userData.draggable = true;
        }
    }

    #detachObjectIfNeeded(controller, entity, scene, anchors, index) {
        if (controller.userData.attached && index != 1) {
            this.#detachDraggableComponent(controller, entity);
            this.#detachPanelComponent(controller, entity, anchors);
            
            const wasPressed = controller.name === 'left' ? this.previousButtonStates.left[3] : this.previousButtonStates.right[3];
            if(wasPressed) {
                const line = controller.getObjectByName(`Line ${controller.name.charAt(0).toUpperCase() + controller.name.slice(1)}`);
                if (line.material.color.getHexString() === '22d3ee') {
                    this.#ChangeLineController(line, 0xffffff);
                }
            }
        }
    }

    #detachDraggableComponent(controller, entity) {
        if (entity.hasComponent(DraggableDefault)) {
            const draggable = entity.getMutableComponent(DraggableDefault);
            draggable.state = 'to-be-detached';
            draggable.attachedPointer = null;
            controller.userData.attached = false;
        }

        if (entity.hasComponent(DraggableReturn)) {
            const draggable = entity.getMutableComponent(DraggableReturn);
            draggable.state = 'to-be-detached';
            draggable.attachedPointer = null;
            controller.userData.attached = false;
        }
    }

    #detachPanelComponent(controller, entity, anchors) {
        if (entity.hasComponent(PanelComponent)) {
            const panel = entity.getMutableComponent(PanelComponent);
            panel.state = 'to-be-detached';
            panel.attachedPointer = null;
            controller.userData.attached = false;
            anchors.visible = false;
        }
    }

    #getIntersection(controller, object) {
        this.tempMatrix.identity().extractRotation(controller.matrixWorld);
        this.raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
        this.raycaster.ray.direction.set(0, 0, -1).applyMatrix4(this.tempMatrix);

        return this.raycaster.intersectObject(object, true);
    }

    #ChangeLineController(line, color) {
        if (line && line.material) {
            line.material.color.set(color);
        }
    }
}

ControllerSystem.queries = {
    controllers: {
        components: [ControllerComponent]
    }
};
