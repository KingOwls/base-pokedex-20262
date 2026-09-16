const RANGES={1:[1,151],2:[152,251],3:[252,386],4:[387,493],5:[494,649],6:[650,721],7:[722,809],8:[810,905],9:[906,1025]};
export const rangeForGeneration = generation => RANGES[Number(generation)] || [1,1025];
export function idsForRange([start,end]){return Array.from({length:end-start+1},(_,i)=>start+i);}
