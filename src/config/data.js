export const CHARACTERS = {
  mpanzu: {
    id: 'mpanzu',
    name: 'Mpanzu',
    gender: 'boy',
    desc: 'Explorateur curieux, spécialiste des forêts et de la biodiversité.',
    bodyColor: 0x2e5e4e,
    skinColor: 0xc8956a,
    accentColor: 0x5a4e3a
  },
  nkenge: {
    id: 'nkenge',
    name: 'Nkenge',
    gender: 'girl',
    desc: 'Écologiste passionnée, experte des écosystèmes et de la protection de la nature.',
    bodyColor: 0x5c3d5e,
    skinColor: 0xd4a574,
    accentColor: 0x8b6914
  }
};

const INFINITE = { mapHalf: 240, terrainSize: 500, noBoundary: true, infinite: true };

export const ENV_CONFIG = {
  forest: { name: 'Forêt', ...INFINITE, spread: 380, fog: 0.003, fogColor: 0x87ceeb },
  city: { name: 'Ville', ...INFINITE, spread: 340, fog: 0.0035, fogColor: 0xb0bec5 },
  aquatic: { name: 'Aquatique', ...INFINITE, spread: 380, lakeR: 48, fog: 0.0028, fogColor: 0x6ab4d4 },
  savanna: { name: 'Savane', ...INFINITE, spread: 400, fog: 0.003, fogColor: 0xe6cc8a }
};

export const ECO_DATA = {
  forest: [
    { title: 'Photosynthèse', desc: "Les arbres absorbent le CO₂ et libèrent de l'oxygène — un arbre mature produit assez d'oxygène pour 2 personnes." },
    { title: 'Canopée', desc: 'La canopée forestière abrite 40% de la biodiversité terrestre.' }
  ],
  city: [
    { title: 'Îlots de chaleur', desc: 'Les villes sont 3°C plus chaudes que leurs alentours ruraux.' },
    { title: 'Pollution urbaine', desc: 'Le transport représente 25% des émissions mondiales.' }
  ],
  aquatic: [
    { title: 'Zones humides', desc: "Les zones humides filtrent 50% des polluants avant les cours d'eau." },
    { title: "Cycle de l'eau", desc: "L'eau douce ne représente que 2,5% de l'eau sur Terre." }
  ],
  savanna: [
    { title: 'Adaptation', desc: 'Les acacias modifient leurs épines selon la pression herbivore.' },
    { title: 'Savane et climat', desc: 'Les savanes stockent 30% du carbone terrestre dans leurs sols.' }
  ]
};

export const POI_DATA = {
  forest: [
    { id: 'photosynthesis', x: 28, z: -22, icon: '🌳', title: 'Photosynthèse', desc: "Les arbres absorbent le CO₂ et produisent de l'oxygène — un arbre mature nourrit 2 personnes en O₂ par an." },
    { id: 'soil_biodiversity', x: -38, z: 30, icon: '🍄', title: 'Biodiversité du sol', desc: 'Un gramme de sol forestier contient des milliards de micro-organismes essentiels.' },
    { id: 'water_cycle', x: 15, z: 50, icon: '💧', title: "Cycle de l'eau", desc: 'La forêt régule le cycle de l\'eau par transpiration et infiltration.' }
  ],
  city: [
    { id: 'heat_island', x: 35, z: -20, icon: '🌡️', title: 'Îlots de chaleur', desc: 'Les centres-villes sont 3 à 5 °C plus chauds que la campagne.' },
    { id: 'urban_transport', x: -32, z: 28, icon: '🚌', title: 'Mobilité durable', desc: 'Le transport représente ~25 % des émissions de gaz à effet de serre.' },
    { id: 'urban_green', x: 18, z: 45, icon: '🌿', title: 'Espaces verts urbains', desc: 'Un arbre en ville améliore l\'air, le climat et le bien-être mental.' }
  ],
  aquatic: [
    { id: 'wetlands', x: 55, z: 12, icon: '🌾', title: 'Zones humides', desc: 'Les marais filtrent jusqu\'à 50 % des polluants avant les rivières.' },
    { id: 'freshwater', x: -48, z: -35, icon: '💧', title: 'Eau douce', desc: "L'eau douce ne représente que 2,5 % de toute l'eau sur Terre." },
    { id: 'aquatic_food_chain', x: 20, z: 58, icon: '🐟', title: 'Chaîne alimentaire aquatique', desc: 'Algues → crustacés → poissons → oiseaux : tout est lié.' }
  ],
  savanna: [
    { id: 'acacia_adaptation', x: 32, z: -30, icon: '🌳', title: 'Adaptation des acacias', desc: 'Les acacias modifient leurs épines selon la pression des herbivores.' },
    { id: 'savanna_carbon', x: -40, z: 38, icon: '🌍', title: 'Stockage du carbone', desc: 'Les savanes stockent jusqu\'à 30 % du carbone terrestre.' },
    { id: 'savanna_food_chain', x: 22, z: 52, icon: '🦁', title: 'Chaînes alimentaires', desc: 'Herbes → herbivores → prédateurs : un équilibre fragile.' }
  ]
};

