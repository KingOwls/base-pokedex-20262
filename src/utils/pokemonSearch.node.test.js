import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizePokemonQuery,levenshtein,rankPokemonMatches} from './pokemonSearch.js';

const ENTRIES=[
  {id:25,name:'pikachu',displayName:'Pikachu',aliases:['pika']},
  {id:26,name:'raichu',displayName:'Raichu'},
  {id:172,name:'pichu',displayName:'Pichu'},
  {id:448,name:'lucario',displayName:'Lucario'},
  {id:571,name:'zoroark-hisui',displayName:'Zoroark de Hisui',aliases:['zoroark hisui']},
  {id:669,name:'flabebe',displayName:'Flabébé'},
];

test('normalizes accents, punctuation and whitespace for Pokémon queries',()=>{
  assert.equal(normalizePokemonQuery('  Flabébé  '),'flabebe');
  assert.equal(normalizePokemonQuery('Zoroark-de Hisui'),'zoroark de hisui');
  assert.equal(normalizePokemonQuery('# 025'),'025');
});

test('levenshtein returns expected edit distances',()=>{
  assert.equal(levenshtein('pikachu','pikachu'),0);
  assert.equal(levenshtein('picachu','pikachu'),1);
  assert.ok(levenshtein('pykaqu','pikachu')<=3);
});

test('ranks exact and prefix matches before broader results',()=>{
  const exact=rankPokemonMatches(ENTRIES,'pikachu',{limit:5});
  assert.equal(exact[0].name,'pikachu');
  const prefix=rankPokemonMatches(ENTRIES,'pi',{limit:5});
  assert.equal(prefix[0].name,'pikachu');
  assert.equal(prefix[1].name,'pichu');
});

test('supports National Dex number with or without #',()=>{
  assert.equal(rankPokemonMatches(ENTRIES,'#25')[0].name,'pikachu');
  assert.equal(rankPokemonMatches(ENTRIES,'448')[0].name,'lucario');
});

test('tolerates common spelling mistakes without flooding unrelated results',()=>{
  assert.equal(rankPokemonMatches(ENTRIES,'Picachu',{limit:5})[0].name,'pikachu');
  assert.equal(rankPokemonMatches(ENTRIES,'Pykaqu',{limit:5})[0].name,'pikachu');
  assert.equal(rankPokemonMatches(ENTRIES,'zzzzzz',{limit:5}).length,0);
});

test('matches localized display names and aliases',()=>{
  assert.equal(rankPokemonMatches(ENTRIES,'flabebe')[0].name,'flabebe');
  assert.equal(rankPokemonMatches(ENTRIES,'zoroark hisui')[0].name,'zoroark-hisui');
});
