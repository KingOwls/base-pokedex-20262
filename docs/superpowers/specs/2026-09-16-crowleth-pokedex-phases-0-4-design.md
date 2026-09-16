# Crowleth Pokédex · Diseño de implementación fases 0–4

Fecha: 2026-09-16
Autor del proyecto: Jorge Luis Osorio Silva

## 1. Objetivo

Transformar la base funcional `pokelibrary-react` en **Crowleth Pokédex**, una aplicación React + Vite consumiendo PokéAPI, con identidad visual propia, navegación compartible, Pokédex nacional/regional de las generaciones I–IX, soporte de formas regionales/alternativas y cinco minijuegos funcionales de PokéArcade.

La implementación conservará la lógica útil existente (API, caché, búsqueda fuzzy, formas, evolución, relaciones de tipos y Daily) y reorganizará la experiencia alrededor del documento maestro y los assets entregados por el usuario.

## 2. Alcance cerrado de esta entrega

Esta entrega cubre las fases 0 a 4 del roadmap:

- Fase 0: sistema visual Crowleth.
- Fase 1: Pokédex core y navegación por generaciones.
- Fase 2: ficha profunda con pestañas definitivas.
- Fase 3: PokéArcade base: PokéCompare, Who’s That Pokémon?, Type Master y PokéDaily mejorado.
- Fase 4: PokéSprint con predicción, simulación, eventos y resultados.

Quedan **fuera de alcance** y no se implementarán en este ZIP:

- RPG o mundo explorable.
- captura de Pokémon.
- mapas jugables.
- mochila y técnicas de campo.
- Event Engine.
- progresión de aventura.
- cuentas/backend.

La sección Regiones será una experiencia visual y enciclopédica, no un modo RPG.

## 3. Principios del producto

1. La Pokédex debe funcionar por sí sola sin obligar al usuario a jugar.
2. La PokéAPI es la fuente central para especies, formas, tipos, stats, habilidades, evoluciones y movimientos.
3. Los assets locales tienen prioridad para identidad y pixel art; PokéAPI actúa como fallback visual cuando falte un sprite local.
4. La interfaz mantiene estructura constante entre generaciones; cambian acentos, iconos de Pokédex y ambientación.
5. Pixel art en listas/minijuegos y artwork grande en fichas.
6. Crowleth acompaña, guía y decora, pero no compite con el Pokémon consultado.
7. Responsive y accesible en escritorio y móvil.

## 4. Stack técnico

- React 18.
- Vite 5.
- React Router DOM para rutas compartibles.
- JavaScript ES Modules.
- CSS global con design tokens y módulos de clase por componente/página cuando ayude a mantener orden.
- Fetch API nativa.
- PokéAPI REST v2.
- localStorage para caché ligera y progreso/records de minijuegos.
- Vitest para motores y utilidades deterministas.

No se añadirá backend ni gestión de estado global compleja.

## 5. Navegación y rutas

```text
/
├── /pokedex
│   ├── /pokedex/kanto
│   ├── /pokedex/johto
│   ├── /pokedex/hoenn
│   ├── /pokedex/sinnoh
│   ├── /pokedex/unova
│   ├── /pokedex/kalos
│   ├── /pokedex/alola
│   ├── /pokedex/galar
│   ├── /pokedex/hisui
│   ├── /pokedex/paldea
│   ├── /pokedex/national
│   └── /pokedex/:pokemon
├── /regions
│   └── /regions/:region
├── /arcade
│   ├── /arcade/daily
│   ├── /arcade/compare
│   ├── /arcade/whos-that
│   ├── /arcade/type-master
│   └── /arcade/sprint
└── /daily -> acceso directo a PokéDaily
```

La navegación debe funcionar con enlaces reales y permitir refrescar/copiar URLs sin perder la pantalla actual.

## 6. Sistema visual Crowleth

### 6.1 Paleta base

- Base oscura: `#161D22`.
- Crema: `#F5F0E5`.
- Marrón óxido: `#A54D34`.
- Dorado: `#D6A43E`.
- Oliva: `#66784B`.
- Turquesa: `#4A8C87`.
- Colores de tipo Pokémon como acentos contextuales.

### 6.2 Assets principales

Se integrarán desde `public/assets/`:

- `wallpaper.png`: portada/fondo principal.
- `Crowleth_Pokedex.png`: identidad/logo.
- `Crowleth_PokedexTitle.png`: referencia/hero cuando encaje.
- `CrowlethBase.png`: mascota independiente.
- `Notas_Crowleth.png`: consejos, tutoriales, estados.
- `Creado_Por.png`: ornamento botánico/footer.
- `Poke01.jpg` a `Poke09.jpg` y `PokeHisui.jpg`: iconos/representaciones de Pokédex por generación.
- `Pokemon.png`, `PokeDaily.png`, `PokeCompare.png`, `WhoIsThat.png`, `TypeMaster.png`, `PokeSprint.png`: referencias visuales, no fondos colocados literalmente sobre la UI salvo que una sección decorativa lo justifique.
- sprites locales numerados en `crowleth-assets/pokedex/`.
- sprites de carrera en `crowleth-assets/pokesprint/`.

### 6.3 Interfaz común

Componentes compartidos:

- `AppShell`.
- `CrowlethHeader`.
- `GlobalSearch`.
- `Panel`.
- `TypeBadge`.
- `GenerationBadge`.
- `CrowlethNote`.
- `LoadingState` / `ErrorState` / `EmptyState`.
- `PixelPokemonSprite` con fallback a PokéAPI.
- `PokemonArtwork`.

Las transiciones de hover/cambio de pestaña se mantendrán aproximadamente entre 200 y 400 ms y se respetará `prefers-reduced-motion`.

## 7. Inicio

La pantalla inicial será un portal visual, no un dashboard administrativo.

Cuatro accesos principales:

1. **Pokédex**: “Explora todas las especies”.
2. **Regiones**: “Descubre cada región”.
3. **PokéArcade**: “Aprende jugando”.
4. **Daily**: “Un Pokémon cada día”.

El wallpaper y la marca Crowleth forman la ambientación. Cada acceso se representa como tarjeta grande con interacción visual clara y navegación real.

## 8. Biblioteca de Pokédex

### 8.1 Generaciones y regiones incluidas

La entrega deja de limitarse a las generaciones I–V. La Pokédex cubrirá **todas las generaciones principales I–IX**, además de una vista regional especial para Hisui:

- Kanto / Generación I.
- Johto / Generación II.
- Hoenn / Generación III.
- Sinnoh / Generación IV.
- Unova / Generación V.
- Kalos / Generación VI.
- Alola / Generación VII.
- Galar / Generación VIII.
- Hisui / archivo regional de Generación VIII.
- Paldea / Generación IX.
- Nacional #001-1025 como columna vertebral de especies base.

Hisui se trata como una Pokédex/región especial dentro de la era de Generación VIII, no como una generación independiente. La vista Nacional incluye las especies base hasta la Generación IX; las formas regionales y alternativas se vinculan a su especie nacional correspondiente y no crean números nacionales duplicados.

El paquete de sprites local declara cobertura hasta el #1025. Cuando un número o una forma concreta no tenga sprite local utilizable, la interfaz usa el sprite/artwork disponible en PokéAPI como fallback para evitar huecos visuales.

### 8.2 Selector de generación

No se usará un `<select>` genérico como navegación principal. Se crearán tarjetas/volúmenes con:

- imagen de Pokédex de la generación;
- región;
- generación;
- rango/cantidad de especies;
- color/acento propio.

Los assets `Poke01.jpg` a `Poke09.jpg` representan las nueve generaciones. `PokeHisui.jpg` se usa para la vista regional especial de Hisui.

### 8.3 Navegador regional

En escritorio:

- lateral izquierdo fijo dentro de la vista;
- lista vertical con sprite pixel, número y nombre;
- búsqueda/filtro arriba;
- selección visible;
- selector de región/generación abajo.

En móvil:

- la lista pasa a drawer/panel colapsable o selector horizontal manteniendo acceso inmediato.

La posición de scroll del listado se conserva al cambiar de Pokémon dentro de la misma Pokédex.


### 8.4 Cobertura de formas y variantes

La Pokédex debe reconocer y mostrar, cuando PokéAPI disponga de datos consistentes:

- formas de Alola;
- formas de Galar;
- formas de Hisui;
- formas de Paldea;
- Mega Evoluciones;
- Gigamax;
- diferencias de forma relevantes por especie;
- otras variedades oficiales expuestas por PokéAPI.

Las formas se presentan como variantes de la especie y comparten su contexto nacional. El selector de forma debe actualizar sprite/artwork, tipos, estadísticas y habilidades sin obligar al usuario a abandonar la ficha.

## 9. Ficha detallada de Pokémon

La ficha combina densidad Black/White con composición amplia inspirada en Legends: Arceus.

