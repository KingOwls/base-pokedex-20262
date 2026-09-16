import {typeLabel} from '../../utils/pokemonUtils.js';
export default function TypeBadge({type}){return <span className={`type-chip type-${type}`}>{typeLabel(type)}</span>}
