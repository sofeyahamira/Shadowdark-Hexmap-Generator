// --- DATA TABLES ---

const TERRAINS = [
    { name: "Desert/Arctic", colorClass: "t-desert-arctic", icon: "❄️/☀️" },
    { name: "Swamp", colorClass: "t-swamp", icon: "🐊" },
    { name: "Grassland", colorClass: "t-grassland", icon: "🌾" },
    { name: "Forest/Jungle", colorClass: "t-forest-jungle", icon: "🌲" },
    { name: "River/Coast", colorClass: "t-river-coast", icon: "🌊" },
    { name: "Ocean", colorClass: "t-ocean", icon: "⛵" },
    { name: "Mountain", colorClass: "t-mountain", icon: "⛰️" }
];

const DANGER_LEVELS = [
    { roll: 1, label: "Safe", class: "danger-safe" },
    { roll: 3, label: "Unsafe", class: "danger-unsafe" },
    { roll: 5, label: "Risky", class: "danger-risky" },
    { roll: 6, label: "Deadly", class: "danger-deadly" }
];

const CATACLYSMS = [
    "Volcano", "Fire", "Earthquake", "Storm", "Flood", "War", "Pestilence", "Magical disaster"
];

const SETTLEMENT_NAMES = [
    { village: "Bruga's Hold", town: "Fairhollow", city: "Doraine" },
    { village: "Lastwatch", town: "Ivan's Keep", city: "Meridia" },
    { village: "Darkwater", town: "Galina", city: "King's Gate" },
    { village: "Ostlin", town: "Brightlantern", city: "Myrkhos" },
    { village: "Treefall", town: "Corvin's Crest", city: "Rularn" },
    { village: "Vorn", town: "Ironbridge", city: "Ordos" },
    { village: "Hillshire", town: "Skalvin", city: "Thane" },
    { village: "Nighthaven", town: "Toresk", city: "Rahgbat" }
];

const POI_LOCATIONS = [
    "Small tower", "Fortified keep", "Natural landmark", "Natural landmark", 
    "Temple", "Barrow mounds", "Village", "Village", "Town", "Town", 
    "City/metropolis", "Ravine", "Monster nest", "Monster nest", 
    "Hermit's abode", "Cave formation", "Cave formation", 
    "Ancient dolmens", "Barbarian camp", "Holy shrine"
];

const POI_DEVELOPMENTS = [
    "Disaster! Roll on Cataclysm table", "Over/connected to a large tomb", 
    "Being attacked by an invader", "Being attacked by an invader", 
    "Home to an oracle", "Around/over a sleeping dragon", 
    "Abandoned and in ruins", "Abandoned and in ruins", 
    "Guarded by its current residents", "Guarded by its current residents", 
    "Under siege by a warband", "Home to a religious cult", 
    "Where a secret circle of wizards meets", "Where a secret circle of wizards meets", 
    "Occupied by a self-titled king/queen", "Controlled by a malevolent sorcerer", 
    "Controlled by a malevolent sorcerer", "Protected by an age-old guardian", 
    "Hiding a great treasure", "With a door to another plane"
];

// --- HELPER FUNCTIONS ---

function rollDie(sides) {
    return Math.floor(Math.random() * sides) + 1;
}

function roll2d6() {
    return rollDie(6) + rollDie(6);
}

function getTerrainFromRoll(roll) {
    if (roll === 2) return 0;
    if (roll === 3) return 1;
    if (roll >= 4 && roll <= 6) return 2;
    if (roll >= 7 && roll <= 8) return 3;
    if (roll >= 9 && roll <= 10) return 4;
    if (roll === 11) return 5;
    if (roll === 12) return 6;
    return 2;
}

function getDangerLevel() {
    let r = rollDie(6);
    if (r === 1) return DANGER_LEVELS[0];
    if (r <= 3) return DANGER_LEVELS[1];
    if (r <= 5) return DANGER_LEVELS[2];
    return DANGER_LEVELS[3];
}

function generatePOI() {
    if (rollDie(6) > 3) return null;

    const locRoll = rollDie(20);
    const devRoll = rollDie(20);

    let locationName = POI_LOCATIONS[locRoll - 1];
    let developmentText = POI_DEVELOPMENTS[devRoll - 1];

    // Handle Settlement Names based on Location roll
    if (locRoll >= 7 && locRoll <= 11) {
        const nameRoll = rollDie(8);
        let name = "";
        let type = "";
        
        if (locRoll <= 8) {
            name = SETTLEMENT_NAMES[nameRoll-1].village;
            type = "Village";
        } else if (locRoll <= 10) {
            name = SETTLEMENT_NAMES[nameRoll-1].town;
            type = "Town";
        } else {
            name = SETTLEMENT_NAMES[nameRoll-1].city;
            type = "City/Metropolis";
        }
        locationName = `${type}: ${name}`;
    }

    // Handle Cataclysm based on Development roll
    if (devRoll === 1) {
        const catRoll = rollDie(8);
        developmentText = `Disaster! (${CATACLYSMS[catRoll - 1]})`;
    }

    return {
        name: locationName,
        details: developmentText
    };
}

// --- MAIN GENERATION LOGIC ---

function generateMap() {
    const count = document.getElementById('hexCount').value;
    const grid = document.getElementById('hexGrid');
    const log = document.getElementById('textLog');
    
    grid.innerHTML = "";
    log.innerHTML = "<h3>Generated Path</h3>";

    let currentTerrainIndex = getTerrainFromRoll(roll2d6());

    for (let i = 1; i <= count; i++) {
        if (i > 1) {
            let newHexRoll = roll2d6();
            if (newHexRoll >= 2 && newHexRoll <= 3) {
                currentTerrainIndex = (currentTerrainIndex + 1) % 7;
            } else if (newHexRoll >= 9 && newHexRoll <= 11) {
                currentTerrainIndex = (currentTerrainIndex + 2) % 7;
            } else if (newHexRoll === 12) {
                currentTerrainIndex = getTerrainFromRoll(roll2d6());
            } 
        }

        const terrainObj = TERRAINS[currentTerrainIndex];
        const danger = getDangerLevel();
        const poi = generatePOI();

        // Render Hex Element
        const hexDiv = document.createElement('div');
        hexDiv.className = `hex ${terrainObj.colorClass}`;
        if (poi) hexDiv.classList.add('has-poi');
        hexDiv.innerHTML = `<span class="hex-id">#${i}</span><span class="hex-icon">${terrainObj.icon}</span>`;
        
        hexDiv.onclick = () => {
            alert(`Hex #${i}\nTerrain: ${terrainObj.name}\nDanger: ${danger.label}\nPOI: ${poi ? poi.name + ' - ' + poi.details : 'None'}`);
        };

        grid.appendChild(hexDiv);

        // Render Log Entry
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        let poiString = poi ? `<span class="poi-text">${poi.name}</span> <br> &nbsp;&nbsp; -> ${poi.details}` : "None";

        entry.innerHTML = `
            <strong>Hex:</strong> ${i} <br>
            <strong>Terrain:</strong> ${terrainObj.name} <br>
            <strong>Danger Level:</strong> <span class="${danger.class}">${danger.label}</span> <br>
            <strong>POI:</strong> ${poiString}
        `;
        log.appendChild(entry);
    }
}

window.onload = generateMap;
