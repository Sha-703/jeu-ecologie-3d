import * as THREE from 'three';

/**
 * Personnage 3D — Écologiste en mission éducative
 */
export class Character {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.meshes = {};
    this.build();
    scene.add(this.group);
  }

  build() {
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x2e5e4e, roughness: 0.5, metalness: 0.1 });
    const headMat = new THREE.MeshStandardMaterial({ color: 0xe8c8a0, roughness: 0.3, metalness: 0.05 });
    const packMat = new THREE.MeshStandardMaterial({ color: 0x5a4e3a, roughness: 0.7 });
    const legMat = new THREE.MeshStandardMaterial({ color: 0x1a2e1a, roughness: 0.6 });

    // Corps
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 1.1, 10), bodyMat);
    body.position.y = 1.1;
    body.castShadow = true;
    this.meshes.body = body;
    this.group.add(body);

    // Tête
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 10, 10), headMat);
    head.position.y = 1.7;
    head.castShadow = true;
    this.meshes.head = head;
    this.group.add(head);

    // Sac à dos (thème explorateur écologique)
    const pack = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.45, 0.15), packMat);
    pack.position.set(0, 1.05, 0.22);
    pack.castShadow = true;
    this.meshes.pack = pack;
    this.group.add(pack);

    // Jambes
    for (const [x, label] of [[-0.14, 'leftLeg'], [0.14, 'rightLeg']]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.55, 0.15), legMat);
      leg.position.set(x, 0.35, 0);
      leg.castShadow = true;
      this.meshes[label] = leg;
      this.group.add(leg);
    }

    this.group.position.set(0, 0.55, 0);
  }

  setPosition(x, y, z) {
    this.group.position.set(x, y || 0.55, z);
  }

  updateAnimation(delta) {
    // Animation de marche simple (balancement léger)
    const t = performance.now() / 1000;
    if (this.meshes.body) this.meshes.body.rotation.y = Math.sin(t * 3) * 0.05;
  }
}
