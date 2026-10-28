let currentPokemon = null;
let currentPokemonMoves = [];
let currentPokemonAbilities = [];
let allItems = [];

let team = [
    null,
    null,
    null,
    null,
    null,
    null
];

document.addEventListener("DOMContentLoaded", () => {
    setupMoveInput("move1","move1-list");
    setupMoveInput("move2","move2-list");
    setupMoveInput("move3","move3-list");
    setupMoveInput("move4","move4-list");
    setupAbilityInput("ability","ability-list");
    loadItems();
});

async function loadItems() {
    const response = await fetch("https://pokeapi.co/api/v2/item?limit=3000");
    const data = await response.json();
    allItems = data.results.map(item => item.name);
        setupItemInput("held-item","item-list");
    }

function setupAbilityInput(inputId,listId) {
    const input = document.getElementById(inputId);
    const list = document.getElementById(listId);
    input.addEventListener("input",() => {
        const search = input.value.toLowerCase();
        list.innerHTML = "";
        const matches = currentPokemonAbilities.filter(a => a.includes(search));
        matches.forEach(ability => {
            const div = document.createElement("div");
            div.className = "ability-option";
                loadAbilityInfo(ability,div);
                    div.onclick =
                        () => {
                            input.value = ability;
                            list.style.display = "none";
                        };
                    list.appendChild(div);
                }
            );
            list.style.display =
                matches.length
                    ? "block"
                    : "none";
        }
    );
}

function setupMoveInput(inputId,listId) {
    const input = document.getElementById(inputId);
    const list = document.getElementById(listId);
    input.addEventListener("input",() => {
        const search = input.value.toLowerCase();
            list.innerHTML = "";
            const matches = currentPokemonMoves.filter(move => move.includes(search)).slice(0,20);
            matches.forEach(move => {
                const div = document.createElement("div");
                div.className = "move-option";
                loadMoveInfo(move, div);
                div.onclick = () => {
                    input.value = move;
                    list.style.display = "none";
                    };
                list.appendChild(div);
            });
            list.style.display =
                matches.length
                    ? "block"
                    : "none";
        }
    );
}

async function loadMoveInfo(moveName, element) {
    const response =
        await fetch(
            `https://pokeapi.co/api/v2/move/${moveName}`
        );
    const move =
        await response.json();
    const description =
        move.effect_entries.find(
            e => e.language.name === "en"
        )?.short_effect || "";
    
    let categoryImage = "";

    if (move.damage_class.name === "physical")
        categoryImage = "../img/PhysicalMove.png";

    if (move.damage_class.name === "special")
        categoryImage = "../img/SpecialMove.png";

    if (move.damage_class.name === "status")
        categoryImage = "../img/StatusMove.png";

    element.innerHTML = `
        <div class="move-title">
            ${move.name.replace(/-/g, " ")}
        </div>
        <div class="move-meta">
            <span class="move-type ${move.type.name}">
                ${move.type.name}
            </span>
            <span class="move-category ${move.damage_class.name}">
                <img class="category-icon" src="${categoryImage}" alt="${move.damage_class.name}">
            </span>
            <span>
                Power: ${move.power ?? "—"}
            </span>
            <span>
                Acc: ${move.accuracy ?? "—"}
            </span>
        </div>
        <div class="move-desc">
            ${description}
        </div>
    `;
}

async function loadAbilityInfo(abilityName,element) {
    const response = await fetch(`https://pokeapi.co/api/v2/ability/${abilityName}`);
    const ability = await response.json();
    const effect = ability.effect_entries.find(
        e => e.language.name === "en"
        )?.short_effect || "";
    element.innerHTML = `
        <div class="ability-title">
            ${ability.name.replace(
                /-/g,
                " "
            )}
        </div>
        <div class="ability-desc">
            ${effect}
        </div>
    `;
}

function setupItemInput(inputId,listId) {
    const input = document.getElementById(inputId);
    const list = document.getElementById(listId);
    input.addEventListener("input",() => {
        const search = input.value.toLowerCase();
        list.innerHTML = "";
        const matches = allItems.filter(item => item.includes(search)).slice(0,20);
        matches.forEach(item => {
            const div = document.createElement("div");
            div.className = "item-option";
            loadItemInfo(item,div,true);
            div.onclick =
                async () => {
                    input.value = item;
                    list.style.display = "none";
                    await loadItemInfo(item);
                };
            list.appendChild(div);
        });
        list.style.display =
            matches.length
            ? "block"
            : "none";
        }
    );
}

async function loadItemInfo(itemName,element = null,compact = false) {
    const response = await fetch(`https://pokeapi.co/api/v2/item/${itemName}`);
    const item = await response.json();
    const description = item.effect_entries.find(
        e => e.language.name === "en"
    )?.short_effect ||
        "No description.";
    if (compact && element) {
        element.innerHTML = `
            <img class="item-small-icon" src="${item.sprites.default}">
            <span>
                ${item.name.replace(/-/g," ")}
            </span>
        `;
        return;
    }
    document.getElementById("item-icon").src = item.sprites.default;
    document.getElementById("item-name").textContent = item.name.replace(/-/g," ");
    document.getElementById("item-description").textContent = description;
}

