const pokemonName = document.querySelector('.pokemon__name');
const pokemonNumber = document.querySelector('.pokemon__number');
const pokemonImage = document.querySelector('.pokemon__image');
const pokemonTypes = document.querySelector('.pokemon__types');
const pokemonHeight = document.querySelector('.pokemon__height');
const pokemonWeight = document.querySelector('.pokemon__weight');
const pokemonAbilities = document.querySelector('.pokemon__abilities');
const pokemonStats = document.querySelectorAll('.stat');
const loading = document.querySelector('.loading');

const form = document.querySelector('.form');
const input = document.querySelector('.input__search');
const buttonPrev = document.querySelector('.btn-prev');
const buttonNext = document.querySelector('.btn-next');
const buttonRandom = document.querySelector('.btn-random');
const buttonShiny = document.querySelector('.btn-shiny');

let searchPokemon = 1;
let isShiny = false;

const fetchPokemon = async (pokemon) => {
  try {
    const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);

    if (APIResponse.status === 200) {
      const data = await APIResponse.json();
      return data;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching Pokemon:', error);
    return null;
  }
}

const renderPokemon = async (pokemon) => {

  loading.style.display = 'block';
  pokemonImage.style.display = 'none';
  pokemonName.innerHTML = 'Carregando...';
  pokemonNumber.innerHTML = '';
  pokemonTypes.innerHTML = '';
  pokemonHeight.innerHTML = '';
  pokemonWeight.innerHTML = '';
  pokemonAbilities.innerHTML = '';
  pokemonStats.forEach(stat => {
    stat.querySelector('.stat__fill').style.width = '0%';
    stat.querySelector('.stat__value').textContent = '';
  });

  const data = await fetchPokemon(pokemon);

  loading.style.display = 'none';

  if (data) {
    pokemonImage.style.display = 'block';
    pokemonName.innerHTML = data.name;
    pokemonNumber.innerHTML = data.id;
    pokemonImage.src = isShiny 
      ? data['sprites']['versions']['generation-v']['black-white']['animated']['front_shiny']
      : data['sprites']['versions']['generation-v']['black-white']['animated']['front_default'];
    
    // Types
    const typeTranslations = {
      normal: 'normal',
      fire: 'fogo',
      water: 'água',
      electric: 'elétrico',
      grass: 'grama',
      ice: 'gelo',
      fighting: 'lutador',
      poison: 'veneno',
      ground: 'terra',
      flying: 'voador',
      psychic: 'psíquico',
      bug: 'inseto',
      rock: 'pedra',
      ghost: 'fantasma',
      dragon: 'dragão',
      dark: 'escuro',
      steel: 'aço',
      fairy: 'fada'
    };
    data.types.forEach(type => {
      const translatedType = typeTranslations[type.type.name] || type.type.name;
      const typeElement = document.createElement('span');
      typeElement.classList.add('pokemon__type', `type-${type.type.name}`);
      typeElement.textContent = translatedType;
      pokemonTypes.appendChild(typeElement);
    });
    
    // Height and Weight
    pokemonHeight.innerHTML = `Altura: ${data.height / 10} m`;
    pokemonWeight.innerHTML = `Peso: ${data.weight / 10} kg`;
    
    // Abilities
    const abilities = data.abilities.map(ability => ability.ability.name).join(', ');
    pokemonAbilities.innerHTML = `Habilidades: ${abilities}`;
    
    // Stats
    const statIndices = [0, 1, 2, 3, 4, 5]; // HP, ATK, DEF, SP.ATK, SP.DEF, SPEED
    statIndices.forEach((statIndex, displayIndex) => {
      const stat = data.stats[statIndex];
      const statElement = pokemonStats[displayIndex];
      const fill = statElement.querySelector('.stat__fill');
      const value = statElement.querySelector('.stat__value');
      const percentage = (stat.base_stat / 255) * 100;
      fill.style.width = `${percentage}%`;
      value.textContent = stat.base_stat;
    });
    
    input.value = '';
    searchPokemon = data.id;
  } else {
    pokemonImage.style.display = 'none';
    pokemonName.innerHTML = 'Não encontrado :c';
    pokemonNumber.innerHTML = '';
    pokemonTypes.innerHTML = '';
    pokemonHeight.innerHTML = '';
    pokemonWeight.innerHTML = '';
    pokemonAbilities.innerHTML = '';
    pokemonStats.forEach(stat => {
      stat.querySelector('.stat__fill').style.width = '0%';
      stat.querySelector('.stat__value').textContent = '';
    });
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  renderPokemon(input.value.toLowerCase());
});

buttonPrev.addEventListener('click', () => {
  if (searchPokemon > 1) {
    searchPokemon -= 1;
    renderPokemon(searchPokemon);
  }
});

buttonNext.addEventListener('click', () => {
  searchPokemon += 1;
  renderPokemon(searchPokemon);
});

buttonRandom.addEventListener('click', () => {
  const randomId = Math.floor(Math.random() * 898) + 1; // Up to Gen 8
  searchPokemon = randomId;
  renderPokemon(randomId);
});

buttonShiny.addEventListener('click', () => {
  isShiny = !isShiny;
  renderPokemon(searchPokemon);
});

renderPokemon(searchPokemon);
