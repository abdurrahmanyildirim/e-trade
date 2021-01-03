const crypto = require('crypto');
const jwt = require('jsonwebtoken')
const User = require('../models/user');
const config = require('../../config');

module.exports.login = (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(404).send({
            message: 'Email ve Şifre boş bırakılamaz.',
        });
    } else {
        let reqEmail = req.body.email;
        let reqPassword = crypto.createHash('md5').update(req.body.password).digest("hex");
        console.log(reqEmail);
        console.log(reqPassword);
        // User.findOne({ email: reqEmail, password: reqPassword }, (err, data) => {
        //     if (err) {
        //         return res.status(404).send({
        //             error: err
        //         });
        //     } else if (!data) {
        //         return res.status(400).send({
        //             message: 'Böyle bir kullanıcı kaydı yoktur.'
        //         })
        //     } else {
        //         const token = jwt.sign({
        //             _id: data._id,
        //             role: data.role,
        //             email: data.email
        //         },
        //             config.TOKEN_KEY,
        //             {
        //                 expiresIn: "2d"
        //             }
        //         )
        //         return res.status(200).send({ message: 'Başarılı', token: token });
        //     }
        // })

    }
}

module.exports.register = (req, res) => {
    if (!req) {
        return res.sendStatus(404).send({ message: "Boş nesne gönderilemez." })
    } else {
        let userData = req.body;

        let reqUser = new User(userData);

        User.find({ email: reqUser.email, nickName: reqUser.nickName }, (err, data) => {
            if (err) {
                return res.status(401).send(err);
            } else {
                if (data.length > 0) {
                    console.log(data);
                    res.status(401).send({ message: "Lütfen mail adresinizi kontrol ediniz." })
                } else {
                    reqUser.password = crypto.createHash('md5').update(reqUser.password).digest("hex");
                    reqUser.role = 'Client';
                    reqUser.save((err) => {
                        if (err) {
                            return res.status(404).send(err)
                        }

                        return res.status(201).send({ message: "Yeni kullanıcı oluşturuldu." });
                    })
                }
            }
        })
    }
}

module.exports.checkNickName = (req, res) => {
    if (!req.url) {
        return res.status(404).send({ message: "Kullanıcı adı boş olamaz." })
    } else {
        let nickName = req.query.nickName;
        User.find({ nickName: nickName }, (err, data) => {
            if (data.length > 0) {
                return res.status(400).send({ message: "Bu kullanıcı adı başka bir kişi tarafından kullanılmaktadır." })
            } else {
                return res.status(200).send({ message: "Bu kullanıcı adını kullanabilirsiniz." });
            }
        })
    }
}

module.exports.decodeToken = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(400).send('Token tespit edilemedi');
    }
    const authorization = req.headers.authorization;
    const token = authorization.split(' ')[1];
    const decodenToken = await jwt.decode(token, { key: config.TOKEN_KEY });
    req.id = decodenToken._id;
    req.role = decodenToken.role;
    next();
}
