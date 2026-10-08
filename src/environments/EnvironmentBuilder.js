import * as THREE from 'three';
import { ENV_CONFIG } from '../config/data.js';

export function buildMapBoundary(scene, getGroundHeight, mapHalf) {
  const boundaryGroup = new THREE.Group();
  const postMat = new THREE.MeshStandardMaterial({ color: 0x6d4c2a, roughness: 0.85 });
  const railMat = new THREE.MeshStandardMaterial({ color: 0x8d6e4a, roughness: 0.8 });
  const postEvery = 6;
  const h = mapHalf;

  function addEdge(a1, a2, fixedAxis, fixedVal) {
    const steps = Math.max(2, Math.floor((a2 - a1) / postEvery));
    for (let i = 0; i <= steps; i++) {
      const t = a1 + (i / steps) * (a2 - a1);
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 1.4, 6), postMat);
      post.castShadow = true;
      if (fixedAxis === 'x') post.position.set(fixedVal, 0, t);
      else post.position.set(t, 0, fixedVal);
      post.position.y = getGroundHeight(post.position.x, post.position.z) + 0.7;
      boundaryGroup.add(post);
    }
    const railLen = a2 - a1;
    const rail = new THREE.Mesh(new THREE.BoxGeometry(
      fixedAxis === 'x' ? 0.08 : railLen, 0.08, fixedAxis === 'z' ? 0.08 : railLen
    ), railMat);
    const midA = (a1 + a2) / 2;
    if (fixedAxis === 'x') rail.position.set(fixedVal, getGroundHeight(fixedVal, midA) + 1.1, midA);
    else rail.position.set(midA, getGroundHeight(midA, fixedVal) + 1.1, fixedVal);
    boundaryGroup.add(rail);
  }

  addEdge(-h, h, 'x', -h);
  addEdge(-h, h, 'x', h);
  addEdge(-h, h, 'z', -h);
  addEdge(-h, h, 'z', h);
  scene.add(boundaryGroup);
  return boundaryGroup;
}

function applySceneAtmosphere(scene, skyMesh, cfg) {
  scene.background = new THREE.Color(cfg.fogColor);
  scene.fog = new THREE.FogExp2(cfg.fogColor, cfg.fog);
  if (skyMesh) skyMesh.material.color.setHex(cfg.fogColor);
}

function buildTerrain(size, segments, heightFn, colorFn) {
  const geo = new THREE.PlaneGeometry(size, size, segments, segments);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position;
  const cols = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i);
    pos.setY(i, heightFn(x, z));
    const c = colorFn(x, z);
    cols[i * 3] = c[0]; cols[i * 3 + 1] = c[1]; cols[i * 3 + 2] = c[2];
  }
  geo.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
  geo.computeVertexNormals();
  const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.92 }));
  mesh.receiveShadow = true;
  return mesh;
}

