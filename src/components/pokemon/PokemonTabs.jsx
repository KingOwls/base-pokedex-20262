const tabs=[['overview','Overview'],['evolution','Evolution'],['locations','Locations'],['weaknesses','Weaknesses']];
export default function PokemonTabs({active,onChange}){return <nav className="tabs">{tabs.map(([v,l])=><button key={v} className={`tab-button ${active===v?'active':''}`} onClick={()=>onChange(v)}>{l}</button>)}</nav>;}
