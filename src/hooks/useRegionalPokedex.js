import { useEffect,useState } from 'react';
import { getPokedex,getRegion,getRegions } from '../api/pokeApi';
export function useRegionalPokedex(){const[regions,setRegions]=useState([]);const[region,setRegion]=useState('kanto');const[pokedexes,setPokedexes]=useState([]);const[pokedex,setPokedex]=useState('');const[data,setData]=useState(null);const[loading,setLoading]=useState(false);const[error,setError]=useState(null);
useEffect(()=>{let active=true;getRegions().then(r=>active&&setRegions(r)).catch(e=>active&&setError(e.message));return()=>{active=false;};},[]);
useEffect(()=>{let active=true;setLoading(true);setError(null);getRegion(region).then(r=>{if(!active)return;const list=r.pokedexes||[];setPokedexes(list);setPokedex(list[0]?.name||'');if(!list.length)setData(null);}).catch(e=>active&&setError(e.message)).finally(()=>active&&setLoading(false));return()=>{active=false;};},[region]);
useEffect(()=>{if(!pokedex)return;let active=true;setLoading(true);setError(null);getPokedex(pokedex).then(d=>active&&setData(d)).catch(e=>active&&setError(e.message)).finally(()=>active&&setLoading(false));return()=>{active=false;};},[pokedex]);
return{regions,region,setRegion,pokedexes,pokedex,setPokedex,data,loading,error};}
