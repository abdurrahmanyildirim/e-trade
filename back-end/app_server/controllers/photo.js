const cloudinary = require('cloudinary').v2;
const config = require('../../config');
const User = require('../models/user');
// const crypto = require('crypto');

module.exports.photoUpload = async (req, res) => {
  cloudinary.config({
    cloud_name: config.cloudinary_settings.cloud_name,
    api_key: config.cloudinary_settings.api_key,
    api_secret: config.cloudinary_settings.api_secret
  });
  const imagesInfo = [];
  for (const photo of req.files.photos) {
    const image = await cloudinaryImageUploadMethod(photo.tempFilePath);
    imagesInfo.push({
      publicId: image.public_id,
      path: image.url
    });
  }
  return res.status(200).send(imagesInfo);
};

const cloudinaryImageUploadMethod = async (tempFilePath) => {
  return new Promise((resolve) => {
    cloudinary.uploader.upload(tempFilePath, { folder: 'product/' }, (err, image) => {
      if (err) return res.status(500).send('upload image error');
      resolve(image);
    });
  });
};

// module.exports.changePassword = async (req, res) => {
//     const user = await User.findById(req.id);
//     const newPassword = await crypto.createHash('md5').update(req.password).digest("hex");

//     user.password = newPassword;

//     User.updateOne({ _id: req.id }, user, (err) => {
//         if (err) {
//             console.log(err)
//             return res.status(400).send({ error: 'Şifre değiştirilemedi.' });
//         }

//         return res.status(200).send({ message: 'Şifre değiştirildi.' });
//     })
// }
