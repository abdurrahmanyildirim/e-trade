const cloudinaryService = require('../services/cloudinary');

module.exports.photoUpload = async (req, res) => {
  try {
    const imagesInfo = [];
    const photos = Array.isArray(req.files.photos) ? req.files.photos : [req.files.photos];
    for (const photo of photos) {
      try {
        const image = await cloudinaryService.upload(photo.tempFilePath, 'product/');
        imagesInfo.push({
          publicId: image.public_id,
          path: image.secure_url
        });
      } catch (error) {
        console.log(error);
        return res.status(400).send({ message: 'Fotoğraf yüklenemedi.' });
      }
    }
    return res.status(200).send(imagesInfo);
  } catch (error) {
    return res.status(500).send(error);
  }
};
