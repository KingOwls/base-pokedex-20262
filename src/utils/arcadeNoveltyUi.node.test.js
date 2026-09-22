import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(path,import.meta.url),'utf8');

test('arcade data layer reuses the existing PokéAPI bundle and exposes standard sprites',()=>{
  const source=read('../api/arcadePokemon.js');
  assert.match(source,/getPokemonBundle/);
  assert.match(source,/front_default/);
  assert.match(source,/specialAttack/);
  assert.match(source,/isLegendary/);
});

test('PokéImpostor page loads four Pokémon and evaluates an impostor pick',()=>{
  const source=read('../pages/arcade/PokeImpostorPage.jsx');
  assert.match(source,/IMPOSTOR_ROUNDS/);
  assert.match(source,/evaluateImpostorPick/);
  assert.match(source,/PixelPokemonSprite/);
  assert.match(source,/Siguiente ronda/);
});

test('Type Grid uses the shared autocomplete and validates row plus column criteria',()=>{
  const source=read('../pages/arcade/TypeGridPage.jsx');
  assert.match(source,/PokemonAutocomplete/);
  assert.match(source,/validateGridPick/);
  assert.match(source,/Intentos/);
  assert.match(source,/usedIds/);
});

test('BST Builder uses shared autocomplete and target evaluation with six slots',()=>{
  const source=read('../pages/arcade/BSTBuilderPage.jsx');
  assert.match(source,/PokemonAutocomplete/);
  assert.match(source,/evaluateBstTarget/);
  assert.match(source,/MAX_TEAM=6/);
  assert.match(source,/Evaluar equipo/);
});

test('novelty arcade registry declares the three shareable routes',()=>{
  const source=read('../data/arcadeNovelty.js');
  assert.match(source,/\/arcade\/impostor/);
  assert.match(source,/\/arcade\/type-grid/);
  assert.match(source,/\/arcade\/bst-builder/);
});
