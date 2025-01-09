import RAPIER from '@dimforge/rapier3d-compat';
import * as THREE from 'three';
import * as CANNON from 'cannon-es'

export class UsePhysique {
    constructor(world, { mesh, mass }) {
        this.world = world;
        this.mesh = mesh;
        this.mass = mass;

        this.body = new CANNON.Body({
            mass: this.mass || 0,
            position: new CANNON.Vec3(0, 0, 0)
        });

        this.#_Init();

        return this.body;
    }

    #_Init() {
        if (this.mesh.children.length === 0) {
            this.#_createBoxShape(this.mesh);
        } else {
            this.mesh.traverse((child) => {
                if (child.isMesh) {
                    this.#_createBoxShape(child);
                }
            });
        }

        this.world.addBody(this.body);
    }

    #_createBoxShape(mesh) {
        mesh.updateWorldMatrix(true, true);

        const meshWorldPosition = new THREE.Vector3();
        mesh.getWorldPosition(meshWorldPosition);
        this.body.position.copy(meshWorldPosition);

        const geometry = mesh.geometry;

        if (geometry.isBufferGeometry) {
            const positions = geometry.attributes.position.array; 
            const indices = geometry.index ? geometry.index.array : undefined;

            const trimeshShape = new CANNON.Trimesh(positions, indices);

            this.body.addShape(trimeshShape);
        } else {
            console.warn("Geometri mesh bukan BufferGeometry. Pastikan mesh menggunakan BufferGeometry.");
        }
    }
}



/*
export class UsePhysique {
    constructor({ mesh, world }) {
        this.#init(mesh, world);
    }

    #init(mesh, world) {
        mesh.geometry.computeBoundingBox();
        const bounds = mesh.geometry.boundingBox;

        const size = new RAPIER.Vector3(
            (bounds.max.x - bounds.min.x) / 2,
            (bounds.max.y - bounds.min.y) / 2,
            (bounds.max.z - bounds.min.z) / 2
        );

        const position = mesh.position;

        const colliderDesc = RAPIER.ColliderDesc.cuboid(size.x, size.y, size.z);
        const bodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(position.x, position.y, position.z);

        this.body = world.createRigidBody(bodyDesc);
        world.createCollider(colliderDesc, this.body);
        console.log(this.body.translation())
        this.body.setTranslation(new RAPIER.Vector3(0, -2, 0), true);
    }
}
*/