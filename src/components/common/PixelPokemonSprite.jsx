import {useState} from 'react';
import {getLocalSpriteUrl} from '../../utils/assets.js';
export default function PixelPokemonSprite({id,name='',fallback='',className=''}){const [failed,setFailed]=useState(false);return <img className={`pixel-sprite ${className}`} src={failed?(fallback||`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`):getLocalSpriteUrl(id)} alt={name} onError={()=>setFailed(true)}/>}
