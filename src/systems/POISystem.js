import * as THREE from 'three';
import { POI_DATA, POI_COLORS, INTERACT_RADIUS } from '../config/data.js';

export class POISystem {
  constructor(scene) {
    this.scene = scene;
    this.list = [];
    this.group = null;
    this.discovered = new Set();
    this.nearest = null;
    this.modalOpen = false;
    this.onDiscover = null;
    this.onComplete = null;
  }

  clear() {
    this.list = [];
    this.nearest = null;
    this.discovered.clear();
    this.floatPhase = 0;
    if (this.group) { this.scene.remove(this.group); this.group = null; }
  }

  build(envName, getGroundHeight) {
    this.clear();
    const data = POI_DATA[envName];
    if (!data) return;
    const palette = POI_COLORS[envName] || POI_COLORS.forest;
    this.group = new THREE.Group();

    for (const poi of data) {
      const gy = getGroundHeight(poi.x, poi.z);
      const marker = this._createMarker(palette);
      marker.position.set(poi.x, gy, poi.z);
      marker.userData.poi = poi;
      marker.userData.baseY = gy;
      this.group.add(marker);
      this.list.push({ poi, mesh: marker, baseY: gy });
    }
    this.scene.add(this.group);
    this._updateCounter();
  }

  _createMarker(palette) {
    const group = new THREE.Group();
    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.07, 2.4, 8),
      new THREE.MeshStandardMaterial({ color: palette.color, emissive: palette.emissive, emissiveIntensity: 0.15 })
    );
    pole.position.y = 1.2; pole.castShadow = true; group.add(pole);
    const orb = new THREE.Mesh(
      new THREE.SphereGeometry(0.42, 16, 16),
      new THREE.MeshStandardMaterial({ color: palette.color, emissive: palette.emissive, emissiveIntensity: 0.9 })
    );
    orb.position.y = 3.2; group.add(orb);
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.55, 0.05, 8, 24),
      new THREE.MeshStandardMaterial({ color: palette.color, emissive: palette.emissive, emissiveIntensity: 0.5, transparent: true, opacity: 0.75 })
    );
    ring.rotation.x = -Math.PI / 2; ring.position.y = 2.8; group.add(ring);
    const halo = new THREE.Mesh(
      new THREE.SphereGeometry(0.65, 12, 12),
      new THREE.MeshStandardMaterial({ color: palette.color, emissive: palette.emissive, emissiveIntensity: 0.35, transparent: true, opacity: 0.2 })
    );
    halo.position.y = 3.2; group.add(halo);
    group.userData.orb = orb;
    group.userData.ring = ring;
    group.userData.halo = halo;
    group.userData.palette = palette;
    return group;
  }

  update(character, dt) {
    if (!character || !this.list.length) {
      this.nearest = null;
      this._setHint(false);
      return;
    }
    let closest = null, closestDist = Infinity;
    const t = performance.now() * 0.003;

    for (const entry of this.list) {
      entry.mesh.position.y = entry.baseY + Math.sin(t * 1.8 + entry.poi.x * 0.1) * 0.2;

      const dx = character.position.x - entry.poi.x;
      const dz = character.position.z - entry.poi.z;
      const dist = Math.hypot(dx, dz);
      const isNear = dist < INTERACT_RADIUS;
      const isDisc = this.discovered.has(entry.poi.id);
      const { orb, ring, halo, palette } = entry.mesh.userData;

      if (orb && ring) {
        orb.material.emissiveIntensity = isDisc ? 0.3 : (isNear ? 1.2 + Math.sin(t * 5) * 0.4 : 0.75);
        orb.scale.setScalar(isNear ? 1.2 : 1 + Math.sin(t * 3) * 0.06);
        if (halo) halo.scale.setScalar(1 + Math.sin(t * 2) * 0.12);
        if (isDisc) { orb.material.color.setHex(0xffd54f); orb.material.emissive.setHex(0xffa000); }
        else { orb.material.color.setHex(palette.color); orb.material.emissive.setHex(palette.emissive); }
      }

      if (dist < closestDist) { closestDist = dist; closest = entry; }
    }

    this.nearest = closest && closestDist < INTERACT_RADIUS ? closest : null;
    this._setHint(!!this.nearest && !this.modalOpen);
  }

  _setHint(v) {
    document.getElementById('interactHint')?.classList.toggle('visible', v);
  }

  tryInteract(envKey, journal, onDiscover) {
    if (this.modalOpen || !this.nearest) return;
    const poi = this.nearest.poi;
    const isNew = !this.discovered.has(poi.id);
    if (isNew) {
      this.discovered.add(poi.id);
      this._updateCounter();
      journal?.onDiscovery(poi, envKey);
      onDiscover?.(this.discovered.size);
      if (this.discovered.size === this.list.length) {
        journal?.onBiomeComplete(envKey);
        this.onComplete?.(envKey);
      }
    }
    this.modalOpen = true;
    this._setHint(false);
    document.getElementById('factModalIcon').textContent = poi.icon;
    document.getElementById('factModalTitle').textContent = poi.title;
    document.getElementById('factModalDesc').textContent = poi.desc;
    document.querySelector('#factModal .discoveredBadge').style.display = isNew ? 'inline-block' : 'none';
    document.getElementById('factModal')?.classList.add('visible');
  }

  closeModal() {
    this.modalOpen = false;
    document.getElementById('factModal')?.classList.remove('visible');
  }

  _updateCounter() {
    const el = document.getElementById('discoveryCount');
    if (el) el.textContent = `${this.discovered.size} / ${this.list.length}`;
    document.getElementById('discoveryPanel').style.display = this.list.length ? 'block' : 'none';
  }
}
