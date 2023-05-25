// Variables
const buttonTeam = document.getElementById("button-team");
const teamInfo = document.getElementById("team-info");

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
const displayTeamInfo = (team) => {
  teamInfo.innerHTML = "";

  for (const pokemon of team) {
    const article = pokemonInfo(pokemon);
    teamInfo.appendChild(article);
  }
};

// Función para mostrar la información del Pokémon
const pokemonInfo = ({ id, name, types, sprites, stats }) => {
  // Creando card
  const article = document.createElement("article");
  article.classList.add("card");

  // Div frontal
  const front = document.createElement("div");
  front.classList.add("front");

  const nameElement = document.createElement("h2");
  nameElement.textContent = name;
  front.appendChild(nameElement);

  const img = document.createElement("img");
  img.src = sprites.other;
  img.alt = name;
  img.loading = "lazy";
  front.appendChild(img);

  const typesDiv = document.createElement("div");
  types.forEach((type) => {
    const typeElement = document.createElement("h3");
    typeElement.textContent = type;
    typesDiv.appendChild(typeElement);
  });
  front.appendChild(typesDiv);

  article.appendChild(front);

  // Div trasero
  const back = document.createElement("div");
  back.classList.add("back");

  const idElement = document.createElement("h2");
  idElement.textContent = `#${id}`;
  back.appendChild(idElement);

  const statsDiv = document.createElement("div");

  const hp = document.createElement("h3");
  hp.textContent = `hp ${stats.hp}`;
  statsDiv.appendChild(hp);

  const attack = document.createElement("h3");
  attack.textContent = `attack ${stats.attack}`;
  statsDiv.appendChild(attack);

  const defense = document.createElement("h3");
  defense.textContent = `defense ${stats.defense}`;
  statsDiv.appendChild(defense);

  const speAtt = document.createElement("h3");
  speAtt.textContent = `speAtt ${stats.speAtt}`;
  statsDiv.appendChild(speAtt);

  const speDef = document.createElement("h3");
  speDef.textContent = `speDef ${stats.speDef}`;
  statsDiv.appendChild(speDef);

  const speed = document.createElement("h3");
  speed.textContent = `speed ${stats.speed}`;
  statsDiv.appendChild(speed);

  back.appendChild(statsDiv);

  article.appendChild(back);

  return article;
};

// Función para obtener y mostrar el equipo Pokémon
const getRandomTeam = async () => {
  try {
    teamInfo.innerHTML = "<p>Cargando equipo Pokémon...</p>";

    const team = await getRandomTeamData();
    displayTeamInfo(team);
  } catch (error) {
    teamInfo.innerHTML = `<p>${error.message}</p>`;
  }
};
// Controllers
buttonTeam.addEventListener("click", getRandomTeam);
