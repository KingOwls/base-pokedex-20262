import {useEffect,useMemo,useState} from 'react';
import {getPokemonBundle,getEvolutionChain,getTypeRelations,getVarietyDetails,getMove,getAbility} from '../api/pokeApi.js';
import {combineTypeRelations} from '../utils/typeRelations.js';
import {assetUrl,getOfficialArtwork,generationForId,getLocalSpriteUrl} from '../utils/assets.js';
import {getGeneration,getGenerationForPokemonId} from '../data/generations.js';
import {getLocalizedEntry,padDex,statLabel,titleCase,describeEvolution,extractId} from '../utils/pokemonUtils.js';
import TypeBadge from '../components/common/TypeBadge.jsx';
import PixelPokemonSprite from '../components/common/PixelPokemonSprite.jsx';
import DefenseProfile from '../components/pokemon/DefenseProfile.jsx';
import PokedexSidebar from '../components/pokedex/PokedexSidebar.jsx';
import {Link,navigate} from '../routes/router.jsx';

function flattenChain(node,depth=0,out=[]){if(!node)return out;out.push({name:node.species.name,id:extractId(node.species.url),depth,detail:node.evolution_details?.[0]});for(const child of node.evolves_to||[])flattenChain(child,depth+1,out);return out;}
const TAB_ICONS={summary:'◉',stats:'▥',evolution:'⌘',forms:'✦',defenses:'◆',moves:'✹'};

