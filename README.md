# ÉcoExplorer — Projet Éducatif 3D Écologie

Jeu 3D d'exploration écologique avec 4 biomes, points interactifs, badges, modèles GLTF et cycle jour/nuit.

## Structure

```
├── index.html              # Shell HTML + import src/main.js
├── src/
│   ├── main.js             # Point d'entrée
│   ├── styles.css          # Styles UI
│   ├── config/data.js      # Données éco, POI, badges
│   ├── game/Game.js        # Orchestrateur principal
│   ├── systems/            # Audio, collisions, POI, vent, particules, jour/nuit, mobile, journal
│   ├── entities/           # Player (GLTF), AnimalSpawner
│   └── environments/       # EnvironmentBuilder
```

## Lancement (développement)

```bash
npm install
npm run dev
```

Puis ouvrir l'adresse indiquée par Vite (par défaut http://localhost:5173).

## Build & Production

```bash
npm run build
```

Le dossier prêt pour la production est `dist/`. Il peut être déployé sur n'importe quel hébergeur statique : GitHub Pages, Netlify, Vercel, hébergement OVH/FTP, etc.

## Contrôles

| Touche | Action |
|--------|--------|
| WASD / Flèches | Déplacement / caméra |
| Espace | Interagir avec un orbe |
| J | Journal de bord & badges |
| R | Reset position |
| Mobile | Joystick gauche + zone caméra droite |

## Badges

- 🌲 Explorateur forestier
- 🏙️ Écologiste urbain
- 💧 Gardien des eaux
- 🌾 Ranger de savane
- 🏆 Maître écologiste (les 4 biomes)

Débloqués en trouvant les 3 découvertes de chaque biome.
