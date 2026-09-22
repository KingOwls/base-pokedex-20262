import {useEffect,useMemo,useState} from 'react';
import {getPokedex,getSpeciesIndex} from '../../api/pokeApi.js';
import {GENERATIONS,getGeneration} from '../../data/generations.js';
import PixelPokemonSprite from '../common/PixelPokemonSprite.jsx';
import {Link} from '../../routes/router.jsx';
import {titleCase,padDex,extractId} from '../../utils/pokemonUtils.js';
import {assetUrl} from '../../utils/assets.js';
import {rankPokemonMatches} from '../../utils/pokemonSearch.js';

const REGION_ORDER=[...GENERATIONS.map(g=>g.slug),'national'];

export default function PokedexSidebar({slug='national',activeId=null,onEntriesChange}){
  const g=getGeneration(slug);
  const [entries,setEntries]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  const [q,setQ]=useState('');
  const [limit,setLimit]=useState(slug==='national'?240:220);

  useEffect(()=>{
    let live=true;
    setLoading(true);
    setError('');
    setQ('');
    setLimit(slug==='national'?240:220);
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
        list=list.sort((a,b)=>a.id-b.id);
        if(live){
          setEntries(list);
          onEntriesChange?.(list);
        }
      }catch(e){
        if(live)setError(e.message);
      }finally{
        if(live)setLoading(false);
      }
    })();
    return()=>{live=false;};
  },[slug]);

  useEffect(()=>{
    if(!activeId||!entries.length)return;
    const index=entries.findIndex(e=>e.id===Number(activeId));
    if(index>=limit-30)setLimit(Math.min(entries.length,index+80));
    requestAnimationFrame(()=>document.querySelector('[data-active-row="true"]')?.scrollIntoView({block:'center'}));
  },[activeId,entries.length]);

  const filtered=useMemo(()=>q?rankPokemonMatches(entries,q,{limit:260}):entries,[entries,q]);
  const shown=q?filtered:filtered.slice(0,limit);

  return <aside className="dex-sidebar integrated" style={{'--gen-accent':g.accent}}>
    <div className="dex-device">
      <img src={assetUrl(`crowleth/${g.asset}`)} alt={`Pokédex de ${g.name}`}/>
      <div><span>Generación {g.roman}</span><strong>{g.name}</strong><small>{entries.length?`${entries.length} entradas`:'Archivo regional'}</small></div>
    </div>

    <label className="dex-filter">
      <span>⌕</span>
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Filtrar esta Pokédex…"/>
    </label>

    <div className="dex-list" aria-live="polite">
      {loading&&<p className="state">Cargando archivo…</p>}
      {error&&<p className="state error">{error}</p>}
      {shown.map(e=><Link
        key={`${e.id}-${e.name}`}
        to={`/pokedex/${e.name}?region=${slug}`}
        className={`dex-row ${Number(activeId)===e.id?'active':''}`}
        data-active-row={Number(activeId)===e.id?'true':undefined}
      >
        <PixelPokemonSprite id={e.id} name={e.name}/>
        <span className="dex-number">{padDex(e.id)}</span>
        <b>{titleCase(e.name)}</b>
        {Number(activeId)===e.id&&<span className="row-ball" aria-hidden="true">◉</span>}
      </Link>)}
      {!loading&&!error&&!shown.length&&<p className="state">Sin coincidencias.</p>}
      {!q&&filtered.length>limit&&<button className="load-more" onClick={()=>setLimit(v=>v+240)}>Mostrar más</button>}
    </div>

    <nav className="region-stack" aria-label="Cambiar Pokédex regional">
      {REGION_ORDER.map(r=>{const item=getGeneration(r);return <Link key={r} to={`/pokedex/${r}`} className={r===slug?'active':''} style={{'--region-color':item.accent}}>
        <img src={assetUrl(`crowleth/${item.asset}`)} alt=""/>
        <span>{item.name}</span>
      </Link>;})}
    </nav>
  </aside>;
}
