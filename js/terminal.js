/**
 * q04tiOS - Interactive Retro Terminal
 * CLI emulator with easter eggs, neofetch, matrix mode, and fun commands!
 */

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

    this.printLine('Welcome to q04tiOS v2.4 (x86_64-indieweb-freebsd)', 'system');
    this.printLine('Type <span class="term-hl">help</span> to explore available commands.', 'info');
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

    // Focus input when terminal clicked
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
        this.printLine('Available commands:');
        this.printLine('  <span class="term-hl">about</span>      - Who is q04ti?');
        this.printLine('  <span class="term-hl">now</span>        - What I am building/reading/obsessing over');
        this.printLine('  <span class="term-hl">projects</span>   - Highlighted creations & experiments');
        this.printLine('  <span class="term-hl">skills</span>     - Tech stack, weapons of choice & quirks');
        this.printLine('  <span class="term-hl">neofetch</span>   - System specs & ASCII badge');
        this.printLine('  <span class="term-hl">music</span>      - Start/stop procedural chiptune');
        this.printLine('  <span class="term-hl">fortune</span>    - Grab a random wisdom biscuit');
        this.printLine('  <span class="term-hl">matrix</span>     - Hack the Gibson');
        this.printLine('  <span class="term-hl">cat</span>        - View a file (e.g. cat secret.txt)');
        this.printLine('  <span class="term-hl">clear</span>      - Clear terminal screen');
        this.printLine('  <span class="term-hl">contact</span>    - Ways to say hello');
        break;

      case 'about':
        this.printLine('<strong style="color: #00e5ff">q04ti</strong> (Shuaib)');
        this.printLine('Indie developer, tinkerer, and advocate for the cozy handmade web.');
        this.printLine('Believes the internet was better when websites looked like weird bedrooms instead of corporate slide decks.');
        break;

      case 'now':
        this.printLine('📍 <strong>/now status [October 2026]</strong>');
        this.printLine('• 🛠️ Building: Handmade tools, quirky browser toys, retro web experiments');
        this.printLine('• 📖 Reading: Sci-fi paperbacks & system architecture essays');
        this.printLine('• 🎧 Listening: Synthwave, Japanese city pop, ambient lo-fi chiptunes');
        this.printLine('• ☕ Fuel level: 3 cups of dark roast poured today');
        break;

      case 'projects':
        this.printLine('📁 <strong>Selected Projects:</strong>');
        this.printLine('1. <span class="term-hl">q04tiOS</span> - This very retro desktop environment you are clicking right now.');
        this.printLine('2. <span class="term-hl">PocketSynth</span> - 4-track Web Audio synthesizer & tracker.');
        this.printLine('3. <span class="term-hl">TerminalNotes</span> - Zero-bloat markdown scratchpad for midnight ideas.');
        this.printLine('4. <span class="term-hl">PixelGarden</span> - Procedural digital terrarium generator.');
        this.printLine('Open the <em>Projects</em> window from your desktop for full interactive previews!');
        break;

      case 'skills':
        this.printLine('🛠️ <strong>Craft & Arsenal:</strong>');
        this.printLine('• Languages: JavaScript (ESNext), TypeScript, Python, HTML5/CSS3, Bash');
        this.printLine('• Focus: Web Audio API, Canvas, Creative Coding, Front-End Performance');
        this.printLine('• Hardware: Mechanical keyboards with clicky blue switches, CRT monitors');
        this.printLine('• Philosophy: Light footprint, maximum personality, zero tracking.');
        break;

      case 'neofetch':
        this.printLine(`
<pre style="color: #38ef7d; line-height: 1.2; font-family: monospace;">
    ____  ___   __  ______  ____
   / __ \\/ _ \\ / / / / __ \\/ __ \\
  / /_/ / // // /_/ / /_/ / /_/ /
  \\__\\_\\\\___(_)____/\\____/\\____/ 
</pre>
<span class="term-hl">OS:</span> q04tiOS 2.4.0-indie (Web Edition)<br>
<span class="term-hl">Host:</span> Personal Cyber-Deck 2026<br>
<span class="term-hl">Uptime:</span> 42 days, 13 hours, 37 mins<br>
<span class="term-hl">Shell:</span> bash-retro 5.2<br>
<span class="term-hl">Resolution:</span> ${window.innerWidth}x${window.innerHeight}<br>
<span class="term-hl">Theme:</span> Win95 Midnight Cyber<br>
<span class="term-hl">Memory:</span> 640 KB (ought to be enough for anybody)<br>
<span class="term-hl">Vibe:</span> 100% Homemade, No Framework Bloat
        `, 'info');
        break;

      case 'cat':
        if (!args[0]) {
          this.printLine('Usage: cat &lt;filename&gt;. Try: <span class="term-hl">cat secret.txt</span>');
        } else if (args[0] === 'secret.txt' || args[0] === 'flag.txt') {
          if (window.sound) window.sound.playSecret();
          this.printLine('📜 <strong>secret.txt:</strong>', 'info');
          this.printLine('🌟 You found an easter egg! The secret code is: <span class="term-hl">↑ ↑ ↓ ↓ ← → ← → B A</span>');
          this.printLine('Type the Konami code anytime on your keyboard to unlock Hyper Disco CRT mode!');
        } else if (args[0] === 'now.log') {
          this.execute('now');
        } else {
          this.printLine(`cat: ${this.escapeHTML(args[0])}: No such file or directory`);
        }
        break;

      case 'fortune':
        const fortunes = [
          '"Any sufficiently advanced technology is indistinguishable from a really cool Geocities page."',
          '"A user interface is like a joke. If you have to explain it, it’s not that good."',
          '"Good code is its own best documentation... but a guestbook with stickers is even better."',
          '"The web was meant to be handmade. Thank you for visiting this corner of it."',
          '"Computers are fast; browsers are capable; why are modern websites so slow? Keep it simple!"'
        ];
        this.printLine(fortunes[Math.floor(Math.random() * fortunes.length)], 'info');
        break;

      case 'matrix':
        this.printLine('Entering the Matrix... Wake up, Neo.', 'system');
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
            this.printLine('Music stopped.');
          } else {
            window.sound.startMusic(0);
            this.printLine('🎶 Lo-Fi Chiptune synthesizer started! (Track: Midnight Coffee)');
          }
        }
        break;

      case 'sudo':
        this.printLine('guest is not in the sudoers file. This incident will be reported to Santa Claus.', 'error');
        break;

      case 'clear':
        this.terminalEl.innerHTML = '';
        break;

      case 'contact':
        this.printLine('📬 <strong>Get in touch:</strong>');
        this.printLine('• GitHub: <a href="https://github.com/q04ti" target="_blank" class="term-link">github.com/q04ti</a>');
        this.printLine('• Repository: <a href="https://github.com/q04ti/q04tiweb" target="_blank" class="term-link">q04ti/q04tiweb</a>');
        this.printLine('• Guestbook: Sign the Guestbook window on the desktop!');
        break;

      default:
        this.printLine(`bash: command not found: ${this.escapeHTML(command)}. Type <span class="term-hl">help</span> for commands.`, 'error');
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
