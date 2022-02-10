const Contact = require('../models/contact');
const { encrypt, encForResp } = require('../services/crypto');

module.exports.sendContactRequest = async (req, res, next) => {
  try {
    const contactReq = req.body;
    contactReq.email = encrypt(contactReq.email);
    contactReq.phone = encrypt(contactReq.phone);
    contactReq.isRead = false;
    contactReq.sendDate = Date.now();
    const contact = new Contact(contactReq);
    await contact.save();
    return res.status(200).send({ message: 'Mesaj iletildi' });
  } catch (error) {
    next(error);
  }
};

module.exports.getMessages = (req, res) => {
  Contact.find((err, messages) => {
    if (err) {
      return res.status(404).send({ message: 'Beklenmeyen bir hata oldu.' });
    }
    if (messages && messages.length > 0) {
      messages.map((message) => {
        message.email = encForResp(message.email);
        message.phone = encForResp(message.phone);
        return message;
      });
    }
    return res.status(200).send(messages);
  });
};

module.exports.toggleRead = (req, res) => {
  const id = req.query.id;
  Contact.findOneAndUpdate({ _id: id }, { $set: { isRead: true } }, (err, doc) => {
    if (err) {
      return res.status(404).send({ message: 'Beklenmeyen bir hata oldu.' });
    }
    return res.status(200).send(doc);
  });
};

module.exports.remove = (req, res) => {
  const id = req.query.id;
  Contact.findOneAndRemove({ _id: id }, (err) => {
    if (err) {
      return res.status(404).send({ message: 'Beklenmeyen bir hata oldu.' });
    }
    return res.status(200).send({ message: 'Mesaj silindi.' });
  });
};
