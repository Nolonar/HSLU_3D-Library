import { AnimationClip, Object3D } from 'three';

export class Model3D {
    mesh: Object3D;
    animations: AnimationClip[];
    currentAnimation: AnimationClip;

    constructor(mesh: Object3D, animations?: AnimationClip[]) {
        this.mesh = mesh;
        this.animations = animations || [];
    }
}
