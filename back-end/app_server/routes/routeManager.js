const authRoute = require('./authRoute');
// const settingRoute = require('./settingRoute');
const accountRoute = require('./accountRoute');
const fileUpload = require('express-fileupload');
const authController = require('../controllers/authController');

module.exports = (app) => {
    app.use('/auth', authRoute);
    app.use(authController.decodeToken);
    // app.use('/setting', settingRoute);
    app.use(fileUpload({ useTempFiles: true }));
    app.use('/account', accountRoute);
}
