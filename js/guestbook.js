/**
 * q04tiOS - Interactive Guestbook
 * LocalStorage persistent guestbook with stickers, avatar stamps, and nostalgic web flair!
 */

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
        message: 'Stumbled here from a webring! Loving the CRT vibes and the lo-fi beats. Signed your book!',
        date: '2026-09-28',
        sticker: '💿',
        badgeColor: '#ff007f'
      },
      {
        id: 2,
        author: 'CassetteKid',
        website: 'tapeheads.zone',
        message: 'Took an 88x31 button for my personal sidebar! Keep keeping the web fun & weird.',
        date: '2026-10-02',
        sticker: '☕',
        badgeColor: '#00e5ff'
      },
      {
        id: 3,
        author: 'PixelMina',
        website: 'mina.garden',
        message: 'Pet your cyber cat 10 times in a row. Best desk companion ever.',
        date: '2026-10-06',
        sticker: '🐱',
        badgeColor: '#7000ff'
      }
    ];
  }

  getEntries() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
    return this.getInitialEntries();
  }

  saveEntries(entries) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(entries));
    } catch (e) {
      console.error(e);
    }
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
      btn.title = `Choose sticker ${sticker}`;
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
      list.innerHTML = '<div class="guestbook-empty">No notes yet. Be the first to leave your mark!</div>';
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
          <span class="card-date">${entry.date || 'Recent'}</span>
        </div>
        <div class="card-body">
          <p>${this.escapeHTML(entry.message)}</p>
        </div>
        ${websiteHtml ? `<div class="card-footer">${websiteHtml}</div>` : ''}
      `;
      list.appendChild(card);
    });

    const countEl = document.getElementById('guestbook-count');
    if (countEl) {
      countEl.innerText = `${entries.length} notes`;
    }
  }

  bindEvents() {
    const form = document.getElementById('guestbook-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const authorInput = document.getElementById('guest-name');
      const websiteInput = document.getElementById('guest-site');
      const messageInput = document.getElementById('guest-msg');

      const author = authorInput.value.trim() || 'Anonymous Traveler';
      const website = websiteInput.value.trim();
      const message = messageInput.value.trim();

      if (!message) {
        alert('Please write a quick note before stamping!');
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

      // Clear inputs
      messageInput.value = '';

      this.renderEntries();

      // Show stamp notification
      const statusMsg = document.getElementById('guest-status');
      if (statusMsg) {
        statusMsg.innerText = '✨ Note pinned to the guestbook!';
        setTimeout(() => { statusMsg.innerText = ''; }, 3500);
      }
    });

    // Reset button
    const resetBtn = document.getElementById('guestbook-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Reset guestbook back to initial friendly entries?')) {
          localStorage.removeItem(this.storageKey);
          this.renderEntries();
        }
      });
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

window.guestbook = null;
