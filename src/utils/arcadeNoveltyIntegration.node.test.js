import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(path,import.meta.url),'utf8');

test('novelty registry exposes the three shareable game links',()=>{
  const source=read('../data/arcadeNovelty.js');
  assert.match(source,/\/arcade\/impostor/);
  assert.match(source,/\/arcade\/type-grid/);
  assert.match(source,/\/arcade\/bst-builder/);
});

test('route helper maps each novelty path to its page component',()=>{
  const source=read('../routes/arcadeNoveltyRoutes.js');
  assert.match(source,/PokeImpostorPage/);
  assert.match(source,/TypeGridPage/);
  assert.match(source,/BSTBuilderPage/);
  assert.match(source,/getNoveltyArcadePage/);
});

test('arcade hub merges novelty games into the existing visible game grid',()=>{
  const source=read('../pages/ArcadePage.jsx');
  assert.match(source,/NOVELTY_ARCADE_GAMES/);
  assert.match(source,/\.\.\.NOVELTY_ARCADE_GAMES/);
  assert.match(source,/arcade-card-symbol/);
  assert.match(source,/Ocho modos/);
});

test('main app resolves novelty arcade routes instead of falling through to 404',()=>{
  const source=read('../App.jsx');
  assert.match(source,/getNoveltyArcadePage/);
  assert.match(source,/NoveltyArcadePage/);
});
