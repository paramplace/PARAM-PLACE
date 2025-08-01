const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

const createAdmin = async () => {
  const admin = new Admin({
    username: 'admin',
    password: bcrypt.hashSync('your_secure_password', 10),
    email: 'admin@yourapp.com',
    role: 'superadmin'
  });

  await admin.save();
  console.log('Admin user created');
};

createAdmin().catch(console.error);