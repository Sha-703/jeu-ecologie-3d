export class MobileControls {
  constructor() {
    this.moveVec = { x: 0, z: 0 };
    this.camDelta = 0;
    this.active =
      ('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth <= 768);

    if (!this.active) return;

    document.getElementById('mobileControls')?.classList.add('visible');
    document.getElementById('controlsHint')?.classList.add('hidden');
    this._setupJoystick();
  }

  show() {
    if (this.active) document.getElementById('mobileControls')?.classList.add('visible');
  }

  hide() {
    document.getElementById('mobileControls')?.classList.remove('visible');
    this.moveVec = { x: 0, z: 0 };
  }

  registerAction(id, onTrigger) {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('pointerdown', e => {
      e.preventDefault();
      onTrigger();
      el.setPointerCapture?.(e.pointerId);
    });
  }

  _setupJoystick() {
    const zone = document.getElementById('joystickZone');
    const knob = document.getElementById('joystickKnob');
    if (!zone || !knob) return;

    let touchId = null;
    let center = { x: 0, y: 0 };
    const maxR = 46;

    const reset = () => {
      touchId = null;
      knob.style.transform = 'translate(-50%, -50%)';
      this.moveVec.x = 0;
      this.moveVec.z = 0;
    };

    const process = (t) => {
      let dx = t.clientX - center.x;
      let dy = t.clientY - center.y;
      const dist = Math.hypot(dx, dy);
      if (dist > maxR) { dx = (dx / dist) * maxR; dy = (dy / dist) * maxR; }
      knob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
      // axe horizontal du joystick = rotation, vertical = avancer/reculer
      this.moveVec.x = dx / maxR;   // rotation
      this.moveVec.z = -dy / maxR;  // avancer/reculer
    };

    zone.addEventListener('touchstart', e => {
      e.preventDefault();
      const t = e.changedTouches[0];
      touchId = t.identifier;
      const rect = zone.getBoundingClientRect();
      center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      process(t);
    }, { passive: false });

    zone.addEventListener('touchmove', e => {
      e.preventDefault();
      for (const t of e.changedTouches) {
        if (t.identifier === touchId) process(t);
      }
    }, { passive: false });

    const endHandler = e => {
      for (const t of e.changedTouches) {
        if (t.identifier === touchId) reset();
      }
    };
    zone.addEventListener('touchend', endHandler);
    zone.addEventListener('touchcancel', endHandler);
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