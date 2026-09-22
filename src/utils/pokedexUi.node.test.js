import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {getGenerationForPokemonId} from '../data/generations.js';

test('maps National Dex ids to their default regional generation',()=>{
  assert.equal(getGenerationForPokemonId(1).slug,'kanto');
  assert.equal(getGenerationForPokemonId(152).slug,'johto');
  assert.equal(getGenerationForPokemonId(650).slug,'kalos');
  assert.equal(getGenerationForPokemonId(906).slug,'paldea');
});

test('integrated detail page uses the Pokédex shell and visual shiny selector',()=>{
  const source=fs.readFileSync(new URL('../pages/PokemonDetailPage.jsx',import.meta.url),'utf8');
  assert.match(source,/PokedexSidebar/);
  assert.match(source,/pokedex-shell/);
  assert.match(source,/shiny-options/);
  assert.match(source,/pokemon-bottom-nav/);
});

test('regional browser auto-opens a Pokémon instead of leaving an empty welcome screen',()=>{
  const source=fs.readFileSync(new URL('../pages/PokedexBrowserPage.jsx',import.meta.url),'utf8');
  assert.match(source,/replace:true/);
  assert.doesNotMatch(source,/Selecciona un Pokémon/);
});

test('sidebar marks the active row without passing a ref into the custom Link component',()=>{
  const source=fs.readFileSync(new URL('../components/pokedex/PokedexSidebar.jsx',import.meta.url),'utf8');
  assert.match(source,/data-active-row/);
  assert.doesNotMatch(source,/ref=\{Number\(activeId\)/);
});
