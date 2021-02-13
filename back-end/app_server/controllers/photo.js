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

  cloudinary.uploader.upload(req.files.image.tempFilePath, async (err, image) => {
    if (err) {
      console.log(err);
      return res.status(401).send('Fotoğraf yükleme başarısız.');
    }
    const publicId = image.public_id;
    const path = image.url;
    return res.status(201).json({ publicId, path });
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
