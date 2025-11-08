// import nodemailer from "nodemailer";
const nodemailer = require('nodemailer')
const path = require('path')
const companyModel = require('../Model/Company');
const exhibitionModel = require('../Model/Exhibition');
const ProductModel = require('../Model/ProductModel');
const Signupmodel = require('../Model/SignupModel');
const { setExhibition, setname } = require('../Service/Auth');
const fs = require('fs');
const mongoose = require("mongoose");   // ✅ FIXED (no import, use require)
const otpmodel = require('../Model/Otpmodel');
let cloudinary = require('../Service/Cloudinay')
// ✅ Helper to handle server errors consistently
const handleServerError = (res, err, message = "Internal Server Error") => {
  console.error("❌", err);
  return res.status(500).json({ message });
};

// ✅ Signup
async function handlesignup(req, res) {
  try {
    const {
      first_name,
      last_name,
      designation,
      mobile_number,
      password,
      address,
      email,
      website,
      state,
      city,
      country,
      company_name,
    } = req.body;
    let otp = "";
    for (let i = 0; i < 6; i++) {
      otp = Math.floor(100000 + Math.random() * 900000);
    }
    otp = Number(otp); // ensure it's a number

    console.log("Generated OTP:", otp);

    // 2. Hash password before saving
    const hashedPass = await bcrypt.hash(password, 10);

    // 3. Send Email via Gmail
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "appdeveloper1208@gmail.com",
        pass: "woin wube avhm rkxg", // Gmail App password
      },
    });

    await transporter.sendMail({
      from: '"Onexhib App" <appdeveloper1208@gmail.com>',
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is: ${otp}`,
      html: ` <div style="font-family: Arial, sans-serif; background-color: #f5f7fa; padding: 20px;">
      <div style="max-width: 500px; margin: auto; background: white; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); padding: 25px;">
        <h2 style="text-align:center; color:#2563eb;">🔐 Onexhib Account Verification</h2>
        <p style="font-size: 15px; color:#333;">Hello,</p>
        <p style="font-size: 15px; color:#333;">
          Thank you for signing up with <b>Onexhib</b> To complete your registration, please use the OTP code below:
        </p>

        <div style="text-align:center; margin: 20px 0;">
          <span style="display:inline-block; background:#2563eb; color:#fff; padding:10px 25px; border-radius:6px; font-size:22px; letter-spacing:2px; font-weight:bold;">
            ${otp}
          </span>
        </div>

        <p style="font-size: 14px; color:#555;">
          ⚠️ This OTP is valid for <b>5 minutes</b>. Please do not share it with anyone for security reasons.
        </p>

        <p style="font-size: 14px; color:#555;">If you didn’t request this verification, you can safely ignore this email.</p>

        <hr style="margin:25px 0; border:none; border-top:1px solid #ddd;">
        <p style="text-align:center; font-size:12px; color:#777;">
          © ${new Date().getFullYear()} Onexhib App — All rights reserved.<br>
          This is an automated message, please do not reply.
        </p>
      </div>
    </div>`,
    });

    console.log("Email sent successfully");
    const sign = await Signupmodel.create({
      first_name,
      last_name,
      designation,
      password: hashedPass,
      mobile_number,
      address,
      website,
      city,
      email,
      state,
      country,
      company_name,
      otp
    });

    if (!sign) {
      return res.status(400).json({ message: "Signup failed" });
    }

    const token = setExhibition(sign);
    res
      .cookie("uid", token)
      .status(201)
      .json({
        message: "New user created successfully",
        user: sign, // ✅ Return the created user for the frontend
      });

  } catch (err) {
    return handleServerError(res, err, "Signup failed");
  }
}


// ✅ Login
// async function handlelogin(req, res) {
//   try {
//     const { email, password } = req.body;

//     const user = await Signupmodel.findOne({ email, password });
//     if (!user) return res.status(401).send('Login failed');
//     const token = setExhibition(user);
//     console.log(user,'rwe')
//     res.cookie('uid', token).send('Login successful').send(user);
//   } catch (err) {
//     return handleServerError(res, err, "Login failed");
//   }
// }


async function handlelogin(req, res) {
  try {
    const { email, password } = req.body;

    // ✅ 1. Check if the user exists
    const user = await Signupmodel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // ✅ 2. Compare the plain password with the hashed one from DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // ✅ 3. Generate JWT or session token
    const token = setExhibition(user);

    // ✅ 4. Send response with cookie + user object
    res
      .cookie('uid', token, { httpOnly: true, secure: false }) // consider secure: true in production
      .status(200)
      .json({
        message: 'Login successful',
        user,
      });

  } catch (err) {
    console.error("Login error:", err);
    return handleServerError(res, err, "Login failed");
  }
}




async function handleapplogin(req, res) {
  try {
    const { email, pass } = req.body;
    console.log(email, pass);

    // 1️⃣ Find user by email only
    const user1 = await otpmodel.findOne({ email,isapproved:false});
    if(user1){
      return  res
      .status(404)
      .json({
        message: "User Not registered",
      });
    }else{

    }
    let user = await otpmodel.findOne({email})
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    // 2️⃣ Compare password hashes
    const isMatch = await bcrypt.compare(pass,user.pass);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });
console.log(isMatch)
    // 3️⃣ Create and send token
    const token = setExhibition(user);
    console.log("User logged in:", user.email);

    res
      .cookie("uid", token, { httpOnly: true, secure: true })
      .status(200)
      .json({
        message: "Login successful",
        user, // You may want to exclude password before sending
      });

  } catch (err) {
    console.error("Login Error:", err);
    return handleServerError(res, err, "Login failed");
  }
}

// ✅ Get all organisers
async function handleorganiser(req, res) {
  try {
    const result = await Signupmodel.find({});
    res.json(result);
  } catch (err) {
    return handleServerError(res, err, "Failed to fetch organisers");
  }
}

// ✅ Get exhibitions created by logged-in user
async function handleGetExhibition(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(400).json({ message: 'User ID is missing' });

    const exhibitions = await exhibitionModel.find({ createdby: userId }).lean();
    res.status(200).json(exhibitions);
  } catch (err) {
    return handleServerError(res, err, "Failed to fetch exhibitions");
  }
}

// ✅ Add new exhibition
async function handleExhibition(req, res) {
  try {
    console.log("Uploaded Files:", req.files);

    const exhibitionImage = req.files["exhibition_image"]?.[0];
    const layoutFile = req.files["layout"]?.[0];
console.log(exhibitionImage,layoutFile);
    if (!exhibitionImage || !layoutFile) {
      return res.status(400).json({ message: "Both exhibition image and layout are required" });
    }

    const {
      exhibition_name,
      exhibition_address,
      category,
      starting_date,
      ending_date,
      venue,
      about_exhibition,
    } = req.body;

    const { _id: userId, email } = req.user;
let ress= await cloudinary.uploader
  .upload(exhibitionImage.path)
  .then(result => result.url)
  .catch(error => console.error(error));
  let ress2 = await cloudinary.uploader
  .upload(layoutFile.path)
  .then(result => result.url)
  .catch(error => console.error(error));
    const newExhibition = await exhibitionModel.create({
      exhibition_name,
      exhibition_address,
      category,
      starting_date,
      ending_date,
      venue,
      createdby: userId,
      addedBy: email,
      about_exhibition,

      // 👇 These fields are required in your schema
     exhibtion_url:ress,
     layout_url:ress2
    });

    if (!newExhibition) {
      return res.status(400).send("Exhibition creation failed");
    }

    const token = setname(newExhibition);
    res.cookie("name", token).send("Exhibition added successfully");
  } catch (err) {
    return handleServerError(res, err, "Failed to create exhibition");
  }
}

// ✅ Add new company
async function handlepostcompany(req, res) {
  try {
    let { path, filename } = req.file;
    console.log(path)
    const { company_name, company_email, company_nature, about_company, company_phone_number, company_address, pincode, createdBy } = req.body;
let ress=  await cloudinary.uploader
  .upload(path)
  .then(result => result.url)
  .catch(error => console.error(error));
    const company = await companyModel.create({
      company_name,
      company_email,
      company_nature,
      company_phone_number,
      company_address,
      pincode,
      createdBy,
      about_company, company_url:ress
    });

    res.status(201).json({ message: 'Company added successfully', company });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Company with this phone number already exists' });
    }
    return handleServerError(res, err, "Failed to add company");
  }
}

// ✅ Find exhibition by ID
async function handleFindExhibition(req, res) {
  try {
    const id = req.params.id || req.body.id;
    if (!id) return res.status(400).json({ error: "Exhibition ID is required" });
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid Exhibition ID" });
    }

    const exhibition = await exhibitionModel.findById(id).lean();
    if (!exhibition) return res.status(404).json({ error: "Exhibition not found" });

    return res.json(exhibition);
  } catch (err) {
    return handleServerError(res, err, "Failed to fetch exhibition");
  }
}

// ✅ Delete exhibition
async function handleDelete(req, res) {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Exhibition ID is required" });

    const deletedExhibition = await exhibitionModel.findByIdAndDelete(id);
    const deletecompany = await companyModel.deleteMany({ createdBy: id });
    const deleteproduct = await ProductModel.deleteMany({ exhibitionid: id });

    if (!deletedExhibition && !deletecompany && !deleteproduct) return res.status(404).json({ error: "Exhibition not found" });

    return res.json({
      message: "✅ Exhibition deleted successfully",
      deletedExhibition,
    });
  } catch (err) {
    console.error("Error deleting exhibition:", err);
    return res.status(500).json({ error: "Failed to delete exhibition" });
  }
}

// ✅ Get company by ID
async function handleGetaddCompany(req, res) {
  try {
    const { id } = req.params;
    const company = await companyModel.findById(id);

    if (!company) return res.status(404).json({ message: "Company not found" });
    res.json(company);
  } catch (err) {
    return handleServerError(res, err, "Failed to fetch company");
  }
}

// ✅ Get products by company
async function handleGetproduct(req, res) {
  try {
    const { id } = req.params;
    const company = await ProductModel.find({ createdBy: id });

    if (!company) return res.status(404).json({ message: "Product not found" });
    res.json(company);
  } catch (err) {
    return handleServerError(res, err, "Failed to fetch Product");
  }
}

// ✅ Get companies by creator ID
async function handleGetCompany(req, res) {
  try {
    const { id } = req.params;
    const company = await companyModel.find({ createdBy: id });

    if (!company) return res.status(404).json({ message: "Company not found" });
    res.json(company);
  } catch (err) {
    return handleServerError(res, err, "Failed to fetch company");
  }
}
async function handleproductDetail(req,res){
try{
  const { id } = req.params;
  let product = await ProductModel.findById(id);
  if (!product) return res.status(404).json({ message: "product not found" });
  res.json(product);
}catch (err) {
    return handleServerError(res, err, "Failed to fetch Product Details");
  }
} 

// ✅ Add new product
async function handlePostProduct(req, res) {
 
  try {
    console.log("Uploaded File:", req.file);
    const { path, filename } = req.file;
    const { product_name, category, price, details, createdBy, exhibitionid } = req.body;
  let ress=  await cloudinary.uploader
  .upload(path)
  .then(result => result.url)
  .catch(error => console.error(error));
    const product = await ProductModel.create({
      product_name,
      category,
      price,
      details,
      product_url:ress,
      createdBy,
      exhibitionid
    });

    res.json({
      message: "✅ Product uploaded successfully",
      product
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "❌ Upload failed", error: err.message });
  }
}

// ✅ Find signup user by ID
async function handlefindsignup(req, res) {
  try {
    const { id } = req.params;
    const result = await Signupmodel.findById(id);
    if (!result) return res.status(404).json({ message: "User not found" });

    res.send(result);
  } catch (err) {
    return handleServerError(res, err, "Signup failed");
  }
}



async function handlegetBrochure(req, res) {
  try {
    const { id } = req.params;
    const companyData = await companyModel.findById(id);

    if (!companyData) return res.status(404).json({ msg: "Company not found" });
    if (!companyData.company_url) return res.status(404).json({ msg: "No brochure uploaded" });

    // Redirect to the hosted file
    return res.redirect(companyData.company_url);
  } catch (error) {
    console.error("Error downloading brochure:", error);
    return res.status(500).json({ msg: "Server error" });
  }
}

async function handlegetimage(req, res) {
  try {
    const {filename ,pathname } = req.body;
    console.log(filename,pathname);
    if(!filename || !pathname){
       return res.status(404).json({ msg: "Error in  Fields" });
    }

    let wor = path.dirname(pathname);
    let word = path.basename(wor);

    console.log(word)
    if (!pathname) {
      return res.status(404).json({ msg: "No brochure uploaded for this company" });
    }

    // 3. Resolve absolute file path
    const filePath = path.resolve(word, filename);
console.log(filePath,'ffff');
    // 4. Send file to browser (for inline view)
    res.setHeader("Content-Disposition", `inline; filename="${filename}"`);
    return res.sendFile(filePath, (err) => {
      if (err) {
        console.error("Error sending file:", err);
        return res.status(500).json({ msg: "Error sending file" });
      }
    });
  } catch (error) {
    console.error("Error fetching image:", error);
    return res.status(500).json({ msg: "Server error" });
  }
}




// const otpmodel = require("./otpmodel");
const bcrypt = require("bcrypt");
const appmodel = require('../Model/Appmodel');
const { cloudinary_js_config } = require('../Service/Cloudinay');
// const signupappmidle = require('../Middleware/Middleware');

async function handleappsignup(req, res) {
  try {

    let { name, pass, email, mobile_number } = req.body;

    // ✅ 0. Input validation
    if (!name || !pass || !email || !mobile_number) {
      return res.status(400).json({
        success: false,
        message: "All fields (name, pass, email, mobile_number) are required.",
      });
    }
    let dat2 = await otpmodel.find({ email, isapproved: true });
    console.log(dat2, 'data22')
    if (dat2.length === 0) {
      let finduser = await otpmodel.find({ email, isapproved: false });
      console.log(finduser);
      if (finduser.length === 0) {
        let otp = "";
        for (let i = 0; i < 6; i++) {
          otp = Math.floor(100000 + Math.random() * 900000);
        }
        otp = Number(otp); // ensure it's a number

        console.log("Generated OTP:", otp);

        // 2. Hash password before saving
        const hashedPass = await bcrypt.hash(pass, 10);

        // 3. Send Email via Gmail
        let transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "appdeveloper1208@gmail.com",
            pass: "woin wube avhm rkxg", // Gmail App password (App-specific)
          },
        });

        await transporter.sendMail({
          from: '"Onexhib App" <appdeveloper1208@gmail.com>',
          to: email,
          subject: "Your OTP Code - Onexhib Verification",
          text: `Your OTP is: ${otp}`,
          html: `
        <div style="font-family: Arial, sans-serif; background-color: #f5f7fa; padding: 20px;">
          <div style="max-width: 500px; margin: auto; background: white; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); padding: 25px;">
            <h2 style="text-align:center; color:#2563eb;">🔐 Onexhib Account Verification</h2>
            <p style="font-size: 15px; color:#333;">Hello,</p>
            <p style="font-size: 15px; color:#333;">
              Thank you for signing up with <b>Onexhib</b>. To complete your registration, please use the OTP code below:
            </p>
            <div style="text-align:center; margin: 20px 0;">
              <span style="display:inline-block; background:#2563eb; color:#fff; padding:10px 25px; border-radius:6px; font-size:22px; letter-spacing:2px; font-weight:bold;">
                ${otp}
              </span>
            </div>
            <p style="font-size: 14px; color:#555;">
              ⚠️ This OTP is valid for <b>5 minutes</b>. Please do not share it with anyone for security reasons.
            </p>
            <p style="font-size: 14px; color:#555;">If you didn’t request this verification, you can safely ignore this email.</p>
            <hr style="margin:25px 0; border:none; border-top:1px solid #ddd;">
            <p style="text-align:center; font-size:12px; color:#777;">
              © ${new Date().getFullYear()} Onexhib  — All rights reserved.<br>
              This is an automated message, please do not reply.
            </p>
          </div>
        </div>
      `,
        });

        console.log("Email sent successfully");

        // 4. Save user + OTP in DB
        let sign = await otpmodel.create({
          name,
          pass: hashedPass,
          email,
          mobile_number,
          otp,
        });
       const token = setExhibition(sign);
    res
      .cookie("uid", token)
      .status(201)
      .json({
        message: "New user created successfully",
        user: sign, // ✅ Return the created user for the frontend
      });
      } else {
           let dat = await otpmodel.deleteOne({ email, isapproved: false });
        console.log(dat, 'data')
        console.log(dat2, 'data2')
        let otp = "";
        for (let i = 0; i < 6; i++) {
          otp = Math.floor(100000 + Math.random() * 900000);
        }
        otp = Number(otp); // ensure it's a number

        console.log("Generated OTP:", otp);

        // 2. Hash password before saving
        const hashedPass = await bcrypt.hash(pass, 10);

        // 3. Send Email via Gmail
        let transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "appdeveloper1208@gmail.com",
            pass: "woin wube avhm rkxg", // Gmail App password (App-specific)
          },
        });

        await transporter.sendMail({
          from: '"Onexhib App" <appdeveloper1208@gmail.com>',
          to: email,
          subject: "Your OTP Code - Onexhib Verification",
          text: `Your OTP is: ${otp}`,
          html: `
        <div style="font-family: Arial, sans-serif; background-color: #f5f7fa; padding: 20px;">
          <div style="max-width: 500px; margin: auto; background: white; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); padding: 25px;">
            <h2 style="text-align:center; color:#2563eb;">🔐 Onexhib Account Verification</h2>
            <p style="font-size: 15px; color:#333;">Hello,</p>
            <p style="font-size: 15px; color:#333;">
              Thank you for signing up with <b>Onexhib</b>. To complete your registration, please use the OTP code below:
            </p>
            <div style="text-align:center; margin: 20px 0;">
              <span style="display:inline-block; background:#2563eb; color:#fff; padding:10px 25px; border-radius:6px; font-size:22px; letter-spacing:2px; font-weight:bold;">
                ${otp}
              </span>
            </div>
            <p style="font-size: 14px; color:#555;">
              ⚠️ This OTP is valid for <b>5 minutes</b>. Please do not share it with anyone for security reasons.
            </p>
            <p style="font-size: 14px; color:#555;">If you didn’t request this verification, you can safely ignore this email.</p>
            <hr style="margin:25px 0; border:none; border-top:1px solid #ddd;">
            <p style="text-align:center; font-size:12px; color:#777;">
              © ${new Date().getFullYear()} Onexhib App — All rights reserved.<br>
              This is an automated message, please do not reply.
            </p>
          </div>
        </div>
      `,
        });

        console.log("Email sent successfully");

        // 4. Save user + OTP in DB
        let sign = await otpmodel.create({
          name,
          pass: hashedPass,
          email,
          mobile_number,
          otp,
        });
       const token = setExhibition(sign);
    res
      .cookie("uid", token)
      .status(201)
      .json({
        message: "New user created successfully",
        user: sign, // ✅ Return the created user for the frontend
      });
      }}
      else {
        return res.send('allready user');

      }

    }
    // 1. Generate OTP (convert to number)

   catch (err) {
    console.error("Error in signup middleware:", err.message);
    return res
      .status(500)
      .json({ success: false, message: "OTP sending failed" });
  }
}


async function handleappotp(req, res) {
  try {
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({ message: "OTP is required" });
    }

    // Find the OTP entry
    const record = await otpmodel.findOne({ otp });

    if (!record) {
      return res.status(404).json({ message: "Invalid or expired OTP" });
    }

    // Update approval status
    const updateResult = await otpmodel.updateOne(
      { email: record.email, otp: otp },
      { $set: { isapproved: true } }
    );
    const finalresult = await otpmodel.findOne({ otp });
    // Send proper response
    if (updateResult.modifiedCount > 0) {
      return res.status(200).json({ message: "OTP verified successfully", finalresult });
    } else {
      return res.status(200).json({ message: "Already verified", finalresult });
    }

  } catch (error) {
    console.error("Error in handleOtp:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function handlewebotp(req, res) {
  try {
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({ message: "OTP is required" });
    }

    // Find the OTP entry
    const record = await Signupmodel.findOne({ otp });

    if (!record) {
      return res.status(404).json({ message: "Invalid or expired OTP" });
    }

    // Update approval status
    const updateResult = await Signupmodel.updateOne(
      { email: record.email },
      { $set: { isapproved: true } }
    );
    const finalresult = await Signupmodel.findOne({ otp });
    // Send proper response
    if (updateResult.modifiedCount > 0) {
      return res.status(200).json({ message: "OTP verified successfully", finalresult });
    } else {
      return res.status(200).json({ message: "Already verified", finalresult });
    }

  } catch (error) {
    console.error("Error in handleOtp:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// async function handleappsignup(req, res) {
//   // 1. Generate OTP
//   let otp = "";
//   for (let i = 0; i < 5; i++) {
//     let num = Math.floor(Math.random() * 10);NP MRUN  DEV
//     otp += num;
//   }

//   console.log("Generated OTP:", otp);

//   // 2. Create transporter (for Gmail)
//   let transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: "pctebca592@gmail.com",   // your Gmail
//       pass: "I7009989510"      // ⚠️ Gmail App Password (not normal password)
//     },
//   });

//   // 3. Send mail
//   let info = await transporter.sendMail({
//     from: '"Onexhib App" <pctebca592@gmail.com>', // sender
//     to: "appdeveloper1208@gmail.com",                  // receiver
//     subject: "Your OTP Code",
//     text: `Your OTP is: ${otp}`,                 // plain text body
//     html: `<h2>Your OTP is: <b>${otp}</b></h2>`, // HTML body
//   });

//   console.log("Message sent: %s", info.messageId);
//   res.json({ success: true, otp });
// }
const handleapprealsignup = async (req, res) => {
  try {
    let { name, pass, email, mobile_number } = req.body;

    // ✅ 0. Input validation
    if (!name || !pass || !email || !mobile_number) {
      return res.status(400).json({
        success: false,
        message: "All fields (name, pass, email, mobile_number) are required.",
      });
    }
    const hashedPass = await bcrypt.hash(pass, 10);
    let sign = await appmodel.create({
      name,
      pass: hashedPass,
      email,
      mobile_number,
      isapproved: true
    });
    const token = setExhibition(sign);
    res
      .cookie("uid", token)
      .status(201)
      .json({
        message: "New user created successfully",
        user: sign, // ✅ Return the created user for the frontend
      });

  } catch (err) {
    console.error("allready user existed:", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Allready user existed" });
  }
}
module.exports = {
  handleapprealsignup,
  handleappsignup,
  handlegetBrochure,
  handlesignup,
  handleDelete,
  handlelogin,
  handleorganiser,
  handleGetExhibition,
  handleExhibition,
  handlepostcompany,
  handleFindExhibition,
  handleGetCompany,
  handleGetaddCompany,
  handlePostProduct,
  handleGetproduct,
  handlefindsignup,
  handleappotp,
  handlewebotp,
  handleapplogin,
  handlegetimage,
  handleproductDetail
};
