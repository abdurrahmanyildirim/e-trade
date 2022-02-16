const Contact = require('../models/contact');
const { encrypt, encForResp } = require('../services/crypto');

module.exports.sendContactRequest = async (req, res, next) => {
  try {
    let { email, phone, name, desc } = req.body;
    email = encrypt(email);
    phone = encrypt(phone);
    const contact = new Contact({ name, email, phone, desc });
    await contact.save();
    return res.status(200).send({ message: 'Mesaj iletildi' });
  } catch (error) {
    next(error);
  }
};

module.exports.getMessages = async (req, res, next) => {
  try {
    const messages = await Contact.find();
    if (messages && messages.length > 0) {
      messages.map((message) => {
        message.email = encForResp(message.email);
        message.phone = encForResp(message.phone);
        return message;
      });
    }
    return res.status(200).send(messages);
  } catch (error) {
    next(error);
  }
};

module.exports.toggleRead = async (req, res, next) => {
  try {
    const id = req.query.id;
    const doc = await Contact.findOneAndUpdate({ _id: id }, { $set: { isRead: true } });
    return res.status(200).send(doc);
  } catch (error) {
    next(error);
  }
};

module.exports.remove = async (req, res, next) => {
  try {
    const id = req.query.id;
    await Contact.findOneAndRemove({ _id: id });
    return res.status(200).send({ message: 'Mesaj silindi.' });
  } catch (error) {
    next(error);
  }
};
