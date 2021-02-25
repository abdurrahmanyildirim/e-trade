const cloudinary = require('cloudinary').v2;
const config = require('../../config');

cloudinary.config({
  cloud_name: config.cloudinary_settings.cloud_name,
  api_key: config.cloudinary_settings.api_key,
  api_secret: config.cloudinary_settings.api_secret
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
