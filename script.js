// Variables
const randomButton = document.getElementById("random-button");
const teamSection = document.getElementById("team");

randomButton.addEventListener("click", async () => {
  teamSection.innerHTML = "";
  // Loader
  const loaderCont = document.createElement("div");
  const loaderImg = document.createElement("img");

  loaderImg.src = "./img/ball.png";

  loaderImg.classList.add("loader");
  loaderCont.classList.add("loader-container");

  loaderCont.appendChild(loaderImg);
  teamSection.appendChild(loaderCont);

  // Obteniendo ids
  const numbers = new Set();
  const min = 1;
  const max = 384;
  while (numbers.size < 6) {
    const number = Math.floor(Math.random() * (max - min + 1)) + min;
    numbers.add(number);
  }
  const ids = Array.from(numbers);

  // LLamada a api
  const pokeTeam = await Promise.all(
    ids.map(async (id) => {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const data = await res.json();

      // probabilidad de shiny
      const shiny = Math.random() < 0.2;
      const sprite = shiny ? "front_shiny" : "front_default";

      // objeto pokemon
      const poke = {
        id: data.id,
        name: data.name,
        types: data.types.map((type) => type.type.name),
        sprite: data.sprites.other.home[sprite],
        shiny: shiny,
        stats: {
          hp: data.stats[0].base_stat,
          attack: data.stats[1].base_stat,
          defense: data.stats[2].base_stat,
          speAtt: data.stats[3].base_stat,
          speDef: data.stats[4].base_stat,
          speed: data.stats[5].base_stat,
          total: data.stats.reduce((acc, stat) => acc + stat.base_stat, 0),
        },
        ability: await getAbility(data.abilities),
        nature: natures[Math.floor(Math.random() * 25)],
        moves: await getMoves(data.moves),
      };

      return poke;
    })
  );

  displayTeam(pokeTeam);
});

const displayTeam = (team) => {
  teamSection.innerHTML = "";
  console.log(team);

  for (const poke of team) {
    const card = document.createElement("div");
    card.classList.add("pokemon-card");

    // header
    const header = document.createElement("div");
    const headerSpan = document.createElement("span");
    const headerH2 = document.createElement("h2");
    const headerTypes = document.createElement("div");

    headerSpan.textContent = `#${poke.id}`;
    headerH2.textContent = poke.name;

    // shiny
    if (poke.shiny) {
      const iconShiny = document.createElement("img");
      iconShiny.src = "./img/shiny.svg";
      iconShiny.classList.add("icon-shiny");
      headerTypes.appendChild(iconShiny);
    }
    poke.types.forEach((type) => {
      const img = document.createElement("img");
      img.src = `/img/type/${type}.svg`;
      headerTypes.appendChild(img);
    });

    header.classList.add("pokemon-header");
    headerTypes.classList.add("pokemon-types");

    header.appendChild(headerSpan);
    header.appendChild(headerH2);
    header.appendChild(headerTypes);

    card.appendChild(header);

    // Imagen y gráfico
    const imgChartCont = document.createElement("div");
    const imgCont = document.createElement("div");
    const imgSprite = document.createElement("img");
    const chartCon = document.createElement("div");
    const canvas = document.createElement("canvas");

    imgSprite.src = poke.sprite;
    chartjs(canvas, poke.stats);

    imgChartCont.classList.add("pokemon-img-chart-container");
    imgCont.classList.add("pokemon-img-container");
    chartCon.classList.add("pokemon-chart-container");

    imgCont.appendChild(imgSprite);
    chartCon.appendChild(canvas);
    imgChartCont.appendChild(imgCont);
    imgChartCont.appendChild(chartCon);

    card.appendChild(imgChartCont);

    // Habilidad y naturaleza
    const infoCont = document.createElement("div");
    const abySpan = document.createElement("span");
    const natSpan = document.createElement("span");

    abySpan.textContent = `Habilidad: ${poke.ability.nameEs}`;
    natSpan.textContent = `Naturaleza: ${poke.nature.nameEs}`;

    infoCont.classList.add("pokemon-info-container");

    infoCont.appendChild(abySpan);
    infoCont.appendChild(natSpan);

    card.appendChild(infoCont);

    // Ataques
    const moves = document.createElement("div");
    poke.moves.forEach((move) => {
      const moveCont = document.createElement("div");
      const span = document.createElement("span");
      const imgType = document.createElement("img");
      const powerCont = document.createElement("div");
      const powerImg = document.createElement("img");
      const powerSpan = document.createElement("span");

      const accuCont = document.createElement("div");
      const accuImg = document.createElement("img");
      const accuSpan = document.createElement("span");
      // const

      span.textContent = move.nameEs ? move.nameEs : move.nameUs;
      imgType.src = `../img/type/${move.type}.svg`;
      powerImg.src = `../img/move/${move.damageclass}.png`;
      powerSpan.textContent = move.power ? move.power : "--";
      accuImg.src = "../img/lupa.png";
      accuSpan.textContent = move.accuracy ? move.accuracy : "--";

      moveCont.classList.add("pokemon-move");
      powerCont.classList.add("power-container");
      accuCont.classList.add("accuracy-container");

      powerCont.appendChild(powerImg);
      powerCont.appendChild(powerSpan);

      accuCont.appendChild(accuImg);
      accuCont.appendChild(accuSpan);

      moveCont.appendChild(span);
      moveCont.appendChild(powerCont);
      moveCont.appendChild(accuCont);
      moveCont.appendChild(imgType);

      moves.appendChild(moveCont);
    });

    moves.classList.add("pokemon-moves");

    card.appendChild(moves);
    teamSection.appendChild(card);
  }
};

