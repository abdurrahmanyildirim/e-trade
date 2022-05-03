const cloudinaryService = require('../services/cloudinary');
const { editPhoto } = require('../services/photo/index');

const fs = require('fs');

module.exports.photoUpload = async (req, res, next) => {
  try {
    const imagesInfo = [];
    const photos = Array.isArray(req.files.photos) ? req.files.photos : [req.files.photos];
    for (const photo of photos) {
      try {
        uploadedFilePath = await editPhoto(photo);
        const image = await cloudinaryService.upload(uploadedFilePath, 'product/');
        imagesInfo.push({
          publicId: image.public_id,
          path: image.secure_url
        });
        fs.rmSync(uploadedFilePath);
      } catch (error) {
        console.log(error);
        return res.status(400).send({ message: 'Fotoğraf yüklenemedi.' });
      }
    }
    return res.status(200).send(imagesInfo);
  } catch (error) {
    next(error);
  }
};
