import * as THREE from 'three';
import { ECO_DATA, ENV_CONFIG } from '../config/data.js';
import { CollisionSystem } from '../systems/CollisionSystem.js';
import { AudioSystem } from '../systems/AudioSystem.js';
import { TutorialSystem } from '../systems/TutorialSystem.js';
import { JournalSystem } from '../systems/JournalSystem.js';
import { WindSystem } from '../systems/WindSystem.js';
import { ParticleSystem } from '../systems/ParticleSystem.js';
import { DayNightSystem } from '../systems/DayNightSystem.js';
import { MobileControls } from '../systems/MobileControls.js';
import { POISystem } from '../systems/POISystem.js';
import { QuestSystem } from '../systems/QuestSystem.js';
import { MinimapSystem } from '../systems/MinimapSystem.js';
import { WeatherSystem } from '../systems/WeatherSystem.js';
import { Player } from '../entities/Player.js';
import { AnimalSpawner } from '../entities/AnimalSpawner.js';
import { NPCSpawner } from '../entities/NPCSpawner.js';
import { buildEnvironment, buildMapBoundary } from '../environments/EnvironmentBuilder.js';

function disposeGroup(root) {
  root?.traverse?.(o => {
    o.geometry?.dispose?.();
    const mats = Array.isArray(o.material) ? o.material : (o.material ? [o.material] : []);
    mats.forEach(m => { m.map?.dispose?.(); m.dispose?.(); });
  });
}

export class Game {
  constructor() {
    this.env = { current: 'forest', name: 'Forêt' };
    this.profile = { name: 'Explorateur', character: 'mpanzu' };
    this.initialized = false;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.clock = null;
    this.terrainMesh = null;
    this.envMesh = null;
    this.skyMesh = null;
    this.sunLight = null;
    this.ambientLight = null;
    this.boundaryGroup = null;
    this.cameraYaw = 0;
    this.isWalking = false;
    this.keys = {};
    this.menuOpen = false;

    this.collisions = new CollisionSystem();
    this.audio = new AudioSystem();
    this.tutorial = new TutorialSystem();
    this.journal = new JournalSystem();
    this.journal.onUpdate = () => this._updateBadgeDisplay?.();
    this.quests = new QuestSystem(this.journal);
    this.minimap = new MinimapSystem();
    this.weather = null;
    this.wind = new WindSystem();
    this.particles = null;
    this.dayNight = null;
    this.poi = null;
    this.player = null;
    this.animals = null;
    this.npcs = null;
    this.mobile = null;

    this.raycaster = new THREE.Raycaster();
    this.downVector = new THREE.Vector3(0, -1, 0);
  }

  setProfile({ name, character }) {
    if (name) this.profile.name = name.trim();
    if (character) this.profile.character = character;
  }

  async start(envName) {
    this.menuOpen = false;
    this.env.current = envName;
    if (!this.initialized) {
      await this._init();
    } else {
      this.player.setCharacter(this.profile.character);
    }
    this.loadEnvironment(envName);
    this.audio.init();
    // (loadEnvironment démarre déjà l'audio du biome — pas de double start)
    this.tutorial.maybeShow();
    this.journal.render();
    this._updateBadgeDisplay();
    if (this.mobile?.active) {
      document.getElementById('mobileControls')?.classList.add('visible');
    }
  }

  returnToMenu() {
    this.menuOpen = true;
    this.keys = {};
    this.isWalking = false;
    this.audio.stop();
    this.tutorial.pause();
    if (this.poi?.modalOpen) this.poi.closeModal();
    document.getElementById('journalPanel')?.classList.remove('visible');
    document.getElementById('tutorialOverlay')?.classList.remove('visible');
    if (this.mobile) this.mobile.hide();
    document.getElementById('npcHint')?.classList.remove('visible');
    document.getElementById('poacherReportHint')?.classList.remove('visible');
    document.getElementById('npcTalkHint')?.classList.remove('visible');
    this.npcs?.closeDialogue();
    this.minimap?.hide();
  }