async function searchPokemon() {

    const search =
        document.getElementById("pokemon-search").value.toLowerCase();

    const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${search}`);

    const data = await response.json();
    
    currentPokemon = data;
    document.getElementById("pokemon-preview").src =
        data.sprites.other["official-artwork"].front_default;
    document.getElementById("pokemon-name").textContent =
        data.name;
    document.getElementById("pokemon-types").textContent =
        data.types.map(t => t.type.name).join(" / ");
    currentPokemonMoves = data.moves.map(
        move => move.move.name
        );
    
    currentPokemonAbilities =
        data.abilities.map(ability => ability.ability.name);
}

let selectedSlot = 0;

document.querySelectorAll(".team-slot").forEach(slot => {
    slot.addEventListener("click", () => {
        document.querySelectorAll(".team-slot").forEach(s => s.classList.remove("selected"));
        slot.classList.add("selected");
        selectedSlot = Number(slot.dataset.slot);
    });
}); 

function addToTeam() {
    team[selectedSlot] = {
    name: currentPokemon.name,
    sprite:
        document.getElementById("pokemon-shiny").checked
        ? currentPokemon.sprites.front_shiny
        : currentPokemon.sprites.front_default,
    shiny:
        document.getElementById("pokemon-shiny").checked,
    level:
        document.getElementById("pokemon-level").value,
    item:
        document.getElementById("held-item").value,
    ability:
        document.getElementById("ability").value,
    nature:
        document.getElementById("nature").value,
    moves: [
        document.getElementById("move1").value,
        document.getElementById("move2").value,
        document.getElementById("move3").value,
        document.getElementById("move4").value
    ],
    evs: {
        hp: document.getElementById("ev-hp").value,
        atk: document.getElementById("ev-atk").value,
        def: document.getElementById("ev-def").value,
        spa: document.getElementById("ev-spa").value,
        spd: document.getElementById("ev-spd").value,
        spe: document.getElementById("ev-spe").value
    },
    ivs: {
       hp: document.getElementById("iv-hp").value,
       atk: document.getElementById("iv-atk").value,
       def: document.getElementById("iv-def").value,
       spa: document.getElementById("iv-spa").value,
       spd: document.getElementById("iv-spd").value,
       spe: document.getElementById("iv-spe").value
    },
    tera:
        document.getElementById("tera-type").value,
};
    renderTeam();
}

function renderTeam() {
    document.querySelectorAll(".team-slot").forEach((slot, index) => {
            const pokemon =
                team[index];
            if (!pokemon) {
                slot.innerHTML = "+";
                return;
            }
            slot.innerHTML = `
                <img src="${pokemon.sprite}" width="50">
                ${pokemon.name}
            `;
        });
}

function exportTeam() {
    let output = "";
    team.forEach(pokemon => {
        if (!pokemon) return;
        output += pokemon.name;
        if (pokemon.item) {
            output += ` @ ${pokemon.item}`;
        }
        output += "\n";
        output +=`Ability: ${pokemon.ability}\n`;
        output += `Nature: ${pokemon.nature}\n`;
        output +=
            `EVs: ${pokemon.evs.hp} HP / ${pokemon.evs.atk} Atk / ${pokemon.evs.def} Def / ${pokemon.evs.spa} SpA / ${pokemon.evs.spd} SpD / ${pokemon.evs.spe} Spe\n`;
        if (pokemon.ivs.hp != 31 || pokemon.ivs.atk != 31 || pokemon.ivs.def != 31 || pokemon.ivs.spa != 31 || pokemon.ivs.spd != 31 || pokemon.ivs.spe != 31) {
    output +=
        `IVs: ${pokemon.ivs.hp} HP / ${pokemon.ivs.atk} Atk / ${pokemon.ivs.def} Def / ${pokemon.ivs.spa} SpA / ${pokemon.ivs.spd} SpD / ${pokemon.ivs.spe} Spe\n`;
    }
        output +=`Level: ${pokemon.level}\n`;
        output += `Tera Type: ${pokemon.tera}\n`;
        if (pokemon.shiny) {
            output +=`Shiny: Yes\n`;
        }
        output += "\n";
        pokemon.moves.forEach(move => {
            if (move) {
                output +=`- ${move}\n`;
            }
        });
        output += "\n";
    });
    document.getElementById("export-output").value = output;
}

function importTeam() {
    const text = document.getElementById("import-team").value;
    const lines = text.split("\n");
    team = [];
    let current = null;
    lines.forEach(line => {
        line = line.trim();
        if (!line) return;
        if (!line.startsWith("-") && !line.startsWith("Ability:") && !line.startsWith("Level:") && !line.startsWith("Shiny:") && !line.startsWith("Tera Type:") && !line.startsWith("EVs:") && !line.startsWith("IVs:") && !line.endsWith("Nature")) {
            if (current) {
                team.push(current);
            }
            current = {
                name: line.split("@")[0].trim(),
                moves: []
            };
            return;
        }
        if (line.startsWith("-") && current) {
            current.moves.push(line.replace("- ", ""));
        }
    });
    if (current) {
        team.push(current);
    }
    renderTeam();
    console.log(team);
}