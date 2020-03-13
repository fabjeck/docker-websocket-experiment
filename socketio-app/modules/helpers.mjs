const limitRange = (val, range) => {
  return Math.min(Math.max(val, range[0]), range[1]);
};

const map = (val, from, to) => {
  return (val - from[0]) * (to[1] - to[0]) / (from[1] - from[0]) + to[0];
};

const rotate = (x, y) => {
  return 0;
};

export { limitRange, map, rotate };