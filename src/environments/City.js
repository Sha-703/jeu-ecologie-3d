import * as THREE from 'three';

/**
 * Environnement : Ville
 * Thème éducatif : Pollution, urbanisme durable, espaces verts
 */
export class CityEnvironment {
  constructor(scene, group) {
    this.scene = scene;
    this.group = group || new THREE.Group();
    this.name = 'Ville';
    this.ecoTheme = 'Urbanisme durable';
  }

  build() {
    this.buildTerrain();
    this.buildBuildings();
    this.buildGreenSpaces();
    this.scene.add(this.group);
  }

  buildTerrain() {
    const geo = new THREE.PlaneGeometry(80, 80, 30, 30);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    const cols = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const y = Math.sin(x * 0.12) * 0.15 + Math.sin(z * 0.1) * 0.08;
      pos.setY(i, y);
      cols[i * 3] = 0.35; cols[i * 3 + 1] = 0.38; cols[i * 3 + 2] = 0.42;
    }
    geo.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
    geo.computeVertexNormals();
    const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85, metalness: 0.15 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.receiveShadow = true;
    this.group.add(mesh);
  }

  buildBuildings() {
    const buildMat = new THREE.MeshStandardMaterial({ color: 0x37474f, roughness: 0.5 });
    const windowMat = new THREE.MeshStandardMaterial({ color: 0xfff176, emissive: 0xfff176, emissiveIntensity: 0.15, roughness: 0.3 });
    for (let i = 0; i < 18; i++) {
      const b = new THREE.Group();
      const w = 2 + Math.random() * 3;
      const d = 2 + Math.random() * 3;
      const h = 3 + Math.random() * 8;
      const box = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), buildMat);
      box.castShadow = true; box.receiveShadow = true; b.add(box);
      for (let wy = 1; wy < h - 0.5; wy += 1.2) {
        for (let wx = -w / 3; wx < w / 3; wx += 1) {
          const win = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.6, 0.05), windowMat);
          win.position.set(wx, wy, d / 2 + 0.03);
          b.add(win);
        }
      }
      const x = (Math.random() - 0.5) * 55;
      const z = (Math.random() - 0.5) * 55;
      b.position.set(x, h / 2, z);
      b.rotation.y = Math.random() * Math.PI * 2;
      this.group.add(b);
    }
  }

  buildGreenSpaces() {
    // Arbres urbains (espaces verts)
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5c4033 });
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x3e6b3e });
    const trunkGeo = new THREE.CylinderGeometry(0.12, 0.3, 2, 6);
    const leafGeo = new THREE.SphereGeometry(1, 6, 6);
    for (let i = 0; i < 30; i++) {
      const tree = new THREE.Group();
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 1; trunk.castShadow = true; tree.add(trunk);
      const leaf = new THREE.Mesh(leafGeo, leafMat);
      leaf.position.y = 2.3; leaf.castShadow = true; tree.add(leaf);
      const x = (Math.random() - 0.5) * 55;
      const z = (Math.random() - 0.5) * 55;
      tree.position.set(x, 0, z);
      this.group.add(tree);
    }
  }

  getEcoFacts() {
    return [
      { title: "Îlots de chaleur", desc: "Les villes sont 3°C plus chaudes que leurs alentours ruraux. Les arbres et toits verts réduisent cet effet." },
      { title: "Pollution urbaine", desc: "Le transport représente 25% des émissions mondiales. Pistes cyclables et transports en commun sont des solutions clés." }
    ];
  }
}
