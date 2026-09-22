import {getPokemonBundle} from './pokeApi.js';
import {getGenerationForPokemonId} from '../data/generations.js';
import {titleCase} from '../utils/pokemonUtils.js';

const cache=new Map();
const statNames={
  hp:'hp',
  attack:'attack',
  defense:'defense',
  'special-attack':'specialAttack',
  'special-defense':'specialDefense',
  speed:'speed',
};

export function normalizeArcadePokemon(bundle){
  const pokemon=bundle?.pokemon||{};
  const species=bundle?.species||{};
  const speciesId=Number(species.id||pokemon.id||0);
  const stats={hp:0,attack:0,defense:0,specialAttack:0,specialDefense:0,speed:0};
  for(const item of pokemon.stats||[]){
    const key=statNames[item.stat?.name];
    if(key)stats[key]=Number(item.base_stat||0);
  }
  const generation=getGenerationForPokemonId(speciesId).generation||0;
  return {
    id:Number(pokemon.id||speciesId),
    speciesId,
    name:pokemon.name||species.name||'',
    displayName:titleCase(pokemon.name||species.name||''),
    generation,
    types:(pokemon.types||[]).sort((a,b)=>(a.slot||0)-(b.slot||0)).map(x=>x.type?.name).filter(Boolean),
    abilities:(pokemon.abilities||[]).map(x=>x.ability?.name).filter(Boolean),
    stats,
    isLegendary:Boolean(species.is_legendary),
    isMythical:Boolean(species.is_mythical),
    sprite:pokemon.sprites?.front_default||null,
    shinySprite:pokemon.sprites?.front_shiny||null,
    artwork:pokemon.sprites?.other?.['official-artwork']?.front_default||pokemon.sprites?.front_default||null,
  };
}

export async function getArcadePokemon(identifier){
  const key=String(identifier).toLowerCase();
  if(cache.has(key))return cache.get(key);
  const promise=getPokemonBundle(identifier).then(normalizeArcadePokemon).catch(error=>{cache.delete(key);throw error;});
  cache.set(key,promise);
  return promise;
}

export async function getArcadePokemonMany(identifiers=[]){
  return Promise.all(identifiers.map(getArcadePokemon));
}

export function clearArcadePokemonCache(){cache.clear();}
