// q04tiOS script - everything in one file so it's simple

// ==================== AUDIO SYNTH ====================
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('q04ti_sound_muted') === 'true';
    this.isPlayingMusic = false;
    this.musicTimer = null;
    this.currentTrack = 0;
    this.bpm = 92;
    this.step = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('q04ti_sound_muted', this.muted);
    if (this.muted && this.isPlayingMusic) {
      this.stopMusic();
    }
    return this.muted;
  }

  playClick() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.03);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.03);
  }

  playOpen() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(640, now + 0.08);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  playClose() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(540, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.07);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.07);
  }

  playSecret() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = now + i * 0.08;

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.06, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.12);
    });
  }

  playPetPurr() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.linearRampToValueAtTime(110, now + 0.1);
    osc.frequency.linearRampToValueAtTime(75, now + 0.2);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  startMusic(trackIndex = 0) {
    this.init();
    if (this.muted || !this.ctx) return;
    this.stopMusic();
    this.isPlayingMusic = true;
    this.currentTrack = trackIndex;
    this.step = 0;

    const tracks = [
      {
        name: "Midnight Coffee",
        bpm: 88,
        bass: [110, 110, 130.81, 146.83, 110, 110, 98, 110],
        melody: [440, 0, 523.25, 587.33, 659.25, 587.33, 523.25, 0, 440, 523.25, 659.25, 0, 587.33, 523.25, 440, 392],
      },
      {
        name: "Neon Dreamer",
        bpm: 104,
        bass: [130.81, 130.81, 164.81, 164.81, 174.61, 174.61, 146.83, 146.83],
        melody: [523.25, 659.25, 783.99, 659.25, 698.46, 880, 698.46, 587.33, 523.25, 783.99, 659.25, 523.25, 587.33, 659.25, 587.33, 0],
      },
      {
        name: "8-Bit Breeze",
        bpm: 118,
        bass: [98, 110, 123.47, 130.81],
        melody: [392, 440, 493.88, 523.25, 587.33, 523.25, 493.88, 440],
      }
    ];

    const current = tracks[this.currentTrack % tracks.length];
    const stepDuration = (60 / current.bpm) / 2;

    const tick = () => {
      if (!this.isPlayingMusic || this.muted) return;
      const now = this.ctx.currentTime;

      const bassFreq = current.bass[Math.floor(this.step / 2) % current.bass.length];
      if (this.step % 2 === 0 && bassFreq > 0) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'triangle';
        bassOsc.frequency.setValueAtTime(bassFreq, now);

        bassGain.gain.setValueAtTime(0.04, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + stepDuration * 1.5);

        bassOsc.connect(bassGain);
        bassGain.connect(this.ctx.destination);
        bassOsc.start(now);
        bassOsc.stop(now + stepDuration * 1.5);
      }

      const melFreq = current.melody[this.step % current.melody.length];
      if (melFreq > 0) {
        const melOsc = this.ctx.createOscillator();
        const melGain = this.ctx.createGain();
        melOsc.type = 'square';
        melOsc.frequency.setValueAtTime(melFreq, now);

        melGain.gain.setValueAtTime(0.025, now);
        melGain.gain.exponentialRampToValueAtTime(0.001, now + stepDuration * 0.9);

        melOsc.connect(melGain);
        melGain.connect(this.ctx.destination);
        melOsc.start(now);
        melOsc.stop(now + stepDuration * 0.9);
      }

      if (this.step % 2 === 1) {
        this.playNoiseTick(now);
      }

      this.step++;
      if (window.onMusicStep) {
        window.onMusicStep(this.step % 16, melFreq > 0);
      }

      this.musicTimer = setTimeout(tick, stepDuration * 1000);
    };

    tick();
  }

  playNoiseTick(now) {
    try {
      const bufferSize = this.ctx.sampleRate * 0.02;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(7000, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.015, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      whiteNoise.start(now);
      whiteNoise.stop(now + 0.02);
    } catch (e) {}
  }

  stopMusic() {
    this.isPlayingMusic = false;
    if (this.musicTimer) {
      clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
    if (window.onMusicStop) {
      window.onMusicStop();
    }
  }
}
window.sound = new SoundEngine();

// ==================== WINDOW MANAGER ====================
class WindowManager {
  constructor() {
    this.windows = new Map();
    this.highestZ = 100;
    this.activeWindowId = null;
    this.init();
  }

  init() {
    document.querySelectorAll('.os-window').forEach((winEl) => {
      const id = winEl.id;
      this.windows.set(id, {
        element: winEl,
        isMinimized: winEl.classList.contains('hidden'),
        isMaximized: false,
        prevRect: null
      });

      this.setupDragging(winEl);
      this.setupControls(winEl);

      winEl.addEventListener('pointerdown', () => {
        this.focusWindow(id);
      });
    });

    document.addEventListener('pointerdown', (e) => {
      const startMenu = document.getElementById('start-menu');
      const startBtn = document.getElementById('start-btn');
      if (startMenu && !startMenu.contains(e.target) && !startBtn.contains(e.target)) {
        startMenu.classList.add('hidden');
        startBtn.classList.remove('active');
      }
    });
  }

  setupDragging(winEl) {
    const titleBar = winEl.querySelector('.window-titlebar');
    if (!titleBar) return;

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initialLeft = 0;
    let initialTop = 0;

    titleBar.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.window-btn')) return;

      const id = winEl.id;
      const winData = this.windows.get(id);
      if (winData && winData.isMaximized) return;

      isDragging = true;
      this.focusWindow(id);

      titleBar.setPointerCapture(e.pointerId);

      const rect = winEl.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;
      initialLeft = rect.left;
      initialTop = rect.top;

      titleBar.style.cursor = 'grabbing';
      e.preventDefault();
    });

    titleBar.addEventListener('pointermove', (e) => {
      if (!isDragging) return;

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      let newLeft = initialLeft + deltaX;
      let newTop = initialTop + deltaY;

      const maxLeft = window.innerWidth - 60;
      const maxTop = window.innerHeight - 80;
      newLeft = Math.max(-100, Math.min(newLeft, maxLeft));
      newTop = Math.max(10, Math.min(newTop, maxTop));

      winEl.style.left = `${newLeft}px`;
      winEl.style.top = `${newTop}px`;
      winEl.style.transform = 'none';
    });

    const endDrag = (e) => {
      if (!isDragging) return;
      isDragging = false;
      titleBar.style.cursor = 'grab';
      try {
        titleBar.releasePointerCapture(e.pointerId);
      } catch (err) {}
    };

    titleBar.addEventListener('pointerup', endDrag);
    titleBar.addEventListener('pointercancel', endDrag);
  }

  setupControls(winEl) {
    const id = winEl.id;

    const closeBtn = winEl.querySelector('.btn-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeWindow(id);
      });
    }

    const minBtn = winEl.querySelector('.btn-minimize');
    if (minBtn) {
      minBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.minimizeWindow(id);
      });
    }

    const maxBtn = winEl.querySelector('.btn-maximize');
    if (maxBtn) {
      maxBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMaximize(id);
      });
    }
  }

  openWindow(id) {
    const winData = this.windows.get(id);
    if (!winData) return;

    if (window.sound) window.sound.playOpen();

    winData.element.classList.remove('hidden');
    winData.isMinimized = false;
    this.focusWindow(id);
    this.updateTaskbar();

    if (window.innerWidth < 640) {
      winData.element.style.top = '20px';
      winData.element.style.left = '10px';
      winData.element.style.transform = 'none';
    }
  }

  closeWindow(id) {
    const winData = this.windows.get(id);
    if (!winData) return;

    if (window.sound) window.sound.playClose();

    winData.element.classList.add('hidden');
    if (this.activeWindowId === id) {
      this.activeWindowId = null;
    }
    this.updateTaskbar();
  }

  minimizeWindow(id) {
    const winData = this.windows.get(id);
    if (!winData) return;

    if (window.sound) window.sound.playClick();

    winData.isMinimized = true;
    winData.element.classList.add('hidden');
    if (this.activeWindowId === id) {
      this.activeWindowId = null;
    }
    this.updateTaskbar();
  }

  toggleMaximize(id) {
    const winData = this.windows.get(id);
    if (!winData) return;

    if (window.sound) window.sound.playClick();

    if (!winData.isMaximized) {
      winData.prevRect = {
        top: winData.element.style.top,
        left: winData.element.style.left,
        width: winData.element.style.width,
        height: winData.element.style.height,
        transform: winData.element.style.transform
      };
      winData.element.classList.add('maximized');
      winData.isMaximized = true;
    } else {
      winData.element.classList.remove('maximized');
      if (winData.prevRect) {
        winData.element.style.top = winData.prevRect.top;
        winData.element.style.left = winData.prevRect.left;
        winData.element.style.width = winData.prevRect.width;
        winData.element.style.height = winData.prevRect.height;
        winData.element.style.transform = winData.prevRect.transform;
      }
      winData.isMaximized = false;
    }
  }

  focusWindow(id) {
    const winData = this.windows.get(id);
    if (!winData) return;

    this.highestZ += 2;
    winData.element.style.zIndex = this.highestZ;

    document.querySelectorAll('.os-window').forEach(w => w.classList.remove('active-window'));
    winData.element.classList.add('active-window');
    this.activeWindowId = id;
    this.updateTaskbar();
  }

  updateTaskbar() {
    const taskbarTasks = document.getElementById('taskbar-tasks');
    if (!taskbarTasks) return;

    taskbarTasks.innerHTML = '';

    this.windows.forEach((data, id) => {
      const isHidden = data.element.classList.contains('hidden');
      if (!isHidden || data.isMinimized) {
        const title = data.element.querySelector('.window-title')?.innerText || id;
        const iconSvg = data.element.dataset.icon || '📁';

        const btn = document.createElement('button');
        btn.className = `task-button ${this.activeWindowId === id && !data.isMinimized ? 'active' : ''}`;
        btn.innerHTML = `<span class="task-icon">${iconSvg}</span> <span class="task-name">${title}</span>`;
        btn.addEventListener('click', () => {
          if (data.isMinimized) {
            this.openWindow(id);
          } else if (this.activeWindowId === id) {
            this.minimizeWindow(id);
          } else {
            this.focusWindow(id);
          }
        });
        taskbarTasks.appendChild(btn);
      }
    });
  }
}

