import test from 'node:test';
import assert from 'node:assert/strict';
import { getLocalSpriteUrl, generationForId } from './assets.js';
import { rangeForGeneration } from './pokedexRanges.js';
import { compareValues } from './compareGame.js';
import { applyAbilityModifier } from './typeMaster.js';
import { seededRace } from './raceEngine.js';

test('local sprite URL pads national dex to four digits', () => {
  assert.equal(getLocalSpriteUrl(25), '/assets/pokedex/0025/idle_right.gif');
});

test('generation mapping reaches generation IX', () => {
  assert.equal(generationForId(1), 1);
  assert.equal(generationForId(906), 9);
  assert.equal(generationForId(1025), 9);
});

test('generation IX range ends at 1025', () => {
  assert.deepEqual(rangeForGeneration(9), [906, 1025]);
});

test('compareValues reports left, right and ties', () => {
  assert.equal(compareValues(120, 90), 'left');
  assert.equal(compareValues(90, 120), 'right');
  assert.equal(compareValues(100, 100), 'tie');
});

test('Levitate makes ground immune', () => {
  const profile = { ground: 2, fire: 1 };
  assert.equal(applyAbilityModifier(profile, 'levitate').ground, 0);
});

test('seeded race is deterministic', () => {
  const roster = [
    { id: 1, speed: 120, acceleration: 80, stamina: 70, consistency: 80 },
    { id: 2, speed: 90, acceleration: 90, stamina: 90, consistency: 90 },
  ];
  assert.deepEqual(seededRace(roster, 1234), seededRace(roster, 1234));
});
