import {useMemo,useState} from 'react';
import PokemonAutocomplete from '../../components/search/PokemonAutocomplete.jsx';
import PixelPokemonSprite from '../../components/common/PixelPokemonSprite.jsx';
import {getArcadePokemon} from '../../api/arcadePokemon.js';
import {TYPE_GRID_PRESETS} from '../../data/arcadeNovelty.js';
import {validateGridPick} from '../../utils/arcadeNoveltyGames.js';

const TOTAL_ATTEMPTS=9;
const cellKey=(row,column)=>`${row}-${column}`;

export default function TypeGridPage(){
  const [presetIndex,setPresetIndex]=useState(0);
  const [cells,setCells]=useState({});
  const [selectedCell,setSelectedCell]=useState(null);
  const [attempts,setAttempts]=useState(TOTAL_ATTEMPTS);
  const [feedback,setFeedback]=useState('Selecciona una casilla para empezar.');
  const [busy,setBusy]=useState(false);
  const preset=TYPE_GRID_PRESETS[presetIndex%TYPE_GRID_PRESETS.length];
  const usedIds=useMemo(()=>new Set(Object.values(cells).map(x=>x.id)),[cells]);
  const solved=Object.keys(cells).length===9;

  async function selectPokemon(entry){
    if(!selectedCell||busy||attempts<=0||solved)return;
    setBusy(true);
    try{
      const profile=await getArcadePokemon(entry.name);
      const row=preset.rows[selectedCell.row];
      const column=preset.columns[selectedCell.column];
      const result=validateGridPick(profile,row.criterion,column.criterion,usedIds);
      setAttempts(v=>Math.max(0,v-1));
      if(result.valid){
        setCells(current=>({...current,[cellKey(selectedCell.row,selectedCell.column)]:profile}));
        setFeedback(`✓ ${profile.displayName} cumple ${row.label} + ${column.label}.`);
        setSelectedCell(null);
      }else if(result.reason==='duplicate'){
        setFeedback('Ese Pokémon ya fue utilizado en otra casilla. El intento cuenta.');
      }else{
        setFeedback(`${profile.displayName} no cumple simultáneamente los dos criterios. El intento cuenta.`);
      }
    }catch(e){
      setFeedback(e?.message||'No pudimos comprobar ese Pokémon.');
    }finally{setBusy(false);}
  }

  function newGrid(){
    setPresetIndex(v=>(v+1)%TYPE_GRID_PRESETS.length);
    setCells({});setSelectedCell(null);setAttempts(TOTAL_ATTEMPTS);setFeedback('Nueva cuadrícula preparada.');
  }

  return <main className="arcade-novelty-page type-grid-page">
    <header className="arcade-novelty-hero">
      <span>PokéArcade · Cuadrícula</span>
      <h1>Type Grid</h1>
      <p>Completa las nueve intersecciones. Cada Pokémon debe cumplir el criterio de su fila y de su columna.</p>
      <div className="arcade-mini-stats"><b>Intentos {attempts}/{TOTAL_ATTEMPTS}</b><b>{Object.keys(cells).length}/9 casillas</b></div>
    </header>

    <section className="arcade-terminal-panel type-grid-layout">
      <div className="type-grid-board" aria-label="Cuadrícula Pokémon 3 por 3">
        <span className="grid-corner">TIPO × TIPO</span>
        {preset.columns.map((column,c)=><strong className="grid-column-label" key={column.label} style={{gridColumn:c+2,gridRow:1}}>{column.label}</strong>)}
        {preset.rows.map((row,r)=><div key={row.label} className="contents">
          <strong className="grid-row-label" style={{gridColumn:1,gridRow:r+2}}>{row.label}</strong>
          {preset.columns.map((column,c)=>{
            const key=cellKey(r,c);const profile=cells[key];const active=selectedCell?.row===r&&selectedCell?.column===c;
            return <button
              key={key}
              className={`type-grid-cell ${active?'active':''} ${profile?'filled':''}`}
              style={{gridColumn:c+2,gridRow:r+2}}
              disabled={Boolean(profile)||attempts<=0||solved}
              onClick={()=>setSelectedCell({row:r,column:c})}
              aria-label={`${row.label} más ${column.label}`}
            >
              {profile?<><PixelPokemonSprite id={profile.id} name={profile.name} fallback={profile.sprite}/><b>{profile.displayName}</b></>:<><span>＋</span><small>{row.label}<br/>+ {column.label}</small></>}
            </button>;
          })}
        </div>)}
      </div>

      <aside className="grid-search-panel">
        <small>CASILLA ACTIVA</small>
        <h2>{selectedCell?`${preset.rows[selectedCell.row].label} + ${preset.columns[selectedCell.column].label}`:'Selecciona una casilla'}</h2>
        <PokemonAutocomplete
          clearOnSelect
          disabled={!selectedCell||attempts<=0||solved||busy}
          onSelect={selectPokemon}
          excludeIds={[...usedIds]}
          placeholder={selectedCell?'Escribe un Pokémon…':'Primero elige una casilla…'}
        />
        <p className="grid-feedback">{solved?'🏆 ¡Cuadrícula completa!':attempts===0?'Se agotaron los intentos.':feedback}</p>
        <div className="grid-rules"><b>Reglas rápidas</b><span>9 intentos totales.</span><span>No se repiten Pokémon.</span><span>Cada respuesta queda bloqueada.</span></div>
        <button className="arcade-primary" onClick={newGrid}>{solved||attempts===0?'Nueva cuadrícula':'Cambiar cuadrícula'}</button>
      </aside>
    </section>
  </main>;
}
