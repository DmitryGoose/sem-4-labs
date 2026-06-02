import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class Money3D {
    constructor(container) {
        this.container = container;
        this.animationId = null;
        this.init();
    }

    async init() {
        // --- Сцена, камера, рендерер ---
        this.scene = new THREE.Scene();

        const width = this.container.clientWidth;
        const height = this.container.clientHeight || 500;
        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        this.camera.position.set(3, 2, 5);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(0x000000, 0);
        this.container.appendChild(this.renderer.domElement);

        // --- Освещение ---
        const ambient = new THREE.AmbientLight(0xffffff, 0.8);
        this.scene.add(ambient);
        const directional = new THREE.DirectionalLight(0xffffff, 1.2);
        directional.position.set(5, 10, 7);
        this.scene.add(directional);

        // --- OrbitControls (пока без цели, обновим после загрузки) ---
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 1.5;

        // --- Загрузка модели ---
        const loader = new GLTFLoader();
        try {
            const gltf = await loader.loadAsync('/money.glb');
            const model = gltf.scene;

            // Получаем габаритный контейнер модели
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());

            // Полностью центрируем модель: выставляем её позицию так,
            // чтобы геометрический центр оказался в точке (0, 0, 0)
            model.position.x = -center.x;
            model.position.y = -center.y;
            model.position.z = -center.z;

            // Поднимаем модель, чтобы её нижняя грань была на уровне y = 0
            model.position.y += size.y / 2;

            this.scene.add(model);

            // Обновляем цель OrbitControls – теперь вращение будет вокруг центра модели
            // Центр модели после смещения находится в точке (0, size.y / 2, 0)
            this.controls.target.set(0, size.y / 2, 0);
            this.controls.update();
        } catch (error) {
            console.error('Ошибка загрузки 3D-модели:', error);
            // Заглушка
            const geometry = new THREE.CylinderGeometry(1, 1, 0.5, 32);
            const material = new THREE.MeshPhongMaterial({ color: 0x00aa00 });
            const cylinder = new THREE.Mesh(geometry, material);
            this.scene.add(cylinder);
            this.controls.target.set(0, 0, 0);
            this.controls.update();
        }

        // Запуск анимации
        this.animate();
    }

    animate = () => {
        this.animationId = requestAnimationFrame(this.animate);
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    };

    dispose() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.renderer.dispose();
        this.controls.dispose();
        if (this.renderer.domElement.parentNode) {
            this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
        }
    }
}
