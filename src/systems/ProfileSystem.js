const STORAGE_KEY = 'ecoexplorer_profile';

export class ProfileSystem {
  load() {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (data?.name) return { name: data.name, character: data.character || 'mpanzu', lastEnv: data.lastEnv || 'forest' };
    } catch (_) {}
    return { name: '', character: 'mpanzu', lastEnv: 'forest' };
  }

  save({ name, character, lastEnv }) {
    const current = this.load();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      name: name ?? current.name,
      character: character ?? current.character,
      lastEnv: lastEnv ?? current.lastEnv
    }));
  }

  hasSavedProfile() {
    const p = this.load();
    return !!p.name && !!p.character;
  }
}
