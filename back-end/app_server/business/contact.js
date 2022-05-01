const ContactModel = require('../models/contact');
const { encrypt, encForResp } = require('../services/crypto');
const Business = require('./index');

class Contact extends Business {
  constructor() {
    super(ContactModel);
  }

  createNewContact({ email, phone, name, desc }) {
    email = encrypt(email);
    phone = encrypt(phone);
    this.collection = new ContactModel({ name, email, phone, desc });
    return this;
  }

  async initMessages() {
    const messages = await ContactModel.find();
    if (messages && messages.length > 0) {
      messages.map((message) => {
        message.email = encForResp(message.email);
        message.phone = encForResp(message.phone);
        return message;
      });
    }
    this.collection = messages;
    return this;
  }

  async toggleRead(id) {
    this.collection = await ContactModel.findOneAndUpdate({ _id: id }, { $set: { isRead: true } });
    return this;
  }

  async remove(id) {
    await ContactModel.findOneAndRemove({ _id: id });
    return this;
  }
}

module.exports = Contact;
