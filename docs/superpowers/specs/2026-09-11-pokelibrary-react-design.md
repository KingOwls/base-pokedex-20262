# Diseño de migración: Pokédex Async → PokéLibrary React

Fecha: 2026-09-11

## 1. Objetivo

Migrar el proyecto educativo Pokédex Async, actualmente construido con HTML, CSS y JavaScript puro, a una aplicación React con Vite sin perder las funciones que ya funcionan. La nueva arquitectura debe servir tanto como producto funcional como material de formación para comprender React, componentes, estado, props, hooks, Fetch API y programación asíncrona con async/await.

La migración debe dejar preparada la base para una segunda etapa de crecimiento denominada **PokéLibrary**, donde podrán incorporarse bibliotecas de Pokédex, regiones, rutas/localizaciones y navegación cruzada entre recursos de PokéAPI.

## 2. Alcance de la primera versión React

La primera versión React conservará estas capacidades de la aplicación actual:

- búsqueda por nombre;
- búsqueda por número de Pokédex;
- tolerancia a errores mediante normalización y distancia de Levenshtein;
- búsqueda directa de variedades como `zoroark-hisui`, `raichu-alola` y `charizard-mega-x`;
- filtro por tipo;
- filtro por Legendario y Mítico;
- ficha principal con artwork, tipos, altura, peso, categoría, habilidades, generación y estadísticas base;
- descripción Pokédex;
- shiny y diferencias de género cuando existan;
- variedades y formas especiales;
- evolución y condiciones;
- ubicaciones/encuentros registrados por PokéAPI;
- cálculo de debilidades, resistencias, inmunidades y daño neutro;
- caché de respuestas para reducir solicitudes repetidas.
- Evento de Daily o de Busqueda de Personaje

No se incluirán todavía sistemas de batalla, equipos competitivos, autenticación de usuarios ni backend propio.

## 3. Tecnología

- React 18+
- Vite
- JavaScript con módulos EN
- CSS 
- Fetch API nativa
- PokéAPI REST v2
- localStorage para caché persistente ligera
- Vitest para pruebas de utilidades y lógica no visual

No se añadirá Axios ni una librería de manejo remoto de estado en esta etapa para que el aprendizaje de `fetch`, Promises y `async/await` siga siendo visible.

## 4. Arquitectura propuesta

```text
pokedex-react/
├── public/
├── src/
│   ├── api/
│   │   ├── httpClient.js
│   │   └── pokeApi.js
│   ├── components/
│   │   ├── common/
│   │   │   ├── Loading.jsx
│   │   │   ├── ErrorMessage.jsx
│   │   │   └── TypeBadge.jsx
│   │   ├── search/
│   │   │   ├── SearchPanel.jsx
│   │   │   ├── SearchSuggestions.jsx
│   │   │   └── ResultsGrid.jsx
│   │   └── pokemon/
│   │       ├── PokemonHero.jsx
│   │       ├── PokemonTabs.jsx
│   │       ├── OverviewTab.jsx
│   │       ├── EvolutionTab.jsx
│   │       ├── LocationsTab.jsx
│   │       ├── WeaknessesTab.jsx
│   │       ├── StatsPanel.jsx
│   │       └── FormsGallery.jsx
│   ├── data/
│   │   └── specialPokemon.js
│   ├── hooks/
│   │   ├── usePokemon.js
│   │   ├── usePokemonSearch.js
│   │   └── useLazyPokemonTab.js
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   └── PokemonPage.jsx
│   ├── utils/
│   │   ├── pokemonUtils.js
│   │   ├── fuzzySearch.js
│   │   └── typeRelations.js
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── tests/
├── README.md
├── package.json
└── vite.config.js
```

## 5. Separación de responsabilidades

### `api/httpClient.js`
Centraliza `fetch`, errores HTTP, conexión y caché. Reemplaza la función `fetchJSON()` global de la versión vanilla.

### `api/pokeApi.js`
Expone funciones semánticas como `getPokemon`, `getSpecies`, `getPokemonBundle`, `getEvolutionChain`, `getEncounters`, `getTypeRelations` y `getSearchIndex`.

### `utils/`
Contiene funciones puras que no dependen de React. La normalización de texto, Levenshtein, clasificación de formas, traducción de tipos y cálculo de relaciones defensivas deben mantenerse fuera de los componentes.

### `hooks/`
Conectan React con la lógica asíncrona. Manejan `loading`, `error`, cancelación lógica de solicitudes y datos cargados.

### `components/`
Solo representan interfaz o interacción local. No deben conocer detalles innecesarios de PokéAPI.

### `pages/`
Componen las piezas grandes de la aplicación y coordinan navegación/estado de alto nivel.

## 6. Flujo de búsqueda

```text
Usuario escribe "Pykaqu"
        ↓
SearchPanel
        ↓
usePokemonSearch()
        ↓
normalización
        ↓
índice de especies + variedades
        ↓
Levenshtein
        ↓
"pikachu" como mejor coincidencia
        ↓
selección
        ↓
usePokemon("pikachu")
        ↓
Promise.all / async-await
        ↓
Pokémon + Species
        ↓
PokemonPage
```

Los errores de escritura aceptados deben seguir siendo explicables para el estudiante y no depender de una librería externa.

## 7. Flujo de una ficha

La carga inicial obtendrá únicamente los datos esenciales:

1. Pokémon/variedad actual.
2. Especie asociada.
3. Datos necesarios para el Hero y Overview básico.

