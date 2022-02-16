const User = require('../models/user');

const add = () => {};
const save = () => {};
const update = () => {};
const getUsers = () => {};
const getUserById = async (_id) => {
  return await User.findOne({ _id });
};
const getUserByQuery = () => {};
