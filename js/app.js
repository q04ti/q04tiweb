/**
 * q04tiOS - Main Application Controller
 * Coordinates theme switching, audio controls, Konami code, visitor counter, and UI interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Window Manager
  window.windowManager = new WindowManager();
  window.retroTerminal = new RetroTerminal();
  window.guestbook = new Guestbook();
  window.cyberPet = new CyberPet();
  window.retroArcade = new RetroArcade();

  setupDesktopIcons();
  setupStartMenu();
  setupThemes();
  setupClock();
  setupVisitorCounter();
  setupAudioUI();
  setupKonamiCode();
  setup88x31Copy();
  setupCRTOverlay();
});

// Desktop Icon Interactions
function setupDesktopIcons() {
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

      // Double click or fast touch opens window
      if (now - lastClick < 350 || window.innerWidth < 768) {
        activate();
      }
      lastClick = now;
    });
  });

  // Clicking empty desktop clears icon selection
  document.getElementById('desktop-area')?.addEventListener('click', (e) => {
    if (e.target.id === 'desktop-area') {
      document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
    }
  });
}

// Start Menu Interactions
function setupStartMenu() {
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
}

// Themes & Styles
function setupThemes() {
  const currentTheme = localStorage.getItem('q04ti_theme') || 'cyber-dark';
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
}

// Live Taskbar Clock
function setupClock() {
  const clockEl = document.getElementById('taskbar-clock');
  const update = () => {
    if (!clockEl) return;
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    clockEl.innerText = `${hours}:${mins}`;
  };
  update();
  setInterval(update, 1000);
}

// Visitor Counter (GeoCities retro odometer style)
function setupVisitorCounter() {
  const counterEl = document.getElementById('visitor-count-digits');
  let count = parseInt(localStorage.getItem('q04ti_visitor_count') || '4218', 10);

  // Increment only once per session
  if (!sessionStorage.getItem('q04ti_visited')) {
    count += 1;
    localStorage.setItem('q04ti_visitor_count', count);
    sessionStorage.setItem('q04ti_visited', 'true');
  }

  if (counterEl) {
    const formatted = String(count).padStart(6, '0');
    counterEl.innerHTML = formatted.split('').map(digit => `<span class="digit-box">${digit}</span>`).join('');
  }
}

// Web Audio Lo-Fi Player & Sound Toggle
function setupAudioUI() {
  const muteBtn = document.getElementById('mute-toggle-btn');
  const musicPlayBtn = document.getElementById('music-play-btn');
  const trackSelect = document.getElementById('music-track-select');
  const visualizerBars = document.querySelectorAll('.vis-bar');

  // Sync mute state icon
  const updateMuteIcon = () => {
    if (muteBtn) {
      muteBtn.innerText = window.sound.muted ? '🔇' : '🔊';
      muteBtn.title = window.sound.muted ? 'Unmute Audio' : 'Mute Audio';
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
        musicPlayBtn.innerText = '▶ Play Synth';
      } else {
        const trackIdx = parseInt(trackSelect?.value || '0', 10);
        window.sound.startMusic(trackIdx);
        musicPlayBtn.innerText = '⏹ Stop Synth';
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

  // Audio Visualizer step hook
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
    if (musicPlayBtn) musicPlayBtn.innerText = '▶ Play Synth';
  };
}

// 88x31 Button One-Click Copy
function setup88x31Copy() {
  const copyBtn = document.getElementById('btn-copy-88x31');
  const toast = document.getElementById('toast-notification');

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const code = `<a href="https://q04ti.github.io/q04tiweb" target="_blank"><img src="https://q04ti.github.io/q04tiweb/assets/q04ti-badge.png" alt="q04ti" width="88" height="31" /></a>`;
      navigator.clipboard.writeText(code).then(() => {
        if (window.sound) window.sound.playSecret();
        showToast('📋 Copied 88x31 button HTML to clipboard!');
      }).catch(() => {
        showToast('HTML: ' + code);
      });
    });
  }
}

function showToast(msg) {
  const toast = document.getElementById('toast-notification');
  if (!toast) return;
  toast.innerText = msg;
  toast.classList.remove('hidden');
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3500);
}

// CRT Scanlines Toggle
function setupCRTOverlay() {
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
}

// Konami Code Easter Egg
function setupKonamiCode() {
  const code = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'b', 'a'
  ];
  let position = 0;

  window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase() === 'b' ? 'b' : (e.key.toLowerCase() === 'a' ? 'a' : e.key);

    if (key === code[position]) {
      position++;
      if (position === code.length) {
        triggerKonamiSecret();
        position = 0;
      }
    } else {
      position = 0;
    }
  });
}

function triggerKonamiSecret() {
  if (window.sound) window.sound.playSecret();
  showToast('🎉 KONAMI CODE UNLOCKED: 30 LIVES & HYPER DISCO MODE!');

  // Trigger Disco Effect
  document.body.classList.add('hyper-disco-mode');
  setTimeout(() => {
    document.body.classList.remove('hyper-disco-mode');
  }, 8000);

  // Open secret window or badge
  if (window.windowManager) {
    window.windowManager.openWindow('win-secret');
  }
}
