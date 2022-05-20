const bcrypt = require("bcryptjs");
const passport = require("passport");
const crypto = require("crypto")
var multer = require('multer');
var fs = require('fs');
var nodemailer = require('nodemailer');


// Load User model
const User = require("../models/User");
const product = require("../models/listproduct");

//Login Function
exports.login = (req, res) =>
  res.render("login", {
    layout: "layouts/layout"
  });

//Register Funcion
exports.register = (req, res) =>
  res.render("register", {
    layout: "layouts/layout"
  });

//verify Login
exports.verifyLogin = (req, res) => {
  const user = User.findOne({isVarified : false});
  async function main() {
    await User.updateOne({isVarified: true,emailToken: null });
}
  if(user){
    main()
    res.redirect("/users/login")
  }
  else{
    res.redirect("/users/register")
    req.flash("error_msg", "First Verify Your email ");
    console.log("First Verify Your email")
  }
}
  

  //MailSender Details

  var Transport = nodemailer.createTransport({
    service : 'gmail',
    auth:{
      user: 'f190946@nu.edu.pk',
      pass: '20481506'
    },
    tls:{
      rejectUnauthorized : false
    }
  });



//Handle Post Request to add a new user
exports.registerUser = (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (password != password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: "Email already exists" });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
          emailToken : crypto.randomBytes(64).toString('hex'),
          isVarified: false, 
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  // "success_msg",
                  // "You are now registered and can log in"
                  console.log("inside db save condition")
                );
                //Send Email 
                var mailOptions = {
                  from: 'f190946@nu.edu.pk',
                  to: newUser.email,
                  subject: "Verify your Email",
                  html: '<h2> Thanks! for Registering to Red Caps </h2> <h4> Please Verify your email to continue... </h4> <a href ="http://localhost:3021/users/verify-login"> Verify Your email </a>'
                };

                //Sending Email
                Transport.sendMail(mailOptions, function(error, info){
                  if (error) {
                    console.log(error);
                  } else {
                    console.log('Email sent: ' + info.response);
                  }
                });

                res.redirect("/users/login");
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
};

//Handle post request to Login a user
exports.loginUser = (req, res, next) => {
  if (User.isVarified){
    passport.authenticate("local", {
      successRedirect: "/dashboard",
      failureRedirect: "/users/login",
      failureFlash: true
    })(req, res, next);
  }
  
};

// Logout already logined user
exports.logout = (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/users/login");
};


//storage for multer
const storage = multer.diskStorage({
  destination:function (request, file, callback){
    callback(null, './uploads/images')
  },

  filename:function(request, file, callback){
    callback(null, Date.now() + file.originalname);
  }
})

//upload multers

var upload = multer({
  storage:storage
})



//Listing Product
exports.listProduct = (req, res) => {
  console.log("Inside list products")
  const { name, category, description, price, quantity } = req.body;
  var img = fs.readFileSync(req.file.path);
  var encode_img = img.toString('base64');
  var image = {
    data:new Buffer(encode_img,'base64'),
    contentType:req.file.mimetype,
  };
  let errors = [];
  if (errors.length > 0) {
    res.render("adminAddProduct", {
      errors,
      name,
      category,
      description,
      price,
      quantity,
      image
    });
  } else {
    product.findOne({ name: name }).then(user => {
      console.log("In find one condition")
      if (user) {
        errors.push({ msg: "Product already exists" });
        res.render("adminAddProduct", {
          errors,
          name,
          category,
          description,
          price,
          quantity,
          image
        });
      } else {
        const newProduct = new product({
          name,
          category,
          description,
          price,
          quantity,
          image,
        });
        newProduct.save()
        .then((result)=>{
            res.send(result);
            console.log("Product added in DB")
            // req.flash("success_msg", "Product Added");
            res.render("adminAddProduct");
        })
        .catch((err)=>{
            console.log(err);
        });
        res.render("adminAddProduct");
        console.log("Product added in DB")
        // req.flash("success_msg", "Product Added");
      }
    });
  }
};



