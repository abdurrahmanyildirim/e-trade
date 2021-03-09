const Contact = require('../models/contact');

module.exports.sendContactRequest = (req, res) => {
  const contactReq = req.body;
  contactReq.isViewed = false;
  const contact = new Contact(contactReq);
  contact.save((err) => {
    if (err) {
      return res.status(404).send({ message: 'Mesaj iletilemedi' });
    }
    return res.status(200).send({ message: 'Mesaj iletildi' });
  });
};
