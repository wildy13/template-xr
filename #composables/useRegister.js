import { HandRaySystem } from "./systems/handRaySystem.js";
import { HandsInstructionText } from './components/HandsInstructionText.js';
import { InstructionSystem } from './systems/InstructionSystem.js';
import { Button } from "./components/ButtonComponent.js";
import { ButtonSystem } from './systems/ButtonSystem.js';
import { Object3D } from "../composables/components/Object3DComponent.js";
import { Intersectable } from "./components/IntersectableComponent.js";
import { DraggableReturn } from "./components/DraggableReturnComponent.js";
import { DraggableReturnSystem } from "./systems/DraggableReturnSystem.js";
import { DraggableDefault } from "./components/DraggableDefaultComponent.js";
import { DraggableDefaultSystem } from "./systems/DraggableDefaultSystem.js";
import { DraggablePhysique } from "./components/DraggablePhysiqueComponent.js";
import { DraggablePhysiqueSystem } from "./systems/DraggablePhysiqueSystem.js";
import { TeleportSystem } from "./systems/TeleportSystem.js";
import { Teleport } from "./components/TeleportComponent.js";

/**
 * @typedef {Object} ButtonConfig
 * @property {Object} mesh - The mesh object associated with the button.
 * @property {function} onClick - The function to execute on button click.

 * @typedef {Object} PanelConfig
 * @property {Object[]} mesh - Array of mesh objects for the panel.

 * @typedef {Object} Options
 * @property {("button" | "panel" | "draggable-return" | "draggable-default")[]} requiredFeatures - Available features for requiredFeatures.
 * @property {PanelConfig} panel - Configuration object for panel meshes.
 * @property {Object[]} controllers - Array of controller objects.
 * @property {Object[]} handPointers - Array of hand pointer objects.
 * @property {ButtonConfig[]} button - Array of button configurations.
 * @property {Object[]} draggableReturn - Array of objects to make draggable and returnable.
 * @property {Object[]} draggableDefault - Array of objects to make draggable and not return.
 * @property {Object} scene - The main scene object.

 * @param {Object} params - Parameters for `useRegister`.
 * @param {Object} params.world - The ECS world instance.
 * @param {Options} params.options - Configuration options.
 */


export class useRegister {
    constructor({
        world = null,
        options = {
            requiredFeatures: [],
            panel: { mesh: [] },
            controllers: [],
            handPointers: [],
            button: [{
                mesh: null,
                onClick: () => { }
            }],
            draggableReturn: [],
            draggableDefault: [],
            draggablePhysique: [{ mesh: null, body: null }],
            template: null,
            teleport: []
        }
    }) {

        if (!world.hasRegisteredComponent(Object3D)) {
            world.registerComponent(Object3D);
        }
        if (!world.hasRegisteredComponent(Intersectable)) {
            world.registerComponent(Intersectable);
            world.registerSystem(HandRaySystem, { handPointers: options.handPointers, scene: options.template.scene });
        }

        if (!world.hasRegisteredComponent(HandsInstructionText)) {
            world.registerComponent(HandsInstructionText);
            world.registerSystem(InstructionSystem, { controllers: options.controllers });
        }

        const validFeatures = ['button', 'panel', 'draggable-return', 'draggable-physique', 'draggable-default', 'teleport']

        options.requiredFeatures.forEach(val => {
            switch (val.toLowerCase()) {
                case 'draggable-return':
                    world.registerComponent(DraggableReturn);
                    world.registerSystem(DraggableReturnSystem);

                    if (options.draggableReturn) {
                        for (let i = 0; i < options.draggableReturn.length; i++) {
                            const entity = world.createEntity();
                            entity.addComponent(Object3D, { object: options.draggableReturn[i] });
                            entity.addComponent(Intersectable);
                            entity.addComponent(DraggableReturn);
                        }
                    }
                    break;
                case 'draggable-default':
                    world.registerComponent(DraggableDefault);
                    world.registerSystem(DraggableDefaultSystem);

                    if (options.draggableDefault) {
                        for (let i = 0; i < options.draggableDefault.length; i++) {
                            const entity = world.createEntity();
                            entity.addComponent(Object3D, { object: options.draggableDefault[i] });
                            entity.addComponent(Intersectable);
                            entity.addComponent(DraggableDefault);
                        }
                    }
                    break;
                case 'draggable-physique':
                    world.registerComponent(DraggablePhysique);
                    world.registerSystem(DraggablePhysiqueSystem);

                    if (options.draggablePhysique) {
                        for (let i = 0; i < options.draggablePhysique.length; i++) {
                            const entity = world.createEntity();
                            entity.addComponent(Object3D, { object: options.draggablePhysique[i].mesh, body: options.draggablePhysique[i].body });
                            entity.addComponent(Intersectable);
                            entity.addComponent(DraggablePhysique);
                        }
                    }
                    break;
                case 'button':
                    world.registerComponent(Button);
                    world.registerSystem(ButtonSystem);

                    if (options.button) {
                        for (let i = 0; i < options.button.length; i++) {
                            const button = options.button[i];

                            const buttonEntity = world.createEntity();
                            buttonEntity.addComponent(Object3D, { object: button.mesh });
                            buttonEntity.addComponent(Intersectable);

                            if (button.onClick) {
                                const action = button.onClick;
                                buttonEntity.addComponent(Button, { action });
                            }

                        }
                    }
                    break;
                case 'panel':
                    if (options.panel.mesh) {
                        for (let i = 0; i < options.panel.mesh.length; i++) {
                            const panelEntity = world.createEntity();
                            panelEntity.addComponent(Object3D, { object: options.panel.mesh[i] });
                            panelEntity.addComponent(Intersectable);
                        }
                    }
                    break;
                case 'teleport':
                    world.registerComponent(Teleport);
                    world.registerSystem(TeleportSystem, { template: options.template });
                    if (options.teleport) {
                        for (let i = 0; i < options.teleport.length; i++) {
                            const teleportEntity = world.createEntity();
                            teleportEntity.addComponent(Object3D, { object: options.teleport[i] });
                            teleportEntity.addComponent(Intersectable);
                            teleportEntity.addComponent(Teleport);
                        }
                    }
                    break;
                default:
                    console.warn(`Invalid feature: ${val.toLowerCase()}.\nAvailable features are: ${validFeatures.join(', ')}`);
                    break;
            }
        });

    }

}