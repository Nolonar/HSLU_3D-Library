import { Object3D } from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
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

    public static load(filename: string, filetype: string,
        onDone: (model: Model3D) => void,
        onProgress: (xhr: ProgressEvent<EventTarget>) => void,
        onError: (message: string) => void) {

        const loader = this.loaders[filetype];
        const createModel = this.createModelFunctions[filetype];

        if (!loader) {
            onError(`Filetype not supported: ${filetype}`);
            return;
        }

        new loader().load(filename, obj => onDone(createModel(obj)), onProgress,
            (err: ErrorEvent) => {
                onError(`An unknown error happened while loading the model.`);
                console.error(err);
            }
        );
    }
}
