const Contact = require('../business/contact');

module.exports.sendContactRequest = async (req, res, next) => {
  try {
    await new Contact().createNewContact(req.body).save();
    return res.status(200).send({ message: 'Mesaj iletildi' });
  } catch (error) {
    next(error);
  }
};

module.exports.getMessages = async (req, res, next) => {
  try {
    const messages = (await new Contact().initMessages()).collection;
    return res.status(200).send(messages);
  } catch (error) {
    next(error);
  }
};

module.exports.toggleRead = async (req, res, next) => {
  try {
    const id = req.query.id;
    const contact = await new Contact().toggleRead(id);
    return res.status(200).send(contact.collection);
  } catch (error) {
    next(error);
  }
};

module.exports.remove = async (req, res, next) => {
  try {
    const id = req.query.id;
    await new Contact().remove(id);
    return res.status(200).send({ message: 'Mesaj silindi.' });
  } catch (error) {
    next(error);
  }
};
