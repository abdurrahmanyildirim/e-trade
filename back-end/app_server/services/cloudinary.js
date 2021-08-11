const cloudinary = require('cloudinary').v2;
const config = require('../../config');

cloudinary.config({
  cloud_name: process.env.CLOUDİNARY_CLOUD_NAME,
  api_key: process.env.CLOUDİNARY_API_KEY,
  api_secret: process.env.CLOUDİNARY_API_SECRET
});

module.exports.upload = async (tempFilePath, folder) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(tempFilePath, { folder }, (err, image) => {
      if (err) {
        reject(err);
      }
      resolve(image);
    });
  });
};

module.exports.remove = async (publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};
