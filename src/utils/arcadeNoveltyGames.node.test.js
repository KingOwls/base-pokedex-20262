import test from 'node:test';
import assert from 'node:assert/strict';
import {
  pokemonMatchesCriterion,
  evaluateImpostorPick,
  validateGridPick,
  calculateBst,
  evaluateBstTarget,
} from './arcadeNoveltyGames.js';

const charizard={id:6,name:'charizard',generation:1,types:['fire','flying'],abilities:['blaze'],stats:{hp:78,attack:84,defense:78,specialAttack:109,specialDefense:85,speed:100}};
const arcanine={id:59,name:'arcanine',generation:1,types:['fire'],abilities:['intimidate','flash-fire'],stats:{hp:90,attack:110,defense:80,specialAttack:100,specialDefense:80,speed:95}};
const blastoise={id:9,name:'blastoise',generation:1,types:['water'],abilities:['torrent'],stats:{hp:79,attack:83,defense:100,specialAttack:85,specialDefense:105,speed:78}};

test('matches reusable type, generation, ability and stat criteria',()=>{
  assert.equal(pokemonMatchesCriterion(charizard,{kind:'type',value:'fire'}),true);
  assert.equal(pokemonMatchesCriterion(charizard,{kind:'generation',value:1}),true);
  assert.equal(pokemonMatchesCriterion(arcanine,{kind:'ability',value:'intimidate'}),true);
  assert.equal(pokemonMatchesCriterion(charizard,{kind:'stat-min',stat:'speed',value:100}),true);
  assert.equal(pokemonMatchesCriterion(blastoise,{kind:'stat-min',stat:'speed',value:100}),false);
});

test('PokéImpostor evaluates the single Pokémon that breaks the shared rule',()=>{
  const round={criterion:{kind:'type',value:'fire'},impostorId:9};
  assert.deepEqual(evaluateImpostorPick(round,blastoise),{correct:true,impostorId:9});
  assert.deepEqual(evaluateImpostorPick(round,charizard),{correct:false,impostorId:9});
});

test('Type Grid requires both criteria and rejects reused Pokémon',()=>{
  const valid=validateGridPick(charizard,{kind:'type',value:'fire'},{kind:'type',value:'flying'},new Set());
  assert.equal(valid.valid,true);
  const wrong=validateGridPick(arcanine,{kind:'type',value:'fire'},{kind:'type',value:'flying'},new Set());
  assert.equal(wrong.valid,false);
  assert.equal(wrong.reason,'criteria');
  const reused=validateGridPick(charizard,{kind:'type',value:'fire'},{kind:'type',value:'flying'},new Set([6]));
  assert.equal(reused.valid,false);
  assert.equal(reused.reason,'duplicate');
});

test('BST Builder sums all six base stats',()=>{
  assert.equal(calculateBst(charizard),534);
  assert.equal(calculateBst([charizard,blastoise]),1064);
});

test('BST target evaluation reports exact difference and tolerance',()=>{
  const exact=evaluateBstTarget([charizard,blastoise],1064,0);
  assert.deepEqual(exact,{total:1064,target:1064,difference:0,remaining:0,success:true});
  const near=evaluateBstTarget([charizard],550,20);
  assert.equal(near.success,true);
  assert.equal(near.difference,-16);
  assert.equal(near.remaining,16);
  const miss=evaluateBstTarget([charizard],600,20);
  assert.equal(miss.success,false);
});
