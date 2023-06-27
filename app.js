// Variables
const buttonTeam = document.getElementById("button-team");
const teamSection = document.getElementById("team-section");

const natures = [
  "Hasty",
  "Gentle",
  "Lax",
  "Quiet",
  "Relaxed",
  "Mild",
  "Brave",
  "Hardy",
  "Timid",
  "Quirky",
  "Impish",
  "Careful",
  "Sassy",
  "Modest",
  "Calm",
  "Jolly",
  "Docile",
  "Lonely",
  "Bold",
  "Serious",
  "Rash",
  "Adamant",
  "Naive",
  "Naughty",
  "Bashful",
];

let count = 0;

// Funtions para extraer Data de Team

// Función para obtener números al azar no repetidos
const getRandomNumbers = (min, max, length) => {
  const numbers = new Set();
  while (numbers.size < length) {
    let randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    if (length === 6 && randomNum === 386) {
      const deoxys = [386, 10001, 10002, 10003];
      const index = Math.floor(Math.random() * deoxys.length);
      randomNum = deoxys[index];
    }
    numbers.add(randomNum);
  }
  return Array.from(numbers);
};

// Función para obtener seis Pokémon random
const getRandomTeamData = async () => {
  console.log(`\nBuscando Team ${++count}`);
  const ids = getRandomNumbers(1, 395, 6);
  const team = [];
  try {
    for (const id of ids) {
      const pokemon = await getPokemon(id);
      team.push(pokemon);
    }
    return team;
  } catch (error) {
    throw new Error("Falla al obtener Team", error);
  }
};

// Función para obtener un Pokémon dado un número
const getPokemon = async (number) => {
  const apiUrl = `https://pokeapi.co/api/v2/pokemon/${number}`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const isShiny = chooseWithProbability(0.05);
    const sprite = isShiny ? "front_shiny" : "front_default";
    const pokemon = {
      id: data.id,
      name: data.name,
      types: data.types.map((type) => type.type.name),
      sprite: data.sprites.other.home[sprite],
      stats: {
        hp: data.stats[0].base_stat,
        attack: data.stats[1].base_stat,
        defense: data.stats[2].base_stat,
        speAtt: data.stats[3].base_stat,
        speDef: data.stats[4].base_stat,
        speed: data.stats[5].base_stat,
        total: data.stats.reduce((acc, stat) => acc + stat.base_stat, 0),
      },
      ability:
        data.abilities[Math.floor(Math.random() * data.abilities.length)]
          .ability.name,
      nature: natures[Math.floor(Math.random() * 25)],
      moves: getMoves(data.moves),
      shiny: isShiny,
    };
    console.log(`Pokémon #${number}: ${pokemon.name}`);
    return pokemon;
  } catch (error) {
    console.log(`Falla en Pokémon #${number}`);
    throw new Error(`Error en llamada Pokémon #${number}`, error);
  }
};
const chooseWithProbability = (probability) => {
  return Math.random() < probability;
};

const getMoves = (arr) => {
  if (arr.length < 4) {
    return arr.map((move) => move.move.name);
  }
  const ids = getRandomNumbers(0, arr.length - 1, 4);
  const moves = [];
  for (const id of ids) {
    const move = arr[id].move.name;
    moves.push(move);
  }
  return moves;
};

// Funtions para integrar data

// Función para mostrar la información del Equipo Pokémon
const displayTeamSection = (team) => {
  teamSection.innerHTML = "";
  for (const pokemon of team) {
    const article = pokemonInfo(pokemon);
    teamSection.appendChild(article);
  }
};

// Función para mostrar la información del Pokémon
const pokemonInfo = ({
  id,
  name,
  types,
  sprite,
  stats,
  ability,
  nature,
  moves,
  shiny,
}) => {
  const header = pokemonHeader(id, name, types, shiny);
  const body = pokemonBody(sprite, stats);
  const footer = pokemonFooter(ability, nature, moves);

  const article = createDiv([header, body, footer], "pokemon-card");
  if (shiny) article.classList.add("shiny");
  return article;
};

