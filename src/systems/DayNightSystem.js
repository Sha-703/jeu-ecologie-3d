import * as THREE from 'three';

export class DayNightSystem {
  constructor({ scene, sunLight, ambientLight, skyMesh }) {
    this.scene = scene;
    this.sunLight = sunLight;
    this.ambientLight = ambientLight;
    this.skyMesh = skyMesh;
    this.time = 0.35;
    this.cycleDuration = 90;
  }

  update(dt) {
    this.time = (this.time + dt / this.cycleDuration) % 1;
    const sunAngle = this.time * Math.PI * 2;
    const sunHeight = Math.sin(sunAngle);
    const daylight = Math.max(0.15, sunHeight * 0.5 + 0.5);

    this.sunLight.position.set(Math.cos(sunAngle) * 80, Math.max(10, sunHeight * 80 + 20), Math.sin(sunAngle) * 50);
    this.sunLight.intensity = 0.4 + daylight * 1.4;
    this.ambientLight.intensity = 0.15 + daylight * 0.35;

    const dayColor = new THREE.Color(0x87ceeb);
    const nightColor = new THREE.Color(0x0a1628);
    const duskColor = new THREE.Color(0xff7043);
    let sky;
    if (daylight > 0.6) sky = dayColor;
    else if (daylight > 0.3) sky = dayColor.clone().lerp(duskColor, 1 - (daylight - 0.3) / 0.3);
    else sky = nightColor.clone().lerp(duskColor, daylight / 0.3);

    this.scene.background.copy(sky);
    if (this.skyMesh) this.skyMesh.material.color.copy(sky);
    if (this.scene.fog) this.scene.fog.color.copy(sky);
  }
}
