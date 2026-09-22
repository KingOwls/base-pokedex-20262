export const NOVELTY_ARCADE_GAMES=[
  {slug:'impostor',path:'/arcade/impostor',title:'PokéImpostor',subtitle:'Encuentra al que rompe el patrón',difficulty:'Baja',icon:'◈'},
  {slug:'type-grid',path:'/arcade/type-grid',title:'Type Grid',subtitle:'Completa la cuadrícula cruzando criterios',difficulty:'Baja',icon:'▦'},
  {slug:'bst-builder',path:'/arcade/bst-builder',title:'BST Builder',subtitle:'Construye un equipo que alcance el objetivo',difficulty:'Media',icon:'Σ'},
];

export const IMPOSTOR_ROUNDS=[
  {
    id:'fire-type',
    members:[6,59,392,9],
    impostorId:9,
    criterion:{kind:'type',value:'fire'},
    category:'Tipos',
    reveal:'Charizard, Arcanine e Infernape comparten el tipo Fuego. Blastoise no.',
  },
  {
    id:'generation-iv',
    members:[448,445,479,94],
    impostorId:94,
    criterion:{kind:'generation',value:4},
    category:'Generación',
    reveal:'Lucario, Garchomp y Rotom debutaron en la Generación IV. Gengar debutó en la Generación I.',
  },
  {
    id:'levitate',
    members:[479,330,429,445],
    impostorId:445,
    criterion:{kind:'ability',value:'levitate'},
    category:'Habilidades',
    reveal:'Rotom, Flygon y Mismagius pueden tener Levitate. Garchomp no.',
  },
  {
    id:'speed-100',
    members:[135,94,392,143],
    impostorId:143,
    criterion:{kind:'stat-min',stat:'speed',value:100},
    category:'Stats',
    reveal:'Jolteon, Gengar e Infernape tienen 100 o más de Velocidad base. Snorlax queda por debajo.',
  },
];

export const TYPE_GRID_PRESETS=[
  {
    id:'classic-elements',
    rows:[
      {label:'Fuego',criterion:{kind:'type',value:'fire'}},
      {label:'Agua',criterion:{kind:'type',value:'water'}},
      {label:'Planta',criterion:{kind:'type',value:'grass'}},
    ],
    columns:[
      {label:'Volador',criterion:{kind:'type',value:'flying'}},
      {label:'Tierra',criterion:{kind:'type',value:'ground'}},
      {label:'Veneno',criterion:{kind:'type',value:'poison'}},
    ],
  },
  {
    id:'modern-mix',
    rows:[
      {label:'Eléctrico',criterion:{kind:'type',value:'electric'}},
      {label:'Psíquico',criterion:{kind:'type',value:'psychic'}},
      {label:'Siniestro',criterion:{kind:'type',value:'dark'}},
    ],
    columns:[
      {label:'Volador',criterion:{kind:'type',value:'flying'}},
      {label:'Acero',criterion:{kind:'type',value:'steel'}},
      {label:'Hada',criterion:{kind:'type',value:'fairy'}},
    ],
  },
];

export const BST_DIFFICULTIES=[
  {id:'facil',label:'Fácil',tolerance:100},
  {id:'normal',label:'Normal',tolerance:50},
  {id:'dificil',label:'Difícil',tolerance:20},
  {id:'experto',label:'Experto',tolerance:0},
];

// Todos son sumas alcanzables con equipos legales de hasta 6 especies base.
export const BST_TARGETS=[2200,2500,2700,2934,3000];
