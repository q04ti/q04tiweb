# 👾 q04tiOS — My Corner of the Personal Web

> *"A website that feels like a cozy, slightly messy late-90s desktop bedroom rather than a sterile corporate slide deck."*

![q04tiOS Desktop Preview](assets/preview.jpg)

## 🌐 Live Demo & Deployment
- **Live Demo:** [https://q04ti.github.io/q04tiweb](https://q04ti.github.io/q04tiweb)
- **Repository:** [https://github.com/q04ti/q04tiweb](https://github.com/q04ti/q04tiweb)

---

## 🧭 What's on My Site?

`q04tiOS` is an interactive retro-futuristic desktop environment and personal portfolio built from scratch with zero framework bloat. Double-click or tap the desktop icons to explore:

- **📁 About_Me.txt:** Who I am (q04ti / Shuaib), digital philosophy, skill stack, and personal quirks.
- **🚀 Projects/:** Interactive showcase of creative software, including *PocketSynth*, *TerminalNotes*, *PixelGarden*, and *q04tiOS*.
- **🕒 Now.log:** An authentic `/now` page (inspired by [nownownow.com](https://nownownow.com)) detailing what I'm currently building, reading, listening to, and drinking.
- **📝 Guestbook.exe:** A persistent local-first message board where visitors can leave notes, pick avatar stickers (👾, ☕, 💾, ✨, 🐱, 🚀), and pin them to the board.
- **🗃️ 88x31_Shelf.html:** A collection of classic indie web 88x31 badges, plus my own custom SVG pixel badge with a 1-click HTML embed copy button for friends to link back to me!
- **🎵 LoFi_Synth.exe:** An in-browser procedural chiptune synthesizer and multi-band visualizer that generates music in real time using Web Audio API oscillators—no external MP3/WAV files required!
- **🐾 CyberCat.pet:** An interactive virtual desk pet named *Mochi*. Click to pet (purr sounds + floating hearts), feed fish treats, and watch moods shift.
- **🕹️ Arcade_Mini:** A playable canvas arcade mini-game (*Cyber Brick Breaker*) with sound effects, particle sparks, and persistent high score tracking.
- **💻 Terminal.sh:** A retro CLI shell featuring interactive commands: `help`, `about`, `projects`, `skills`, `now`, `matrix`, `neofetch`, `fortune`, and secret file reading (`cat secret.txt`).
- **🎨 Multi-Theme Engine & CRT Filter:** Switch between **Cyber Dark**, **Windows 95 Classic**, **Amber CRT Phosphor**, **GameBoy Pea-Soup Mint**, and **Vaporwave Sunset** on the fly, with a toggleable CRT scanline filter.
- **🔢 GeoCities Visitor Counter:** An authentic 6-digit green phosphor LED counter in the desktop tray.

---

## 🛠️ How I Built It

- **100% Vanilla Tech Stack:** Plain HTML5, responsive CSS3, and modern JavaScript (ES6+).
- **Zero Heavy Frameworks:** No React, no Tailwind, no 50MB `node_modules` folder. The entire site weighs under 100KB (excluding images) and loads instantly (<100ms).
- **Procedural Audio via Web Audio API:** All sound effects (window clicks, purrs, swooshes, brick bounces) and the 3-track chiptune music generator are synthesized on the fly via sine, square, and triangle oscillators. No audio asset 404s ever!
- **Local-First Persistence:** Guestbook entries, game high scores, theme preferences, and pet affection counts persist seamlessly in browser `localStorage`.
- **Responsive Window Manager:** Custom pointer event handlers support smooth dragging, minimizing, maximizing, focus layering, and responsive collapse on mobile devices.

---

## 🌟 The Bit I'm Proudest Of

The **procedural Web Audio chiptune generator** (`js/audio.js`) and the **tactile window manager** (`js/windows.js`). 

Most modern portfolios use heavy embedded Spotify widgets or pre-recorded MP3 tracks that take megabytes to stream. Here, a tiny 150-line Web Audio oscillator loop generates endless ambient chiptune arpeggios, basslines, and lo-fi hi-hat ticks directly from math in real time. It pairs with the window drag mechanics to feel like an authentic, living operating system.

---

## 🗝️ Secrets & Easter Eggs

Looking for surprises? Here are a few hints:

1. **The Classic Gamer Code:** There is an ancient 10-key combination made famous on the NES (`↑ ↑ ...`). Try entering it on your keyboard anywhere on the page!
2. **Terminal Sleuthing:** Launch `Terminal.sh` and try typing `cat secret.txt`, `neofetch`, or `matrix`.
3. **Desk Companion:** What happens if you pet Mochi the CyberCat repeatedly?

---

## 🚀 Running Locally & Hosting

### Run Locally
Simply open `index.html` in any modern web browser! Or spin up a local server:
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000`.

### Deploying to GitHub Pages
1. Push this repository to GitHub:
   ```bash
   git add .
   git commit -m "Launch q04tiOS personal website"
   git push origin main
   ```
2. In your GitHub repository settings, go to **Pages**.
3. Under **Build and deployment**, set Source to **Deploy from a branch** and select `main` / `/ (root)`.
4. Your site will be live at `https://<username>.github.io/<repo-name>/`!

---

*Made with ☕ and care for the cozy indie web.*
