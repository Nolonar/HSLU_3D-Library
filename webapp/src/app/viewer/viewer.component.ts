import { Component, Input, OnInit } from '@angular/core';
import {
    AmbientLight, AnimationClip, AnimationMixer, Box3, Camera, GridHelper, // next line
    PerspectiveCamera, Scene, Vector2, Vector3, WebGLRenderer
} from 'three';
import { LoaderManager } from './loaderManager';
import { Model3D } from './model3d';

@Component({
    selector: 'app-viewer',
    templateUrl: './viewer.component.html',
    styleUrls: ['./viewer.component.css']
})
export class ViewerComponent implements OnInit {
    private readonly rendererDefaultResolution = { // Can be overriden by @Input.
        width: window.innerWidth,
        height: window.innerHeight
    };

    @Input() filename: string;
    @Input() filetype: string;

    // Overrides default resolution.
    @Input() isPreview = false;
    @Input() resolutionX: number;
    @Input() resolutionY: number;

    private renderer: WebGLRenderer;
    private scene: Scene;
    private grid: GridHelper;
    private mixer: AnimationMixer;
    private camera: Camera;
    private cameraDistance = 5;

    private model: Model3D;

    private previousTimeStamp = 0;

    constructor() {
        // empty
    }

    public get currentRenderFrame() {
        return this.renderer.domElement.toDataURL('image/png');
    }

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

    private get aspectRatio(): number {
        const size = new Vector2();
        this.renderer.getSize(size);
        return size.width / size.height;
    }

    ngOnInit() {
        this.renderer = this.createRenderer();
        this.viewport.appendChild(this.renderer.domElement);

        this.setupScene();
        this.setupCamera();
        this.registerEventHandlers(this.renderer.domElement);

        if (this.filename) {
            this.loadFile(`/assets/models/${this.filename}`, this.filetype);
        } else {
            console.log('viewer could not be loaded due missing filename');
        }
    }

    public parseFile(file: File, filetype: string) {
        this.hide(this.errorMessage);
        LoaderManager.parse(file, filetype).then(this.onLoad.bind(this)).catch(err => {
            this.showError(`An unknown error happened while parsing the model.`);
            console.error(err);
        });
    }

    private loadFile(filename: string, filetype: string) {
        LoaderManager.load(filename, filetype,
            this.onLoad.bind(this),
            this.reportProgress.bind(this),
            (err: ErrorEvent) => {
                this.showError(`An unknown error happened while loading the model.`);
                console.error(err);
            }
        );
    }

    private hide(element: HTMLElement) {
        element.classList.add('hidden');
    }
    private unhide(element: HTMLElement) {
        element.classList.remove('hidden');
    }

    private loadModel(model: Model3D) {
        if (this.model) {
            this.scene.remove(this.model.mesh);
        }

        this.model = model;

        this.normalizeModelSize(model);
        this.scene.add(model.mesh);

        this.renderer.setClearAlpha(0);

        if (model.animations.length) {
            this.populateAnimationSelect(model.animations);
            this.selectAnimation(model.animations[0].name);

            this.unhide(this.animationControls);
        }
    }

    private onLoad(model: Model3D) {
        this.loadModel(model);
        this.resetCamera();
        this.hide(this.progressBar);
        requestAnimationFrame(this.animate.bind(this));
    }

    private reportProgress(xhr: ProgressEvent<EventTarget>) {
        this.progressBar.setAttribute('max', `${xhr.total}`);
        this.progressBar.setAttribute('value', `${xhr.loaded}`);
        this.progressBar.innerText = `${xhr.loaded / xhr.total * 100}%`;
    }

    private showError(message: string) {
        this.errorMessage.innerText = message;
        this.unhide(this.errorMessage);
        this.hide(this.progressBar);
    }

    private createRenderer(): WebGLRenderer {
        const resX = this.resolutionX || this.rendererDefaultResolution.width;
        const resY = this.resolutionY || this.rendererDefaultResolution.height;

        const renderer = new WebGLRenderer({
            alpha: true,
            preserveDrawingBuffer: this.isPreview,
            logarithmicDepthBuffer: true
        });
        renderer.setSize(resX, resY);
        renderer.setClearColor(0);
        return renderer;
    }

    private setupScene() {
        this.scene = new Scene();
        if (!this.isPreview) {
            this.grid = new GridHelper(30, 30, 0x000000, 0x000000);
            this.scene.add(this.grid);
        }

        const color = 'white';
        const intensity = 1;
        this.scene.add(new AmbientLight(color, intensity));
    }

    private setupCamera() {
        const fov = 75;
        const aspectRatio = this.aspectRatio;
        const near = 2;
        const far = 1000;
        this.camera = new PerspectiveCamera(fov, aspectRatio, near, far);
    }

    private resetCamera() {
        this.cameraDistance = 5;
        this.camera.rotation.set(0, 0, 0);
        this.updateCamera();
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

            const smoothing = 0.01;
            const delta = {
                x: (mousePreviousLocation.x - event.clientX) * smoothing,
                y: (mousePreviousLocation.y - event.clientY) * smoothing
            };

            this.rotateCamera(delta);

            mousePreviousLocation = {
                x: event.clientX,
                y: event.clientY
            };
        };

        canvas.onmouseup = (event) => {
            mousePreviousLocation = undefined;
        };

        canvas.onwheel = (event) => {
            const smoothing = 0.005;
            this.zoom(event.deltaY * smoothing);

            event.preventDefault();
            return false;
        };
    }

    private rotateCamera(delta: { x: number, y: number }) {
        this.camera.rotateX(delta.y);
        this.camera.rotateOnWorldAxis(new Vector3(0, 1, 0), delta.x);

        this.updateCamera();
    }

    private zoom(zoom: number) {
        this.cameraDistance += zoom;
        this.cameraDistance = Math.max(2, Math.min(20, this.cameraDistance));

        this.updateCamera();
    }

    private updateCamera() {
        const target = this.model?.mesh.position ?? new Vector3();
        this.camera.position.set(target.x, target.y, target.z);
        this.camera.translateZ(this.cameraDistance);
    }

    private populateAnimationSelect(animations: AnimationClip[]) {
        for (const animation of animations) {
            const template = document.createElement('template');
            template.innerHTML = `<option value='${animation.name}'>${animation.name}</option>`;

            this.animationSelect.appendChild(template.content.firstChild);
        }
    }

    private selectAnimation(animationName: string) {
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
