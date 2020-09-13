const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const currentSchema = ({
 issue_title:{
   type:String,
   min:5,
   max:20,
   required:true
       },
 issue_text:{
   type:String,
   min:5,
   max:200,
   required:true
      },
 created_on:Date,
 updated_on:Date,
 created_by:{
   type:String,
   min:5,
   max:20,
   required:true
      },
 assigned_to:{
   type:String,
   min:5,
   max:20
      },
 open:Boolean,
 status_text:{
   type:String,
   min:5,
   max:5
 },
  project:String
})

const mySchema = mongoose.model('feedback',currentSchema);

module.exports = mySchema;
