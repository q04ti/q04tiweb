/**
 * q04tiOS - Retro Arcade: Neon Brick Breaker
 * Smooth HTML5 Canvas mini-game with retro sounds and high score tracking!
 */

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

    // Game objects
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

    // Keyboard controls
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

    // Mouse / Touch movement on canvas
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
    // Move paddle
    this.paddle.x += this.paddle.dx;
    if (this.paddle.x < 0) this.paddle.x = 0;
    if (this.paddle.x + this.paddle.width > this.canvas.width) {
      this.paddle.x = this.canvas.width - this.paddle.width;
    }

    // Move ball
    this.ball.x += this.ball.dx;
    this.ball.y += this.ball.dy;

    // Wall collision
    if (this.ball.x + this.ball.radius > this.canvas.width || this.ball.x - this.ball.radius < 0) {
      this.ball.dx = -this.ball.dx;
      if (window.sound) window.sound.playClick();
    }
    if (this.ball.y - this.ball.radius < 0) {
      this.ball.dy = -this.ball.dy;
      if (window.sound) window.sound.playClick();
    }

    // Paddle collision
    if (
      this.ball.y + this.ball.radius >= this.paddle.y &&
      this.ball.y - this.ball.radius <= this.paddle.y + this.paddle.height &&
      this.ball.x >= this.paddle.x &&
      this.ball.x <= this.paddle.x + this.paddle.width
    ) {
      // Angle based on hit location
      const hitSpot = (this.ball.x - (this.paddle.x + this.paddle.width / 2)) / (this.paddle.width / 2);
      this.ball.dx = hitSpot * 3.5;
      this.ball.dy = -Math.abs(this.ball.dy);
      if (window.sound) window.sound.playOpen();
    }

    // Bottom loss
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

    // Brick collision
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

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.dx;
      p.y += p.dy;
      p.life -= 0.05;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
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

    // Draw Bricks
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

    // Draw Paddle
    this.ctx.fillStyle = '#00e5ff';
    this.ctx.shadowColor = '#00e5ff';
    this.ctx.shadowBlur = 6;
    this.ctx.fillRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);
    this.ctx.shadowBlur = 0;

    // Draw Ball
    this.ctx.beginPath();
    this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = '#ff007f';
    this.ctx.shadowColor = '#ff007f';
    this.ctx.shadowBlur = 6;
    this.ctx.fill();
    this.ctx.closePath();
    this.ctx.shadowBlur = 0;

    // Draw Particles
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
    this.ctx.fillText('Move: Mouse / Left-Right Keys', this.canvas.width / 2, 140);
    this.ctx.fillText('Click START to play!', this.canvas.width / 2, 170);
  }

  gameOver(won) {
    this.isRunning = false;
    if (this.animId) cancelAnimationFrame(this.animId);

    this.draw();

    this.ctx.fillStyle = won ? '#38ef7d' : '#ff007f';
    this.ctx.font = '16px monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(won ? '★ VICTORY! ★' : 'GAME OVER', this.canvas.width / 2, 140);

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

window.retroArcade = null;
