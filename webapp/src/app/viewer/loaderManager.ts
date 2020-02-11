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

    private static parseFunctions = {
        glb: async (file: File) => {
            // Workaround to access File.__proto__.__proto__.arrayBuffer() with TypeScript.
            const data = await (file as unknown as Body).arrayBuffer();
            return new Promise<Model3D>((resolve, reject) => {
                new GLTFLoader().parse(data, '', gltf => {
                    resolve(new Model3D(gltf.scene, gltf.animations));
                }, error => reject(error));
            });
        },
        obj: async (file: File) => {
            console.log(file);
            // Workaround to access File.__proto__.__proto__.text() with TypeScript.
            const text = await (file as unknown as Body).text();
            return new Model3D(new OBJLoader().parse(text));
        }
    };

    public static getCreateModelFunction(filetype: string): (obj: object) => Model3D {
        return this.createModelFunctions[filetype];
    }

    public static load(filename: string, filetype: string,
        onDone: (model: Model3D) => void,
        onProgress: (xhr: ProgressEvent<EventTarget>) => void,
        onError: (message: ErrorEvent) => void) {

        const loader = this.loaders[filetype];
        if (!loader) {
            onError(new ErrorEvent('Not supported', {
                message: `Filetype not supported: ${filetype}`
            }));
            return;
        }
        const createModel = this.createModelFunctions[filetype];
        new loader().load(filename, obj => onDone(createModel(obj)), onProgress, onError);
    }

    public static async parse(file: File, filetype: string): Promise<Model3D> {
        return this.parseFunctions[filetype](file);
    }
}
