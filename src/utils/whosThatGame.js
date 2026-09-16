export const scoreForStage=stage=>Math.max(200,1200-(Number(stage)-1)*190);
export const nextRevealStage=stage=>Math.min(6,Number(stage)+1);
export const revealLabel=stage=>({1:'Silueta',2:'Pixelado extremo',3:'Pixelado medio',4:'Desenfoque',5:'Casi revelado',6:'Revelación total'}[stage]||'Revelación');