Los datos más costosos se cargarán al abrir cada pestaña:

- Evolution → evolution-chain
- Locations → encounters
- Weaknesses → type endpoints
- Forms → variedades y `pokemon-form` cuando haga falta

Esto evita hacer todas las peticiones al mismo tiempo y permite demostrar **lazy loading de datos** con React.

## 8. Estado y hooks

No se usará Redux en esta etapa.

El estado se dividirá así:

- estado local en componentes para inputs y pestañas;
- hooks personalizados para operaciones asíncronas;
- estado principal de selección en `App` o la página correspondiente;
- caché en el cliente API para recursos compartidos.

Esto mantiene el proyecto apropiado para formación inicial/intermedia en React sin introducir una capa de complejidad innecesaria.

## 9. Manejo de errores

Se diferenciarán al menos:

- búsqueda vacía;
- Pokémon inexistente;
- error HTTP de PokéAPI;
- pérdida de conexión;
- recurso secundario no disponible;
- datos incompletos de una forma especial.

Una falla secundaria, por ejemplo encounters inexistentes, no debe impedir mostrar el resto de la ficha.

## 10. Formas regionales y variedades

Se conserva la corrección realizada en la versión vanilla:

- `pokemon-species` representa la especie;
- `pokemon` representa variedades con posibles cambios de tipos, stats y habilidades;
- `pokemon-form` complementa información de formas visuales o de forma.

Una variedad como `zoroark-hisui` debe:

- conservar el número nacional `#0571` de su especie;
- usar sus propios tipos Normal/Ghost;
- usar sus propias habilidades, stats, sprites y encuentros;
- recalcular sus relaciones defensivas;
- poder abrirse desde la galería de formas o mediante búsqueda directa.

## 11. Preparación para PokéLibrary

La migración no implementará toda la biblioteca en el primer paso, pero la arquitectura dejará preparada una futura navegación:

```text
PokéLibrary
├── Search
├── Pokédex Library
├── Regions
├── Locations
├── Species
└── Game Archive
```

Los futuros módulos podrán reutilizar `api/`, `utils/` y componentes comunes sin reescribir la ficha existente.

## 12. Diseño visual

Se conservará un CSS sencillo y funcional, responsive y legible. El objetivo no será crear una réplica de una Pokédex física, sino una biblioteca digital clara.

La interfaz inicial tendrá:

- encabezado del proyecto;
- panel de búsqueda/filtros;
- resultados;
- ficha Hero;
- navegación por pestañas;
- tarjetas de formas;
- tablas adaptables a móvil.

## 13. Pruebas

Las pruebas automáticas se concentrarán primero en funciones deterministas:

- normalización de nombres;
- Levenshtein;
- tolerancia de errores;
- parseo de número Pokédex;
- clasificación de formas;
- combinación de relaciones defensivas.

Además se realizará verificación manual de integración con estos casos:

- Pikachu
- `Picachu`
- `Pykaqu`
- `#25`
- Zoroark
- Zoroark Hisui
- Raichu Alola
- Charizard Mega X
- Giratina Origin
- filtro Fantasma
- filtro Legendario/Mítico

## 14. README educativo

El README final deberá incluir:

1. propósito del proyecto;
2. arquitectura React;
3. diferencias entre versión vanilla y React;
4. conceptos de React empleados;
5. conceptos de Async/Await empleados;
6. requisitos previos;
7. instalación de Node.js/npm;
8. instalación y ejecución en Windows;
9. instalación y ejecución en Linux;
10. comandos `npm install`, `npm run dev`, `npm test` y `npm run build`;
11. endpoints de PokéAPI utilizados;
12. ejercicios sugeridos para continuar aprendiendo;
13. problemas conocidos y mejoras futuras hacia PokéLibrary.

## 15. Criterios de éxito

La migración se considera correcta si:

- el proyecto arranca con `npm install` + `npm run dev`;
- las funciones de la versión vanilla continúan disponibles;
- Zoroark Hisui y otras variedades usan sus datos propios;
- el código no depende de variables globales `window.PokeAPI`, `window.PokeUI` o `window.PokeUtils`;
- los componentes no generan grandes cadenas HTML manuales;
- las solicitudes usan async/await y tienen manejo de errores visible;
- los tests principales pasan;
- `npm run build` produce una compilación válida;
- el README permite instalar y ejecutar el proyecto tanto en Windows como en Linux.

## 16. Eventos de Juego y Comparacion de Proyectos

Nosotros trabajaremos la mision y peticiones dentro del Proyecto tomando como base la Definicion del Worldre hecho en muchos videojuegos, nuestra base principal o inicial se enfoca en como se va a atrabajar las tematiacs de cada pokemon, te dejare un Link de Referencia sobre este Proyecto (https://pokedle.net/classic)

La idea es Tomar la Misma base de POkemon classic, y aumentarlo a las siguientes Genreaciones con el Apoyo de las cosas de la PokeAPI, para trabajarlo incluso que pueda Decir si es una forma Regional para ayudar en esta Busqueda.
Ademas de eso tambien tomaremos referencia de uno de los Eventos de para avanzar como la base del Worldre

Mas Adelante encotnraremos la misma Busqueda de la Pokedex Con apoyos de Ideas de la Comunidad o Guias para incluso hacer un pequeño Videojuego Inmersivo dentro de la Pagina web (Estudiar temas de guardado de Datos en el navegador y la Memoria)