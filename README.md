# Crowleth Pokédex

**Autor:** Jorge Luis Osorio Silva  
**GitHub Pages:** [Pagina Web](https://kingowls.github.io/base-pokedex-20262/)

Crowleth Pokédex es una Pokédex web interactiva construida con React + Vite y PokéAPI. Combina consulta enciclopédica, navegación por generaciones y regiones, pixel art local y cinco minijuegos de PokéArcade.

## Alcance de esta versión

- Generaciones I–IX y Pokédex Nacional #001–1025.
- Kanto, Johto, Hoenn, Sinnoh, Unova, Kalos, Alola, Galar, Hisui y Paldea.
- Formas regionales y variantes que PokéAPI expone para cada especie.
- Ficha con Resumen, Estadísticas, Evolución, Formas, Defensas y Movimientos.
- Selector Normal / Shiny.
- PokéDaily con reto diario y modo de racha.
- PokéCompare.
- Who’s That Pokémon?.
- Type Master.
- PokéSprint con 12 corredores y eventos de carrera.
- Diseño responsive, navegación por teclado y soporte para `prefers-reduced-motion`.

> El RPG, capturas, mapas jugables, mochila, técnicas de campo y Event Engine están deliberadamente fuera del alcance de esta entrega.

## Requisitos

- Node.js 18 o superior.
- npm.
- Conexión a internet para consultar PokéAPI durante el uso.

## Ejecutar localmente

```bash
npm install
npm run dev
```

Abre la URL que indique Vite, normalmente `http://localhost:5173`.

## Build de producción

```bash
npm run build
npm run preview
```

## Pruebas

```bash
npm test
```

Los motores puros también incluyen pruebas compatibles con Node:

```bash
node --test src/utils/crowleth-core.node.test.js src/utils/arcade.node.test.js
```

## Estructura principal

```text
src/
├── api/          # PokéAPI y caché
├── components/   # UI compartida
├── data/         # generaciones, regiones y PokéSprint
├── pages/        # Pokédex, regiones y minijuegos
├── routes/       # navegación SPA
└── utils/        # lógica pura de juegos y tipos

public/assets/
├── crowleth/     # identidad, mockups de referencia y Pokédex por generación
├── pokedex/      # sprites pixel art #0001–#1025
└── pokesprint/   # spritesheets de los 12 corredores
```

## Datos y assets

PokéAPI es la fuente central de datos de Pokémon. Los sprites pixel art locales tienen prioridad en listados y minijuegos, con sprites de PokéAPI como fallback. Los assets visuales suministrados al proyecto se mantienen dentro de `public/assets`.

## GitHub Pages

Cuando el repositorio sea publicado, reemplaza la línea del encabezado:

```text
GitHub Pages: [pendiente de desplegar]
```

por la URL final, por ejemplo:

```text
GitHub Pages: https://kingowls.github.io/base-pokedex-20262/
```
