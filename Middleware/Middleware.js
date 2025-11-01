const { getExhibition, getname } = require("../Service/Auth");
let nodemailer= require('nodemailer')
const multer  = require('multer');
const path = require('path')
function restrictToLoginUser(req, res, next) {
  try {
    const token = req.cookies?.uid;
    if (!token) {
      console.warn('No token found in cookies');
      return res.status(401).json({ message: 'Not logged in' });
    }

    const user = getExhibition(token); // removed await
    console.log('Authenticated user:', user);

    if (!user) {
      console.warn('Invalid or expired token');
      return res.status(401).json({ message: 'Session expired. Please log in again.' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Error in restrictToLoginUser middleware:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

function addvaluetoexhibition(req, res, next) {
  try {
    const token = req.cookies?.name;
    if (!token) {
      console.warn('No token found in cookies in company');
      return res.status(401).json({ message: 'Not logged in' });
    }

    const user = getname(token); // removed await
    if (!user) {
      console.warn('Invalid or expired token');
      return res.status(401).json({ message: 'Session expired. Please log in again.' });
    }

    req.exhibition = user;
    next();
  } catch (err) {
    console.error('Error in addvaluetoexhibition middleware:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const productstorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './Product_uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})
const companystorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './company_uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})
const exhibtionstorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './Exhibition_uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})
const companyupload = multer({ storage: companystorage })
const productupload = multer({ storage: productstorage })
const exhibitionupload = multer({ storage: exhibtionstorage })
module.exports = { restrictToLoginUser, addvaluetoexhibition,productupload,exhibitionupload,companyupload};
