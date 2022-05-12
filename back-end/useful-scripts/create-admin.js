const User = require('../app_server/models/user');
const dotenv = require('dotenv');
const path = require('path');

process.env.NODE_ENV = 'github';
dotenv.config({
  path: path.join('../env/' + process.env.NODE_ENV + '.env')
});
const db = require('../app_server/database/connection');
const { encrypt, hashPassword } = require('../app_server/services/crypto');
db.init();

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const createAdmin = async () => {
  try {
    const email = (await getEmail()).trim();
    const password = (await getPassword()).trim();
    let user = await User.findOne({ email: encrypt(email) });
    if (user) {
      console.log('Bu kullanıcı zaten mevcut');
      return;
    }
    user = new User({
      firstName: 'Admin',
      lastName: 'Admin',
      role: 'Admin',
      authType: 'normal',
      isActivated: true,
      email: encrypt(email),
      password: hashPassword(password)
    });
    await user.save();
  } catch (error) {
    console.log(error);
  }
};

const getEmail = () => {
  return new Promise((resolve, reject) => {
    readline.question('Email : ', (email) => {
      resolve(email);
    });
  });
};

const getPassword = () => {
  return new Promise((resolve, reject) => {
    readline.question('Password : ', (password) => {
      readline.close();
      resolve(password);
    });
  });
};

createAdmin().then(() => {
  console.log('Admin user had been created');
});
