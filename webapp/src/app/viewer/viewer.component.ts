import { Component, Input, OnInit } from '@angular/core';
// tslint:disable-next-line:max-line-length
import { AmbientLight, AnimationClip, AnimationMixer, Box3, Camera, GridHelper, Object3D, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

@Component({
    selector: 'app-viewer',
    templateUrl: './viewer.component.html',
    styleUrls: ['./viewer.component.css']
})
export class ViewerComponent implements OnInit {
    @Input() filename: string;

    renderer: WebGLRenderer;
    scene: Scene;
    grid: GridHelper;
    camera: Camera;
    mixer: AnimationMixer;

    obj: GLTF;
    model: Object3D;

    previousTimeStamp = 0;

    constructor() {
    }

    ngOnInit() {
        console.log(this.filename);

        this.renderer = this.createRenderer();
        document.getElementById('viewport').appendChild(this.renderer.domElement);

        this.setupScene();
        this.setupCamera();
        this.registerEventHandlers(this.renderer.domElement);
        this.loadModel(new GLTFLoader(), `/assets/models/${this.filename}`);

        requestAnimationFrame(this.animate.bind(this));
    }

    createRenderer(): WebGLRenderer {
        const renderer = new WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x4488cc);

        return renderer;
    }

    setupScene() {
        this.scene = new Scene();
        this.grid = new GridHelper(10, 10);
        this.scene.add(this.grid);

        const color = 'white';
        const intensity = 1;
        this.scene.add(new AmbientLight(color, intensity));

    }

    setupCamera() {
        const fov = 75;
        const aspectRatio = 16 / 9;
        const near = 0.1;
        const far = 1000;
        this.camera = new PerspectiveCamera(fov, aspectRatio, near, far);
        this.camera.position.z = 5;
    }

    registerEventHandlers(canvas: HTMLCanvasElement) {
        let mousePreviousLocation: { x: number, y: number };

        canvas.onmousedown = (event) => {
            mousePreviousLocation = {
                x: event.clientX,
                y: event.clientY
            };
        };

        canvas.onmousemove = (event) => {
            if (!mousePreviousLocation || !this.model) {
                return;
            }

            const delta = {
                x: event.clientX - mousePreviousLocation.x,
                y: event.clientY - mousePreviousLocation.y
            };

            mousePreviousLocation = {
                x: event.clientX,
                y: event.clientY
            };

            const mouseSmoothing = 0.01;
            this.model.rotation.y += delta.x * mouseSmoothing;
            this.model.rotation.x += delta.y * mouseSmoothing;
            this.grid.rotation.y += delta.x * mouseSmoothing;
            this.grid.rotation.x += delta.y * mouseSmoothing;
        };

        canvas.onmouseup = (event) => {
            mousePreviousLocation = null;
        };

        canvas.onwheel = (event) => {
            const mouseSmoothing = 0.005;
            const newPositionZ = this.camera.position.z - event.deltaY * mouseSmoothing;
            this.camera.position.z = Math.max(2, Math.min(20, newPositionZ));

            event.preventDefault();
            return false;
        };
    }

    loadModel(loader: GLTFLoader, filename: string) {
        loader.load(
            filename,

            // onLoad callback
            function (obj) {
                this.obj = obj;
                this.model = obj.scene;
                const animations = obj.animations;

                this.normalizeModelSize(this.model);
                this.scene.add(this.model);

                if (animations) {
                    this.mixer = new AnimationMixer(this.model);
                    const clip = animations[0];
                    this.playAnimation(clip);
                }
            }.bind(this),

            // onProgress callback
            (xhr) => console.log(`${xhr.loaded / xhr.total * 100}% loaded`),

            // onError callback
            (err) => console.error(`An error happened: ${err}`)
        );
    }

    normalizeModelSize(model: Object3D) {
        const size = new Vector3();
        new Box3().setFromObject(model).getSize(size);

        const scale = 2 / Math.max(size.x, size.y);
        model.scale.multiplyScalar(scale);
    }

    playAnimation(clip: AnimationClip) {
        this.mixer.clipAction(clip).play();
        this.normalizeModelSize(this.model);
    }

    animate(timestamp: number) {
        if (this.mixer) {
            const delta = timestamp - this.previousTimeStamp;
            this.previousTimeStamp = timestamp;
            this.mixer.update(delta / 1000);
        }

        this.renderer.render(this.scene, this.camera);

        requestAnimationFrame(this.animate.bind(this));
    }
}
