import {Link} from '../routes/router.jsx';
import {assetUrl} from '../utils/assets.js';
import {NOVELTY_ARCADE_GAMES} from '../data/arcadeNovelty.js';

const classicGames=[
  {slug:'daily',path:'/arcade/daily',image:'PokeDaily.png',title:'PokéDaily',subtitle:'Deduce un Pokémon con pistas comparativas.'},
  {slug:'compare',path:'/arcade/compare',image:'PokeCompare.png',title:'PokéCompare',subtitle:'¿Quién tiene más? Compara stats, tamaño y número.'},
  {slug:'whos-that',path:'/arcade/whos-that',image:'WhoIsThat.png',title:'Who’s That Pokémon?',subtitle:'Reconoce la especie mientras la imagen se revela.'},
  {slug:'type-master',path:'/arcade/type-master',image:'TypeMaster.png',title:'Type Master',subtitle:'Deduce el Pokémon por su perfil defensivo.'},
  {slug:'sprint',path:'/arcade/sprint',image:'PokeSprint.png',title:'PokéSprint',subtitle:'Predice el Top 3 y observa la carrera.'},
];

const games=[
  ...classicGames,
  ...NOVELTY_ARCADE_GAMES.map(game=>({...game,isNovelty:true})),
];

export default function ArcadePage(){
  return <section className="arcade-hub">
    <div className="section-title light">
      <span>POKÉARCADE</span>
      <h1>Aprende jugando</h1>
      <p>Ocho modos construidos a partir de los mismos datos que alimentan la Pokédex.</p>
    </div>
    <div className="arcade-grid">
      {games.map(game=><Link to={game.path} className={`arcade-card ${game.isNovelty?'arcade-card--novelty':''}`} key={game.path}>
        {game.image
          ?<img src={assetUrl(`crowleth/${game.image}`)} alt=""/>
          :<div className={`arcade-card-symbol ${game.slug}`} aria-hidden="true">{game.icon}</div>}
        <div>
          {game.isNovelty&&<small className="arcade-card-meta">NUEVO · Dificultad {game.difficulty}</small>}
          <h2>{game.title}</h2>
          <p>{game.subtitle}</p>
          <b>Jugar →</b>
        </div>
      </Link>)}
    </div>
  </section>;
}
