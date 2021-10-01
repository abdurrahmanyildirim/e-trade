const Product = require('../models/product');
const Order = require('../models/order');
const User = require('../models/user');
const { remove } = require('../services/cloudinary');
const { updateProducts } = require('../services/socket');

module.exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true });
    return res.status(200).send(products);
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).send(products);
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports.getByCategory = async (req, res) => {
  try {
    const category = req.query.category;
    const products = await Product.find({ category, isActive: true });
    return res.status(200).send(products);
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports.getProductById = async (req, res) => {
  try {
    const id = req.query.id;
    const product = await Product.findOne({ _id: id });
    return res.status(200).send(product);
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports.checkStock = async (req, res) => {
  try {
    const products = req.body;
    const dbProducts = await Product.find();
    const checkResults = await products.map((product) => {
      const dbProduct = dbProducts.find((prod) => prod.id === product.id);
      if (dbProduct) {
        const hasEnoughStock =
          product.quantity > 0 &&
          dbProduct.stockQuantity > 0 &&
          dbProduct.stockQuantity >= product.quantity;
        return {
          isActive: dbProduct.isActive,
          hasEnoughStock,
          availableQuantity: dbProduct.stockQuantity,
          id: dbProduct._id,
          quantity: product.quantity,
          name: dbProduct.name
        };
      }
    });
    return res.status(200).send(checkResults);
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports.addNewProduct = async (req, res) => {
  try {
    const newProduct = {
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      description: req.body.description,
      discountRate: req.body.discountRate / 100,
      stockQuantity: req.body.stockQuantity,
      brand: req.body.brand,
      rate: 0,
      isActive: true,
      photos: req.body.photos,
      comments: []
    };

    const product = new Product(newProduct);
    const savedProduct = await product.save();
    // updateProducts();
    return res.status(200).send(savedProduct);
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports.remove = async (req, res) => {
  const id = req.query.id;
  const product = await Product.findOne({ _id: id });
  Product.findByIdAndRemove(id, async (err) => {
    if (err) {
      return res.status(404).send({ message: 'Ürün silinirken hata oldu.' });
    }
    const photos = await product.photos.filter((photo, i) => i !== 0);
    for (const photo of photos) {
      try {
        await remove(photo.publicId);
      } catch (error) {
        console.log(error);
        console.log('Foto Silinemedi');
      }
    }
    updateProducts();
    return res.status(200).send({ message: 'Ürün silindi' });
  });
};

module.exports.update = async (req, res) => {
  try {
    const product = req.body;
    await Product.findByIdAndUpdate({ _id: product._id }, product);
    updateProducts();
    return res.status(200).send({ message: 'Güncelleme başarılı' });
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports.addComment = async (req, res) => {
  try {
    const orderId = req.query.orderId.toString();
    const rate = req.query.rate;
    const desc = req.query.desc;
    const productId = req.query.productId.toString();
    const order = await Order.findOne({ _id: orderId });
    if (!order) {
      return res.status(500).send({ message: 'Beklenmeyen bir hata oldu.' });
    }
    const isOrdered = !!order.products.find(
      (product) => product.productId.toString() === productId
    );
    if (!isOrdered) {
      return res.status(400).send({ message: 'Satın alınmayan ürün oylanamaz.' });
    }
    const product = await Product.findOne({ _id: productId });
    if (!product) {
      return res.status(500).send({ message: 'Beklenmeyen bir hata oldu.' });
    }
    const user = await User.findOne({ _id: req.id });
    if (!user) {
      return res.status(500).send({ message: 'Beklenmeyen bir hata oldu.' });
    }
    const comment = await product.comments.find(
      (comment) =>
        comment.userId.toString() === user._id.toString() && comment.orderId.toString() === orderId
    );
    if (comment) {
      product.comments.map((comment) => {
        if (
          comment.userId.toString() === user._id.toString() &&
          comment.orderId.toString() === orderId
        ) {
          comment.rate = rate;
          comment.description = desc;
        }
      });
    } else {
      product.comments.push({
        orderId,
        userId: user.id,
        name: user.firstName + ' ' + user.lastName,
        description: desc,
        rate
      });
    }
    const totalRate = product.comments.reduce((acc, { rate }) => acc + rate, 0);
    product.rate = Number.parseFloat((totalRate / product.comments.length).toFixed(2));
    product.save((err) => {
      if (err) {
        return res.status(500).send({ message: 'Beklenmeyen bir hata oldu.' });
      }
      order.products.find(
        (orderedProduct) => orderedProduct.productId.toString() === productId
      ).rate = rate;
      order.products.map((orderedProduct) => {
        if (orderedProduct.productId.toString() === productId) {
          orderedProduct.comment.rate = rate;
          orderedProduct.comment.desc = desc;
        }
      });
      order.save((err) => {
        if (err) {
          return res.status(500).send({ message: 'Beklenmeyen bir hata oldu.' });
        }
        return res.status(200).send({ message: 'Puanlama yapıldı.' });
      });
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};
