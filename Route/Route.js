const express = require('express');
const {
  handleDelete,
  handlesignup,
  handlelogin,
  handleorganiser,
  handleGetaddCompany,
  handleExhibition,
  handleGetExhibition,
  handleFindExhibition,
  handlepostcompany,
  handleGetCompany,
  handlePostProduct,
  handleGetproduct,
  handlefindsignup,
  handlegetBrochure,
  handleappsignup,
  handleotp,
  handleappotp,
  handlewebotp,
  handleapplogin,
  handleapprealsignup,
  handlegetimage,
  handleproductDetail,
  handlecompanysingleDelete,
  handleGetforupdateCompany,
  handleproductsingleDelete
} = require('../Controller/Controller');

const {
  AdmingetSignup,
  Admingetcompany,
  Admingetexhibition,
  Admingetproduct,
  Admindeleteallexhibition,Admindeleteallcompany,
  Admindeleteallproduct,
  AdminUpdateExhibition,
  AdminUpdatecompany,
  AdminUpdateproduct
} = require('../Controller/Admin.controller');

const {
  restrictToLoginUser,
  upload,
  productstorage,
  productupload,
  exhibitionupload,
  companyupload,
  signupappmidle
} = require('../Middleware/Middleware');

const router = express.Router();

/**
 * 🔑 Auth Routes
 */
router.post('/api/signup', handlesignup);
router.post('/app/signup',handleappsignup);
router.post('/app/realsignup',handleapprealsignup);
router.post('/app/otp',handleappotp);
router.post('/app/login',handleapplogin);
router.post('/api/otp',handlewebotp);
router.post('/api/login', handlelogin);
router.get('/api/find/signup/:id', handlefindsignup);


/**
 * 🎪 Exhibition Routes
 */
// router.post('/api/exhibition',exhibitionupload.fields([{ name: 'exhibition_image', maxCount: 1 },{ name: 'layout', maxCount: 1 }]),restrictToLoginUser, handleExhibition);
router.get('/api/exhibition', restrictToLoginUser , handleGetExhibition);
router.post('/api/exhibition',exhibitionupload.fields([{ name: "exhibition_image" }, { name: "layout" }]), restrictToLoginUser, handleExhibition);
router.post('/api/findexhibition', handleFindExhibition);
router.get('/api/find/exhibition/:id', handleFindExhibition);
router.delete('/api/delete/exhibition/:id', handleDelete);
router.delete('/api/delete/company/:id', handlecompanysingleDelete);
router.delete('/api/delete/product/:id', handleproductsingleDelete);

/**
 * 🏢 Company Routes
 */
router.post('/api/company',companyupload.fields([{name:'brochure'},{name:'company_image_url'}]), handlepostcompany);
router.get('/api/company/:id', handleGetCompany); 
router.get('/api/companydetail/:id', handleGetforupdateCompany); 
router.get('/api/company/addproduct/:id', handleGetaddCompany); 
router.get('/api/product/:id', handleGetproduct); 
router.post("/api/product", productupload.fields([{ name: "image" }, { name: "video" }]),handlePostProduct);
router.get("/api/product/detail/:id",handleproductDetail);
router.get('/api/brochure/:id',handlegetBrochure)
router.post('/api/image',handlegetimage)
/**
 * 📊 Dashboard / Organisers
 */
router.get('/api/dashboard', handleorganiser);

/**
 * 👑 Admin Routes
 */
router.get('/api/admin/signup', AdmingetSignup);
router.get('/api/admin/exhibition', Admingetexhibition);
router.get('/api/admin/company', Admingetcompany);
router.get('/api/admin/product', Admingetproduct);
router.delete('/api/admin/deleteallexhibition', Admindeleteallexhibition);
router.delete('/api/admin/deleteallproduct', Admindeleteallproduct);
router.delete('/api/admin/deleteallcompany', Admindeleteallcompany);
router.put('/api/admin/updateexhibitions/:id',AdminUpdateExhibition)
router.put('/api/admin/updatecompany/:id',AdminUpdatecompany)
router.put('/api/admin/updateproduct/:id',AdminUpdateproduct)

module.exports = router;
