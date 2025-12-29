// --- DATA TABLES ---

    const TERRAINS = [
        { name: "Desert/Arctic", colorClass: "t-desert-arctic", icon: "❄️/☀️" }, // Index 0
        { name: "Swamp", colorClass: "t-swamp", icon: "🐊" },           // Index 1
        { name: "Grassland", colorClass: "t-grassland", icon: "🌾" },       // Index 2
        { name: "Forest/Jungle", colorClass: "t-forest-jungle", icon: "🌲" },   // Index 3
        { name: "River/Coast", colorClass: "t-river-coast", icon: "🌊" },     // Index 4
        { name: "Ocean", colorClass: "t-ocean", icon: "⛵" },           // Index 5
        { name: "Mountain", colorClass: "t-mountain", icon: "⛰️" }        // Index 6
    ];

    const DANGER_LEVELS = [
        { roll: 1, label: "Safe", class: "danger-safe" },
        { roll: 3, label: "Unsafe", class: "danger-unsafe" }, // 2-3
        { roll: 5, label: "Risky", class: "danger-risky" },   // 4-5
        { roll: 6, label: "Deadly", class: "danger-deadly" }  // 6
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

// Ranges (like 3-4) are handled by repeating the entry in the array indices
    const POI_LOCATIONS = [
        "Small tower",      // 1
        "Fortified keep",   // 2
        "Natural landmark", // 3
        "Natural landmark", // 4
        "Temple",           // 5
        "Barrow mounds",    // 6
        "Village",          // 7
        "Village",          // 8
        "Town",             // 9
        "Town",             // 10
        "City/metropolis",  // 11
        "Ravine",           // 12
        "Monster nest",     // 13
        "Monster nest",     // 14
        "Hermit's abode",   // 15
        "Cave formation",   // 16
        "Cave formation",   // 17
        "Ancient dolmens",  // 18
        "Barbarian camp",   // 19
        "Holy shrine"       // 20
    ];

    const POI_DEVELOPMENTS = [
        "Disaster! Roll on Cataclysm table",      // 1
        "Over/connected to a large tomb",         // 2
        "Being attacked by an invader",           // 3
        "Being attacked by an invader",           // 4
        "Home to an oracle",                      // 5
        "Around/over a sleeping dragon",          // 6
        "Abandoned and in ruins",                 // 7
        "Abandoned and in ruins",                 // 8
        "Guarded by its current residents",       // 9
        "Guarded by its current residents",       // 10
        "Under siege by a warband",               // 11
        "Home to a religious cult",               // 12
        "Where a secret circle of wizards meets", // 13
        "Where a secret circle of wizards meets", // 14
        "Occupied by a self-titled king/queen",   // 15
        "Controlled by a malevolent sorcerer",    // 16
        "Controlled by a malevolent sorcerer",    // 17
        "Protected by an age-old guardian",       // 18
        "Hiding a great treasure",                // 19
        "With a door to another plane"            // 20
    ];


    // --- HELPER FUNCTIONS ---

    function rollDie(sides) {
        return Math.floor(Math.random() * sides) + 1;
    }

    function roll2d6() {
        return rollDie(6) + rollDie(6);
    }

    function getTerrainFromRoll(roll) {
        // Based on Hex Terrain Table (p. 132)
        if (roll === 2) return 0; // Desert/Arctic
        if (roll === 3) return 1; // Swamp
        if (roll >= 4 && roll <= 6) return 2; // Grassland
        if (roll >= 7 && roll <= 8) return 3; // Forest/Jungle
        if (roll >= 9 && roll <= 10) return 4; // River/Coast
        if (roll === 11) return 5; // Ocean
        if (roll === 12) return 6; // Mountain
        return 2; // Default to grassland if something breaks
    }

    function getDangerLevel() {
        let r = rollDie(6);
        if (r === 1) return DANGER_LEVELS[0];
        if (r <= 3) return DANGER_LEVELS[1];
        if (r <= 5) return DANGER_LEVELS[2];
        return DANGER_LEVELS[3];
    }

        function generatePOI() {
        // Roll d6, on a 1 there is a POI
        if (rollDie(6) !== 1) return null;

        // Roll TWO separate d20s
        const locRoll = rollDie(20);
        const devRoll = rollDie(20);

        let locationName = POI_LOCATIONS[locRoll - 1];
        let developmentText = POI_DEVELOPMENTS[devRoll - 1];

        // --- Handle Special Case: Settlement Names (Dependent on Location Roll) ---
        // Village (7-8), Town (9-10), City (11)
        if (locRoll >= 7 && locRoll <= 11) {
            const nameRoll = rollDie(8);
            let specificName = "";
            let type = "";
            
            if (locRoll <= 8) { // Village
                specificName = SETTLEMENT_NAMES[nameRoll-1].village;
                type = "Village";
            } else if (locRoll <= 10) { // Town
                specificName = SETTLEMENT_NAMES[nameRoll-1].town;
                type = "Town";
            } else { // City
                specificName = SETTLEMENT_NAMES[nameRoll-1].city;
                type = "City/Metropolis";
            }
            // Combine Type + Name
            locationName = `${type}: ${specificName}`;
        }

        // --- Handle Special Case: Cataclysm (Dependent on Development Roll) ---
        // If Development Roll is 1 ("Disaster!"), trigger Cataclysm table
        if (devRoll === 1) {
            const catRoll = rollDie(8);
            developmentText = `Disaster! (${CATACLYSMS[catRoll - 1]})`;
        }

        return {
            name: locationName,
            details: developmentText
        };
    }

        
        // 2. Settlement Names (Village 7-8, Town 9-10, City 11)
        if (roll >= 7 && roll <= 11) {
            const nameRoll = rollDie(8);
            let name = "";
            let type = "";
            
            if (roll <= 8) { // Village
                name = SETTLEMENT_NAMES[nameRoll-1].village;
                type = "Village";
            } else if (roll <= 10) { // Town
                name = SETTLEMENT_NAMES[nameRoll-1].town;
                type = "Town";
            } else { // City
                name = SETTLEMENT_NAMES[nameRoll-1].city;
                type = "City/Metropolis";
            }
            result.name = `${type}: ${name}`;
        }

        return result;
    }

    // --- MAIN LOGIC ---

    function generateMap() {
        const count = document.getElementById('hexCount').value;
        const grid = document.getElementById('hexGrid');
        const log = document.getElementById('textLog');
        
        grid.innerHTML = "";
        log.innerHTML = "<h3>Generated Path</h3>";

        let currentTerrainIndex = getTerrainFromRoll(roll2d6()); // Initial starting terrain

        for (let i = 1; i <= count; i++) {
            
            // 1. Determine Terrain (Logic: Move into empty hex -> Roll New Hex table)
            // If it's the first hex, we just use the initial roll. 
            // If it's subsequent, we apply the "New Hex" logic to the PREVIOUS terrain.
            
            if (i > 1) {
                let newHexRoll = roll2d6();
                
                // Logic from "New Hex" Table
                if (newHexRoll >= 2 && newHexRoll <= 3) {
                    // Current + 1 step
                    currentTerrainIndex = (currentTerrainIndex + 1) % 7;
                } else if (newHexRoll >= 9 && newHexRoll <= 11) {
                    // Current + 2 steps
                    currentTerrainIndex = (currentTerrainIndex + 2) % 7;
                } else if (newHexRoll === 12) {
                    // Roll new fresh terrain
                    currentTerrainIndex = getTerrainFromRoll(roll2d6());
                } 
                // 4-8 is "Same as current", so no change.
            }

            const terrainObj = TERRAINS[currentTerrainIndex];

            // 2. Determine Danger
            const danger = getDangerLevel();

            // 3. Determine POI
            const poi = generatePOI();

            // --- RENDER HEX ---
            const hexDiv = document.createElement('div');
            hexDiv.className = `hex ${terrainObj.colorClass}`;
            if (poi) hexDiv.classList.add('has-poi');
            
            hexDiv.innerHTML = `
                <span class="hex-id">#${i}</span>
                <span class="hex-icon">${terrainObj.icon}</span>
            `;
            hexDiv.title = `${terrainObj.name}\nDanger: ${danger.label}\nPOI: ${poi ? poi.name : 'None'}`;
            
            // Click to see details in alert (optional UX)
            hexDiv.onclick = () => {
                alert(`Hex #${i}\nTerrain: ${terrainObj.name}\nDanger: ${danger.label}\nPOI: ${poi ? poi.name + ' - ' + poi.details : 'None'}`);
            };

            grid.appendChild(hexDiv);

            // --- RENDER TEXT LOG ---
            const entry = document.createElement('div');
            entry.className = 'log-entry';
            
            let poiString = "None";
            if (poi) {
                poiString = `<span class="poi-text">${poi.name}</span> <br> &nbsp;&nbsp; -> ${poi.details}`;
            }

            entry.innerHTML = `
                <strong>Hex:</strong> ${i} <br>
                <strong>Terrain:</strong> ${terrainObj.name} <br>
                <strong>Danger Level:</strong> <span class="${danger.class}">${danger.label}</span> <br>
                <strong>POI:</strong> ${poiString}
            `;
            log.appendChild(entry);
        }
    }

    // Generate one on load
    window.onload = generateMap;
