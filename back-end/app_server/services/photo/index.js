const sharp = require('sharp');
const fs = require('fs');

const editPhoto = async (photo) => {
  const pngFile = fs.readFileSync(photo.tempFilePath);
  const { width, height } = await sharp(pngFile).toFile(`${__dirname}/${photo.name}`);

  let sh = sharp(`${__dirname}/${photo.name}`);
  sh = resizeImage({ sh, width, height });

  const uploadedFilePath = `${__dirname}/edited-photos/${photo.name}`;
  await sh.jpeg({ progressive: true, force: true, quality: 85 }).toFile(uploadedFilePath);

  fs.rmSync(`${__dirname}/${photo.name}`);
  fs.rmSync(photo.tempFilePath);

  return uploadedFilePath;
};

const resizeImage = ({ sh, width, height }) => {
  if (width > 800 && height > 800) {
    let [newWidth, newHeight] = [800, 800];
    if (width > height) {
      newWidth = 800;
      newHeight = parseInt((newWidth * height) / width);
    } else {
      newHeight = 800;
      newWidth = parseInt((newHeight * width) / height);
    }
    sh = sh.resize(newWidth, newHeight);
  }
  return sh;
};

module.exports = {
  editPhoto
};
