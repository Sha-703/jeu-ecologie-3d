import * as THREE from 'three';
import { NPC_DATA, NPC_MESSAGES, NPC_DIALOGUES, NPC_NEAR_RADIUS, POACHER_REPORT_RADIUS } from '../config/data.js';

function makeNameSprite(text, color = '#e8f5e9', bg = 'rgba(6,22,12,0.75)') {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = bg;
  ctx.fillRect(4, 8, 248, 48);
  ctx.fillStyle = color;
  ctx.font = 'bold 22px Segoe UI, Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 128, 32);
  const tex = new THREE.CanvasTexture(canvas);
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(2.2, 0.55, 1);
  sprite.position.y = 2.15;
  sprite.renderOrder = 10;
  return sprite;
}

function buildRanger() {
  const group = new THREE.Group();
  const uniformMat = new THREE.MeshStandardMaterial({ color: 0x2e5e3a, roughness: 0.65 });
  const vestMat = new THREE.MeshStandardMaterial({ color: 0x4a7c4f, roughness: 0.6 });
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xc8956a, roughness: 0.35 });
  const hatMat = new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.8 });
  const badgeMat = new THREE.MeshStandardMaterial({ color: 0xffd54f, emissive: 0xffa000, emissiveIntensity: 0.3 });

  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.34, 1.05, 10), uniformMat);
  body.position.y = 1.05; body.castShadow = true; group.add(body);

  const vest = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.55, 0.28), vestMat);
  vest.position.y = 1.1; vest.castShadow = true; group.add(vest);

  const badge = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.02, 8), badgeMat);
  badge.rotation.x = Math.PI / 2;
  badge.position.set(0, 1.25, 0.15); group.add(badge);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.26, 10, 10), skinMat);
  head.position.y = 1.62; head.castShadow = true; group.add(head);

  const hat = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.28, 0.18, 10), hatMat);
  hat.position.y = 1.82; hat.castShadow = true; group.add(hat);
  const hatBrim = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.04, 10), hatMat);
  hatBrim.position.y = 1.74; group.add(hatBrim);

  const leftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.52, 0.14), uniformMat);
  leftLeg.position.set(-0.13, 0.26, 0); leftLeg.castShadow = true; group.add(leftLeg);
  const rightLeg = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.52, 0.14), uniformMat);
  rightLeg.position.set(0.13, 0.26, 0); rightLeg.castShadow = true; group.add(rightLeg);

  return { group, parts: { body, head, leftLeg, rightLeg }, walkPhase: 0 };
}

function buildCivilian(bodyColor) {
  const group = new THREE.Group();
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xd4a574, roughness: 0.35 });
  const bodyMat = new THREE.MeshStandardMaterial({ color: bodyColor, roughness: 0.55 });
  const legMat = new THREE.MeshStandardMaterial({ color: 0x37474f, roughness: 0.65 });
  const bagMat = new THREE.MeshStandardMaterial({ color: 0x8d6e63, roughness: 0.7 });

  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 1.05, 10), bodyMat);
  body.position.y = 1.05; body.castShadow = true; group.add(body);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.26, 10, 10), skinMat);
  head.position.y = 1.62; head.castShadow = true; group.add(head);

  const bag = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.35, 0.12), bagMat);
  bag.position.set(0.15, 1, 0.18); bag.castShadow = true; group.add(bag);

  const leftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.52, 0.14), legMat);
  leftLeg.position.set(-0.12, 0.26, 0); leftLeg.castShadow = true; group.add(leftLeg);
  const rightLeg = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.52, 0.14), legMat);
  rightLeg.position.set(0.12, 0.26, 0); rightLeg.castShadow = true; group.add(rightLeg);

  return { group, parts: { body, head, leftLeg, rightLeg }, walkPhase: 0 };
}

