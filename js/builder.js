let currentPokemon = null;
let currentPokemonMoves = [];


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
});

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
        sprite: currentPokemon.sprites.front_default,

        moves: [
            document.getElementById("move1").value,
            document.getElementById("move2").value,
            document.getElementById("move3").value,
            document.getElementById("move4").value
        ]
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
        output += `${pokemon.name}\n\n`;
        pokemon.moves.forEach(move => {
            if (move) {
                output += `- ${move}\n`;
            }
        });
        output += "\n";
    });
    document.getElementById("export-output").value = output;
}