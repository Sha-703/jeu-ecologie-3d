import * as THREE from 'three';

/**
 * Environnement : Savane
 * Thème éducatif : Adaptation, climat sec, chaînes alimentaires
 */
export class SavannaEnvironment {
  constructor(scene, group) {
    this.scene = scene;
    this.group = group || new THREE.Group();
    this.name = 'Savane';
    this.ecoTheme = 'Climat sec';
  }

  build() {
    this.buildTerrain();
    this.buildTrees();
    this.buildGrass();
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
      const y = Math.sin(x * 0.06) * 0.2 + Math.sin(z * 0.07) * 0.15;
      pos.setY(i, y);
      const r = 0.65 + Math.random() * 0.1;
      const g = 0.5 + Math.random() * 0.1;
      const b = 0.25 + Math.random() * 0.05;
      cols[i * 3] = r; cols[i * 3 + 1] = g; cols[i * 3 + 2] = b;
    }
    geo.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
    geo.computeVertexNormals();
    const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9, metalness: 0.05 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.receiveShadow = true;
    this.group.add(mesh);
  }

  buildTrees() {
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b });
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x558822, roughness: 0.85 });
    const trunkGeo = new THREE.CylinderGeometry(0.12, 0.35, 2, 6);
    const leafGeo = new THREE.ConeGeometry(2.5, 1.5, 6);
    for (let i = 0; i < 35; i++) {
      const tree = new THREE.Group();
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 1.25; trunk.castShadow = true; tree.add(trunk);
      const leaf = new THREE.Mesh(leafGeo, leafMat);
      leaf.position.y = 2.5; leaf.castShadow = true; tree.add(leaf);
      const x = (Math.random() - 0.5) * 70;
      const z = (Math.random() - 0.5) * 70;
      const h = Math.sin(x * 0.06) * 0.2 + Math.sin(z * 0.07) * 0.15 + 0.3;
      tree.position.set(x, h, z);
      tree.scale.setScalar(0.6 + Math.random() * 0.6);
      tree.rotation.y = Math.random() * Math.PI * 2;
      this.group.add(tree);
    }
  }

  buildGrass() {
    const grassGeo = new THREE.ConeGeometry(0.15, 0.6, 4);
    const grassMat = new THREE.MeshStandardMaterial({ color: 0x997733, roughness: 0.9 });
    for (let i = 0; i < 120; i++) {
      const g = new THREE.Mesh(grassGeo, grassMat);
      const x = (Math.random() - 0.5) * 70;
      const z = (Math.random() - 0.5) * 70;
      const h = Math.sin(x * 0.06) * 0.2 + Math.sin(z * 0.07) * 0.15;
      g.position.set(x, h + 0.3, z);
      g.rotation.y = Math.random() * Math.PI * 2;
      g.castShadow = true;
      this.group.add(g);
    }
  }

  getEcoFacts() {
    return [
      { title: "Adaptation", desc: "Les acacias modifient leurs épines selon la pression herbivore — un exemple d'évolution rapide en réponse au milieu." },
      { title: "Savane et climat", desc: "Les savanes stockent 30% du carbone terrestre dans leurs sols et racines profondes." }
    ];
  }
}
