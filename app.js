require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt=require("mongoose-encryption");

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

userSchema.plugin(encrypt,{secret:process.env.SECRET_KEY,encryptedFields:["password"]});

const User= mongoose.model("user",userSchema);


// let newArticle= new Article({
//         title:req.body.title,
//         content:req.body.content
//     });
// newArticle.save(function(err){
//         if(err){
//             res.send(err);
//         }
//         else{
//             res.send("successfully inserted new article");
//         }
// });


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
  let newUser= new User({
    email:req.body.inputEmail,
    password:req.body.inputPassword
  });
  newUser.save(function(err){
    if(err){res.send(err); }
    else{res.render("secrets");}
  });
});

app.post("/login",function(req,res){
  let userEmail=req.body.inputEmailLogin;
  let userPassword=req.body.inputPasswordLogin;
  
  User.findOne({email:userEmail},function(err,result){
    if(err){
      res.send(err);
    }else{
      if(userPassword===result.password){
        res.render("secrets");
      }else{
        res.send("user or email not correct");
      }
    }
  });
});




app.listen(3000, function() {
  console.log("Server started on port 3000");
});
