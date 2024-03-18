const express = require('express');
const cookieParser = require('cookie-parser');
// const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');

const logoutpage=require('./routes/logout');
const loginpage=require('./routes/login');
const dashboard=require('./routes/dashboard');
const Index=require('./routes/index');
const book=require('./routes/book');
const home=require('./routes/home');

mongoose.connect('mongodb://localhost:27017/Library') 

const app = express();

// app.use(expressLayouts);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.set('view engine','ejs')

app.use('/',home)
app.use('/index',Index)
app.use('/logout',logoutpage)
app.use('/login',loginpage)
app.use('/dashboard',dashboard)
app.use('/book',book)

app.listen(3001);









