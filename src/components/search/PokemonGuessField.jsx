import {useState} from 'react';
import PokemonAutocomplete from './PokemonAutocomplete.jsx';

export default function PokemonGuessField({
  onGuess,
  guessedIds=[],
  disabled=false,
  placeholder='Escribe tu respuesta…',
  className='',
}){
  const [value,setValue]=useState('');
  return <PokemonAutocomplete
    clearOnSelect
    className={`pokemon-guess-field ${className}`.trim()}
    value={value}
    onChange={setValue}
    onSelect={entry=>{
      onGuess?.(entry);
      setValue('');
    }}
    excludeIds={guessedIds}
    disabled={disabled}
    placeholder={placeholder}
    label="Elegir Pokémon como respuesta"
  />;
}