export const POI_COLORS = {
  forest: { color: 0x4caf50, emissive: 0x2e7d32 },
  city: { color: 0x78909c, emissive: 0x455a64 },
  aquatic: { color: 0x29b6f6, emissive: 0x0277bd },
  savanna: { color: 0xffa726, emissive: 0xef6c00 }
};

export const BADGES = {
  forest: { id: 'forest_explorer', name: 'Explorateur forestier', icon: '🌲', desc: 'Tu as découvert tous les secrets de la forêt.' },
  city: { id: 'city_explorer', name: 'Écologiste urbain', icon: '🏙️', desc: 'Tu maîtrises les enjeux écologiques de la ville.' },
  aquatic: { id: 'aquatic_explorer', name: 'Gardien des eaux', icon: '💧', desc: 'Tu comprends les écosystèmes aquatiques.' },
  savanna: { id: 'savanna_explorer', name: 'Ranger de savane', icon: '🌾', desc: 'Tu connais les secrets des savanes.' },
  wildlife_protector: { id: 'wildlife_protector', name: 'Protecteur de la faune', icon: '🛡️', desc: 'Tu as arrêté un braconnier et sauvé un animal.' },
  master: { id: 'master_ecologist', name: 'Maître écologiste', icon: '🏆', desc: 'Tu as exploré tous les biomes et obtenu tous les badges.' }
};

export const QUEST_DATA = {
  forest: [
    { id: 'forest_poi', type: 'discover_poi', target: 3, icon: '✨', title: 'Secrets de la forêt', desc: 'Découvre les 3 orbes lumineux.' },
    { id: 'forest_save', type: 'report_poacher', target: 1, icon: '🛡️', title: 'Protège la faune', desc: 'Signale un braconnier (touche E).' }
  ],
  city: [
    { id: 'city_poi', type: 'discover_poi', target: 3, icon: '✨', title: 'Écologie urbaine', desc: 'Découvre les 3 orbes lumineux.' },
    { id: 'city_citizens', type: 'meet_npc', target: 3, icon: '👋', title: 'Citoyens engagés', desc: 'Parle à 3 citoyens différents (touche Espace).' }
  ],
  aquatic: [
    { id: 'aquatic_poi', type: 'discover_poi', target: 3, icon: '✨', title: 'Mystères aquatiques', desc: 'Découvre les 3 orbes lumineux.' },
    { id: 'aquatic_swim', type: 'swim_lake', target: 1, icon: '🏊', title: 'Plongée exploratoire', desc: 'Nage au centre du lac.' }
  ],
  savanna: [
    { id: 'savanna_poi', type: 'discover_poi', target: 3, icon: '✨', title: 'Trésors de la savane', desc: 'Découvre les 3 orbes lumineux.' },
    { id: 'savanna_save', type: 'report_poacher', target: 1, icon: '🛡️', title: 'Ranger en action', desc: 'Signale un braconnier (touche E).' }
  ]
};

