import {usePath} from './routes/router.jsx';
import AppShell from './components/common/AppShell.jsx';
import HomePage from './pages/HomePage.jsx';
import PokedexLibraryPage from './pages/PokedexLibraryPage.jsx';
import PokedexBrowserPage from './pages/PokedexBrowserPage.jsx';
import PokemonDetailPage from './pages/PokemonDetailPage.jsx';
import RegionsPage from './pages/RegionsPage.jsx';
import RegionDetailPage from './pages/RegionDetailPage.jsx';
import ArcadePage from './pages/ArcadePage.jsx';
import DailyPage from './pages/DailyPage.jsx';
import PokeComparePage from './pages/PokeComparePage.jsx';
import WhosThatPage from './pages/WhosThatPage.jsx';
import TypeMasterPage from './pages/TypeMasterPage.jsx';
import PokeSprintPage from './pages/PokeSprintPage.jsx';
import {GENERATIONS} from './data/generations.js';

const regionSlugs=new Set([...GENERATIONS.map(g=>g.slug),'national']);
export default function App(){const path=usePath();let page;let dark=false;
 if(path==='/')page=<HomePage/>;
 else if(path==='/pokedex'||path==='/pokedex/')page=<PokedexLibraryPage/>;
 else if(path.startsWith('/pokedex/')){const id=decodeURIComponent(path.split('/')[2]||'');page=regionSlugs.has(id)?<PokedexBrowserPage slug={id}/>:<PokemonDetailPage identifier={id}/>;}
 else if(path==='/regions'||path==='/regions/')page=<RegionsPage/>;
 else if(path.startsWith('/regions/'))page=<RegionDetailPage slug={path.split('/')[2]}/>;
 else if(path==='/arcade'||path==='/arcade/'){page=<ArcadePage/>;dark=true;}
 else if(path==='/daily'||path==='/arcade/daily'){page=<DailyPage/>;dark=true;}
 else if(path==='/arcade/compare'){page=<PokeComparePage/>;dark=true;}
 else if(path==='/arcade/whos-that'){page=<WhosThatPage/>;dark=true;}
 else if(path==='/arcade/type-master'){page=<TypeMasterPage/>;dark=true;}
 else if(path==='/arcade/sprint'){page=<PokeSprintPage/>;dark=true;}
 else page=<section className="full-state"><h1>404</h1><p>Este archivo no existe en la Pokédex de Crowleth.</p></section>;
 return <AppShell dark={dark}>{page}</AppShell>}
