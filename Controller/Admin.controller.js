let companyModel= require('../Model/Company');
let  Signupmodel= require('../Model/SignupModel');
let exhibitionModel= require('../Model/Exhibition');
const ProductModel = require('../Model/ProductModel');
const { productupload } = require('../Middleware/Middleware');
async function AdmingetSignup(req,res){
    let result =    await Signupmodel.find({});
    res.send(result);
};
async function Admingetexhibition(req,res){
    let result =    await exhibitionModel.find({});
    res.send(result);
};
async function Admingetcompany(req,res){
    let result =    await companyModel.find({});
    res.send(result);
};
async function Admingetproduct(req,res){
    let result =    await ProductModel.find({});
    res.send(result);
};
// Controller function to delete all exhibitions
async function Admindeleteallexhibition(req, res) {
  try {
    // Delete all documents from exhibition collection
    const result = await exhibitionModel.deleteMany({});
    const result2 = await companyModel.deleteMany({});
    const result3 = await ProductModel.deleteMany({});

    // Send success response
    res.status(200).json({
      success: true,
      message: "All exhibitions deleted successfully",
      deletedCount: result.deletedCount,
      deletedCount: result2.deletedCount,
      deletedCount: result3.deletedCount,
    });

  } catch (error) {
    console.error("Error deleting exhibitions:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while deleting exhibitions",
      error: error.message,
    });
  }
}
async function Admindeleteallcompany(req, res) {
  try {
    // Delete all documents from exhibition collection
    const result = await companyModel.deleteMany({});
    const result2 = await ProductModel.deleteMany({});

    // Send success response
    res.status(200).json({
      success: true,
      message: "All Company deleted successfully",
      deletedCount: result.deletedCount,
      deletedCount: result2.deletedCount,
    });

  } catch (error) {
    console.error("Error deleting compnay:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while deleting company",
      error: error.message,
    });
  }
}
async function Admindeleteallproduct(req, res) {
  try {
    // Delete all documents from exhibition collection
    const result = await ProductModel.deleteMany({});

    // Send success response
    res.status(200).json({
      success: true,
      message: "All Product deleted successfully",
      deletedCount: result.deletedCount,
    });

  } catch (error) {
    console.error("Error deleting Product:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while deleting Product",
      error: error.message,
    });
  }
}
module.exports = Admindeleteallexhibition;


module.exports = {
    AdmingetSignup,
    Admingetcompany,
    Admingetexhibition,
    Admingetproduct,
    Admindeleteallexhibition,
    Admindeleteallcompany,
    Admindeleteallproduct
};