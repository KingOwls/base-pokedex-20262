import {useEffect,useState} from 'react';
import {getSpeciesIndex,getPokedex} from '../api/pokeApi.js';
import {getGeneration} from '../data/generations.js';
import {navigate} from '../routes/router.jsx';
import {extractId} from '../utils/pokemonUtils.js';

export default function PokedexBrowserPage({slug}){
  const g=getGeneration(slug);
  const [error,setError]=useState('');

  useEffect(()=>{
    let live=true;
    setError('');
    (async()=>{
      try{
        let list=[];
        if(g.special){
          try{
            const dex=await getPokedex(g.pokedex);
            list=(dex.pokemon_entries||[]).map(e=>({id:extractId(e.pokemon_species.url),name:e.pokemon_species.name}));
          }catch{list=[];}
        }
        if(!list.length){
          const all=await getSpeciesIndex();
          list=all.filter(x=>x.id>=g.range[0]&&x.id<=g.range[1]).map(x=>({id:x.id,name:x.name}));
        }
        list.sort((a,b)=>a.id-b.id);
        if(live&&list[0])navigate(`/pokedex/${list[0].name}?region=${slug}`,{replace:true});
      }catch(e){if(live)setError(e.message);}
    })();
    return()=>{live=false;};
  },[slug]);

  if(error)return <div className="full-state error">{error}</div>;
  return <div className="full-state">Abriendo archivo de {g.name}…</div>;
}
