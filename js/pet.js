// my desk pet cat mochi
// pet him or he gets sad

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

    setTimeout(() => {
      heart.remove();
    }, 1200);
  }

  updateDisplay() {
    const spriteEl = document.getElementById('pet-sprite');
    const moodEl = document.getElementById('pet-mood');
    const countEl = document.getElementById('pet-count');

    if (spriteEl) {
      spriteEl.innerText = this.sprites[this.currentMood] || this.sprites.vibing;
    }
    if (moodEl) {
      moodEl.innerText = `Mood: ${this.currentMood}`;
    }
    if (countEl) {
      countEl.innerText = `Petted: ${this.petCount} times`;
    }
  }
}

window.cyberPet = null;
