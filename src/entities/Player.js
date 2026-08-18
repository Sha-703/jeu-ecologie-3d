import * as THREE from 'three';
import { CHARACTERS } from '../config/data.js';

export class Player {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.charParts = null;
    this.characterId = 'mpanzu';
    this.walkPhase = 0;
    this.inWater = false;
    scene.add(this.group);
  }

  setCharacter(id) {
    this.characterId = id;
    while (this.group.children.length) this.group.remove(this.group.children[0]);
    this.charParts = null;
    const cfg = CHARACTERS[id] || CHARACTERS.mpanzu;
    if (cfg.gender === 'girl') this._buildNkenge(cfg);
    else this._buildMpanzu(cfg);
  }

  _buildMpanzu(cfg) {
    const bodyMat = new THREE.MeshStandardMaterial({ color: cfg.bodyColor, roughness: 0.5 });
    const skinMat = new THREE.MeshStandardMaterial({ color: cfg.skinColor, roughness: 0.35 });
    const legMat = new THREE.MeshStandardMaterial({ color: 0x1a2e1a, roughness: 0.6 });
    const armMat = new THREE.MeshStandardMaterial({ color: cfg.bodyColor, roughness: 0.55 });

    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 1.1, 10), bodyMat);
    body.position.y = 1.1; body.castShadow = true; this.group.add(body);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 10, 10), skinMat);
    head.position.y = 1.7; head.castShadow = true; this.group.add(head);

    const hair = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.12, 0.3), new THREE.MeshStandardMaterial({ color: 0x1a1208 }));
    hair.position.set(0, 1.88, -0.02); this.group.add(hair);

    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.24, 0.12, 10), new THREE.MeshStandardMaterial({ color: cfg.accentColor }));
    cap.position.y = 1.95; this.group.add(cap);

    const pack = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.45, 0.15), new THREE.MeshStandardMaterial({ color: cfg.accentColor }));
    pack.position.set(0, 1.05, 0.22); pack.castShadow = true; this.group.add(pack);

    const leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.5, 0.12), armMat);
    leftArm.position.set(-0.38, 1.15, 0); leftArm.castShadow = true; this.group.add(leftArm);
    const rightArm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.5, 0.12), armMat);
    rightArm.position.set(0.38, 1.15, 0); rightArm.castShadow = true; this.group.add(rightArm);

    const leftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.55, 0.15), legMat);
    leftLeg.position.set(-0.14, 0.275, 0); leftLeg.castShadow = true; this.group.add(leftLeg);
    const rightLeg = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.55, 0.15), legMat);
    rightLeg.position.set(0.14, 0.275, 0); rightLeg.castShadow = true; this.group.add(rightLeg);

    this.charParts = { body, head, leftLeg, rightLeg, leftArm, rightArm };
  }

  _buildNkenge(cfg) {
    const bodyMat = new THREE.MeshStandardMaterial({ color: cfg.bodyColor, roughness: 0.5 });
    const skinMat = new THREE.MeshStandardMaterial({ color: cfg.skinColor, roughness: 0.35 });
    const skirtMat = new THREE.MeshStandardMaterial({ color: 0x4a6741, roughness: 0.65 });
    const armMat = new THREE.MeshStandardMaterial({ color: cfg.bodyColor, roughness: 0.55 });

    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 0.95, 10), bodyMat);
    body.position.y = 1.15; body.castShadow = true; this.group.add(body);

    const skirt = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.3, 0.45, 10), skirtMat);
    skirt.position.y = 0.55; skirt.castShadow = true; this.group.add(skirt);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.27, 10, 10), skinMat);
    head.position.y = 1.72; head.castShadow = true; this.group.add(head);

    const hairBack = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 8), new THREE.MeshStandardMaterial({ color: 0x2a1810 }));
    hairBack.position.set(0, 1.78, -0.12); hairBack.scale.set(0.9, 1.1, 0.7); this.group.add(hairBack);

    const ponytail = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.04, 0.45, 6), new THREE.MeshStandardMaterial({ color: 0x2a1810 }));
    ponytail.position.set(0, 1.55, -0.28); ponytail.rotation.x = 0.5; this.group.add(ponytail);

    const pack = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.4, 0.14), new THREE.MeshStandardMaterial({ color: cfg.accentColor }));
    pack.position.set(0, 1.1, 0.2); pack.castShadow = true; this.group.add(pack);

    const leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.45, 0.11), armMat);
    leftArm.position.set(-0.36, 1.12, 0); this.group.add(leftArm);
    const rightArm = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.45, 0.11), armMat);
    rightArm.position.set(0.36, 1.12, 0); this.group.add(rightArm);

    const legMat = new THREE.MeshStandardMaterial({ color: 0x2a1a2e, roughness: 0.6 });
    const leftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.5, 0.13), legMat);
    leftLeg.position.set(-0.12, 0.25, 0); leftLeg.castShadow = true; this.group.add(leftLeg);
    const rightLeg = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.5, 0.13), legMat);
    rightLeg.position.set(0.12, 0.25, 0); rightLeg.castShadow = true; this.group.add(rightLeg);

    this.charParts = { body, head, leftLeg, rightLeg, leftArm, rightArm, skirt };
  }

  setInWater(inWater) {
    this.inWater = inWater;
    this.group.traverse(child => {
      if (!child.isMesh || !child.material) return;
      const mats = Array.isArray(child.material) ? child.material : [child.material];
      mats.forEach(m => {
        if (inWater) {
          m.transparent = true;
          m.opacity = 0.88;
          if (m.emissive) m.emissive.setHex(0x084a5e);
          if (m.emissiveIntensity !== undefined) m.emissiveIntensity = 0.08;
        } else {
          m.transparent = false;
          m.opacity = 1;
          if (m.emissive) m.emissive.setHex(0x000000);
          if (m.emissiveIntensity !== undefined) m.emissiveIntensity = 0;
        }
      });
    });
  }

  updateAnimation(dt, isWalking) {
    if (!this.charParts) return;
    const { leftLeg, rightLeg, leftArm, rightArm, body, head } = this.charParts;
    const bodyY = this.characterId === 'nkenge' ? 1.15 : 1.1;
    const headY = this.characterId === 'nkenge' ? 1.72 : 1.7;
    const speed = this.inWater ? 7 : 11;
    const swingAmp = this.inWater ? 0.35 : 0.55;

    if (isWalking) {
      this.walkPhase += dt * speed;
      const swing = Math.sin(this.walkPhase) * swingAmp;
      leftLeg.rotation.x = swing;
      rightLeg.rotation.x = -swing;
      if (leftArm) { leftArm.rotation.x = -swing * 0.7; rightArm.rotation.x = swing * 0.7; }
      const bob = Math.abs(Math.sin(this.walkPhase * 2)) * (this.inWater ? 0.04 : 0.06);
      body.position.y = bodyY + bob;
      head.position.y = headY + bob * 0.5;
    } else {
      leftLeg.rotation.x *= Math.pow(0.05, dt);
      rightLeg.rotation.x *= Math.pow(0.05, dt);
      if (leftArm) { leftArm.rotation.x *= Math.pow(0.05, dt); rightArm.rotation.x *= Math.pow(0.05, dt); }
      body.position.y += (bodyY - body.position.y) * Math.min(1, 12 * dt);
      head.position.y += (headY - head.position.y) * Math.min(1, 12 * dt);
    }
  }

  get mesh() { return this.group; }
  get displayName() { return CHARACTERS[this.characterId]?.name || 'Explorateur'; }
}
