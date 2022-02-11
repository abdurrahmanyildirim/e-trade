const Log = require('../models/log');

module.exports.getLogs = async (req, res, next) => {
  try {
    const logs = await Log.find();
    return res.status(200).send(logs);
  } catch (error) {
    next(error);
  }
};
