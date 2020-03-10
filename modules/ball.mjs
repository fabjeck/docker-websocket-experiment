export default class Ball {
  constructor(radius, color) {
    this.radius = radius;
    this.color = color;
    this.x = this.radius;
    this.y = this.radius;
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0;
    this.friction = 0.8;
  }

  accelerate(ax, ay) {
    this.ax = ax;
    this.ay = ay;
  }

  move() {
    this.vx += this.ax;
    this.vy += this.ay;
    this.x += this.vx * this.friction;
    this.y += this.vy * this.friction;
  }

  draw(ctx) {
    this.move();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
};