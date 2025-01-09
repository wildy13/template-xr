<script setup>
import { onMounted } from 'vue';
import { useTemplate } from '../composables/useTemplate';
import { StatsHelper } from '../composables/helpers/statsHelper';
import * as THREE from 'three';
import { useRegister } from '../composables/useRegister';
import { PanelHelper } from '../composables/helpers/panelHelper';
import { ButtonHelper } from '../composables/helpers/ButtonHelper';
import { UseGLTF } from '../composables/useGLTF';

const container = ref(null);
let template;
let statHelper;
let cubeDefault, cubeReturn;

let panel, button;
let options;

const setup = () => {
    template = new useTemplate({ container: container.value })
}

const animate = () => {
    let clock = new THREE.Clock();
    let previousPosition = null;

    template.renderer.setAnimationLoop((timestamp, frame) => {
        const delta = clock.getDelta();
        const elapsedTime = clock.elapsedTime;
        const session = template.renderer.xr.getSession();

        if (template.worldThree) template.worldThree.execute(delta, elapsedTime);
        if (template.worldCannon) template.worldCannon.fixedStep();
        if (template.cannonDebugger) template.CannonDebugger.update();

        if (statHelper) {
            statHelper.stats.update();
            statHelper.statsMesh.material.map.update();
        }

        if (session && frame) {
            const referenceSpace = template.renderer.xr.getReferenceSpace();
            const viewerPose = frame.getViewerPose(referenceSpace);

            if (viewerPose) {
                const position = new THREE.Vector3(
                    viewerPose.transform.position.x,
                    viewerPose.transform.position.y,
                    viewerPose.transform.position.z
                );


                if (previousPosition == null) {
                    template.anchors.position.copy(position).add(new THREE.Vector3(0, 0, -1.5));
                    previousPosition = position;
                }
            }
        }

        template.renderer.render(template.scene, template.camera);
    });
}

const statUI = () => {
    statHelper = new StatsHelper({ container: container.value });
    statHelper.statsMesh.position.set(-.35, 0.15, 0.001)
    panel.add(statHelper.statsMesh);
}

const createPanel = () => {
    panel = new PanelHelper({ texturePath: '/texture/Panel-Intro.png' });
    panel.name = 'panel'
    template.scene.add(panel);
}

const createButton = () => {
    button = new ButtonHelper({ position: { x: -.3, y: -.1 }, texturePath: '/texture/Button Border.png', label: 'Load Object' });
    panel.add(button)

}
const userInterface = () => {
    createPanel();
    statUI();
    createButton();
}

const cube = () => {
    const group = new THREE.Group();
    group.position.set(0, 1.2, -1)

    const geometry1 = new THREE.BoxGeometry(0.25, 0.25, 0.25);
    const material1 = new THREE.MeshStandardMaterial({
        color: Math.random() * 0xffffff, roughness: 0.7,
        metalness: 0.0
    });

    const geometry2 = new THREE.BoxGeometry(0.25, 0.25, 0.25);
    const material12 = new THREE.MeshStandardMaterial({
        color: Math.random() * 0xffffff, roughness: 0.7,
        metalness: 0.0
    });

    cubeDefault = new THREE.Mesh(geometry1, material1);
    cubeDefault.name = 'cube default';

    cubeReturn = new THREE.Mesh(geometry2, material12);
    cubeReturn.name = 'cube return';
    cubeReturn.position.x = -1;

    group.add(cubeDefault);
    group.add(cubeReturn);


    template.scene.add(group);
}

const systemRegister = () => {
    new useRegister({
        world: template.worldThree,
        options: {
            requiredFeatures: ['draggable-default', 'draggable-return', 'panel', 'button'],
            template: template,
            controllers: [template.controllerLeft, template.controllerRight],
            draggableDefault: [cubeDefault],
            draggableReturn: [cubeReturn],
            panel: { mesh: [panel] },
            button: [
                {
                    mesh: button,
                    onClick: () => {
                        const object = new UseGLTF({ url: '/3d-object/Dog/scene.glb' });
                        console.log(object);
                    }
                }
            ]
        }
    });
}
onMounted(() => {
    setup();
    cube();
    userInterface();
    systemRegister();
    animate();
});

</script>


<template>
    <div ref="container"></div>
</template>