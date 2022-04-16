const UserCollection = require('../models/user');
const DataBase = require('./index');

class UserDb extends DataBase {
  constructor() {
    super(UserCollection);
  }
}

const user = new UserDb();

const insert = () => {};
const update = () => {};
const remove = () => {};
const save = () => {};
const getUsers = () => {};
const getUserById = async (_id) => {
  return await UserCollection.findOne({ _id });
};
const getUserByQuery = () => {};
