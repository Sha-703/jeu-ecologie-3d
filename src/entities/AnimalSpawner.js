import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GLTF_MODELS } from '../config/data.js';

const GROUND_SPREAD = [
  { kind: 'gltf', url: GLTF_MODELS.fox, scale: 0.018, anim: 'Run', species: 'renard' },
  { kind: 'gltf', url: GLTF_MODELS.fox, scale: 0.017, anim: 'Run', species: 'renard' },
  { kind: 'gltf', url: GLTF_MODELS.fox, scale: 0.019, anim: 'Run', species: 'renard' },
  { kind: 'gltf', url: GLTF_MODELS.fox, scale: 0.016, anim: 'Run', species: 'renard' },
  { kind: 'gltf', url: GLTF_MODELS.fox, scale: 0.018, anim: 'Run', species: 'renard' },
  { kind: 'gltf', url: GLTF_MODELS.fox, scale: 0.017, anim: 'Run', species: 'renard' },
  { kind: 'gltf', url: GLTF_MODELS.fox, scale: 0.018, anim: 'Run', species: 'renard' },
  { kind: 'gltf', url: GLTF_MODELS.fox, scale: 0.016, anim: 'Run', species: 'renard' },
  { kind: 'procedural', type: 'deer', species: 'cerf' },
  { kind: 'gltf', url: GLTF_MODELS.horse, scale: 0.014, anim: 'walk', species: 'cerf' },
  { kind: 'gltf', url: GLTF_MODELS.horse, scale: 0.013, anim: 'walk', species: 'cerf' },
  { kind: 'gltf', url: GLTF_MODELS.duck, scale: 1.2, anim: 'walk', species: 'lapin' },
  { kind: 'gltf', url: GLTF_MODELS.duck, scale: 1.1, anim: 'walk', species: 'lapin' },
  { kind: 'gltf', url: GLTF_MODELS.duck, scale: 1.15, anim: 'walk', species: 'lapin' },
  { kind: 'gltf', url: GLTF_MODELS.parrot, mode: 'fly', radius: 28, flyY: 6.5, scale: 0.015, anim: 'walk', speed: 0.55, species: 'perroquet' },
  { kind: 'gltf', url: GLTF_MODELS.parrot, mode: 'fly', radius: 20, flyY: 5.5, scale: 0.014, anim: 'walk', speed: 0.65, species: 'perroquet' },
  { kind: 'gltf', url: GLTF_MODELS.parrot, mode: 'fly', radius: 22, flyY: 7, scale: 0.013, anim: 'walk', speed: 0.5, species: 'perroquet' },
  { kind: 'gltf', url: GLTF_MODELS.parrot, mode: 'fly', radius: 18, flyY: 6, scale: 0.014, anim: 'walk', speed: 0.7, species: 'perroquet' }
];

