// Auth.js
const jwt = require('jsonwebtoken');
const JWT_KEY = process.env.JWT_KEY || 'default_key';

function setExhibition(user) {
  const payload = {
    _id: user._id,
    email: user.email,
    phonenumber: user.mobile_number
  };
  return jwt.sign(payload, JWT_KEY);
}

function getExhibition(token) {
  try {
    return jwt.verify(token, JWT_KEY);
  } catch (err) {
    console.error('JWT verification failed:', err);
    return null;
  }
}

function setname(data) {
  const payload = {
    _id: data._id,
    Exhibition: data.exhibition_name // keep casing consistent here
  };
  return jwt.sign(payload, JWT_KEY);
}

function getname(token) {
  try {
    return jwt.verify(token, JWT_KEY);
  } catch (err) {
    console.error('JWT verification failed:', err);
    return null;
  }
}
 

module.exports = { setExhibition, getExhibition, setname, getname };