### 9.1 Cabecera de ficha

Muestra de inmediato:

- número nacional;
- nombre;
- tipos;
- generación;
- artwork principal;
- selector Normal/Shiny;
- selector de forma cuando existan variedades;
- anterior/siguiente.

### 9.2 Pestañas definitivas

1. **Resumen**
   - categoría;
   - altura;
   - peso;
   - género cuando PokéAPI lo permita;
   - habilidades y habilidad oculta;
   - descripción Pokédex;
   - tipos.

2. **Estadísticas**
   - HP, Attack, Defense, Sp. Atk, Sp. Def, Speed;
   - BST total;
   - barras/gráfico legible.

3. **Evolución**
   - árbol evolutivo;
   - bifurcaciones;
   - condiciones humanizadas.

4. **Formas**
   - base;
   - regionales;
   - Mega/Gigamax/alternativas cuando PokéAPI las relacione;
   - selector que actualiza la ficha sin perder contexto.

5. **Defensas**
   - 4x, 2x, 1x, 0.5x, 0.25x y 0x;
   - motor compartido con Type Master;
   - modificadores de habilidades defensivas soportadas cuando sean relevantes.

6. **Movimientos**
   - reemplaza Locations en la navegación principal;
   - lista compacta de movimientos;
   - filtro por método de aprendizaje cuando los datos de PokéAPI lo permitan;
   - detalle con tipo, clase, potencia, precisión, PP y efecto/descripción disponible.

Las ubicaciones existentes no se eliminan de la capa API, pero no forman parte de las seis pestañas principales.

## 10. Búsqueda y filtros

Se conserva y adapta:

- búsqueda por nombre;
- número y `#numero`;
- fuzzy search;
- consultas naturales de formas (`Raichu Alola`, `Zoroark Hisui`, `Tauros Paldea`, etc.);
- filtros por tipo;
- Legendario/Mítico;
- sugerencias antes de abrir ficha.

La búsqueda global permanece accesible desde la navegación principal.

## 11. PokéArcade

La portada de Arcade muestra cinco tarjetas jugables con identidad común Crowleth/terminal oscuro.

Todos los juegos:

- usan como conjunto principal la Pokédex Nacional #001-1025, con formas regionales/alternativas elegibles cuando el modo y la dificultad lo permitan;
- reutilizan datos/caché;
- guardan récords en localStorage;
- explican el resultado de cada ronda;
- son jugables sin tutorial largo;
- funcionan con teclado y ratón/touch.

### 11.1 PokéDaily

Dos modos:

**Daily**
- un objetivo determinista por fecha;
- persistencia diaria;
- pistas comparativas;
- máximo configurable según diseño final, manteniendo claridad del reto.

**Racha**
- máximo 5 intentos por objetivo;
- al acertar genera otro;
- la racha termina al fallar;
- guarda mejor racha.

Pistas:

- número nacional: mayor/menor/exacto;
- generación;
- tipo primario;
- tipo secundario;
- altura;
- peso;
- Legendario/Mítico;
- forma;
- etapa evolutiva cuando pueda calcularse de forma consistente.

Feedback: verde exacto, amarillo parcial, rojo incorrecto y flechas ↑/↓.

### 11.2 PokéCompare

Cada ronda:

- selecciona dos Pokémon distintos;
- selecciona una categoría;
- usuario elige cuál tiene mayor valor;
- revela los dos valores;
- explica el resultado;
- incrementa racha o finaliza ronda.

Categorías MVP:

- número nacional;
- HP;
- Attack;
- Defense;
- Sp. Atk;
- Sp. Def;
- Speed;
- BST;
- altura;
- peso.

Persistencia: mejor racha.

### 11.3 Who’s That Pokémon?

Se selecciona una especie y se presenta la imagen en etapas generadas en CSS/canvas según necesidad:

1. silueta negra;
2. pixelado extremo;
3. pixelado medio/con color parcial;
4. blur/parcial;
5. artwork casi completo;
6. revelación final.

Cada pista reduce la puntuación. El usuario puede responder en cualquier etapa.

Dificultades:

- Fácil: conjunto reconocible/base.
- Normal: especies base de la Pokédex Nacional #001-1025.
- Difícil: incluye formas regionales de Alola, Galar, Hisui y Paldea cuando estén disponibles.
- Experto: incluye Mega, Gigamax y otras variantes/alternativas visualmente similares disponibles en PokéAPI y/o en los assets locales.

La revelación final incluye nombre y enlace a la ficha.