const SAVANNA_GROUND = [
  { kind: 'gltf', url: GLTF_MODELS.fox, scale: 0.02, anim: 'Run', species: 'renard' },
  { kind: 'gltf', url: GLTF_MODELS.fox, scale: 0.019, anim: 'Run', species: 'renard' },
  { kind: 'gltf', url: GLTF_MODELS.fox, scale: 0.018, anim: 'Run', species: 'renard' },
  { kind: 'gltf', url: GLTF_MODELS.fox, scale: 0.02, anim: 'Run', species: 'renard' },
  { kind: 'gltf', url: GLTF_MODELS.fox, scale: 0.019, anim: 'Run', species: 'renard' },
  { kind: 'gltf', url: GLTF_MODELS.flamingo, scale: 0.075, anim: 'walk', yOffset: 0.05, species: 'flamant' },
  { kind: 'gltf', url: GLTF_MODELS.flamingo, scale: 0.07, anim: 'walk', yOffset: 0.05, species: 'flamant' },
  { kind: 'gltf', url: GLTF_MODELS.flamingo, scale: 0.072, anim: 'walk', yOffset: 0.05, species: 'flamant' },
  { kind: 'gltf', url: GLTF_MODELS.flamingo, scale: 0.068, anim: 'walk', yOffset: 0.05, species: 'flamant' },
  { kind: 'gltf', url: GLTF_MODELS.flamingo, scale: 0.07, anim: 'walk', yOffset: 0.05, species: 'flamant' },
  { kind: 'gltf', url: GLTF_MODELS.flamingo, scale: 0.073, anim: 'walk', yOffset: 0.05, species: 'flamant' },
  { kind: 'gltf', url: GLTF_MODELS.horse, scale: 0.012, anim: 'walk', species: 'antilope' },
  { kind: 'gltf', url: GLTF_MODELS.horse, scale: 0.011, anim: 'walk', species: 'antilope' },
  { kind: 'gltf', url: GLTF_MODELS.horse, scale: 0.013, anim: 'walk', species: 'antilope' },
  { kind: 'gltf', url: GLTF_MODELS.horse, scale: 0.012, anim: 'walk', species: 'antilope' },
  { kind: 'gltf', url: GLTF_MODELS.parrot, mode: 'fly', radius: 35, flyY: 7, scale: 0.013, anim: 'walk', speed: 0.45, species: 'perroquet' },
  { kind: 'gltf', url: GLTF_MODELS.parrot, mode: 'fly', radius: 22, flyY: 6, scale: 0.012, anim: 'walk', speed: 0.55, species: 'perroquet' },
  { kind: 'gltf', url: GLTF_MODELS.parrot, mode: 'fly', radius: 25, flyY: 8, scale: 0.012, anim: 'walk', speed: 0.5, species: 'perroquet' }
];

const ENV_ANIMALS = {
  forest: GROUND_SPREAD,
  savanna: SAVANNA_GROUND,
  city: [
    { kind: 'gltf', url: GLTF_MODELS.parrot, mode: 'fly', cx: 15, cz: 10, radius: 12, flyY: 5, scale: 0.012, anim: 'walk', speed: 0.5, species: 'perroquet' }
  ]
};

const AQUATIC_SHORE_BIRDS = [
  { url: GLTF_MODELS.flamingo, angle: 0.4, dist: 51, scale: 0.07, anim: 'walk' },
  { url: GLTF_MODELS.flamingo, angle: 2.8, dist: 52, scale: 0.065, anim: 'walk' },
  { url: GLTF_MODELS.parrot, x: 38, z: 44, scale: 0.013, anim: 'walk' }
];

const AQUATIC_CREATURES = [
  { kind: 'fish', color: 0xff7043, accent: 0xffffff, size: 0.28, cx: 8, cz: 4, radius: 10, speed: 1.1, y: -0.05 },
  { kind: 'fish', color: 0x29b6f6, accent: 0x01579b, size: 0.22, cx: -12, cz: -8, radius: 8, speed: 0.9, y: -0.15 },
  { kind: 'fish', color: 0xffeb3b, accent: 0xff6f00, size: 0.2, cx: 15, cz: -15, radius: 7, speed: 1.3, y: -0.08 },
  { kind: 'fish', color: 0x80cbc4, accent: 0x00695c, size: 0.18, cx: -5, cz: 18, radius: 9, speed: 1.0, y: -0.2 },
  { kind: 'turtle', cx: -10, cz: -12, radius: 6, speed: 0.35, y: -0.35 },
  { kind: 'turtle', cx: 20, cz: 8, radius: 5, speed: 0.28, y: -0.4 },
  { kind: 'frog', x: 42, z: 12, lily: true },
  { kind: 'dragonfly', cx: 5, cz: 10, radius: 4, speed: 2.5, y: 0.25 }
];

function buildDeer() {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0x8d6e63, roughness: 0.8 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.45, 0.9), mat);
  body.position.y = 0.55; body.castShadow = true; g.add(body);
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.25, 0.35), mat);
  head.position.set(0, 0.75, 0.55); g.add(head);
  for (const sx of [-0.15, 0.15]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.45, 0.08), mat);
    leg.position.set(sx, 0.22, 0.2); g.add(leg);
    const leg2 = leg.clone(); leg2.position.z = -0.2; g.add(leg2);
  }
  return g;
}

