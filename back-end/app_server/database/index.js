class DataBase {
  collection;
  constructor(collection) {
    this.collection = collection;
  }

  insert = () => {};
  update = () => {};
  remove = () => {};
  getById = async (_id) => {
    return await this.#collection.findOne({ _id });
  };
}

module.exports = DataBase;
