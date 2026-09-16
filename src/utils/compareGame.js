export const compareValues=(left,right)=>left===right?'tie':left>right?'left':'right';
export const COMPARE_CATEGORIES=[
  {key:'id',label:'Número Nacional',value:p=>p.id},
  {key:'hp',label:'HP',value:p=>p.stats.find(s=>s.stat.name==='hp')?.base_stat||0},
  {key:'attack',label:'Ataque',value:p=>p.stats.find(s=>s.stat.name==='attack')?.base_stat||0},
  {key:'defense',label:'Defensa',value:p=>p.stats.find(s=>s.stat.name==='defense')?.base_stat||0},
  {key:'special-attack',label:'Ataque Especial',value:p=>p.stats.find(s=>s.stat.name==='special-attack')?.base_stat||0},
  {key:'special-defense',label:'Defensa Especial',value:p=>p.stats.find(s=>s.stat.name==='special-defense')?.base_stat||0},
  {key:'speed',label:'Velocidad',value:p=>p.stats.find(s=>s.stat.name==='speed')?.base_stat||0},
  {key:'bst',label:'Base Stat Total',value:p=>p.stats.reduce((a,s)=>a+s.base_stat,0)},
  {key:'height',label:'Altura',value:p=>p.height},
  {key:'weight',label:'Peso',value:p=>p.weight},
];
