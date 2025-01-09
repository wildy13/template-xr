<script setup>
import * as THREE from 'three';
import { onMounted } from 'vue';
import { Template } from '../#composables/template.js';
import { StatsHelper } from '../#composables/helpers/statsHelper.js'
import { useRegister } from '../#composables/useRegister.js';
import { UsePhysique } from '../#composables/usePhysique.js';

const container = ref(null);
const meshes = ref([]);
const bodies = ref([]);

let template;
let statsHelper;
let box_1, box_2, box_3;
let box3_physique;

let handedness;
const prevGamePads = new Map();

const animate = () => {
    let clock = new THREE.Clock();

    template.renderer.setAnimationLoop((timestamp, frame) => {
        const delta = clock.getDelta();
        const elapsedTime = clock.elapsedTime;

        template.worldThree.execute(delta, elapsedTime);

        if (statsHelper.stats) statsHelper.stats.update();
        if (statsHelper.statsMesh && statsHelper.statsMesh.material.map) {
            statsHelper.statsMesh.material.map.update();
        }

        if (template.worldCannon) template.worldCannon.fixedStep();
        if (template.CannonDebugger) template.CannonDebugger.update();

        if (box3_physique.position != box_3.position) {
            box3_physique.velocity.set(0, -9.8, 0);
            box_3.position.copy(box3_physique.position);
            box_3.quaternion.copy(box3_physique.quaternion);
        }

        const session = template.renderer.xr.getSession();
        if (session) {
            if (session.inputSources) {
                for (const source of session.inputSources) {
                    if (source && source.handedness) {
                        handedness = source.handedness;
                    }

                    if (!source.gamepad) continue
                    const data = {
                        handedness: handedness,
                        buttons: source.gamepad.buttons.map((b) => b.value),
                        axes: source.gamepad.axes.slice(0)
                    }
                    const old = prevGamePads.get(source);
                    if (data) {
                        data.buttons.forEach((value, i) => {
                           // console.log(value)
                        })
                    }
                }
            }
        }

        template.renderer.render(template.scene, template.camera);
    });
};

const setupTemplate = () => {
    template = new Template({ container: container.value });
}


const registerInteractions = () => {
    new useRegister({
        world: template.worldThree,
        options: {
            requiredFeatures: ['draggable-return', 'draggable-default', 'draggable-physique'],
            template: template,
            handPointers: [template.handPointerLeft, template.handPointerRight],
            controllers: [template.controllerGripLeft, template.controllerGripLeft],
            draggableDefault: [box_1],
            draggableReturn: [box_2],
            draggablePhysique: [{
                mesh: box_3,
                body: box3_physique
            }],
        }
    });
}

const StatsUI = () => {
    statsHelper = new StatsHelper({ container: container.value });
    statsHelper.statsMesh.position.set(-.25, 1.125, -0.7)
    template.scene.add(statsHelper.statsMesh);
}


const createAcc = () => {

    // box
    const boxgeo = new THREE.BoxGeometry(0.25, 0.25, 0.25);
    const boxmat = new THREE.MeshBasicMaterial({ color: 0x64748b });

    box_1 = new THREE.Mesh(boxgeo, boxmat);
    box_1.position.set(-1, 1.2, -2);

    box_2 = new THREE.Mesh(boxgeo, boxmat);
    box_2.position.set(1, 1.2, -2);

    box_3 = new THREE.Mesh(boxgeo, boxmat);
    box_3.name = 'box 3';
    box_3.position.set(0, 1.2, -2);


    template.scene.add(box_1);
    template.scene.add(box_2);
    template.scene.add(box_3);

    box3_physique = new UsePhysique(template.worldCannon, { mesh: box_3, mass: 1 });

    meshes.value.push(box_3);
    bodies.value.push(box3_physique);


    /*
    template.physique().then(() => {
        const world = template.Rapier();

        box3_physique = new UsePhysique({ mesh: box_3, world });

        objects.value.push({ mesh: box_3, body: box3_physique.body });
    })
    */

}

const userInterface = () => {
    StatsUI();
    createAcc();
}

onMounted(() => {
    setupTemplate();
    userInterface();
    registerInteractions();
    animate();

});


</script>

<template>
    <div ref="container"></div>
</template>
