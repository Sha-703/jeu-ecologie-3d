export class MobileControls {
  constructor(onMove, onCamera) {
    this.onMove = onMove;
    this.onCamera = onCamera;
    this.moveVec = { x: 0, z: 0 };
    this.camDelta = 0;
    this.active = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (!this.active) return;

    document.getElementById('mobileControls')?.classList.add('visible');
    this._setupJoystick();
    this._setupCameraZone();
  }

  _setupJoystick() {
    const zone = document.getElementById('joystickZone');
    const knob = document.getElementById('joystickKnob');
    if (!zone || !knob) return;

    let touchId = null;
    const center = { x: 0, y: 0 };
    const maxR = 45;

    const handleStart = (e) => {
      e.preventDefault();
      const t = e.changedTouches[0];
      touchId = t.identifier;
      const rect = zone.getBoundingClientRect();
      center.x = rect.left + rect.width / 2;
      center.y = rect.top + rect.height / 2;
      this._updateKnob(t.clientX, t.clientY, knob, center, maxR);
    };

    const handleMove = (e) => {
      e.preventDefault();
      for (const t of e.changedTouches) {
        if (t.identifier === touchId) {
          this._updateKnob(t.clientX, t.clientY, knob, center, maxR);
        }
      }
    };

    const handleEnd = (e) => {
      for (const t of e.changedTouches) {
        if (t.identifier === touchId) {
          touchId = null;
          knob.style.transform = 'translate(-50%, -50%)';
          this.moveVec.x = 0;
          this.moveVec.z = 0;
        }
      }
    };

    zone.addEventListener('touchstart', handleStart, { passive: false });
    zone.addEventListener('touchmove', handleMove, { passive: false });
    zone.addEventListener('touchend', handleEnd);
    zone.addEventListener('touchcancel', handleEnd);
  }

  _updateKnob(cx, cy, knob, center, maxR) {
    let dx = cx - center.x;
    let dy = cy - center.y;
    const dist = Math.hypot(dx, dy);
    if (dist > maxR) { dx = (dx / dist) * maxR; dy = (dy / dist) * maxR; }
    knob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
    this.moveVec.x = dx / maxR;
    this.moveVec.z = -dy / maxR;
  }

  _setupCameraZone() {
    const zone = document.getElementById('camZone');
    if (!zone) return;
    let lastX = 0;
    let touchId = null;

    zone.addEventListener('touchstart', (e) => {
      e.preventDefault();
      touchId = e.changedTouches[0].identifier;
      lastX = e.changedTouches[0].clientX;
    }, { passive: false });

    zone.addEventListener('touchmove', (e) => {
      e.preventDefault();
      for (const t of e.changedTouches) {
        if (t.identifier === touchId) {
          this.camDelta = (t.clientX - lastX) * 0.008;
          lastX = t.clientX;
        }
      }
    }, { passive: false });

    zone.addEventListener('touchend', () => { touchId = null; });
  }

  consumeCameraDelta() {
    const d = this.camDelta;
    this.camDelta = 0;
    return d;
  }

  getMoveVector() {
    return this.moveVec;
  }
}
