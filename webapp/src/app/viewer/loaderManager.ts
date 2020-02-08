import { Object3D } from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { StringHelper } from '../helpers';
import { Model3D } from './model3d';

export class LoaderManager {
    private static loaders = {
        glb: GLTFLoader,
        obj: OBJLoader
    };

    private static createModelFunctions = {
        glb: (obj: GLTF) => new Model3D(obj.scene, obj.animations),
        obj: (obj: Object3D) => new Model3D(obj)
    };

    public static load(filename: string, callback: (model: Model3D) => void) {
        const extension = StringHelper.getFileExtension(filename);
        const loader = this.loaders[extension];
        const createModel = this.createModelFunctions[extension];

        new loader().load(
            filename,
            // onLoad
            (obj: any) => callback(createModel(obj)),
            // onProgress callback
            (xhr: ProgressEvent<EventTarget>) => console.log(`model ${xhr.loaded / xhr.total * 100}% loaded`),
            // onError callback
            (err: ErrorEvent) => console.error(`An error happened while loading the model: ${err}`)
        );
    }
}
