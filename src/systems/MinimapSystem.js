import { POI_DATA, ENV_CONFIG } from '../config/data.js';

export class MinimapSystem {
  constructor() {
    this.visible = false;
    this.canvas = document.getElementById('minimapCanvas');
    this.ctx = this.canvas?.getContext('2d');
    this.size = 120;
    if (this.canvas) {
      this.canvas.width = this.size;
      this.canvas.height = this.size;
    }
  }

  toggle() {
    this.visible = !this.visible;
    document.getElementById('minimapPanel')?.classList.toggle('visible', this.visible);
    if (this.visible) this.render();
  }

  hide() {
    this.visible = false;
    document.getElementById('minimapPanel')?.classList.remove('visible');
  }

  _worldToCanvas(x, z, mapHalf) {
    const half = this.size / 2;
    const scale = (half - 8) / mapHalf;
    return {
      cx: half + x * scale,
      cz: half + z * scale
    };
  }

  render({ envKey, playerPos, poi, npcs, lakeRadius = 0 }) {
    if (!this.visible || !this.ctx) return;
    const cfg = ENV_CONFIG[envKey] || ENV_CONFIG.forest;
    const mapHalf = cfg.mapHalf || 280;
    const { ctx, size } = this;
    const half = size / 2;

    ctx.clearRect(0, 0, size, size);

    ctx.fillStyle = 'rgba(6,22,12,0.92)';
    ctx.beginPath();
    ctx.arc(half, half, half - 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(129,199,132,0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(half, half, half - 2, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(half, 4);
    ctx.lineTo(half, size - 4);
    ctx.moveTo(4, half);
    ctx.lineTo(size - 4, half);
    ctx.stroke();

    if (lakeRadius > 0) {
      const lake = this._worldToCanvas(0, 0, mapHalf);
      const lakeR = (lakeRadius / mapHalf) * (half - 8);
      ctx.fillStyle = 'rgba(41,182,246,0.35)';
      ctx.beginPath();
      ctx.arc(lake.cx, lake.cz, lakeR, 0, Math.PI * 2);
      ctx.fill();
    }

    const camps = npcs?.getCampPositions?.() || [];
    for (const camp of camps) {
      const p = this._worldToCanvas(camp.x, camp.z, mapHalf);
      ctx.fillStyle = 'rgba(239,83,80,0.7)';
      ctx.beginPath();
      ctx.arc(p.cx, p.cz, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    const poachers = npcs?.getPoachers?.() || [];
    for (const p of poachers) {
      if (p.aiState === 'flee') continue;
      const pos = p.group.position;
      const pt = this._worldToCanvas(pos.x, pos.z, mapHalf);
      ctx.fillStyle = '#ef5350';
      ctx.beginPath();
      ctx.arc(pt.cx, pt.cz, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    const rangers = npcs?.getRangers?.() || [];
    for (const r of rangers) {
      const pos = r.group.position;
      const pt = this._worldToCanvas(pos.x, pos.z, mapHalf);
      ctx.fillStyle = '#66bb6a';
      ctx.beginPath();
      ctx.arc(pt.cx, pt.cz, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }

    const poiList = POI_DATA[envKey] || [];
    const discovered = poi?.discovered;
    for (const poiEntry of poiList) {
      const pt = this._worldToCanvas(poiEntry.x, poiEntry.z, mapHalf);
      const found = discovered?.has(poiEntry.id);
      ctx.fillStyle = found ? '#ffd54f' : 'rgba(76,175,80,0.85)';
      ctx.beginPath();
      ctx.arc(pt.cx, pt.cz, found ? 4 : 3, 0, Math.PI * 2);
      ctx.fill();
    }

    const pp = this._worldToCanvas(playerPos.x, playerPos.z, mapHalf);
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(pp.cx, pp.cz, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#4caf50';
    ctx.lineWidth = 2;
    ctx.stroke();

    const legend = document.getElementById('minimapLegend');
    if (legend) {
      legend.innerHTML = `
        <span>● Toi</span>
        <span style="color:#ffd54f">● POI trouvé</span>
        <span style="color:#4caf50">● POI restant</span>
        ${camps.length ? '<span style="color:#ef5350">● Camp</span>' : ''}
        ${rangers.length ? '<span style="color:#66bb6a">● Ranger</span>' : ''}
      `;
    }
  }
}