### 11.4 Type Master

El juego muestra el perfil defensivo completo sin revelar el tipo directamente:

- 4x;
- 2x;
- 1x;
- 0.5x;
- 0.25x;
- 0x.

El motor usa la misma utilidad de relaciones defensivas que la ficha.

Habilidades defensivas soportadas en MVP:

- Levitate;
- Water Absorb;
- Volt Absorb;
- Flash Fire;
- Sap Sipper;
- Storm Drain;
- Lightning Rod;
- Thick Fat;
- Wonder Guard.

Cuando el perfil sea compartido por varias especies se añade una pista complementaria, priorizando generación o habilidad relevante, para evitar respuestas arbitrarias.

### 11.5 PokéSprint

Roster inicial de 12 corredores:

- Jolteon;
- Ninjask;
- Rapidash;
- Infernape;
- Blaziken;
- Regigigas;
- Garchomp;
- Arcanine;
- Krookodile;
- Snorlax;
- Blastoise;
- Emolga.

Cada carrera:

1. selecciona 5 o 6 corredores;
2. muestra perfiles resumidos;
3. usuario predice Top 3;
4. ejecuta simulación visual lateral;
5. registra eventos;
6. muestra podio y precisión de predicción.

Factores del motor:

- Speed: máximo potencial basado principalmente en stat de Velocidad.
- Acceleration: rapidez de llegada al ritmo máximo.
- Stamina: pérdida de ritmo al final.
- Consistency: probabilidad/magnitud de eventos negativos.
- Ability: modificadores especiales definidos para el roster cuando corresponda.
- Race Events: excelente/mala salida, tropiezo, acelerón, fatiga, segundo aire y ritmo perfecto.

Balance objetivo: aproximadamente 70 % conocimiento / 30 % incertidumbre. Los eventos modifican la carrera, pero no convierten de forma sistemática a corredores lentos en favoritos.

El motor será determinista bajo seed para pruebas.

Los sprites locales `Idle`, `Walk`, `Hurt`, `Hop` y `Charge` se usarán según evento/estado.

## 12. Datos y assets

### 12.1 Modelo común de Pokémon

La capa API expondrá un modelo normalizado usado por ficha y juegos:

```js
{
  id,
  name,
  displayName,
  speciesName,
  generation,
  types,
  height,
  weight,
  abilities,
  stats,
  isLegendary,
  isMythical,
  variety,
  artwork,
  shinyArtwork,
  localPixelSprite,
  apiPixelSprite
}
```

### 12.2 Resolución de sprites

`getLocalPokemonSprite(id, form)`:

1. si existe un mapeo local específico para la forma, usa primero ese asset;
2. para la especie base intenta `/assets/pokedex/####/idle_right.gif`;
3. si falla, intenta `/assets/pokedex/####/idle_right.png`;
4. para formas regionales/alternativas sin asset local, usa el sprite correspondiente de PokéAPI;
5. si tampoco existe, usa el artwork disponible de PokéAPI;
6. como último recurso muestra placeholder Crowleth/Poké Ball.

Esto permite cubrir generaciones I–IX y formas regionales sin romper la interfaz por faltantes del paquete local.

## 13. Arquitectura de carpetas objetivo

```text
src/
├── api/
│   ├── httpClient.js
│   └── pokeApi.js
├── components/
│   ├── common/
│   ├── layout/
│   ├── pokedex/
│   ├── pokemon/
│   └── arcade/
├── data/
│   ├── generations.js
│   ├── defensiveAbilities.js
│   └── sprintRoster.js
├── hooks/
├── pages/
│   ├── LandingPage.jsx
│   ├── PokedexLibraryPage.jsx
│   ├── PokedexPage.jsx
│   ├── RegionsPage.jsx
│   ├── ArcadePage.jsx
│   └── arcade/
├── routes/
│   └── AppRoutes.jsx
├── theme/
│   ├── tokens.css
│   └── generationThemes.js
└── utils/
    ├── pokemonUtils.js
    ├── fuzzySearch.js
    ├── typeRelations.js
    ├── dailyGame.js
    ├── compareGame.js
    ├── whosThatGame.js
    ├── typeMaster.js
    └── raceEngine.js
```

## 14. Manejo de errores

La UI distingue:

- sin conexión;
- error HTTP PokéAPI;
- Pokémon inexistente;
- datos secundarios incompletos;
- asset local inexistente;
- movimiento sin descripción/efecto;
- variedad con datos incompletos.

