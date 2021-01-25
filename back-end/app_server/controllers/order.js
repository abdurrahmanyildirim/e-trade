const Order = require('../models/order');
const Product = require('../models/product');

module.exports.getOrders = (req, res) => {
  Order.find({ userId: req.id }, (err, orders) => {
    if (err) {
      return res.status(404).send({ message: 'Siparişler bulunamadı' });
    }
    return res.status(200).send(orders);
  });
};

module.exports.orderDetail = async (req, res) => {
  const id = req.params.id;
  const products = await Product.find();
  if (!products) {
    return res.status(404).send({ message: 'Veri tabanında bir hata oldu.' });
  }
  Order.findOne({ _id: id }, (err, order) => {
    if (err) {
      return res.status(404).send({ message: 'Siparişler bulunamadı' });
    }

    const orderedProducts = [];
    order.products.map((product) => {
      const dbProduct = products.find(
        (prod) => prod.id.toString() === product.productId.toString()
      );
      orderedProducts.push({
        _id: product._id,
        productId: product.productId,
        quantity: product.quantity,
        discountRate: product.discountRate,
        price: product.price,
        photoPath: product.photoPath,
        brand: dbProduct.brand,
        name: dbProduct.name
      });
    });

    return res.status(200).send({
      userId: order.userId,
      date: order.date,
      products: orderedProducts,
      isActive: order.isActive,
      status: order.status,
      contactInfo: order.contactInfo
    });
  });
};
