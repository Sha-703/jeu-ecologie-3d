import * as THREE from 'three';

/**
 * Environnement : Forêt
 * Thème éducatif : Biodiversité, canopée, cycle du carbone
 */
export class ForestEnvironment {
  constructor(scene, group) {
    this.scene = scene;
    this.group = group || new THREE.Group();
    this.name = 'Forêt';
    this.ecoTheme = 'Biodiversité';
  }

  build() {
    // Terrain forestier avec relief organique
    this.buildTerrain();
    // Arbres (instancing simplifié pour performance)
    this.buildTrees();
    // Rochers et détails naturels
    this.buildRocks();
    // Sous-bois / végétation basse
    this.buildUnderbrush();
    this.scene.add(this.group);
  }

  buildTerrain() {
    const geo = new THREE.PlaneGeometry(80, 80, 40, 40);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    const cols = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const h = Math.sin(x * 0.1) * 0.6 + Math.sin(z * 0.15) * 0.4 + Math.sin(x * 0.05 + z * 0.08) * 0.3;
      pos.setY(i, h);
      const r = 0.14 + Math.random() * 0.06;
      const g = 0.28 + Math.random() * 0.08;
      const b = 0.1 + Math.random() * 0.05;
      cols[i * 3] = r; cols[i * 3 + 1] = g; cols[i * 3 + 2] = b;
    }
    geo.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
    geo.computeVertexNormals();
    const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, metalness: 0.05 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.receiveShadow = true;
    mesh.name = 'terrain';
    this.group.add(mesh);
    return mesh;
  }

  buildTrees() {
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.9 });
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x2b5a26, roughness: 0.85 });
    const trunkGeo = new THREE.CylinderGeometry(0.15, 0.35, 2.5, 6);
    const leafGeo = new THREE.ConeGeometry(1.4, 3.5, 6);
    leafGeo.translate(0, 2.8, 0);

    for (let i = 0; i < 60; i++) {
      const tree = new THREE.Group();
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 1.25; trunk.castShadow = true; tree.add(trunk);
      const leaf = new THREE.Mesh(leafGeo, leafMat);
      leaf.castShadow = true; leaf.receiveShadow = true; tree.add(leaf);
      const x = (Math.random() - 0.5) * 65;
      const z = (Math.random() - 0.5) * 65;
      const h = Math.sin(x * 0.1) * 0.6 + Math.sin(z * 0.15) * 0.4 + 0.1;
      tree.position.set(x, h, z);
      tree.scale.setScalar(0.7 + Math.random() * 0.7);
      tree.rotation.y = Math.random() * Math.PI * 2;
      this.group.add(tree);
    }
  }

  buildRocks() {
    const rockGeo = new THREE.DodecahedronGeometry(0.6, 0);
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x777777, roughness: 0.7, metalness: 0.15 });
    for (let i = 0; i < 25; i++) {
      const rock = new THREE.Mesh(rockGeo, rockMat);
      const x = (Math.random() - 0.5) * 65;
      const z = (Math.random() - 0.5) * 65;
      const h = Math.sin(x * 0.1) * 0.6 + Math.sin(z * 0.15) * 0.4 + 0.6;
      rock.position.set(x, h, z);
      rock.scale.setScalar(0.3 + Math.random() * 1.2);
      rock.rotation.set(Math.random(), Math.random(), Math.random());
      rock.castShadow = true;
      this.group.add(rock);
    }
  }

  buildUnderbrush() {
    // Buissons et petits arbustes
    const bushGeo = new THREE.SphereGeometry(0.5, 6, 6);
    const bushMat = new THREE.MeshStandardMaterial({ color: 0x3a6b32, roughness: 0.9 });
    for (let i = 0; i < 40; i++) {
      const bush = new THREE.Mesh(bushGeo, bushMat);
      const x = (Math.random() - 0.5) * 60;
      const z = (Math.random() - 0.5) * 60;
      const h = Math.sin(x * 0.1) * 0.6 + Math.sin(z * 0.15) * 0.4 + 0.2;
      bush.position.set(x, h + 0.2, z);
      bush.scale.setScalar(0.4 + Math.random() * 0.8);
      bush.castShadow = true;
      this.group.add(bush);
    }
  }

  getEcoFacts() {
    return [
      { title: "Photosynthèse", desc: "Les arbres absorbent le CO₂ et libèrent de l'oxygène — un arbre mature produit assez d'oxygène pour 2 personnes." },
      { title: "Canopée", desc: "La canopée forestière abrite 40% de la biodiversité terrestre, bien que couvrant seulement 6% de la surface." }
    ];
  }
}
