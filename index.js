require('dotenv').config(); // <-- add this FIRST
let express = require('express');
const router = require('./Route/Route');
const Connection = require('./Connection/Connection');
const cookieParser = require('cookie-parser');
const { exhibitionupload, companyupload, productupload } = require('./Middleware/Middleware');

let app = express();

// ✅ Load environment variables
const PORT = process.env.PORT || 8000;

// DB Connection
Connection(process.env.MONGO_URL)
  .then(() => console.log('✅ Database connection has been established'))
  .catch((e) => console.log('❌ DB error:', e));

app.use(express.json({limit:"500kb"}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("./public"));

// Routes
app.use('/', router);

// Server

app.listen(PORT, () => console.log(`🚀 Server Started at Port ${PORT}`));