// ==================== GUESTBOOK ====================
class Guestbook {
  constructor() {
    this.storageKey = 'q04ti_guestbook_entries';
    this.stickers = ['👾', '☕', '💾', '✨', '🐱', '🍕', '🚀', '💿', '🎸', '🕹️'];
    this.selectedSticker = '👾';
    this.init();
  }

  getInitialEntries() {
    return [
      {
        id: 1,
        author: 'neon_drifter',
        website: 'drifter.neocities.org',
        message: 'stumbled here from a random webring lol loving the 8-bit beats signed your book!',
        date: '2026-09-28',
        sticker: '💿',
        badgeColor: '#ff007f'
      },
      {
        id: 2,
        author: 'CassetteKid',
        website: 'tapeheads.zone',
        message: 'stole your 88x31 button for my site no cap. keep the web weird bro',
        date: '2026-10-02',
        sticker: '☕',
        badgeColor: '#00e5ff'
      },
      {
        id: 3,
        author: 'PixelMina',
        website: 'mina.garden',
        message: 'pet your cyber cat like 20 times in a row. best desk buddy ever fr',
        date: '2026-10-06',
        sticker: '🐱',
        badgeColor: '#7000ff'
      }
    ];
  }

  getEntries() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return this.getInitialEntries();
  }

  saveEntries(entries) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(entries));
    } catch (e) {}
  }

  init() {
    this.renderStickerPicker();
    this.renderEntries();
    this.bindEvents();
  }

  renderStickerPicker() {
    const container = document.getElementById('sticker-picker');
    if (!container) return;

    container.innerHTML = '';
    this.stickers.forEach((sticker) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `sticker-opt ${this.selectedSticker === sticker ? 'active' : ''}`;
      btn.innerText = sticker;
      btn.title = `Sticker ${sticker}`;
      btn.addEventListener('click', () => {
        this.selectedSticker = sticker;
        if (window.sound) window.sound.playClick();
        document.querySelectorAll('.sticker-opt').forEach(el => el.classList.remove('active'));
        btn.classList.add('active');
      });
      container.appendChild(btn);
    });
  }

  renderEntries() {
    const list = document.getElementById('guestbook-list');
    if (!list) return;

    const entries = this.getEntries();
    list.innerHTML = '';

    if (entries.length === 0) {
      list.innerHTML = '<div class="guestbook-empty">empty board rn. drop a note!</div>';
      return;
    }

    entries.slice().reverse().forEach((entry) => {
      const card = document.createElement('div');
      card.className = 'guestbook-card';
      card.style.borderColor = entry.badgeColor || '#38ef7d';

      const websiteHtml = entry.website ? `<a href="https://${entry.website.replace(/^https?:\/\//, '')}" target="_blank" rel="noopener" class="guest-link">🌐 ${this.escapeHTML(entry.website)}</a>` : '';

      card.innerHTML = `
        <div class="card-header">
          <div class="card-author">
            <span class="card-sticker">${entry.sticker || '👾'}</span>
            <strong>${this.escapeHTML(entry.author)}</strong>
          </div>
          <span class="card-date">${entry.date || 'recent'}</span>
        </div>
        <div class="card-body">
          <p>${this.escapeHTML(entry.message)}</p>
        </div>
        ${websiteHtml ? `<div class="card-footer">${websiteHtml}</div>` : ''}
      `;
      list.appendChild(card);
    });

    const countEl = document.getElementById('guestbook-count');
    if (countEl) countEl.innerText = `${entries.length} notes`;
  }

  bindEvents() {
    const form = document.getElementById('guestbook-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const authorInput = document.getElementById('guest-name');
      const websiteInput = document.getElementById('guest-site');
      const messageInput = document.getElementById('guest-msg');

      const author = authorInput.value.trim() || 'rando internet traveler';
      const website = websiteInput.value.trim();
      const message = messageInput.value.trim();

      if (!message) {
        alert('write something first bro lol');
        return;
      }

      const colors = ['#00e5ff', '#ff007f', '#38ef7d', '#ffe600', '#bd00ff'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const today = new Date().toISOString().split('T')[0];

      const newEntry = {
        id: Date.now(),
        author: author,
        website: website,
        message: message,
        date: today,
        sticker: this.selectedSticker,
        badgeColor: randomColor
      };

      const entries = this.getEntries();
      entries.push(newEntry);
      this.saveEntries(entries);

      if (window.sound) window.sound.playSecret();
      messageInput.value = '';
      this.renderEntries();

      const statusMsg = document.getElementById('guest-status');
      if (statusMsg) {
        statusMsg.innerText = '✨ pinned to the board!';
        setTimeout(() => { statusMsg.innerText = ''; }, 3500);
      }
    });

    const resetBtn = document.getElementById('guestbook-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('reset guestbook back to default notes?')) {
          localStorage.removeItem(this.storageKey);
          this.renderEntries();
        }
      });
    }
  }

  escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }
}

