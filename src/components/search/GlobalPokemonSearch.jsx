import {useState} from 'react';
import PokemonAutocomplete from './PokemonAutocomplete.jsx';
import {navigate} from '../../routes/router.jsx';

export default function GlobalPokemonSearch({className=''}){
  const [value,setValue]=useState('');
  return <PokemonAutocomplete
    className={`global-pokemon-search ${className}`.trim()}
    value={value}
    onChange={setValue}
    clearOnSelect
    onSelect={entry=>{
      setValue('');
      navigate(`/pokedex/${entry.name}`);
    }}
    placeholder="Buscar Pokémon por nombre o número…"
    label="Búsqueda global de Pokémon"
  />;
}