function buildPoacher() {
  const group = new THREE.Group();
  const camoMat = new THREE.MeshStandardMaterial({ color: 0x3d4a2a, roughness: 0.75 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.8 });
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xb8956a, roughness: 0.4 });
  const rifleMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.3, roughness: 0.5 });

  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.34, 1.05, 10), camoMat);
  body.position.y = 1.05; body.castShadow = true; group.add(body);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.26, 10, 10), skinMat);
  head.position.y = 1.62; head.castShadow = true; group.add(head);

  const hood = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.35, 8), darkMat);
  hood.position.y = 1.82; hood.rotation.x = Math.PI; group.add(hood);

  const rifle = new THREE.Group();
  const stock = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.5), rifleMat);
  stock.position.set(0.2, 0.9, 0.25); rifle.add(stock);
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.7, 6), rifleMat);
  barrel.rotation.x = Math.PI / 2;
  barrel.position.set(0.2, 0.95, 0.55); rifle.add(barrel);
  group.add(rifle);

  const leftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.52, 0.14), camoMat);
  leftLeg.position.set(-0.13, 0.26, 0); leftLeg.castShadow = true; group.add(leftLeg);
  const rightLeg = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.52, 0.14), camoMat);
  rightLeg.position.set(0.13, 0.26, 0); rightLeg.castShadow = true; group.add(rightLeg);

  group.scale.setScalar(1.05);
  return { group, parts: { body, head, leftLeg, rightLeg, rifle }, walkPhase: 0 };
}

function buildPoacherCamp(x, z, getGroundHeight) {
  const camp = new THREE.Group();
  const gy = getGroundHeight(x, z);

  const tentMat = new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.85 });
  const tent = new THREE.Mesh(new THREE.ConeGeometry(1.8, 2.2, 4), tentMat);
  tent.position.y = 1.1; tent.rotation.y = Math.PI / 4; tent.castShadow = true;
  camp.add(tent);

  const crateMat = new THREE.MeshStandardMaterial({ color: 0x6d4c2a, roughness: 0.9 });
  const crate = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 0.8), crateMat);
  crate.position.set(1.5, 0.3, 0.5); crate.castShadow = true; camp.add(crate);

  const fire = new THREE.Mesh(
    new THREE.SphereGeometry(0.25, 8, 8),
    new THREE.MeshStandardMaterial({ color: 0xff6d00, emissive: 0xff3d00, emissiveIntensity: 0.6 })
  );
  fire.position.set(-1.2, 0.2, 0.8); camp.add(fire);

  const logMat = new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.95 });
  const log = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.2, 6), logMat);
  log.rotation.z = Math.PI / 2;
  log.position.set(-1.2, 0.08, 0.8); camp.add(log);

  camp.position.set(x, gy, z);
  return camp;
}

function animateWalk(npc, dt, isMoving) {
  const { leftLeg, rightLeg, body, head } = npc.parts;
  if (isMoving) {
    npc.walkPhase += dt * (npc.type === 'poacher' ? 7 : 10);
    const swing = Math.sin(npc.walkPhase) * (npc.type === 'poacher' ? 0.4 : 0.5);
    leftLeg.rotation.x = swing;
    rightLeg.rotation.x = -swing;
    const bob = Math.abs(Math.sin(npc.walkPhase * 2)) * 0.05;
    body.position.y = 1.05 + bob;
    head.position.y = 1.62 + bob * 0.4;
  } else {
    leftLeg.rotation.x *= Math.pow(0.05, dt);
    rightLeg.rotation.x *= Math.pow(0.05, dt);
  }
}

