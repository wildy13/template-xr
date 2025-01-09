import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { World } from 'three/examples/jsm/libs/ecsy.module.js';
import { DRACOLoader, FBXLoader, GLTFLoader, OBJLoader, OculusHandModel, OculusHandPointerModel, OrbitControls, XRButton, XRControllerModelFactory } from 'three/examples/jsm/Addons.js';
import CannonDebugger from 'cannon-es-debugger';


/**
 * @param {object} [container] - The container element to render the scene in.
 * @param {number} [setSceneBackgroundColor] - Background color of the scene.
 * @param {number} [setCameraFov]  - Field of view for the camera.
 * @param {number} [setCameraNear]  - Aspect ratio for the camera.
 * @param {number} [setCameraAspect] - Near clipping plane for the camera.
 * @param {number} [setCameraFar] - Far clipping plane for the camera.
 * @param {{x: number, y: number, z: number}} [setCameraPosition] - Position of the camera.
 */

export class Template {
    constructor(
        {
            container = null,
            setSceneBackgroundColor = 0x808080, //0x808080,
            setCameraFov = 50,
            setCameraAspect = window.innerWidth / window.innerHeight,
            setCameraNear = 0.1,
            setCameraFar = 25,
            setCameraPosition = { x: 0, y: 0, z: 3 },
        }
    ) {

        this.scene = new THREE.Scene();
        if (setSceneBackgroundColor) {
            this.scene.background = new THREE.Color(setSceneBackgroundColor);
        }
        if (setCameraFov && setCameraAspect && setCameraNear && setCameraFar && setCameraPosition) {
            this.camera = new THREE.PerspectiveCamera(setCameraFov, setCameraAspect, setCameraNear, setCameraFar);
            this.camera.position.set(setCameraPosition.x, setCameraPosition.y, setCameraPosition.z);
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
        const light = new THREE.DirectionalLight(0xffffff, 3);
        light.position.set(0, 6, 0);
        light.castShadow = true;
        light.shadow.camera.top = 3;
        light.shadow.camera.bottom = - 3;
        light.shadow.camera.right = 3;
        light.shadow.camera.left = - 3;
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


        this.controllerLeft = this.renderer.xr.getController(0);
        this.controllerRight = this.renderer.xr.getController(1);
        this.controllerLeft.name = 'Left';
        this.controllerRight.name = 'right';

        this.controllerLeft.addEventListener('connected', function (event) {
            this.add(this.#buildController(event.data));
        });
        this.controllerRight.addEventListener('connected', function (event) {
            this.add(this.#buildController(event.data));
        })


        this.controllerLeft.addEventListener('disconnected', function (event) {
            this.remove( this.children[ 0 ] );
        });
        this.controllerRight.addEventListener('disconnected', function (event) {
            this.remove( this.children[ 0 ] );
        })


        // hand
        const controllerModelFactory = new XRControllerModelFactory();

        this.controllerGripLeft = this.renderer.xr.getControllerGrip(0);
        this.controllerGripRight = this.renderer.xr.getControllerGrip(1);

        this.controllerGripLeft.add(controllerModelFactory.createControllerModel(this.controllerGripLeft));
        this.controllerGripRight.add(controllerModelFactory.createControllerModel(this.controllerGripRight));


        this.leftHand = this.renderer.xr.getHand(0);
        this.rightHand = this.renderer.xr.getHand(1);

        this.leftHand.add(new OculusHandModel(this.leftHand));
        this.rightHand.add(new OculusHandModel(this.rightHand));


        // pointer
        this.handPointerLeft = new OculusHandPointerModel(this.leftHand, this.controllerLeft);
        this.handPointerRight = new OculusHandPointerModel(this.rightHand, this.controllerRight);

        this.scene.add(this.controllerLeft);
        this.scene.add(this.controllerRight);
        this.scene.add(this.controllerGripLeft);
        this.scene.add(this.controllerGripRight);
        this.scene.add(this.handPointerLeft);
        this.scene.add(this.handPointerRight);
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

    }

    #buildController(data) {
        let geometry, material;
        switch (data.targetRayMode) {
            case 'tracked-pointer':

                geometry = new THREE.BufferGeometry();
                geometry.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, - 1], 3));
                geometry.setAttribute('color', new THREE.Float32BufferAttribute([0.5, 0.5, 0.5, 0, 0, 0], 3));

                material = new THREE.LineBasicMaterial({ vertexColors: true, blending: THREE.AdditiveBlending });

                return new THREE.Line(geometry, material);

            case 'gaze':

                geometry = new THREE.RingGeometry(0.02, 0.04, 32).translate(0, 0, - 1);
                material = new THREE.MeshBasicMaterial({ opacity: 0.5, transparent: true });
                return new THREE.Mesh(geometry, material);
        }
    }


    async physique() {
        await RAPIER.init();
        const gravity = new RAPIER.Vector3(0.0, -9.81, 0.0);
        this.worldRapier = new RAPIER.World(gravity);

        const groundColliderDesc = RAPIER.ColliderDesc.cuboid(500, 0.5, 500); // Large cuboid collider
        const groundBodyDesc = RAPIER.RigidBodyDesc.fixed(); // Static body
        this.worldRapier.createRigidBody(groundBodyDesc);
        this.worldRapier.createCollider(groundColliderDesc);
    }

    Rapier() {
        return this.worldRapier;
    }


    loadModel({
        url = '',
        transparent = false,
        opacity = 0.5,
        position = { x: 0, y: 0, z: 0 },
        rotation = { x: 0, y: 0, z: 0 },
        scale = 1,
    }) {
        return new Promise((resolve, reject) => {
            if (!url) reject('No URL provided for the 3D model.');

            let loader;

            const fileType = url.split('.').pop().toLowerCase();
            switch (fileType) {
                case 'glb':
                case 'gltf':
                    loader = new GLTFLoader();
                    break;
                case 'fbx':
                    loader = new FBXLoader();
                    break;
                case 'obj':
                    loader = new OBJLoader();
                    break;
                default:
                    reject(`Unsupported file type: ${fileType}`);
                    return;
            }

            // untuk compress weight dari berat ke ringan
            const dracoLoader = new DRACOLoader();
            dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.5');
            loader.setDRACOLoader(dracoLoader);

            loader.load(url, (model) => {
                switch (fileType) {
                    case 'glb':
                    case 'gltf':
                        this.model = model.scene;
                        break;
                    case 'fbx':
                    case 'obj':
                        this.model = model;
                        break;
                    default:
                        reject(`Unsupported file type: ${fileType}`);
                        return;
                }

                this.mixer = new THREE.AnimationMixer(this.model);

                this.model.position.set(position.x, position.y, position.z);
                this.model.scale.set(scale, scale, scale);
                const quaternion = new THREE.Quaternion();
                const euler = new THREE.Euler(
                    rotation.x * (Math.PI / 180),
                    rotation.y * (Math.PI / 180),
                    rotation.z * (Math.PI / 180)
                );
                quaternion.setFromEuler(euler);
                this.model.quaternion.copy(quaternion);
                this.model.traverse((child) => {
                    if (child.isMesh) {
                        if (transparent === true && child.material) {
                            if (Array.isArray(child.material)) {
                                child.material.forEach((material) => {
                                    material.transparent = true;
                                    material.opacity = opacity;
                                    material.blending = THREE.NormalBlending;
                                    material.needsUpdate = false;
                                });
                            } else {
                                child.material.transparent = true;
                                child.material.opacity = opacity;
                                child.material.blending = THREE.NormalBlending;
                                child.material.needsUpdate = false;
                            }
                        }
                    }
                });

                resolve({
                    model,
                    mixer: this.mixer
                });
            }, undefined, (error) => {
                reject(error);
            });
        });
    }

}