function buildRabbit() {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0xbdbdbd, roughness: 0.75 });
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), mat);
  body.scale.set(1.2, 0.9, 1.4); body.position.y = 0.22; g.add(body);
  const ear = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.25, 0.04), mat);
  ear.position.set(0, 0.45, 0.08); g.add(ear);
  const ear2 = ear.clone(); ear2.position.z = -0.08; g.add(ear2);
  return g;
}

function buildAntelope() {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0xc4a574, roughness: 0.75 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.5, 0.85), mat);
  body.position.y = 0.6; g.add(body);
  const horn = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.35, 4), mat);
  horn.position.set(0, 0.95, 0.12); g.add(horn);
  const horn2 = horn.clone(); horn2.position.z = -0.12; g.add(horn2);
  for (const sx of [-0.12, 0.12]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.5, 0.07), mat);
    leg.position.set(sx, 0.25, 0.18); g.add(leg);
    const leg2 = leg.clone(); leg2.position.z = -0.18; g.add(leg2);
  }
  return g;
}

function buildFish(color, accent, size) {
  const group = new THREE.Group();
  const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.4 });
  const body = new THREE.Mesh(new THREE.SphereGeometry(size, 10, 8), bodyMat);
  body.scale.set(1.9, 0.75, 0.85); group.add(body);
  const tail = new THREE.Mesh(new THREE.ConeGeometry(size * 0.45, size * 0.9, 4), bodyMat);
  tail.rotation.z = Math.PI / 2; tail.position.set(-size * 1.5, 0, 0); group.add(tail);
  group.userData.tail = tail;
  return group;
}

function buildTurtle() {
  const group = new THREE.Group();
  const shell = new THREE.Mesh(new THREE.SphereGeometry(0.35, 10, 8),
    new THREE.MeshStandardMaterial({ color: 0x558b2f }));
  shell.scale.set(1.2, 0.5, 1.4); group.add(shell);
  return group;
}

function buildFrog() {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8),
    new THREE.MeshStandardMaterial({ color: 0x43a047 })));
  return g;
}

function buildDragonfly() {
  const g = new THREE.Group();
  const wing = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 0.08),
    new THREE.MeshStandardMaterial({ color: 0x80deea, transparent: true, opacity: 0.55, side: THREE.DoubleSide }));
  g.add(wing);
  g.userData.wings = [wing];
  return g;
}

function computeYLift(mesh) {
  const box = new THREE.Box3().setFromObject(mesh);
  if (box.isEmpty()) return 0.1;
  return Math.max(0.05, -box.min.y + 0.08);
}

function randomGroundPos(spread) {
  return { x: (Math.random() - 0.5) * spread * 0.85, z: (Math.random() - 0.5) * spread * 0.85 };
}

