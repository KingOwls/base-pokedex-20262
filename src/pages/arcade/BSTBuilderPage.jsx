import {useMemo,useState} from 'react';
import PokemonAutocomplete from '../../components/search/PokemonAutocomplete.jsx';
import PixelPokemonSprite from '../../components/common/PixelPokemonSprite.jsx';
import {getArcadePokemon} from '../../api/arcadePokemon.js';
import {BST_DIFFICULTIES,BST_TARGETS} from '../../data/arcadeNovelty.js';
import {calculateBst,evaluateBstTarget} from '../../utils/arcadeNoveltyGames.js';

const MAX_TEAM=6;

export default function BSTBuilderPage(){
  const [team,setTeam]=useState([]);
  const [difficultyId,setDifficultyId]=useState('normal');
  const [targetIndex,setTargetIndex]=useState(1);
  const [feedback,setFeedback]=useState('Construye un equipo y acércate al objetivo sin pasarte a ciegas.');
  const [busy,setBusy]=useState(false);
  const difficulty=BST_DIFFICULTIES.find(x=>x.id===difficultyId)||BST_DIFFICULTIES[1];
  const target=BST_TARGETS[targetIndex%BST_TARGETS.length];
  const total=calculateBst(team);
  const result=useMemo(()=>evaluateBstTarget(team,target,difficulty.tolerance),[team,target,difficulty.tolerance]);
  const progress=Math.max(0,Math.min(100,(total/target)*100));

  async function addPokemon(entry){
    if(team.length>=MAX_TEAM||busy)return;
    setBusy(true);
    try{
      const profile=await getArcadePokemon(entry.name);
      if(team.some(p=>p.speciesId===profile.speciesId)){setFeedback('Ese Pokémon ya forma parte del equipo.');return;}
      setTeam(current=>[...current,profile]);
      setFeedback(`${profile.displayName} suma ${calculateBst(profile)} puntos de BST.`);
    }catch(e){setFeedback(e?.message||'No se pudo añadir ese Pokémon.');}
    finally{setBusy(false);}
  }

  function evaluate(){
    if(!team.length){setFeedback('Añade al menos un Pokémon antes de evaluar.');return;}
    if(result.success)setFeedback(`✓ Objetivo alcanzado: ${result.total} BST está dentro del margen ${difficulty.tolerance?`±${difficulty.tolerance}`:'exacto'}.`);
    else if(result.remaining>0)setFeedback(`Te faltan ${result.remaining} puntos de BST para llegar al objetivo.`);
    else setFeedback(`Te pasaste por ${Math.abs(result.remaining)} puntos de BST.`);
  }

  function newChallenge(){
    setTargetIndex(v=>(v+1)%BST_TARGETS.length);setTeam([]);setFeedback('Nuevo objetivo preparado.');
  }

  return <main className="arcade-novelty-page bst-builder-page">
    <header className="arcade-novelty-hero">
      <span>PokéArcade · Estadísticas</span>
      <h1>BST Builder</h1>
      <p>Elige hasta seis Pokémon y construye una suma de estadísticas base que alcance el objetivo.</p>
    </header>

    <section className="arcade-terminal-panel bst-layout">
      <div className="bst-main">
        <div className="bst-target-card"><small>OBJETIVO</small><strong>{target}</strong><span>BST</span><em>Margen: {difficulty.tolerance?`±${difficulty.tolerance}`:'exacto'}</em></div>
        <div className="bst-progress"><i style={{width:`${progress}%`}}/><span>{total} / {target}</span></div>
        <div className="bst-team-grid">
          {Array.from({length:MAX_TEAM},(_,index)=>{
            const profile=team[index];
            return <div className={`bst-slot ${profile?'filled':''}`} key={index}>
              {profile?<><button className="bst-remove" onClick={()=>setTeam(current=>current.filter((_,i)=>i!==index))} aria-label={`Quitar ${profile.displayName}`}>×</button><PixelPokemonSprite id={profile.id} name={profile.name} fallback={profile.sprite}/><b>{profile.displayName}</b><span>BST {calculateBst(profile)}</span></>:<><span className="bst-empty">{index+1}</span><small>Vacío</small></>}
            </div>;
          })}
        </div>
        <PokemonAutocomplete clearOnSelect disabled={team.length>=MAX_TEAM||busy} excludeIds={team.map(p=>p.speciesId)} onSelect={addPokemon} placeholder={team.length>=MAX_TEAM?'Equipo completo':'Busca un Pokémon para añadir…'}/>
        <div className="bst-actions"><button className="arcade-primary" onClick={evaluate}>Evaluar equipo</button><button className="arcade-secondary" onClick={newChallenge}>Nuevo objetivo</button></div>
        <p className={`bst-feedback ${result.success&&team.length?'success':''}`}>{feedback}</p>
      </div>

      <aside className="bst-side">
        <small>DIFICULTAD</small>
        <div className="difficulty-stack">{BST_DIFFICULTIES.map(item=><button key={item.id} className={item.id===difficultyId?'active':''} onClick={()=>setDifficultyId(item.id)}><b>{item.label}</b><span>{item.tolerance?`±${item.tolerance} BST`:'BST exacto'}</span></button>)}</div>
        <div className="bst-breakdown"><b>Estado actual</b><span>Total <strong>{total}</strong></span><span>{result.remaining>=0?'Faltan':'Exceso'} <strong>{Math.abs(result.remaining)}</strong></span><span>Espacios <strong>{MAX_TEAM-team.length}</strong></span></div>
      </aside>
    </section>
  </main>;
}
