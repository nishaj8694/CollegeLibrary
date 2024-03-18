
const express = require('express');
const router = express.Router();


router.use(express.static('views'));

router.use((req, res, next) => {
    if (req.url.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');
    }
    next();
});


router.get('/',(req, res) => {
      res.render('home');
});

module.exports=router