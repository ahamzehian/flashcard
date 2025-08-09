const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

const gravity = 0.3;
const blocks = [];
const particles = [];

class Block {
  constructor(x, y, squareSize, gridSize, mass) {
    this.x = x;
    this.y = y;
    this.squareSize = squareSize;
    this.gridSize = gridSize;
    this.mass = mass;
    this.vy = 0;
    this.color = `hsl(${(mass / 6) * 360},70%,60%)`;
  }

  update() {
    this.vy += gravity;
    this.y += this.vy;
    const bottom = canvas.height - this.gridSize * this.squareSize;
    if (this.y >= bottom) {
      this.y = bottom;
      this.scatter();
    }
  }

  draw() {
    ctx.fillStyle = this.color;
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        ctx.fillRect(
          this.x + i * this.squareSize,
          this.y + j * this.squareSize,
          this.squareSize,
          this.squareSize
        );
      }
    }
  }

  scatter() {
    const speed = 6 / this.mass;
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        const px = this.x + i * this.squareSize;
        const py = this.y + j * this.squareSize;
        const vx = (Math.random() - 0.5) * speed * 2;
        const vy = -Math.random() * speed;
        particles.push(
          new Particle(px, py, vx, vy, this.squareSize, this.color)
        );
      }
    }
    const idx = blocks.indexOf(this);
    if (idx > -1) {
      blocks.splice(idx, 1);
    }
  }
}

class Particle {
  constructor(x, y, vx, vy, size, color) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.size = size;
    this.color = color;
  }

  update() {
    this.vy += gravity;
    this.x += this.vx;
    this.y += this.vy;

    if (this.y + this.size > canvas.height) {
      this.y = canvas.height - this.size;
      this.vy *= -0.5;
      this.vx *= 0.8;
    }
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
}

function spawnBlock(x) {
  const grid = 5;
  const size = 12;
  const mass = 2 + Math.random() * 4; // 2-6
  if (x === undefined) {
    x = Math.random() * (canvas.width - grid * size);
  } else {
    x = Math.min(Math.max(0, x - (grid * size) / 2), canvas.width - grid * size);
  }
  blocks.push(new Block(x, -grid * size, size, grid, mass));
}

canvas.addEventListener('click', (e) => {
  spawnBlock(e.clientX);
});

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  blocks.forEach((b) => {
    b.update();
    b.draw();
  });
  particles.forEach((p) => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animate);
}

spawnBlock();
animate();
