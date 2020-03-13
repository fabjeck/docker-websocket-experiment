import Ball from "./ball.mjs";

export default class Scene {
  constructor(wrapper, socket, screenPosition, screensCount) {
    this.wrapper = wrapper;
    this.socket = socket;
    this.screenPosition = screenPosition;
    this.screensCount = screensCount;
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.devicePixelRatio = Math.min(window.devicePixelRatio, 2);
    this.ball = new Ball(this.devicePixelRatio * 30, 'black');
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
    const right = this.canvas.width + this.ball.radius;
    const bottom = this.canvas.height + this.ball.radius;
    
    if (this.ball.y < top) {
      this.ball.y = top;
    } else if (this.ball.y > bottom) {
      this.ball.y = bottom;
    }
    if (this.ball.x < left) {
      console.log('left');
      if (this.screenPosition === 1) {
        this.ball.x = left;
      } else {
        this.exit('left', this.x / this.canvas.width, this.y / this.canvas.height);
      }
    } else if (this.ball.x > right) {
      console.log('right');
      if (this.screenPosition === this.screensCount) {
        this.ball.x = right;
      } else {
        this.exit('right', this.x / this.canvas.width, this.y / this.canvas.height);
      }
    }
  }

  render() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    window.requestAnimationFrame(this.render.bind(this));
    if (this.isActive) {
      this.checkBoundaries();
      this.ball.draw(this.context);
    }
  }

  enter(xFraction, yFraction) {
    this.isActive = true;
    if (xFraction && yFraction) {
      this.ball.x = xFraction * this.canvas.width;
      this.ball.y = yFraction * this.canvas.height;
    }
  }

  exit(dir) {
    this.isActive = false;
    const data = {
      direction: dir,
      xFraction: this.ball.x / this.canvas.width,
      yFraction: this.ball.y / this.canvas.height
    }
    this.socket.emit('exit', data);
  }

  resize() {
    const width = this.wrapper.offsetWidth;
    const height = this.wrapper.offsetHeight;
    this.canvas.width = width * devicePixelRatio;
    this.canvas.height = height * devicePixelRatio;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
  }
}