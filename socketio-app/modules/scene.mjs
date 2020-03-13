import Ball from "./ball.mjs";

export default class Scene {
  constructor(wrapper, socket, position) {
    this.wrapper = wrapper;
    this.socket = socket;
    this.position = position;
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.devicePixelRatio = window.devicePixelRatio;
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

  checkBoundaries() {
    const top = 0;
    const left = 0;
    const right = this.canvas.width;
    const bottom = this.canvas.height;
    if (this.ball.y < top) {
      this.ball.y = top;
    } else if (this.ball.y > bottom) {
      this.ball.y = bottom;
    }

    if (this.ball.x < left) {
      this.exit('left');
    } else if (this.ball.x > right) {
      this.exit('right');
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