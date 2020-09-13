/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
const mongoose = require('mongoose');
const feedback = require('../models/mySchema.js');
require('dotenv').config({path:'.env'});
const Schema = mongoose.Schema;

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {
mongoose.connect(CONNECTION_STRING,{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false},(err) =>{
    if (err) throw "Erorr connecting to database" + err;
    console.log('I am connected to database')
}).catch(err => console.log(err));
  app.route('/api/issues/:project')
  
    .get(function (req, res,next){
      var project = req.params.project;
    console.log(req.params)
    //Solved after watching Youtube video:)
   let myFilter = Object.assign(req.query);
       myFilter['project'] = project;
     feedback.find(myFilter).select("-project").then(data =>                           
     res.status(200).json(data)
     ).catch(err=> console.log(err))
  })
     .post(function (req, res){
      var project = req.params.project;
      let myData = new feedback({
      issue_title:req.body.issue_title,
      issue_text:req.body.issue_text,
      created_on: new Date(),
      updated_on: new Date(),
      created_by:req.body.created_by||'',
      assigned_to:req.body.assigned_to||'',  
      open: true,
      status_text:req.body.status_text,
      project:project
      })
      myData.save((err,data)=>{
        (!req.body.issue_title || !req.body.issue_text || !req.body.created_by)?
        res.status(200).json('Required fields missing from request'):
        (err)?res.status(400).redirect(process.cwd() + '/views/404.html')
      :res.status(200).json({
      _id:data._id,
      issue_title:data.issue_title,
      issue_text:data.issue_text,
      created_on:data.created_on,
      updated_on:data.updated_on,
      created_by:data.created_by,
      assigned_to:data.assigned_to,  
      open:data.open,
      status_text:data.status_text})
      })
    })
    
    .put(function (req, res){
      var project = req.params.project;
      
      let obj = req.body;
      let myObj = {};
      let myInfo = Object.entries(obj).reduce((accumulator,[key,value]) => (value ? (accumulator[key]=value, accumulator) : accumulator), {})//Courtesy of stackOverflow
     
      myObj = Object.assign({updated_on: new Date()},myInfo)
      console.log(myObj)
     if(Object.keys(myInfo).length < 2){
        res.status(200).json('no updated field sent')//res.json sends json object(can process null and undefined values) res.send sends html text element in web page
     }
     
      
      let myId = req.body._id;
     
      let match = (mongoose.isValidObjectId(myId))?myId = req.body._id:res.status(200).json( 'could not update '+ req.body._id);//Courtesy of mongoose.js and stackoverflow.Test's users input in id.
      
      feedback.findByIdAndUpdate({_id:ObjectId(myId)},myObj,{new : true }).then((data) =>{if(data){res.json('successfully updated')}}).catch(err => console.log(err))//test if more than one field was entered.
    })
     
    .delete(function (req, res){
     let myId = req.body._id;
      if(!req.body._id){
         res.json('id error')
      }
     let match = (mongoose.isValidObjectId(myId))?myId = req.body._id:res.status(200).json('could not delete '+ myId)
      feedback.findOneAndDelete({_id:ObjectId(myId)}).then((data) => {if(data){res.status(200).json('deleted '+ myId)}}).catch(err => console.log(err))
     
    });

};
