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
        const progressBar = document.getElementById('loading');

        const extension = StringHelper.getFileExtension(filename);
        const loader = this.loaders[extension];
        const createModel = this.createModelFunctions[extension];

        new loader().load(
            filename,
            (obj) => {
                callback(createModel(obj));
                progressBar.classList.add('hidden');
            },
            (xhr: ProgressEvent<EventTarget>) => {
                progressBar.setAttribute('max', `${xhr.total}`);
                progressBar.setAttribute('value', `${xhr.loaded}`);
                progressBar.innerText = `${xhr.loaded / xhr.total * 100}%`;
            },
            (err: ErrorEvent) => {
                console.error(`An error happened while loading the model: ${err}`);
                progressBar.classList.add('hidden');
            }
        );
    }
}
