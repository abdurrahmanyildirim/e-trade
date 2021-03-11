const Contact = require('../models/contact');

module.exports.sendContactRequest = (req, res) => {
  const contactReq = req.body;
  contactReq.isRead = false;
  contactReq.sendDate = Date.now();
  const contact = new Contact(contactReq);
  contact.save((err) => {
    if (err) {
      return res.status(404).send({ message: 'Mesaj iletilemedi' });
    }
    return res.status(200).send({ message: 'Mesaj iletildi' });
  });
};

module.exports.getMessages = (req, res) => {
  Contact.find((err, messages) => {
    if (err) {
      return res.status(404).send({ message: 'Beklenmeyen bir hata oldu.' });
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
