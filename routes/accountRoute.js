const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")

// account management route
router.get("/",utilities.checkLogin,utilities.handleErrors(accountController.buildAccountManagement))


// login view
router.get("/login",utilities.handleErrors(accountController.buildLogin))

// Process the login request
router.post("/login",regValidate.loginRules(),regValidate.checkLoginData,utilities.handleErrors(accountController.accountLogin))

// registration view
router.get("/register",utilities.handleErrors(accountController.buildRegister))

// process registration form
router.post("/register",regValidate.registrationRules(),regValidate.checkRegData,utilities.handleErrors(accountController.registerAccount))

module.exports = router

