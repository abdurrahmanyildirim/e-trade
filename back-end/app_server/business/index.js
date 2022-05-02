class Business {
  collection;
  mainModel;
  constructor(model) {
    this.mainModel = model;
  }

  async initById(id) {
    this.collection = await this.mainModel.findOne({ _id: id });
    return this;
  }

  async save() {
    await this.collection.save();
    return this;
  }

  async saveArray() {
    this.collection.forEach(async (doc) => {
      await doc.save();
    });
    return this;
  }
}

module.exports = Business;
