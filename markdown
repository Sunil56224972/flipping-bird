<div align="center">

# 🪽 FLIP//SIDE
### SEVEN SKIES · ONE BRAVE BIRD

**Flip gravity. Thread the rings. Phase through the impossible.**

A colorful browser arcade game with seven illustrated worlds,
gravity-switching flight, and an energy-powered phase dash.

[Explore the Worlds](#-seven-worlds) ·
[How to Play](#-how-to-play) ·
[Run Locally](#-run-locally)

<br>

![FLIPSIDE world-selection screen](docs/screenshots/menu.png)

**7 WORLDS** &nbsp; / &nbsp; **2 GRAVITY DIRECTIONS** &nbsp; / &nbsp; **1 MORE TRY**

</div>

---

## ✨ More than another pipe dodger

FLIPSIDE adds a new decision to every flight: which way should gravity pull?

Switch between normal and inverted gravity, match the glowing ring arrows,
and decide whether to save your energy or spend it on a phase dash.

- **Gravity flipping** — reverse gravity mid-flight.
- **Phase dash** — spend energy to burst through gates.
- **Polarity rings** — match their direction for double ring points.
- **Combo scoring** — chain collected rings up to a 5× multiplier.
- **Close-call bonuses** — earn extra points for narrowly clearing gates.
- **Seven illustrated environments** — distinct scenery and flight tuning.
- **Arcade and Practice modes** — chase a record or learn without game over.
- **Keyboard and touch controls** — play with keys or on-screen buttons.
- **Synthesized audio** — sound effects generated without audio downloads.
- **Local records** — best scores saved in your browser when storage is available.
- **Reduced-effects option** — tone down particles, glow, and screen shake.

The game itself uses HTML, CSS, JavaScript, Canvas 2D, and Web Audio.
There are no external runtime assets or game-engine dependencies.

## 🌍 Seven worlds

| World | Atmosphere | Flight character |
| :--- | :--- | :--- |
| **Aurora Reach** | Polar lights and icy mountains | Balanced flight |
| **Sakura Reverie** | Pink skies and drifting petals | Moving gates |
| **Sunken Cathedral** | Underwater ruins and bubbles | Softer gravity |
| **Amber Dunes** | Golden sunsets and layered dunes | Heavier gravity |
| **Thunder Citadel** | Storm clouds and distant lightning | Swaying gates |
| **Neon Afterglow** | Illuminated towers and electric skies | Faster flight |
| **Astral Garden** | Ringed planets and floating islands | Low gravity |

### Screenshots

Screenshots are captured from the running game in Practice mode.

| Aurora Reach | Sakura Reverie |
| :---: | :---: |
| ![Aurora Reach gameplay](docs/screenshots/aurora-reach.png) | ![Sakura Reverie gameplay](docs/screenshots/sakura-reverie.png) |

| Sunken Cathedral | Amber Dunes |
| :---: | :---: |
| ![Sunken Cathedral gameplay](docs/screenshots/sunken-cathedral.png) | ![Amber Dunes gameplay](docs/screenshots/amber-dunes.png) |

| Thunder Citadel | Neon Afterglow |
| :---: | :---: |
| ![Thunder Citadel gameplay](docs/screenshots/thunder-citadel.png) | ![Neon Afterglow gameplay](docs/screenshots/neon-afterglow.png) |

#### Astral Garden
![Astral Garden gameplay](docs/screenshots/astral-garden.png)

## 🎮 How to play

1. Choose a world and game mode.
2. Press **Space** or tap to launch.
3. Flap to move against the current gravity direction.
4. Fly through gates and collect their glowing rings.
5. Flip gravity to match ring arrows for bonus points.
6. Use phase dash when a gate becomes too dangerous.

### Controls

| Action | Keyboard | Mouse / touch |
| :--- | :--- | :--- |
| Flap / launch | `Space`, `W`, or `↑` | Click/tap the playfield or FLAP |
| Flip gravity | `F` | FLIP button; right-click the playfield |
| Phase dash | `D` or `Shift` | DASH button |
| Pause / resume | `P` or `Esc` | Pause / resume buttons |
| Toggle sound | `M` | Sound button |
| Retry after game over | `R` or `Space` | Fly again button |

### Scoring and energy

- **Gate cleared:** 10 points.
- **Ring collected:** 25 × current combo.
- **Matching gravity:** doubles the ring reward.
- **Maximum combo:** 5×.
- **Close call:** 15 bonus points.
- **Phase dash:** costs 40 energy.
- **Ring recharge:** 14 energy, or 22 with matching gravity.
- Energy also regenerates gradually.

> **Watch the boundaries:** phase dash protects against gates,
> not the top and bottom edges of the playfield.

### Game modes

**Arcade**  
One life. Chase a new personal best for your selected world.

**Practice**  
Collisions rescue your bird instead of ending the flight.
Practice scores do not update Arcade records.

## 🚀 Run locally

Open `index.html` in your browser.

No build step or package installation is required to play.

## 📸 Regenerate screenshots

Screenshot tooling is optional and requires Node.js.

After the initial dependency setup:

```bash
npm ci
npx playwright install chromium
npm run screenshots
```

The script captures the menu and all seven worlds into:

```text
docs/screenshots/
```

On a Linux environment missing browser system dependencies, use:

```bash
npx playwright install --with-deps chromium
```

Review the images before committing them. Animation timing and randomized
obstacles mean captures may differ between runs.

## 🧩 Project structure

```text
index.html                 Complete browser game
README.md                  Project guide and screenshot gallery
LICENSE                    Project license
scripts/screenshots.mjs    Browser screenshot automation
docs/screenshots/          Generated game screenshots
package.json               Development tooling commands
package-lock.json          Locked development dependencies
```

## 🛠️ Implementation notes

- Fixed-step game simulation at 120 updates per simulated second.
- Display-refresh rendering through requestAnimationFrame.
- Circle-versus-rectangle obstacle collision checks.
- World-specific gravity, speed, and gate movement.
- Procedurally drawn backgrounds and particles.
- Browser-generated sound effects.
- Automatic pause when the tab loses focus.
- Best-effort localStorage persistence.

## 📄 License

See [LICENSE](LICENSE).

---

<div align="center">

**Seven skies to explore. One more flight to master.**

</div>