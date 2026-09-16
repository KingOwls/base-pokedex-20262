const API_BASE='https://pokeapi.co/api/v2';
const TTL=24*60*60*1000;
const memory=new Map();
const key=url=>`pokelibrary:${url}`;
const toUrl=r=>/^https?:\/\//i.test(String(r))?String(r):`${API_BASE}/${String(r).replace(/^\//,'')}`;
function read(url){try{const raw=localStorage.getItem(key(url));if(!raw)return null;const parsed=JSON.parse(raw);if(!parsed.savedAt||Date.now()-parsed.savedAt>TTL){localStorage.removeItem(key(url));return null;}return parsed.data;}catch{return null;}}
function write(url,data){try{const raw=JSON.stringify({savedAt:Date.now(),data});if(raw.length<300000)localStorage.setItem(key(url),raw);}catch{}}
export async function fetchJSON(resource,{useCache=true,signal}={}){const url=toUrl(resource);if(useCache&&memory.has(url))return memory.get(url);if(useCache){const cached=read(url);if(cached){memory.set(url,cached);return cached;}}let response;try{response=await fetch(url,{headers:{Accept:'application/json'},signal});}catch(error){if(error?.name==='AbortError')throw error;throw new Error('No fue posible conectarse con PokéAPI. Revisa tu conexión a internet.');}if(!response.ok){if(response.status===404)throw new Error('Pokémon o recurso no encontrado en PokéAPI.');throw new Error(`PokéAPI respondió con HTTP ${response.status}.`);}const data=await response.json();if(useCache){memory.set(url,data);write(url,data);}return data;}
export function clearCache(){memory.clear();try{Object.keys(localStorage).filter(k=>k.startsWith('pokelibrary:')).forEach(k=>localStorage.removeItem(k));}catch{}}
export {API_BASE};
