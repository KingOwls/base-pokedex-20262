import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(path,import.meta.url),'utf8');

test('shared autocomplete loads species index once and ranks local matches',()=>{
  const source=read('../components/search/PokemonAutocomplete.jsx');
  assert.match(source,/getSpeciesIndex/);
  assert.match(source,/rankPokemonMatches/);
  assert.match(source,/PixelPokemonSprite/);
  assert.match(source,/role="combobox"/);
  assert.match(source,/role="listbox"/);
});

test('shared autocomplete supports keyboard selection and dismissal',()=>{
  const source=read('../components/search/PokemonAutocomplete.jsx');
  assert.match(source,/ArrowDown/);
  assert.match(source,/ArrowUp/);
  assert.match(source,/Enter/);
  assert.match(source,/Escape/);
});

test('regional Pokédex sidebar uses tolerant ranked search instead of literal includes filtering',()=>{
  const source=read('../components/pokedex/PokedexSidebar.jsx');
  assert.match(source,/rankPokemonMatches/);
  assert.doesNotMatch(source,/e\.name\.includes\(q\.toLowerCase\(\)\)/);
});

test('global search adapter opens a Pokémon detail from the shared autocomplete',()=>{
  const source=read('../components/search/GlobalPokemonSearch.jsx');
  assert.match(source,/PokemonAutocomplete/);
  assert.match(source,/navigate/);
  assert.match(source,/\/pokedex\//);
});

test('guess field adapter can be reused by PokéDaily and other guessing games',()=>{
  const source=read('../components/search/PokemonGuessField.jsx');
  assert.match(source,/PokemonAutocomplete/);
  assert.match(source,/onGuess/);
  assert.match(source,/guessedIds/);
  assert.match(source,/clearOnSelect/);
});

test('autocomplete can clear its query after a game selection',()=>{
  const source=read('../components/search/PokemonAutocomplete.jsx');
  assert.match(source,/clearOnSelect/);
});

test('site header uses the shared pixel-art autocomplete instead of the legacy text-only suggestion list',()=>{
  const source=read('../components/common/CrowlethHeader.jsx');
  assert.match(source,/GlobalPokemonSearch/);
  assert.doesNotMatch(source,/header-suggestions/);
  assert.doesNotMatch(source,/usePokemonSearch/);
});

test('global header search clears and dismisses suggestions after selecting a Pokémon',()=>{
  const source=read('../components/search/GlobalPokemonSearch.jsx');
  assert.match(source,/clearOnSelect/);
  assert.match(source,/setValue\(''\)/);
});
