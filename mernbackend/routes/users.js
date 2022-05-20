const express = require('express');
const router = express.Router();
var multer = require('multer');
var fs = require('fs');
var path = require("path");

// Load User Controller
const userController = require('../controllers/user.controller')
const adminController = require('../controllers/admin.controller')
const { forwardAuthenticated } = require('../config/auth');

//storing multer
const storage = multer.diskStorage({
    destination:function (request, file, callback){
      callback(null, './uploads/images')
    },
  
    filename:function(request, file, callback){
      callback(null, file.fieldname + '-' + Date.now());
    }
  })
  //upload multers
  const upload = multer({
    storage:storage
  })

//Register Routes
// Login Page
router.get('/login', forwardAuthenticated, userController.login);
// Register Page
router.get('/register', forwardAuthenticated, userController.register);

// Register
router.post('/register', userController.registerUser);

// Login
router.post('/login', userController.loginUser);

// Logout
router.get('/logout', userController.logout);

// admin add product
router.post('/listProducts',upload.single('image') ,userController.listProduct);

// verify email
router.get('/verify-login', userController.verifyLogin)

module.exports = router;
