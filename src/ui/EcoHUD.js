/**
 * HUD Éducatif — Affiche informations écologiques interactives
 */
export class EcoHUD {
  constructor() {
    this.envNameEl = document.getElementById('envName');
    this.fact1El = document.getElementById('ecoFact1');
    this.fact2El = document.getElementById('ecoFact2');
    this.panelEl = document.getElementById('ecoPanel');
  }

  updateEnvironment(name, facts) {
    if (this.envNameEl) this.envNameEl.textContent = name || '—';
    if (facts && facts.length >= 2) {
      if (this.fact1El) this.fact1El.innerHTML = `<strong>${facts[0].title}</strong>${facts[0].desc}`;
      if (this.fact2El) this.fact2El.innerHTML = `<strong>${facts[1].title}</strong>${facts[1].desc}`;
    }
  }

  show() {
    if (this.panelEl) this.panelEl.style.display = 'block';
  }

  hide() {
    if (this.panelEl) this.panelEl.style.display = 'none';
  }
}
