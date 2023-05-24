// Variables
const searchRandomTeam = document.getElementById("search-random-team");
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
const pokemonInfo = ({ name, types, sprites }) => {
  const article = document.createElement("article");

  article.classList.add("front-info");

  const nameElement = document.createElement("h2");
  nameElement.textContent = name;
  article.appendChild(nameElement);

  const image = document.createElement("img");
  image.src = sprites.other;
  image.alt = name;
  image.loading = "lazy"; // Agregar atributo lazy loading
  article.appendChild(image);

  const div = document.createElement("div");

  types.forEach((type) => {
    const typesElement = document.createElement("p");
    typesElement.textContent = type;
    div.appendChild(typesElement);
  });

  article.appendChild(div);

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
searchRandomTeam.addEventListener("click", getRandomTeam);
