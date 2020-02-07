import { Component, OnInit } from '@angular/core';
import { AmbientLight, AnimationMixer, Camera, GridHelper, ObjectLoader, PerspectiveCamera, Scene, WebGLRenderer } from 'three';

@Component({
    selector: 'app-viewer',
    templateUrl: './viewer.component.html',
    styleUrls: ['./viewer.component.css']
})
export class ViewerComponent implements OnInit {
    loader: ObjectLoader;

    renderer: WebGLRenderer;
    scene: Scene;
    grid: GridHelper;
    camera: Camera;
    mixer: AnimationMixer;

    model;

    constructor() {
    }

    ngOnInit() {
        this.renderer = this.createRenderer();
        document.getElementById('viewport').appendChild(this.renderer.domElement);

        this.setupScene();
        this.setupCamera();
        this.registerEventHandlers(this.renderer.domElement);
        this.loadModel(this.loader);
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

    loadModel(loader: ObjectLoader) {
        // loader.load(
        //     'bla',

        //     // onLoad callback
        //     function (obj) {
        //         modelRaw = obj;
        //         model = obj.scene;
        //         let animations = obj.animations;

        //         normalizeModelSize(model);
        //         this.scene.add(model);

        //         if (animations) {
        //             mixer = new THREE.AnimationMixer(model);
        //             let clip = animations[0];
        //             playAnimation(clip);
        //         }
        //     },

        //     // onProgress callback
        //     (xhr) => console.log(`${xhr.loaded / xhr.total * 100}% loaded`),

        //     // onError callback
        //     (err) => console.error(`An error happened: ${err}`)
        // );
    }
}
