const { User } = require('./user');

class Cart extends User {
  constructor() {
    super();
  }

  updateCart({ orders }) {
    this.collection.cart = orders.map((order) => {
      return { productId: order.productId, quantity: order.quantity };
    });
    return this;
  }

  async initByIdWithOrders(id) {
    this.collection = await this.mainModel.findOne({ _id: id }).populate('cart.productId').exec();
    return this;
  }

  getCart() {
    return this.collection.cart.map((order) => {
      const prod = order.productId;
      return this.getOrderedProduct(order, prod);
    });
  }

  getOrderedProduct(order, product) {
    return {
      productId: product._id,
      quantity: order.quantity,
      name: product.name,
      brand: product.brand,
      discountRate: product.discountRate,
      price: product.price,
      photoPath: product.photos[0].path,
      category: product.category
    };
  }

  async updateProductAfterPurchaseAndGetOrders() {
    const orderedProducts = [];
    for (const order of this.collection.cart) {
      const product = order.productId;
      const orderedProduct = this.getOrderedProduct(order, product);
      orderedProducts.push(orderedProduct);
      product.stockQuantity = product.stockQuantity - order.quantity;
      await product.save();
    }
    return orderedProducts;
  }

  reset() {
    this.collection.cart = [];
    return this;
  }
}

module.exports = { Cart };
