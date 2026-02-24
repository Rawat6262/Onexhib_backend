let News = require('../Model/New.model');
let cloudinary = require('../Service/Cloudinay')



exports.createNews = async (req, res) => {
    try{
          if(!req.body.news_title || !req.body.news_description  || !req.body.new_category){
            return res.status(400).json({message:"Please fill all the fields"})
        }
       if(req.file){
        let imageupload = req.file.path;
         const imageurl = await cloudinary.uploader.upload(
              imageupload,
              {
                resource_type: "auto",
              }
            );
        req.body.news_image_url = imageurl.secure_url;
        }
      
        let news = await News.create({
            news_title: req.body.news_title,
            news_description: req.body.news_description,
            news_url: req.body.news_url,
            news_image_url: req.body.news_image_url,
            new_category: req.body.new_category 
        });
        res.status(200).json({
            message: "News created successfully",
            data: news
        })
    } catch (err) {
        res.status(500).json({
            message: "Error creating news",
            error: err.message
        })
    }
}

exports.getAllNews = async (req, res) => {  
    try{
        let news = await News.find();
        res.status(200).json({  
            message: "News fetched successfully",
            data: news
        })
    } catch (err) {
        res.status(500).json({
            message: "Error fetching news",
            error: err.message
        })
    }
}



