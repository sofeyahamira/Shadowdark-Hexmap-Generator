const TERRAINS = [
    { name: "Desert/Arctic", colorClass: "t-desert-arctic", icon: "☀️" },
    { name: "Swamp", colorClass: "t-swamp", icon: "🐊" },
    { name: "Grassland", colorClass: "t-grassland", icon: "🌾" },
    { name: "Forest/Jungle", colorClass: "t-forest-jungle", icon: "🌲" },
    { name: "River/Coast", colorClass: "t-river-coast", icon: "🌊" },
    { name: "Ocean", colorClass: "t-ocean", icon: "⛵" },
    { name: "Mountain", colorClass: "t-mountain", icon: "⛰️" }
];

const DANGER_LEVELS = [
    { label: "Safe", class: "danger-safe" },
    { label: "Unsafe", class: "danger-unsafe" },
    { label: "Risky", class: "danger-risky" },
    { label: "Deadly", class: "danger-deadly" }
];

const CATACLYSMS = ["Volcano", "Fire", "Earthquake", "Storm", "Flood", "War", "Pestilence", "Magical disaster"];

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

function roll(s) { return Math.floor(Math.random() * s) + 1; }

function getTerrainIndex(r) {
    if (r === 2) return 0;
    if (r === 3) return 1;
    if (r <= 6) return 2;
    if (r <= 8) return 3;
    if (r <= 10) return 4;
    if (r === 11) return 5;
    return 6;
}

function generatePOI() {
    if (roll(6) > 3) return null;
    const locR = roll(20);
    const devR = roll(20);

    let locName = POI_LOCATIONS[locR - 1];
    let devText = POI_DEVELOPMENTS[devR - 1];

    if (locR >= 7 && locR <= 11) {
        const nR = roll(8);
        if (locR <= 8) locName = `Village: ${SETTLEMENT_NAMES[nR-1].village}`;
        else if (locR <= 10) locName = `Town: ${SETTLEMENT_NAMES[nR-1].town}`;
        else locName = `City: ${SETTLEMENT_NAMES[nR-1].city}`;
    }

    if (devR === 1) devText = `Disaster! (${CATACLYSMS[roll(8) - 1]})`;
    return { name: locName, details: devText };
}

function generateMap() {
    const count = document.getElementById('hexCount').value;
    const grid = document.getElementById('hexGrid');
    const log = document.getElementById('textLog');
    
    grid.innerHTML = "";
    log.innerHTML = "";

    let currentT = getTerrainIndex(roll(6) + roll(6));

    for (let i = 1; i <= count; i++) {
        if (i > 1) {
            const nextR = roll(6) + roll(6);
            if (nextR <= 3) currentT = (currentT + 1) % 7;
            else if (nextR >= 9 && nextR <= 11) currentT = (currentT + 2) % 7;
            else if (nextR === 12) currentT = getTerrainIndex(roll(6) + roll(6));
        }

        const terrain = TERRAINS[currentT];
        const dangerRoll = roll(6);
        const danger = dangerRoll === 1 ? DANGER_LEVELS[0] : (dangerRoll <= 3 ? DANGER_LEVELS[1] : (dangerRoll <= 5 ? DANGER_LEVELS[2] : DANGER_LEVELS[3]));
        const poi = generatePOI();

        // UI Hex
        const hex = document.createElement('div');
        hex.className = `hex ${terrain.colorClass} ${poi ? 'has-poi' : ''}`;
        hex.innerHTML = `<span class="hex-id">#${i}</span><span class="hex-icon">${terrain.icon}</span>`;
        hex.onclick = () => alert(`Hex ${i}: ${terrain.name}\nDanger: ${danger.label}\nPOI: ${poi ? poi.name : 'None'}`);
        grid.appendChild(hex);

        // UI Log
        log.innerHTML += `
            <div class="log-entry">
                <strong>Hex:</strong> ${i}<br>
                <strong>Terrain:</strong> ${terrain.name}<br>
                <strong>Danger level:</strong> <span class="${danger.class}">${danger.label}</span><br>
                <strong>POI:</strong> ${poi ? `<span class="poi-text">${poi.name}</span> (${poi.details})` : 'None'}
            </div>`;
    }
}

// Initial load
window.onload = generateMap;
