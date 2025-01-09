import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { World } from 'three/examples/jsm/libs/ecsy.module.js';
import { OculusHandModel, OrbitControls, XRButton, XRControllerModelFactory } from 'three/examples/jsm/Addons.js';
import CannonDebugger from 'cannon-es-debugger';

/**
 * useTemplate class For create the beggining of XR
 * @param {HTMLElement} container - The DOM element container for the scene.
 * @param {number} setSceneBackgroundColor - The background color of the scene, represented as a hex value.
 * @param {number} setCameraFov - The field of view (FOV) of the camera.
 * @param {number} setCameraAspect - The aspect ratio of the camera.
 * @param {number} setCameraNear - The near plane of the camera.
 * @param {number} setCameraFar - The far plane of the camera.
 * @param {Object} setCameraPosition - The initial position of the camera in 3D space, represented as `{ x, y, z }`.
 */
export class useTemplate {
    constructor(
        {
            container = null,
            setSceneBackgroundColor = 0x808080, //0x808080,
            setCameraFov = 50,
            setCameraAspect = window.innerWidth / window.innerHeight,
            setCameraNear = 0.1,
            setCameraFar = 25,
            setCameraPosition = { x: 0, y: 1.6, z: 3 },
        }
    ) {
        this.scene = new THREE.Scene();
        if (setSceneBackgroundColor) {
            this.scene.background = new THREE.Color(setSceneBackgroundColor);
        }
        if (setCameraFov && setCameraAspect && setCameraNear && setCameraFar && setCameraPosition) {
            this.camera = new THREE.PerspectiveCamera(setCameraFov, setCameraAspect, setCameraNear, setCameraFar);
            this.camera.position.set(setCameraPosition.x, setCameraPosition.y, setCameraPosition.z);
            this.camera.name = 'camera'
        } else {
            console.warn('Please ensure all camera options (Fov, Aspect, Near, Far, and Position) are set.');
        }

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.xr.enabled = true;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.autoClear = false;



        if (container) {
            container.appendChild(this.renderer.domElement);
        } else {
            console.warn('Please provide a container element.');
        }

        document.body.appendChild(XRButton.createButton(this.renderer, {
            'optionalFeatures': ['depth-sensing', 'hand-tracking', 'local-floor'],
            'depthSensing': { 'usagePreference': ['gpu-optimized'], 'dataFormatPreference': [] }
        }));

        this.renderer.xr.setReferenceSpaceType('local-floor');

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // light
        const light = new THREE.DirectionalLight(0xffffff);
        light.position.set(0, 6, 0);
        light.castShadow = true;
        light.shadow.camera.top = 200;
        light.shadow.camera.bottom = - 200;
        light.shadow.camera.right = 200;
        light.shadow.camera.left = - 200;
        light.shadow.mapSize.set(4096, 4096);
        this.scene.add(light);

        this.controls = new OrbitControls(this.camera, container);
        this.controls.update();

        this.worldThree = new World();
        this.worldCannon = new CANNON.World({
            gravity: new CANNON.Vec3(0, -9.82, 0),
            allowSleep: true,
        });

        this.CannonDebugger = new CannonDebugger(this.scene, this.worldCannon);


        this.controllerRight = this.renderer.xr.getController(1);
        this.controllerLeft = this.renderer.xr.getController(0);
        this.controllerLeft.name = 'left';
        this.controllerRight.name = 'right';


        // hand
        const controllerModelFactory = new XRControllerModelFactory();

        this.controllerGripRight = this.renderer.xr.getControllerGrip(1);
        this.controllerGripLeft = this.renderer.xr.getControllerGrip(0);

        this.controllerGripLeft.add(controllerModelFactory.createControllerModel(this.controllerGripLeft));
        this.controllerGripRight.add(controllerModelFactory.createControllerModel(this.controllerGripRight));

        this.rightHand = this.renderer.xr.getHand(1);
        this.leftHand = this.renderer.xr.getHand(0);

        this.leftHand.add(new OculusHandModel(this.leftHand));
        this.rightHand.add(new OculusHandModel(this.rightHand));


        const geometryLeft = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, - 1)]);
        const geometryRight = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, - 1)]);

        const lineLeft = new THREE.Line(geometryLeft);
        lineLeft.name = 'Line Left';

        const lineRight = new THREE.Line(geometryRight);
        lineRight.name = 'Line Right';

        this.controllerLeft.add(lineLeft);
        this.controllerRight.add(lineRight);


        this.scene.add(this.controllerLeft);
        this.scene.add(this.controllerRight);
        this.scene.add(this.controllerGripLeft);
        this.scene.add(this.controllerGripRight);
        this.scene.add(this.leftHand);
        this.scene.add(this.rightHand);

        // collider
        const floorShape = new CANNON.Plane(50, 0.1, 50);
        const floorBody = new CANNON.Body({
            mass: 0,
            shape: floorShape,
            position: new CANNON.Vec3(0, -.6, 0)
        });
        floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2); // Rotasi agar sejajar dengan sumbu X-Z
        this.worldCannon.addBody(floorBody);

        // anchor
        const geometry = new THREE.PlaneGeometry(1, 0.5);
        const material = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide, transparent: true, opacity: 0.3 });

        this.anchors = new THREE.Group();
        this.anchors.visible = false;
        this.anchors.name = 'anchors';
        for (let i = 0; i < 3; i++) {
            const plane = new THREE.Mesh(geometry, material);
            plane.position.x = i == 0 ? 0 : (i == 1 ? -1.1 : 1.1);
            plane.position.z = i != 0 ? this.camera.position.z - 2 : this.camera.position.z - 2.3;
            plane.quaternion.y = i == 0 ? 0 : (i == 1 ? (15 * (Math.PI / 180)) : (-15 * (Math.PI / 180)))
            plane.name = `anchors ${i + 1}`
            this.anchors.add(plane);
        }

        this.scene.add(this.anchors)
    }
}