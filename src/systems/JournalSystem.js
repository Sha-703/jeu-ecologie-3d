import { BADGES } from '../config/data.js';

const STORAGE_KEY = 'ecoexplorer_journal';

export class JournalSystem {
  constructor() {
    this.data = this._load();
    this.onUpdate = null;
  }

  _load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { badges: [], entries: [] };
    } catch {
      return { badges: [], entries: [] };
    }
  }

  _save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    this.onUpdate?.();
  }

  addEntry(text) {
    const entry = { text, time: new Date().toLocaleString('fr-FR') };
    this.data.entries.unshift(entry);
    if (this.data.entries.length > 50) this.data.entries.pop();
    this._save();
    this.render();
  }

  unlockBadge(envKey) {
    const badge = BADGES[envKey];
    if (!badge || this.data.badges.includes(badge.id)) return null;
    this.data.badges.push(badge.id);
    this.addEntry(`Badge obtenu : ${badge.name} ${badge.icon}`);
    this._checkMaster();
    this._save();
    this.render();
    this._showToast(`${badge.icon} Badge débloqué : ${badge.name}`);
    return badge;
  }

  unlockBadgeById(badgeId) {
    const badge = Object.values(BADGES).find(b => b.id === badgeId);
    if (!badge || this.data.badges.includes(badge.id)) return null;
    this.data.badges.push(badge.id);
    this.addEntry(`Badge obtenu : ${badge.name} ${badge.icon}`);
    this._checkMaster();
    this._save();
    this.render();
    this._showToast(`${badge.icon} Badge débloqué : ${badge.name}`);
    return badge;
  }

  _checkMaster() {
    const envBadges = ['forest_explorer', 'city_explorer', 'aquatic_explorer', 'savanna_explorer'];
    if (envBadges.every(id => this.data.badges.includes(id)) && !this.data.badges.includes(BADGES.master.id)) {
      this.data.badges.push(BADGES.master.id);
      this.addEntry(`Badge obtenu : ${BADGES.master.name} ${BADGES.master.icon}`);
      this._showToast(`${BADGES.master.icon} ${BADGES.master.name} !`);
    }
  }

  onDiscovery(poi, envKey) {
    this.addEntry(`Découverte [${envKey}] : ${poi.title}`);
  }

  onBiomeComplete(envKey) {
    return this.unlockBadge(envKey);
  }

  _showToast(msg) {
    const el = document.getElementById('badgeToast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('visible');
    setTimeout(() => el.classList.remove('visible'), 3500);
  }

  render() {
    const list = document.getElementById('badgeList');
    const log = document.getElementById('journalLog');
    if (list) {
      const all = Object.values(BADGES);
      list.innerHTML = all.map(b => {
        const unlocked = this.data.badges.includes(b.id);
        return `<div class="badgeItem ${unlocked ? 'unlocked' : 'locked'}">
          <span class="badgeIcon">${unlocked ? b.icon : '🔒'}</span>
          <div><strong>${b.name}</strong><br><small>${unlocked ? b.desc : 'Non débloqué'}</small></div>
        </div>`;
      }).join('');
    }
    if (log) {
      log.innerHTML = this.data.entries.length
        ? this.data.entries.map(e => `<div class="logEntry"><span class="logTime">${e.time}</span>${e.text}</div>`).join('')
        : '<div class="logEmpty">Aucune entrée — explore et interagis !</div>';
    }
  }

  toggle() {
    const panel = document.getElementById('journalPanel');
    if (!panel) return;
    const open = panel.classList.toggle('visible');
    if (open) this.render();
  }
}
