const express = require('express');
const router = express.Router();
const restrictUser=require('../models/studentmodel');
const Books=require('../models/booksmodel');

// const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const student = require('../models/studentmodel');
const valied= require('../models/verifylogin')

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(express.static("uploads"))



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads'); 
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); 
    }
});

const upload = multer({ storage: storage });

router.get('/dashboard/Product/book/:id', async(req, res) => {
    console.log('its worked book put')
    res.render('/book',{data:''})
})

router.post('/book/:id', upload.single('Image'), async(req, res) => {
    const dataId=req.params.id
    let updatedData=await Books.findById(dataId)
    updatedData.Book = req.body.Book;
    updatedData.Auther = req.body.Auther;
    updatedData.Page = req.body.Page;
    updatedData.Department = req.body.Department;
    if (req.file) {
        if (updatedData.Image) {
            fs.unlinkSync(path.join('uploads', updatedData.Image));
            updatedData.Image = req.file.filename;
        }
    }
    await updatedData.save()  
    res.redirect('/dashboard/Product');
})

router.post('/book', upload.single('Image'), async(req, res) => {
      if (Object.keys(req.body).length > 0){
        if (req.body.Auther!==''){
            const bk = new Books({
                Book: req.body.Book,
                Auther: req.body.Auther,
                Page: req.body.Page,
                Image: req.file.filename,
                Department:req.body.Department
            });
            bk.save()
            .then(() => {
                console.log('Data saved successfully');
                res.status(200).render('book',{data:''});
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


function validUser(req, res, next){
    const user=req.cookies.user;

    restrictUser.findOne({ email: user })
    .then(data => {
        if (data && data.admin) {
            next();
        } else {
            res.redirect('/index')
        }
    })
    .catch(err => {
        res.status(500).send('Internal Server Error');
    });
        

}

router.get('/',validUser,((req,res)=>{
    res.render('dashboard')
}))

router.get('/book',validUser,(req, res) => {
    res.render('book',{data:''});
});

// router.post('/book',validUser,(req, res) => {
//     res.render('book');
// });

router.get('/Product',validUser,(async(req, res) => {
    let data = await Books.find();
    res.render('Product',{'data':data});
}));

router.get('/Product/:data', validUser, async (req, res) => {
    try {
        const bookId = req.params.data;
        const book = await Books.findById(bookId);

        if (book) {
            console.log('book is',book);
            res.render('book', { data: book });
        } else {
            console.log('No such book');
            res.status(404).send('Book not found');
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});


router.delete('/Product/:id',validUser,(async(req, res) => {
    try {
        const delProduct = await Books.findOneAndDelete({ _id: req.params.id });
        fs.unlinkSync(path.join('uploads', delProduct.Image));
        if (!delProduct) {
            return res.status(404).send("Product not found");
        }
        res.status(204).redirect('/dashboard/Product');
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}));

module.exports=router