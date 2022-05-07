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
    this.collection = await this.collection.save();
    return this;
  }

  async saveArray() {
    for (const doc of this.collection) {
      await doc.save();
    }
    return this;
  }
}

module.exports = Business;