export class NPCSpawner {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.npcs = [];
    this.camps = [];
    this.nearestPoacher = null;
    this.nearestTalkable = null;
    this.dialogueOpen = false;
    this.onAudioGunshot = null;
    scene.add(this.group);
  }

  clear() {
    this.npcs = [];
    this.camps = [];
    this.nearestPoacher = null;
    while (this.group.children.length) {
      const c = this.group.children[0];
      this.group.remove(c);
      c.traverse?.(o => {
        o.geometry?.dispose();
        if (o.material) {
          const mats = Array.isArray(o.material) ? o.material : [o.material];
          mats.forEach(m => { m.map?.dispose(); m.dispose(); });
        }
      });
    }
    this._setHint(false);
    this.closeDialogue();
  }

  spawn(envName, getGroundHeight) {
    this.clear();
    const configs = NPC_DATA[envName];
    if (!configs) return;

    const campsBuilt = new Set();

    for (const cfg of configs) {
      let built;
      if (cfg.type === 'poacher') {
        built = buildPoacher();
        const campKey = `${Math.round(cfg.x)},${Math.round(cfg.z)}`;
        if (!campsBuilt.has(campKey)) {
          const cx = cfg.x - 2, cz = cfg.z - 2;
          this.group.add(buildPoacherCamp(cx, cz, getGroundHeight));
          this.camps.push({ x: cx, z: cz });
          campsBuilt.add(campKey);
        }
      } else if (cfg.type === 'ranger') {
        built = buildRanger();
      } else {
        built = buildCivilian(cfg.bodyColor || 0x78909c);
      }

      const { group, parts } = built;
      const gy = getGroundHeight(cfg.x, cfg.z);
      group.position.set(cfg.x, gy, cfg.z);

      const labelColor = cfg.type === 'poacher' ? '#ef9a9a' : cfg.type === 'ranger' ? '#a5d6a7' : '#a5d6a7';
      const labelBg = cfg.type === 'poacher' ? 'rgba(40,10,10,0.85)' : cfg.type === 'ranger' ? 'rgba(10,40,20,0.85)' : 'rgba(6,22,12,0.75)';
      group.add(makeNameSprite(cfg.label, labelColor, labelBg));

      this.group.add(group);
      this.npcs.push({
        id: cfg.id,
        group,
        parts,
        walkPhase: 0,
        type: cfg.type,
        label: cfg.label,
        patrol: cfg.patrol.map(p => ({ x: p[0], z: p[1] })),
        patrolIdx: 0,
        speed: cfg.type === 'poacher' ? 1.1 : cfg.type === 'ranger' ? 1.8 : 1.6,
        chaseSpeed: cfg.type === 'ranger' ? 3.6 : 3.4,
        fleeSpeed: 4.8,
        waitTimer: Math.random() * 2,
        huntTarget: null,
        aiState: 'patrol',
        aimTimer: 0,
        shootCooldown: 0,
        fleeTimer: 0,
        fleeDir: { x: 0, z: 0 },
        reported: false,
        muzzleFlash: null
      });
    }
  }

  getPoachers() {
    return this.npcs.filter(n => n.type === 'poacher');
  }

  getRangers() {
    return this.npcs.filter(n => n.type === 'ranger');
  }

  _scarePoacher(poacher, ranger) {
    if (poacher.aiState === 'flee') return;
    const px = poacher.group.position.x - ranger.group.position.x;
    const pz = poacher.group.position.z - ranger.group.position.z;
    const len = Math.hypot(px, pz) || 1;
    poacher.huntTarget = null;
    poacher.aiState = 'flee';
    poacher.fleeTimer = 14;
    poacher.fleeDir = { x: px / len, z: pz / len };
    poacher.aimTimer = 0;
    poacher.shootCooldown = 10;
    if (poacher.parts.rifle) poacher.parts.rifle.rotation.x = 0;
  }

  _findPoacherForRanger(ranger, poachers, radius = 55) {
    const rx = ranger.group.position.x, rz = ranger.group.position.z;
    let best = null, bestD = radius;
    for (const p of poachers) {
      if (p.aiState === 'flee' || p.reported) continue;
      const d = Math.hypot(p.group.position.x - rx, p.group.position.z - rz);
      if (d < bestD) { bestD = d; best = p; }
    }
    return best;
  }

  _updateRanger(ranger, dt, getGroundHeight, poachers) {
    const target = this._findPoacherForRanger(ranger, poachers);
    if (target) {
      const dx = target.group.position.x - ranger.group.position.x;
      const dz = target.group.position.z - ranger.group.position.z;
      const dist = Math.hypot(dx, dz);
      if (dist < 7) {
        this._scarePoacher(target, ranger);
        animateWalk(ranger, dt, false);
        return;
      }
      const step = ranger.chaseSpeed * dt;
      ranger.group.position.x += (dx / dist) * step;
      ranger.group.position.z += (dz / dist) * step;
      ranger.group.rotation.y = Math.atan2(dx, dz);
      ranger.group.position.y = getGroundHeight(ranger.group.position.x, ranger.group.position.z);
      animateWalk(ranger, dt, true);
      return;
    }

    if (ranger.waitTimer > 0) {
      ranger.waitTimer -= dt;
      animateWalk(ranger, dt, false);
      return;
    }
    const pt = ranger.patrol[ranger.patrolIdx];
    const dx = pt.x - ranger.group.position.x;
    const dz = pt.z - ranger.group.position.z;
    const dist = Math.hypot(dx, dz);
    if (dist < 0.6) {
      ranger.patrolIdx = (ranger.patrolIdx + 1) % ranger.patrol.length;
      ranger.waitTimer = 1 + Math.random() * 2;
      animateWalk(ranger, dt, false);
    } else {
      const step = ranger.speed * dt;
      ranger.group.position.x += (dx / dist) * step;
      ranger.group.position.z += (dz / dist) * step;
      ranger.group.rotation.y = Math.atan2(dx, dz);
      ranger.group.position.y = getGroundHeight(ranger.group.position.x, ranger.group.position.z);
      animateWalk(ranger, dt, true);
    }
  }

  getNearestTalkable(playerPos, radius = NPC_NEAR_RADIUS) {
    if (!playerPos) return null;
    let best = null, bestD = radius;
    for (const npc of this.npcs) {
      if (npc.aiState === 'flee') continue;
      const dx = playerPos.x - npc.group.position.x;
      const dz = playerPos.z - npc.group.position.z;
      const d = Math.hypot(dx, dz);
      if (d < bestD) { bestD = d; best = npc; }
    }
    return best;
  }

  getDialogue(npc) {
    if (!npc) return null;
    return NPC_DIALOGUES[npc.id] || (npc.type === 'poacher' ? NPC_DIALOGUES._poacher : null);
  }

  tryTalk(playerPos, journal, onTalk) {
    if (this.dialogueOpen) return false;
    const npc = this.getNearestTalkable(playerPos);
    const dialogue = this.getDialogue(npc);
    if (!npc || !dialogue) return false;

    this.dialogueOpen = true;
    document.getElementById('dialogueModalIcon').textContent = dialogue.icon;
    document.getElementById('dialogueModalTitle').textContent = dialogue.title;
    document.getElementById('dialogueModalQuote').textContent = dialogue.quote;
    document.getElementById('dialogueModalFact').textContent = dialogue.fact;
    document.getElementById('dialogueModal')?.classList.add('visible');
    document.getElementById('npcTalkHint')?.classList.remove('visible');
    journal?.addEntry(`Dialogue avec ${dialogue.title}`);
    onTalk?.(npc.id);
    return true;
  }

  closeDialogue() {
    this.dialogueOpen = false;
    document.getElementById('dialogueModal')?.classList.remove('visible');
  }

  onAudioGunshot = null;

  getCampPositions() {
    return this.camps;
  }

  getNearestPoacher(playerPos, radius = POACHER_REPORT_RADIUS) {
    if (!playerPos) return null;
    let best = null, bestD = radius;
    for (const npc of this.getPoachers()) {
      if (npc.reported || npc.aiState === 'flee') continue;
      const dx = playerPos.x - npc.group.position.x;
      const dz = playerPos.z - npc.group.position.z;
      const d = Math.hypot(dx, dz);
      if (d < bestD) { bestD = d; best = npc; }
    }
    return best;
  }

  tryReport(playerPos, journal, animals, onReported) {
    const poacher = this.getNearestPoacher(playerPos);
    if (!poacher) return false;

    const wasAiming = poacher.aiState === 'aim' || poacher.aiState === 'chase';
    const savedAnimal = wasAiming && poacher.huntTarget?.alive;

    poacher.huntTarget = null;
    poacher.aiState = 'flee';
    poacher.fleeTimer = 10;
    poacher.reported = true;
    poacher.aimTimer = 0;
    poacher.shootCooldown = 8;
    if (poacher.parts.rifle) poacher.parts.rifle.rotation.x = 0;
    if (poacher.muzzleFlash) {
      poacher.group.remove(poacher.muzzleFlash);
      poacher.muzzleFlash.geometry?.dispose();
      poacher.muzzleFlash.material?.dispose();
      poacher.muzzleFlash = null;
    }

    const px = poacher.group.position.x - playerPos.x;
    const pz = poacher.group.position.z - playerPos.z;
    const len = Math.hypot(px, pz) || 1;
    poacher.fleeDir = { x: px / len, z: pz / len };

    journal?.unlockBadgeById('wildlife_protector');
    if (savedAnimal) {
      journal?.addEntry('Braconnier signalé — un animal a été sauvé ! 🛡️');
    } else {
      journal?.addEntry('Braconnier signalé aux autorités ! 🛡️');
    }
    this._showReportToast(savedAnimal);
    onReported?.();
    return true;
  }

  _showReportToast(savedAnimal) {
    const el = document.getElementById('badgeToast');
    if (!el) return;
    el.textContent = savedAnimal
      ? '🛡️ Braconnier arrêté — animal sauvé !'
      : '🛡️ Braconnier signalé — il prend la fuite !';
    el.style.background = 'rgba(129,199,132,0.95)';
    el.style.color = '#1a2e1a';
    el.classList.add('visible');
    setTimeout(() => {
      el.classList.remove('visible');
      el.style.background = '';
      el.style.color = '';
    }, 3500);
  }

  _findPrey(poacher, animals) {
    if (!animals) return null;
    const px = poacher.group.position.x, pz = poacher.group.position.z;
    let best = null, bestD = 55;
    for (const prey of animals.getPreyList()) {
      const dx = prey.mesh.position.x - px;
      const dz = prey.mesh.position.z - pz;
      const d = Math.hypot(dx, dz);
      if (d < bestD) { bestD = d; best = prey; }
    }
    return best;
  }

  _flashMuzzle(poacher) {
    if (poacher.muzzleFlash) {
      poacher.group.remove(poacher.muzzleFlash);
      poacher.muzzleFlash.geometry?.dispose();
      poacher.muzzleFlash.material?.dispose();
    }
    const flash = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 6, 6),
      new THREE.MeshStandardMaterial({ color: 0xffeb3b, emissive: 0xff6f00, emissiveIntensity: 1 })
    );
    flash.position.set(0.2, 1.05, 0.9);
    poacher.group.add(flash);
    poacher.muzzleFlash = flash;
    setTimeout(() => {
      if (poacher.muzzleFlash === flash) {
        poacher.group.remove(flash);
        flash.geometry?.dispose();
        flash.material?.dispose();
        poacher.muzzleFlash = null;
      }
    }, 120);
  }

  _updatePoacher(poacher, dt, getGroundHeight, animals) {
    if (poacher.shootCooldown > 0) poacher.shootCooldown -= dt;

    if (poacher.aiState === 'flee') {
      poacher.fleeTimer -= dt;
      const step = poacher.fleeSpeed * dt;
      poacher.group.position.x += poacher.fleeDir.x * step;
      poacher.group.position.z += poacher.fleeDir.z * step;
      poacher.group.rotation.y = Math.atan2(poacher.fleeDir.x, poacher.fleeDir.z);
      poacher.group.position.y = getGroundHeight(poacher.group.position.x, poacher.group.position.z);
      animateWalk(poacher, dt, true);
      if (poacher.fleeTimer <= 0) {
        poacher.aiState = 'patrol';
        poacher.reported = false;
        poacher.waitTimer = 3;
      }
      return;
    }

    if (poacher.aiState === 'aim') {
      poacher.aimTimer -= dt;
      animateWalk(poacher, dt, false);
      if (poacher.parts.rifle && poacher.huntTarget?.mesh) {
        const t = poacher.huntTarget.mesh.position;
        const dx = t.x - poacher.group.position.x;
        const dz = t.z - poacher.group.position.z;
        poacher.group.rotation.y = Math.atan2(dx, dz);
        poacher.parts.rifle.rotation.x = poacher.huntTarget.mode === 'air' ? -0.35 : -0.1;
      }
      if (!poacher.gunFired && poacher.aimTimer <= 0.4) {
        poacher.gunFired = true;
        this._flashMuzzle(poacher);
        this.onAudioGunshot?.();
      }
      if (poacher.aimTimer <= 0) {
        if (poacher.huntTarget?.id) animals.shootPrey(poacher.huntTarget.id);
        poacher.aiState = 'patrol';
        poacher.huntTarget = null;
        poacher.shootCooldown = 4;
        poacher.waitTimer = 1.5;
        if (poacher.parts.rifle) poacher.parts.rifle.rotation.x = 0;
      }
      return;
    }

    if (!poacher.huntTarget || !poacher.huntTarget.alive) {
      poacher.huntTarget = this._findPrey(poacher, animals);
    }

    if (poacher.huntTarget && poacher.shootCooldown <= 0) {
      const t = poacher.huntTarget.mesh.position;
      const dx = t.x - poacher.group.position.x;
      const dz = t.z - poacher.group.position.z;
      const dist = Math.hypot(dx, dz);
      const shootRange = poacher.huntTarget.mode === 'air' ? 8 : 3.2;

      if (dist < shootRange) {
        poacher.aiState = 'aim';
        poacher.aimTimer = 1.0;
        poacher.gunFired = false;
        return;
      }

      poacher.aiState = 'chase';
      const step = poacher.chaseSpeed * dt;
      poacher.group.position.x += (dx / dist) * step;
      poacher.group.position.z += (dz / dist) * step;
      poacher.group.rotation.y = Math.atan2(dx, dz);
      poacher.group.position.y = getGroundHeight(poacher.group.position.x, poacher.group.position.z);
      animateWalk(poacher, dt, true);
      return;
    }

    poacher.aiState = 'patrol';
    poacher.huntTarget = null;
    if (poacher.waitTimer > 0) {
      poacher.waitTimer -= dt;
      animateWalk(poacher, dt, false);
      return;
    }
    const target = poacher.patrol[poacher.patrolIdx];
    const dx = target.x - poacher.group.position.x;
    const dz = target.z - poacher.group.position.z;
    const dist = Math.hypot(dx, dz);
    if (dist < 0.6) {
      poacher.patrolIdx = (poacher.patrolIdx + 1) % poacher.patrol.length;
      poacher.waitTimer = 2 + Math.random() * 3;
      animateWalk(poacher, dt, false);
    } else {
      const step = poacher.speed * dt;
      poacher.group.position.x += (dx / dist) * step;
      poacher.group.position.z += (dz / dist) * step;
      poacher.group.rotation.y = Math.atan2(dx, dz);
      poacher.group.position.y = getGroundHeight(poacher.group.position.x, poacher.group.position.z);
      animateWalk(poacher, dt, true);
    }
  }

  update(dt, playerPos, getGroundHeight, animals = null, onNpcMet = null) {
    if (!this.npcs.length || !playerPos) {
      this._setHint(false);
      this.nearestPoacher = null;
      return;
    }

    let nearest = null;
    let nearestDist = Infinity;
    this.nearestPoacher = this.getNearestPoacher(playerPos);
    this.nearestTalkable = this.getNearestTalkable(playerPos);

    for (const npc of this.npcs) {
      if (npc.type === 'poacher' && animals) {
        this._updatePoacher(npc, dt, getGroundHeight, animals);
      } else if (npc.type === 'ranger') {
        this._updateRanger(npc, dt, getGroundHeight, this.getPoachers());
      } else if (npc.waitTimer > 0) {
        npc.waitTimer -= dt;
        animateWalk(npc, dt, false);
      } else if (npc.type !== 'poacher') {
        const target = npc.patrol[npc.patrolIdx];
        const dx = target.x - npc.group.position.x;
        const dz = target.z - npc.group.position.z;
        const dist = Math.hypot(dx, dz);

        if (dist < 0.6) {
          npc.patrolIdx = (npc.patrolIdx + 1) % npc.patrol.length;
          npc.waitTimer = 0.5 + Math.random() * 1.5;
          animateWalk(npc, dt, false);
        } else {
          const step = npc.speed * dt;
          npc.group.position.x += (dx / dist) * step;
          npc.group.position.z += (dz / dist) * step;
          npc.group.rotation.y = Math.atan2(dx, dz);
          npc.group.position.y = getGroundHeight(npc.group.position.x, npc.group.position.z);
          animateWalk(npc, dt, true);
        }
      }

      const pdx = playerPos.x - npc.group.position.x;
      const pdz = playerPos.z - npc.group.position.z;
      const pdist = Math.hypot(pdx, pdz);
      if (pdist < nearestDist) {
        nearestDist = pdist;
        nearest = npc;
      }
    }

    if (nearest && nearestDist < NPC_NEAR_RADIUS) {
      const isPoacher = nearest.type === 'poacher';
      const isRanger = nearest.type === 'ranger';
      // La quête "citoyens" exige de PARLER (Espace), pas juste passer à côté :
      // onNpcMet n'est déclenché que dans tryTalk(), pas ici par proximité.
      let text = isPoacher ? NPC_MESSAGES.poacher : isRanger ? NPC_MESSAGES.ranger : `👋 ${nearest.label} — Appuie sur Espace pour parler !`;
      if (isPoacher && nearest.aiState === 'chase') {
        text = '🏃 Braconnier en train de poursuivre un animal !';
      } else if (isPoacher && nearest.aiState === 'aim') {
        text = '🔫 Braconnier — il va tirer ! Appuie sur E pour le signaler !';
      } else if (isPoacher && this.nearestPoacher === nearest) {
        text = '⚠ Braconnier — Appuie sur E pour le signaler aux autorités !';
      }
      this._setHint(true, text, isPoacher, isPoacher && !!this.nearestPoacher);
      const canTalk = !!this.getDialogue(nearest);
      document.getElementById('npcTalkHint')?.classList.toggle('visible', canTalk && !this.dialogueOpen);
    } else {
      this._setHint(false);
      document.getElementById('npcTalkHint')?.classList.remove('visible');
    }
  }

  _setHint(visible, text = '', isPoacher = false, canReport = false) {
    const el = document.getElementById('npcHint');
    if (!el) return;
    el.classList.toggle('visible', visible);
    el.classList.toggle('poacher', visible && isPoacher);
    if (text) el.textContent = text;
    document.getElementById('poacherReportHint')?.classList.toggle('visible', visible && canReport);
  }
}
