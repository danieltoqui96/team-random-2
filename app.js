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
  const ids = getRandomNumbers(1, 386, 6);
  const team = [];
  try {
    for (const id of ids) {
      const pokemon = await getPokemon(id);
      team.push(pokemon);
    }
    return team;
  } catch (error) {
    console.log("error en getRandomTeamData: ", error);
    throw new Error("No se pudo obtener el equipo Pokémon");
  }
};
// Función para obtener un Pokémon dado un número
const getPokemon = async (number) => {
  const sprite = Math.random() < 0.95 ? "front_default" : "front_shiny";
  const apiUrl = `https://pokeapi.co/api/v2/pokemon/${number}`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
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
      // ability: getAbility(data.abilities),
      nature: natures[Math.floor(Math.random() * 25)],
      moves: getMoves(data.moves),
      shiny: sprite === "front_shiny" ? true : false,
    };
    return pokemon;
  } catch (error) {
    console.log("error en getPokemon: ", error);
    throw new Error("No se pudo obtener el Pokémon");
  }
};
// Función para obtener movimientos random
const getMoves = (arr) => {
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
  // pokemon-card
  const article = document.createElement("article");
  article.classList.add("pokemon-card");
  article.appendChild(pokemonHeader(id, name, types));
  article.appendChild(pokemonBody(sprite, stats));
  article.appendChild(pokemonFooter(ability, nature, moves));
  if (shiny) article.classList.add("shiny");
  return article;
};

// Función que retorna el header del pokemon
const pokemonHeader = (id, name, types) => {
  const number = document.createElement("span");
  number.textContent = `#${id}`;

  const nameElement = document.createElement("span");
  nameElement.textContent = `${name}`;

  const div = document.createElement("div");
  div.classList.add("pokemon-types");
  types.forEach((type) => {
    const image = document.createElement("img");
    image.src = `/imgs/type/${type}.svg`;
    image.alt = type;
    div.appendChild(image);
  });

  const header = document.createElement("div");
  header.classList.add("pokemon-header");
  header.appendChild(number);
  header.appendChild(nameElement);
  header.appendChild(div);
  return header;
};

// Función que retorna el body del pokemon
const pokemonBody = (sprite, stats) => {
  const image = document.createElement("img");
  image.src = sprite;

  const imageDiv = document.createElement("div");
  imageDiv.classList.add("pokemon-image");
  imageDiv.appendChild(image);

  const statsElement = document.createElement("div");
  statsElement.classList.add("pokemon-stats");
  statsElement.appendChild(pokemonStat("PS", stats.hp));
  statsElement.appendChild(pokemonStat("Ataque", stats.attack));
  statsElement.appendChild(pokemonStat("Defensa", stats.defense));
  statsElement.appendChild(pokemonStat("At. esp", stats.speAtt));
  statsElement.appendChild(pokemonStat("Def. esp", stats.speDef));
  statsElement.appendChild(pokemonStat("Velocidad", stats.speed));
  statsElement.appendChild(pokemonStat("Total", stats.total, true));

  const body = document.createElement("div");
  body.classList.add("pokemon-body");
  body.appendChild(imageDiv);
  body.appendChild(statsElement);
  return body;
};

// Función que retorna el Stat del pokemon
const pokemonStat = (stat, value, total) => {
  const label = document.createElement("span");
  label.classList.add("stat-label");
  label.textContent = stat;

  const barValue = document.createElement("div");
  barValue.classList.add("stat-value");
  barValue.style.width = total
    ? `${(value / 680) * 100}%`
    : `${(value / 255) * 100}%`;

  barValue.classList.add(
    total ? colorChart(value / 680) : colorChart(value / 255)
  );

  const bar = document.createElement("div");
  bar.classList.add("stat-bar");
  bar.appendChild(barValue);

  const display = document.createElement("span");
  display.classList.add("stat-value-display");
  display.textContent = value;

  const container = document.createElement("div");
  container.classList.add("stat-container");
  container.appendChild(label);
  container.appendChild(bar);
  container.appendChild(display);
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
  const abilityLabel = document.createElement("span");
  abilityLabel.textContent = "Ability:";

  const abilityValue = document.createElement("span");
  abilityValue.textContent = ability;

  const abilityDiv = document.createElement("div");
  abilityDiv.classList.add("pokemon-ability");
  abilityDiv.appendChild(abilityLabel);
  abilityDiv.appendChild(abilityValue);

  const natureLabel = document.createElement("span");
  natureLabel.textContent = "Nature:";

  const natureValue = document.createElement("span");
  natureValue.textContent = nature;

  const natureElement = document.createElement("div");
  natureElement.classList.add("pokemon-nature");
  natureElement.appendChild(natureLabel);
  natureElement.appendChild(natureValue);

  const details = document.createElement("div");
  details.classList.add("pokemon-details");
  details.appendChild(abilityDiv);
  details.appendChild(natureElement);

  const movesElement = document.createElement("div");
  movesElement.classList.add("pokemon-moves");
  movesElement.appendChild(pokemonMove(moves[0]));
  movesElement.appendChild(pokemonMove(moves[1]));
  movesElement.appendChild(pokemonMove(moves[2]));
  movesElement.appendChild(pokemonMove(moves[3]));

  const footer = document.createElement("div");
  footer.classList.add("pokemon-footer");
  footer.appendChild(details);
  footer.appendChild(movesElement);
  return footer;
};

// Función que retorna los movimientos del pokemon
const pokemonMove = (move) => {
  const moveName = document.createElement("span");
  moveName.textContent = move;
  return moveName;
};

// Principal Funcion
const getRandomTeam = async () => {
  try {
    teamSection.innerHTML = "<p>Cargando equipo Pokémon...</p>";

    const team = await getRandomTeamData();
    displayTeamSection(team);
  } catch (error) {
    teamSection.innerHTML = `<p>${error.message}</p>`;
  }
};

// Controllers
buttonTeam.addEventListener("click", getRandomTeam);
