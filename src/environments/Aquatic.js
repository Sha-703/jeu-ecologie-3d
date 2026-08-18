import * as THREE from 'three';

/**
 * Environnement : Milieu Aquatique
 * Thème éducatif : Écosystèmes d'eau douce, zones humides
 */
export class AquaticEnvironment {
  constructor(scene, group) {
    this.scene = scene;
    this.group = group || new THREE.Group();
    this.name = 'Milieu Aquatique';
    this.ecoTheme = 'Eau douce';
  }

  build() {
    this.buildWater();
    this.buildBanks();
    this.buildAquaticPlants();
    this.buildLilypads();
    this.scene.add(this.group);
  }

  buildWater() {
    const geo = new THREE.PlaneGeometry(80, 80);
    geo.rotateX(-Math.PI / 2);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x125569,
      roughness: 0.25,
      metalness: 0.3,
      transparent: true,
      opacity: 0.85
    });
    const water = new THREE.Mesh(geo, mat);
    water.receiveShadow = true;
    this.group.add(water);
  }

  buildBanks() {
    const geo = new THREE.PlaneGeometry(80, 80, 30, 30);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    const cols = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const distToCenter = Math.abs(x) * 0.05 + Math.abs(z) * 0.05;
      const y = Math.sin(x * 0.08) * 0.4 + Math.sin(z * 0.1) * 0.3 - distToCenter * 0.2;
      pos.setY(i, Math.max(y, 0.2));
      cols[i * 3] = 0.2; cols[i * 3 + 1] = 0.35; cols[i * 3 + 2] = 0.2;
    }
    geo.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
    geo.computeVertexNormals();
    const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9, metalness: 0.05 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.receiveShadow = true;
    this.group.add(mesh);
  }

  buildAquaticPlants() {
    const reedGeo = new THREE.BoxGeometry(0.05, 1.2, 0.05);
    const reedMat = new THREE.MeshStandardMaterial({ color: 0x558822, roughness: 0.8 });
    for (let i = 0; i < 80; i++) {
      const r = new THREE.Mesh(reedGeo, reedMat);
      const x = (Math.random() - 0.5) * 50;
      const z = (Math.random() - 0.5) * 50;
      r.position.set(x, 0.3, z);
      r.castShadow = true;
      this.group.add(r);
    }
  }

  buildLilypads() {
    const padGeo = new THREE.CircleGeometry(0.4, 8);
    const padMat = new THREE.MeshStandardMaterial({ color: 0x7fbf7f, roughness: 0.6 });
    for (let i = 0; i < 30; i++) {
      const p = new THREE.Mesh(padGeo, padMat);
      const x = (Math.random() - 0.5) * 35;
      const z = (Math.random() - 0.5) * 35;
      p.position.set(x, 0.02, z);
      p.rotation.x = -Math.PI / 2;
      this.group.add(p);
    }
  }

  getEcoFacts() {
    return [
      { title: "Zones humides", desc: "Les zones humides filtrent 50% des polluants avant qu'ils atteignent les cours d'eau principaux." },
      { title: "Cycle de l'eau", desc: "L'eau douce représente moins de 3% de l'eau mondiale — chaque goutte est précieuse et interconnectée." }
    ];
  }
}
