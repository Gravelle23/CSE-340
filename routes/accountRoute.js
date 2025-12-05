const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")

// account management route
router.get("/",utilities.checkLogin,utilities.handleErrors(accountController.buildAccountManagement))

// login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Process the login request
router.post("/login",regValidate.loginRules(),regValidate.checkLoginData,utilities.handleErrors(accountController.accountLogin))

// registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// process registration form
router.post("/register",regValidate.registrationRules(),regValidate.checkRegData,utilities.handleErrors(accountController.registerAccount))

// account update view
router.get("/update/:accountId",utilities.checkLogin,utilities.handleErrors(accountController.buildUpdateAccountView))

// process account information update
router.post("/update",utilities.checkLogin,regValidate.updateAccountRules(),regValidate.checkUpdateAccountData,utilities.handleErrors(accountController.updateAccount))

// process password update
router.post("/update-password",utilities.checkLogin,regValidate.updatePasswordRules(),regValidate.checkUpdatePasswordData,utilities.handleErrors(accountController.updatePassword))

// logout route
router.get("/logout",utilities.checkLogin,utilities.handleErrors(accountController.logout))

module.exports = router