  async _init() {
    this.clock = new THREE.Clock();
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87ceeb);
    this.scene.fog = new THREE.FogExp2(0x87ceeb, 0.015);

    const canvas = document.getElementById('gameCanvas');
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
    this.camera.position.set(0, 4, 10);

    this._buildLights();
    this._buildSky();

    this.player = new Player(this.scene);
    this.player.setCharacter(this.profile.character);

    this.particles = new ParticleSystem(this.scene);
    this.weather = new WeatherSystem(this.scene);
    this.poi = new POISystem(this.scene);
    this.animals = new AnimalSpawner(this.scene);
    this.npcs = new NPCSpawner(this.scene);
    this.dayNight = new DayNightSystem({
      scene: this.scene,
      sunLight: this.sunLight,
      ambientLight: this.ambientLight,
      skyMesh: this.skyMesh
    });

    this.mobile = new MobileControls();
    this.mobile.registerAction('mobInteractBtn', () => {
      if (this.poi?.modalOpen || this.npcs?.dialogueOpen) {
        this.poi?.closeModal();
        this.npcs?.closeDialogue();
        return;
      }
      // Priorité au dialogue PNJ si un personnage est talkable
      this.npcs?.tryTalk(
        this.player.mesh.position,
        this.journal,
        id => { this.quests.onNpcMet(id); this.audio.playDialogueBlip(); }
      ) || this.poi?.tryInteract(this.env.current, this.journal, count => this.quests.onPoiDiscovered(count));
    });
    this.mobile.registerAction('mobReportBtn', () => {
      if (!this.poi?.modalOpen && !this.npcs?.dialogueOpen) {
        this.npcs?.tryReport(this.player.mesh.position, this.journal, this.animals, () => this.quests.onPoacherReported());
      }
    });
    this.mobile.registerAction('mobJournalBtn', () => { this.journal.toggle(); this.quests.render(); });
    this.mobile.registerAction('mobMapBtn',    () => this.minimap.toggle());
    this._bindInput();
    window.addEventListener('resize', () => this._onResize());
    this.initialized = true;
    this._animate();
  }

  _buildLights() {
    this.scene.add(new THREE.HemisphereLight(0xffffff, 0x4a7c2f, 0.7));
    this.sunLight = new THREE.DirectionalLight(0xfff5e6, 1.6);
    this.sunLight.position.set(50, 80, 30);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.set(2048, 2048);
    ['left', 'right', 'top', 'bottom'].forEach((k, i) => {
      const v = [-200, 200, 200, -200][i];
      this.sunLight.shadow.camera[k] = v;
    });
    this.sunLight.shadow.camera.near = 0.5;
    this.sunLight.shadow.camera.far = 600;
    this.scene.add(this.sunLight);
    this.ambientLight = new THREE.AmbientLight(0x3a3a40, 0.4);
    this.scene.add(this.ambientLight);
  }

  _buildSky() {
    this.skyMesh = new THREE.Mesh(
      new THREE.SphereGeometry(400, 32, 24),
      new THREE.MeshBasicMaterial({ color: 0x87ceeb, side: THREE.BackSide, fog: false })
    );
    this.scene.add(this.skyMesh);
  }

  loadEnvironment(name) {
    const cfg = ENV_CONFIG[name] || ENV_CONFIG.forest;
    this.env.name = cfg.name;
    document.getElementById('envName').textContent = this.env.name;
    document.getElementById('playerNameDisplay').textContent = this.profile.name;
    document.getElementById('playerCharDisplay').textContent = this.player.displayName;
    this._updateBadgeDisplay();

    this.camera.far = 2000;
    this.camera.updateProjectionMatrix();

    if (this.envMesh) { this.scene.remove(this.envMesh); disposeGroup(this.envMesh); }
    if (this.boundaryGroup) { this.scene.remove(this.boundaryGroup); disposeGroup(this.boundaryGroup); this.boundaryGroup = null; }

    this.envMesh = new THREE.Group();
    this.scene.add(this.envMesh);
    this.collisions.clear();
    this.collisions.setMapHalf(cfg.mapHalf);
    this.wind.clear();

    this.waterMeshes = [];
    this.lakeRadius = 0;
    this.waterLevel = 0.12;
    this.inWater = false;
    this.swimBob = 0;

    this.terrainMesh = buildEnvironment(name, {
      envMesh: this.envMesh,
      scene: this.scene,
      skyMesh: this.skyMesh,
      collisions: this.collisions,
      wind: this.wind,
      waterMeshes: this.waterMeshes
    });
    this.lakeRadius = cfg.lakeR || 0;
    this.baseFog = cfg.fog || 0.003;

    this.poi.build(name, (x, z) => this.getGroundHeight(x, z));
    if (!cfg.noBoundary) {
      this.boundaryGroup = buildMapBoundary(this.scene, (x, z) => this.getGroundHeight(x, z), cfg.mapHalf);
    }
    this.particles.build(name);
    this.weather.build(name);
    this.weather.applyFog(this.scene, this.baseFog);
    this.dayNight.setFogBase(this.scene.fog.color.getHex());
    this.animals.spawn(name, (x, z) => this.getGroundHeight(x, z), {
      lakeRadius: this.lakeRadius,
      spread: cfg.spread
    });
    this.npcs.spawn(name, (x, z) => this.getGroundHeight(x, z));
    this.npcs.onAudioGunshot = () => this.audio.playGunshot();
    this.quests.resetSession(name);
    this.audio.start(name);
    this._buildUI();
    this.resetCharacter();
  }

  getGroundHeight(x, z) {
    if (!this.terrainMesh) return 0;
    this.raycaster.set(new THREE.Vector3(x, 50, z), this.downVector);
    const hits = this.raycaster.intersectObject(this.terrainMesh, false);
    return hits.length ? hits[0].point.y : 0;
  }

  snapToGround() {
    const ch = this.player.mesh;
    const x = ch.position.x, z = ch.position.z;
    let gy = this.getGroundHeight(x, z);

    if (this.lakeRadius > 0) {
      const dist = Math.hypot(x, z);
      const inLake = dist < this.lakeRadius - 0.5;
      this.inWater = inLake;
      this.player.setInWater(inLake);

      if (inLake) {
        const shoreDist = this.lakeRadius - dist;
        const ground = gy;
        if (ground > this.waterLevel - 0.4 && shoreDist < 8) {
          gy = Math.max(ground, this.waterLevel - 0.3);
        } else {
          this.swimBob += 0.05;
          gy = this.waterLevel - 0.72 + Math.sin(this.swimBob) * 0.04;
          if (dist < this.lakeRadius * 0.35) this.quests?.onSwimLake();
        }
        ch.position.y = gy;
        return;
      }
    }

    this.inWater = false;
    this.player.setInWater(false);
    ch.position.y = Math.max(gy, 0);
  }

  resetCharacter() {
    const ch = this.player.mesh;
    ch.position.set(0, 0, 0);
    ch.rotation.set(0, 0, 0);
    this.cameraYaw = 0;
    this.snapToGround();
  }

  _updateBadgeDisplay() {
    const badgeCount = this.journal.data.badges.length;
    const badgeEl = document.getElementById('playerBadgeCount');
    if (badgeEl) badgeEl.textContent = `${badgeCount} badge${badgeCount !== 1 ? 's' : ''}`;
  }

  _buildUI() {
    const data = ECO_DATA[this.env.current] || ECO_DATA.forest;
    const fact1 = data[0], fact2 = data[1];
    document.getElementById('ecoFact1').innerHTML = `<strong>${fact1.title}</strong><span>${fact1.desc}</span>`;
    const fact2El = document.getElementById('ecoFact2');
    if (fact2El) fact2El.innerHTML = fact2 ? `<strong>${fact2.title}</strong><span>${fact2.desc}</span>` : '';
    const weather = this.weather?.getFact();
    const wTitle = document.getElementById('weatherTitle');
    const wFact = document.getElementById('weatherFact');
    if (weather && wTitle && wFact) {
      wTitle.textContent = `${weather.icon} ${weather.title}`;
      wFact.textContent = weather.fact;
    }
  }

  _bindInput() {
    window.addEventListener('keydown', e => {
      // Ignore les touches tapées dans un champ (ex. prénom) pour ne pas
      // déclencher les raccourcis du jeu (J = journal, M = carte, R = reset…)
      const tag = e.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      const c = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'e', 'm', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(c)) {
        e.preventDefault();
        this.keys[c] = true;
      }
      if (c === ' ' && !e.repeat) {
        if (this.poi.modalOpen) this.poi.closeModal();
        else if (this.npcs.dialogueOpen) this.npcs.closeDialogue();
        else if (this.poi.nearest) {
          this.poi.tryInteract(this.env.current, this.journal, count => this.quests.onPoiDiscovered(count));
        } else if (this.npcs.tryTalk(
          this.player.mesh.position,
          this.journal,
          id => {
            this.quests.onNpcMet(id);
            this.audio.playDialogueBlip();
          }
        )) { /* dialogue opened */ }
      }
      if ((c === 'e') && !e.repeat && !this.poi.modalOpen) {
        this.npcs.tryReport(
          this.player.mesh.position,
          this.journal,
          this.animals,
          () => this.quests.onPoacherReported()
        );
      }
      if ((c === 'm') && !e.repeat) this.minimap.toggle();
      if (e.key === 'Escape') {
        if (this.poi.modalOpen) this.poi.closeModal();
        else if (this.npcs.dialogueOpen) this.npcs.closeDialogue();
        else document.getElementById('journalPanel')?.classList.remove('visible');
      }
      if (e.key === 'j' || e.key === 'J') {
        this.journal.toggle();
        this.quests.render();
      }
      if (e.key === 'r' || e.key === 'R') this.resetCharacter();
    });
    window.addEventListener('keyup', e => { this.keys[e.key.toLowerCase()] = false; });

    document.getElementById('factModalClose')?.addEventListener('click', () => this.poi.closeModal());
    document.getElementById('factModal')?.addEventListener('click', e => {
      if (e.target.id === 'factModal') this.poi.closeModal();
    });
    document.getElementById('dialogueModalClose')?.addEventListener('click', () => this.npcs.closeDialogue());
    document.getElementById('dialogueModal')?.addEventListener('click', e => {
      if (e.target.id === 'dialogueModal') this.npcs.closeDialogue();
    });
    document.getElementById('journalBtn')?.addEventListener('click', () => {
      this.journal.toggle();
      this.quests.render();
    });
    document.getElementById('journalClose')?.addEventListener('click', () => {
      document.getElementById('journalPanel')?.classList.remove('visible');
    });
    document.getElementById('tutorialSkip')?.addEventListener('click', () => this.tutorial.close());
    document.getElementById('quitBtn')?.addEventListener('click', () => {
      if (typeof window.quitToEnvSelect === 'function') window.quitToEnvSelect();
    });
  }

  _updateCharacter(dt) {
    if (!this.player || this.poi.modalOpen || this.npcs?.dialogueOpen) { this.isWalking = false; return; }

    const turnSpeed = 2.2;
    let moveSpeed = this.inWater ? 2.2 : 4;
    if (this.keys['arrowleft']) this.cameraYaw += turnSpeed * dt;
    if (this.keys['arrowright']) this.cameraYaw -= turnSpeed * dt;

    const cfX = -Math.sin(this.cameraYaw), cfZ = -Math.cos(this.cameraYaw);
    const crX = Math.cos(this.cameraYaw), crZ = -Math.sin(this.cameraYaw);

    let mx = 0, mz = 0;
    const mv = this.mobile?.getMoveVector();
    if (mv && (Math.abs(mv.x) > 0.08 || Math.abs(mv.z) > 0.08)) {
      // Joystick mobile : vertical = avancer/reculer, horizontal = rotation
      this.cameraYaw -= mv.x * turnSpeed * dt;
      mx = mv.z * cfX;
      mz = mv.z * cfZ;
    } else {
      if (this.keys['w'] || this.keys['arrowup'])    { mx += cfX; mz += cfZ; }
      if (this.keys['s'] || this.keys['arrowdown'])  { mx -= cfX; mz -= cfZ; }
      if (this.keys['a']) { mx -= crX; mz -= crZ; }
      if (this.keys['d']) { mx += crX; mz += crZ; }
    }

    const len = Math.hypot(mx, mz);
    this.isWalking = len > 0.1;
    if (this.isWalking) {
      mx /= len; mz /= len;
      this.collisions.tryMove(this.player.mesh, mx * moveSpeed * dt, mz * moveSpeed * dt);
      this.player.mesh.rotation.y = Math.atan2(mx, mz);
    }
    this.snapToGround();
    this.audio.updateFootsteps(dt, this.isWalking, this.inWater);
  }

  _updateCamera(dt) {
    const ch = this.player.mesh;
    const dist = 7, height = this.inWater ? 2.8 : 3.5;
    const lookY = this.inWater ? 0.9 : 1.2;
    const ox = Math.sin(this.cameraYaw) * dist;
    const oz = Math.cos(this.cameraYaw) * dist;
    this.camera.position.lerp(new THREE.Vector3(ch.position.x + ox, ch.position.y + height, ch.position.z + oz), 5 * dt);
    this.camera.lookAt(ch.position.x, ch.position.y + lookY, ch.position.z);
  }

  _animate() {
    requestAnimationFrame(() => this._animate());
    if (!this.renderer || this.menuOpen) return;
    const dt = Math.min(this.clock.getDelta(), 0.05);
    this._updateCharacter(dt);
    this.player.updateAnimation(dt, this.isWalking);
    this._updateCamera(dt);
    this.poi.update(this.player.mesh, dt);
    this.wind.update(performance.now() * 0.001);
    this.particles.update(dt);
    this.weather?.update(dt, this.player.mesh.position);
    this.dayNight.update(dt);
    const getGH = (x, z) => this.getGroundHeight(x, z);
    const poachers = this.npcs.getPoachers();
    this.animals.update(dt, poachers, getGH);
    if (!this.poi.modalOpen && !this.npcs.dialogueOpen) {
      this.npcs.update(
        dt, this.player.mesh.position, getGH, this.animals,
        id => this.quests.onNpcMet(id)
      );
    } else {
      document.getElementById('npcHint')?.classList.remove('visible');
      document.getElementById('poacherReportHint')?.classList.remove('visible');
      document.getElementById('npcTalkHint')?.classList.remove('visible');
    }
    this.minimap.render({
      envKey: this.env.current,
      playerPos: this.player.mesh.position,
      poi: this.poi,
      npcs: this.npcs,
      lakeRadius: this.lakeRadius
    });
    if (this.waterMeshes?.length) {
      const t = performance.now() * 0.001;
      this.waterMeshes[0].position.y = 0.08 + Math.sin(t * 1.5) * 0.025;
      if (this.waterMeshes[1]) {
        this.waterMeshes[1].position.y = 0.12 + Math.sin(t * 1.8 + 1) * 0.02;
        this.waterMeshes[1].rotation.z = Math.sin(t * 0.5) * 0.03;
      }
    }
    this.renderer.render(this.scene, this.camera);
  }

  _onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
