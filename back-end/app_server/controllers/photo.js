const cloudinaryService = require('../services/cloudinary');

module.exports.photoUpload = async (req, res) => {
  const imagesInfo = [];
  const photos = Array.isArray(req.files.photos) ? req.files.photos : [req.files.photos];
  for (const photo of photos) {
    try {
      const image = await cloudinaryService.upload(photo.tempFilePath, 'product/');
      imagesInfo.push({
        publicId: image.public_id,
        path: image.url
      });
    } catch (error) {
      console.log(error);
      return res.status(401).send({ message: 'Fotoğraf yüklenemedi.' });
    }
  }
  return res.status(200).send(imagesInfo);
};
