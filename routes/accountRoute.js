const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")


// login view
router.get(
  "/login",
  utilities.handleErrors(accountController.buildLogin)
)

// registration view
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
)

// process registration form
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

module.exports = router
