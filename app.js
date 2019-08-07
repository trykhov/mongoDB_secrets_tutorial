//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require('mongoose-encryption');
const bcrypt = require('bcrypt');
const saltRounds = 10;
// const md5 = require('md5');

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

// replace: <username_name> and <password> with username and password of the database that's being used
mongoose.connect("mongodb+srv://<username_here>:<password>@secrets-8airp.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true });

// the type of object that the database expects to have
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

// userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});
// userSchema is the schema of the objects, "logins" is the collection / database
const User = new mongoose.model("logins", userSchema); // collection name has to be plural: helper --> helpers, login --> logins

app.get("/", function(req, res) {
  res.render("home");
})

app.get("/login", function(req, res) {
  res.render("login");
})

app.get("/register", function(req, res) {
  res.render("register");
})

app.post("/register", function(req, res) {

  // const newUser = new User({
  //   email: req.body.username,
  //   password: md5(req.body.password);
  // });

  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const newUser = new User({
      email: req.body.username,
      password: hash
    });

    newUser.save(function(err) { // this runs during the save process
      if(err) { // if an error occurs
        console.log(err);
      } else {
        res.render("secrets"); // else show us the render
      }
    });
  })


})

app.post("/login", function(req, res) {
  const username = req.body.username;
  const password =  req.body.password;

  User.findOne({email: username}, function(err, foundUser) {
    if(err) {
      console.log(err);
    } else {
      if(foundUser) {
        // if(foundUser.password === password) {
        //   res.render("secrets");
        // }
        bcrypt.compare(password, foundUser.password, function(err, result) {
          if(result == true) {
            res.render("secrets");
          }
        })
      }
    }
  })

})



app.listen(3000, function() {
    console.log("Server started on port 3000.");
});

//
// const person = {
//   name: String,
//   age: Number
// }
//
// const People = new mongoose.model("person", person);
//
// const newPerson = new People({
//   name: "John",
//   age: 32
// })
