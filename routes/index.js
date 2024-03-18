const express = require('express');
const router = express.Router();
const Books = require('../models/booksmodel');
const cookieParser = require('cookie-parser');
const jwt=require('jsonwebtoken');
const verifyUrl=require('../models/verifylogin');
const books = require('../models/booksmodel');
const restrictUser=require('../models/studentmodel');

router.use(express.json());
router.use(express.urlencoded({ extended: false }));
router.use(cookieParser());
router.use(express.static('uploads'));
// app.use(verifyUrl)

router.get('/sample',(req, res) => {
   res.render('sample')
})

router.get('/',async(req, res) => {
   let admin 
   let adminData
   let data = await Books.find();
   const user=req.cookies.jwtToken?true:undefined
   const em=req.cookies.user
   if (em){
      adminData= await restrictUser.findOne({ email: em });
      admin= adminData.admin?true:undefined
   }
       
   const department = req.query.department;
   const subscribe = req.query.bookstatus;
   const srt = req.query.sortBy;

   
   if (department || subscribe || srt){
      if (department) {
         data = data.filter(book => book.Department === department);
      }
      if (subscribe) {
         let pol
         if (subscribe === 'true') {
               console.log('trueded')
               pol=true;
         } else if (subscribe === 'false') {
               console.log('falsed')
               pol=false;
         }

         data = data.filter(book =>  book.Subscribe===pol );
      }
      if (srt){
         if (srt=='incr'){
            data = data.sort((a,b)=>a.Page - b.Page);
         }
         if (srt=='decr'){
            data = data.sort((a,b)=>b.Page - a.Page);
         }
         if (srt=='name'){
            data = data.sort((a,b)=>a.Book - b.Book);
         }         
      }
      res.send(data);
   }
   else{
      res.render('index',{'data':data,'user':user,'admin':admin});
   }
});

module.exports=router