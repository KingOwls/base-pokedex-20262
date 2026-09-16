export const GENERATIONS=[
 {slug:'kanto',name:'Kanto',generation:1,roman:'I',range:[1,151],asset:'Poke01.jpg',accent:'#d95656',pokedex:'original-kanto'},
 {slug:'johto',name:'Johto',generation:2,roman:'II',range:[152,251],asset:'Poke02.jpg',accent:'#d6a43e',pokedex:'updated-johto'},
 {slug:'hoenn',name:'Hoenn',generation:3,roman:'III',range:[252,386],asset:'Poke03.jpg',accent:'#4f9a7a',pokedex:'hoenn'},
 {slug:'sinnoh',name:'Sinnoh',generation:4,roman:'IV',range:[387,493],asset:'Poke04.jpg',accent:'#7495c3',pokedex:'original-sinnoh'},
 {slug:'unova',name:'Unova',generation:5,roman:'V',range:[494,649],asset:'Poke05.jpg',accent:'#4a8c87',pokedex:'original-unova'},
 {slug:'kalos',name:'Kalos',generation:6,roman:'VI',range:[650,721],asset:'Poke06.jpg',accent:'#6d8fd1',pokedex:'kalos-central'},
 {slug:'alola',name:'Alola',generation:7,roman:'VII',range:[722,809],asset:'Poke07.jpg',accent:'#e4a64f',pokedex:'updated-alola'},
 {slug:'galar',name:'Galar',generation:8,roman:'VIII',range:[810,905],asset:'Poke08.jpg',accent:'#7b6ac8',pokedex:'galar'},
 {slug:'hisui',name:'Hisui',generation:8,roman:'VIII · Hisui',range:[810,905],asset:'PokeHisui.jpg',accent:'#8b6f4c',pokedex:'hisui',special:true},
 {slug:'paldea',name:'Paldea',generation:9,roman:'IX',range:[906,1025],asset:'Poke09.jpg',accent:'#c76f9d',pokedex:'paldea'},
];
export const NATIONAL={slug:'national',name:'Nacional',generation:0,roman:'I–IX',range:[1,1025],asset:'Poke09.jpg',accent:'#d6a43e'};
export const getGeneration=slug=>slug==='national'?NATIONAL:GENERATIONS.find(g=>g.slug===slug)||NATIONAL;
