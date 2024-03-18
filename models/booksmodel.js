const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  Book: String,
  Auther: String,
  Page: Number,
  Image:String,
  Department:String,
  Subscribe: { 
    type: Boolean,
    default: false
  },
  rented:[]
});
const books=mongoose.model('Books', userSchema);
module.exports = books


// {
//   path:String,
//   data: Buffer,
//   contentType: String 
// },