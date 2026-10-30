console.log("Dex.js Started");

let pokemonList = [];
let currentMode = "seen";

let dexData =
    JSON.parse(
        localStorage.getItem(
            "pokedexTracker"
        )
    ) || {};

const dexNames = {
    national: "National Dex",
    kanto: "Kanto Dex",
    "original-johto": "Johto Dex",
    hoenn: "Hoenn Dex",
    "extended-sinnoh": "Sinnoh Dex",
    "updated-unova": "Unova Dex",
    "updated-alola": "Alola Dex",
    galar: "Galar Dex",
    "isle-of-armor": "Isle of Armor",
    "crown-tundra": "Crown Tundra",
    hisui: "Hisui Dex",
    paldea: "Paldea Dex",
    kitakami: "Kitakami Dex",
    blueberry: "Blueberry Dex"
};

const allowedDexes = [
    "national",
    "kanto",
    "original-johto",
    "hoenn",
    "extended-sinnoh",
    "updated-unova",
    "updated-alola",
    "galar",
    "isle-of-armor",
    "crown-tundra",
    "hisui",
    "paldea",
    "kitakami",
    "blueberry"
];

function setMode(mode) {

    currentMode = mode;

    document
        .querySelectorAll(
            ".mode-buttons button"
        )
        .forEach(btn =>
            btn.classList.remove(
                "active"
            )
        );

    document
        .getElementById(
            mode + "-btn"
        )
        .classList.add(
            "active"
        );

    updateProgress();
}

async function loadPokedexes() {

    const select =
        document.getElementById(
            "dex-select"
        );

    const response =
        await fetch(
            "https://pokeapi.co/api/v2/pokedex?limit=100"
        );

    const data =
        await response.json();

    select.innerHTML = "";

    data.results
        .filter(dex =>
            allowedDexes.includes(
                dex.name
            )
        )
        .forEach(dex => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                dex.name;

            option.textContent =
                dexNames[dex.name] ??
                dex.name;

            select.appendChild(
                option
            );

        });
}

async function loadDex(
    dexName = "national"
) {

    const response =
        await fetch(
            `https://pokeapi.co/api/v2/pokedex/${dexName}`
        );

    const data =
        await response.json();

    pokemonList =
        data.pokemon_entries.map(
            entry => {

                const nationalId =
                    entry.pokemon_species.url
                        .split("/")
                        .filter(Boolean)
                        .pop();

                return {

                    name:
                        entry
                        .pokemon_species
                        .name,

                    dexNumber:
                        entry.entry_number,

                    nationalId

                };

            }
        );

    renderDex();
}

function renderDex() {

    const grid =
        document.getElementById(
            "dex-grid"
        );

    const search =
        document
            .getElementById(
                "search"
            )
            .value
            .toLowerCase();

    grid.innerHTML = "";

    const filtered =
        pokemonList.filter(
            pokemon =>
                pokemon.name.includes(
                    search
                )
        );

    filtered.forEach(
        pokemon => {

            const saveKey =
                pokemon.name;

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "dex-card";

            if (
                dexData[saveKey]
                === "seen"
            ) {
                card.classList.add(
                    "seen"
                );
            }

            if (
                dexData[saveKey]
                === "caught"
            ) {
                card.classList.add(
                    "caught"
                );
            }

            if (
                dexData[saveKey]
                === "shiny"
            ) {
                card.classList.add(
                    "shiny"
                );
            }

            card.innerHTML = `
                <img
                    src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.nationalId}.png"
                    alt="${pokemon.name}"
                >

                <h4>
                    ${pokemon.name}
                </h4>

                #${pokemon.dexNumber}
            `;

            card.onclick = () => {

                dexData[saveKey] =
                    currentMode;

                localStorage.setItem(
                    "pokedexTracker",
                    JSON.stringify(
                        dexData
                    )
                );

                renderDex();
            };

            grid.appendChild(
                card
            );
        }
    );

    updateProgress();
}

function updateProgress() {

    let count = 0;

    Object.values(
        dexData
    ).forEach(
        value => {

            if (
                value === currentMode
            ) {
                count++;
            }

        }
    );

    const total =
        pokemonList.length;

    const percent =
        total > 0
        ? (count / total) * 100
        : 0;

    document
        .getElementById(
            "progress-text"
        )
        .textContent =
        `${count} / ${total}`;

    document
        .getElementById(
            "progress-fill"
        )
        .style.width =
        percent + "%";
}

window.addEventListener(
    "DOMContentLoaded",
    async () => {

        document
            .getElementById(
                "seen-btn"
            )
            .onclick =
                () =>
                    setMode(
                        "seen"
                    );

        document
            .getElementById(
                "caught-btn"
            )
            .onclick =
                () =>
                    setMode(
                        "caught"
                    );

        document
            .getElementById(
                "shiny-btn"
            )
            .onclick =
                () =>
                    setMode(
                        "shiny"
                    );

        document
            .getElementById(
                "dex-select"
            )
            .addEventListener(
                "change",
                event => {

                    loadDex(
                        event
                        .target
                        .value
                    );

                }
            );

        document
            .getElementById(
                "search"
            )
            .addEventListener(
                "input",
                renderDex
            );

        await loadPokedexes();

        await loadDex(
            "national"
        );
    }
);

function clearS() {
    localStorage.clear();
}
