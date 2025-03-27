import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// @ts-ignore
import mapTexture from '../assets/globe/politicial_valid.jpg';

class InteractiveGlobe {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private globe: THREE.Mesh;
    private controls: OrbitControls;

    constructor(private readonly container: HTMLElement) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.domElement.style.width = '100%';
        this.renderer.domElement.style.height = '100%';
        this.container.appendChild(this.renderer.domElement);

        const geometry = new THREE.SphereGeometry(5, 128, 128);
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load(mapTexture);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;

        const normalMap = textureLoader.load(mapTexture);
        const material = new THREE.MeshStandardMaterial({
            map: texture,
            normalMap: normalMap,
            metalness: 0.3,
            roughness: 0.7,
        });
        this.globe = new THREE.Mesh(geometry, material);
        this.scene.add(this.globe);

        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(5, 5, 5);
        this.scene.add(light);

        const ambientLight = new THREE.AmbientLight(0xffffff, 1.5); // Увеличил интенсивность
        this.scene.add(ambientLight);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.camera.position.z = 10;
        this.controls.update();

        window.addEventListener('resize', this.onWindowResize.bind(this));
        this.animate();
    }

    private latLonToVector3(lat: number, lon: number, radius: number = 5): THREE.Vector3 {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        return new THREE.Vector3(
            -(radius * Math.sin(phi) * Math.cos(theta)),
            radius * Math.cos(phi),
            radius * Math.sin(phi) * Math.sin(theta)
        );
    }

    public addPoint(lat: number, lon: number, inputColor: string): void {
        const pointGeometry = new THREE.SphereGeometry(0.03, 8, 8);
        const pointMaterial = new THREE.MeshBasicMaterial({ color: inputColor });
        const point = new THREE.Mesh(pointGeometry, pointMaterial);
        point.position.copy(this.latLonToVector3(lat, lon));
        this.scene.add(point);
    }

    public addRoute(lat1: number, lon1: number, lat2: number, lon2: number, inputColor: string): void {
        const start = this.latLonToVector3(lat1, lon1).normalize();
        const end = this.latLonToVector3(lat2, lon2).normalize();

        const points: THREE.Vector3[] = [];
        const segments = 100;
        const altitude = 0.3;

        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const intermediate = new THREE.Vector3().copy(start).lerp(end, t).normalize();
            intermediate.multiplyScalar(5 + altitude - 0.3);

            points.push(intermediate);
        }

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: inputColor });

        const line = new THREE.Line(geometry, material);
        this.scene.add(line);
    }

    private animate(): void {
        requestAnimationFrame(this.animate.bind(this));
        this.renderer.render(this.scene, this.camera);
    }

    private onWindowResize(): void {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }

    public createRoute(lat1: number, lon1: number, lat2: number, lon2: number) {
        let randomColor = this.getRandomHexColor();
        this.addPoint(lat1, lon1, randomColor); // Лондон
        this.addPoint(lat2, lon2, randomColor); // Нью-Йорк
        this.addRoute(lat1, lon1, lat2, lon2, randomColor);
    }

    public getRandomHexColor() {
        return `#${Math.floor(Math.random() * 16777215)
            .toString(16)
            .padStart(6, '0')}`;
    }
}

export default InteractiveGlobe;
