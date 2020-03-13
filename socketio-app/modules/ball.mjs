export default class Ball {
  constructor(radius, color) {
    this._radius = radius;
    this.color = color;
    this._x = this._radius;
    this._y = this._radius;
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0;
    this.friction = 0.1;
  }

  get radius() {
    return this._radius;
  }

  set radius(radius) {
    this._radius = radius;
  }

  get x() {
    return this._x;
  }

  set x(x) {
    this._x = x;
  }

  get y() {
    return this._y;
  }

  set y(y) {
    this._y = y;
  }

  accelerate(ax, ay) {
    this.ax = ax;
    this.ay = ay;
  }

  move() {
    this.vx += this.ax;
    this.vy += this.ay;
    this._x += this.vx * this.friction;
    this._y += this.vy * this.friction;
  }

  draw(ctx) {
    this.move();
    ctx.beginPath();
    ctx.arc(this._x, this._y, this._radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}