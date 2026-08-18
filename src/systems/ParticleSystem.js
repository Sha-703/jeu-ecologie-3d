import * as THREE from 'three';

const PRESETS = {
  forest: { count: 150, color: 0xc5e1a5, size: 0.08, y: [1.5, 4], spread: 360, speed: 0.3 },
  city: { count: 80, color: 0x90a4ae, size: 0.06, y: [0.5, 3], spread: 320, speed: 0.15 },
  aquatic: { count: 150, color: 0x89dff5, size: 0.12, y: [-0.2, 0.5], spread: 360, speed: 0.25 },
  savanna: { count: 130, color: 0xffcc80, size: 0.07, y: [0.3, 2.5], spread: 380, speed: 0.4 }
};

export class ParticleSystem {
  constructor(scene) {
    this.scene = scene;
    this.points = null;
    this.velocities = [];
    this.preset = null;
  }

  clear() {
    if (this.points) {
      this.scene.remove(this.points);
      this.points.geometry.dispose();
      this.points.material.dispose();
      this.points = null;
    }
    this.velocities = [];
  }

  build(envName) {
    this.clear();
    const p = PRESETS[envName];
    if (!p) return;

    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(p.count * 3);
    this.velocities = [];

    for (let i = 0; i < p.count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * p.spread;
      positions[i * 3 + 1] = p.y[0] + Math.random() * (p.y[1] - p.y[0]);
      positions[i * 3 + 2] = (Math.random() - 0.5) * p.spread;
      this.velocities.push({
        x: (Math.random() - 0.5) * p.speed,
        y: (Math.random() - 0.5) * p.speed * 0.3,
        z: (Math.random() - 0.5) * p.speed
      });
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: p.color,
      size: p.size,
      transparent: true,
      opacity: 0.65,
      depthWrite: false
    });
    this.points = new THREE.Points(geo, mat);
    this.preset = p;
    this.scene.add(this.points);
  }

  update(dt) {
    if (!this.points || !this.preset) return;
    const pos = this.points.geometry.attributes.position;
    const half = this.preset.spread / 2;
    for (let i = 0; i < this.velocities.length; i++) {
      const v = this.velocities[i];
      let x = pos.getX(i) + v.x * dt;
      let y = pos.getY(i) + v.y * dt;
      let z = pos.getZ(i) + v.z * dt;
      if (Math.abs(x) > half) x = -x;
      if (y < this.preset.y[0] || y > this.preset.y[1]) v.y *= -1;
      if (Math.abs(z) > half) z = -z;
      pos.setXYZ(i, x, y, z);
    }
    pos.needsUpdate = true;
  }
}
