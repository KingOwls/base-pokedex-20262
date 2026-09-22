import {NOVELTY_ARCADE_GAMES} from '../../data/arcadeNovelty.js';
import {Link} from '../../routes/router.jsx';

export default function NoveltyArcadeCards(){
  return <section className="novelty-arcade-section" aria-labelledby="novelty-arcade-title">
    <div className="novelty-arcade-heading">
      <div><span>NUEVAS INVESTIGACIONES</span><h2 id="novelty-arcade-title">Más formas de jugar con la Pokédex</h2></div>
      <p>Tres retos rápidos que reutilizan tipos, generaciones, habilidades y estadísticas reales.</p>
    </div>
    <div className="novelty-arcade-cards">
      {NOVELTY_ARCADE_GAMES.map(game=><Link key={game.slug} to={game.path} className={`novelty-arcade-card ${game.slug}`}>
        <span className="novelty-card-icon" aria-hidden="true">{game.icon}</span>
        <div><small>Dificultad {game.difficulty}</small><h3>{game.title}</h3><p>{game.subtitle}</p></div>
        <b>Jugar →</b>
      </Link>)}
    </div>
  </section>;
}
