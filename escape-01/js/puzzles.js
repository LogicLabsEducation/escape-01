export const missionConfig = {
    title: "Space Rescue Protocol",
    puzzles: [
        {
            id: "puzzle_01",
            title: "FUEL SYSTEM REPAIR",
            prompt: "Look at the circle. It is 1/2 shaded. Which fraction is equivalent? <br><br>Target: <strong>2/4</strong>",
            hash: "MjQ=", // 24
            hint: "Count the shaded parts (2) and total parts (4). Combine them.",
            successMsg: "FUEL SYSTEM REPAIRED. TANK CAPACITY: 100%."
        },
        {
            id: "puzzle_02",
            title: "OXIDIZER CALIBRATION",
            prompt: "Multiply the numerator and denominator of 2/5 by 3.",
            hash: "NjE1", // 615
            hint: "2 x 3 = ? and 5 x 3 = ?",
            successMsg: "OXIDIZER LEVELS STABILIZED. O2 FLOW: NORMAL."
        },
        {
            id: "puzzle_03",
            title: "HYDRAULICS",
            prompt: "Simplify the fraction 10/20 to its smallest form.",
            hash: "MTI=", // 12
            hint: "Divide both top and bottom by 10.",
            successMsg: "HYDRAULIC PRESSURE RESTORED."
        },
        {
            id: "puzzle_04",
            title: "COMMS ARRAY LINK",
            prompt: "3/4 = x/12. Solve for x.",
            hash: "OQ==", // 9
            hint: "4 times what equals 12? Multiply 3 by that same number.",
            successMsg: "UPLINK ESTABLISHED. SIGNAL: STRONG."
        },
        {
            id: "puzzle_05",
            title: "NAV COMPUTER",
            prompt: "Look at the Number Line. Point A is at 1/3. Point B is at 2/6. Are they equal? (YES/NO)",
            hash: "WUVT", // YES
            hint: "Simplify 2/6. Does it equal 1/3?",
            successMsg: "COURSE PLOTTED. VECTOR ALIGNED."
        },
        {
            id: "puzzle_06",
            title: "THRUSTERS",
            prompt: "Multiply 5/6 by 2/2. What is the new fraction?",
            hash: "MTAxMg==", // 1012
            hint: "5x2 and 6x2.",
            successMsg: "THRUSTERS ENGAGED. READY FOR BURN."
        },
        {
            id: "puzzle_07",
            title: "EMERGENCY SHIELDS",
            prompt: "Which is NOT equivalent to 1/4? <br>A: 2/8<br>B: 3/12<br>C: 4/10<br>(Enter A, B, or C)",
            hash: "Qw==", // C
            hint: "Simplify each option. 4/10 simplifies to 2/5, not 1/4.",
            successMsg: "SHIELDS CHARGED. DEFENSE SYSTEMS ACTIVE."
        },
        {
            id: "puzzle_08",
            title: "LIFE SUPPORT",
            prompt: "Commander Z ate 4/8 of a space pizza. Pilot X ate 1/2. Did they eat the same? (YES/NO)",
            hash: "WUVT", // WUVT
            hint: "Is 4 half of 8?",
            successMsg: "LIFE SUPPORT OPTIMAL. CREW MORALE: HIGH."
        },
        {
            id: "puzzle_09",
            title: "LANDING GEAR",
            prompt: "Reduce 8/12 to its simplest form.",
            hash: "MjM=", // 23
            hint: "Divide both by their greatest common divisor (4).",
            successMsg: "GEAR DEPLOYMENT SYSTEMS FUNCTIONAL."
        },
        {
            id: "puzzle_10",
            title: "WARP DRIVE",
            prompt: "2/10 = x/100. Solve for x to launch the ship!",
            hash: "MjA=", // 20
            hint: "10 times 10 is 100. So 2 times 10 is...?",
            successMsg: "WARP DRIVE ACTIVE. LAUNCHING IN 3... 2... 1..."
        }
    ]
};
