const mongoose = require('mongoose');
const validator = require('validator');


var Contact =  mongoose.model('Contact',{
  name:{
    type:String,
    required :true
  },
  email:{
    type:String,
    required:true,
    unique:true,
    validate:{
      validator:validator.isEmail,
      message:'{VALUE} is not a valid email'
    }
  },
  phone:{
    type:Number,
    required:true
  },
  desc:{
    type:String,
    required:true,
    minlength:5
  }
});




module.exports = {Contact};
