const { checkResult } = require('../services/iyzipay');
const User = require('../models/user');
const Order = require('../models/order');
const { decrypt } = require('../services/crypto');
const { sendEmail } = require('../services/email/index');

module.exports.iyzipayCallBack = async (req, res) => {
  try {
    const result = await checkResult(req.body.token);
    let params = '';
    const status = result.paymentStatus === 'SUCCESS' ? true : false;
    params += 'status=' + status;
    params += status ? '' : '&message=' + encodeURIComponent(result.errorMessage);
    if (status === true) {
      await giveOrder(req.query.id);
    }
    return res.redirect(`${process.env.ORIGIN}/cart?${params}`);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

const giveOrder = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ _id: id }).populate('cart.productId').exec();
      if (!user) {
        reject('Kullanıcı bulunamadı');
      }
      const orderedProducts = [];
      await user.cart.forEach(async (order) => {
        const product = order.productId;
        if (product) {
          orderedProducts.push({
            productId: product._id,
            quantity: order.quantity,
            name: product.name,
            brand: product.brand,
            discountRate: product.discountRate,
            price: product.price,
            photoPath: product.photos[0].path,
            category: product.category
          });
        }
      });
      const newOrder = new Order({
        userId: id,
        userName: user.firstName + ' ' + user.lastName,
        email: user.email,
        isActive: true,
        date: Date.now(),
        status: [{ key: 0, desc: 'Siparişiniz alındı.', date: Date.now() }],
        products: orderedProducts,
        contractsChecked: true,
        contactInfo: {
          city: user.addresses[0].city,
          district: user.addresses[0].district,
          address: user.addresses[0].address,
          phone: user.phones[0].phone
        }
      });
      let givenOrder = await newOrder.save();
      user.cart = [];
      await user.save();
      await sendEmail(
        decrypt(user.email),
        'Sipariş Bilgilendirme',
        givenOrder._id + ' numaralı siparişiniz Alındı. En kısa sürede işleme alınacaktır.'
      );
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

// FormReq Result
// Failure Result
// {
//   status: 'success', 'failure'
//   locale: 'tr',
//   systemTime: 1632331403679,
//   token: 'a5a2f08d-70e9-46d5-8f50-13ccf042b159',
//   checkoutFormContent: `<script type="text/javascript">if (typeof iyziInit == 'undefined') {var iyziInit = {currency:"TRY",token:"a5a2f08d-70e9-46d5-8f50-13ccf042b159",price:30.00,locale:"tr",baseUrl:"https://api.iyzipay.com", merchantGatewayBaseUrl:"https://merchant-gateway.iyzipay.com", registerCardEnabled:false,bkmEnabled:false,bankTransferEnabled:false,bankTransferRedirectUrl:"http://localhost:4205/iyzipay/callback",bankTransferCustomUIProps:{},campaignEnabled:false,creditCardEnabled:true,bankTransferAccounts:[],userCards:[],fundEnabled:true,memberCheckoutOtpData:{},force3Ds:true,isSandbox:false,storeNewCardEnabled:true,paymentWithNewCardEnabled:true,enabledApmTypes:[],payWithIyzicoUsed:false,payWithIyzicoEnabled:true,payWithIyzicoCustomUI:{},buyerName:"John",buyerSurname:"Doe",merchantInfo:"https://taserzuccaciye.com/",cancelUrl:"",buyerProtectionEnabled:false,hide3DS:false,gsmNumber:"",email:"email@email.com",checkConsumerDetail:{},subscriptionPaymentEnabled:false,ucsEnabled:false,fingerprintEnabled:false,payWithIyzicoFirstTab:false,metadata : {},createTag:function(){var iyziJSTag = document.createElement('script');iyziJSTag.setAttribute('src','https://static.iyzipay.com/checkoutform/v2/bundle.js?v=1632331403678');document.head.appendChild(iyziJSTag);}};iyziInit.createTag();}</script>`,
//   tokenExpireTime: 1800,
//   paymentPageUrl: 'https://cpp.iyzipay.com?token=a5a2f08d-70e9-46d5-8f50-13ccf042b159&lang=tr',
//   payWithIyzicoPageUrl: 'https://consumer.iyzico.com/checkout?token=a5a2f08d-70e9-46d5-8f50-13ccf042b159&lang=tr'
//   payWithIyzicoPageUrl
// }

// Success Result
// {
//   status: 'success',
//   locale: 'tr',
//   systemTime: 1632772553779,
//   price: 0.99,
//   paidPrice: 0.99,
//   installment: 1,
//   paymentId: '2160053272',
//   fraudStatus: 1,
//   merchantCommissionRate: 0,
//   merchantCommissionRateAmount: 0,
//   iyziCommissionRateAmount: 0.029601,
//   iyziCommissionFee: 0.25,
//   cardType: 'DEBIT_CARD',
//   cardAssociation: 'VISA',
//   cardFamily: 'Paracard',
//   binNumber: '489455',
//   lastFourDigits: '8732',
//   currency: 'TRY',
//   itemTransactions: [
//     {
//       itemId: '61521c8ee11af05f5cd72b06',
//       paymentTransactionId: '1797464062',
//       transactionStatus: 2,
//       price: 0.99,
//       paidPrice: 0.99,
//       merchantCommissionRate: 0,
//       merchantCommissionRateAmount: 0,
//       iyziCommissionRateAmount: 0.029601,
//       iyziCommissionFee: 0.25,
//       blockageRate: 0,
//       blockageRateAmountMerchant: 0,
//       blockageRateAmountSubMerchant: 0,
//       blockageResolvedDate: '2021-09-30 00:00:00',
//       subMerchantPrice: 0,
//       subMerchantPayoutRate: 0,
//       subMerchantPayoutAmount: 0,
//       merchantPayoutAmount: 0.710399,
//       convertedPayout: [Object]
//     }
//   ],
//   authCode: '851495',
//   phase: 'AUTH',
//   mdStatus: 1,
//   hostReference: '127022449234',
//   token: '70d54a4e-a40d-4756-b1a7-f01beaba6f2a',
//   paymentStatus: 'SUCCESS'
// }