function addHorizonSilhouettes(envMesh, name) {
  const fogMat = (color) => new THREE.MeshStandardMaterial({ color, roughness: 0.95, fog: true });
  const distMin = 155, distMax = 230;

  const addMountains = (color = 0x7a8a9a) => {
    const mat = fogMat(color);
    for (let i = 0; i < 18; i++) {
      const angle = (i / 18) * Math.PI * 2 + Math.random() * 0.15;
      const dist = distMin + Math.random() * (distMax - distMin);
      const mtn = new THREE.Mesh(
        new THREE.ConeGeometry(28 + Math.random() * 38, 22 + Math.random() * 32, 5), mat
      );
      mtn.position.set(Math.cos(angle) * dist, 5, Math.sin(angle) * dist);
      envMesh.add(mtn);
    }
  };

  if (name === 'forest') {
    addMountains(0x5a6a5a);
    const treeMat = fogMat(0x1a3a1a);
    for (let i = 0; i < 70; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 130 + Math.random() * 70;
      const t = new THREE.Mesh(new THREE.ConeGeometry(2 + Math.random() * 4, 10 + Math.random() * 14, 5), treeMat);
      t.position.set(Math.cos(angle) * dist, 5, Math.sin(angle) * dist);
      envMesh.add(t);
    }
  } else if (name === 'city') {
    const buildMat = fogMat(0x263238);
    for (let i = 0; i < 28; i++) {
      const angle = (i / 28) * Math.PI * 2;
      const dist = distMin + Math.random() * 50;
      const h = 18 + Math.random() * 45;
      const w = 10 + Math.random() * 14;
      const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, w * 0.8), buildMat);
      b.position.set(Math.cos(angle) * dist, h / 2, Math.sin(angle) * dist);
      envMesh.add(b);
    }
  } else if (name === 'aquatic') {
    addMountains(0x6a8a9a);
    const hillMat = fogMat(0x3a6a4a);
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 140 + Math.random() * 60;
      const h = new THREE.Mesh(new THREE.ConeGeometry(15 + Math.random() * 20, 12 + Math.random() * 18, 5), hillMat);
      h.position.set(Math.cos(angle) * dist, 4, Math.sin(angle) * dist);
      envMesh.add(h);
    }
  } else if (name === 'savanna') {
    addMountains(0x9a8a6a);
    const acaciaMat = fogMat(0x4a5a2a);
    for (let i = 0; i < 35; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 130 + Math.random() * 80;
      const a = new THREE.Group();
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.3, 3, 5), acaciaMat);
      trunk.position.y = 1.5; a.add(trunk);
      const crown = new THREE.Mesh(new THREE.ConeGeometry(4, 2, 6), acaciaMat);
      crown.position.y = 3.2; a.add(crown);
      a.position.set(Math.cos(angle) * dist, 0, Math.sin(angle) * dist);
      envMesh.add(a);
    }
  }
}

