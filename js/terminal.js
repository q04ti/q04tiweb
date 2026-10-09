// terminal stuff i wrote at 2am
// if something breaks just refresh lol

class RetroTerminal {
  constructor() {
    this.history = [];
    this.historyIndex = -1;
    this.terminalEl = document.getElementById('terminal-output');
    this.inputEl = document.getElementById('terminal-input');
    this.init();
  }

  init() {
    if (!this.inputEl || !this.terminalEl) return;

    this.printLine('q04tiOS v2.4 (x86_64-indieweb-edition)', 'system');
    this.printLine('type <span class="term-hl">help</span> to see what commands work.', 'info');
    this.printLine('----------------------------------------------------', 'dim');

    this.inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = this.inputEl.value.trim();
        if (cmd) {
          this.history.push(cmd);
          this.historyIndex = this.history.length;
          this.execute(cmd);
        } else {
          this.printLine(`<span class="term-prompt">guest@q04ti:~$</span> `);
        }
        this.inputEl.value = '';
        this.scrollToBottom();
      } else if (e.key === 'ArrowUp') {
        if (this.historyIndex > 0) {
          this.historyIndex--;
          this.inputEl.value = this.history[this.historyIndex];
        }
        e.preventDefault();
      } else if (e.key === 'ArrowDown') {
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          this.inputEl.value = this.history[this.historyIndex];
        } else {
          this.historyIndex = this.history.length;
          this.inputEl.value = '';
        }
        e.preventDefault();
      }
    });

    const termWin = document.getElementById('win-terminal');
    if (termWin) {
      termWin.addEventListener('click', () => {
        this.inputEl.focus();
      });
    }
  }

  printLine(html, type = 'normal') {
    const p = document.createElement('div');
    p.className = `term-line ${type}`;
    p.innerHTML = html;
    this.terminalEl.appendChild(p);
  }

  scrollToBottom() {
    const container = document.getElementById('terminal-body');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }

  execute(cmd) {
    this.printLine(`<span class="term-prompt">guest@q04ti:~$</span> <span class="term-cmd">${this.escapeHTML(cmd)}</span>`);
    const parts = cmd.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (window.sound) window.sound.playClick();

    switch (command) {
      case 'help':
      case '?':
        this.printLine('commands u can try:');
        this.printLine('  <span class="term-hl">about</span>      - who is q04ti');
        this.printLine('  <span class="term-hl">now</span>        - what im doing rn');
        this.printLine('  <span class="term-hl">projects</span>   - random things i made');
        this.printLine('  <span class="term-hl">skills</span>     - tech stuff i mess with');
        this.printLine('  <span class="term-hl">neofetch</span>   - system specs badge');
        this.printLine('  <span class="term-hl">music</span>      - toggle chiptune beats');
        this.printLine('  <span class="term-hl">fortune</span>    - random unhinged wisdom');
        this.printLine('  <span class="term-hl">matrix</span>     - enter the matrix fr');
        this.printLine('  <span class="term-hl">cat</span>        - peek at a file (cat secret.txt)');
        this.printLine('  <span class="term-hl">clear</span>      - wipe screen');
        this.printLine('  <span class="term-hl">contact</span>    - how to find me');
        break;

      case 'about':
        this.printLine('<strong style="color: #00e5ff">q04ti</strong>');
        this.printLine('just a guy coding weird stuff on the internet.');
        this.printLine('anti corporate portfolio templates, pro messy personal websites.');
        break;

      case 'now':
        this.printLine('📍 <strong>/now status [october 2026]</strong>');
        this.printLine('• 🛠️ making: this website and goofy audio tools');
        this.printLine('• 📖 reading: manga chapters i forgot to catch up on');
        this.printLine('• 🎧 listening: 80s city pop & lofi game osts');
        this.printLine('• ☕ fuel: iced coffee 24/7');
        break;

      case 'projects':
        this.printLine('📁 <strong>things i built:</strong>');
        this.printLine('1. <span class="term-hl">q04tiOS</span> - this whole fake desktop website.');
        this.printLine('2. <span class="term-hl">PocketSynth</span> - 8-bit web audio synth that makes beep boop noises.');
        this.printLine('3. <span class="term-hl">TerminalNotes</span> - local scratchpad for 3am brain dumps.');
        this.printLine('4. <span class="term-hl">PixelGarden</span> - chill pixel cellular automata.');
        this.printLine('open the <em>Projects</em> window on the desktop for the rest!');
        break;

      case 'skills':
        this.printLine('🛠️ <strong>tools & vibes:</strong>');
        this.printLine('• languages: js, ts, python, html, css, bash');
        this.printLine('• stuff i like: web audio api, canvas, creative code, fast sites');
        this.printLine('• hardware: loud mechanical keyboard that drives everyone crazy');
        break;

      case 'neofetch':
        this.printLine(`
<pre style="color: #38ef7d; line-height: 1.2; font-family: monospace;">
    ____  ___   __  ______  ____
   / __ \\/ _ \\ / / / / __ \\/ __ \\
  / /_/ / // // /_/ / /_/ / /_/ /
  \\__\\_\\\\___(_)____/\\____/\\____/ 
</pre>
<span class="term-hl">OS:</span> q04tiOS 2.4.0-indie<br>
<span class="term-hl">Host:</span> cyber-laptop 2026<br>
<span class="term-hl">Uptime:</span> too many hours without sleep<br>
<span class="term-hl">Shell:</span> bash-retro<br>
<span class="term-hl">Resolution:</span> ${window.innerWidth}x${window.innerHeight}<br>
<span class="term-hl">Theme:</span> custom retro<br>
<span class="term-hl">Memory:</span> 640 KB (more than enough fr)
        `, 'info');
        break;

      case 'cat':
        if (!args[0]) {
          this.printLine('usage: cat &lt;filename&gt;. try: <span class="term-hl">cat secret.txt</span>');
        } else if (args[0] === 'secret.txt' || args[0] === 'flag.txt') {
          if (window.sound) window.sound.playSecret();
          this.printLine('📜 <strong>secret.txt:</strong>', 'info');
          this.printLine('ok u actually found it. the konami code is: <span class="term-hl">↑ ↑ ↓ ↓ ← → ← → B A</span>');
          this.printLine('type that anywhere on your keyboard for disco mode lol');
        } else if (args[0] === 'now.log') {
          this.execute('now');
        } else {
          this.printLine(`cat: ${this.escapeHTML(args[0])}: file not found bro`);
        }
        break;

      case 'fortune':
        const fortunes = [
          '"bro the web was meant to be fun stop making sterile dashboards."',
          '"if it works dont touch it."',
          '"caffeine is basically an essential nutrient at this point."',
          '"websites with 30 megabytes of javascript should be illegal."',
          '"pet the cyber cat mochi or your code will throw a TypeError."'
        ];
        this.printLine(fortunes[Math.floor(Math.random() * fortunes.length)], 'info');
        break;

      case 'matrix':
        this.printLine('hacking the gibson fr...', 'system');
        const crt = document.getElementById('crt-overlay');
        if (crt) {
          crt.classList.add('matrix-active');
          setTimeout(() => crt.classList.remove('matrix-active'), 5000);
        }
        break;

      case 'music':
        if (window.sound) {
          if (window.sound.isPlayingMusic) {
            window.sound.stopMusic();
            this.printLine('music stopped.');
          } else {
            window.sound.startMusic(0);
            this.printLine('🎶 synth playing: Midnight Coffee');
          }
        }
        break;

      case 'sudo':
        this.printLine('nice try lol permission denied', 'error');
        break;

      case 'clear':
        this.terminalEl.innerHTML = '';
        break;

      case 'contact':
        this.printLine('📬 <strong>say hi:</strong>');
        this.printLine('• github: <a href="https://github.com/q04ti" target="_blank" class="term-link">github.com/q04ti</a>');
        this.printLine('• repo: <a href="https://github.com/q04ti/q04tiweb" target="_blank" class="term-link">q04ti/q04tiweb</a>');
        this.printLine('• or just sign the guestbook on the desktop!');
        break;

      default:
        this.printLine(`command not found: ${this.escapeHTML(command)}. type <span class="term-hl">help</span>`, 'error');
        break;
    }
  }

  escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }
}

window.retroTerminal = null;
