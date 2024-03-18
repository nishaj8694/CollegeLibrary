const express = require('express');
const router = express.Router();

const verifyUrl=require('../models/verifylogin');

router.get('/',verifyUrl,async(req, res) => {
    console.log('my user ',req.user) 
    res.clearCookie('jwtToken').clearCookie('user').redirect('/');
   
});

module.exports=router