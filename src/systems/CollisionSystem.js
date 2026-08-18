import { PLAYER_RADIUS } from '../config/data.js';

export class CollisionSystem {
  constructor() {
    this.zones = [];
    this.mapHalf = 85;
  }

  setMapHalf(h) {
    this.mapHalf = h;
  }

  clear() {
    this.zones = [];
  }

  register(x, z, radius) {
    this.zones.push({ x, z, radius });
  }

  canMoveTo(x, z) {
    if (Math.abs(x) > this.mapHalf - PLAYER_RADIUS || Math.abs(z) > this.mapHalf - PLAYER_RADIUS) return false;
    for (const obs of this.zones) {
      const dx = x - obs.x;
      const dz = z - obs.z;
      if (dx * dx + dz * dz < (PLAYER_RADIUS + obs.radius) ** 2) return false;
    }
    return true;
  }

  tryMove(character, dx, dz) {
    const px = character.position.x;
    const pz = character.position.z;
    if (this.canMoveTo(px + dx, pz + dz)) {
      character.position.x += dx;
      character.position.z += dz;
      return true;
    }
    if (this.canMoveTo(px + dx, pz)) {
      character.position.x += dx;
      return true;
    }
    if (this.canMoveTo(px, pz + dz)) {
      character.position.z += dz;
      return true;
    }
    return false;
  }
}
