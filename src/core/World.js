import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/**
 * Moteur du monde 3D — inspiré du design d'index.html (terrain, ciel, lumières, particules)
 */
export class WorldEngine {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.clock = new THREE.Clock();
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.lights = {};
    this.skyMesh = null;
    this.environmentGroup = null;
    this.character = null;
  }

  init() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87ceeb);
    this.scene.fog = new THREE.FogExp2(0x87ceeb, 0.015);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 6, 14);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.target.set(0, 1.5, 0);

    this.buildLights();
    this.buildSky();
    this.createEnvironmentContainer();

    window.addEventListener('resize', () => this.onResize());
  }

  buildLights() {
    const hemi = new THREE.HemisphereLight(0xffffff, 0x4a7c2f, 0.7);
    this.scene.add(hemi);

    const sun = new THREE.DirectionalLight(0xfff5e6, 1.6);
    sun.position.set(50, 80, 30);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -100;
    sun.shadow.camera.right = 100;
    sun.shadow.camera.top = 100;
    sun.shadow.camera.bottom = -100;
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 350;
    this.scene.add(sun);
    this.lights.sun = sun;

    const ambient = new THREE.AmbientLight(0x3a3a40, 0.4);
    this.scene.add(ambient);
    this.lights.ambient = ambient;
  }

  buildSky() {
    const skyGeo = new THREE.SphereGeometry(400, 32, 24);
    const skyMat = new THREE.MeshBasicMaterial({
      color: 0x87ceeb,
      side: THREE.BackSide,
      fog: false
    });
    this.skyMesh = new THREE.Mesh(skyGeo, skyMat);
    this.scene.add(this.skyMesh);
  }

  createEnvironmentContainer() {
    this.environmentGroup = new THREE.Group();
    this.scene.add(this.environmentGroup);
  }

  setEnvironment(envGroup) {
    if (this.environmentGroup && this.environmentGroup.children.length > 0) {
      // Nettoyer l'ancien environnement (hors persistant si besoin)
      while (this.environmentGroup.children.length > 0) {
        this.environmentGroup.remove(this.environmentGroup.children[0]);
      }
    }
    if (envGroup && envGroup.group) {
      this.environmentGroup.add(envGroup.group);
    } else if (envGroup) {
      this.environmentGroup.add(envGroup);
    }
  }

  setCharacter(characterInstance) {
    this.character = characterInstance;
  }

  updateSkyColor(hex) {
    if (this.skyMesh) this.skyMesh.material.color.setHex(hex);
    this.scene.background.setHex(hex);
  }

  onResize() {
    if (!this.camera || !this.renderer) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    if (!this.renderer || !this.scene || !this.camera) return;
    const dt = Math.min(this.clock.getDelta(), 0.05);
    if (this.controls) this.controls.update();
    if (this.character && this.character.updateAnimation) {
      this.character.updateAnimation(dt);
    }
    this.renderer.render(this.scene, this.camera);
  }
}