// ==================== PET MOCHI ====================
class CyberPet {
  constructor() {
    this.name = 'Mochi';
    this.petCount = parseInt(localStorage.getItem('q04ti_pet_count') || '0', 10);
    this.moods = ['vibing', 'napping', 'exploring', 'curious', 'hungry'];
    this.currentMood = 'vibing';
    this.sprites = {
      vibing: `
  /\\_/\\  
 ( o.o ) 
  > ^ <  ~*
      `,
      napping: `
  /\\_/\\  
 ( -.- ) zZ
  > ^ <  
      `,
      curious: `
  /\\_/\\  
 ( O.O ) !
  > ^ <  
      `,
      happy: `
  /\\_/\\  
 ( ^.^ ) 💖
  > ^ <  
      `,
      eating: `
  /\\_/\\  
 ( >.< ) 🐟
  > ^ <  *crunch*
      `
    };
    this.init();
  }

  init() {
    this.updateDisplay();
    this.bindEvents();

    setInterval(() => {
      if (this.currentMood !== 'eating') {
        const otherMoods = ['vibing', 'napping', 'curious'];
        this.currentMood = otherMoods[Math.floor(Math.random() * otherMoods.length)];
        this.updateDisplay();
      }
    }, 20000);
  }

  bindEvents() {
    const petEl = document.getElementById('pet-avatar');
    const petBtn = document.getElementById('btn-pet');
    const feedBtn = document.getElementById('btn-feed');

    const handlePet = () => {
      this.petCount++;
      localStorage.setItem('q04ti_pet_count', this.petCount);
      this.currentMood = 'happy';
      this.spawnHeart();
      if (window.sound) window.sound.playPetPurr();
      this.updateDisplay();

      setTimeout(() => {
        if (this.currentMood === 'happy') {
          this.currentMood = 'vibing';
          this.updateDisplay();
        }
      }, 2500);
    };

    if (petEl) petEl.addEventListener('click', handlePet);
    if (petBtn) petBtn.addEventListener('click', handlePet);

    if (feedBtn) {
      feedBtn.addEventListener('click', () => {
        this.currentMood = 'eating';
        if (window.sound) window.sound.playClick();
        this.updateDisplay();
        setTimeout(() => {
          this.currentMood = 'happy';
          this.spawnHeart();
          if (window.sound) window.sound.playPetPurr();
          this.updateDisplay();
          setTimeout(() => {
            this.currentMood = 'vibing';
            this.updateDisplay();
          }, 2000);
        }, 1800);
      });
    }
  }

