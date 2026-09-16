const KEY='crowleth:arcade';
export function loadArcadeState(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return{}}}
export function saveGameRecord(gameKey,record){const state=loadArcadeState();state[gameKey]={...(state[gameKey]||{}),...record};try{localStorage.setItem(KEY,JSON.stringify(state))}catch{}return state[gameKey]}
