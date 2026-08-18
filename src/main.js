import { Game } from './game/Game.js';
import { ProfileSystem } from './systems/ProfileSystem.js';

const game = new Game();
const profiles = new ProfileSystem();
const profile = profiles.load();

function showStep(stepId) {
  document.querySelectorAll('.onboardStep').forEach(el => el.classList.remove('active'));
  document.getElementById(stepId)?.classList.add('active');
}

function saveProfile(extra = {}) {
  profiles.save({
    name: profile.name,
    character: profile.character,
    lastEnv: game.env.current,
    ...extra
  });
}

function applyProfileToUI() {
  const input = document.getElementById('playerNameInput');
  if (input && profile.name) input.value = profile.name;
  document.getElementById('welcomeName').textContent = profile.name || '—';
  document.querySelectorAll('.charBtn').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.char === profile.character);
  });
  document.querySelectorAll('.envBtn').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.env === (game.env.current || profile.lastEnv));
  });
  game.env.current = profile.lastEnv || 'forest';

  const resumeBtn = document.getElementById('resumeBtn');
  const resumeName = document.getElementById('resumeName');
  if (resumeName && profile.name) resumeName.textContent = profile.name;
  if (resumeBtn) {
    resumeBtn.style.display = profiles.hasSavedProfile() ? 'inline-block' : 'none';
  }
}

window.goToCharacter = () => {
  const input = document.getElementById('playerNameInput');
  const name = input?.value.trim();
  if (!name) {
    input?.classList.add('inputError');
    input?.focus();
    return;
  }
  input?.classList.remove('inputError');
  profile.name = name;
  saveProfile({ name });
  document.getElementById('welcomeName').textContent = name;
  showStep('stepCharacter');
};

window.selectCharacter = (id) => {
  profile.character = id;
  saveProfile({ character: id });
  document.querySelectorAll('.charBtn').forEach(btn => btn.classList.remove('selected'));
  document.querySelector(`.charBtn[data-char="${id}"]`)?.classList.add('selected');
};

window.goToEnv = () => {
  showStep('stepEnv');
};

window.selectEnv = (name) => {
  game.env.current = name;
  saveProfile({ lastEnv: name });
  document.querySelectorAll('.envBtn').forEach(btn => btn.classList.remove('selected'));
  document.querySelector(`.envBtn[data-env="${name}"]`)?.classList.add('selected');
};

window.startExperience = async () => {
  saveProfile();
  document.getElementById('startScreen').classList.add('hidden');
  document.getElementById('hud').style.display = 'block';
  game.setProfile(profile);
  await game.start(game.env.current);
};

window.resumeExperience = async () => {
  if (!profiles.hasSavedProfile()) return;
  applyProfileToUI();
  game.setProfile(profile);
  showStep('stepEnv');
};

window.quitToEnvSelect = () => {
  game.returnToMenu();
  document.getElementById('hud').style.display = 'none';
  document.getElementById('startScreen').classList.remove('hidden');
  showStep('stepEnv');
  saveProfile();
  applyProfileToUI();
};

document.getElementById('playerNameInput')?.addEventListener('keydown', e => {
  if (e.key === 'Enter') window.goToCharacter();
});

document.getElementById('playerNameInput')?.addEventListener('input', () => {
  document.getElementById('playerNameInput')?.classList.remove('inputError');
});

applyProfileToUI();