export const TUTORIAL_STEPS = [
  { icon: '🌍', title: 'Bienvenue dans ÉcoExplorer', text: "Entre ton nom, choisis ton personnage et explore des écosystèmes en 3D." },
  { icon: '🎮', title: 'Déplacement', text: 'WASD ou joystick (mobile) pour te déplacer.' },
  { icon: '📷', title: 'Caméra', text: 'Flèches ← → pour orbiter la caméra.' },
  { icon: '✨', title: 'Points lumineux', text: 'Approche-toi des orbes lumineux dispersés dans le monde.' },
  { icon: '📖', title: 'Journal & badges', text: 'Espace pour interagir. E pour signaler un braconnier. M pour la carte. J pour le journal. R pour te recentrer. 3 découvertes = 1 badge !' }
];

export const GLTF_MODELS = {
  fox: 'https://threejs.org/examples/models/gltf/Fox.gltf',
  flamingo: 'https://threejs.org/examples/models/gltf/Flamingo.glb',
  parrot: 'https://threejs.org/examples/models/gltf/Parrot.glb',
  horse: 'https://threejs.org/examples/models/gltf/Horse.glb',
  duck: 'https://threejs.org/examples/models/gltf/Duck.glb'
};

export const PLAYER_RADIUS = 0.45;
export const INTERACT_RADIUS = 3;
export const NPC_NEAR_RADIUS = 5;
export const POACHER_REPORT_RADIUS = 5;

export const NPC_DATA = {
  city: [
    { id: 'marie', type: 'civilian', label: 'Marie', bodyColor: 0x5c6bc0, x: 12, z: 8, patrol: [[12, 8], [12, 35], [-8, 35], [-8, 8]] },
    { id: 'jean', type: 'civilian', label: 'Jean', bodyColor: 0xef5350, x: -15, z: -10, patrol: [[-15, -10], [-15, 25], [20, 25], [20, -10]] },
    { id: 'aisha', type: 'civilian', label: 'Aïcha', bodyColor: 0x26a69a, x: 30, z: -20, patrol: [[30, -20], [30, 10], [5, 10], [5, -20]] },
    { id: 'pierre', type: 'civilian', label: 'Pierre', bodyColor: 0xffa726, x: -25, z: 30, patrol: [[-25, 30], [-25, -5], [0, -5], [0, 30]] },
    { id: 'sophie', type: 'civilian', label: 'Sophie', bodyColor: 0xab47bc, x: 0, z: 45, patrol: [[0, 45], [0, 15], [25, 15], [25, 45]] },
    { id: 'karim', type: 'civilian', label: 'Karim', bodyColor: 0x42a5f5, x: -30, z: -25, patrol: [[-30, -25], [-30, 5], [-5, 5], [-5, -25]] }
  ],
  forest: [
    { id: 'ranger_f1', type: 'ranger', label: 'Ranger', x: 10, z: 15, patrol: [[10, 15], [25, 30], [-10, 35], [-20, 10]] },
    { id: 'poacher_f1', type: 'poacher', label: 'Braconnier', x: 45, z: -30, patrol: [[45, -30], [55, -20], [48, -8], [38, -18]] },
    { id: 'poacher_f2', type: 'poacher', label: 'Braconnier', x: -50, z: 20, patrol: [[-50, 20], [-42, 35], [-55, 40], [-58, 22]] }
  ],
  savanna: [
    { id: 'ranger_s1', type: 'ranger', label: 'Ranger', x: 5, z: 10, patrol: [[5, 10], [20, 25], [-15, 30], [-5, 5]] },
    { id: 'poacher_s1', type: 'poacher', label: 'Braconnier', x: 40, z: -35, patrol: [[40, -35], [52, -28], [45, -15], [35, -25]] },
    { id: 'poacher_s2', type: 'poacher', label: 'Braconnier', x: -45, z: 25, patrol: [[-45, 25], [-35, 40], [-50, 48], [-52, 30]] }
  ],
  aquatic: [
    { id: 'ranger_a1', type: 'ranger', label: 'Garde-pêche', x: 52, z: 5, patrol: [[52, 5], [55, -25], [35, -48], [15, -35], [25, 10]] }
  ]
};

