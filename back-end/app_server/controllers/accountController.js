const cloudinary = require('cloudinary').v2;
const config = require('../../config');
const User = require('../models/user');
const crypto = require('crypto');

module.exports.imageUpload = async (req, res) => {

    cloudinary.config({
        cloud_name: config.cloudinary_settings.cloud_name,
        api_key: config.cloudinary_settings.api_key,
        api_secret: config.cloudinary_settings.api_secret
    })

    const image = await cloudinary.uploader.upload(req.files.image.tempFilePath, async (err, image) => {
        if (err) {
            console.log(err);
            return res.status(401).send('Fotoğraf yükleme başarısız.');
        }
    });

    const user = await User.findById(req.id);

    if (user.publicId != '') {
        cloudinary.uploader.destroy(user.publicId, (err) => {
            if (err) {
                console.log(err);
                return res.status(401).send('Fotoğraf yükleme başarısız.');
            }
        })
    }

    user.publicId = image.public_id;
    user.photo = image.url;

    await User.updateOne({ _id: req.id }, user, (err) => {
        if (err) {
            console.log(err);
            return res.status(400).send('Fotoğraf yükleme başarısız.');
        }
    });

    return res.status(201).json({ url: image.url });
}

module.exports.getPhoto = async (req, res) => {
    const account = await User.findById(req.id);

    if (!account) {
        return res.status(400).send('Hesap bulunamadı.')
    }

    return res.status(200).send({ url: account.photo });
}

module.exports.changePassword = async (req, res) => {
    const user = await User.findById(req.id);
    const newPassword = await crypto.createHash('md5').update(req.password).digest("hex");

    user.password = newPassword;

    User.updateOne({ _id: req.id }, user, (err) => {
        if (err) {
            console.log(err)
            return res.status(400).send({ error: 'Şifre değiştirilemedi.' });
        }

        return res.status(200).send({ message: 'Şifre değiştirildi.' });
    })
}

