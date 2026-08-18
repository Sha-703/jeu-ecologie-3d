export class WindSystem {
  constructor() {
    this.targets = [];
  }

  clear() {
    this.targets = [];
  }

  register(mesh, options = {}) {
    this.targets.push({
      mesh,
      phase: options.phase ?? Math.random() * Math.PI * 2,
      amp: options.amp ?? 0.07,
      speed: options.speed ?? 1.8,
      axis: options.axis ?? 'z'
    });
  }

  update(time) {
    for (const t of this.targets) {
      if (!t.mesh) continue;
      const angle = Math.sin(time * t.speed + t.phase) * t.amp;
      if (t.axis === 'z') t.mesh.rotation.z = angle;
      else if (t.axis === 'x') t.mesh.rotation.x = angle;
      else t.mesh.rotation.y = angle;
    }
  }
}
