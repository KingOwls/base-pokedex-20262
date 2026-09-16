import { fetchJSON } from './httpClient';
import { extractId } from '../utils/pokemonUtils';
import { SPECIAL_POKEMON } from '../data/specialPokemon';
export const getPokemon=id=>fetchJSON(`pokemon/${encodeURIComponent(String(id).toLowerCase())}`);
export const getSpecies=id=>/^https?:\/\//i.test(String(id))?fetchJSON(id):fetchJSON(`pokemon-species/${encodeURIComponent(String(id).toLowerCase())}`);
export async function getPokemonBundle(identifier){try{const pokemon=await getPokemon(identifier);const species=await getSpecies(pokemon.species.url);return{pokemon,species};}catch(error){if(!String(error.message).includes('no encontrado'))throw error;const species=await getSpecies(identifier);const name=species.varieties?.find(v=>v.is_default)?.pokemon?.name||species.varieties?.[0]?.pokemon?.name;if(!name)throw error;return{pokemon:await getPokemon(name),species};}}
export async function getSpeciesIndex(){const d=await fetchJSON('pokemon-species?limit=2000&offset=0');return d.results.map(x=>({id:extractId(x.url),name:x.name,url:x.url,kind:'species',isVariant:false}));}
export async function getPokemonIndex(){const d=await fetchJSON('pokemon?limit=2000&offset=0');return d.results.map(x=>({id:extractId(x.url),name:x.name,url:x.url,kind:'pokemon',isVariant:extractId(x.url)>=10000}));}
let indexPromise;
export async function getSearchIndex(){if(!indexPromise)indexPromise=Promise.all([getSpeciesIndex(),getPokemonIndex()]).then(([s,p])=>{const map=new Map(s.map(x=>[x.name,x]));p.forEach(x=>{if(!map.has(x.name))map.set(x.name,x);});return[...map.values()];});return indexPromise;}
export const getType=name=>fetchJSON(`type/${encodeURIComponent(name)}`);
export async function searchByType(name){const d=await getType(name);return d.pokemon.map(e=>({id:extractId(e.pokemon.url),name:e.pokemon.name,url:e.pokemon.url,isVariant:extractId(e.pokemon.url)>=10000}));}
export const getSpecialIndex=kind=>(SPECIAL_POKEMON[kind]||[]).map(([id,name])=>({id,name,isVariant:false}));
export const getEvolutionChain=url=>url?fetchJSON(url):Promise.resolve(null);
export const getEncounters=id=>fetchJSON(`pokemon/${encodeURIComponent(String(id))}/encounters`,{useCache:false});
export const getForm=url=>fetchJSON(url);
export async function getAllForms(pokemon){const settled=await Promise.allSettled((pokemon.forms||[]).map(f=>getForm(f.url)));return settled.filter(x=>x.status==='fulfilled').map(x=>x.value);}
export async function getVarietyDetails(species){const declared=(species.varieties||[]).map(v=>v.pokemon?.name).filter(Boolean);const idx=await getPokemonIndex();const family=idx.filter(x=>x.name===species.name||x.name.startsWith(`${species.name}-`)).map(x=>x.name);const names=[...new Set([...declared,...family])];const settled=await Promise.allSettled(names.map(getPokemon));return settled.filter(x=>x.status==='fulfilled').map(x=>x.value);}
export async function getTypeRelations(names){const settled=await Promise.allSettled(names.map(getType));return settled.filter(x=>x.status==='fulfilled').map(x=>x.value);}
export async function getRegions(){const d=await fetchJSON('region?limit=50&offset=0');return d.results;}
export const getRegion=id=>/^https?:\/\//i.test(String(id))?fetchJSON(id):fetchJSON(`region/${encodeURIComponent(String(id).toLowerCase())}`);
export const getPokedex=id=>/^https?:\/\//i.test(String(id))?fetchJSON(id):fetchJSON(`pokedex/${encodeURIComponent(String(id).toLowerCase())}`);

export const getMove=id=>/^https?:\/\//i.test(String(id))?fetchJSON(id):fetchJSON(`move/${encodeURIComponent(String(id).toLowerCase())}`);
export const getAbility=id=>/^https?:\/\//i.test(String(id))?fetchJSON(id):fetchJSON(`ability/${encodeURIComponent(String(id).toLowerCase())}`);
