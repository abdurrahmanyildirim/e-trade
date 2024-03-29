const Log = require('../models/log');

const type = {
  error: 'Error',
  info: 'Info',
  warn: 'Warn',
  custom: 'Custom'
};

const error = (req, error) => {
  const log = {
    name: error.name,
    message: error.message,
    stack: error.stack.toString(),
    level: type.error,
    route: req?.originalUrl,
    id: req?.id
  };
  logToDb(log);
};

const info = (req, info) => {
  const log = {
    name: info.name,
    message: info.message,
    level: type.info,
    route: req?.originalUrl,
    id: req?.id
  };
  logToDb(log);
};

const custom = (log) => {
  logToDb({
    level: type.custom,
    ...log
  });
};

const logToDb = async (logObject) => {
  try {
    const log = new Log(logObject);
    await log.save();
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  error,
  info,
  custom
};