  spawnHeart() {
    const container = document.getElementById('pet-container');
    if (!container) return;

    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.innerText = Math.random() > 0.5 ? '💖' : '✨';
    heart.style.left = `${40 + (Math.random() * 40 - 20)}%`;
    container.appendChild(heart);
    setTimeout(() => heart.remove(), 1200);
  }

  updateDisplay() {
    const spriteEl = document.getElementById('pet-sprite');
    const moodEl = document.getElementById('pet-mood');
    const countEl = document.getElementById('pet-count');

    if (spriteEl) spriteEl.innerText = this.sprites[this.currentMood] || this.sprites.vibing;
    if (moodEl) moodEl.innerText = `Mood: ${this.currentMood}`;
    if (countEl) countEl.innerText = `Petted: ${this.petCount} times`;
  }
}

// ==================== ARCADE BRICK BREAKER ====================
class RetroArcade {
  constructor() {
    this.canvas = document.getElementById('arcade-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.score = 0;
    this.highScore = parseInt(localStorage.getItem('q04ti_arcade_highscore') || '0', 10);
    this.lives = 3;
    this.isRunning = false;
    this.animId = null;

    this.paddle = { x: 130, y: 260, width: 60, height: 10, speed: 6, dx: 0 };
    this.ball = { x: 160, y: 240, radius: 5, dx: 2.5, dy: -2.5, speed: 3.5 };
    this.bricks = [];
    this.rows = 4;
    this.cols = 7;
    this.brickWidth = 38;
    this.brickHeight = 12;
    this.brickPadding = 5;
    this.brickOffsetTop = 30;
    this.brickOffsetLeft = 12;
    this.particles = [];

    this.init();
  }

  init() {
    this.updateScoreBoard();
    this.setupBricks();
    this.bindEvents();
    this.drawIntro();
  }

  setupBricks() {
    this.bricks = [];
    const colors = ['#ff007f', '#bd00ff', '#00e5ff', '#38ef7d'];
    for (let r = 0; r < this.rows; r++) {
      this.bricks[r] = [];
      for (let c = 0; c < this.cols; c++) {
        this.bricks[r][c] = {
          x: c * (this.brickWidth + this.brickPadding) + this.brickOffsetLeft,
          y: r * (this.brickHeight + this.brickPadding) + this.brickOffsetTop,
          status: 1,
          color: colors[r % colors.length]
        };
      }
    }
  }

  bindEvents() {
    const startBtn = document.getElementById('btn-arcade-start');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        if (!this.isRunning) {
          this.start();
          startBtn.innerText = 'Restart';
        } else {
          this.reset();
        }
      });
    }

    window.addEventListener('keydown', (e) => {
      if (!this.isRunning) return;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        this.paddle.dx = this.paddle.speed;
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        this.paddle.dx = -this.paddle.speed;
      }
    });

    window.addEventListener('keyup', (e) => {
      if (['ArrowRight', 'ArrowLeft', 'a', 'd', 'A', 'D'].includes(e.key)) {
        this.paddle.dx = 0;
      }
    });

    const handleMove = (clientX) => {
      if (!this.isRunning) return;
      const rect = this.canvas.getBoundingClientRect();
      const rootX = clientX - rect.left;
      this.paddle.x = Math.max(0, Math.min(this.canvas.width - this.paddle.width, rootX - this.paddle.width / 2));
    };

    this.canvas.addEventListener('mousemove', (e) => handleMove(e.clientX));
    this.canvas.addEventListener('touchmove', (e) => {
      if (e.touches[0]) handleMove(e.touches[0].clientX);
      e.preventDefault();
    }, { passive: false });
  }

  start() {
    this.score = 0;
    this.lives = 3;
    this.setupBricks();
    this.resetBall();
    this.isRunning = true;
    this.updateScoreBoard();
    if (this.animId) cancelAnimationFrame(this.animId);
    this.loop();
  }

  reset() {
    this.start();
  }

  resetBall() {
    this.paddle.x = (this.canvas.width - this.paddle.width) / 2;
    this.ball.x = this.canvas.width / 2;
    this.ball.y = this.paddle.y - 12;
    this.ball.dx = (Math.random() > 0.5 ? 2.5 : -2.5);
    this.ball.dy = -2.8;
  }

  loop() {
    if (!this.isRunning) return;
    this.update();
    this.draw();
    this.animId = requestAnimationFrame(() => this.loop());
  }

  update() {
    this.paddle.x += this.paddle.dx;
    if (this.paddle.x < 0) this.paddle.x = 0;
    if (this.paddle.x + this.paddle.width > this.canvas.width) {
      this.paddle.x = this.canvas.width - this.paddle.width;
    }

    this.ball.x += this.ball.dx;
    this.ball.y += this.ball.dy;

    if (this.ball.x + this.ball.radius > this.canvas.width || this.ball.x - this.ball.radius < 0) {
      this.ball.dx = -this.ball.dx;
      if (window.sound) window.sound.playClick();
    }
    if (this.ball.y - this.ball.radius < 0) {
      this.ball.dy = -this.ball.dy;
      if (window.sound) window.sound.playClick();
    }

    if (
      this.ball.y + this.ball.radius >= this.paddle.y &&
      this.ball.y - this.ball.radius <= this.paddle.y + this.paddle.height &&
      this.ball.x >= this.paddle.x &&
      this.ball.x <= this.paddle.x + this.paddle.width
    ) {
      const hitSpot = (this.ball.x - (this.paddle.x + this.paddle.width / 2)) / (this.paddle.width / 2);
      this.ball.dx = hitSpot * 3.5;
      this.ball.dy = -Math.abs(this.ball.dy);
      if (window.sound) window.sound.playOpen();
    }

    if (this.ball.y + this.ball.radius > this.canvas.height) {
      this.lives--;
      this.updateScoreBoard();
      if (window.sound) window.sound.playClose();

      if (this.lives <= 0) {
        this.gameOver(false);
        return;
      } else {
        this.resetBall();
      }
    }

    let remainingBricks = 0;
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const b = this.bricks[r][c];
        if (b.status === 1) {
          remainingBricks++;
          if (
            this.ball.x > b.x &&
            this.ball.x < b.x + this.brickWidth &&
            this.ball.y > b.y &&
            this.ball.y < b.y + this.brickHeight
          ) {
            this.ball.dy = -this.ball.dy;
            b.status = 0;
            this.score += 20;
            this.spawnParticles(b.x + this.brickWidth / 2, b.y + this.brickHeight / 2, b.color);
            if (window.sound) window.sound.playClick();

            if (this.score > this.highScore) {
              this.highScore = this.score;
              localStorage.setItem('q04ti_arcade_highscore', this.highScore);
            }
            this.updateScoreBoard();
          }
        }
      }
    }

    if (remainingBricks === 0) {
      this.gameOver(true);
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.dx;
      p.y += p.dy;
      p.life -= 0.05;
      if (p.life <= 0) this.particles.splice(i, 1);
    }
  }

  spawnParticles(x, y, color) {
    for (let i = 0; i < 8; i++) {
      this.particles.push({
        x: x,
        y: y,
        dx: (Math.random() - 0.5) * 4,
        dy: (Math.random() - 0.5) * 4,
        color: color,
        life: 1
      });
    }
  }

  draw() {
    this.ctx.fillStyle = '#0f111a';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const b = this.bricks[r][c];
        if (b.status === 1) {
          this.ctx.fillStyle = b.color;
          this.ctx.shadowColor = b.color;
          this.ctx.shadowBlur = 4;
          this.ctx.fillRect(b.x, b.y, this.brickWidth, this.brickHeight);
          this.ctx.shadowBlur = 0;
        }
      }
    }

    this.ctx.fillStyle = '#00e5ff';
    this.ctx.shadowColor = '#00e5ff';
    this.ctx.shadowBlur = 6;
    this.ctx.fillRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);
    this.ctx.shadowBlur = 0;

    this.ctx.beginPath();
    this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = '#ff007f';
    this.ctx.shadowColor = '#ff007f';
    this.ctx.shadowBlur = 6;
    this.ctx.fill();
    this.ctx.closePath();
    this.ctx.shadowBlur = 0;

    this.particles.forEach(p => {
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.life;
      this.ctx.fillRect(p.x, p.y, 3, 3);
      this.ctx.globalAlpha = 1.0;
    });
  }

  drawIntro() {
    this.ctx.fillStyle = '#0f111a';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = '#00e5ff';
    this.ctx.font = '14px monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('CYBER BRICK BREAKER', this.canvas.width / 2, 100);

    this.ctx.fillStyle = '#38ef7d';
    this.ctx.font = '11px monospace';
    this.ctx.fillText('Mouse or Arrow Keys to move', this.canvas.width / 2, 140);
    this.ctx.fillText('Click START to play!', this.canvas.width / 2, 170);
  }

  gameOver(won) {
    this.isRunning = false;
    if (this.animId) cancelAnimationFrame(this.animId);
    this.draw();

    this.ctx.fillStyle = won ? '#38ef7d' : '#ff007f';
    this.ctx.font = '16px monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(won ? '★ YOU WON! ★' : 'GAME OVER LOL', this.canvas.width / 2, 140);

    this.ctx.fillStyle = '#fff';
    this.ctx.font = '11px monospace';
    this.ctx.fillText(`Final Score: ${this.score}`, this.canvas.width / 2, 170);

    if (won && window.sound) window.sound.playSecret();
    const startBtn = document.getElementById('btn-arcade-start');
    if (startBtn) startBtn.innerText = 'Play Again';
  }

  updateScoreBoard() {
    const sEl = document.getElementById('arcade-score');
    const hEl = document.getElementById('arcade-high');
    const lEl = document.getElementById('arcade-lives');
    if (sEl) sEl.innerText = `Score: ${this.score}`;
    if (hEl) hEl.innerText = `High: ${this.highScore}`;
    if (lEl) lEl.innerText = `Lives: ${'💖'.repeat(Math.max(0, this.lives))}`;
  }
}

