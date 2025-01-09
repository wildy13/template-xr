import { ButtonComponent } from "./components/ButtonComponent";
import { ControllerComponent } from "./components/ControllerComponent";
import { DraggableDefault } from "./components/DraggableDefaultComponent";
import { DraggableReturn } from "./components/DraggableReturnComponent";
import { Object3D } from "./components/Object3DComponent";
import { PanelComponent } from "./components/PanelComponent";
import { ButtonSystem } from "./systems/ButtonSystem";
import { ControllerSystem } from "./systems/ControllerSystem";
import { DraggableDefaultSystem } from "./systems/DraggableDefaultSystem";
import { DraggableReturnSystem } from "./systems/DraggableReturnSystem";
import { PanelSystem } from "./systems/PanelSystem";

/**
 * @typedef {'button'| 'panel'| 'draggable-return'| 'draggable-physique'| 'draggable-default'} FeatureType
 * @type {FeatureType[]}
 */

/**
 * Initializes the scene and its elements with the provided configuration. 
 * @param {Object} config - Configuration object for scene setup.
 * @param {HTMLElement|null} [config.world=null] - The container element for the scene. Default is `null`.
 * @param {Object} [config.options] - Configuration for scene elements.
 * @param {FeatureType[]} [config.options.requiredFeatures=[]] - List of features required for the scene (e.g., VR/AR).
 * @param {Object} [config.options.panel] - Settings for the scene's panel.
 * @param {Array<THREE.Mesh>} [config.options.panel.mesh=[]] - Meshes for the panel.
 * @param {Array<THREE.Object3D>} [config.options.controllers=[]] - List of VR controller objects.
 * @param {Array<THREE.Object3D>} [config.options.handPointers=[]] - List of hand pointer objects.
 * @param {Array<Object>} [config.options.button=[{ mesh: null, onClick: () => {} }]] - Button configuration, each with a mesh and click handler.
 * @param {Array<THREE.Object3D>} [config.options.draggableReturn=[]] - List of objects to be returned when dragged.
 * @param {Array<THREE.Object3D>} [config.options.draggableDefault=[]] - Default draggable objects in the scene.
 * @param {Array<Object>} [config.options.draggablePhysique=[{ mesh: null, body: null }]] - Draggable objects with physics, each with mesh and body.
 * @param {THREE.Object3D|null} [config.options.template=null] - Template object for the scene.
 * @param {Array<THREE.Object3D>} [config.options.teleport=[]] - List of teleportation targets in the scene.
 */

export class useRegister {
    constructor(
        {
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
                teleport: [],
            }
        }
    ) {
        /** @type {FeatureType[]} */
        const validFeatures = ['button', 'panel', 'draggable-return', 'draggable-physique', 'draggable-default']

        if (!world.hasRegisteredComponent(Object3D)) {
            world.registerComponent(Object3D);
        }

        if (!world.hasRegisteredComponent(ControllerComponent)) {
            world.registerComponent(ControllerComponent);
            world.registerSystem(ControllerSystem);
        }

        options.requiredFeatures.forEach(val => {
            switch (val.toLowerCase()) {
                case 'draggable-return':
                    if (options.draggableReturn) {
                        world.registerComponent(DraggableReturn);
                        world.registerSystem(DraggableReturnSystem);
                        for (let i = 0; i < options.draggableReturn.length; i++) {
                            const entity = world.createEntity();
                            entity.addComponent(Object3D, { object: options.draggableReturn[i] });
                            entity.addComponent(DraggableReturn);
                            entity.addComponent(ControllerComponent, { template: options.template, controllers: options.controllers });
                        }
                    }
                    break;
                case 'draggable-default':
                    if (options.draggableDefault) {
                        world.registerComponent(DraggableDefault);
                        world.registerSystem(DraggableDefaultSystem);
                        for (let i = 0; i < options.draggableDefault.length; i++) {
                            const entity = world.createEntity();
                            entity.addComponent(Object3D, { object: options.draggableDefault[i] });
                            entity.addComponent(DraggableDefault);
                            entity.addComponent(ControllerComponent, { template: options.template, controllers: options.controllers });
                        }
                    }
                    break;
                case 'draggable-physique':
                    break;

                case 'panel':
                    if (options.panel.mesh) {
                        world.registerComponent(PanelComponent);
                        world.registerSystem(PanelSystem);
                        for (let i = 0; i < options.panel.mesh.length; i++) {
                            const mesh = options.panel.mesh[i];
                            const entity = world.createEntity();
                            entity.addComponent(Object3D, { object: mesh });
                            entity.addComponent(PanelComponent, { anchors: options.template.anchors });
                            entity.addComponent(ControllerComponent, { template: options.template, controllers: options.controllers });
                        }
                    }
                    break;
                case 'button':
                    world.registerComponent(ButtonComponent);
                    world.registerSystem(ButtonSystem);

                    for (let i = 0; i < options.button.length; i++) {
                        const button = options.button[i];
                        const entity = world.createEntity();
                        entity.addComponent(Object3D, { object: button.mesh });
                        entity.addComponent(ControllerComponent, { template: options.template, controllers: options.controllers });
                        if (button.onClick) {
                            entity.addComponent(ButtonComponent, { action: button.onClick });
                        }
                    }
                    break;
                default:
                    console.warn(`Invalid feature: ${val.toLowerCase()}.\nAvailable features are: ${validFeatures.join(', ')}`);
                    break;
            }
        })
    }
}