/* PATCHWING: TEN-WORLD EXPANSION */
{
    const worlds = [
        {
            name: "Bramble Orchard", icon: "🌳", type: "original",
            sky: "#dce0c9", horizon: "#eee4c8",
            far: "#afb992", ground: "#9eae80", accent: "#af5844"
        },
        {
            name: "Sunny Meadows", icon: "🌼", type: "meadow",
            sky: "#76caff", horizon: "#fff0b8",
            far: "#93d79c", ground: "#4c9a72", accent: "#ffe184"
        },
        {
            name: "Neon City", icon: "🌃", type: "city",
            sky: "#111331", horizon: "#693b91",
            far: "#282852", ground: "#161c37", accent: "#67f4eb"
        },
        {
            name: "Enchanted Forest", icon: "🍄", type: "forest",
            sky: "#112d38", horizon: "#487669",
            far: "#254d51", ground: "#153f40", accent: "#afffc4"
        },
        {
            name: "Desert Oasis", icon: "🏜️", type: "desert",
            sky: "#eeab82", horizon: "#ffe4a3",
            far: "#dba365", ground: "#bb784f", accent: "#fff1be"
        },
        {
            name: "Winter Wonderland", icon: "❄️", type: "snow",
            sky: "#719cc9", horizon: "#e8f5ff",
            far: "#aac9df", ground: "#e2f0f5", accent: "#ffffff"
        },
        {
            name: "Underwater Kingdom", icon: "🪸", type: "ocean",
            sky: "#083e71", horizon: "#37b9bd",
            far: "#176e88", ground: "#135c70", accent: "#ffa7c7"
        },
        {
            name: "Volcano Valley", icon: "🌋", type: "volcano",
            sky: "#291e3a", horizon: "#bf6257",
            far: "#583247", ground: "#352838", accent: "#ffbc65"
        },
        {
            name: "Candy Land", icon: "🍭", type: "candy",
            sky: "#c4acfa", horizon: "#ffe2eb",
            far: "#e9acd4", ground: "#bc87c2", accent: "#fff1ad"
        },
        {
            name: "Outer Space", icon: "🪐", type: "space",
            sky: "#090d28", horizon: "#383269",
            far: "#343363", ground: "#202442", accent: "#c9b4ff"
        },
        {
            name: "Sunset Islands", icon: "🌴", type: "islands",
            sky: "#e684a3", horizon: "#ffcf9a",
            far: "#718eaa", ground: "#386d80", accent: "#ffe1a3"
        }
    ];

    const levels = {
        easy: { rate: 0.85, gap: 34 },
        normal: { rate: 1, gap: 0 },
        hard: { rate: 1.16, gap: -28 }
    };

    const storageKey = "patchwing-worlds-v1";
    let profile = { map: 0, difficulty: "normal", records: {} };

    try {
        const loaded = JSON.parse(localStorage.getItem(storageKey));
        if (loaded && typeof loaded === "object") {
            if (Number.isInteger(loaded.map) &&
                loaded.map >= 0 && loaded.map < worlds.length) {
                profile.map = loaded.map;
            }
            if (Object.hasOwn(levels, loaded.difficulty)) {
                profile.difficulty = loaded.difficulty;
            }
            if (loaded.records && typeof loaded.records === "object" &&
                !Array.isArray(loaded.records)) {
                profile.records = loaded.records;
            }
        }
    } catch (_) { }

    let shield = 1;
    let protection = 0;
    let combo = 0;
    let highestCombo = 0;

    const original = {
        start, simulate, crash, finish, updateHUD,
        scenery, foreground, trunk, drawBird
    };

    const currentWorld = () => worlds[profile.map];
    const recordKey = () => `${profile.map}:${profile.difficulty}`;

    function record() {
        const value = Number(profile.records[recordKey()]);
        return Number.isFinite(value) && value >= 0 ? value : 0;
    }

    function saveProfile() {
        try {
            localStorage.setItem(storageKey, JSON.stringify(profile));
        } catch (_) {
            // Playing still works when browser storage is unavailable.
        }
    }

    /* ---------- MENU ---------- */

    const style = document.createElement("style");
    style.textContent = `
        #worldOptions {
            margin: 18px 0;
            display: grid;
            gap: 12px;
        }
        #worldOptions label {
            display: grid;
            gap: 6px;
            font: 12px/1.5 monospace;
            color: #594d3c;
        }
        #worldOptions select {
            width: 100%;
            padding: 11px;
            border: 1px solid #9b8969;
            border-radius: 8px;
            background: #fff7e7;
            color: #413e33;
            font: 14px Georgia, serif;
        }
        #worldOptions select:focus-visible {
            outline: 3px solid #ae5140;
            outline-offset: 3px;
        }
        #worldPreview {
            padding: 14px;
            border-radius: 10px;
            color: white;
            text-shadow: 0 1px 4px #000;
            border: 1px solid #ffffff70;
            font: 14px/1.6 Georgia, serif;
        }
        #hint {
            color: #413e33;
            background: #fff4dce8;
            border-radius: 10px;
            padding: 7px;
            width: fit-content;
            max-width: calc(100% - 32px);
            margin: auto;
        }
    `;
    document.head.appendChild(style);

    const options = document.createElement("div");
    options.id = "worldOptions";
    options.innerHTML = `
        <label>
            Delivery destination
            <select id="worldSelect"></select>
        </label>
        <label>
            Difficulty
            <select id="levelSelect">
                <option value="easy">Easy — relaxed flight</option>
                <option value="normal">Normal — original pace</option>
                <option value="hard">Hard — faster, narrower gates</option>
            </select>
        </label>
        <div id="worldPreview"></div>
    `;

    document.querySelector("#menu .actions").before(options);

    worlds.forEach((world, index) => {
        $("worldSelect").add(
            new Option(`${world.icon} ${world.name}`, String(index))
        );
    });

    $("worldSelect").value = String(profile.map);
    $("levelSelect").value = profile.difficulty;

    // Let native select controls handle their own keyboard navigation.
    options.addEventListener("keydown", event => event.stopPropagation());

    function refreshSelection() {
        const world = currentWorld();
        best = record();
        $("best").textContent = best;

        const preview = $("worldPreview");
        preview.style.background =
            `linear-gradient(125deg, ${world.sky}, ${world.ground})`;
        preview.textContent =
            `${world.icon} ${world.name} · Best: ${best} · One shield per flight`;

        saveProfile();
    }

    $("worldSelect").onchange = event => {
        profile.map = Number(event.target.value);
        refreshSelection();
    };

    $("levelSelect").onchange = event => {
        profile.difficulty = event.target.value;
        refreshSelection();
    };

    const nextButton = document.createElement("button");
    nextButton.className = "button";
    nextButton.textContent = "Next map →";
    nextButton.hidden = true;
    document.querySelector("#finished .actions").appendChild(nextButton);

    nextButton.onclick = () => {
        profile.map = (profile.map + 1) % worlds.length;
        $("worldSelect").value = String(profile.map);
        refreshSelection();
        start();
    };

    /* ---------- GAMEPLAY ---------- */

    start = function () {
        shield = 1;
        protection = 0;
        combo = 0;
        highestCombo = 0;
        best = record();
        nextButton.hidden = true;

        original.start();

        const difficulty = levels[profile.difficulty];

        gates.forEach(gate => {
            gate.gap = clamp(gate.gap + difficulty.gap, 190, 340);

            // Each destination gets a slightly different route.
            if (profile.map > 0) {
                gate.y += Math.sin(
                    gate.index * 1.45 + profile.map * 0.7
                ) * 28;
            }

            gate.y = clamp(
                gate.y,
                TOP + gate.gap / 2 + 24,
                BOTTOM - gate.gap / 2 - 24
            );
        });

        updateHUD();
        hint(`${currentWorld().name} — tap or press Space to fly.`, 999);
    };

    updateHUD = function () {
        original.updateHUD();
        $("score").textContent = `${letters} letters · ${points} pts`;
        $("progress").textContent =
            `${currentWorld().name} · ${gateCount}/${ROUTE.length}` +
            ` · ${shield ? "Shield ready" : "Shield used"}` +
            (combo > 1 ? ` · ${combo}× combo` : "");
    };

    simulate = function (dt) {
        if (state !== "playing") return;

        const scaled = dt * levels[profile.difficulty].rate;
        protection = Math.max(0, protection - scaled);

        const previousLetters = letters;
        const previousPassed = gateCount;

        original.simulate(scaled);

        if (letters > previousLetters) {
            combo = Math.min(combo + 1, 5);
            highestCombo = Math.max(highestCombo, combo);

            // The original game already awards the first 25 points.
            points += (combo - 1) * 25;

            if (combo > 1) {
                hint(`${combo}× delivery combo!`, 1.3);
            }
        }

        if (gateCount > previousPassed &&
            gates.some(gate =>
                gate.passed && !gate.collected && !gate.comboChecked
            )) {
            combo = 0;
        }

        gates.forEach(gate => {
            if (gate.passed) gate.comboChecked = true;
        });

        updateHUD();
    };

    crash = function () {
        if (state !== "playing") return;

        if (shield > 0 || protection > 0) {
            if (protection <= 0) {
                shield = 0;
                protection = 1.2;
                combo = 0;
                hint("Shield saved you! Fly carefully.", 2.5);
                note(620, 0.2, 0.04, 930);
            }

            const nearby = gates.find(gate =>
                Math.abs(gate.x - bird.x) < 75
            );

            bird.y = nearby
                ? nearby.y
                : clamp(bird.y, TOP + 70, BOTTOM - 70);

            bird.vy = 0;
            updateHUD();
            return;
        }

        original.crash();
    };

    finish = function (won) {
        original.finish(won);

        profile.records[recordKey()] = Math.max(record(), points);
        best = profile.records[recordKey()];
        saveProfile();

        $("bestResult").textContent = best;
        $("best").textContent = best;
        nextButton.hidden = !won;

        const medal = letters === ROUTE.length
            ? "🥇 Gold"
            : letters >= Math.ceil(ROUTE.length * 0.75)
                ? "🥈 Silver"
                : "🥉 Bronze";

        $("resultEyebrow").textContent = won
            ? `${medal} delivery — ${currentWorld().name}`
            : `${currentWorld().name} — try again`;

        $("resultText").textContent = won
            ? `Delivered ${letters}/${ROUTE.length} letters! ` +
            `Best combo: ${highestCombo}×. Choose another destination below.`
            : `You rescued ${letters} letters and scored ${points} points. ` +
            `Try another route, or switch to Easy in the menu.`;

        refreshSelection();
    };

    /* ---------- MAP ART ---------- */

    function disc(x, y, radius, color) {
        c.beginPath();
        c.arc(x, y, radius, 0, TAU);
        c.fillStyle = color;
        c.fill();
    }

    function triangle(x, bottom, width, height, color) {
        c.beginPath();
        c.moveTo(x - width / 2, bottom);
        c.lineTo(x, bottom - height);
        c.lineTo(x + width / 2, bottom);
        c.closePath();
        c.fillStyle = color;
        c.fill();
    }

    scenery = function () {
        const world = currentWorld();
        if (world.type === "original") {
            original.scenery();
            return;
        }

        c.save();

        const sky = c.createLinearGradient(0, 0, 0, H);
        sky.addColorStop(0, world.sky);
        sky.addColorStop(1, world.horizon);
        c.fillStyle = sky;
        c.fillRect(0, 0, W, H);

        const t = reduced ? 0 : time;
        const night = ["city", "forest", "space"].includes(world.type);

        // Stars or distant points of light.
        if (night) {
            for (let i = 0; i < 65; i++) {
                const x = seed(i + 150) * W;
                const y = 50 + seed(i + 420) * 420;
                c.globalAlpha = 0.4 + 0.3 * Math.sin(t + i);
                disc(x, y, 1 + seed(i + 80), world.accent);
            }
            c.globalAlpha = 1;
        }

        if (world.type !== "ocean") {
            disc(W * 0.78, 142, 45, world.accent);
        }

        if (world.type === "space") {
            c.strokeStyle = "#e0cbff99";
            c.lineWidth = 8;
            c.beginPath();
            c.ellipse(W * 0.78, 142, 77, 18, -0.35, 0, TAU);
            c.stroke();
            disc(W * 0.19, 255, 24, "#87a9db");
        }

        if (["meadow", "desert", "snow", "candy", "islands"]
            .includes(world.type)) {
            c.globalAlpha = 0.6;
            for (let i = 0; i < 5; i++) {
                cloud(
                    mod(i * 285 - scroll * 0.08, W + 300) - 150,
                    100 + seed(i + 4) * 150,
                    0.55 + seed(i + 12) * 0.4
                );
            }
            c.globalAlpha = 1;
        }

        hill(465, 40, world.far, 0.12, profile.map);
        hill(555, 28, world.ground, 0.25, profile.map + 2);

        const spacing = world.type === "city" ? 105 : 220;
        const count = Math.ceil(W / spacing) + 3;

        for (let i = -1; i < count; i++) {
            const id = i + Math.floor(scroll * 0.2 / spacing);
            const x = i * spacing - mod(scroll * 0.2, spacing);
            const height = 110 + seed(id + 70) * 130;
            const base = 570;

            switch (world.type) {
                case "city":
                    c.fillStyle = world.far;
                    c.fillRect(x, base - height, 74, height);
                    c.fillStyle = world.accent;
                    for (let row = 0; row < 7; row++) {
                        for (let col = 0; col < 3; col++) {
                            if (seed(id * 40 + row * 3 + col) > 0.35) {
                                c.fillRect(
                                    x + 10 + col * 21,
                                    base - height + 14 + row * 24,
                                    8, 10
                                );
                            }
                        }
                    }
                    break;

                case "forest":
                    c.fillStyle = "#173a3d";
                    c.fillRect(x - 9, base - height, 18, height);
                    disc(x, base - height, 58, "#315e59");
                    disc(x - 35, base - height + 27, 40, "#3c7265");
                    disc(x + 36, base - height + 20, 44, "#244b4d");
                    c.fillStyle = "#e4cfb0";
                    c.fillRect(x + 57, base - 28, 8, 28);
                    disc(x + 61, base - 30, 19, "#d784a3");
                    break;

                case "desert":
                    triangle(x, base, 230, height, "#c48b5f");
                    triangle(x + 25, base, 125, height * 0.8, "#e1ae74");
                    break;

                case "snow":
                    triangle(x, base, 265, height + 80, "#8baecb");
                    triangle(x, base - height - 13, 95, 67, "#f3fbff");
                    break;

                case "volcano":
                    triangle(x, base, 250, height, "#503344");
                    triangle(x, base - height + 45, 70, 45, "#ffc078");
                    line(x, base - height + 36, x + 36, base, "#ed8158", 6);
                    break;

                case "candy":
                    line(x, base, x, base - height, "#fff4df", 9);
                    disc(x, base - height, 43, "#fff0d5");
                    disc(x, base - height, 32, "#ee8fbd");
                    disc(x, base - height, 20, "#b7a4ed");
                    disc(x, base - height, 8, "#fff0d5");
                    break;

                case "ocean":
                    for (let branch = -2; branch <= 2; branch++) {
                        line(x, base, x + branch * 19,
                            base - 50 - seed(id + branch + 90) * 55,
                            world.accent, 7);
                    }
                    break;

                case "islands":
                    oval(x, base, 92, 19, "#ead2a2");
                    line(x, base, x + 13, base - 120, "#765744", 10);
                    for (let branch = 0; branch < 6; branch++) {
                        const angle = branch * TAU / 6;
                        line(
                            x + 13, base - 120,
                            x + 13 + Math.cos(angle) * 61,
                            base - 120 + Math.sin(angle) * 28,
                            "#406e60", 9
                        );
                    }
                    break;

                case "meadow":
                    for (let flower = 0; flower < 5; flower++) {
                        const fx = x + flower * 28;
                        const fy = base - 12 - seed(id + flower + 20) * 32;
                        line(fx, base + 12, fx, fy, "#39795e", 2);
                        for (let petal = 0; petal < 5; petal++) {
                            disc(
                                fx + Math.cos(petal * TAU / 5) * 5,
                                fy + Math.sin(petal * TAU / 5) * 5,
                                4, "#fff0ce"
                            );
                        }
                        disc(fx, fy, 3, "#e8aa57");
                    }
                    break;

                case "space":
                    oval(x, base - height, 47, 14, "#6b6592");
                    triangle(x, base - height + 38, 65, 35, "#48446d");
                    break;
            }
        }

        // Ambient snow, bubbles, petals, fireflies, or embers.
        const amount = reduced ? 10 : 30;
        for (let i = 0; i < amount; i++) {
            const x = mod(
                seed(i + 900) * (W + 40) - t * 8,
                W + 40
            ) - 20;

            const upward = ["ocean", "volcano"].includes(world.type);
            const y = mod(
                seed(i + 1100) * 560 + t * (upward ? -18 : 12),
                560
            ) + 45;

            c.globalAlpha = world.type === "snow" ? 0.8 : 0.4;

            if (world.type === "ocean") {
                c.strokeStyle = "#b9f8ff";
                c.lineWidth = 1;
                c.beginPath();
                c.arc(x, y, 3 + seed(i + 9) * 5, 0, TAU);
                c.stroke();
            } else {
                disc(x, y, 1 + seed(i + 33) * 2, world.accent);
            }
        }

        c.globalAlpha = 1;
        line(0, TOP, W, TOP, "#ffffff55", 1);
        c.restore();
    };

    foreground = function () {
        if (currentWorld().type === "original") {
            original.foreground();
            return;
        }

        c.save();
        const world = currentWorld();

        c.fillStyle = world.ground;
        c.fillRect(0, BOTTOM, W, H - BOTTOM);
        line(0, BOTTOM, W, BOTTOM, world.accent, 3);

        if (["ocean", "islands", "volcano"].includes(world.type)) {
            c.globalAlpha = 0.45;
            for (let i = 0; i < 22; i++) {
                const x = mod(i * 83 - scroll * 0.4, W + 100) - 50;
                line(x, BOTTOM + 20 + (i % 3) * 19,
                    x + 43, BOTTOM + 20 + (i % 3) * 19,
                    world.accent, 2);
            }
        }

        c.globalAlpha = 0.22;
        c.fillStyle = paperPattern;
        c.fillRect(0, 0, W, H);
        c.restore();
    };

    trunk = function (x, tip, upper, id) {
        if (currentWorld().type === "original") {
            original.trunk(x, tip, upper, id);
            return;
        }

        const world = currentWorld();
        const top = upper ? -50 : tip;
        const height = upper ? tip + 50 : H - tip;

        c.save();
        c.fillStyle = world.ground;
        c.fillRect(x - 18, top, 36, height);
        c.strokeStyle = world.accent;
        c.lineWidth = 2;
        c.strokeRect(x - 18, top, 36, height);

        c.fillStyle = world.accent;
        c.globalAlpha = 0.7;
        c.fillRect(x - 21, upper ? tip - 9 : tip, 42, 9);

        c.globalAlpha = 0.25;
        for (let y = top + 18; y < top + height - 10; y += 28) {
            c.fillRect(x - 11, y, 22, 3);
        }
        c.restore();
    };

    drawBird = function (x, y, demo = false) {
        if (!demo && (shield > 0 || protection > 0)) {
            c.save();
            c.strokeStyle = protection > 0 ? "#ffffff" : "#86e6f2";
            c.lineWidth = protection > 0 ? 3 : 1.5;
            c.globalAlpha = protection > 0 ? 0.85 : 0.5;
            c.beginPath();
            c.arc(x, y, 43, 0, TAU);
            c.stroke();
            c.restore();
        }

        original.drawBird(x, y, demo);
    };

    refreshSelection();
}
/* END TEN-WORLD EXPANSION */