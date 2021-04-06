require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const md5=require("md5");
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true,useUnifiedTopology:true});

const userSchema= new mongoose.Schema({
  email:String,
  password:String
});


const User= mongoose.model("user",userSchema);


app.get("/",function(req,res){
    res.render("home");
});
app.get("/login",function(req,res){
    res.render("login");
});
app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register",function(req,res){

  bcrypt.hash(req.body.inputPassword, saltRounds, function(err, hash) {
    let newUser= new User({
      email:req.body.inputEmail,
      password:hash
    });
    newUser.save(function(err){
      if(err){res.send(err); }
      else{res.render("secrets");}
    });    
  });
});

app.post("/login",function(req,res){

  
  let userEmail=req.body.inputEmailLogin;
  let userPassword=req.body.inputPasswordLogin;
  
  User.findOne({email:userEmail},function(err,result){
    if(err){
      res.send(err);
    }
    else{
        bcrypt.compare(userPassword, result.password, function(err, result1) {
          if(result1===true){
            res.render("secrets");
          }
          else{
            res.send(err);
          }
        });
    }    
  });
  });




app.listen(3000, function() {
  console.log("Server started on port 3000");
});
