const Product = require('../models/product');
const Order = require('../models/order');
const User = require('../models/user');
// const cloudinaryService = require('../services/cloudinary');
const { updateProducts } = require('../services/socket');

module.exports.getProducts = (req, res) => {
  Product.find({ isActive: true }, (err, products) => {
    if (err) {
      return res.status(404).send({ message: 'Bir hata meydana geldi' });
    }
    return res.status(200).send(products);
  });
};

module.exports.getAllProducts = (req, res) => {
  Product.find((err, products) => {
    if (err) {
      return res.status(404).send({ message: 'Bir hata meydana geldi' });
    }
    return res.status(200).send(products);
  });
};

module.exports.getByCategory = (req, res) => {
  const category = req.query.category;
  Product.find({ category, isActive: true }, (err, products) => {
    if (err) {
      return res.status(404).send({ message: 'Bir hata meydana geldi.' });
    }
    return res.status(200).send(products);
  });
};

module.exports.getProductById = (req, res) => {
  const id = req.query.id;
  Product.findOne({ _id: id }, (err, product) => {
    if (err) {
      return res.status(404).send();
    }
    return res.status(200).send(product);
  });
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

module.exports.remove = (req, res) => {
  const id = req.query.id;
  // const product = await Product.findOne({ _id: id });
  Product.findByIdAndRemove(id, async (err) => {
    if (err) {
      return res.status(404).send({ message: 'Ürün silinirken hata oldu.' });
    }
    // for (const photo of product.photos) {
    //   try {
    //     await cloudinaryService.remove(photo.publicId);
    //   } catch (error) {
    //     console.log(error);
    //     console.log('Foto Silinemedi');
    //   }
    // }
    updateProducts();
    return res.status(200).send({ message: 'Ürün silindi' });
  });
};

module.exports.update = (req, res) => {
  const product = req.body;
  Product.findByIdAndUpdate({ _id: product._id }, product, (err) => {
    if (err) {
      return res.status(401).send({ message: 'Bir hata meydana geldi.' });
    }
    updateProducts();
    return res.status(200).send({ message: 'Güncelleme başarılı' });
  });
};

module.exports.addComment = (req, res) => {
  const orderId = req.query.orderId.toString();
  const rate = req.query.rate;
  const productId = req.query.productId.toString();
  Order.findOne({ _id: orderId }, (err, order) => {
    if (err) {
      return res.status(500).send({ message: 'Beklenmeyen bir hata oldu.' });
    }
    const isOrdered = !!order.products.find(
      (product) => product.productId.toString() === productId
    );
    if (!isOrdered) {
      return res.status(400).send({ message: 'Satın alınmayan ürün oylanamaz.' });
    }
    Product.findOne({ _id: productId }, (err, product) => {
      if (err) {
        return res.status(500).send({ message: 'Beklenmeyen bir hata oldu.' });
      }
      User.findOne({ _id: req.id }, (err, user) => {
        if (err) {
          return res.status(500).send({ message: 'Beklenmeyen bir hata oldu.' });
        }
        const comment = product.comments.find(
          (comment) =>
            comment.userId.toString() === user._id.toString() &&
            comment.orderId.toString() === orderId
        );
        if (comment) {
          product.comments.find(
            (comment) =>
              comment.userId.toString() === user._id.toString() &&
              comment.orderId.toString() === orderId
          ).rate = rate;
        } else {
          product.comments.push({
            orderId,
            userId: user.id,
            name: user.firstName + ' ' + user.lastName,
            description: '',
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
          order.save((err) => {
            if (err) {
              return res.status(500).send({ message: 'Beklenmeyen bir hata oldu.' });
            }
            return res.status(200).send({ message: 'Puanlama yapıldı.' });
          });
        });
      });
    });
  });
};
