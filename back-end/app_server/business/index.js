class Business {
  collection;
  mainModel;
  constructor(model) {
    this.mainModel = model;
  }
  // collentionModel;
  // constructor(collentionModel) {
  //   this.collentionModel = collentionModel;
  // }

  // async initById(id) {
  //   this.collection = await this.collentionModel.findOne({ _id: id });
  //   return this;
  // }
}

module.exports = Business;
