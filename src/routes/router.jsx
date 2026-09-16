import {useEffect,useState} from 'react';
const BASE=(import.meta.env?.BASE_URL||'/').replace(/\/$/,'');
const normalize=pathname=>BASE&&pathname.startsWith(BASE)?pathname.slice(BASE.length)||'/':pathname||'/';
const external=to=>`${BASE}${to.startsWith('/')?to:`/${to}`}`||'/';
export function navigate(to,{replace=false}={}){const url=external(to);if(replace)history.replaceState({},'',url);else history.pushState({},'',url);window.dispatchEvent(new PopStateEvent('popstate'));window.scrollTo({top:0,behavior:'smooth'});}
export function Link({to,className='',children,...props}){return <a href={external(to)} className={className} onClick={e=>{if(!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey&&e.button===0){e.preventDefault();navigate(to);}}} {...props}>{children}</a>}
export function usePath(){const [path,setPath]=useState(()=>normalize(location.pathname));useEffect(()=>{const fn=()=>setPath(normalize(location.pathname));addEventListener('popstate',fn);return()=>removeEventListener('popstate',fn)},[]);return path;}
