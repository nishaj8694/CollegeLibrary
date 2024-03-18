const mongoose=require('mongoose')

const Schema=mongoose.Schema

 const studentSchema=new Schema({
    email:String,
    Password:String,
    admin:{
      type:Boolean,
      default:false
    }
 })

 const students=mongoose.model('students',studentSchema)

 module.exports=students