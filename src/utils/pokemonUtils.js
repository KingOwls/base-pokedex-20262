export const TYPE_ES = {normal:'Normal',fire:'Fuego',water:'Agua',electric:'Eléctrico',grass:'Planta',ice:'Hielo',fighting:'Lucha',poison:'Veneno',ground:'Tierra',flying:'Volador',psychic:'Psíquico',bug:'Bicho',rock:'Roca',ghost:'Fantasma',dragon:'Dragón',dark:'Siniestro',steel:'Acero',fairy:'Hada'};
const STAT_ES={hp:'HP',attack:'Ataque',defense:'Defensa','special-attack':'At. Esp.','special-defense':'Def. Esp.',speed:'Velocidad'};
const ROMAN={'generation-i':'I','generation-ii':'II','generation-iii':'III','generation-iv':'IV','generation-v':'V','generation-vi':'VI','generation-vii':'VII','generation-viii':'VIII','generation-ix':'IX'};
export const normalizeText=(v='')=>String(v).normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase().replace(/[’']/g,'').replace(/[_\s]+/g,'-').replace(/-+/g,'-');
export const compactText=(v='')=>normalizeText(v).replace(/[^a-z0-9]/g,'');
export const extractId=(url='')=>Number(url.split('/').filter(Boolean).at(-1))||null;
export const padDex=(id)=>`#${String(id).padStart(4,'0')}`;
export const titleCase=(v='')=>String(v).replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
export const generationRoman=(v='')=>ROMAN[v]||titleCase(v);
export const statLabel=(v='')=>STAT_ES[v]||titleCase(v);
export const typeLabel=(v='')=>TYPE_ES[v]||titleCase(v);
export const sanitizeFlavorText=(v='')=>v.replace(/[\n\f\r]+/g,' ').replace(/\s+/g,' ').trim();
export function getLocalizedEntry(entries=[],field='name',preferred=['es','en']){for(const lang of preferred){const found=entries.find(e=>e.language?.name===lang&&e[field]);if(found)return sanitizeFlavorText(found[field]);}return entries[0]?.[field]?sanitizeFlavorText(entries[0][field]):'';}
export function classifySpecialForm(name='',formData=null){const n=normalizeText(name);if(formData?.is_mega||n.includes('mega'))return 'Mega Evolución';if(n.includes('gmax'))return 'Gigamax';if(n.includes('primal'))return 'Forma Primigenia';if(n.includes('origin'))return 'Forma Origen';if(n.includes('alola'))return 'Forma de Alola';if(n.includes('galar'))return 'Forma de Galar';if(n.includes('hisui'))return 'Forma de Hisui';if(n.includes('paldea'))return 'Forma de Paldea';if(n.includes('therian'))return 'Forma Therian';if(n.includes('crowned'))return 'Forma Coronada';if(formData?.is_battle_only)return 'Forma de combate';return 'Forma especial';}
export function describeEvolution(d={}){const p=[];if(d.min_level)p.push(`Nivel ${d.min_level}`);if(d.item?.name)p.push(`Usar ${titleCase(d.item.name)}`);if(d.held_item?.name)p.push(`Llevar ${titleCase(d.held_item.name)}`);if(d.trigger?.name==='trade')p.push('Intercambio');if(d.min_happiness)p.push(`Felicidad ≥ ${d.min_happiness}`);if(d.time_of_day)p.push(`Momento: ${titleCase(d.time_of_day)}`);if(d.location?.name)p.push(`Lugar: ${titleCase(d.location.name)}`);if(d.known_move?.name)p.push(`Conoce ${titleCase(d.known_move.name)}`);if(d.needs_overworld_rain)p.push('Mientras llueve');return p.length?p.join(' · '):titleCase(d.trigger?.name||'Evolución');}
export const spriteArtwork=(p)=>p?.sprites?.other?.['official-artwork']?.front_default||p?.sprites?.other?.home?.front_default||p?.sprites?.front_default||'';
export const shinyArtwork=(p)=>p?.sprites?.other?.['official-artwork']?.front_shiny||p?.sprites?.other?.home?.front_shiny||p?.sprites?.front_shiny||'';
export function isDexNumber(v){return /^#?\d+$/.test(String(v).replace(/\s+/g,''));}
export function parseDexNumber(v){return Number(String(v).replace(/[^0-9]/g,''));}
