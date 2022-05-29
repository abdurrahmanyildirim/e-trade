const sharp = require('sharp');
const fs = require('fs');
const axios = require('axios');
const { upload } = require('../cloudinary');

const editPhoto = async (photo) => {
  const pngFile = fs.readFileSync(photo.tempFilePath);
  const filePath = `${__dirname}/${photo.name}`;
  const { width, height } = await sharp(pngFile).toFile(filePath);

  let sh = sharp(filePath);
  sh = resizeImage({ sh, width, height });

  const uploadedFilePath = `${__dirname}/edited-photos/${photo.name}`;
  await createImage({ sh, uploadedFilePath });

  removeFile(filePath);
  removeFile(photo.tempFilePath);

  return uploadedFilePath;
};

const resizeImage = ({ sh, width, height }) => {
  if (isHighResolution({ width, height })) {
    let [newWidth, newHeight] = [800, 800];
    if (width > height) {
      newHeight = parseInt((newWidth * height) / width);
    } else {
      newWidth = parseInt((newHeight * width) / height);
    }
    sh = sh.resize(newWidth, newHeight);
  }
  return sh;
};

const fixHighResolutionPhotos = async (photos) => {
  const images = [];
  for (let photo of photos) {
    const buffer = await downloadPhoto(photo.path);

    const dowloadLocation = `${__dirname}/${photo._id}`;
    const { format, width, height } = await sharp(buffer).toFile(dowloadLocation);

    if (isHighResolution({ width, height })) {
      let sh = sharp(dowloadLocation);
      sh = resizeImage({ sh, width, height });
      const uploadedFilePath = `${__dirname}/edited-photos/${photo._id}.${format}`;
      await createImage({ sh, uploadedFilePath });
      removeFile(dowloadLocation);
      photo = await upload(uploadedFilePath, 'product/');
      removeFile(uploadedFilePath);
    } else {
      removeFile(dowloadLocation);
    }

    images.push({
      publicId: photo.public_id ? photo.public_id : photo.publicId,
      path: photo.secure_url ? photo.secure_url : photo.path
    });
  }
  return images;
};

const createImage = async ({ sh, uploadedFilePath }) => {
  await sh.jpeg({ progressive: true, force: true, quality: 85 }).toFile(uploadedFilePath);
};

const removeFile = (path) => {
  fs.rmSync(path);
};

const isHighResolution = ({ width, height }) => {
  return width > 800 && height > 800;
};

const downloadPhoto = async (path) => {
  const response = await axios.get(path, { responseType: 'arraybuffer' });
  return Buffer.from(response.data, 'utf-8');
};

module.exports = {
  editPhoto,
  fixHighResolutionPhotos
};