export class AnimalSpawner {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.mixers = [];
    this.swimmers = [];
    this.flyers = [];
    this.groundAnimals = [];
    this.spread = 360;
    scene.add(this.group);
  }

  clear() {
    this.mixers.forEach(m => m.stopAllAction());
    this.mixers = [];
    this.swimmers = [];
    this.flyers = [];
    this.groundAnimals = [];
    while (this.group.children.length) {
      const c = this.group.children[0];
      this.group.remove(c);
      c.traverse?.(o => { o.geometry?.dispose(); o.material?.dispose?.(); });
    }
  }

  async spawn(envName, getGroundHeight, opts = {}) {
    this.clear();
    this.spread = opts.spread || 360;

    if (envName === 'aquatic') {
      this._spawnAquatic(getGroundHeight, opts.lakeRadius || 48);
      return;
    }

    const configs = ENV_ANIMALS[envName];
    if (!configs) return;

    const loader = new GLTFLoader();
    for (const cfg of configs) {
      if (cfg.kind === 'procedural') {
        this._spawnProcedural(cfg, getGroundHeight);
      } else {
        const pos = cfg.mode === 'fly'
          ? { cx: (Math.random() - 0.5) * this.spread * 0.6, cz: (Math.random() - 0.5) * this.spread * 0.6 }
          : randomGroundPos(this.spread);
        await this._loadGltf(loader, { ...cfg, ...pos }, getGroundHeight);
      }
    }
  }

  _spawnProcedural(cfg, getGroundHeight) {
    let model;
    if (cfg.type === 'deer') model = buildDeer();
    else if (cfg.type === 'rabbit') model = buildRabbit();
    else model = buildAntelope();

    const { x, z } = randomGroundPos(this.spread);
    const gy = getGroundHeight(x, z);
    model.position.set(x, gy, z);
    model.rotation.y = Math.random() * Math.PI * 2;
    model.scale.setScalar(cfg.type === 'rabbit' ? 1.8 : 1.4);
    model.castShadow = true;
    this.group.add(model);
    const yLift = computeYLift(model);
    model.position.y = gy + yLift;
    this._registerGround(model, null, cfg.species, yLift);
  }

  _registerGround(mesh, mixer, species, yLift = null) {
    if (yLift === null) yLift = computeYLift(mesh);
    const id = `a_${Math.random().toString(36).slice(2, 9)}`;
    mesh.userData.animalId = id;
    const entry = {
      id, mesh, mixer, species, yLift, alive: true, mode: 'ground',
      state: 'wander', wanderTimer: Math.random() * 3,
      wanderAngle: Math.random() * Math.PI * 2,
      speed: species === 'lapin' ? 1.4 : 1.1,
      fleeSpeed: species === 'lapin' ? 4.5 : 3.8,
      fallTimer: 0, respawnTimer: 0
    };
    this.groundAnimals.push(entry);
    return entry;
  }

  async _loadGltf(loader, cfg, getGroundHeight) {
    try {
      if (cfg.mode === 'fly') {
        const gltf = await loader.loadAsync(cfg.url);
        const model = gltf.scene.clone();
        model.traverse(c => { if (c.isMesh) c.castShadow = true; });
        model.scale.setScalar(cfg.scale);
        let mixer = null;
        if (gltf.animations.length) {
          mixer = new THREE.AnimationMixer(model);
          const clip = gltf.animations.find(a => a.name.toLowerCase().includes(cfg.anim.toLowerCase())) || gltf.animations[0];
          mixer.clipAction(clip).play();
          this.mixers.push(mixer);
        }
        const cx = cfg.cx ?? 0, cz = cfg.cz ?? 0;
        model.position.set(cx, cfg.flyY ?? 5.5, cz);
        this.group.add(model);
        const id = `f_${Math.random().toString(36).slice(2, 9)}`;
        model.userData.animalId = id;
        this.flyers.push({
          id, mesh: model, mixer, species: cfg.species || 'oiseau', alive: true, mode: 'air',
          cx, cz, radius: cfg.radius ?? 15, angle: Math.random() * Math.PI * 2,
          speed: cfg.speed ?? 0.55, baseSpeed: cfg.speed ?? 0.55,
          flyY: cfg.flyY ?? 5.5, wobble: Math.random() * 10,
          state: 'fly', fallTimer: 0, respawnTimer: 0
        });
        return;
      }

      const gltf = await loader.loadAsync(cfg.url);
      const model = gltf.scene.clone();
      model.traverse(c => { if (c.isMesh) c.castShadow = true; });
      model.scale.setScalar(cfg.scale);
      let mixer = null;
      if (gltf.animations.length) {
        mixer = new THREE.AnimationMixer(model);
        const clip = gltf.animations.find(a => a.name.toLowerCase().includes(cfg.anim.toLowerCase())) || gltf.animations[0];
        mixer.clipAction(clip).play();
        this.mixers.push(mixer);
      }
      const x = cfg.x ?? 0, z = cfg.z ?? 0;
      const gy = getGroundHeight(x, z);
      model.position.set(x, gy, z);
      model.rotation.y = Math.random() * Math.PI * 2;
      this.group.add(model);
      const yLift = computeYLift(model);
      model.position.y = gy + yLift;
      this._registerGround(model, mixer, cfg.species || 'animal', yLift);
    } catch (e) {
      console.warn('Animal non chargé:', e);
    }
  }

  _spawnAquatic(getGroundHeight, lakeR) {
    const waterY = 0.1;
    for (const cfg of AQUATIC_CREATURES) {
      if (cfg.kind === 'fish') {
        const fish = buildFish(cfg.color, cfg.accent, cfg.size);
        fish.position.set(cfg.cx, cfg.y, cfg.cz);
        this.group.add(fish);
        this.swimmers.push({ mesh: fish, type: 'fish', cx: cfg.cx, cz: cfg.cz, radius: cfg.radius, angle: 0, speed: cfg.speed, y: cfg.y });
      }
    }
    const loader = new GLTFLoader();
    for (const bird of AQUATIC_SHORE_BIRDS) {
      const x = bird.x ?? Math.cos(bird.angle) * bird.dist;
      const z = bird.z ?? Math.sin(bird.angle) * bird.dist;
      if (Math.hypot(x, z) < lakeR + 2) continue;
      this._loadGltf(loader, { ...bird, x, z, species: 'oiseau' }, () => Math.max(getGroundHeight(x, z), waterY + 0.15));
    }
  }

  getPreyList() {
    const list = [];
    for (const g of this.groundAnimals) {
      if (g.alive && g.state !== 'dead') list.push(g);
    }
    for (const f of this.flyers) {
      if (f.alive && f.state !== 'dead') list.push(f);
    }
    return list;
  }

  getPreyById(id) {
    return this.groundAnimals.find(a => a.id === id) || this.flyers.find(a => a.id === id);
  }

  shootPrey(id) {
    const prey = this.getPreyById(id);
    if (!prey || !prey.alive) return;
    prey.alive = false;
    prey.state = 'falling';
    prey.fallTimer = 2.5;
    prey.respawnTimer = 28;
    if (prey.mode === 'air') prey.state = 'falling';
    this._showHuntToast(prey.species);
  }

  _showHuntToast(species) {
    const el = document.getElementById('badgeToast');
    if (!el) return;
    el.textContent = `💔 Braconnage ! Un ${species} a été abattu… Protégeons la faune !`;
    el.style.background = 'rgba(239,83,80,0.95)';
    el.style.color = '#fff';
    el.classList.add('visible');
    setTimeout(() => {
      el.classList.remove('visible');
      el.style.background = '';
      el.style.color = '';
    }, 4000);
  }

  _respawnGround(prey, getGroundHeight) {
    const { x, z } = randomGroundPos(this.spread);
    const gy = getGroundHeight(x, z);
    prey.mesh.position.set(x, gy + prey.yLift, z);
    prey.mesh.rotation.set(0, Math.random() * Math.PI * 2, 0);
    prey.mesh.scale.setScalar(prey.mesh.scale.x || 1);
    prey.mesh.visible = true;
    prey.alive = true;
    prey.state = 'wander';
    prey.wanderTimer = 2;
  }

  _respawnFlyer(prey) {
    prey.cx = (Math.random() - 0.5) * this.spread * 0.5;
    prey.cz = (Math.random() - 0.5) * this.spread * 0.5;
    prey.angle = Math.random() * Math.PI * 2;
    prey.mesh.position.set(prey.cx, prey.flyY, prey.cz);
    prey.mesh.rotation.set(0, 0, 0);
    prey.mesh.visible = true;
    prey.alive = true;
    prey.state = 'fly';
    prey.speed = prey.baseSpeed;
  }

  update(dt, poachers = [], getGroundHeight = () => 0) {
    this.mixers.forEach(m => m.update(dt));
    const t = performance.now() * 0.001;

    for (const prey of this.groundAnimals) {
      if (prey.respawnTimer > 0) {
        prey.respawnTimer -= dt;
        if (prey.respawnTimer <= 0) this._respawnGround(prey, getGroundHeight);
        continue;
      }
      if (!prey.alive || prey.state === 'falling') {
        prey.fallTimer -= dt;
        prey.mesh.rotation.x += dt * 2;
        prey.mesh.position.y -= dt * 1.2;
        prey.mesh.scale.multiplyScalar(1 - dt * 0.8);
        if (prey.fallTimer <= 0) prey.mesh.visible = false;
        continue;
      }

      let fleeFrom = null, fleeDist = 38;
      for (const p of poachers) {
        const dx = prey.mesh.position.x - p.group.position.x;
        const dz = prey.mesh.position.z - p.group.position.z;
        const d = Math.hypot(dx, dz);
        if (d < fleeDist) { fleeDist = d; fleeFrom = p; }
      }

      if (fleeFrom) {
        prey.state = 'flee';
        const dx = prey.mesh.position.x - fleeFrom.group.position.x;
        const dz = prey.mesh.position.z - fleeFrom.group.position.z;
        const len = Math.hypot(dx, dz) || 1;
        const step = prey.fleeSpeed * dt;
        prey.mesh.position.x += (dx / len) * step;
        prey.mesh.position.z += (dz / len) * step;
        prey.mesh.rotation.y = Math.atan2(dx, dz);
      } else {
        prey.state = 'wander';
        prey.wanderTimer -= dt;
        if (prey.wanderTimer <= 0) {
          prey.wanderAngle = Math.random() * Math.PI * 2;
          prey.wanderTimer = 2 + Math.random() * 4;
        }
        prey.mesh.position.x += Math.sin(prey.wanderAngle) * prey.speed * dt;
        prey.mesh.position.z += Math.cos(prey.wanderAngle) * prey.speed * dt;
        prey.mesh.rotation.y = prey.wanderAngle;
      }
      prey.mesh.position.y = getGroundHeight(prey.mesh.position.x, prey.mesh.position.z) + prey.yLift;
    }

    for (const f of this.flyers) {
      if (f.respawnTimer > 0) {
        f.respawnTimer -= dt;
        if (f.respawnTimer <= 0) this._respawnFlyer(f);
        continue;
      }
      if (!f.alive || f.state === 'falling') {
        f.fallTimer -= dt;
        f.mesh.position.y -= dt * 3;
        f.mesh.rotation.x += dt * 1.5;
        f.mesh.rotation.z += dt * 2;
        if (f.fallTimer <= 0) f.mesh.visible = false;
        continue;
      }

      let fleeFrom = null, fleeDist = 45;
      for (const p of poachers) {
        const dx = f.mesh.position.x - p.group.position.x;
        const dz = f.mesh.position.z - p.group.position.z;
        const d = Math.hypot(dx, dz);
        if (d < fleeDist) { fleeDist = d; fleeFrom = p; }
      }

      if (fleeFrom) {
        f.state = 'flee';
        f.speed = f.baseSpeed * 2.5;
        const dx = f.mesh.position.x - fleeFrom.group.position.x;
        const dz = f.mesh.position.z - fleeFrom.group.position.z;
        const len = Math.hypot(dx, dz) || 1;
        f.mesh.position.x += (dx / len) * 6 * dt;
        f.mesh.position.z += (dz / len) * 6 * dt;
        f.flyY = Math.min(11, f.flyY + dt * 1.5);
        f.mesh.rotation.y = Math.atan2(dx, dz);
      } else {
        f.state = 'fly';
        f.speed += (f.baseSpeed - f.speed) * Math.min(1, dt * 2);
        f.angle += f.speed * dt;
        f.mesh.position.x = f.cx + Math.cos(f.angle) * f.radius;
        f.mesh.position.z = f.cz + Math.sin(f.angle) * f.radius * 0.7;
        f.mesh.rotation.y = Math.atan2(
          -Math.sin(f.angle) * f.radius * 0.7,
          -Math.cos(f.angle) * f.radius
        );
      }

      f.mesh.position.y = f.flyY + Math.sin(t * 2 + f.wobble) * 0.35;
    }

    for (const s of this.swimmers) {
      if (s.type === 'fish') {
        s.angle = (s.angle || 0) + s.speed * dt;
        s.mesh.position.x = s.cx + Math.cos(s.angle) * s.radius;
        s.mesh.position.z = s.cz + Math.sin(s.angle) * s.radius * 0.65;
      }
    }
  }
}
