import {
  AmbientLight,
  BoxGeometry,
  Color,
  DirectionalLight,
  EdgesGeometry,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';
import { angularSpeedFromChange, colorForChange } from './btc-rotation';

export class RotatingCubeScene {
  private readonly renderer: WebGLRenderer;
  private readonly scene = new Scene();
  private readonly camera = new PerspectiveCamera(45, 1, 0.1, 100);
  private readonly geometry = new BoxGeometry(1.4, 1.4, 1.4);
  private readonly material = new MeshStandardMaterial({
    color: colorForChange(0),
    emissive: colorForChange(0),
    emissiveIntensity: 0.28,
    roughness: 0.32,
    metalness: 0.22,
  });
  private readonly edgeMaterial = new LineBasicMaterial({ color: 0xf4f7fb });
  private readonly edges = new LineSegments(new EdgesGeometry(this.geometry), this.edgeMaterial);
  private readonly mesh = new Mesh(this.geometry, this.material);
  private readonly observer: ResizeObserver;
  private speed = angularSpeedFromChange(0);
  private frame = 0;
  private last = 0;

  constructor(private readonly canvas: HTMLCanvasElement) {
    this.renderer = new WebGLRenderer({ canvas, antialias: true });
    this.scene.background = new Color(0x0e141c);
    this.camera.position.set(2.5, 1.7, 3.3);
    this.camera.lookAt(0, 0, 0);
    this.mesh.add(this.edges);
    this.scene.add(this.mesh);

    this.scene.add(new AmbientLight(0xffffff, 0.55));
    const key = new DirectionalLight(0xffffff, 1.35);
    key.position.set(3, 4, 5);
    this.scene.add(key);

    this.observer = new ResizeObserver(() => this.resize());
    this.observer.observe(canvas);
    this.resize();
  }

  setChangePercent(changePercent: number): void {
    this.speed = angularSpeedFromChange(changePercent);
    const color = colorForChange(changePercent);
    this.material.color.setHex(color);
    this.material.emissive.setHex(color);
  }

  start(): void {
    this.last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min((now - this.last) / 1000, 0.05);
      this.last = now;
      this.mesh.rotation.y += this.speed * dt;
      this.mesh.rotation.x += this.speed * 0.4 * dt;
      this.renderer.render(this.scene, this.camera);
      this.frame = requestAnimationFrame(loop);
    };
    this.frame = requestAnimationFrame(loop);
  }

  dispose(): void {
    cancelAnimationFrame(this.frame);
    this.observer.disconnect();
    this.geometry.dispose();
    this.edges.geometry.dispose();
    this.edgeMaterial.dispose();
    this.material.dispose();
    this.renderer.dispose();
  }

  private resize(): void {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    if (width === 0 || height === 0) {
      return;
    }

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(width, height, false);
  }
}
