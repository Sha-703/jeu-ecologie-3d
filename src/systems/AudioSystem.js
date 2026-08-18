export class AudioSystem {
  constructor() {
    this.ctx = null;
    this.gain = null;
    this.sfxGain = null;
    this.nodes = [];
    this.birdTimer = null;
    this.footstepTimer = 0;
    this.envName = 'forest';
  }

  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.gain = this.ctx.createGain();
    this.gain.gain.value = 0.22;
    this.gain.connect(this.ctx.destination);
    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.value = 0.35;
    this.sfxGain.connect(this.ctx.destination);
  }

  stop() {
    this.nodes.forEach(n => { try { n.stop?.(); n.disconnect?.(); } catch (_) {} });
    this.nodes = [];
    if (this.birdTimer) { clearInterval(this.birdTimer); this.birdTimer = null; }
  }

  _noiseLoop(filterFreq, gainVal, type = 'lowpass') {
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < bufferSize; i++) {
      last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
      data[i] = last * 3.5;
    }
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const filter = this.ctx.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = filterFreq;
    const g = this.ctx.createGain();
    g.gain.value = gainVal;
    source.connect(filter);
    filter.connect(g);
    g.connect(this.gain);
    source.start();
    this.nodes.push(source, filter, g);
  }

  _chirps(minMs, maxMs, freqRange, volume = 0.06) {
    const chirp = () => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freqRange[0] + Math.random() * (freqRange[1] - freqRange[0]);
      g.gain.setValueAtTime(0, this.ctx.currentTime);
      g.gain.linearRampToValueAtTime(volume, this.ctx.currentTime + 0.05);
      g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);
      osc.connect(g);
      g.connect(this.gain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.3);
    };
    this.birdTimer = setInterval(chirp, minMs + Math.random() * (maxMs - minMs));
    setTimeout(chirp, 500);
  }

  _pulseTone(intervalMs, freq, gainVal) {
    const pulse = () => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0, this.ctx.currentTime);
      g.gain.linearRampToValueAtTime(gainVal, this.ctx.currentTime + 0.08);
      g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);
      osc.connect(g);
      g.connect(this.gain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.55);
    };
    const id = setInterval(pulse, intervalMs);
    this.nodes.push({ stop: () => clearInterval(id) });
    setTimeout(pulse, 800);
  }

  start(envName) {
    if (!this.ctx) return;
    this.envName = envName;
    this.stop();
    if (this.ctx.state === 'suspended') this.ctx.resume();
    switch (envName) {
      case 'forest':
        this._noiseLoop(380, 0.32);
        this._noiseLoop(120, 0.08, 'highpass');
        this._chirps(1800, 4500, [1600, 3400], 0.07);
        break;
      case 'city':
        this._noiseLoop(160, 0.42);
        this._noiseLoop(800, 0.12);
        this._pulseTone(3200, 180 + Math.random() * 40, 0.04);
        break;
      case 'aquatic':
        this._noiseLoop(280, 0.38);
        this._noiseLoop(600, 0.1, 'bandpass');
        this._chirps(2500, 5500, [500, 1100], 0.05);
        break;
      case 'savanna':
        this._noiseLoop(480, 0.36);
        this._chirps(2200, 5500, [1200, 2400], 0.065);
        this._pulseTone(5000, 90, 0.03);
        break;
    }
  }

  updateFootsteps(dt, isWalking, inWater = false) {
    if (!this.ctx || !isWalking) { this.footstepTimer = 0; return; }
    this.footstepTimer -= dt;
    const interval = inWater ? 0.45 : 0.38;
    if (this.footstepTimer <= 0) {
      this.footstepTimer = interval;
      if (inWater) this._playSplash();
      else this._playFootstep();
    }
  }

  _playFootstep() {
    if (!this.ctx) return;
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.08);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.15));
    }
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = this.envName === 'city' ? 320 : 220;
    const g = this.ctx.createGain();
    g.gain.value = this.envName === 'city' ? 0.12 : 0.18;
    source.connect(filter);
    filter.connect(g);
    g.connect(this.sfxGain);
    source.start();
  }

  _playSplash() {
    if (!this.ctx) return;
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.12);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2)) * 0.8;
    }
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 600;
    filter.Q.value = 1.2;
    const g = this.ctx.createGain();
    g.gain.value = 0.14;
    source.connect(filter);
    filter.connect(g);
    g.connect(this.sfxGain);
    source.start();
  }

  playGunshot() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.25);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.08));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const nFilter = this.ctx.createBiquadFilter();
    nFilter.type = 'lowpass';
    nFilter.frequency.value = 900;
    const nGain = this.ctx.createGain();
    nGain.gain.setValueAtTime(0.25, t);
    nGain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    noise.connect(nFilter);
    nFilter.connect(nGain);
    nGain.connect(this.sfxGain);
    noise.start(t);
    noise.stop(t + 0.25);

    const osc = this.ctx.createOscillator();
    const oGain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.15);
    oGain.gain.setValueAtTime(0.08, t);
    oGain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    osc.connect(oGain);
    oGain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.2);
  }

  playDialogueBlip() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 520;
    g.gain.setValueAtTime(0, this.ctx.currentTime);
    g.gain.linearRampToValueAtTime(0.06, this.ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
    osc.connect(g);
    g.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }
}
