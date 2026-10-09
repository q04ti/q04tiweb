// web audio synth engine i cooked up
// generates 8-bit tunes with pure math so no mp3s needed!

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
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
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

  // procedural tunes
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

      // bass line
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

      // melody line
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

      // crunchy noise tick for drum
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
