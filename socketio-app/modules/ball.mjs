export default class Ball {
  constructor(scale, radius, color, maxSpeed) {
    this.scale = scale;
    this._radius = this.scale * radius;
    this.color = color;
    this._x = this._radius;
    this._y = this._radius;
    this.vx = 0;
    this.vy = 0;
    this.maxSpeed = maxSpeed;
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
    this.vx = ax * this.maxSpeed * this.scale;
    this.vy = ay * this.maxSpeed * this.scale;
  }

  move() {
    this._x += this.vx;
    // substract to make ball sink on negative tilt 
    this._y -= this.vy;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this._x, this._y);

    ctx.beginPath();
    ctx.arc(0, 0, this._radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();

    ctx.restore();
  }
}