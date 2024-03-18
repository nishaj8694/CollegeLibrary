const express = require('express');
const mongoose = require('mongoose');
const user = require('../models/studentmodel');
const jwt=require('jsonwebtoken');
const router = express.Router();

router.use(express.urlencoded({ extended:false }));

// mongoose.connect('mongodb://localhost:27017/Library') 

router.get('/',((req,res)=>{
    res.render('login')
}))

router.post('/',((req,res)=>{
    const { email,password }=req.body;
    user.findOne({email:email,Password:password})
    .then(user => {
        if (!user) {
            console.log('no user')
            res.redirect('/');
        } else {;
            const token=jwt.sign({email:user.email},'secret');
            res.cookie('jwtToken',token,{httpOnly:true})
            res.cookie('user',email,{httpOnly:true})
            res.redirect('/index');
        }
    })
    .catch(err => {
        console.error(err);
    });
}))

module.exports=router