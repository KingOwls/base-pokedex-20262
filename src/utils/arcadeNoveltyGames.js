const norm=value=>String(value??'').toLowerCase().trim().replace(/[_\s]+/g,'-');

export function pokemonMatchesCriterion(profile,criterion){
  if(!profile||!criterion)return false;
  const {kind,value,stat}=criterion;
  if(kind==='type')return (profile.types||[]).map(norm).includes(norm(value));
  if(kind==='generation')return Number(profile.generation)===Number(value);
  if(kind==='ability')return (profile.abilities||[]).map(norm).includes(norm(value));
  if(kind==='legendary')return Boolean(profile.isLegendary)===Boolean(value);
  if(kind==='mythical')return Boolean(profile.isMythical)===Boolean(value);
  if(kind==='stat-min')return Number(profile.stats?.[stat]??-Infinity)>=Number(value);
  if(kind==='stat-max')return Number(profile.stats?.[stat]??Infinity)<=Number(value);
  if(kind==='bst-min')return calculateBst(profile)>=Number(value);
  if(kind==='bst-max')return calculateBst(profile)<=Number(value);
  return false;
}

export function evaluateImpostorPick(round,profile){
  return {correct:Number(profile?.id)===Number(round?.impostorId),impostorId:Number(round?.impostorId)};
}

export function validateGridPick(profile,rowCriterion,columnCriterion,usedIds=new Set()){
  if(!profile)return {valid:false,reason:'missing'};
  const used=usedIds instanceof Set?usedIds:new Set(usedIds||[]);
  if(used.has(Number(profile.id)))return {valid:false,reason:'duplicate'};
  if(!pokemonMatchesCriterion(profile,rowCriterion)||!pokemonMatchesCriterion(profile,columnCriterion)){
    return {valid:false,reason:'criteria'};
  }
  return {valid:true,reason:null};
}

export function calculateBst(value){
  if(Array.isArray(value))return value.reduce((sum,item)=>sum+calculateBst(item),0);
  const stats=value?.stats||{};
  return ['hp','attack','defense','specialAttack','specialDefense','speed']
    .reduce((sum,key)=>sum+Number(stats[key]||0),0);
}

export function evaluateBstTarget(team,target,tolerance=0){
  const total=calculateBst(team);
  const numericTarget=Number(target)||0;
  const difference=total-numericTarget;
  return {
    total,
    target:numericTarget,
    difference,
    remaining:numericTarget-total,
    success:Math.abs(difference)<=Math.max(0,Number(tolerance)||0),
  };
}