export const NPC_MESSAGES = {
  civilian: '👋 Citoyen — Appuie sur Espace pour lui parler.',
  poacher: '⚠ Braconnier — Espace pour en savoir plus. E pour le signaler !',
  ranger: '🛡️ Ranger — Appuie sur Espace pour parler. Il protège la faune !'
};

export const NPC_DIALOGUES = {
  marie: {
    icon: '👩',
    title: 'Marie — Citoyenne',
    quote: '« J\'utilise le bus et le vélo pour réduire mon empreinte carbone ! »',
    fact: 'Un trajet en vélo émet 10× moins de CO₂ qu\'en voiture sur la même distance.'
  },
  jean: {
    icon: '👨',
    title: 'Jean — Citoyen',
    quote: '« Notre parc urbain abrite des oiseaux et refroidit le quartier l\'été. »',
    fact: 'Un arbre mature peut refroidir l\'air de 2 à 8 °C autour de lui par évapotranspiration.'
  },
  aisha: {
    icon: '👩',
    title: 'Aïcha — Citoyenne',
    quote: '« Je trie mes déchets : plastique, verre, compost… Chaque geste compte ! »',
    fact: 'Le recyclage d\'une bouteille en plastique économise assez d\'énergie pour alimenter une ampoule 6 heures.'
  },
  pierre: {
    icon: '👨',
    title: 'Pierre — Citoyen',
    quote: '« L\'été, il fait 4 °C de plus ici qu\'à la campagne — c\'est l\'îlot de chaleur urbain. »',
    fact: 'Les villes dense en béton absorbent la chaleur et la restituent la nuit, augmentant les canicules.'
  },
  sophie: {
    icon: '👩',
    title: 'Sophie — Citoyenne',
    quote: '« Les espaces verts améliorent notre santé mentale et la qualité de l\'air. »',
    fact: '15 minutes dans un parc réduisent le stress et améliorent la concentration chez les enfants.'
  },
  karim: {
    icon: '👨',
    title: 'Karim — Citoyen',
    quote: '« La pollution de l\'air tue plus de personnes que les accidents de la route en ville. »',
    fact: 'Les transports représentent ~25 % des émissions mondiales de gaz à effet de serre.'
  },
  _poacher: {
    icon: '⚠️',
    title: 'Braconnier',
    quote: '« Tais-toi… Je chasse pour l\'argent, pas pour le plaisir. »',
    fact: 'Le braconnage menace 1 espèce sur 7 à l\'extinction. Signale-le (touche E) pour protéger la biodiversité !'
  },
  ranger_f1: {
    icon: '🛡️',
    title: 'Ranger — Forêt',
    quote: '« Je patrouille pour protéger les animaux des braconniers. Signale-les si tu en vois ! »',
    fact: 'Les rangers patrouillent 24h/24 dans les parcs nationaux pour préserver la biodiversité.'
  },
  ranger_s1: {
    icon: '🛡️',
    title: 'Ranger — Savane',
    quote: '« La savane est fragile. Chaque espèce compte dans l\'équilibre écologique. »',
    fact: 'Les rangers de savane protègent les herbivores menacés par le braconnage et la sécheresse.'
  },
  ranger_a1: {
    icon: '🎣',
    title: 'Garde-pêche',
    quote: '« La pêche illégale pollue nos lacs et détruit les nids de poissons. Restons vigilants ! »',
    fact: 'Les gardes-pêche surveillent les écosystèmes aquatiques et luttent contre la surpêche.'
  }
};
