import { useEffect,useState } from 'react';
import { getPokemonBundle } from '../api/pokeApi';
export function usePokemon(identifier){const [state,setState]=useState({data:null,loading:false,error:null});useEffect(()=>{if(!identifier){setState({data:null,loading:false,error:null});return;}let active=true;setState({data:null,loading:true,error:null});getPokemonBundle(identifier).then(data=>active&&setState({data,loading:false,error:null})).catch(error=>active&&error?.name!=='AbortError'&&setState({data:null,loading:false,error}));return()=>{active=false;};},[identifier]);return state;}
