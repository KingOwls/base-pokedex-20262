import {Link} from '../../routes/router.jsx';
import {assetUrl} from '../../utils/assets.js';
import GlobalPokemonSearch from '../search/GlobalPokemonSearch.jsx';

export default function CrowlethHeader(){
  return <header className="topbar">
    <Link to="/" className="brand"><img src={assetUrl('crowleth/Crowleth_Pokedex.png')} alt="Crowleth Pokédex"/></Link>
    <nav aria-label="Navegación principal">
      <Link to="/pokedex">Pokédex</Link>
      <Link to="/regions">Regiones</Link>
      <Link to="/arcade">PokéArcade</Link>
      <Link to="/daily">Daily</Link>
    </nav>
    <div className="search-wrap"><GlobalPokemonSearch/></div>
  </header>;
}
