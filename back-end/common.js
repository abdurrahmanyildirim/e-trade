const isDevMode = () => {
  return isPresent(process.env.NODE_ENV) && process.env.NODE_ENV.trim() === 'dev';
};

const isPresent = (obj) => {
  return obj !== undefined && typeof obj !== 'undefined' && obj !== null;
};

module.exports = {
  isDevMode,
  isPresent
};