function buildCityStreets(envMesh, spread, collisions) {
  const asphaltMat = new THREE.MeshStandardMaterial({ color: 0x252528, roughness: 0.88 });
  const sidewalkMat = new THREE.MeshStandardMaterial({ color: 0xbdbdbd, roughness: 0.75 });
  const lineMat = new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.6 });
  const lampMat = new THREE.MeshStandardMaterial({ color: 0x455a64, metalness: 0.35, roughness: 0.5 });
  const benchMat = new THREE.MeshStandardMaterial({ color: 0x6d4c2a, roughness: 0.8 });
  const binMat = new THREE.MeshStandardMaterial({ color: 0x00897b, roughness: 0.6 });
  const roadW = 7;
  const block = 45;
  const half = spread * 0.55;

  for (let i = -Math.ceil(half / block); i <= Math.ceil(half / block); i++) {
    const pos = i * block;
    const roadX = new THREE.Mesh(new THREE.PlaneGeometry(spread, roadW), asphaltMat);
    roadX.rotation.x = -Math.PI / 2;
    roadX.position.set(0, 0.08, pos);
    roadX.receiveShadow = true;
    envMesh.add(roadX);

    const roadZ = new THREE.Mesh(new THREE.PlaneGeometry(roadW, spread), asphaltMat);
    roadZ.rotation.x = -Math.PI / 2;
    roadZ.position.set(pos, 0.08, 0);
    roadZ.receiveShadow = true;
    envMesh.add(roadZ);

    for (const off of [-roadW / 2 - 1, roadW / 2 + 1]) {
      const swX = new THREE.Mesh(new THREE.PlaneGeometry(spread, 2), sidewalkMat);
      swX.rotation.x = -Math.PI / 2;
      swX.position.set(0, 0.09, pos + off);
      envMesh.add(swX);
      const swZ = new THREE.Mesh(new THREE.PlaneGeometry(2, spread), sidewalkMat);
      swZ.rotation.x = -Math.PI / 2;
      swZ.position.set(pos + off, 0.09, 0);
      envMesh.add(swZ);
    }

    const centerLine = new THREE.Mesh(new THREE.PlaneGeometry(spread, 0.15), lineMat);
    centerLine.rotation.x = -Math.PI / 2;
    centerLine.position.set(0, 0.085, pos);
    envMesh.add(centerLine);
    const centerLineZ = new THREE.Mesh(new THREE.PlaneGeometry(0.15, spread), lineMat);
    centerLineZ.rotation.x = -Math.PI / 2;
    centerLineZ.position.set(pos, 0.085, 0);
    envMesh.add(centerLineZ);
  }

  for (let x = -half; x <= half; x += 22) {
    for (let z = -half; z <= half; z += 22) {
      if (Math.abs(x) < 6 && Math.abs(z) < 6) continue;
      const lamp = new THREE.Group();
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 4.5, 6), lampMat);
      pole.position.y = 2.25; pole.castShadow = true; lamp.add(pole);
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.15, 0.25), lampMat);
      head.position.set(0.3, 4.4, 0); lamp.add(head);
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 6),
        new THREE.MeshStandardMaterial({ color: 0xfff9c4, emissive: 0xfff176, emissiveIntensity: 0.4 }));
      bulb.position.set(0.45, 4.35, 0); lamp.add(bulb);
      lamp.position.set(x, 0.1, z);
      envMesh.add(lamp);
      collisions.register(x, z, 0.2);
    }
  }

  for (let i = 0; i < 18; i++) {
    const bx = (Math.random() - 0.5) * spread * 0.8;
    const bz = (Math.random() - 0.5) * spread * 0.8;
    const bench = new THREE.Group();
    bench.add(new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.08, 0.45), benchMat));
    const leg1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.4, 0.4), benchMat);
    leg1.position.set(-0.55, -0.2, 0); bench.add(leg1);
    const leg2 = leg1.clone(); leg2.position.x = 0.55; bench.add(leg2);
    bench.position.set(bx, 0.35, bz);
    bench.rotation.y = Math.random() * Math.PI;
    bench.castShadow = true;
    envMesh.add(bench);
    collisions.register(bx, bz, 0.8);
  }

  for (let i = 0; i < 14; i++) {
    const tx = (Math.random() - 0.5) * spread * 0.7;
    const tz = (Math.random() - 0.5) * spread * 0.7;
    const bin = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.3, 0.9, 8), binMat);
    bin.position.set(tx, 0.55, tz);
    bin.castShadow = true;
    envMesh.add(bin);
    collisions.register(tx, tz, 0.35);
  }

  const busStop = new THREE.Group();
  const roofMat = new THREE.MeshStandardMaterial({ color: 0x1565c0, roughness: 0.5 });
  busStop.add(new THREE.Mesh(new THREE.BoxGeometry(4, 0.12, 2), roofMat));
  busStop.children[0].position.y = 2.8;
  const postMat = new THREE.MeshStandardMaterial({ color: 0x37474f });
  [[-1.8, -0.8], [1.8, -0.8], [-1.8, 0.8], [1.8, 0.8]].forEach(([px, pz]) => {
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.8, 6), postMat);
    p.position.set(px, 1.4, pz); busStop.add(p);
  });
  const sign = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.6, 0.05),
    new THREE.MeshStandardMaterial({ color: 0xffeb3b }));
  sign.position.set(0, 2, 1.05); busStop.add(sign);
  busStop.position.set(20, 0.1, 15);
  envMesh.add(busStop);
  collisions.register(20, 15, 2.2);

  for (let i = 0; i < 8; i++) {
    const cx = (Math.random() - 0.5) * spread * 0.5;
    const cz = (Math.random() - 0.5) * spread * 0.5;
    for (let s = 0; s < 5; s++) {
      const stripe = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 2), lineMat);
      stripe.rotation.x = -Math.PI / 2;
      stripe.position.set(cx + s * 0.55, 0.095, cz);
      envMesh.add(stripe);
    }
  }
}

