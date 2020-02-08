import { Component, Input, OnInit } from '@angular/core';
import { AmbientLight, AnimationMixer, Box3, Camera, GridHelper, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three';
import { LoaderManager } from './loaderManager';
import { Model3D } from './model3d';

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

    model: Model3D;

    previousTimeStamp = 0;

    constructor() {
    }

    ngOnInit() {
        if (this.filename) {
            this.renderer = this.createRenderer();
            document.getElementById('viewport').appendChild(this.renderer.domElement);

            this.setupScene();
            this.setupCamera();
            this.registerEventHandlers(this.renderer.domElement);
            this.loadModel(`/assets/models/${this.filename}`);

            requestAnimationFrame(this.animate.bind(this));
        } else {
            console.log('viewer could not be loaded due missing filename');
        }
    }

    private createRenderer(): WebGLRenderer {
        const renderer = new WebGLRenderer();
        const width = 800;
        const height = 450;
        renderer.setSize(width, height);
        renderer.setClearColor(0x4488cc);

        return renderer;
    }

    private setupScene() {
        this.scene = new Scene();
        this.grid = new GridHelper(10, 10);
        this.scene.add(this.grid);

        const color = 'white';
        const intensity = 1;
        this.scene.add(new AmbientLight(color, intensity));
    }

    private setupCamera() {
        const fov = 75;
        const aspectRatio = 16 / 9;
        const near = 0.1;
        const far = 1000;
        this.camera = new PerspectiveCamera(fov, aspectRatio, near, far);
        this.camera.position.z = 5;
    }

    private registerEventHandlers(canvas: HTMLCanvasElement) {
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
            this.model.mesh.rotation.y += delta.x * mouseSmoothing;
            this.model.mesh.rotation.x += delta.y * mouseSmoothing;
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

    private loadModel(filename: string) {
        LoaderManager.load(filename, (model: Model3D) => {
            this.model = model;

            this.normalizeModelSize(model);
            this.scene.add(model.mesh);

            if (model.animations) {
                model.currentAnimation = model.animations[0];
                this.playAnimation(model);
            }
        });
    }

    private normalizeModelSize(model: Model3D) {
        const size = new Vector3();
        new Box3().setFromObject(model.mesh).getSize(size);

        const scale = 2 / Math.max(size.x, size.y);
        model.mesh.scale.multiplyScalar(scale);
    }

    private playAnimation(model: Model3D) {
        if (!this.mixer) {
            this.mixer = new AnimationMixer(model.mesh);
        }

        this.mixer.clipAction(model.currentAnimation).play();
        this.normalizeModelSize(this.model);
    }

    private animate(timestamp: number) {
        if (this.mixer) {
            const delta = timestamp - this.previousTimeStamp;
            this.previousTimeStamp = timestamp;
            this.mixer.update(delta / 1000);
        }

        this.renderer.render(this.scene, this.camera);

        requestAnimationFrame(this.animate.bind(this));
    }
}
