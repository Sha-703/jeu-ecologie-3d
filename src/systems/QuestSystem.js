import { QUEST_DATA } from '../config/data.js';

const STORAGE_KEY = 'ecoexplorer_quests';

export class QuestSystem {
  constructor(journal) {
    this.journal = journal;
    this.envKey = 'forest';
    this.progress = this._load();
    this.metNpcs = new Set();
    this.swimDone = false;
  }

  _load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  }

  _save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.progress));
  }

  _ensureEnv(envKey) {
    if (!this.progress[envKey]) this.progress[envKey] = {};
  }

  resetSession(envKey) {
    this.envKey = envKey;
    this.metNpcs.clear();
    this.swimDone = false;
    this._ensureEnv(envKey);
    for (const q of QUEST_DATA[envKey] || []) {
      if (!this.isComplete(q.id)) {
        if (['discover_poi', 'meet_npc', 'swim_lake'].includes(q.type)) {
          this.progress[envKey][q.id] = 0;
        }
      }
    }
    this._save();
    this.render();
  }

  getProgress(questId) {
    return this.progress[this.envKey]?.[questId] || 0;
  }

  isComplete(questId) {
    const quest = this._findQuest(questId);
    if (!quest) return false;
    return this.getProgress(questId) >= quest.target;
  }

  _findQuest(questId) {
    const list = QUEST_DATA[this.envKey] || [];
    return list.find(q => q.id === questId);
  }

  _setProgress(questId, value) {
    this._ensureEnv(this.envKey);
    const quest = this._findQuest(questId);
    if (!quest) return;
    const prev = this.progress[this.envKey][questId] || 0;
    const next = Math.min(value, quest.target);
    if (next <= prev) return;
    this.progress[this.envKey][questId] = next;
    this._save();
    if (next >= quest.target && prev < quest.target) {
      this.journal?.addEntry(`Quête terminée : ${quest.title} ${quest.icon}`);
      this._showToast(`${quest.icon} Quête accomplie : ${quest.title}`);
    }
    this.render();
  }

  onPoiDiscovered(count) {
    for (const q of QUEST_DATA[this.envKey] || []) {
      if (q.type === 'discover_poi') this._setProgress(q.id, count);
    }
  }

  onPoacherReported() {
    for (const q of QUEST_DATA[this.envKey] || []) {
      if (q.type === 'report_poacher') {
        this._setProgress(q.id, this.getProgress(q.id) + 1);
      }
    }
  }

  onNpcMet(npcId) {
    if (!npcId) return;
    this.metNpcs.add(npcId);
    for (const q of QUEST_DATA[this.envKey] || []) {
      if (q.type === 'meet_npc') this._setProgress(q.id, this.metNpcs.size);
    }
  }

  onSwimLake() {
    if (this.swimDone) return;
    this.swimDone = true;
    for (const q of QUEST_DATA[this.envKey] || []) {
      if (q.type === 'swim_lake') this._setProgress(q.id, 1);
    }
  }

  _showToast(msg) {
    const el = document.getElementById('badgeToast');
    if (!el) return;
    el.textContent = msg;
    el.style.background = 'rgba(129,199,132,0.95)';
    el.style.color = '#1a2e1a';
    el.classList.add('visible');
    setTimeout(() => {
      el.classList.remove('visible');
      el.style.background = '';
      el.style.color = '';
    }, 3500);
  }

  render() {
    const html = this._buildHtml();
    const panel = document.getElementById('questList');
    const journalPanel = document.getElementById('journalQuestList');
    if (panel) panel.innerHTML = html;
    if (journalPanel) journalPanel.innerHTML = html;
  }

  _buildHtml() {
    const quests = QUEST_DATA[this.envKey] || [];
    if (!quests.length) {
      return '<div class="questEmpty">Aucune quête dans ce biome.</div>';
    }
    return quests.map(q => {
      const prog = this.getProgress(q.id);
      const done = prog >= q.target;
      const pct = Math.min(100, Math.round((prog / q.target) * 100));
      return `<div class="questItem ${done ? 'done' : ''}">
        <span class="questIcon">${done ? '✅' : q.icon}</span>
        <div class="questBody">
          <strong>${q.title}</strong>
          <small>${q.desc}</small>
          <div class="questBar"><div class="questBarFill" style="width:${pct}%"></div></div>
          <span class="questProg">${Math.min(prog, q.target)} / ${q.target}</span>
        </div>
      </div>`;
    }).join('');
  }
}