export function buildEnvironment(name, ctx) {
  const { envMesh, scene, skyMesh, collisions, wind } = ctx;
  const cfg = ENV_CONFIG[name] || ENV_CONFIG.forest;
  let terrainMesh = null;

  if (skyMesh) {
    const targetR = 1200;
    if (skyMesh.geometry.parameters?.radius !== targetR) {
      skyMesh.geometry.dispose();
      skyMesh.geometry = new THREE.SphereGeometry(targetR, 32, 24);
    }
  }

  applySceneAtmosphere(scene, skyMesh, cfg);

  const registerTree = (tree, x, z, leaf, scale) => {
    envMesh.add(tree);
    collisions.register(x, z, 1.1 * scale);
    if (leaf) wind.register(leaf, { amp: 0.06 + Math.random() * 0.04, speed: 1.5 + Math.random() * 0.5 });
  };

  if (name === 'forest') {
    const spread = cfg.spread;
    terrainMesh = buildTerrain(cfg.terrainSize, 56, (x, z) =>
      Math.sin(x * 0.06) * 0.7 + Math.sin(z * 0.09) * 0.5 + Math.sin(x * 0.03 + z * 0.05) * 0.35,
      () => [0.14 + Math.random() * 0.06, 0.28 + Math.random() * 0.08, 0.1 + Math.random() * 0.05]
    );
    envMesh.add(terrainMesh);

    const trunkGeo = new THREE.CylinderGeometry(0.15, 0.35, 2.5, 6);
    const leafGeo = new THREE.ConeGeometry(1.4, 3.5, 6);
    leafGeo.translate(0, 2.8, 0);
    const treeMat = new THREE.MeshStandardMaterial({ color: 0x2b5a26, roughness: 0.85 });
    const treeMat2 = new THREE.MeshStandardMaterial({ color: 0x1e4620, roughness: 0.88 });
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.9 });

    for (let i = 0; i < 320; i++) {
      const tree = new THREE.Group();
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 1.25; trunk.castShadow = true; tree.add(trunk);
      const leaf = new THREE.Mesh(leafGeo, i % 3 === 0 ? treeMat2 : treeMat);
      leaf.castShadow = true; tree.add(leaf);
      const x = (Math.random() - 0.5) * spread, z = (Math.random() - 0.5) * spread;
      const h = Math.sin(x * 0.06) * 0.7 + Math.sin(z * 0.09) * 0.5;
      const s = 0.65 + Math.random() * 0.85;
      tree.position.set(x, h, z);
      tree.scale.setScalar(s);
      tree.rotation.y = Math.random() * Math.PI * 2;
      registerTree(tree, x, z, leaf, s);
    }

    const bushGeo = new THREE.ConeGeometry(0.7, 1.4, 5);
    const bushMat = new THREE.MeshStandardMaterial({ color: 0x3d6b35, roughness: 0.9 });
    for (let i = 0; i < 150; i++) {
      const bush = new THREE.Mesh(bushGeo, bushMat);
      const x = (Math.random() - 0.5) * spread, z = (Math.random() - 0.5) * spread;
      const h = Math.sin(x * 0.06) * 0.7 + Math.sin(z * 0.09) * 0.5;
      bush.position.set(x, h + 0.5, z);
      bush.scale.setScalar(0.6 + Math.random() * 0.8);
      bush.rotation.y = Math.random() * Math.PI * 2;
      bush.castShadow = true;
      envMesh.add(bush);
      wind.register(bush, { amp: 0.04, speed: 2 + Math.random() });
    }

    const rockGeo = new THREE.DodecahedronGeometry(0.6, 0);
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x777777, roughness: 0.7 });
    for (let i = 0; i < 45; i++) {
      const rock = new THREE.Mesh(rockGeo, rockMat);
      const x = (Math.random() - 0.5) * spread, z = (Math.random() - 0.5) * spread;
      rock.position.set(x, Math.sin(x * 0.06) * 0.7 + 0.6, z);
      rock.scale.setScalar(0.3 + Math.random() * 1.2);
      rock.castShadow = true;
      envMesh.add(rock);
      collisions.register(x, z, 0.45 * rock.scale.x);
    }
  }

  if (name === 'city') {
    const spread = cfg.spread;
    terrainMesh = buildTerrain(cfg.terrainSize, 48, (x, z) =>
      Math.sin(x * 0.08) * 0.12 + Math.sin(z * 0.07) * 0.08,
      (x, z) => {
        const onRoad = Math.abs(x % 45) < 4 || Math.abs(z % 45) < 4;
        if (onRoad) return [0.16, 0.16, 0.18];
        return [0.42, 0.44, 0.46];
      }
    );
    envMesh.add(terrainMesh);
    buildCityStreets(envMesh, spread, collisions);

    const buildMat = new THREE.MeshStandardMaterial({ color: 0x37474f, roughness: 0.5 });
    const windowMat = new THREE.MeshStandardMaterial({ color: 0xfff176, emissive: 0xfff176, emissiveIntensity: 0.12 });
    for (let i = 0; i < 45; i++) {
      const wx = (Math.random() - 0.5) * spread, wz = (Math.random() - 0.5) * spread;
      if (Math.abs(wx % 45) < 5 || Math.abs(wz % 45) < 5) continue;
      const b = new THREE.Group();
      const w = 2 + Math.random() * 3, d = 2 + Math.random() * 3, h = 3 + Math.random() * 10;
      b.add(new THREE.Mesh(new THREE.BoxGeometry(w, h, d), buildMat));
      b.position.set(wx, h / 2, wz);
      b.rotation.y = Math.random() * Math.PI * 2;
      envMesh.add(b);
      collisions.register(wx, wz, Math.max(w, d) * 0.55 + 0.5);
    }

    const trunkGeo = new THREE.CylinderGeometry(0.12, 0.3, 2, 6);
    const leafGeo = new THREE.SphereGeometry(1, 6, 6);
    for (let i = 0; i < 40; i++) {
      const tree = new THREE.Group();
      const trunk = new THREE.Mesh(trunkGeo, new THREE.MeshStandardMaterial({ color: 0x5c4033 }));
      trunk.position.y = 1; trunk.castShadow = true; tree.add(trunk);
      const leaf = new THREE.Mesh(leafGeo, new THREE.MeshStandardMaterial({ color: 0x3e6b3e }));
      leaf.position.y = 2.3; leaf.castShadow = true; tree.add(leaf);
      const x = (Math.random() - 0.5) * spread * 0.6, z = (Math.random() - 0.5) * spread * 0.6;
      tree.position.set(x, 0.05, z);
      registerTree(tree, x, z, leaf, 1);
    }
  }

  if (name === 'aquatic') {
    const LAKE_R = cfg.lakeR || 48;
    ctx.lakeRadius = LAKE_R;
    ctx.waterMeshes = ctx.waterMeshes || [];

    const bed = new THREE.Mesh(
      new THREE.CircleGeometry(LAKE_R - 1, 48),
      new THREE.MeshStandardMaterial({ color: 0x0d3d4a, roughness: 0.95, metalness: 0.1 })
    );
    bed.rotation.x = -Math.PI / 2;
    bed.position.y = -0.8;
    envMesh.add(bed);

    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x2aadcf, emissive: 0x084a5e, emissiveIntensity: 0.2,
      roughness: 0.08, metalness: 0.55, transparent: true, opacity: 0.82,
      side: THREE.DoubleSide, depthWrite: false
    });
    const water = new THREE.Mesh(new THREE.CircleGeometry(LAKE_R, 56), waterMat);
    water.rotation.x = -Math.PI / 2;
    water.position.y = 0.08;
    water.receiveShadow = true;
    water.renderOrder = 2;
    envMesh.add(water);
    ctx.waterMeshes.push(water);

    const shimmer = new THREE.Mesh(
      new THREE.CircleGeometry(LAKE_R - 2, 40),
      new THREE.MeshStandardMaterial({
        color: 0x6ed4f0, transparent: true, opacity: 0.25,
        roughness: 0.05, metalness: 0.8, depthWrite: false
      })
    );
    shimmer.rotation.x = -Math.PI / 2;
    shimmer.position.y = 0.12;
    shimmer.renderOrder = 3;
    envMesh.add(shimmer);
    ctx.waterMeshes.push(shimmer);

    const bankGeo = new THREE.PlaneGeometry(cfg.terrainSize, cfg.terrainSize, 56, 56);
    bankGeo.rotateX(-Math.PI / 2);
    const pos = bankGeo.attributes.position;
    const cols = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), z = pos.getZ(i);
      const dist = Math.hypot(x, z);
      let y, r, g, b;
      if (dist < LAKE_R - 1) {
        y = -1.2; r = 0.08; g = 0.22; b = 0.28;
      } else if (dist < LAKE_R + 4) {
        const t = (dist - (LAKE_R - 1)) / 5;
        y = THREE.MathUtils.lerp(-0.2, 0.35, t) + Math.sin(x * 0.12) * 0.08;
        r = 0.15 + t * 0.1; g = 0.35 + t * 0.08; b = 0.2 + t * 0.05;
      } else {
        y = 0.3 + Math.sin(x * 0.06) * 0.35 + Math.sin(z * 0.08) * 0.25;
        r = 0.18 + Math.random() * 0.05;
        g = 0.38 + Math.random() * 0.06;
        b = 0.18 + Math.random() * 0.04;
      }
      pos.setY(i, y);
      cols[i * 3] = r; cols[i * 3 + 1] = g; cols[i * 3 + 2] = b;
    }
    bankGeo.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
    bankGeo.computeVertexNormals();
    terrainMesh = new THREE.Mesh(bankGeo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9 }));
    terrainMesh.receiveShadow = true;
    envMesh.add(terrainMesh);

    // Pas de barrière autour du lac — le joueur peut entrer dans l'eau
    const reedGeo = new THREE.BoxGeometry(0.05, 1.2, 0.05);
    const reedMat = new THREE.MeshStandardMaterial({ color: 0x558822 });
    for (let i = 0; i < 160; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = LAKE_R + 1 + Math.random() * 55;
      const x = Math.cos(angle) * dist, z = Math.sin(angle) * dist;
      const r = new THREE.Mesh(reedGeo, reedMat);
      r.position.set(x, 0.8, z);
      r.castShadow = true;
      envMesh.add(r);
      collisions.register(x, z, 0.15);
      wind.register(r, { amp: 0.12, speed: 2.5, axis: 'x' });
    }

    const padGeo = new THREE.CircleGeometry(0.45, 10);
    const padMat = new THREE.MeshStandardMaterial({ color: 0x7fbf7f, roughness: 0.6, side: THREE.DoubleSide });
    for (let i = 0; i < 55; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * (LAKE_R - 4);
      const p = new THREE.Mesh(padGeo, padMat);
      p.position.set(Math.cos(angle) * dist, 0.14, Math.sin(angle) * dist);
      p.rotation.x = -Math.PI / 2;
      p.rotation.z = Math.random() * Math.PI;
      envMesh.add(p);
    }

    const rockGeo = new THREE.DodecahedronGeometry(0.5, 0);
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x6a7a72, roughness: 0.8 });
    for (let i = 0; i < 28; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = LAKE_R + 2 + Math.random() * 10;
      const rock = new THREE.Mesh(rockGeo, rockMat);
      const x = Math.cos(angle) * dist, z = Math.sin(angle) * dist;
      rock.position.set(x, 0.25, z);
      rock.scale.setScalar(0.5 + Math.random());
      rock.castShadow = true;
      envMesh.add(rock);
      collisions.register(x, z, 0.5);
    }
  }

  if (name === 'savanna') {
    const spread = cfg.spread;
    terrainMesh = buildTerrain(cfg.terrainSize, 48, (x, z) =>
      Math.sin(x * 0.04) * 0.25 + Math.sin(z * 0.05) * 0.18,
      () => [0.65 + Math.random() * 0.1, 0.5 + Math.random() * 0.1, 0.25 + Math.random() * 0.05]
    );
    envMesh.add(terrainMesh);

    const trunkGeo = new THREE.CylinderGeometry(0.12, 0.35, 2, 6);
    const leafGeo = new THREE.ConeGeometry(2.5, 1.5, 6);
    for (let i = 0; i < 95; i++) {
      const tree = new THREE.Group();
      const trunk = new THREE.Mesh(trunkGeo, new THREE.MeshStandardMaterial({ color: 0x8b5a2b }));
      trunk.position.y = 1.25; trunk.castShadow = true; tree.add(trunk);
      const leaf = new THREE.Mesh(leafGeo, new THREE.MeshStandardMaterial({ color: 0x558822 }));
      leaf.position.y = 2.5; leaf.castShadow = true; tree.add(leaf);
      const x = (Math.random() - 0.5) * spread, z = (Math.random() - 0.5) * spread;
      const h = Math.sin(x * 0.04) * 0.25 + 0.3;
      const s = 0.6 + Math.random() * 0.6;
      tree.position.set(x, h, z);
      tree.scale.setScalar(s);
      registerTree(tree, x, z, leaf, s * 1.3);
    }
  }

  addHorizonSilhouettes(envMesh, name);
  return terrainMesh;
}