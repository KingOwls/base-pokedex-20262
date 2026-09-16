import { classifySpecialForm, generationRoman } from './pokemonUtils.js';
export function dayKey(date=new Date()){const y=date.getFullYear(),m=String(date.getMonth()+1).padStart(2,'0'),d=String(date.getDate()).padStart(2,'0');return `${y}-${m}-${d}`;}
export function deterministicIndex(key,length){let hash=2166136261;for(const ch of key){hash^=ch.charCodeAt(0);hash=Math.imul(hash,16777619);}return (hash>>>0)%Math.max(1,length);}
export const deterministicPokemonId=(key)=>deterministicIndex(key,1025)+1;
const numeric=(value,target)=>({value,direction:value===target?'=':value<target?'↑':'↓',match:value===target});
export function compareDaily(guess,target){return{id:numeric(guess.id,target.id),height:numeric(guess.height,target.height),weight:numeric(guess.weight,target.weight)};}
export function buildDailyClues(guess,target){const gTypes=guess.pokemon.types.map(t=>t.type.name),tTypes=target.pokemon.types.map(t=>t.type.name);const gVariant=guess.pokemon.name!==guess.species.varieties?.find(v=>v.is_default)?.pokemon?.name;const tVariant=target.pokemon.name!==target.species.varieties?.find(v=>v.is_default)?.pokemon?.name;return{
  id:numeric(guess.pokemon.id,target.pokemon.id),
  generation:{value:generationRoman(guess.species.generation?.name),match:guess.species.generation?.name===target.species.generation?.name},
  types:{value:gTypes,match:gTypes.length===tTypes.length&&gTypes.every(t=>tTypes.includes(t)),partial:gTypes.some(t=>tTypes.includes(t))},
  type1:{value:gTypes[0]||'—',match:gTypes[0]===tTypes[0],partial:tTypes.includes(gTypes[0])},
  type2:{value:gTypes[1]||'—',match:(gTypes[1]||null)===(tTypes[1]||null),partial:Boolean(gTypes[1]&&tTypes.includes(gTypes[1]))},
  height:numeric(guess.pokemon.height,target.pokemon.height),weight:numeric(guess.pokemon.weight,target.pokemon.weight),
  legendary:{value:guess.species.is_legendary,match:guess.species.is_legendary===target.species.is_legendary},mythical:{value:guess.species.is_mythical,match:guess.species.is_mythical===target.species.is_mythical},
  rarity:{value:guess.species.is_mythical?'Mítico':guess.species.is_legendary?'Legendario':'Común',match:guess.species.is_legendary===target.species.is_legendary&&guess.species.is_mythical===target.species.is_mythical},
  form:{value:gVariant?classifySpecialForm(guess.pokemon.name):'Forma base',isVariant:gVariant,match:(gVariant?classifySpecialForm(guess.pokemon.name):'Forma base')===(tVariant?classifySpecialForm(target.pokemon.name):'Forma base')}
};}