export default function PokemonDetailPage({identifier}){
  const [bundle,setBundle]=useState(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  const [tab,setTab]=useState('summary');
  const [shiny,setShiny]=useState(false);
  const [extras,setExtras]=useState({});
  const [regionEntries,setRegionEntries]=useState([]);

  useEffect(()=>{
    let live=true;
    setLoading(true);setError('');setExtras({});setTab('summary');setShiny(false);
    getPokemonBundle(decodeURIComponent(identifier)).then(d=>live&&setBundle(d)).catch(e=>live&&setError(e.message)).finally(()=>live&&setLoading(false));
    return()=>{live=false;};
  },[identifier]);

  useEffect(()=>{
    if(!bundle)return;
    let live=true;
    (async()=>{try{
      if(tab==='evolution'&&!extras.evolution){const d=await getEvolutionChain(bundle.species.evolution_chain?.url);if(live)setExtras(x=>({...x,evolution:d}));}
      if(tab==='forms'&&!extras.forms){const d=await getVarietyDetails(bundle.species);if(live)setExtras(x=>({...x,forms:d}));}
      if(tab==='defenses'&&!extras.defenses){const d=await getTypeRelations(bundle.pokemon.types.map(t=>t.type.name));if(live)setExtras(x=>({...x,defenses:combineTypeRelations(d)}));}
    }catch{} })();
    return()=>{live=false;};
  },[tab,bundle]);

  if(loading)return <div className="full-state">Consultando PokéAPI…</div>;
  if(error)return <div className="full-state error">{error}<Link to="/pokedex">Volver a la Pokédex</Link></div>;
  if(!bundle)return null;

  const {pokemon,species}=bundle;
  const requestedRegion=new URLSearchParams(location.search).get('region');
  const fallbackRegion=getGenerationForPokemonId(species.id).slug;
  const regionSlug=getGeneration(requestedRegion||fallbackRegion).slug;
  const region=getGeneration(regionSlug);
  const name=titleCase(pokemon.name);
  const description=getLocalizedEntry(species.flavor_text_entries,'flavor_text');
  const genus=getLocalizedEntry(species.genera,'genus');
  const artwork=getOfficialArtwork(pokemon,shiny)||getLocalSpriteUrl(species.id);
  const normalArtwork=getOfficialArtwork(pokemon,false)||getLocalSpriteUrl(species.id);
  const shinyArtwork=getOfficialArtwork(pokemon,true)||normalArtwork;
  const tabs=[['summary','Resumen'],['stats','Estadísticas'],['evolution','Evolución'],['forms','Formas'],['defenses','Defensas'],['moves','Movimientos']];
  const index=regionEntries.findIndex(e=>e.id===species.id||e.name===species.name);
  const previous=index>0?regionEntries[index-1]:null;
  const next=index>=0&&index<regionEntries.length-1?regionEntries[index+1]:null;

  return <section className="pokedex-shell" style={{'--gen-accent':region.accent}}>
    <PokedexSidebar slug={regionSlug} activeId={species.id} onEntriesChange={setRegionEntries}/>
    <div className="pokemon-detail integrated-detail">
      <div className="detail-topline">
        <div className="archive-mark"><span>CROWLETH ARCHIVE</span><b>{region.name.toUpperCase()}</b></div>
        <div className="dex-progress"><span>{index>=0?String(index+1).padStart(3,'0'):'---'} / {regionEntries.length||'---'}</span><i><b style={{width:regionEntries.length&&index>=0?`${((index+1)/regionEntries.length)*100}%`:'0%'}}/></i></div>
        <div className="region-device-mini"><img src={assetUrl(`crowleth/${region.asset}`)} alt=""/><span>{region.name}<small>Pokédex</small></span></div>
      </div>

      <div className="pokemon-tabs" role="tablist">
        {tabs.map(([k,l])=><button key={k} className={tab===k?'active':''} onClick={()=>setTab(k)} role="tab" aria-selected={tab===k}><span aria-hidden="true">{TAB_ICONS[k]}</span>{l}</button>)}
      </div>

      <div className="detail-sheet">
        <header className="detail-heading">
          <div className="pokemon-identity">
            <span className="kicker">{padDex(species.id)} · Generación {generationForId(species.id)}</span>
            <h1>{name}</h1>
            <p className="pokemon-genus">{genus}</p>
            <div className="type-row">{pokemon.types.map(t=><TypeBadge key={t.type.name} type={t.type.name}/>)}</div>
            <p className="hero-description">{description||'No hay una descripción localizada disponible.'}</p>
            <QuickFacts pokemon={pokemon} species={species}/>
          </div>

          <div className="art-stage">
            <div className="art-halo" aria-hidden="true"/>
            <img src={artwork} alt={name}/>
            <div className="dex-crowleth-note">
              <img src={assetUrl('crowleth/CrowlethBase.png')} alt="Crowleth"/>
              <p><b>Nota de Crowleth:</b><span>Archivo de {region.name}. {species.is_mythical?'Pokémon mítico registrado.':species.is_legendary?'Pokémon legendario registrado.':'Revisa sus formas, defensas y movimientos para completar la investigación.'}</span></p>
            </div>
            <div className="shiny-options" aria-label="Cambiar apariencia">
              <button className={!shiny?'active':''} onClick={()=>setShiny(false)}><img src={normalArtwork} alt="Forma normal"/><span><i/>Normal</span></button>
              <button className={shiny?'active':''} onClick={()=>setShiny(true)}><img src={shinyArtwork} alt="Forma shiny"/><span><i/>Shiny</span></button>
            </div>
          </div>
        </header>

        <div className="tab-panel">
          {tab==='summary'&&<Summary pokemon={pokemon} species={species}/>}
          {tab==='stats'&&<Stats pokemon={pokemon}/>}
          {tab==='evolution'&&<Evolution chain={extras.evolution}/>}
          {tab==='forms'&&<Forms forms={extras.forms} current={pokemon.name} regionSlug={regionSlug}/>}
          {tab==='defenses'&&<DefenseProfile profile={extras.defenses||{}}/>}
          {tab==='moves'&&<Moves pokemon={pokemon}/>}
        </div>
      </div>

      <nav className="pokemon-bottom-nav" aria-label="Navegación secuencial de Pokédex">
        {previous?<button onClick={()=>navigate(`/pokedex/${previous.name}?region=${regionSlug}`)}>← <span>{padDex(previous.id)} <b>{titleCase(previous.name)}</b></span></button>:<span/>}
        <Link className="national-link" to="/pokedex/national"><span>▣</span> Ver en la Pokédex Nacional</Link>
        {next?<button onClick={()=>navigate(`/pokedex/${next.name}?region=${regionSlug}`)}><span>{padDex(next.id)} <b>{titleCase(next.name)}</b></span> →</button>:<span/>}
      </nav>
    </div>
  </section>;
}

function genderText(species){return species.gender_rate<0?'Sin género':species.gender_rate===0?'100% ♂':species.gender_rate===8?'100% ♀':`${Math.round((8-species.gender_rate)/8*100)}% ♂ · ${Math.round(species.gender_rate/8*100)}% ♀`;}

function QuickFacts({pokemon,species}){return <div className="quick-facts"><span><small>↕ Altura</small><b>{pokemon.height/10} m</b></span><span><small>▰ Peso</small><b>{pokemon.weight/10} kg</b></span><span><small>⚥ Género</small><b>{genderText(species)}</b></span></div>;}

function Summary({pokemon,species}){
  const [abilityText,setAbilityText]=useState({});
  useEffect(()=>{let live=true;Promise.allSettled(pokemon.abilities.map(a=>getAbility(a.ability.url))).then(items=>{if(!live)return;const next={};items.forEach((x,i)=>{if(x.status==='fulfilled'){const es=x.value.effect_entries?.find(e=>e.language?.name==='es');const en=x.value.effect_entries?.find(e=>e.language?.name==='en');next[pokemon.abilities[i].ability.name]=es?.short_effect||es?.effect||en?.short_effect||en?.effect||'';}});setAbilityText(next);});return()=>{live=false;};},[pokemon.id]);
  return <div className="summary-dossier">
    <section className="abilities-section"><div className="panel-heading"><span>◈</span><h3>Habilidades</h3></div><div className="ability-list verbose">{pokemon.abilities.map(a=><span key={a.ability.name}><b>{titleCase(a.ability.name)} {a.is_hidden&&<em>Habilidad oculta</em>}</b><small>{abilityText[a.ability.name]||'Consultando descripción…'}</small></span>)}</div></section>
    <section className="archive-facts"><div><span>◉</span><small>Categoría</small><b>{getLocalizedEntry(species.genera,'genus')||'Pokémon'}</b></div><div><span>◆</span><small>Tipos</small><b>{pokemon.types.map(t=>titleCase(t.type.name)).join(' / ')}</b></div><div><span>▣</span><small>N.º de Pokédex</small><b>{padDex(species.id)}</b></div><div><span>⚑</span><small>Experiencia base</small><b>{pokemon.base_experience??'—'}</b></div><div><span>⌂</span><small>Hábitat</small><b>{titleCase(species.habitat?.name||'Desconocido')}</b></div></section>
  </div>;
}

function Stats({pokemon}){const total=pokemon.stats.reduce((a,s)=>a+s.base_stat,0);return <div className="stats-card"><div className="bst"><span>BST</span><strong>{total}</strong></div>{pokemon.stats.map(s=><div className="stat-line" key={s.stat.name}><span>{statLabel(s.stat.name)}</span><div><i style={{width:`${Math.min(100,s.base_stat/2)}%`}}/></div><b>{s.base_stat}</b></div>)}</div>;}
function Evolution({chain}){if(!chain)return <p className="state">Cargando árbol evolutivo…</p>;const items=flattenChain(chain.chain);return <div className="evo-flow">{items.map((e,i)=><div className="evo-node" key={`${e.name}-${i}`}><PixelPokemonSprite id={e.id} name={e.name} fallback={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${e.name}.png`}/><b>{titleCase(e.name)}</b><small>{e.depth===0?'Especie inicial':describeEvolution(e.detail||{})}</small></div>)}</div>;}
function Forms({forms,current,regionSlug}){if(!forms)return <p className="state">Buscando variedades…</p>;return <div className="forms-grid-new">{forms.map(f=><button key={f.name} className={f.name===current?'active':''} onClick={()=>navigate(`/pokedex/${f.name}?region=${regionSlug}`)}><img src={getOfficialArtwork(f)||f.sprites.front_default} alt=""/><b>{titleCase(f.name)}</b><small>{f.name===current?'Forma actual':'Abrir variante'}</small></button>)}</div>;}
function Moves({pokemon}){const [selected,setSelected]=useState(pokemon.moves[0]?.move?.name||'');const [detail,setDetail]=useState(null);const sorted=useMemo(()=>pokemon.moves.slice(0,180),[pokemon.id]);useEffect(()=>{let live=true;if(!selected)return;setDetail(null);const ref=pokemon.moves.find(m=>m.move.name===selected)?.move?.url||selected;getMove(ref).then(d=>live&&setDetail(d)).catch(()=>{});return()=>{live=false;};},[selected,pokemon.id]);const flavor=detail?.flavor_text_entries?.find(e=>e.language?.name==='es')?.flavor_text||detail?.flavor_text_entries?.find(e=>e.language?.name==='en')?.flavor_text||'';return <div className="moves-layout"><div className="moves-list">{sorted.map(m=><button key={m.move.name} className={selected===m.move.name?'active':''} onClick={()=>setSelected(m.move.name)}>{titleCase(m.move.name)}</button>)}</div><div className="move-detail"><span>Movimiento seleccionado</span><h3>{titleCase(selected)}</h3>{detail?<><div className="move-meta"><b>{titleCase(detail.type?.name||'')}</b><b>{titleCase(detail.damage_class?.name||'')}</b><b>Pot. {detail.power??'—'}</b><b>Prec. {detail.accuracy??'—'}</b><b>PP {detail.pp??'—'}</b></div><p>{flavor.replace(/[\n\f\r]+/g,' ')||'Sin descripción disponible.'}</p></>:<p>Consultando detalle del movimiento…</p>}</div></div>;}
