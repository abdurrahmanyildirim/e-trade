const isDevMode = () => {
  return (
    isPresent(process.env.NODE_ENV) &&
    (process.env.NODE_ENV.trim() === 'dev' || process.env.NODE_ENV.trim() === 'github')
  );
};

const isPresent = (obj) => {
  return obj !== undefined && typeof obj !== 'undefined' && obj !== null;
};

module.exports = {
  isDevMode,
  isPresent
};
