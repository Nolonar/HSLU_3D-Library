import { Component, Input, OnInit } from '@angular/core';
import { AmbientLight, AnimationClip, AnimationMixer, Box3, Camera, GridHelper, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three';
import { LoaderManager } from './loaderManager';
import { Model3D } from './model3d';

@Component({
    selector: 'app-viewer',
    templateUrl: './viewer.component.html',
    styleUrls: ['./viewer.component.css']
})
export class ViewerComponent implements OnInit {
    private readonly rendererBackgroundColor = 0xa4f4ff;
    private readonly rendererResolution = {
        width: window.innerWidth / 2,
        height: window.innerHeight / 2
    };

    @Input() filename: string;
    @Input() filetype: string;

    private renderer: WebGLRenderer;
    private scene: Scene;
    private grid: GridHelper;
    private camera: Camera;
    private mixer: AnimationMixer;

    private model: Model3D;

    private previousTimeStamp = 0;

    private get animationControls(): HTMLElement {
        return document.getElementById('control-animations');
    }
    private get animationSelect(): HTMLElement {
        return document.getElementById('animations');
    }
    private get viewport(): HTMLElement {
        return document.getElementById('viewport');
    }
    private get progressBar(): HTMLElement {
        return document.getElementById('loading');
    }
    private get errorMessage(): HTMLElement {
        return document.getElementById('error-message');
    }

    constructor() {
        // empty
    }

    ngOnInit() {
        if (this.filename) {
            this.renderer = this.createRenderer();
            this.viewport.appendChild(this.renderer.domElement);

            this.setupScene();
            this.setupCamera();
            this.registerEventHandlers(this.renderer.domElement);
            this.loadModel(`/assets/models/${this.filename}`, this.filetype);

            requestAnimationFrame(this.animate.bind(this));
        } else {
            console.log('viewer could not be loaded due missing filename');
        }
    }

    private hide(element: HTMLElement) {
        element.classList.add('hidden');
    }
    private unhide(element: HTMLElement) {
        element.classList.remove('hidden');
    }

    private createRenderer(): WebGLRenderer {
        const renderer = new WebGLRenderer();
        renderer.setSize(this.rendererResolution.width, this.rendererResolution.height);
        renderer.setClearColor(0x000000);
        return renderer;
    }

    private setupScene() {
        this.scene = new Scene();
        this.grid = new GridHelper(30, 30, 0x000000, 0x000000);
        this.scene.add(this.grid);

        const color = 'white';
        const intensity = 1;
        this.scene.add(new AmbientLight(color, intensity));
    }

    private setupCamera() {
        const fov = 75;
        const aspectRatio = this.rendererResolution.width / this.rendererResolution.height;
        const near = 0.1;
        const far = 1000;
        this.camera = new PerspectiveCamera(fov, aspectRatio, near, far);
        this.resetCameraZoom();
    }

    private resetCameraZoom() {
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
            mousePreviousLocation = undefined;
        };

        canvas.onwheel = (event) => {
            const mouseSmoothing = 0.005;
            const newPositionZ = this.camera.position.z - event.deltaY * mouseSmoothing;
            this.camera.position.z = Math.max(2, Math.min(20, newPositionZ));

            event.preventDefault();
            return false;
        };
    }

    private loadModel(filename: string, filetype: string) {
        LoaderManager.load(filename, filetype, (model: Model3D) => {
            this.model = model;

            this.normalizeModelSize(model);
            this.scene.add(model.mesh);

            this.renderer.setClearColor(this.rendererBackgroundColor);

            if (model.animations.length) {
                this.populateAnimationSelect(model.animations);
                this.selectAnimation(model.animations[0].name);

                this.unhide(this.animationControls);
            }
            this.hide(this.progressBar);
        }, (xhr: ProgressEvent<EventTarget>) => {
            this.progressBar.setAttribute('max', `${xhr.total}`);
            this.progressBar.setAttribute('value', `${xhr.loaded}`);
            this.progressBar.innerText = `${xhr.loaded / xhr.total * 100}%`;
        }, (message: string) => {
            this.errorMessage.innerText = message;
            this.unhide(this.errorMessage);
            this.hide(this.progressBar);
        });
    }

    private populateAnimationSelect(animations: AnimationClip[]) {
        for (const animation of animations) {
            const template = document.createElement('template');
            template.innerHTML = `<option value='${animation.name}'>${animation.name}</option>`;

            this.animationSelect.appendChild(template.content.firstChild);
        }
    }

    private selectAnimation(animationName: string) {
        this.resetCameraZoom();

        this.model.currentAnimation = AnimationClip.findByName(this.model.animations, animationName);
        this.playAnimation(this.model);
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

        this.mixer.stopAllAction();
        this.mixer.clipAction(model.currentAnimation).play();
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
