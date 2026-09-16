const BASE=(import.meta.env?.BASE_URL||'/').replace(/\/$/,'');
export const assetUrl=path=>`${BASE}/assets/${String(path).replace(/^\/+/, '')}`;
export const getLocalSpriteUrl = id => assetUrl(`pokedex/${String(Number(id)).padStart(4,'0')}/idle_right.gif`);
export const getLocalSpritePngUrl = id => assetUrl(`pokedex/${String(Number(id)).padStart(4,'0')}/idle_right.png`);
export function generationForId(id){const n=Number(id);if(n<=151)return 1;if(n<=251)return 2;if(n<=386)return 3;if(n<=493)return 4;if(n<=649)return 5;if(n<=721)return 6;if(n<=809)return 7;if(n<=905)return 8;return 9;}
export function getOfficialArtwork(pokemon, shiny=false){return pokemon?.sprites?.other?.['official-artwork']?.[shiny?'front_shiny':'front_default'] || pokemon?.sprites?.[shiny?'front_shiny':'front_default'] || null;}
export function getApiSprite(pokemon, shiny=false){return pokemon?.sprites?.[shiny?'front_shiny':'front_default'] || getOfficialArtwork(pokemon, shiny);}
