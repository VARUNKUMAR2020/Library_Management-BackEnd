const express = require("express");
const router = express.Router();
const {home, createUser, login, forgetpassword, resetPassword} = require("../Controller/authcontroller");

// API's
router.route('/').get(home);
router.route('/create').post(createUser);
router.route('/login').post(login);
router.route('/forgotpassword').post(forgetpassword);
router.route('/reseetPassword').post(resetPassword);
module.exports = router;  