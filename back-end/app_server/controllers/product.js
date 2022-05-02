const Product = require('../business/product');
const Order = require('../business/order');
const { User } = require('../business/user');

module.exports.getProducts = async (req, res, next) => {
  try {
    const product = await new Product().initActives();
    return res.status(200).send(product.collection);
  } catch (error) {
    next(error);
  }
};

module.exports.getAllProducts = async (req, res, next) => {
  try {
    const product = await new Product().initAll();
    return res.status(200).send(product.collection);
  } catch (error) {
    next(error);
  }
};

module.exports.getByCategory = async (req, res, next) => {
  try {
    const category = req.query.category;
    const product = await new Product().initActivesByCategory(category);
    return res.status(200).send(product.collection);
  } catch (error) {
    next(error);
  }
};

module.exports.getProductById = async (req, res, next) => {
  try {
    const id = req.query.id;
    const product = await new Product().initById(id);
    return res.status(200).send(product.collection);
  } catch (error) {
    next(error);
  }
};

module.exports.checkStock = async (req, res, next) => {
  try {
    const products = req.body;
    const product = await new Product().initAll();
    const checkedProducts = product.getProductsWithStockInfo(products);
    return res.status(200).send(checkedProducts);
  } catch (error) {
    next(error);
  }
};

module.exports.addNewProduct = async (req, res, next) => {
  try {
    const product = await new Product().createNewProduct(req.body).save();
    return res.status(200).send(product.collection);
  } catch (error) {
    next(error);
  }
};

module.exports.remove = async (req, res) => {
  const id = req.query.id;
  await new Product().removeById(id);
  return res.status(200).send({ message: 'Ürün silindi' });
};

module.exports.update = async (req, res, next) => {
  try {
    const product = req.body;
    await new Product().updateById(product);
    return res.status(200).send({ message: 'Güncelleme başarılı' });
  } catch (error) {
    next(error);
  }
};

module.exports.addComment = async (req, res, next) => {
  try {
    const { desc, rate, productId, orderId } = req.query;
    const order = await new Order().initById(orderId);
    if (!order.collection) {
      return res.status(500).send({ message: 'Beklenmeyen bir hata oldu.' });
    }
    const orderedProduct = order.collection.products.find(
      (product) => product.productId.toString() === productId
    );
    if (!orderedProduct) {
      return res.status(400).send({ message: 'Satın alınmayan ürün oylanamaz.' });
    }
    const product = await new Product().initById(productId);
    if (!product.collection) {
      return res.status(500).send({ message: 'Beklenmeyen bir hata oldu.' });
    }
    const user = await new User().initById(req.id);
    if (!user.collection) {
      return res.status(500).send({ message: 'Beklenmeyen bir hata oldu.' });
    }
    const comment = product.getComment({ userId: req.id, orderId });
    if (comment) {
      comment.rate = rate;
      comment.description = desc;
    } else {
      product.insertComment({ userId: req.id, orderId, description: desc, rate });
    }
    await product.updateProductRate().save();
    orderedProduct.comment = {
      rate,
      desc
    };
    await order.save();
    return res.status(200).send({ message: 'Puanlama yapıldı.' });
  } catch (error) {
    next(error);
  }
};
