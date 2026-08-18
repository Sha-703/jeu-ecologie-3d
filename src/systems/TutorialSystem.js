import { TUTORIAL_STEPS } from '../config/data.js';

const STEP_MS = 6000;
const STORAGE_KEY = 'ecoexplorer_tutorial_done';

export class TutorialSystem {
  constructor() {
    this.index = 0;
    this.timer = null;
  }

  maybeShow() {
    if (localStorage.getItem(STORAGE_KEY)) return;
    this.index = 0;
    this._showStep(0);
    document.getElementById('tutorialOverlay')?.classList.add('visible');
    this.timer = setInterval(() => this.next(), STEP_MS);
  }

  _showStep(i) {
    const step = TUTORIAL_STEPS[i];
    document.getElementById('tutorialIcon').textContent = step.icon;
    document.getElementById('tutorialTitle').textContent = step.title;
    document.getElementById('tutorialText').textContent = step.text;
    document.getElementById('tutorialMeta').textContent = `Étape ${i + 1} / ${TUTORIAL_STEPS.length}`;
    document.getElementById('tutorialBarFill').style.width = `${((i + 1) / TUTORIAL_STEPS.length) * 100}%`;
  }

  next() {
    this.index++;
    if (this.index >= TUTORIAL_STEPS.length) { this.close(); return; }
    this._showStep(this.index);
  }

  close() {
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
    document.getElementById('tutorialOverlay')?.classList.remove('visible');
    localStorage.setItem(STORAGE_KEY, '1');
  }
}
