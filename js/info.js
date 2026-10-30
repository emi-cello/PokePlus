let currentPokemon = null;
let shiny = false;

const searchInput = document.getElementById("pokemon-search");

searchInput.addEventListener("keydown",e => {
        if(e.key==="Enter"){
            searchPokemon();
        }
    }
);

document.getElementById("shiny-btn").addEventListener("click",() => {
        shiny = !shiny;
        document.getElementById("shiny-btn").textContent = shiny
            ? "Shiny: On"
            : "Shiny: Off";
        renderPokemon();
    }
);

async function searchPokemon(){
    const search = document.getElementById("pokemon-search").value.toLowerCase();
    if(!search) return;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${search}`);
    const data = await response.json();
    currentPokemon = data;
    renderPokemon();
    loadSpecies(data.species.url);
}

function renderPokemon(){
    if(!currentPokemon) return;
    const image = shiny
        ? currentPokemon.sprites.other["official-artwork"].front_shiny
        : currentPokemon.sprites.other["official-artwork"].front_default;
    document.getElementById("pokemon-image").src = image;
    document.getElementById("pokemon-name").textContent = currentPokemon.name;
    document.getElementById("pokemon-number").textContent = "#" + currentPokemon.id;
    renderTypes();
    renderStats();
    renderAbilities();
}

function renderTypes(){
    const types = document.getElementById("pokemon-types");
    types.innerHTML = "";
    currentPokemon.types.forEach(type => {
        types.innerHTML += `
            <div class="type${type.type.name}">
                ${type.type.name}
            </div>
        `;
    });
}

function renderAbilities(){
    const abilities = document.getElementById("abilities");
    abilities.innerHTML = "";
    currentPokemon.abilities.forEach(ability => {
        abilities.innerHTML += `
            <div class="ability">
                ${ability.ability.name}
            </div>
        `;
    });
}

function renderStats(){
    const stats = document.getElementById("stats");
    stats.innerHTML = "";
    currentPokemon.stats.forEach(stat => {
        stats.innerHTML += `
            <div class="stat-row">
                <span>
                    ${stat.stat.name}
                </span>
                <div class="bar">
                    <div class="fill" style="width:${stat.base_stat/255*100}%;"></div>
                </div>
                <span>
                    ${stat.base_stat}
                </span>
            </div>
        `;
    });
}

async function loadSpecies(url){
    const response = await fetch(url);
    const species = await response.json();
    const entry = species.flavor_text_entries.find(e => e.language.name === "en");

    document.getElementById("dex-entry").textContent = entry
        ? entry.flavor_text.replace(/\n/g," ").replace(/\f/g," ")
        : "No entry found.";

    const forms = document.getElementById("form-select");
    forms.innerHTML = "";
    species.varieties.forEach(variety => {
        forms.innerHTML += `
            <option value="${variety.pokemon.name}">
                ${variety.pokemon.name}
            </option>
        `;
    });
    forms.onchange = async () => {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${forms.value}`);
        currentPokemon = await response.json();
        renderPokemon();
    };
}

document.getElementById("pokemon-search").value = "bulbasaur";
searchPokemon();