let express = require('express');
const router = require('./Route/Route');
const Connection = require('./Connection/Connection');
const cookieParser = require('cookie-parser');
const path = require('path');
const multer = require('multer');
const cors = require('cors');
const { exhibitionupload, companyupload, productupload } = require('./Middleware/Middleware');

let app = express();

// DB Connection
Connection("mongodb+srv://Onexhib:Onexhib@cluster0.01lxubr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => {
    console.log('✅ Database connection has been established');
  })
  .catch((e) => console.log('❌ DB error:', e));

app.use(cors({
  origin: ['https://onexhib.com', 'http://localhost:8000'],
  credentials: true
}));
app.use(express.json()); // JSON body
app.use(express.urlencoded({ extended: true })); // urlencoded form
app.use(cookieParser());
app.use(express.static("./public"));
// app.use(exhibitionupload.any())
// app.use(companyupload.any())
// app.use(productupload.any())
// Apply multer globally (for form-data)


// Routes
app.use('/', router);

app.use((req, res, next) => {
  req.on('data', (chunk) => console.log('Incoming chunk', chunk.toString()));
  next();
});

// Server

app.listen(8000, () => console.log('🚀 Server Started at Port 8000'));


