import Ball from "./ball.mjs";

export default class Scene {
  constructor(wrapper, socket, screenPosition, screensCount) {
    this.wrapper = wrapper;
    this.socket = socket;
    this.screenPosition = screenPosition;
    this.screensCount = screensCount;
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.scale = window.devicePixelRatio;
    this.ball = new Ball(this.scale, 30, 'black', 10);
    this.isActive = false;

    this.init();
  }

  init() {
    this.wrapper.appendChild(this.canvas);
    this.resize();
    window.addEventListener('resize', this.resize.bind(this), false);
    this.render();
  }

  updateScreensOrder(screenPosition, screensCount) {
    this.screenPosition = screenPosition;
    this.screensCount = screensCount;
  }

  checkBoundaries() {
    const top = this.ball.radius;
    const left = this.ball.radius;
    const right = this.canvas.width - this.ball.radius;
    const bottom = this.canvas.height - this.ball.radius;
    
    if (this.ball.y < top) {
      this.ball.y = top;
    } else if (this.ball.y > bottom) {
      this.ball.y = bottom;
    }

    if (this.screenPosition === 1 && this.ball.x < left) {
      this.ball.x = left;
    } else if (this.screenPosition === this.screensCount && this.ball.x > right){
      this.ball.x = right;
    } else if (this.ball.x < -this.ball.radius) {
      this.exit('left');
    } else if (this.ball.x > this.canvas.width + this.ball.radius) {
      this.exit('right');
    }
  }

  render() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    window.requestAnimationFrame(this.render.bind(this));
    this.ball.move();
    if (this.isActive) {
      this.checkBoundaries();
      this.ball.draw(this.context);
    }
  }

  enter(direction, yFraction) {
    this.isActive = true;
    if (direction) {
      switch (direction) {
        case 'left':
          this.ball.x = this.canvas.width + this.ball.radius;
          this.ball.y = yFraction * this.canvas.height;
          break;
        case 'right':
          this.ball.x = -this.ball.radius;
          this.ball.y = yFraction * this.canvas.height;
          break;
        case 'reset': 
          this.ball = new Ball(this.scale, 30, 'black', 10);
          break;
      }
    }
  }

  exit(direction) {
    this.isActive = false;
    const yFraction = this.ball.y / this.canvas.height;
    this.socket.emit('exit', direction, yFraction, this.screenPosition - 1);
  }

  resize() {
    const width = this.wrapper.offsetWidth;
    const height = this.wrapper.offsetHeight;
    this.canvas.width = width * this.scale;
    this.canvas.height = height * this.scale;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
  }
}