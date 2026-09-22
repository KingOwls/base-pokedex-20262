export function normalizePokemonQuery(value=''){
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g,'')
    .toLowerCase()
    .replace(/^\s*#\s*/,'')
    .replace(/[_-]+/g,' ')
    .replace(/[^a-z0-9\s]/g,' ')
    .replace(/\s+/g,' ')
    .trim();
}

export function levenshtein(a='',b=''){
  const left=String(a),right=String(b);
  if(left===right)return 0;
  if(!left.length)return right.length;
  if(!right.length)return left.length;
  let prev=Array.from({length:right.length+1},(_,i)=>i);
  for(let i=1;i<=left.length;i++){
    const next=[i];
    for(let j=1;j<=right.length;j++){
      const cost=left[i-1]===right[j-1]?0:1;
      next[j]=Math.min(next[j-1]+1,prev[j]+1,prev[j-1]+cost);
    }
    prev=next;
  }
  return prev[right.length];
}

function candidateNames(entry){
  return [entry.name,entry.displayName,...(entry.aliases||[])]
    .filter(Boolean)
    .map(normalizePokemonQuery)
    .filter(Boolean);
}

function fuzzyThreshold(query){
  if(query.length<4)return 0;
  if(query.length<=5)return 2;
  if(query.length<=8)return 3;
  return Math.min(4,Math.floor(query.length*.34));
}

function scoreEntry(entry,query){
  if(!query)return {score:0,distance:0};
  const numeric=/^\d+$/.test(query);
  if(numeric){
    const id=Number(query);
    if(Number(entry.id)===id)return {score:0,distance:0};
    const idText=String(entry.id??'');
    if(idText.startsWith(query))return {score:12,distance:0};
    return null;
  }

  const names=candidateNames(entry);
  let best=null;
  for(const name of names){
    let candidate=null;
    if(name===query)candidate={score:0,distance:0};
    else if(name.startsWith(query))candidate={score:10,distance:0};
    else{
      const token=name.split(' ').find(part=>part.startsWith(query));
      if(token)candidate={score:14,distance:0};
      else{
        const index=name.indexOf(query);
        if(index>=0)candidate={score:20+index,distance:0};
        else{
          const distance=levenshtein(query,name);
          const threshold=fuzzyThreshold(query);
          if(threshold&&distance<=threshold)candidate={score:50+distance*8+Math.abs(name.length-query.length),distance};
        }
      }
    }
    if(candidate&&(!best||candidate.score<best.score))best=candidate;
  }
  return best;
}

export function rankPokemonMatches(entries=[],rawQuery='',options={}){
  const query=normalizePokemonQuery(rawQuery);
  const limit=Number.isFinite(options.limit)?Math.max(0,options.limit):8;
  const exclude=new Set((options.excludeIds||[]).map(Number));
  if(!query)return (options.includeEmpty?entries:[]).filter(e=>!exclude.has(Number(e.id))).slice(0,limit);

  return entries
    .filter(entry=>!exclude.has(Number(entry.id)))
    .map((entry,index)=>({entry,index,match:scoreEntry(entry,query)}))
    .filter(item=>item.match)
    .sort((a,b)=>a.match.score-b.match.score||Number(a.entry.id)-Number(b.entry.id)||a.index-b.index)
    .slice(0,limit)
    .map(item=>item.entry);
}
