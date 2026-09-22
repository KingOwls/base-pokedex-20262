import {useEffect,useId,useMemo,useRef,useState} from 'react';
import {getSpeciesIndex} from '../../api/pokeApi.js';
import {rankPokemonMatches} from '../../utils/pokemonSearch.js';
import {padDex,titleCase} from '../../utils/pokemonUtils.js';
import PixelPokemonSprite from '../common/PixelPokemonSprite.jsx';

let speciesIndexPromise=null;
function loadDefaultEntries(){
  if(!speciesIndexPromise)speciesIndexPromise=getSpeciesIndex();
  return speciesIndexPromise;
}

export default function PokemonAutocomplete({
  value,
  onChange,
  onSelect,
  entries:providedEntries,
  placeholder='Busca un Pokémon por nombre o número…',
  maxResults=8,
  excludeIds=[],
  disabled=false,
  autoFocus=false,
  label='Buscar Pokémon',
  className='',
  clearOnSelect=false,
}){
  const [internalValue,setInternalValue]=useState('');
  const [entries,setEntries]=useState(providedEntries||[]);
  const [open,setOpen]=useState(false);
  const [active,setActive]=useState(0);
  const [loading,setLoading]=useState(!providedEntries);
  const [error,setError]=useState('');
  const rootRef=useRef(null);
  const listId=useId();
  const controlled=value!==undefined;
  const query=controlled?value:internalValue;

  useEffect(()=>{
    if(providedEntries){setEntries(providedEntries);setLoading(false);return;}
    let live=true;
    setLoading(true);setError('');
    loadDefaultEntries()
      .then(data=>{if(live)setEntries(data||[]);})
      .catch(e=>{if(live)setError(e?.message||'No se pudo cargar el índice de Pokémon.');})
      .finally(()=>{if(live)setLoading(false);});
    return()=>{live=false;};
  },[providedEntries]);

  useEffect(()=>{
    const close=e=>{if(rootRef.current&&!rootRef.current.contains(e.target))setOpen(false);};
    document.addEventListener('pointerdown',close);
    return()=>document.removeEventListener('pointerdown',close);
  },[]);

  const results=useMemo(()=>rankPokemonMatches(entries,query,{limit:maxResults,excludeIds}),[entries,query,maxResults,excludeIds]);

  useEffect(()=>setActive(0),[query]);

  function update(next){
    if(!controlled)setInternalValue(next);
    onChange?.(next);
    setOpen(Boolean(next));
  }

  function choose(entry){
    const labelText=entry.displayName||titleCase(entry.name);
    const nextValue=clearOnSelect?'':labelText;
    if(!controlled)setInternalValue(nextValue);
    onChange?.(nextValue);
    onSelect?.(entry);
    setOpen(false);
  }

  function onKeyDown(event){
    if(event.key==='ArrowDown'){
      event.preventDefault();
      if(!open)setOpen(true);
      setActive(i=>Math.min(Math.max(results.length-1,0),i+1));
    }else if(event.key==='ArrowUp'){
      event.preventDefault();
      setActive(i=>Math.max(0,i-1));
    }else if(event.key==='Enter'){
      if(open&&results[active]){
        event.preventDefault();
        choose(results[active]);
      }
    }else if(event.key==='Escape'){
      setOpen(false);
    }
  }

  const expanded=open&&Boolean(query)&&!disabled;

  return <div className={`pokemon-autocomplete ${className}`.trim()} ref={rootRef}>
    <label className="sr-only" htmlFor={`${listId}-input`}>{label}</label>
    <div className="pokemon-autocomplete-field">
      <span aria-hidden="true">⌕</span>
      <input
        id={`${listId}-input`}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={expanded}
        aria-controls={listId}
        aria-activedescendant={expanded&&results[active]?`${listId}-${results[active].id}`:undefined}
        autoComplete="off"
        autoFocus={autoFocus}
        disabled={disabled}
        value={query}
        placeholder={placeholder}
        onFocus={()=>query&&setOpen(true)}
        onChange={e=>update(e.target.value)}
        onKeyDown={onKeyDown}
      />
      {query&&<button type="button" className="pokemon-autocomplete-clear" onClick={()=>update('')} aria-label="Limpiar búsqueda">×</button>}
    </div>

    {expanded&&<div id={listId} role="listbox" className="pokemon-autocomplete-menu">
      {loading&&<p className="pokemon-autocomplete-state">Cargando Pokédex…</p>}
      {error&&<p className="pokemon-autocomplete-state error">{error}</p>}
      {!loading&&!error&&results.map((entry,index)=><button
        type="button"
        role="option"
        aria-selected={index===active}
        id={`${listId}-${entry.id}`}
        key={`${entry.id}-${entry.name}`}
        className={index===active?'active':''}
        onMouseEnter={()=>setActive(index)}
        onClick={()=>choose(entry)}
      >
        <PixelPokemonSprite id={entry.id} name={entry.name}/>
        <span className="pokemon-autocomplete-number">{padDex(entry.id)}</span>
        <b>{entry.displayName||titleCase(entry.name)}</b>
      </button>)}
      {!loading&&!error&&!results.length&&<p className="pokemon-autocomplete-state">No encontramos una coincidencia cercana.</p>}
    </div>}
  </div>;
}
