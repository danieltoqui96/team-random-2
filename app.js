// Variables
const buttonTeam = document.getElementById("button-team");
const teamSection = document.getElementById("team-section");

// Funtions

// Función para obtener seis números al azar no repetidos
const getRandomNumbers = (min, max) => {
  const numbers = new Set();

  while (numbers.size < 6) {
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    numbers.add(randomNum);
  }

  return Array.from(numbers);
};

// Función para obtener un Pokémon dado un número
const getPokemon = async (number) => {
  try {
    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${number}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    const pokemon = {
      id: data.id,
      name: data.name,
      types: data.types.map((type) => type.type.name),
      sprites: {
        other: data.sprites.other.dream_world.front_default,
        home: data.sprites.other.home.front_default,
        official: data.sprites.other["official-artwork"].front_default,
      },
      stats: {
        hp: data.stats[0].base_stat,
        attack: data.stats[1].base_stat,
        defense: data.stats[2].base_stat,
        speAtt: data.stats[3].base_stat,
        speDef: data.stats[4].base_stat,
        speed: data.stats[5].base_stat,
      },
    };

    return pokemon;
  } catch (error) {
    console.log("error en getPokemon: ", error);
    throw new Error("No se pudo obtener el Pokémon");
  }
};

// Función para obtener seis Pokémon random
const getRandomTeamData = async () => {
  try {
    const ids = getRandomNumbers(1, 386);
    const team = [];

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

// Función para mostrar la información del Equipo Pokémon
const displayTeamSection = (team) => {
  teamSection.innerHTML = "";

  for (const pokemon of team) {
    const article = pokemonInfo(pokemon);
    teamSection.appendChild(article);
  }
};

// Función que retorna el header del pokemon
const pokemonHeader = (id, name, types) => {
  // id
  const number = document.createElement("span");
  number.textContent = `#${id}`;
  // name
  const nameElement = document.createElement("span");
  nameElement.textContent = `${name}`;
  // types
  const div = document.createElement("div");
  div.classList.add("pokemon-types");
  types.forEach((type) => {
    const image = document.createElement("img");
    image.src = `/imgs/type/${type}.svg`;
    image.alt = type;
    div.appendChild(image);
  });
  // header
  const header = document.createElement("div");
  header.classList.add("pokemon-header");
  header.appendChild(number);
  header.appendChild(nameElement);
  header.appendChild(div);
  return header;
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
    : `${(value / 260) * 100}%`;

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

// Función que retorna el body del pokemon
const pokemonBody = () => {
  // image
  const image = document.createElement("img");
  image.src = `./imgs/Dragonite.svg`;
  image.alt = `dragonite`;

  const imageDiv = document.createElement("div");
  imageDiv.classList.add("pokemon-image");
  imageDiv.appendChild(image);

  // stats
  const stats = document.createElement("div");
  stats.classList.add("pokemon-stats");
  stats.appendChild(pokemonStat("PS", 91));
  stats.appendChild(pokemonStat("Ataque", 134));
  stats.appendChild(pokemonStat("Defensa", 95));
  stats.appendChild(pokemonStat("At. esp", 100));
  stats.appendChild(pokemonStat("Def. esp", 100));
  stats.appendChild(pokemonStat("Velocidad", 100));
  stats.appendChild(pokemonStat("Total", 600, true));

  const body = document.createElement("div");
  body.classList.add("pokemon-body");
  body.appendChild(imageDiv);
  body.appendChild(stats);
  return body;
};

// Función que retorna los movimientos del pokemon
const pokemonMove = (name) => {
  const moveName = document.createElement("span");
  moveName.textContent = name;

  const type = document.createElement("img");
  type.src = `/imgs/type/normal.svg`;
  type.alt = "normal";

  const category = document.createElement("img");
  category.src = "./imgs/move/fisico.png";
  category.alt = "fisico";

  const move = document.createElement("div");
  move.classList.add("pokemon-move");
  move.appendChild(moveName);
  move.appendChild(type);
  move.appendChild(category);
  return move;
};

// Función que retorna el footer del pokemon
const pokemonFooter = () => {
  // ability
  const abilityLabel = document.createElement("span");
  abilityLabel.textContent = "Habilidad:";

  const abilityValue = document.createElement("span");
  abilityValue.textContent = `Multiescamas`;

  const ability = document.createElement("div");
  ability.classList.add("pokemon-ability");
  ability.appendChild(abilityLabel);
  ability.appendChild(abilityValue);

  // nature
  const natureLabel = document.createElement("span");
  natureLabel.textContent = "Naturaleza:";

  const natureValue = document.createElement("span");
  natureValue.textContent = `Fuerte`;

  const nature = document.createElement("div");
  nature.classList.add("pokemon-nature");
  nature.appendChild(natureLabel);
  nature.appendChild(natureValue);

  // details
  const details = document.createElement("div");
  details.classList.add("pokemon-details");
  details.appendChild(ability);
  details.appendChild(nature);

  // moves
  const moves = document.createElement("div");
  moves.classList.add("pokemon-moves");
  moves.appendChild(pokemonMove("ultra puño"));
  moves.appendChild(pokemonMove("danza dragon"));
  moves.appendChild(pokemonMove("terremoto"));
  moves.appendChild(pokemonMove("velocidad extrema"));

  // footer
  const footer = document.createElement("div");
  footer.classList.add("pokemon-footer");
  footer.appendChild(details);
  footer.appendChild(moves);
  return footer;
};

// Función para mostrar la información del Pokémon
const pokemonInfo = ({ id, name, types, sprites, stats }) => {
  // pokemon-card
  const article = document.createElement("article");
  article.classList.add("pokemon-card");
  article.appendChild(pokemonHeader(id, name, types));
  article.appendChild(pokemonBody());
  article.appendChild(pokemonFooter());
  return article;
};

// Función para obtener y mostrar el equipo Pokémon
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