// ==================== TERMINAL ====================
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
    if (container) container.scrollTop = container.scrollHeight;
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
        this.printLine('• 💻 vibe: tinkering with retro code');
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
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }
}

// ==================== APP INITIALIZATION & CONTROLS ====================
document.addEventListener('DOMContentLoaded', () => {
  window.windowManager = new WindowManager();
  window.retroTerminal = new RetroTerminal();
  window.guestbook = new Guestbook();
  window.cyberPet = new CyberPet();
  window.retroArcade = new RetroArcade();

  // Desktop icons
  const icons = document.querySelectorAll('.desktop-icon');
  icons.forEach((icon) => {
    let lastClick = 0;
    const targetWin = icon.dataset.window;

    const activate = () => {
      icons.forEach(i => i.classList.remove('selected'));
      icon.classList.add('selected');
      if (window.sound) window.sound.playClick();
      if (targetWin && window.windowManager) {
        window.windowManager.openWindow(targetWin);
      }
    };

    icon.addEventListener('click', (e) => {
      const now = Date.now();
      icons.forEach(i => i.classList.remove('selected'));
      icon.classList.add('selected');

      if (now - lastClick < 350 || window.innerWidth < 768) {
        activate();
      }
      lastClick = now;
    });
  });

  document.getElementById('desktop-area')?.addEventListener('click', (e) => {
    if (e.target.id === 'desktop-area') {
      document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
    }
  });

  // Start menu
  const startBtn = document.getElementById('start-btn');
  const startMenu = document.getElementById('start-menu');
  if (startBtn && startMenu) {
    startBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = startMenu.classList.toggle('hidden');
      startBtn.classList.toggle('active', !isHidden);
      if (window.sound) window.sound.playClick();
    });

    document.querySelectorAll('.start-menu-item').forEach(item => {
      item.addEventListener('click', () => {
        const target = item.dataset.window;
        if (target && window.windowManager) {
          window.windowManager.openWindow(target);
        }
        startMenu.classList.add('hidden');
        startBtn.classList.remove('active');
      });
    });
  }

  // Themes
  let currentTheme = localStorage.getItem('q04ti_theme') || 'win95';
  if (currentTheme === 'cyber-dark' || currentTheme === 'amber-crt') {
    currentTheme = 'win95';
  }
  document.documentElement.setAttribute('data-theme', currentTheme);

  const themeSelect = document.getElementById('theme-picker');
  if (themeSelect) {
    themeSelect.value = currentTheme;
    themeSelect.addEventListener('change', (e) => {
      const newTheme = e.target.value;
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('q04ti_theme', newTheme);
      if (window.sound) window.sound.playClick();
    });
  }

  // Clock
  const clockEl = document.getElementById('taskbar-clock');
  const updateClock = () => {
    if (!clockEl) return;
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    clockEl.innerText = `${hours}:${mins}`;
  };
  updateClock();
  setInterval(updateClock, 1000);

  // Visitor counter
  const counterEl = document.getElementById('visitor-count-digits');
  let count = parseInt(localStorage.getItem('q04ti_visitor_count') || '4218', 10);
  if (!sessionStorage.getItem('q04ti_visited')) {
    count += 1;
    localStorage.setItem('q04ti_visitor_count', count);
    sessionStorage.setItem('q04ti_visited', 'true');
  }
  if (counterEl) {
    const formatted = String(count).padStart(6, '0');
    counterEl.innerHTML = formatted.split('').map(digit => `<span class="digit-box">${digit}</span>`).join('');
  }

  // Sound UI
  const muteBtn = document.getElementById('mute-toggle-btn');
  const musicPlayBtn = document.getElementById('music-play-btn');
  const trackSelect = document.getElementById('music-track-select');
  const visualizerBars = document.querySelectorAll('.vis-bar');

  const updateMuteIcon = () => {
    if (muteBtn) {
      muteBtn.innerText = window.sound.muted ? '🔇' : '🔊';
      muteBtn.title = window.sound.muted ? 'Unmute' : 'Mute';
    }
  };
  updateMuteIcon();

  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      window.sound.toggleMute();
      updateMuteIcon();
    });
  }

  if (musicPlayBtn) {
    musicPlayBtn.addEventListener('click', () => {
      if (window.sound.isPlayingMusic) {
        window.sound.stopMusic();
        musicPlayBtn.innerText = '▶ Play Tunes';
      } else {
        const trackIdx = parseInt(trackSelect?.value || '0', 10);
        window.sound.startMusic(trackIdx);
        musicPlayBtn.innerText = '⏹ Stop Tunes';
      }
    });
  }

  if (trackSelect) {
    trackSelect.addEventListener('change', () => {
      if (window.sound.isPlayingMusic) {
        window.sound.startMusic(parseInt(trackSelect.value, 10));
      }
    });
  }

  window.onMusicStep = (step, hasNote) => {
    visualizerBars.forEach((bar, idx) => {
      if (hasNote && (step % 4 === idx % 4)) {
        const h = Math.floor(Math.random() * 22) + 8;
        bar.style.height = `${h}px`;
      } else {
        bar.style.height = '4px';
      }
    });
  };

  window.onMusicStop = () => {
    visualizerBars.forEach(bar => { bar.style.height = '4px'; });
    if (musicPlayBtn) musicPlayBtn.innerText = '▶ Play Tunes';
  };

  // 88x31 copy button
  const copyBtn = document.getElementById('btn-copy-88x31');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const code = `<a href="https://q04ti.github.io/q04tiweb" target="_blank"><img src="https://q04ti.github.io/q04tiweb/assets/q04ti-badge.svg" alt="q04ti" width="88" height="31" /></a>`;
      navigator.clipboard.writeText(code).then(() => {
        if (window.sound) window.sound.playSecret();
        showToast('📋 copied button code! paste it on your site');
      }).catch(() => {
        showToast('HTML: ' + code);
      });
    });
  }

  // CRT scanlines
  const crtToggle = document.getElementById('crt-toggle-btn');
  const crt = document.getElementById('crt-overlay');
  if (crtToggle && crt) {
    const isCrt = localStorage.getItem('q04ti_crt_enabled') !== 'false';
    crt.classList.toggle('scanlines-active', isCrt);
    crtToggle.classList.toggle('active', isCrt);

    crtToggle.addEventListener('click', () => {
      const active = crt.classList.toggle('scanlines-active');
      crtToggle.classList.toggle('active', active);
      localStorage.setItem('q04ti_crt_enabled', active);
      if (window.sound) window.sound.playClick();
    });
  }

  // Konami code
  const code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let position = 0;

  window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase() === 'b' ? 'b' : (e.key.toLowerCase() === 'a' ? 'a' : e.key);
    if (key === code[position]) {
      position++;
      if (position === code.length) {
        if (window.sound) window.sound.playSecret();
        showToast('🎉 KONAMI CODE UNLOCKED LMAO DISCO MODE ACTIVATED');
        document.body.classList.add('hyper-disco-mode');
        setTimeout(() => document.body.classList.remove('hyper-disco-mode'), 8000);
        if (window.windowManager) window.windowManager.openWindow('win-secret');
        position = 0;
      }
    } else {
      position = 0;
    }
  });
});

function showToast(msg) {
  const toast = document.getElementById('toast-notification');
  if (!toast) return;
  toast.innerText = msg;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 3500);
}
