import {applyAbilityModifier} from './typeMaster.js';
import test from 'node:test';import assert from 'node:assert/strict';
import {deterministicPokemonId, compareDaily} from './dailyGame.js';
import {scoreForStage} from './whosThatGame.js';

test('daily target stays inside national dex',()=>{for(const k of ['2026-01-01','2026-09-16','2030-12-31']){const id=deterministicPokemonId(k);assert.ok(id>=1&&id<=1025)}});
test('daily numeric clues point toward higher target values',()=>{const c=compareDaily({id:25,height:4,weight:60},{id:150,height:20,weight:1220});assert.equal(c.id.direction,'↑');assert.equal(c.height.direction,'↑');});
test('Who score decreases as reveal advances',()=>{assert.ok(scoreForStage(1)>scoreForStage(3));assert.ok(scoreForStage(3)>scoreForStage(5));});
import {evolutionStageFromChain} from './dailyEvolution.js';

test('daily evolution stage distinguishes initial intermediate final and unique',()=>{
 const chain={species:{name:'a'},evolves_to:[{species:{name:'b'},evolves_to:[{species:{name:'c'},evolves_to:[]}]}]};
 assert.equal(evolutionStageFromChain(chain,'a'),'Inicial');
 assert.equal(evolutionStageFromChain(chain,'b'),'Intermedia');
 assert.equal(evolutionStageFromChain(chain,'c'),'Final');
 assert.equal(evolutionStageFromChain({species:{name:'solo'},evolves_to:[]},'solo'),'Única');
});

test('Wonder Guard nullifies neutral and resisted attack types',()=>{
 const result=applyAbilityModifier({fire:2,water:1,grass:.5},'wonder-guard');
 assert.equal(result.fire,2);assert.equal(result.water,0);assert.equal(result.grass,0);
});
