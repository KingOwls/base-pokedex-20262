import {useEffect,useMemo,useState} from 'react';
import {getArcadePokemonMany} from '../../api/arcadePokemon.js';
import {IMPOSTOR_ROUNDS} from '../../data/arcadeNovelty.js';
import {evaluateImpostorPick} from '../../utils/arcadeNoveltyGames.js';
import PixelPokemonSprite from '../../components/common/PixelPokemonSprite.jsx';

const rotate=(items,amount)=>items.map((_,i)=>items[(i+amount)%items.length]);

export default function PokeImpostorPage(){
  const [roundIndex,setRoundIndex]=useState(0);
  const [pokemon,setPokemon]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  const [answer,setAnswer]=useState(null);
  const [score,setScore]=useState(0);
  const round=IMPOSTOR_ROUNDS[roundIndex%IMPOSTOR_ROUNDS.length];

  useEffect(()=>{
    let live=true;
    setLoading(true);setError('');setAnswer(null);
    getArcadePokemonMany(round.members)
      .then(items=>{if(live)setPokemon(rotate(items,roundIndex%items.length));})
      .catch(e=>{if(live)setError(e?.message||'No se pudo cargar la ronda.');})
      .finally(()=>{if(live)setLoading(false);});
    return()=>{live=false;};
  },[roundIndex]);

  const impostor=useMemo(()=>pokemon.find(p=>p.id===round.impostorId),[pokemon,round.impostorId]);

  function choose(profile){
    if(answer)return;
    const result=evaluateImpostorPick(round,profile);
    setAnswer({...result,pickedId:profile.id});
    if(result.correct)setScore(v=>v+1);
  }

  return <main className="arcade-novelty-page impostor-page">
    <header className="arcade-novelty-hero">
      <span>PokéArcade · Deducción</span>
      <h1>PokéImpostor</h1>
      <p>Cuatro Pokémon entran al archivo. Tres comparten una característica y uno rompe el patrón.</p>
      <div className="arcade-mini-stats"><b>Ronda {roundIndex+1}</b><b>Aciertos {score}</b></div>
    </header>

    <section className="arcade-terminal-panel">
      <div className="arcade-panel-heading"><div><small>POSIBLES CATEGORÍAS</small><b>Tipos · Generación · Habilidades · Stats</b></div><span>{round.category}</span></div>
      <h2>¿Quién es el impostor?</h2>
      {loading&&<p className="state">Preparando los cuatro expedientes…</p>}
      {error&&<p className="state error">{error}</p>}
      {!loading&&!error&&<div className="impostor-grid">
        {pokemon.map(profile=>{
          const selected=answer?.pickedId===profile.id;
          const actual=answer&&profile.id===round.impostorId;
          return <button key={profile.id} onClick={()=>choose(profile)} disabled={Boolean(answer)} className={`${selected?'selected':''} ${actual?'actual-impostor':''}`}>
            <PixelPokemonSprite id={profile.id} name={profile.name} fallback={profile.sprite}/>
            <span>#{String(profile.speciesId).padStart(4,'0')}</span>
            <b>{profile.displayName}</b>
            {answer&&actual&&<em>IMPOSTOR</em>}
          </button>;
        })}
      </div>}

      {answer&&<div className={`arcade-result ${answer.correct?'success':'fail'}`}>
        <strong>{answer.correct?'¡Detectado!':'Casi. El patrón estaba mejor escondido.'}</strong>
        <p>{round.reveal}</p>
        {!answer.correct&&impostor&&<p>El impostor correcto era <b>{impostor.displayName}</b>.</p>}
        <button onClick={()=>setRoundIndex(v=>v+1)}>Siguiente ronda →</button>
      </div>}
    </section>
  </main>;
}
