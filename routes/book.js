const express = require('express');
const router = express.Router();
const Books = require('../models/booksmodel');
// const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const student = require('../models/studentmodel');
const valied= require('../models/verifylogin')

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// mongoose.connect('mongodb://localhost:27017/Library') 

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads'); 
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); 
    }
});

router.get('/',valied,(async(req,res)=>{
    const ids = req.query.id;
    const user=req.cookies.user;
    if (ids){
        console.log(ids)
        let stud=await student.findOne({email:user})
        let data = await Books.findOneAndUpdate(
            { _id: ids }, 
            { $set: {  Subscribe: true } ,$push: { rented:{'id': stud._id, 'Date':Date.now()} }}
        );
        console.log(data)
        res.redirect('/')
    }
    res.render('book')
}))

const upload = multer({ storage: storage });

router.post('/book', upload.single('Image'), async(req, res) => {
      console.log('post work');
      console.log(req.body);
      if (Object.keys(req.body).length > 0){
        if (req.body.Auther!==''){
            var img = fs.readFileSync(req.file.path);
            var encode_img = img.toString('base64');
            const bk = new Books({
                Book: req.body.Book,
                Auther: req.body.Auther,
                Page: req.body.Page,
                Image: {
                  data:new Buffer(encode_img,'base64'),
                  contentType: req.file.mimetype // Get image mimetype
                },
                Department:req.body.Department

            });
            bk.save()
            .then(() => {
                console.log('Data saved successfully');
                res.status(200).render('book');
            })
            .catch((err) => {
                console.error('Data not saved:', err);
                res.status(500).send('Data not saved');
            });   
        }
        else{
            console.log(req.body.Auther,'empty')
        }
         
      }
      
    });


module.exports=router