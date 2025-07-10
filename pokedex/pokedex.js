async function fetchData() {

  try {
    const pokemonName = document.getElementById("search-input").value;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);

    if (!response.ok) {
      throw new Error("Could not fetch resource");
    }

    const data = await response.json();

    console.log(data); ////////////////////////////////////////

    displayPokemonInfo(data, pokemonName);
  }
  catch (error) {
    console.log(error);
  }
}

// HANDLES DISPLAYING: 

// Pokemon sprite
function displayPokemonSprite(data) {
  const pokemonSprite = data.sprites.front_default;
  return pokemonSprite;
}

// Pokemon name
function displayPokemonName(pokemonName) { 
  return capitalizeFirstLetter(pokemonName);
}

// Pokemon ID number
function displayPokemonID(data) {
  const lessThan100 = '00';
  const greaterThan100 = '0';
  let pokemonId = data.id;

  if (pokemonId < 100) {
    return `${lessThan100}${pokemonId}`;
  } else if (pokemonId > 100 && pokemonId < 1000) {
    return `${greaterThan100}${pokemonId}`;
  } else {
    return pokemonId;
  }
}

// Pokemon types
function displayPokemonTypes(data) {
  let pokemonTypesHTML = '';
  
  const pokemonType = data.types.map(typeInfo => typeInfo.type.name);
  pokemonType.forEach(type => {
    pokemonTypesHTML += `<div class="type-value">${capitalizeFirstLetter(type)}</div>`;
  });

  return pokemonTypesHTML;
}

// Pokemon stats
function displayPokemonStats(data) {
  let pokemonStatsGridHTML = '';
  let baseStatsTotal = 0;

  data.stats.forEach(statsInfo => {
    const statsName = statsInfo.stat.name;
    const baseStats = statsInfo.base_stat;
    baseStatsTotal += baseStats;

    pokemonStatsGridHTML += `
      <div class="stats-name">${capitalizeFirstLetter(statsName)}</div>
      <div class="stats-value">${baseStats}</div>
    `;
  });
  
  pokemonStatsGridHTML += `<div>Total</div>`;
  pokemonStatsGridHTML += `<div class="stats-value">${baseStatsTotal}</div>`;

  return pokemonStatsGridHTML;
}

function displayPokemonInfo(data, pokemonName) {
  const pokemonHTML = `
    <div class="pokemon-top-profile-container">
      <div id="pokemon-id">${displayPokemonID(data)}</div>
      <img src="${displayPokemonSprite(data)}" alt="Pokemon Sprite" id="pokemon-sprite">
      <h3 id="pokemon-name">${displayPokemonName(pokemonName)}</h3>
    </div>
    <div class="types-container">
      <div>Type</div>
      <div>${displayPokemonTypes(data)}</div>
    </div>
    <div class="pokemon-stats-grid">
      ${displayPokemonStats(data)}
    </div>
  `;

  document.querySelector('.pokemon-info-container').innerHTML = pokemonHTML;
}


// Handle key down when user enters in input box
const inputElement = document.getElementById('search-input');
inputElement.addEventListener('keydown', (event) => {
  handleKeyDownEnter(event);
});

function handleKeyDownEnter(event) {
  if (event.key === 'Enter') {
    fetchData();
  }
}

// Capitalize first letter only
function capitalizeFirstLetter(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}


/*
fetch("https://pokeapi.co/api/v2/pokemon/pikachu")
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.log(error(error)));
*/
