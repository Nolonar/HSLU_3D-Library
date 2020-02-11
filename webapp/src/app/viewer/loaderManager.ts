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

    public static load(filename: string, filetype: string, callback: (model: Model3D) => void) {

        const progressBar = document.getElementById('loading');
        const hideProgressBar = () => progressBar.classList.add('hidden');

        const loader = this.loaders[filetype];
        const createModel = this.createModelFunctions[filetype];

        if (!loader) {
            this.showError(`Filetype not supported: ${filetype}`);
            hideProgressBar();
            return;
        }


        new loader().load(
            filename,
            (obj) => {
                callback(createModel(obj));
                hideProgressBar();
            },
            (xhr: ProgressEvent<EventTarget>) => {
                progressBar.setAttribute('max', `${xhr.total}`);
                progressBar.setAttribute('value', `${xhr.loaded}`);
                progressBar.innerText = `${xhr.loaded / xhr.total * 100}%`;
            },
            (err: ErrorEvent) => {
                this.showError(`An unknown error happened while loading the model.`);

                console.error(err);
                hideProgressBar();
            }
        );
    }

    private static showError(message: string) {
        const errorMessage = document.getElementById('error-message');
        errorMessage.innerText = message;
        errorMessage.classList.remove('hidden');
    }
}
