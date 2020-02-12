import { Geometry, Group, Mesh, MeshDepthMaterial } from 'three';
import { Collada, ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { TDSLoader } from 'three/examples/jsm/loaders/TDSLoader';
import { Model3D } from './model3d';

export class LoaderManager {
    private static readonly defaultMaterial = new MeshDepthMaterial();

    private static loaders = {
        glb: GLTFLoader,
        obj: OBJLoader,
        stl: STLLoader,
        dae: ColladaLoader,
        fbx: FBXLoader,
        '3ds': TDSLoader
    };

    private static createModelFunctions = {
        glb: (obj: GLTF) => new Model3D(obj.scene, obj.animations),
        dae: (obj: Collada) => new Model3D(obj.scene, obj.animations),
        stl: (obj: Geometry) => new Model3D(new Mesh(obj, LoaderManager.defaultMaterial)),
    };

    private static parseFunctions = {
        glb: async (file: File) => {
            const data = await LoaderManager.getBufferArray(file);
            return new Promise<Model3D>((resolve, reject) => {
                new GLTFLoader().parse(data, '', gltf => {
                    resolve(new Model3D(gltf.scene, gltf.animations));
                }, error => reject(error));
            });
        },
        dae: async (file: File) => {
            const text: string = await (file as unknown as Body).text();
            const createModel = LoaderManager.getCreateModelFunction('dae');
            return Promise.resolve(createModel(new ColladaLoader().parse(text, '')));
        },
        stl: async (file: File) => {
            const data = await LoaderManager.getBufferArray(file);
            const geometry = new STLLoader().parse(data);
            return new Model3D(new Mesh(geometry, LoaderManager.defaultMaterial));
        },
        obj: async (file: File) => {
            const text: string = await (file as unknown as Body).text();
            const createModel = LoaderManager.getCreateModelFunction('obj');
            return createModel(new OBJLoader().parse(text));
        }
    };

    private static readonly defaultCreateModelFunction = (obj: Group) => {
        obj.traverse(child => {
            if (child instanceof Mesh) {
                child.material = LoaderManager.defaultMaterial;
            }
        });
        return new Model3D(obj);
    }

    private static getDefaultParseFunction(filetype: string): (file: File) => Promise<Model3D> {
        const loader = this.loaders[filetype];
        const createModel = this.getCreateModelFunction(filetype);
        return async (file: File) => {
            // Workaround to access File.__proto__.__proto__.text() with TypeScript.
            const data = await LoaderManager.getBufferArray(file);
            return createModel(new loader().parse(data));
        };
    }

    private static async getBufferArray(file: File) {
        // Workaround to access File.__proto__.__proto__.arrayBuffer() with TypeScript.
        return await (file as unknown as Body).arrayBuffer();
    }

    public static get supportedTypes() {
        return Object.keys(this.loaders);
    }

    public static getCreateModelFunction(filetype: string): (obj: object) => Model3D {
        return this.createModelFunctions[filetype] || LoaderManager.defaultCreateModelFunction;
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
        const createModel = this.getCreateModelFunction(filetype);
        new loader().load(filename, obj => onDone(createModel(obj)), onProgress, onError);
    }

    public static async parse(file: File, filetype: string): Promise<Model3D> {
        let parser = this.parseFunctions[filetype];
        if (!parser) {
            parser = this.getDefaultParseFunction(filetype).bind(this);
        }
        return parser(file);
    }
}
