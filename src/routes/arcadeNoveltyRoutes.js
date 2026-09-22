import PokeImpostorPage from '../pages/arcade/PokeImpostorPage.jsx';
import TypeGridPage from '../pages/arcade/TypeGridPage.jsx';
import BSTBuilderPage from '../pages/arcade/BSTBuilderPage.jsx';

export const ARCADE_NOVELTY_ROUTE_MAP={
  '/arcade/impostor':PokeImpostorPage,
  '/arcade/type-grid':TypeGridPage,
  '/arcade/bst-builder':BSTBuilderPage,
};

export function getNoveltyArcadePage(pathname){
  const clean=String(pathname||'').replace(/\/+$/,'')||'/';
  return ARCADE_NOVELTY_ROUTE_MAP[clean]||null;
}