const getAbility = async (abilities) => {
  const apiUrl =
    abilities[Math.floor(Math.random() * abilities.length)].ability.url;

  const res = await fetch(apiUrl);
  const data = await res.json();

  const nombreEspanol = data.names.find(
    (objeto) => objeto.language.name === "es"
  )?.name;
  const nombreIngles = data.names.find(
    (objeto) => objeto.language.name === "en"
  )?.name;

  return {
    nameEs: nombreEspanol || null,
    nameUs: nombreIngles || null,
  };
};

const getMoves = async (moves) => {
  const urlsNormal = [];
  const urlsRandom = new Set();

  if (moves.length < 4) {
    for (const move of moves) {
      urlsNormal.push(move.move.url);
    }
  } else {
    while (urlsRandom.size < 4) {
      const index = Math.floor(Math.random() * moves.length);
      urlsRandom.add(moves[index].move.url);
    }
  }

  const urls = moves.length < 4 ? urlsNormal : Array.from(urlsRandom);

  const responses = await Promise.all(
    urls.map(async (url) => {
      const res = await fetch(url);
      const data = await res.json();

      const move = {
        nameEs: data.names.find((object) => object.language.name === "es")
          ?.name,
        nameUs: data.names.find((object) => object.language.name === "en")
          ?.name,
        damageclass: data.damage_class.name,
        accuracy: data.accuracy,
        power: data.power,
        pp: data.pp,
        type: data.type.name,
      };

      return move;
    })
  );
  return responses;
};

const natures = [
  { nameUs: "Hasty", nameEs: "Activa " },
  { nameUs: "Gentle", nameEs: "Amable" },
  { nameUs: "Lax", nameEs: "Floja" },
  { nameUs: "Quiet", nameEs: "Mansa" },
  { nameUs: "Relaxed", nameEs: "Plácida" },
  { nameUs: "Mild", nameEs: "Afable" },
  { nameUs: "Brave", nameEs: "Audaz" },
  { nameUs: "Hardy", nameEs: "Fuerte" },
  { nameUs: "Timid", nameEs: "Miedosa" },
  { nameUs: "Quirky", nameEs: "Rara" },
  { nameUs: "Impish", nameEs: "Agitada" },
  { nameUs: "Careful", nameEs: "Cauta" },
  { nameUs: "Sassy", nameEs: "Grosera" },
  { nameUs: "Modest", nameEs: "Modesta" },
  { nameUs: "Calm", nameEs: "Serena" },
  { nameUs: "Jolly", nameEs: "Alegre" },
  { nameUs: "Docile", nameEs: "Dócil" },
  { nameUs: "Lonely", nameEs: "Huraña" },
  { nameUs: "Bold", nameEs: "Osada" },
  { nameUs: "Serious", nameEs: "Seria" },
  { nameUs: "Rash", nameEs: "Alocada" },
  { nameUs: "Adamant", nameEs: "Firme" },
  { nameUs: "Naive", nameEs: "Ingenua" },
  { nameUs: "Naughty", nameEs: "Pícara" },
  { nameUs: "Bashful", nameEs: "Tímida" },
];

const color_font = "rgb(249, 250, 251)";
const color_transparent = "rgba(249, 250, 251, .1)";
const color_radar = "rgba(255, 232, 0, .7)";

// Función que genera gráfico
const chartjs = (canvas, stats) => {
  const ctx = canvas.getContext("2d");
  // Datos
  const data = {
    labels: ["Ps", "Ataque", "Defensa", "Velocidad", "Def. Esp.", "At. Esp."],
    datasets: [
      {
        label: "Estadistica base",
        data: [
          stats.hp,
          stats.attack,
          stats.defense,
          stats.speed,
          stats.speDef,
          stats.speAtt,
        ],
        backgroundColor: color_radar,
        borderColor: color_radar,
        pointRadius: 0,
        borderWidth: 0,
        pointBorderWidth: 0,
        pointHoverRadius: 5,
      },
    ],
  };

  // Configuración
  const config = {
    type: "radar",
    data: data,
    options: {
      scales: {
        r: {
          suggestedMin: 0,
          suggestedMax: 255,
          angleLines: {
            display: false,
            color: color_transparent,
          },
          pointLabels: {
            font: {
              size: 10,
            },
            color: color_font,
          },
          ticks: {
            display: false,
            stepSize: 85,
          },
          grid: {
            color: [color_font, color_transparent, color_transparent],
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  };

  const myChart = new Chart(ctx, config);
};
