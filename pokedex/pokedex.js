async function fetchData() {

  try {
    const pokemonName = document.getElementById("search-input").value;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);

    if (!response.ok) {
      throw new Error("Could not fetch resource");
    }

    const data = await response.json();

    console.log(data); ////////////////////////////////////////
    const pokemonSprite = data.sprites.front_default;
    const pokemonId = data.id;
    const pokemonType = data.types.map(typeInfo => typeInfo.type.name);
    pokemonType.forEach(type => {
      displayPokemonType(type);
    });


    let pokemonStatsNameHTML = '';
    const pokemonStatsName = data.stats.map(statsInfo => statsInfo.stat.name);
    pokemonStatsName.forEach(stat => {
      pokemonStatsName += `<div class="pokemon-stats">${capitalizeFirstLetter(stat)}</div>`;
      console.log(stat);
    });

    document.getElementById('stats').innerHTML = pokemonStatsNameHTML;
    

    displayPokemonSprite(pokemonSprite);
    displayPokemonName(pokemonName);
    displayPokemonID(pokemonId);
    // displayPokemonType(...pokemonType);



  }
  catch (error) {
    console.log(error);
  }
}

// HANDLES DISPLAYING: 

// Pokemon sprite
function displayPokemonSprite(pokemonSprite) {
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
function displayPokemonID(pokemonId) {
  const displayId = document.getElementById('pokemon-id');
  displayId.innerHTML = pokemonId;
}

// Pokemon type
function displayPokemonType(pokemonType) {
  const displayType = document.getElementById('type');
  displayType.innerHTML += `<div>${capitalizeFirstLetter(pokemonType)}</div>`;
}

// Pokemon HP
function displayPokemonHP() {

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
