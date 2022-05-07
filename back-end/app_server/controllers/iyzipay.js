const { checkResult } = require('../services/iyzipay');
const Order = require('../business/order');

module.exports.iyzipayCallBack = async (req, res, next) => {
  try {
    const result = await checkResult(req.body.token);
    let params = '';
    const status = result.paymentStatus === 'SUCCESS' ? true : false;
    params += 'status=' + status;
    params += status ? '' : '&message=' + encodeURIComponent(result.errorMessage);
    if (status === true) {
      await new Order().giveOrder(req.query.id);
    }
    return res.redirect(`${process.env.ORIGIN}/cart?${params}`);
  } catch (error) {
    next(error);
  }
};
