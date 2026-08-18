import * as THREE from 'three';

export const WEATHER_DATA = {
  forest: {
    type: 'rain',
    icon: '🌧️',
    title: 'Pluie forestière',
    fact: 'La pluie en forêt recharge les nappes phréatiques et nourrit les sols en eau.'
  },
  city: {
    type: 'smog',
    icon: '🌫️',
    title: 'Smog urbain',
    fact: 'Le smog combine pollution et brouillard — il aggrave les maladies respiratoires en ville.'
  },
  savanna: {
    type: 'heat',
    icon: '☀️',
    title: 'Canicule en savane',
    fact: 'Les savanes supportent la sécheresse grâce à des racines profondes et des feuilles adaptées.'
  },
  aquatic: {
    type: 'mist',
    icon: '🌁',
    title: 'Brume matinale',
    fact: 'La brume sur l\'eau protège les écosystèmes aquatiques de la chaleur excessive le matin.'
  }
};

export class WeatherSystem {
  constructor(scene) {
    this.scene = scene;
    this.points = null;
    this.velocities = [];
    this.preset = null;
    this.envKey = 'forest';
    this.heatOverlay = null;
  }

  clear() {
    if (this.points) {
      this.scene.remove(this.points);
      this.points.geometry.dispose();
      this.points.material.dispose();
      this.points = null;
    }
    this.velocities = [];
    this.preset = null;
    if (this.heatOverlay) {
      this.scene.remove(this.heatOverlay);
      this.heatOverlay.geometry.dispose();
      this.heatOverlay.material.dispose();
      this.heatOverlay = null;
    }
  }

  build(envKey) {
    this.clear();
    this.envKey = envKey;
    const data = WEATHER_DATA[envKey];
    if (!data) return;

    const presets = {
      rain: { count: 280, color: 0x90caf9, size: 0.14, spread: 400, yMin: 0, yMax: 28, fall: -14, drift: 0.6 },
      smog: { count: 120, color: 0x78909c, size: 0.22, spread: 340, yMin: 0.5, yMax: 8, fall: 0.3, drift: 0.8, opacity: 0.35 },
      heat: { count: 90, color: 0xffab40, size: 0.1, spread: 400, yMin: 0.2, yMax: 3, fall: 1.8, drift: 0.4, opacity: 0.4 },
      mist: { count: 160, color: 0xb3e5fc, size: 0.18, spread: 380, yMin: -0.5, yMax: 4, fall: 0.15, drift: 0.5, opacity: 0.45 }
    };

    const p = presets[data.type];
    if (!p) return;

    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(p.count * 3);
    this.velocities = [];

    for (let i = 0; i < p.count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * p.spread;
      positions[i * 3 + 1] = p.yMin + Math.random() * (p.yMax - p.yMin);
      positions[i * 3 + 2] = (Math.random() - 0.5) * p.spread;
      this.velocities.push({
        x: (Math.random() - 0.5) * p.drift,
        y: p.fall + (Math.random() - 0.5) * 0.3,
        z: (Math.random() - 0.5) * p.drift
      });
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: p.color,
      size: p.size,
      transparent: true,
      opacity: p.opacity ?? 0.6,
      depthWrite: false
    });
    this.points = new THREE.Points(geo, mat);
    this.preset = p;
    this.scene.add(this.points);

    if (data.type === 'heat') {
      this.heatOverlay = new THREE.Mesh(
        new THREE.PlaneGeometry(800, 800),
        new THREE.MeshBasicMaterial({ color: 0xff8f00, transparent: true, opacity: 0.04, depthWrite: false })
      );
      this.heatOverlay.rotation.x = -Math.PI / 2;
      this.heatOverlay.position.y = 0.05;
      this.heatOverlay.renderOrder = -1;
      this.scene.add(this.heatOverlay);
    }
  }

  applyFog(scene, baseFog) {
    const data = WEATHER_DATA[this.envKey];
    if (!scene.fog || !data) return;
    const boosts = { rain: 0.0008, smog: 0.0018, heat: 0.0003, mist: 0.0012 };
    scene.fog.density = baseFog + (boosts[data.type] || 0);
    const tints = {
      rain: 0x7a9eb5,
      smog: 0x8a9098,
      heat: 0xd4a96a,
      mist: 0x8ecae6
    };
    scene.fog.color.setHex(tints[data.type] || scene.fog.color.getHex());
  }

  getFact() {
    return WEATHER_DATA[this.envKey] || null;
  }

  update(dt, playerPos) {
    if (!this.points || !this.preset) return;
    const p = this.preset;
    const pos = this.points.geometry.attributes.position;
    const half = p.spread / 2;

    if (this.heatOverlay && playerPos) {
      this.heatOverlay.position.x = playerPos.x;
      this.heatOverlay.position.z = playerPos.z;
      this.heatOverlay.material.opacity = 0.035 + Math.sin(performance.now() * 0.001) * 0.012;
    }

    for (let i = 0; i < this.velocities.length; i++) {
      const v = this.velocities[i];
      let x = pos.getX(i) + v.x * dt;
      let y = pos.getY(i) + v.y * dt;
      let z = pos.getZ(i) + v.z * dt;

      if (y < p.yMin) {
        y = p.yMax;
        x = (Math.random() - 0.5) * p.spread;
        z = (Math.random() - 0.5) * p.spread;
      } else if (y > p.yMax + 2) {
        y = p.yMin;
      }
      if (Math.abs(x) > half) x = -Math.sign(x) * half * 0.95;
      if (Math.abs(z) > half) z = -Math.sign(z) * half * 0.95;

      pos.setXYZ(i, x, y, z);
    }
    pos.needsUpdate = true;
  }
}