// Función que retorna el header del pokemon
const pokemonHeader = (id, name, types, shiny) => {
  const number = createSpan(`#${id}`);
  const nameElement = createSpan(name);

  const div = document.createElement("div");
  div.classList.add("pokemon-types");
  if (shiny) {
    const imgShiny = document.createElement("img");
    imgShiny.src = "./imgs/shiny.svg";
    imgShiny.classList.add("icon-shiny");
    div.appendChild(imgShiny);
  }

  types.forEach((type) => {
    const image = document.createElement("img");
    image.src = `/imgs/type/${type}.svg`;
    div.appendChild(image);
  });

  const header = createDiv([number, nameElement, div], "pokemon-header");
  return header;
};

// Función que retorna el body del pokemon
const pokemonBody = (sprite, stats) => {
  const image = document.createElement("img");
  image.src = sprite;

  const imageDiv = createDiv([image], "pokemon-image");

  const statsElement = createDiv(
    [
      pokemonStat("PS", stats.hp),
      pokemonStat("Attack", stats.attack),
      pokemonStat("Defense", stats.defense),
      pokemonStat("Spe. Att", stats.speAtt),
      pokemonStat("Spe. Def", stats.speDef),
      pokemonStat("Speed", stats.speed),
      pokemonStat("Total", stats.total, true),
    ],
    "pokemon-stats"
  );

  const body = createDiv([imageDiv, statsElement], "pokemon-body");

  return body;
};

// Función que retorna el Stat del pokemon
const pokemonStat = (stat, value, total) => {
  const barValue = createDiv([], "stat-value");
  barValue.style.width = total
    ? `${(value / 680) * 100}%`
    : `${(value / 255) * 100}%`;

  barValue.classList.add(
    total ? colorChart(value / 680) : colorChart(value / 255)
  );

  const bar = createDiv([barValue], "stat-bar");

  const container = createDiv(
    [
      createSpan(stat, "stat-label"),
      bar,
      createSpan(value, "stat-value-display"),
    ],
    "stat-container"
  );

  return container;
};

// Función que retorna el color de la barra de stat
const colorChart = (value) => {
  if (value < 1 / 6) {
    return "color1";
  }
  if (value < 2 / 6) {
    return "color2";
  }
  if (value < 3 / 6) {
    return "color3";
  }
  if (value < 4 / 6) {
    return "color4";
  }
  if (value < 5 / 6) {
    return "color5";
  }
  if (value <= 6 / 6) {
    return "color6";
  }
};

// Función que retorna el footer del pokemon
const pokemonFooter = (ability, nature, moves) => {
  const abilityElement = createDiv(
    [createSpan("Ability:"), createSpan(ability)],
    "pokemon-ability"
  );
  const natureElement = createDiv(
    [createSpan("Nature:"), createSpan(nature)],
    "pokemon-nature"
  );
  const details = createDiv([abilityElement, natureElement], "pokemon-details");

  const label = createSpan("Moves:", "moves-label");

  const moveElements = moves.map((move) => createSpan(move));
  const container = createDiv([...moveElements], "moves-container");

  const movesElement = createDiv([label, container], "pokemon-moves");

  const footer = createDiv([details, movesElement], "pokemon-footer");

  return footer;
};

// Función que retorna un div con sus hijos
const createDiv = (children = [], className = null) => {
  const div = document.createElement("div");
  children.forEach((child) => div.appendChild(child));
  if (className) {
    div.classList.add(className);
  }
  return div;
};

// Función que retorna un span con texto
const createSpan = (text, className = null) => {
  const span = document.createElement("span");
  span.textContent = text;
  if (className) {
    span.classList.add(className);
  }
  return span;
};

// Principal Funcion
const getRandomTeam = async () => {
  try {
    teamSection.innerHTML = `<span class="loader"></span>`;

    const timeout = 5000; // 10 segundos
    const timer = setTimeout(() => {
      throw new Error(
        "La PokeAPI ha tardado demasiado en responder. Por favor, inténtalo de nuevo más tarde."
      );
    }, timeout);

    const team = await getRandomTeamData();

    clearTimeout(timer);

    displayTeamSection(team);
  } catch (error) {
    teamSection.innerHTML = `<p>${error.message}</p>`;
  }
};

// Controllers
buttonTeam.addEventListener("click", getRandomTeam);
