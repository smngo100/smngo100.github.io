async function fetchData() {

  try {
    const pokemonName = document.getElementById("search-input").value;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);

    if (!response.ok) {
      throw new Error("Could not fetch resource");
    }

    const data = await response.json();

    console.log(data); ////////////////////////////////////////

    displayPokemonSprite(data);
    displayPokemonName(pokemonName);
    displayPokemonType(data);
    displayPokemonID(data);
    displayPokemonStats(data);
    // displayPokemonType(...pokemonType);
  }
  catch (error) {
    console.log(error);
  }
}

// HANDLES DISPLAYING: 

// Pokemon sprite
function displayPokemonSprite(data) {
  const pokemonSprite = data.sprites.front_default;
  const imgElement = document.getElementById("pokemon-sprite");
  imgElement.src = pokemonSprite;
  imgElement.style.display = "block";
}

// Pokemon name
function displayPokemonName(pokemonName) { 
  const displayName = document.getElementById('pokemon-name');
  displayName.innerHTML = capitalizeFirstLetter(pokemonName);
}

// Pokemon ID number
function displayPokemonID(data) {
  const lessThan100 = '00';
  const greaterThan100 = '0';

  let pokemonId = data.id;
  const displayId = document.getElementById('pokemon-id');
  // displayId.innerHTML = pokemonId;

  if (pokemonId < 100) {
    pokemonId = `${lessThan100}${pokemonId}`;
    displayId.innerHTML = pokemonId;
  } else if (pokemonId > 100 && pokemonId < 1000) {
    pokemonId = `${greaterThan100}${pokemonId}`;
    displayId.innerHTML = pokemonId;
  } else {
    displayId.innerHTML = pokemonId;
  }
}

// Pokemon type
function displayPokemonType(data) {
  let pokemonTypeHTML = '';

  const pokemonType = data.types.map(typeInfo => typeInfo.type.name);
  pokemonType.forEach(type => {
    pokemonTypeHTML += `<div>${capitalizeFirstLetter(type)}</div>`;
  });
  document.getElementById('type').innerHTML = pokemonTypeHTML;
}

// Pokemon stats
function displayPokemonStats(data) {
  let pokemonStatsNameHTML = '';
  let baseStatsTotal = 0;

  data.stats.forEach(statsInfo => {
    const statsName = statsInfo.stat.name;
    const baseStats = statsInfo.base_stat;

    baseStatsTotal += baseStats;
    pokemonStatsNameHTML += `<div class="pokemon-stats">${capitalizeFirstLetter(statsName)}: ${baseStats}</div>`;
  });
  pokemonStatsNameHTML += `<div>Total: ${baseStatsTotal}</div>`;
  document.getElementById('stats').innerHTML = pokemonStatsNameHTML;
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
