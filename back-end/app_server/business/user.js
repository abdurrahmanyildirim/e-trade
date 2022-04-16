const UserModel = require('../models/user');
const Business = require('./index');
const { encrypt, comparePassword, hashPassword, encForResp } = require('../services/crypto');

class User extends Business {
  constructor() {
    super(UserModel);
  }

  async initById(id) {
    this.collection = await UserModel.findOne({ _id: id });
    return this;
  }

  async initByEmail(email) {
    this.collection = await UserModel.findOne({ email: encrypt(email) });
    return this;
  }

  activate() {
    this.collection.isActivated = true;
    return this;
  }

  changeFirstAndLastName({ firstName, lastName }) {
    this.collection.firstName = firstName;
    this.collection.lastName = lastName;
    return this;
  }

  changePhone({ phone }) {
    this.collection.phones[0] = {
      title: 'phone' + Date.now(),
      phone: encrypt(phone)
    };
    return this;
  }

  changeAdress({ city, district, address }) {
    this.collection.addresses[0] = {
      title: 'address' + Date.now(),
      city: encrypt(city),
      district: encrypt(district),
      address: encrypt(address)
    };
    return this;
  }

  changePassword(password) {
    this.collection.password = hashPassword(password);
    return this;
  }

  comparePassword(newPassword) {
    return comparePassword(newPassword, this.collection.password);
  }

  getPersonelInfo() {}

  getInfo() {
    let info = {
      email: encForResp(this.collection.email),
      firstName: this.collection.firstName,
      lastName: this.collection.lastName
    };
    if (this.collection.addresses.length > 0 && this.collection.phones.length > 0) {
      const contact = this.collection.addresses[0];
      info = {
        ...info,
        city: encForResp(contact.city),
        district: encForResp(contact.district),
        address: encForResp(contact.address),
        phone: encForResp(this.collection.phones[0].phone)
      };
    }
    return info;
  }

  createNewUser(user) {
    this.collection = new UserModel({
      ...user,
      email: encrypt(user.email),
      password: hashPassword(user.password)
    });
    return this;
  }

  async save() {
    await this.collection.save();
    return this;
  }
}

module.exports = {
  User
};