Una falla secundaria nunca debe impedir renderizar la ficha básica.

Los estados de carga/error usarán componentes Crowleth cuando sea apropiado.

## 15. Persistencia local

Claves versionadas en localStorage para evitar colisiones:

- caché de PokéAPI existente;
- progreso PokéDaily;
- mejor racha Daily competitivo;
- mejor racha PokéCompare;
- estadísticas de Who’s That;
- estadísticas Type Master;
- récords/predicciones PokéSprint.

No habrá economía ni desbloqueos obligatorios.

## 16. Accesibilidad y responsive

- foco visible;
- botones y tabs navegables por teclado;
- Enter/Espacio para acciones principales;
- flechas para anterior/siguiente en Pokédex cuando no interfieran con inputs;
- contraste suficiente;
- `aria-label` donde un icono no tenga texto;
- `prefers-reduced-motion` desactiva o reduce animaciones no esenciales;
- layouts adaptables a móvil sin imitar doble pantalla DS.

## 17. Pruebas

### Unitarias

- fuzzy search y normalización existentes;
- relaciones de tipos;
- selección Daily determinista;
- comparación de pistas Daily;
- categorías/resultados Compare;
- etapas/puntuación Who’s That;
- perfiles Type Master;
- habilidades defensivas soportadas;
- raceEngine con seed reproducible;
- scoring Top 3 PokéSprint;
- resolución de generación/rangos I–IX y asociación de formas regionales.

### Integración manual

Casos mínimos:

- Pikachu / `#25` / `Picachu`;
- Gengar;
- Zoroark Hisui;
- Raichu Alola;
- Tauros Paldea;
- Meowth Galar;
- Charizard Mega X;
- evolución con bifurcación;
- Pokémon mono y doble tipo;
- Normal/Shiny;
- cambio Kanto -> Kalos -> Alola -> Galar -> Hisui -> Paldea -> Nacional;
- cada uno de los cinco minijuegos;
- responsive móvil/escritorio;
- recarga directa de URL compartible.

## 18. README y entrega

El README final debe contener, como mínimo:

```md
# Crowleth Pokédex

Autor: Jorge Luis Osorio Silva

GitHub Pages: <URL cuando se despliegue>
```

También documentará:

- descripción;
- features;
- stack;
- estructura;
- instalación Windows/Linux;
- ejecución `npm install` + `npm run dev`;
- pruebas;
- build;
- despliegue GitHub Pages;
- fuente de datos PokéAPI;
- notas sobre assets/licencias a revisar antes de publicación pública.

El `vite.config.js` quedará preparado para poder configurar el `base` requerido por GitHub Pages cuando se conozca el nombre definitivo del repositorio.

## 19. Criterios de aceptación de esta entrega

La entrega se considera funcional cuando:

1. `npm install`, `npm test` y `npm run build` funcionan.
2. Inicio presenta las cuatro rutas principales con identidad Crowleth.
3. Kanto, Johto, Hoenn, Sinnoh, Unova, Kalos, Alola, Galar, Hisui, Paldea y Nacional son navegables visualmente.
4. Nacional cubre #001-1025 y las generaciones I–IX; las formas regionales/alternativas están vinculadas a su especie base y son consultables cuando PokéAPI las expone.
5. La ficha muestra las seis pestañas: Resumen, Estadísticas, Evolución, Formas, Defensas y Movimientos.
6. Normal/Shiny comparte el mismo espacio visual.
7. Búsqueda por nombre/número/fuzzy/formas sigue funcionando.
8. PokéDaily funciona en Daily y modo Racha.
9. PokéCompare es jugable y explica resultados.
10. Who’s That aplica progresión visual y puntuación.
11. Type Master genera perfiles defensivos correctos y evita ambigüedades sin pista.
12. PokéSprint usa los 12 corredores, predicción Top 3, carrera animada, eventos y resultados.
13. Las rutas son compartibles y sobreviven al refresh en desarrollo/build estático configurado.
14. La interfaz es usable en móvil y escritorio.
15. README incluye `Jorge Luis Osorio Silva` y espacio para GitHub Pages.
16. No existe ninguna dependencia funcional del RPG, captura o mundo explorable.

## 20. Entregable

Se generará un ZIP del proyecto React completo, excluyendo `node_modules`, pero incluyendo:

- fuente React;
- assets integrados;
- pruebas;
- README;
- documentación de diseño/plan;
- configuración Vite;
- archivos necesarios para ejecutar y construir localmente.
