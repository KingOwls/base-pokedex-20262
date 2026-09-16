import { statLabel } from '../../utils/pokemonUtils';
export default function StatsPanel({stats=[]}){return <div className="stats-list">{stats.map(x=><div className="stat-row" key={x.stat.name}><strong>{statLabel(x.stat.name)}</strong><div className="stat-track"><div className="stat-fill" style={{width:`${Math.min(100,x.base_stat/180*100)}%`}}/></div><span>{x.base_stat}</span></div>)}</div>;}
