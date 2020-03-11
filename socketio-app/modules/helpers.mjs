const normalize = (val, from, to) => {
  const limited = Math.min(Math.max(val, from[0]), from[1]);
  return (limited - from[0]) * (to[1] - to[0]) / (from[1] - from[0]) + to[0];
};

export { normalize };